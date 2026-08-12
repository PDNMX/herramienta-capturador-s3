// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, useMemo, useRef } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import directus from "@/lib/directus";
import { createItem, deleteItem, updateItem, withToken } from "@directus/sdk";
import { checkDuplicate } from "@/lib/duplicate-check";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  Clipboard,
  Users,
  MapPin,
  Search,
  Briefcase,
  Shield,
} from "lucide-react";
import * as z from "zod";
import { sanitizePayload } from "@/lib/utils";
import { sanitizeName } from "@/lib/sanitize";

// Imports de secciones
import { DatosGeneralesGravesSection } from "./sections/DatosGeneralesGravesSection";
import { EmpleoCargoComisionGravesSection } from "./sections/EmpleoCargoComisionGravesSection";
import { OrigenProcedimientoGravesSection } from "./sections/OrigenProcedimientoGravesSection";
import { FaltaCometidaGravesSection } from "./sections/FaltaCometidaGravesSection";
import { ResolucionGravesSection } from "./sections/ResolucionGravesSection";
import { TipoSancionGravesSection } from "./sections/TipoSancionGravesSection";

// ============================================
// SCHEMAS DE VALIDACION - ORGANIZADOS POR SECCION
// ============================================

// 1. Schema para Datos Generales (Servidor Publico)
const datosGeneralesSchema = z.object({
  nombres: z
    .string()
    .min(1, "Ingresa el nombre o nombres del servidor público"),
  primerApellido: z
    .string()
    .min(1, "Ingresa el primer apellido del servidor público"),
  segundoApellido: z.string().nullable().optional(),
  curp: z
    .string()
    .min(18, "La CURP debe tener 18 caracteres")
    .max(18, "La CURP debe tener 18 caracteres"),
  rfc: z
    .string()
    .min(12, "El RFC debe tener al menos 12 caracteres incluyendo la homoclave")
    .max(13, "El RFC no puede tener mas de 13 caracteres"),
  sexo: z.enum(
    ["MUJER", "HOMBRE"],
    { message: "Selecciona el sexo del servidor público" }
  ),
});

// 2. Schema para Empleo, Cargo o Comision
const empleoCargoComisionSchema = z.object({
  empleo_entidadFederativa: z.string().min(1, "Selecciona la entidad federativa"),
  empleo_nivelOrdenGobierno: z.enum(["FEDERAL", "ESTATAL", "MUNICIPAL_ALCALDIA"], {
    message: "Selecciona el nivel u orden de gobierno",
  }),
  empleo_ambitoPublico: z.enum(["EJECUTIVO", "LEGISLATIVO", "JUDICIAL", "ORGANO_AUTONOMO"], {
    message: "Selecciona el ambito público",
  }),
  empleo_nombreEntePublico: z.string().min(1, "Ingresa el nombre del Ente público"),
  empleo_siglasEntePublico: z.string().nullable().optional(),
  empleo_nivelJerarquico_clave: z.string().min(1, "Selecciona el nivel jerarquico"),
  empleo_nivelJerarquico_valor: z.string().nullable().optional(),
  empleo_denominacion: z.string().min(1, "Ingresa la denominacion del empleo, cargo o comision"),
  empleo_areaAdscripcion: z.string().min(1, "Ingresa el area de adscripcion"),
});

// 3. Schema para Origen del Procedimiento
const origenProcedimientoSchema = z.object({
  origenProcedimiento_clave: z.enum(
    ["ASF_ENTIDADES_FISCALIZACION", "AUDITORIA_OIC", "DENUNCIA", "DE_OFICIO", "OTRO"],
    {
      message: "Selecciona el origen del procedimiento",
    }
  ),
  origenProcedimiento_valor: z.string().nullable().optional(),
});

// 4. Schema para Normatividad
const normatividadSchema = z.object({
  nombreNormatividad: z.string().min(1, "Selecciona la normatividad infringida"),
  articulo: z.string().min(1, "Indica el o los articulos infringidos"),
  fraccion: z.string().nullable().optional(),
});

// 5. Schema para Falta Cometida
const faltaCometidaItemSchema = z.object({
  clave: z.enum(
    [
      "COHECHO",
      "PECULADO",
      "DESVIO_RECURSOS",
      "UTILIZACION_INDEBIDA_INFORMACION",
      "ABUSO_FUNCIONES",
      "ACTUACION_CONFLICTO_INTERES",
      "CONTRATACION_INDEBIDA",
      "ENRIQUECIMIENTO_OCULTAR_CONFLICTO_INTERES",
      "TRAFICO_INFLUENCIAS",
      "ENCUBRIMIENTO",
      "DESACATO",
      "OBSTRUCCION",
      "OTRO",
    ],
    {
      message: "Selecciona el tipo de falta cometida por el servidor público",
    }
  ),
  valor: z.string().nullable().optional(),
  descripcionHechos: z.string().min(10, "La descripcion de los hechos debe tener al menos 10 caracteres"),
  normatividadInfringida: z
    .array(normatividadSchema)
    .min(1, "Debes agregar al menos una normatividad infringida"),
});

// 6. Schema para Resolucion
const resolucionSchema = z.object({
  resolucion_tituloResolucion: z.string().min(1, "Ingresa el titulo del documento de resolucion"),
  resolucion_fechaResolucion: z.string().min(1, "Selecciona la fecha de la resolucion sancionatoria"),
  resolucion_fechaNotificacion: z.string().min(1, "Selecciona la fecha de notificacion de la resolucion"),
  resolucion_urlResolucion: z.string().url("Ingresa una URL valida (ej: https://ejemplo.gob.mx/resolucion.pdf)"),
  resolucion_fechaResolucionFirme: z.string().min(1, "Selecciona la fecha en que la resolucion adquirio firmeza"),
  resolucion_fechaNotificacionFirme: z.string().min(1, "Selecciona la fecha de notificacion de la resolucion firme"),
  resolucion_urlResolucionFirme: z.string().url("Ingresa una URL valida (ej: https://ejemplo.gob.mx/acuerdo-firme.pdf)"),
  resolucion_fechaEjecucion: z.string().nullable().optional(),
  resolucion_ordenJurisdiccional: z.enum(["FEDERAL", "ESTATAL"], {
    message: "Selecciona el orden jurisdiccional (Federal o Estatal)",
  }),
  resolucion_autoridadResolutora: z.string().min(1, "Ingresa el nombre de la autoridad resolutora"),
  resolucion_autoridadInvestigadora: z.string().min(1, "Ingresa el nombre de la autoridad investigadora"),
  resolucion_autoridadSusbstanciadora: z.string().min(1, "Ingresa el nombre de la autoridad substanciadora"),
});

// 7. Schemas para Tipos de Sancion
const plazoPagoSchema = z
  .object({
    anios: z.number().min(0).optional().nullable(),
    meses: z.number().min(0).max(11).optional().nullable(),
    dias: z.number().min(0).max(30).optional().nullable(),
  })
  .nullable()
  .optional();

const efectivamenteCobradaSchema = z
  .object({
    monto: z.number().min(0).optional().nullable(),
    moneda: z.enum(["MXN", "USD", "EUR"]).optional().nullable(),
    fechaCobro: z.string().optional().nullable(),
  })
  .nullable()
  .optional();

const suspensionEmpleoSchema = z
  .object({
    plazoMeses: z.number().min(0, "Ingresa los meses del plazo de suspension"),
    plazoDias: z.number().min(0, "Ingresa los dias del plazo de suspension"),
    fechaInicial: z.string().min(1, "Selecciona la fecha de inicio de la suspension"),
    fechaFinal: z.string().min(1, "Selecciona la fecha de termino de la suspension"),
  })
  .nullable()
  .optional();

const destitucionEmpleoSchema = z
  .object({
    fechaDestitucion: z.string().min(1, "Selecciona la fecha de destitucion"),
  })
  .nullable()
  .optional();

const sancionEconomicaSchema = z
  .object({
    monto: z.number().min(0, "Ingresa el monto de la sanción económica"),
    moneda: z.enum(["MXN", "USD", "EUR"], {
      message: "Selecciona la moneda de la sanción económica",
    }),
    fechaPagoTotal: z.string().nullable().optional(),
    plazoPago: plazoPagoSchema,
    sancionEfectivamenteCobrada: efectivamenteCobradaSchema,
  })
  .nullable()
  .optional();

const inhabilitacionSchema = z
  .object({
    plazoAnios: z.string().min(1, "Ingresa los anios del plazo de inhabilitacion"),
    plazoMeses: z.string().min(1, "Ingresa los meses del plazo de inhabilitacion"),
    plazoDias: z.string().min(1, "Ingresa los dias del plazo de inhabilitacion"),
    fechaInicial: z.string().min(1, "Selecciona la fecha de inicio de la inhabilitacion"),
    fechaFinal: z.string().min(1, "Selecciona la fecha de termino de la inhabilitacion"),
  })
  .nullable()
  .optional();

const otroSancionSchema = z
  .object({
    denominacionSancion: z.string().min(1, "Ingresa la denominacion de la sancion aplicada"),
  })
  .nullable()
  .optional();

const tipoSancionItemSchema = z.object({
  clave: z.enum(
    [
      "SUSPENSION",
      "DESTITUCION",
      "SANCION_ECONOMICA",
      "INHABILITACION",
      "OTRO",
    ],
    {
      message: "Selecciona el tipo de sancion impuesta al servidor público",
    }
  ),
  suspensionEmpleo: suspensionEmpleoSchema,
  destitucionEmpleo: destitucionEmpleoSchema,
  sancionEconomica: sancionEconomicaSchema,
  inhabilitacion: inhabilitacionSchema,
  otro: otroSancionSchema,
});

// ============================================
// SCHEMA PRINCIPAL DEL FORMULARIO
// ============================================

const faltasAdministrativasGravesSchema = z
  .object({
    // Campos principales
    entePublico: z.string().optional(),
    status: z.enum(["NO_FIRME", "FIRME"], {
      message: "Indica si la resolucion es Firme o No firme",
    }),
    fecha: z.string().min(1, {
      message: "Selecciona la fecha de registro del expediente",
    }),
    expediente: z.string().min(3, {
      message: "Ingresa el numero de expediente (minimo 3 caracteres)",
    }),
    observaciones: z.string().nullable().optional(),

    // Falta Cometida (array)
    faltaCometida: z.array(faltaCometidaItemSchema).min(1, "Debes registrar al menos una falta cometida"),

    // Tipo de Sancion (array)
    tipoSancion: z
      .array(tipoSancionItemSchema)
      .min(1, "Debes registrar al menos un tipo de sancion"),
  })
  .merge(datosGeneralesSchema)
  .merge(empleoCargoComisionSchema)
  .merge(origenProcedimientoSchema)
  .merge(resolucionSchema);

type FaltasAdministrativasGravesFormValues = z.infer<typeof faltasAdministrativasGravesSchema>;

interface FaltasAdministrativasGravesFormProps {
  initialData: any | null;
}

// ============================================
// FUNCION PARA OBTENER VALORES POR DEFECTO
// ============================================

function getFaltasAdministrativasGravesDefaults(
  initialData: any | null,
  entePublico?: string
): Partial<FaltasAdministrativasGravesFormValues> {
  return {
    // Campos principales
    entePublico: initialData?.entePublico ?? entePublico ?? "",
    status: initialData?.status ?? "NO_FIRME",
    fecha: initialData?.fecha ?? new Date().toISOString().split("T")[0],
    expediente: initialData?.expediente ?? "",
    observaciones: initialData?.observaciones ?? "",

    // Datos Generales (Servidor Publico)
    nombres: sanitizeName(initialData?.datosGenerales?.nombres ?? ""),
    primerApellido: sanitizeName(initialData?.datosGenerales?.primerApellido ?? ""),
    segundoApellido: initialData?.datosGenerales?.segundoApellido ? sanitizeName(initialData.datosGenerales.segundoApellido) : null,
    curp: initialData?.datosGenerales?.curp ?? "",
    rfc: initialData?.datosGenerales?.rfc ?? "",
    sexo: initialData?.datosGenerales?.sexo ?? "",

    // Empleo, Cargo o Comision
    empleo_entidadFederativa: initialData?.empleoCargoComision?.entidadFederativa ?? "",
    empleo_nivelOrdenGobierno: initialData?.empleoCargoComision?.nivelOrdenGobierno ?? "",
    empleo_ambitoPublico: initialData?.empleoCargoComision?.ambitoPublico ?? "",
    empleo_nombreEntePublico: initialData?.empleoCargoComision?.nombreEntePublico ?? "",
    empleo_siglasEntePublico: initialData?.empleoCargoComision?.siglasEntePublico ?? "",
    empleo_nivelJerarquico_clave: initialData?.empleoCargoComision?.nivelJerarquico?.clave ?? "",
    empleo_nivelJerarquico_valor: initialData?.empleoCargoComision?.nivelJerarquico?.valor ?? null,
    empleo_denominacion: initialData?.empleoCargoComision?.denominacion ?? "",
    empleo_areaAdscripcion: initialData?.empleoCargoComision?.areaAdscripcion ?? "",

    // Origen del procedimiento
    origenProcedimiento_clave: initialData?.origenProcedimiento?.clave ?? "",
    origenProcedimiento_valor: initialData?.origenProcedimiento?.valor ?? null,

    // Falta Cometida
    faltaCometida:
      initialData?.faltaCometida?.map((falta: any) => ({
        clave: falta.clave ?? "",
        valor: falta.valor ?? null,
        descripcionHechos: falta.descripcionHechos ?? "",
        normatividadInfringida:
          falta.normatividadInfringida?.map((norm: any) => ({
            nombreNormatividad: norm.nombreNormatividad ?? "",
            articulo: norm.articulo ?? "",
            fraccion: norm.fraccion ?? null,
          })) ?? [{ nombreNormatividad: "", articulo: "", fraccion: null }],
      })) ?? [
        {
          clave: "",
          valor: null,
          descripcionHechos: "",
          normatividadInfringida: [{ nombreNormatividad: "", articulo: "", fraccion: null }],
        },
      ],

    // Resolucion
    resolucion_tituloResolucion: initialData?.resolucion?.tituloResolucion ?? "",
    resolucion_fechaResolucion: initialData?.resolucion?.fechaResolucion ?? "",
    resolucion_fechaNotificacion: initialData?.resolucion?.fechaNotificacion ?? "",
    resolucion_urlResolucion: initialData?.resolucion?.urlResolucion ?? "",
    resolucion_fechaResolucionFirme: initialData?.resolucion?.fechaResolucionFirme ?? "",
    resolucion_fechaNotificacionFirme: initialData?.resolucion?.fechaNotificacionFirme ?? "",
    resolucion_urlResolucionFirme: initialData?.resolucion?.urlResolucionFirme ?? "",
    resolucion_fechaEjecucion: initialData?.resolucion?.fechaEjecucion ?? null,
    resolucion_ordenJurisdiccional: initialData?.resolucion?.ordenJurisdiccional ?? "",
    resolucion_autoridadResolutora: initialData?.resolucion?.autoridadResolutora ?? "",
    resolucion_autoridadInvestigadora: initialData?.resolucion?.autoridadInvestigadora ?? "",
    resolucion_autoridadSusbstanciadora: initialData?.resolucion?.autoridadSusbstanciadora ?? "",

    // Tipo de Sancion
    tipoSancion:
      initialData?.tipoSancion?.map((sancion: any) => ({
        clave: sancion.clave ?? "",
        suspensionEmpleo: sancion.suspensionEmpleo
          ? {
            plazoMeses: sancion.suspensionEmpleo.plazoMeses ?? 0,
            plazoDias: sancion.suspensionEmpleo.plazoDias ?? 0,
            fechaInicial: sancion.suspensionEmpleo.fechaInicial ?? "",
            fechaFinal: sancion.suspensionEmpleo.fechaFinal ?? "",
          }
          : null,
        destitucionEmpleo: sancion.destitucionEmpleo
          ? {
            fechaDestitucion: sancion.destitucionEmpleo.fechaDestitucion ?? "",
          }
          : null,
        sancionEconomica: sancion.sancionEconomica
          ? {
            monto: sancion.sancionEconomica.monto ?? 0,
            moneda: sancion.sancionEconomica.moneda ?? "MXN",
            fechaPagoTotal: sancion.sancionEconomica.fechaPagoTotal ?? null,
            plazoPago: sancion.sancionEconomica.plazoPago
              ? {
                anios: sancion.sancionEconomica.plazoPago.anios ?? 0,
                meses: sancion.sancionEconomica.plazoPago.meses ?? 0,
                dias: sancion.sancionEconomica.plazoPago.dias ?? 0,
              }
              : null,
            sancionEfectivamenteCobrada: sancion.sancionEconomica.sancionEfectivamenteCobrada
              ? {
                monto: sancion.sancionEconomica.sancionEfectivamenteCobrada.monto ?? 0,
                moneda: sancion.sancionEconomica.sancionEfectivamenteCobrada.moneda ?? "MXN",
                fechaCobro: sancion.sancionEconomica.sancionEfectivamenteCobrada.fechaCobro ?? "",
              }
              : null,
          }
          : null,
        inhabilitacion: sancion.inhabilitacion
          ? {
            plazoAnios: sancion.inhabilitacion.plazoAnios ?? "",
            plazoMeses: sancion.inhabilitacion.plazoMeses ?? "",
            plazoDias: sancion.inhabilitacion.plazoDias ?? "",
            fechaInicial: sancion.inhabilitacion.fechaInicial ?? "",
            fechaFinal: sancion.inhabilitacion.fechaFinal ?? "",
          }
          : null,
        otro: sancion.otro
          ? { denominacionSancion: sancion.otro.denominacionSancion ?? "" }
          : null,
      })) ?? [
        {
          clave: "",
          suspensionEmpleo: null,
          destitucionEmpleo: null,
          sancionEconomica: null,
          inhabilitacion: null,
          otro: null,
        },
      ],
  };
}

// ============================================
// MAPEO DE CAMPOS A SECCIONES DEL ACORDEON
// ============================================

const FIELD_TO_SECTION_MAP: Record<string, { accordionValue: string; sectionLabel: string }> = {
  // Seccion 3: Datos Generales
  nombres: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  primerApellido: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  segundoApellido: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  curp: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  rfc: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  sexo: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  // Seccion 4: Empleo, Cargo o Comision
  empleo_entidadFederativa: { accordionValue: "empleo-cargo-comision", sectionLabel: "4. Datos del empleo, cargo o comisión de la persona servidora pública sancionada" },
  empleo_nivelOrdenGobierno: { accordionValue: "empleo-cargo-comision", sectionLabel: "4. Datos del empleo, cargo o comisión de la persona servidora pública sancionada" },
  empleo_ambitoPublico: { accordionValue: "empleo-cargo-comision", sectionLabel: "4. Datos del empleo, cargo o comisión de la persona servidora pública sancionada" },
  empleo_nombreEntePublico: { accordionValue: "empleo-cargo-comision", sectionLabel: "4. Datos del empleo, cargo o comisión de la persona servidora pública sancionada" },
  empleo_nivelJerarquico_clave: { accordionValue: "empleo-cargo-comision", sectionLabel: "4. Datos del empleo, cargo o comisión de la persona servidora pública sancionada" },
  empleo_denominacion: { accordionValue: "empleo-cargo-comision", sectionLabel: "4. Datos del empleo, cargo o comisión de la persona servidora pública sancionada" },
  empleo_areaAdscripcion: { accordionValue: "empleo-cargo-comision", sectionLabel: "4. Datos del empleo, cargo o comisión de la persona servidora pública sancionada" },
  // Seccion 5: Origen del procedimiento
  origenProcedimiento_clave: { accordionValue: "origen-procedimiento", sectionLabel: "5. Origen del procedimiento" },
  origenProcedimiento_valor: { accordionValue: "origen-procedimiento", sectionLabel: "5. Origen del procedimiento" },
  // Seccion 6: Falta cometida
  faltaCometida: { accordionValue: "falta-cometida", sectionLabel: "6. Falta cometida" },
  // Seccion 7: Resolucion
  resolucion_tituloResolucion: { accordionValue: "resolucion", sectionLabel: "7. Resolucion" },
  resolucion_fechaResolucion: { accordionValue: "resolucion", sectionLabel: "7. Resolucion" },
  resolucion_fechaNotificacion: { accordionValue: "resolucion", sectionLabel: "7. Resolucion" },
  resolucion_urlResolucion: { accordionValue: "resolucion", sectionLabel: "7. Resolucion" },
  resolucion_fechaResolucionFirme: { accordionValue: "resolucion", sectionLabel: "7. Resolucion" },
  resolucion_fechaNotificacionFirme: { accordionValue: "resolucion", sectionLabel: "7. Resolucion" },
  resolucion_urlResolucionFirme: { accordionValue: "resolucion", sectionLabel: "7. Resolucion" },
  resolucion_ordenJurisdiccional: { accordionValue: "resolucion", sectionLabel: "7. Resolucion" },
  resolucion_autoridadResolutora: { accordionValue: "resolucion", sectionLabel: "7. Resolucion" },
  resolucion_autoridadInvestigadora: { accordionValue: "resolucion", sectionLabel: "7. Resolucion" },
  resolucion_autoridadSusbstanciadora: { accordionValue: "resolucion", sectionLabel: "7. Resolucion" },
  // Seccion 8: Tipo de sanción
  tipoSancion: { accordionValue: "tipo-sancion", sectionLabel: "8. Tipo de sanción" },
};

function getErrorSummary(errors: Record<string, any>): { sectionLabel: string; accordionValue: string; count: number }[] {
  const sectionErrors = new Map<string, { sectionLabel: string; accordionValue: string; count: number }>();

  function countFieldErrors(obj: any, prefix = ""): number {
    let count = 0;
    if (!obj) return 0;
    if (obj.message) return 1;
    for (const key of Object.keys(obj)) {
      if (key === "ref" || key === "type") continue;
      const val = obj[key];
      if (typeof val === "object" && val !== null) {
        count += countFieldErrors(val, prefix ? `${prefix}.${key}` : key);
      }
    }
    return count;
  }

  for (const fieldName of Object.keys(errors)) {
    const mapping = FIELD_TO_SECTION_MAP[fieldName];
    if (mapping) {
      const errCount = countFieldErrors(errors[fieldName]);
      const existing = sectionErrors.get(mapping.accordionValue);
      if (existing) {
        existing.count += errCount;
      } else {
        sectionErrors.set(mapping.accordionValue, {
          sectionLabel: mapping.sectionLabel,
          accordionValue: mapping.accordionValue,
          count: errCount,
        });
      }
    }
  }

  return Array.from(sectionErrors.values());
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const FaltasAdministrativasGravesForm: React.FC<FaltasAdministrativasGravesFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { session } = useCurrentSession();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [errorSummary, setErrorSummary] = useState<{ sectionLabel: string; accordionValue: string; count: number }[]>([]);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const title = initialData
    ? "Actualizar falta administrativa grave"
    : "Registrar una nueva falta administrativa grave";
  const description = initialData
    ? "Edita la informacion de la falta administrativa grave del servidor público"
    : "Formato que indica los datos que se inscribirán en el Sistema nacional de Servidores públicos y particulares sancionados de la Plataforma Digital Nacional relacionados con las sanciones firmes impuestas a personas servidoras públicas por la comisión de faltas administrativas graves en términos de la Ley General de Responsabilidades Administrativas.";
  const toastMessage = initialData
    ? "Falta administrativa grave actualizada"
    : "Nueva falta administrativa grave registrada.";
  const action = initialData ? "Actualizar" : "Guardar";

  const defaultValues = useMemo(
    () => getFaltasAdministrativasGravesDefaults(initialData, session?.user?.entePublico),
    [initialData, session?.user?.entePublico]
  );

  const form = useForm<FaltasAdministrativasGravesFormValues>({
    // resolver: zodResolver(faltasAdministrativasGravesSchema), // validaciones desactivadas temporalmente
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      const newDefaults = getFaltasAdministrativasGravesDefaults(initialData, session?.user?.entePublico);
      form.reset(newDefaults);
    }
  }, [initialData]);

  const onInvalid = (errors: any) => {
    const summary = getErrorSummary(errors);
    setErrorSummary(summary);

    const sectionsWithErrors = summary.map((s) => s.accordionValue);
    setOpenSections((prev) => {
      const combined = new Set([...prev, ...sectionsWithErrors]);
      return Array.from(combined);
    });

    const totalErrors = summary.reduce((acc, s) => acc + s.count, 0);

    setTimeout(() => {
      errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    toast({
      variant: "destructive",
      title: "Formulario incompleto",
      description: `Se encontraron ${totalErrors} campo(s) con errores. Revisa las secciones marcadas.`,
    });
  };

  useEffect(() => {
    const subscription = form.watch(() => {
      if (errorSummary.length > 0) {
        const currentErrors = form.formState.errors;
        const newSummary = getErrorSummary(currentErrors);
        if (newSummary.length === 0) {
          setErrorSummary([]);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, errorSummary.length]);

  useEffect(() => {
    if (!initialData && session?.user?.entePublico) {
      form.setValue("entePublico", session.user.entePublico);
    }
  }, [session, initialData, form]);

  // ============================================
  // FUNCION DE GUARDADO
  // ============================================

  const onSubmit = async (rawData: FaltasAdministrativasGravesFormValues) => {
    const data = sanitizePayload(rawData) as FaltasAdministrativasGravesFormValues;
    const accessToken = session?.access_token;
    const createdRecords: Array<{ collection: string; id: number | string }> = [];
    let currentStep = "verificando datos";

    try {
      setLoading(true);

      const entePublico = session?.user?.entePublico || data.entePublico || null;

      if (!accessToken) {
        throw new Error("No se encontro el token de acceso");
      }

      // ============================================
      // VERIFICACIÓN DE DUPLICADOS
      // ============================================
      if (!initialData?.id) {
        const { isDuplicate } = await checkDuplicate(
          "faltas_administrativas_graves",
          data.expediente,
          data.rfc,
          accessToken,
          data.curp
        );
        if (isDuplicate) {
          toast({
            variant: "destructive",
            title: "Registro duplicado",
            description:
              "Ya existe un registro con la misma persona (CURP y RFC) y el mismo número de expediente. No se permite capturar sanciones duplicadas.",
          });
          setLoading(false);
          return;
        }
      }

      console.log("=== INICIANDO GUARDADO ===");

      // ============================================
      // 1. DATOS GENERALES (Servidor Publico)
      // ============================================
      currentStep = "datos generales del servidor público";
      const datosGeneralesData = {
        nombres: data.nombres,
        primerApellido: data.primerApellido,
        segundoApellido: data.segundoApellido,
        curp: data.curp,
        rfc: data.rfc,
        sexo: data.sexo,
        entePublico: entePublico,
      };

      let datosGeneralesId;
      if (initialData?.datosGenerales?.id) {
        await directus.request(
          withToken(accessToken, updateItem("datos_generales_graves", initialData.datosGenerales.id, datosGeneralesData))
        );
        datosGeneralesId = initialData.datosGenerales.id;
      } else {
        const newDatosGenerales = await directus.request(
          withToken(accessToken, createItem("datos_generales_graves", datosGeneralesData))
        );
        datosGeneralesId = newDatosGenerales.id;
        createdRecords.push({ collection: "datos_generales_graves", id: datosGeneralesId });
      }
      console.log("Datos Generales guardados:", datosGeneralesId);

      // ============================================
      // 2. NIVEL JERARQUICO (M2O dentro de empleoCargoComision)
      // ============================================
      currentStep = "nivel jerárquico";
      const nivelJerarquicoData = {
        clave: data.empleo_nivelJerarquico_clave,
        valor: data.empleo_nivelJerarquico_clave === "OTRO" ? data.empleo_nivelJerarquico_valor : null,
        entePublico: entePublico,
      };

      let nivelJerarquicoId;
      if (initialData?.empleoCargoComision?.nivelJerarquico?.id) {
        await directus.request(
          withToken(accessToken, updateItem("nivel_jerarquico_graves", initialData.empleoCargoComision.nivelJerarquico.id, nivelJerarquicoData))
        );
        nivelJerarquicoId = initialData.empleoCargoComision.nivelJerarquico.id;
      } else {
        const newNivelJerarquico = await directus.request(
          withToken(accessToken, createItem("nivel_jerarquico_graves", nivelJerarquicoData))
        );
        nivelJerarquicoId = newNivelJerarquico.id;
        createdRecords.push({ collection: "nivel_jerarquico_graves", id: nivelJerarquicoId });
      }
      console.log("Nivel Jerarquico guardado:", nivelJerarquicoId);

      // ============================================
      // 3. EMPLEO, CARGO O COMISION
      // ============================================
      currentStep = "empleo, cargo o comisión";
      const empleoCargoComisionData = {
        entidadFederativa: data.empleo_entidadFederativa,
        nivelOrdenGobierno: data.empleo_nivelOrdenGobierno,
        ambitoPublico: data.empleo_ambitoPublico,
        nombreEntePublico: data.empleo_nombreEntePublico,
        siglasEntePublico: data.empleo_siglasEntePublico,
        nivelJerarquico: nivelJerarquicoId,
        denominacion: data.empleo_denominacion,
        areaAdscripcion: data.empleo_areaAdscripcion,
        entePublico: entePublico,
      };

      let empleoCargoComisionId;
      if (initialData?.empleoCargoComision?.id) {
        await directus.request(
          withToken(accessToken, updateItem("empleo_cargo_comision_graves", initialData.empleoCargoComision.id, empleoCargoComisionData))
        );
        empleoCargoComisionId = initialData.empleoCargoComision.id;
      } else {
        const newEmpleoCargoComision = await directus.request(
          withToken(accessToken, createItem("empleo_cargo_comision_graves", empleoCargoComisionData))
        );
        empleoCargoComisionId = newEmpleoCargoComision.id;
        createdRecords.push({ collection: "empleo_cargo_comision_graves", id: empleoCargoComisionId });
      }
      console.log("Empleo Cargo Comision guardado:", empleoCargoComisionId);

      // ============================================
      // 4. ORIGEN DEL PROCEDIMIENTO
      // ============================================
      currentStep = "origen del procedimiento";
      const origenData = {
        clave: data.origenProcedimiento_clave,
        valor: data.origenProcedimiento_clave === "OTRO" ? data.origenProcedimiento_valor : null,
        entePublico: entePublico,
      };

      let origenId;
      if (initialData?.origenProcedimiento?.id) {
        await directus.request(
          withToken(accessToken, updateItem("origen_procedimiento", initialData.origenProcedimiento.id, origenData))
        );
        origenId = initialData.origenProcedimiento.id;
      } else {
        const newOrigen = await directus.request(
          withToken(accessToken, createItem("origen_procedimiento", origenData))
        );
        origenId = newOrigen.id;
        createdRecords.push({ collection: "origen_procedimiento", id: origenId });
      }
      console.log("Origen del procedimiento guardado:", origenId);

      // ============================================
      // 5. RESOLUCION
      // ============================================
      currentStep = "resolución";
      const resolucionData = {
        tituloResolucion: data.resolucion_tituloResolucion,
        fechaResolucion: data.resolucion_fechaResolucion,
        fechaNotificacion: data.resolucion_fechaNotificacion,
        urlResolucion: data.resolucion_urlResolucion,
        fechaResolucionFirme: data.resolucion_fechaResolucionFirme,
        fechaNotificacionFirme: data.resolucion_fechaNotificacionFirme,
        urlResolucionFirme: data.resolucion_urlResolucionFirme,
        fechaEjecucion: data.resolucion_fechaEjecucion,
        ordenJurisdiccional: data.resolucion_ordenJurisdiccional,
        autoridadResolutora: data.resolucion_autoridadResolutora,
        autoridadInvestigadora: data.resolucion_autoridadInvestigadora,
        autoridadSusbstanciadora: data.resolucion_autoridadSusbstanciadora,
        entePublico: entePublico,
      };

      let resolucionId;
      if (initialData?.resolucion?.id) {
        await directus.request(
          withToken(accessToken, updateItem("resolucion", initialData.resolucion.id, resolucionData))
        );
        resolucionId = initialData.resolucion.id;
      } else {
        const newResolucion = await directus.request(
          withToken(accessToken, createItem("resolucion", resolucionData))
        );
        resolucionId = newResolucion.id;
        createdRecords.push({ collection: "resolucion", id: resolucionId });
      }
      console.log("Resolucion guardada:", resolucionId);

      // ============================================
      // 6. REGISTRO PRINCIPAL
      // ============================================
      currentStep = "registro principal";
      const registroPrincipalData = {
        entePublico: entePublico,
        status: data.status,
        fecha: data.fecha,
        expediente: data.expediente,
        observaciones: data.observaciones,
        datosGenerales: datosGeneralesId,
        empleoCargoComision: empleoCargoComisionId,
        origenProcedimiento: origenId,
        resolucion: resolucionId,
      };

      let registroPrincipalId;
      if (initialData?.id) {
        await directus.request(
          withToken(accessToken, updateItem("faltas_administrativas_graves", initialData.id, registroPrincipalData))
        );
        registroPrincipalId = initialData.id;
      } else {
        const newRegistroPrincipal = await directus.request(
          withToken(accessToken, createItem("faltas_administrativas_graves", registroPrincipalData))
        );
        registroPrincipalId = newRegistroPrincipal.id;
        createdRecords.push({ collection: "faltas_administrativas_graves", id: registroPrincipalId });
      }
      console.log("Registro principal guardado:", registroPrincipalId);

      // ============================================
      // 7. FALTAS COMETIDAS (O2M con normatividades anidadas)
      // ============================================
      currentStep = "faltas cometidas";
      const faltasFiltradas = (data.faltaCometida ?? []).filter((f: any) => f?.clave);
      for (const falta of faltasFiltradas) {
        const normatividadesIds = [];

        const normsConDatos = (falta.normatividadInfringida ?? []).filter((n: any) => n?.nombreNormatividad || n?.articulo);
        for (const normatividad of normsConDatos) {
          const normatividadData = {
            nombreNormatividad: normatividad.nombreNormatividad,
            articulo: normatividad.articulo,
            fraccion: normatividad.fraccion,
            entePublico: entePublico,
          };

          const newNormatividad = await directus.request(
            withToken(accessToken, createItem("normatividad_graves", normatividadData))
          );
          normatividadesIds.push(newNormatividad.id);
          createdRecords.push({ collection: "normatividad_graves", id: newNormatividad.id });
        }

        const faltaData = {
          clave: falta.clave,
          valor: falta.clave === "OTRO" ? falta.valor : null,
          descripcionHechos: falta.descripcionHechos,
          fk_graves: registroPrincipalId,
          entePublico: entePublico,
          normatividadInfringida: normatividadesIds,
        };

        const newFalta = await directus.request(
          withToken(accessToken, createItem("falta_cometida_graves", faltaData))
        );
        createdRecords.push({ collection: "falta_cometida_graves", id: newFalta.id });
      }
      console.log("Faltas cometidas guardadas");

      // ============================================
      // 8. TIPO DE SANCION (O2M complejo)
      // ============================================
      currentStep = "tipo de sanción";
      const sancionesFiltradas = (data.tipoSancion ?? []).filter((s: any) => s?.clave);
      for (const sancion of sancionesFiltradas) {
        let suspensionEmpleoId = null;
        let destitucionEmpleoId = null;
        let sancionEconomicaId = null;
        let inhabilitacionId = null;
        let otroId = null;

        switch (sancion.clave) {
          case "SUSPENSION":
            if (sancion.suspensionEmpleo) {
              const suspensionData = {
                plazoMeses: sancion.suspensionEmpleo.plazoMeses,
                plazoDias: sancion.suspensionEmpleo.plazoDias,
                fechaInicial: sancion.suspensionEmpleo.fechaInicial,
                fechaFinal: sancion.suspensionEmpleo.fechaFinal,
                entePublico: entePublico,
              };
              const newSuspension = await directus.request(
                withToken(accessToken, createItem("suspension_empleo", suspensionData))
              );
              suspensionEmpleoId = newSuspension.id;
              createdRecords.push({ collection: "suspension_empleo", id: suspensionEmpleoId });
            }
            break;

          case "DESTITUCION":
            if (sancion.destitucionEmpleo) {
              const destitucionData = {
                fechaDestitucion: sancion.destitucionEmpleo.fechaDestitucion,
                entePublico: entePublico,
              };
              const newDestitucion = await directus.request(
                withToken(accessToken, createItem("destitucion_empleo", destitucionData))
              );
              destitucionEmpleoId = newDestitucion.id;
              createdRecords.push({ collection: "destitucion_empleo", id: destitucionEmpleoId });
            }
            break;

          case "SANCION_ECONOMICA":
            if (sancion.sancionEconomica) {
              let plazoPagoId = null;
              if (sancion.sancionEconomica.plazoPago) {
                const plazoPagoData = {
                  anios: sancion.sancionEconomica.plazoPago.anios,
                  meses: sancion.sancionEconomica.plazoPago.meses,
                  dias: sancion.sancionEconomica.plazoPago.dias,
                  entePublico: entePublico,
                };
                const newPlazoPago = await directus.request(
                  withToken(accessToken, createItem("plazo_pago", plazoPagoData))
                );
                plazoPagoId = newPlazoPago.id;
                createdRecords.push({ collection: "plazo_pago", id: plazoPagoId });
              }

              let efectivamenteCobradaId = null;
              if (sancion.sancionEconomica.sancionEfectivamenteCobrada) {
                const cobradaData = {
                  monto: sancion.sancionEconomica.sancionEfectivamenteCobrada.monto,
                  moneda: sancion.sancionEconomica.sancionEfectivamenteCobrada.moneda,
                  fechaCobro: sancion.sancionEconomica.sancionEfectivamenteCobrada.fechaCobro,
                  entePublico: entePublico,
                };
                const newCobrada = await directus.request(
                  withToken(accessToken, createItem("efectivamente_cobrado", cobradaData))
                );
                efectivamenteCobradaId = newCobrada.id;
                createdRecords.push({ collection: "efectivamente_cobrado", id: efectivamenteCobradaId });
              }

              const sancionEconomicaData = {
                monto: sancion.sancionEconomica.monto,
                moneda: sancion.sancionEconomica.moneda,
                fechaPagoTotal: sancion.sancionEconomica.fechaPagoTotal,
                plazoPago: plazoPagoId,
                efectivamenteCobrado: efectivamenteCobradaId,
                entePublico: entePublico,
              };
              const newSancionEconomica = await directus.request(
                withToken(accessToken, createItem("sancion_economica", sancionEconomicaData))
              );
              sancionEconomicaId = newSancionEconomica.id;
              createdRecords.push({ collection: "sancion_economica", id: sancionEconomicaId });
            }
            break;

          case "INHABILITACION":
            if (sancion.inhabilitacion) {
              const inhabilitacionData = {
                plazoAnios: sancion.inhabilitacion.plazoAnios,
                plazoMeses: sancion.inhabilitacion.plazoMeses,
                plazoDias: sancion.inhabilitacion.plazoDias,
                fechaInicial: sancion.inhabilitacion.fechaInicial,
                fechaFinal: sancion.inhabilitacion.fechaFinal,
                entePublico: entePublico,
              };
              const newInhabilitacion = await directus.request(
                withToken(accessToken, createItem("inhabilitacion", inhabilitacionData))
              );
              inhabilitacionId = newInhabilitacion.id;
              createdRecords.push({ collection: "inhabilitacion", id: inhabilitacionId });
            }
            break;

          case "OTRO":
            if (sancion.otro) {
              const otroData = {
                denominacionSancion: sancion.otro.denominacionSancion,
                entePublico: entePublico,
              };
              const newOtro = await directus.request(
                withToken(accessToken, createItem("otro_sancion", otroData))
              );
              otroId = newOtro.id;
              createdRecords.push({ collection: "otro_sancion", id: otroId });
            }
            break;
        }

        const tipoSancionData: any = {
          clave: sancion.clave,
          fk_id: registroPrincipalId,
          entePublico: entePublico,
        };

        if (sancion.clave === "SUSPENSION") tipoSancionData.suspensionEmpleo = suspensionEmpleoId;
        else if (sancion.clave === "DESTITUCION") tipoSancionData.destitucionEmpleo = destitucionEmpleoId;
        else if (sancion.clave === "SANCION_ECONOMICA") tipoSancionData.sancionEconomica = sancionEconomicaId;
        else if (sancion.clave === "INHABILITACION") tipoSancionData.inhabilitacion = inhabilitacionId;
        else if (sancion.clave === "OTRO") tipoSancionData.otro = otroId;

        const newTipoSancion = await directus.request(
          withToken(accessToken, createItem("tipo_sancion_graves", tipoSancionData))
        );
        createdRecords.push({ collection: "tipo_sancion_graves", id: newTipoSancion.id });
      }
      console.log("Tipos de sancion guardados");

      console.log("=== GUARDADO EXITOSO ===");

      router.push("/inicio/faltas-administrativas-graves");
      toast({
        variant: "default",
        className: "bg-green-600",
        title: "Exito",
        description: toastMessage,
      });
    } catch (error: any) {
      console.error("=== ERROR AL GUARDAR ===", error);

      // Revertir todos los registros creados en este intento
      if (accessToken && createdRecords.length > 0) {
        console.log("Revirtiendo", createdRecords.length, "registros creados...");
        for (const record of [...createdRecords].reverse()) {
          try {
            await directus.request(withToken(accessToken, deleteItem(record.collection, record.id)));
          } catch (e) {
            console.error(`Error al revertir ${record.collection}:${record.id}`, e);
          }
        }
      }

      const FIELD_LABELS: Record<string, string> = {
        nombres: "Nombre(s)",
        primerApellido: "Primer apellido",
        segundoApellido: "Segundo apellido",
      };
      let errorDetail = "";
      if (error.errors && Array.isArray(error.errors)) {
        errorDetail = error.errors.map((e: any) => {
          const match = e.message?.match(/field\s+"?(\w+)"?/i);
          const field = match?.[1];
          if (field && FIELD_LABELS[field] && e.message?.includes("correct format")) {
            return `${FIELD_LABELS[field]}: solo se permiten letras, espacios y guiones`;
          }
          return e.message;
        }).join(". ");
      } else if (error.message) {
        errorDetail = error.message;
      }

      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: `Falló en: ${currentStep}. ${errorDetail}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDER DEL FORMULARIO
  // ============================================

  const renderAccordionSection = (value: string, label: string, icon: any, children: React.ReactNode) => {
    const Icon = icon;
    const hasError = errorSummary.some(s => s.accordionValue === value);
    const errorCount = errorSummary.find(s => s.accordionValue === value)?.count;

    return (
      <AccordionItem
        value={value}
        data-section={value}
        className={`rounded-xl border-2 overflow-hidden bg-card/95 backdrop-blur shadow-lg transition-colors ${hasError ? "border-destructive/40" : "border-primary/20"}`}
      >
        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
          <div className="flex items-center w-full">
            <div className={`rounded-lg p-2 mr-4 ${hasError ? "bg-destructive/10" : "bg-primary/10"}`}>
              <Icon className={`h-5 w-5 ${hasError ? "text-destructive" : "text-primary"}`} />
            </div>
            <span className={`text-left text-lg font-semibold ${hasError ? "text-destructive" : "text-primary"}`}>
              {label}
            </span>
            {hasError && (
              <span className="ml-auto mr-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                <AlertCircle className="h-3 w-3" />
                {errorCount} {errorCount === 1 ? "error" : "errores"}
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6 pt-2">
          {children}
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Heading title={title} description={description} />
      </div>
      <Separator className="my-6" />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
          {/* Leyenda de campos obligatorios */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-4 py-2.5 border border-muted">
            <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>Los campos marcados con <span className="text-destructive font-semibold">*</span> son obligatorios.</span>
          </div>

          {/* Banner de resumen de errores */}
          {errorSummary.length > 0 && (
            <div
              ref={errorBannerRef}
              className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-5 shadow-md animate-in fade-in-0 slide-in-from-top-2 duration-300"
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-8 w-8 rounded-full bg-destructive/15 flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-destructive mb-1">
                    No se pudo guardar el formulario
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Revisa y completa los campos obligatorios en las siguientes secciones:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {errorSummary.map((section) => (
                      <button
                        key={section.accordionValue}
                        type="button"
                        onClick={() => {
                          setOpenSections((prev) => {
                            const combined = new Set([...prev, section.accordionValue]);
                            return Array.from(combined);
                          });
                          setTimeout(() => {
                            const el = document.querySelector(`[data-section="${section.accordionValue}"]`);
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                          }, 150);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors cursor-pointer"
                      >
                        <span>{section.sectionLabel}</span>
                        <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                          {section.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorSummary([])}
                  className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Cerrar"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Campos: Estatus, Fecha y Expediente */}
          <div className="rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg">
            <div className="space-y-6">
              {/* Campo Estatus - Switch */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <FormLabel className="text-sm font-semibold text-primary flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        Estatus de la resolución <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormDescription className="text-xs text-muted-foreground italic text-right">
                        Indicar si la resolución es firme o no firme
                      </FormDescription>
                    </div>

                    <div className="relative overflow-hidden rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-5 shadow-sm backdrop-blur-sm">
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${field.value === "FIRME" ? "opacity-100" : "opacity-0"}`}
                      >
                        <div className="absolute right-0 top-0 h-24 w-24 bg-primary/15 rounded-full blur-2xl"></div>
                      </div>
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${field.value === "NO_FIRME" ? "opacity-100" : "opacity-0"}`}
                      >
                        <div className="absolute left-0 top-0 h-24 w-24 bg-muted/20 rounded-full blur-2xl"></div>
                      </div>

                      <div className="relative flex items-center justify-between gap-6">
                        {/* Estado NO FIRME */}
                        <div
                          className={`flex flex-col items-center gap-2 transition-all duration-300 ${field.value === "NO_FIRME" ? "scale-100" : "scale-90 opacity-60"}`}
                        >
                          <Badge
                            variant={field.value === "NO_FIRME" ? "default" : "outline"}
                            className={`px-3 py-1.5 text-sm font-semibold transition-all duration-300 ${field.value === "NO_FIRME"
                              ? "bg-muted text-muted-foreground shadow-md ring-2 ring-muted/50 ring-offset-1 ring-offset-background"
                              : "border-dashed"
                              }`}
                          >
                            <XCircle className="mr-1.5 h-4 w-4" />
                            No Firme
                          </Badge>
                          {field.value === "NO_FIRME" && (
                            <div className="flex gap-1">
                              <div className="h-1 w-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }}></div>
                              <div className="h-1 w-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }}></div>
                              <div className="h-1 w-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                          )}
                        </div>

                        {/* Switch Central */}
                        <div className="relative flex items-center justify-center">
                          <div
                            className={`absolute inset-0 rounded-full blur-sm transition-all duration-300 ${field.value === "FIRME" ? "bg-primary/40 scale-125" : "bg-muted/20 scale-100"}`}
                          ></div>
                          <FormControl>
                            <Switch
                              checked={field.value === "FIRME"}
                              onCheckedChange={(checked) => field.onChange(checked ? "FIRME" : "NO_FIRME")}
                              disabled={loading}
                              className="data-[state=checked]:bg-primary scale-125 relative z-10"
                            />
                          </FormControl>
                        </div>

                        {/* Estado FIRME */}
                        <div
                          className={`flex flex-col items-center gap-2 transition-all duration-300 ${field.value === "FIRME" ? "scale-100" : "scale-90 opacity-60"}`}
                        >
                          <Badge
                            variant={field.value === "FIRME" ? "default" : "outline"}
                            className={`px-3 py-1.5 text-sm font-semibold transition-all duration-300 ${field.value === "FIRME"
                              ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/50 ring-offset-1 ring-offset-background"
                              : "border-dashed"
                              }`}
                          >
                            <CheckCircle2 className="mr-1.5 h-4 w-4" />
                            Firme
                          </Badge>
                          {field.value === "FIRME" && (
                            <div className="flex gap-1">
                              <div className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
                              <div className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></div>
                              <div className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-start gap-3 p-3 rounded-lg border text-sm transition-all duration-300 ${
                      field.value === "FIRME"
                        ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900"
                        : "bg-muted/40 border-muted"
                    }`}>
                      <div className="mt-0.5 flex-shrink-0">
                        {field.value === "FIRME" ? (
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed ${field.value === "FIRME" ? "text-green-800 dark:text-green-200" : "text-muted-foreground"}`}>
                        {field.value === "FIRME"
                          ? "Este registro será publicado en la Plataforma Digital Nacional y estará disponible públicamente una vez guardado."
                          : "Este registro no será visible en la Plataforma Digital Nacional. Permanecerá en el sistema interno hasta que la resolución adquiera firmeza."}
                      </p>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-4" />

              {/* Campos Fecha y Expediente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-primary flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        1. Fecha de registro (DD-MM-AAAA) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <DatePicker value={field.value} onChange={field.onChange} onBlur={field.onBlur} disabled={loading} />
                      </FormControl>
                      <FormDescription>Indicar la fecha en la que se registra la información</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expediente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-primary flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        2. Expediente <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Ej: EXP-2025-001" {...field} className="border-primary/30" />
                      </FormControl>
                      <FormDescription>Registrar el número de expediente, en el que recae la resolución</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Acordeon con todas las secciones */}
          <Accordion
            type="multiple"
            value={openSections}
            onValueChange={setOpenSections}
            className="w-full space-y-4"
          >
            {renderAccordionSection("datos-generales", "3.  Datos generales de la persona servidora pública sancionada", Users, <DatosGeneralesGravesSection form={form} loading={loading} />)}
            {renderAccordionSection("empleo-cargo-comision", "4. Datos del empleo, cargo o comisión de la persona servidora pública sancionada", Briefcase, <EmpleoCargoComisionGravesSection form={form} loading={loading} />)}
            {renderAccordionSection("origen-procedimiento", "5. Origen del procedimiento", Search, <OrigenProcedimientoGravesSection form={form} loading={loading} />)}
            {renderAccordionSection("falta-cometida", "6. Tipo de falta cometida por la persona servidora pública sancionada", AlertCircle, <FaltaCometidaGravesSection form={form} loading={loading} />)}
            {renderAccordionSection("resolucion", "7. Resolución sancionatoria de la falta cometida por la persona servidora pública", FileText, <ResolucionGravesSection form={form} loading={loading} />)}
            {renderAccordionSection("tipo-sancion", "8. Tipo de sanción impuesta a la persona servidora pública", Shield, <TipoSancionGravesSection form={form} loading={loading} />)}
          </Accordion>

          {/* Campo 9: Observaciones */}
          <div className="rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg">
            <div className="flex items-center mb-6">
              <div className="bg-primary/10 rounded-lg p-2 mr-4">
                <Clipboard className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-primary">9. Observaciones</h3>
            </div>

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Ej: Información adicional sobre el caso..."
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    En este espacio se podrán realizar las aclaraciones u observaciones que se consideren pertinentes respecto de alguno o algunos de los apartados del Formato.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Botones de accion */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              className="h-12 px-6"
            >
              Cancelar
            </Button>
            <Button disabled={loading} type="submit" className="h-12 px-6">
              {action}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};
