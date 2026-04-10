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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useMemo, useRef } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import directus from "@/lib/directus";
import { createItem, updateItem, withToken } from "@directus/sdk";
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
} from "lucide-react";
import * as z from "zod";
import { sanitizePayload } from "@/lib/utils";

// Imports de secciones
import { DatosGeneralesPFSection } from "./sections/DatosGeneralesPFSection";
import { DondeCometioFaltaPFSection } from "./sections/DondeCometioFaltaPFSection";
import { OrigenProcedimientoPFSection } from "./sections/OrigenProcedimientoPFSection";
import { FaltaCometidaPFSection } from "./sections/FaltaCometidaPFSection";
import { ResolucionPFSection } from "./sections/ResolucionPFSection";
import { TipoSancionPFSection } from "./sections/TipoSancionPFSection";

// ============================================
// SCHEMAS DE VALIDACION - ORGANIZADOS POR SECCION
// ============================================

// 1. Schema para Datos Generales (Persona Fisica)
const datosGeneralesSchema = z.object({
  nombres: z
    .string()
    .min(1, "Ingresa el nombre o nombres de la persona fisica"),
  primerApellido: z
    .string()
    .min(1, "Ingresa el primer apellido de la persona fisica"),
  segundoApellido: z.string().nullable().optional(),
  curp: z
    .string()
    .min(18, "La CURP debe tener 18 caracteres")
    .max(18, "La CURP debe tener 18 caracteres"),
  rfc: z
    .string()
    .min(12, "El RFC debe tener al menos 12 caracteres incluyendo la homoclave")
    .max(13, "El RFC no puede tener mas de 13 caracteres"),
  tipoDomicilio: z
    .enum(["DOMICILIO_MEXICO", "DOMICILIO_EXTRANJERO"])
    .nullable()
    .optional(),
  // Campos Domicilio Mexico
  tipoVialidad: z.string().nullable().optional(),
  nombreVialidad: z.string().nullable().optional(),
  numeroExterior: z.string().nullable().optional(),
  numeroInterior: z.string().nullable().optional(),
  coloniaLocalidad: z.string().nullable().optional(),
  municipioAlcaldia: z.string().nullable().optional(),
  codigoPostal: z.string().nullable().optional(),
  entidadFederativa: z.string().nullable().optional(),
  // Campos Domicilio Extranjero
  ciudad: z.string().nullable().optional(),
  provincia: z.string().nullable().optional(),
  calle: z.string().nullable().optional(),
  numeroExteriorExtranjero: z.string().nullable().optional(),
  numeroInteriorExtranjero: z.string().nullable().optional(),
  codigoPostalExtranjero: z.string().nullable().optional(),
  pais: z.string().nullable().optional(),
});

// 2. Schema para Donde Cometio la Falta
const dondeCometioFaltaSchema = z.object({
  dondeCometio_entidadFederativa: z.string().min(1, "Selecciona la entidad federativa donde se cometio la falta"),
  dondeCometio_nivelOrdenGobierno: z.enum(["FEDERAL", "ESTATAL", "MUNICIPAL_ALCALDIA"], {
    message: "Selecciona el nivel u orden de gobierno correspondiente",
  }),
  dondeCometio_ambitoPublico: z
    .enum(["EJECUTIVO", "LEGISLATIVO", "JUDICIAL", "ORGANO_AUTONOMO"])
    .nullable()
    .optional(),
  dondeCometio_nombreEntePublico: z.string().nullable().optional(),
  dondeCometio_siglasEntePublico: z.string().nullable().optional(),
});

// 3. Schema para Origen del Procedimiento
const origenProcedimientoSchema = z.object({
  origenProcedimiento_clave: z.enum(
    ["ASF_ENTIDADES_FISCALIZACION", "AUDITORIA_OIC", "DENUNCIA", "DE_OFICIO", "OTRO"],
    {
      message: "Selecciona el origen del procedimiento que dio inicio a la investigacion",
    }
  ),
  origenProcedimiento_valor: z.string().nullable().optional(),
});

// 4. Schema para Normatividad (parte de Falta Cometida)
const normatividadSchema = z.object({
  nombreNormatividad: z.string().min(1, "Selecciona la normatividad infringida del catalogo"),
  articulo: z.string().min(1, "Indica el o los articulos infringidos"),
  fraccion: z.string().nullable().optional(),
});

// 5. Schema para Falta Cometida (Persona Fisica)
const faltaCometidaItemSchema = z.object({
  clave: z.enum(
    [
      "SOBORNO",
      "PARTICIPACION_ILICITA",
      "TRAFICO_INFLUENCIAS",
      "UTILIZACION_INFORMACION_FALSA",
      "COLUSION",
      "OBSTRUCCION_FACULTADES",
      "CONTRATACION_INDEBIDA",
      "USO_INDEBIDO_RECURSOS_PUBLICOS",
      "OTRO",
    ],
    {
      message: "Selecciona el tipo de falta cometida por la persona fisica",
    }
  ),
  valor: z.string().nullable().optional(),
  descripcionHechos: z.string().min(10, "La descripcion de los hechos debe tener al menos 10 caracteres"),
  normatividadInfringida: z
    .array(normatividadSchema)
    .min(1, "Debes agregar al menos una normatividad infringida"),
});

// 6. Schema para Resolucion (Persona Fisica)
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

const inhabilitacionSchema = z
  .object({
    plazoAnios: z.number().min(0, "Ingresa los anios del plazo de inhabilitacion"),
    plazoMeses: z.number().min(0, "Ingresa los meses del plazo").max(11, "Los meses no pueden ser mayor a 11"),
    plazoDias: z.number().min(0, "Ingresa los dias del plazo").max(30, "Los dias no pueden ser mayor a 30"),
    fechaInicial: z.string().min(1, "Selecciona la fecha de inicio de la inhabilitacion"),
    fechaFinal: z.string().min(1, "Selecciona la fecha de termino de la inhabilitacion"),
  })
  .nullable()
  .optional();

const indemnizacionSchema = z
  .object({
    monto: z.number().min(0, "Ingresa el monto de la indemnizacion"),
    moneda: z.enum(["MXN", "USD", "EUR"], {
      message: "Selecciona la moneda de la indemnizacion",
    }),
    fechaPagoTotal: z.string().nullable().optional(),
    plazoPago: plazoPagoSchema,
    efectivamenteCobrada: efectivamenteCobradaSchema,
  })
  .nullable()
  .optional();

const sancionEconomicaSchema = z
  .object({
    monto: z.number().min(0, "Ingresa el monto de la sancion economica"),
    moneda: z.enum(["MXN", "USD", "EUR"], {
      message: "Selecciona la moneda de la sancion economica",
    }),
    fechaPagoTotal: z.string().nullable().optional(),
    plazoPago: plazoPagoSchema,
    efectivamenteCobrada: efectivamenteCobradaSchema,
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
      "INHABILITACION",
      "INDEMNIZACION",
      "SANCION_ECONOMICA",
      "OTRO",
    ],
    {
      message: "Selecciona el tipo de sancion impuesta a la persona fisica",
    }
  ),
  inhabilitacion: inhabilitacionSchema,
  indemnizacion: indemnizacionSchema,
  sancionEconomica: sancionEconomicaSchema,
  otro: otroSancionSchema,
});

// ============================================
// SCHEMA PRINCIPAL DEL FORMULARIO
// ============================================

const faltasGravesPFSchema = z
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
  .merge(dondeCometioFaltaSchema)
  .merge(origenProcedimientoSchema)
  .merge(resolucionSchema);

type FaltasGravesPFFormValues = z.infer<typeof faltasGravesPFSchema>;

interface FaltasGravesPFFormProps {
  initialData: any | null;
}

// ============================================
// FUNCION PARA OBTENER VALORES POR DEFECTO
// ============================================

function getFaltasGravesPFDefaults(
  initialData: any | null,
  entePublico?: string
): Partial<FaltasGravesPFFormValues> {
  return {
    // Campos principales
    entePublico: initialData?.entePublico ?? entePublico ?? "",
    status: initialData?.status ?? "NO_FIRME",
    fecha: initialData?.fecha ?? new Date().toISOString().split("T")[0],
    expediente: initialData?.expediente ?? "",
    observaciones: initialData?.observaciones ?? "",

    // Datos Generales (Persona Fisica)
    nombres: initialData?.datosGenerales?.nombres ?? "",
    primerApellido: initialData?.datosGenerales?.primerApellido ?? "",
    segundoApellido: initialData?.datosGenerales?.segundoApellido ?? null,
    curp: initialData?.datosGenerales?.curp ?? "",
    rfc: initialData?.datosGenerales?.rfc ?? "",
    tipoDomicilio: initialData?.datosGenerales?.tipoDomicilio ?? null,

    // Domicilio Mexico
    tipoVialidad: initialData?.datosGenerales?.domicilioMexico?.tipoVialidad ?? null,
    nombreVialidad: initialData?.datosGenerales?.domicilioMexico?.nombreVialidad ?? null,
    numeroExterior: initialData?.datosGenerales?.domicilioMexico?.numeroExterior ?? null,
    numeroInterior: initialData?.datosGenerales?.domicilioMexico?.numeroInterior ?? null,
    coloniaLocalidad: initialData?.datosGenerales?.domicilioMexico?.coloniaLocalidad ?? null,
    municipioAlcaldia: initialData?.datosGenerales?.domicilioMexico?.municipioAlcaldia ?? null,
    codigoPostal: initialData?.datosGenerales?.domicilioMexico?.codigoPostal ?? null,
    entidadFederativa: initialData?.datosGenerales?.domicilioMexico?.entidadFederativa ?? null,

    // Domicilio Extranjero
    ciudad: initialData?.datosGenerales?.domicilioExtranjero?.ciudad ?? null,
    provincia: initialData?.datosGenerales?.domicilioExtranjero?.provincia ?? null,
    calle: initialData?.datosGenerales?.domicilioExtranjero?.calle ?? null,
    numeroExteriorExtranjero: initialData?.datosGenerales?.domicilioExtranjero?.numeroExterior ?? null,
    numeroInteriorExtranjero: initialData?.datosGenerales?.domicilioExtranjero?.numeroInterior ?? null,
    codigoPostalExtranjero: initialData?.datosGenerales?.domicilioExtranjero?.codigoPostal ?? null,
    pais: initialData?.datosGenerales?.domicilioExtranjero?.pais ?? null,

    // Donde cometio la falta
    dondeCometio_entidadFederativa: initialData?.dondeCometioLaFalta?.entidadFederativa ?? "",
    dondeCometio_nivelOrdenGobierno: initialData?.dondeCometioLaFalta?.nivelOrdenGobierno ?? "",
    dondeCometio_ambitoPublico: initialData?.dondeCometioLaFalta?.ambitoPublico ?? null,
    dondeCometio_nombreEntePublico: initialData?.dondeCometioLaFalta?.nombreEntePublico ?? null,
    dondeCometio_siglasEntePublico: initialData?.dondeCometioLaFalta?.siglasEntePublico ?? "",

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
          })) ??
          [
            {
              nombreNormatividad: "",
              articulo: "",
              fraccion: null,
            },
          ],
      })) ??
      [
        {
          clave: "",
          valor: null,
          descripcionHechos: "",
          normatividadInfringida: [
            {
              nombreNormatividad: "",
              articulo: "",
              fraccion: null,
            },
          ],
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
        inhabilitacion: sancion.inhabilitacion
          ? {
            plazoAnios: sancion.inhabilitacion.plazoAnios ?? 0,
            plazoMeses: sancion.inhabilitacion.plazoMeses ?? 0,
            plazoDias: sancion.inhabilitacion.plazoDias ?? 0,
            fechaInicial: sancion.inhabilitacion.fechaInicial ?? "",
            fechaFinal: sancion.inhabilitacion.fechaFinal ?? "",
          }
          : null,
        indemnizacion: sancion.indemnizacion
          ? {
            monto: sancion.indemnizacion.monto ?? 0,
            moneda: sancion.indemnizacion.moneda ?? "MXN",
            fechaPagoTotal: sancion.indemnizacion.fechaPagoTotal ?? null,
            plazoPago: sancion.indemnizacion.plazoPago
              ? {
                anios: sancion.indemnizacion.plazoPago.anios ?? 0,
                meses: sancion.indemnizacion.plazoPago.meses ?? 0,
                dias: sancion.indemnizacion.plazoPago.dias ?? 0,
              }
              : null,
            efectivamenteCobrada: sancion.indemnizacion.efectivamenteCobrada
              ? {
                monto: sancion.indemnizacion.efectivamenteCobrada.monto ?? 0,
                moneda: sancion.indemnizacion.efectivamenteCobrada.moneda ?? "MXN",
                fechaCobro: sancion.indemnizacion.efectivamenteCobrada.fechaCobro ?? "",
              }
              : null,
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
            efectivamenteCobrada: sancion.sancionEconomica.efectivamenteCobrada
              ? {
                monto: sancion.sancionEconomica.efectivamenteCobrada.monto ?? 0,
                moneda: sancion.sancionEconomica.efectivamenteCobrada.moneda ?? "MXN",
                fechaCobro: sancion.sancionEconomica.efectivamenteCobrada.fechaCobro ?? "",
              }
              : null,
          }
          : null,
        otro: sancion.otro
          ? {
            denominacionSancion: sancion.otro.denominacionSancion ?? "",
          }
          : null,
      })) ??
      [
        {
          clave: "",
          inhabilitacion: null,
          indemnizacion: null,
          sancionEconomica: null,
          otro: null,
        },
      ],
  };
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

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
  tipoDomicilio: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  tipoVialidad: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  nombreVialidad: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  entidadFederativa: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  // Seccion 4: Donde cometio la falta
  dondeCometio_entidadFederativa: { accordionValue: "donde-cometio-falta", sectionLabel: "4. Donde se cometio la falta" },
  dondeCometio_nivelOrdenGobierno: { accordionValue: "donde-cometio-falta", sectionLabel: "4. Donde se cometio la falta" },
  dondeCometio_ambitoPublico: { accordionValue: "donde-cometio-falta", sectionLabel: "4. Donde se cometio la falta" },
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
  // Seccion 8: Tipo de sancion
  tipoSancion: { accordionValue: "tipo-sancion", sectionLabel: "8. Tipo de sancion" },
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

export const FaltasGravesPFForm: React.FC<FaltasGravesPFFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { session } = useCurrentSession();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [errorSummary, setErrorSummary] = useState<{ sectionLabel: string; accordionValue: string; count: number }[]>([]);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const title = initialData
    ? "Actualizar falta grave personas fisicas"
    : "Registrar una nueva falta grave personas fisicas";
  const description = initialData
    ? "Edita la informacion de la falta administrativa grave"
    : "Formato que indica los datos que se inscribiran en el Sistema Nacional de Servidores Publicos y Particulares Sancionados de la Plataforma Digital Nacional relacionados con las sanciones firmes impuestas a particulares (personas fisicas) vinculados con faltas administrativas graves en terminos de la Ley General de Responsabilidades Administrativas.";
  const toastMessage = initialData
    ? "Falta grave actualizada"
    : "Nueva falta grave registrada.";
  const action = initialData ? "Actualizar" : "Guardar";

  const defaultValues = useMemo(
    () => getFaltasGravesPFDefaults(initialData, session?.user?.entePublico),
    [initialData, session?.user?.entePublico]
  );

  const form = useForm<FaltasGravesPFFormValues>({
    // resolver: zodResolver(faltasGravesPFSchema), // validaciones desactivadas temporalmente
    defaultValues,
  });

  // Resetear el formulario cuando initialData cambia (ej: datos cargados async)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (initialData) {
      const newDefaults = getFaltasGravesPFDefaults(initialData, session?.user?.entePublico);
      form.reset(newDefaults);
    }
  }, [initialData]);

  // Manejar errores de validacion al hacer submit
  const onInvalid = (errors: any) => {
    const summary = getErrorSummary(errors);
    setErrorSummary(summary);

    // Auto-abrir secciones con errores
    const sectionsWithErrors = summary.map((s) => s.accordionValue);
    setOpenSections((prev) => {
      const combined = new Set([...prev, ...sectionsWithErrors]);
      return Array.from(combined);
    });

    // Contar errores totales
    const totalErrors = summary.reduce((acc, s) => acc + s.count, 0);

    // Scroll al banner de errores
    setTimeout(() => {
      errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    toast({
      variant: "destructive",
      title: "Formulario incompleto",
      description: `Se encontraron ${totalErrors} campo(s) con errores. Revisa las secciones marcadas.`,
    });
  };

  // Limpiar errores cuando el usuario corrige campos
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

  // Establecer entePublico del usuario logueado
  useEffect(() => {
    if (!initialData && session?.user?.entePublico) {
      form.setValue("entePublico", session.user.entePublico);
    }
  }, [session, initialData, form]);

  // ============================================
  // FUNCION DE GUARDADO
  // ============================================

  const onSubmit = async (rawData: FaltasGravesPFFormValues) => {
    const data = sanitizePayload(rawData) as FaltasGravesPFFormValues;
    try {
      setLoading(true);

      // IMPORTANTE: Tomar entePublico del usuario logueado
      const entePublico = session?.user?.entePublico || data.entePublico || null;
      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error("No se encontro el token de acceso");
      }

      console.log("=== INICIANDO GUARDADO ===");
      console.log("entePublico del usuario:", entePublico);

      // ============================================
      // 1. DOMICILIO MEXICO (si aplica)
      // ============================================
      let domicilioMexicoId = null;
      if (data.tipoDomicilio === "DOMICILIO_MEXICO") {
        const domicilioMexicoData = {
          tipoVialidad: data.tipoVialidad,
          nombreVialidad: data.nombreVialidad,
          numeroExterior: data.numeroExterior,
          numeroInterior: data.numeroInterior,
          coloniaLocalidad: data.coloniaLocalidad,
          municipioAlcaldia: data.municipioAlcaldia,
          codigoPostal: data.codigoPostal,
          entidadFederativa: data.entidadFederativa,
          entePublico: entePublico, // entePublico incluido
        };

        if (initialData?.datosGenerales?.domicilioMexico?.id) {
          await directus.request(
            withToken(
              accessToken,
              updateItem(
                "domicilio_mexico",
                initialData.datosGenerales.domicilioMexico.id,
                domicilioMexicoData
              )
            )
          );
          domicilioMexicoId = initialData.datosGenerales.domicilioMexico.id;
        } else {
          const newDomicilioMexico = await directus.request(
            withToken(accessToken, createItem("domicilio_mexico", domicilioMexicoData))
          );
          domicilioMexicoId = newDomicilioMexico.id;
        }
        console.log("Domicilio Mexico guardado:", domicilioMexicoId);
      }

      // ============================================
      // 2. DOMICILIO EXTRANJERO (si aplica)
      // ============================================
      let domicilioExtranjeroId = null;
      if (data.tipoDomicilio === "DOMICILIO_EXTRANJERO") {
        const domicilioExtranjeroData = {
          ciudad: data.ciudad,
          provincia: data.provincia,
          calle: data.calle,
          numeroExterior: data.numeroExteriorExtranjero,
          numeroInterior: data.numeroInteriorExtranjero,
          codigoPostal: data.codigoPostalExtranjero,
          pais: data.pais,
          entePublico: entePublico, // entePublico incluido
        };

        if (initialData?.datosGenerales?.domicilioExtranjero?.id) {
          await directus.request(
            withToken(
              accessToken,
              updateItem(
                "domicilio_extranjero",
                initialData.datosGenerales.domicilioExtranjero.id,
                domicilioExtranjeroData
              )
            )
          );
          domicilioExtranjeroId = initialData.datosGenerales.domicilioExtranjero.id;
        } else {
          const newDomicilioExtranjero = await directus.request(
            withToken(
              accessToken,
              createItem("domicilio_extranjero", domicilioExtranjeroData)
            )
          );
          domicilioExtranjeroId = newDomicilioExtranjero.id;
        }
        console.log("Domicilio Extranjero guardado:", domicilioExtranjeroId);
      }

      // ============================================
      // 3. DATOS GENERALES (Persona Fisica)
      // ============================================
      const datosGeneralesData = {
        nombres: data.nombres,
        primerApellido: data.primerApellido,
        segundoApellido: data.segundoApellido,
        curp: data.curp,
        rfc: data.rfc,
        tipoDomicilio: data.tipoDomicilio,
        domicilioMexico: domicilioMexicoId,
        domicilioExtranjero: domicilioExtranjeroId,
        entePublico: entePublico, // entePublico incluido
      };

      let datosGeneralesId;
      if (initialData?.datosGenerales?.id) {
        await directus.request(
          withToken(
            accessToken,
            updateItem(
              "datos_generales_personas_fisicas",
              initialData.datosGenerales.id,
              datosGeneralesData
            )
          )
        );
        datosGeneralesId = initialData.datosGenerales.id;
      } else {
        const newDatosGenerales = await directus.request(
          withToken(accessToken, createItem("datos_generales_personas_fisicas", datosGeneralesData))
        );
        datosGeneralesId = newDatosGenerales.id;
      }
      console.log("Datos Generales guardados:", datosGeneralesId);

      // ============================================
      // 4. DONDE COMETIO LA FALTA
      // ============================================
      const dondeCometioData = {
        entidadFederativa: data.dondeCometio_entidadFederativa,
        nivelOrdenGobierno: data.dondeCometio_nivelOrdenGobierno,
        ambitoPublico: data.dondeCometio_ambitoPublico,
        nombreEntePublico: data.dondeCometio_nombreEntePublico,
        siglasEntePublico: data.dondeCometio_siglasEntePublico,
        entePublico: entePublico, // entePublico incluido
      };

      let dondeCometioId;
      if (initialData?.dondeCometioLaFalta?.id) {
        await directus.request(
          withToken(
            accessToken,
            updateItem("donde_cometio_falta", initialData.dondeCometioLaFalta.id, dondeCometioData)
          )
        );
        dondeCometioId = initialData.dondeCometioLaFalta.id;
      } else {
        const newDondeCometio = await directus.request(
          withToken(accessToken, createItem("donde_cometio_falta", dondeCometioData))
        );
        dondeCometioId = newDondeCometio.id;
      }
      console.log("Donde cometio la falta guardado:", dondeCometioId);

      // ============================================
      // 5. ORIGEN DEL PROCEDIMIENTO
      // ============================================
      const origenData = {
        clave: data.origenProcedimiento_clave,
        valor: data.origenProcedimiento_clave === "OTRO" ? data.origenProcedimiento_valor : null,
        entePublico: entePublico, // entePublico incluido
      };

      let origenId;
      if (initialData?.origenProcedimiento?.id) {
        await directus.request(
          withToken(
            accessToken,
            updateItem("origen_procedimiento", initialData.origenProcedimiento.id, origenData)
          )
        );
        origenId = initialData.origenProcedimiento.id;
      } else {
        const newOrigen = await directus.request(
          withToken(accessToken, createItem("origen_procedimiento", origenData))
        );
        origenId = newOrigen.id;
      }
      console.log("Origen del procedimiento guardado:", origenId);

      // ============================================
      // 6. RESOLUCION (Persona Fisica)
      // ============================================
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
        entePublico: entePublico, // entePublico incluido
      };

      let resolucionId;
      if (initialData?.resolucion?.id) {
        await directus.request(
          withToken(accessToken, updateItem("resolucion_fisica", initialData.resolucion.id, resolucionData))
        );
        resolucionId = initialData.resolucion.id;
      } else {
        const newResolucion = await directus.request(
          withToken(accessToken, createItem("resolucion_fisica", resolucionData))
        );
        resolucionId = newResolucion.id;
      }
      console.log("Resolucion guardada:", resolucionId);

      // ============================================
      // 7. REGISTRO PRINCIPAL
      // ============================================
      const registroPrincipalData = {
        entePublico: entePublico, // entePublico incluido
        status: data.status,
        fecha: data.fecha,
        expediente: data.expediente,
        observaciones: data.observaciones,
        datosGenerales: datosGeneralesId,
        dondeCometioLaFalta: dondeCometioId,
        origenProcedimiento: origenId,
        resolucion: resolucionId,
      };

      let registroPrincipalId;
      if (initialData?.id) {
        await directus.request(
          withToken(
            accessToken,
            updateItem("faltas_graves_personas_fisicas", initialData.id, registroPrincipalData)
          )
        );
        registroPrincipalId = initialData.id;
      } else {
        const newRegistroPrincipal = await directus.request(
          withToken(accessToken, createItem("faltas_graves_personas_fisicas", registroPrincipalData))
        );
        registroPrincipalId = newRegistroPrincipal.id;
      }
      console.log("Registro principal guardado:", registroPrincipalId);

      // ============================================
      // 8. FALTAS COMETIDAS (O2M con normatividades anidadas)
      // ============================================
      const faltasFiltradas = (data.faltaCometida ?? []).filter((f: any) => f?.clave);
      for (const falta of faltasFiltradas) {
        const normatividadesIds = [];

        // Guardar cada normatividad infringida (solo las que tengan datos)
        const normsConDatos = (falta.normatividadInfringida ?? []).filter((n: any) => n?.nombreNormatividad || n?.articulo);
        for (const normatividad of normsConDatos) {
          const normatividadData = {
            nombreNormatividad: normatividad.nombreNormatividad,
            articulo: normatividad.articulo,
            fraccion: normatividad.fraccion,
            entePublico: entePublico, // entePublico incluido
          };

          const newNormatividad = await directus.request(
            withToken(accessToken, createItem("normatividad_particulares", normatividadData))
          );
          normatividadesIds.push(newNormatividad.id);
        }

        // Guardar la falta con las normatividades
        const faltaData = {
          clave: falta.clave,
          valor: falta.clave === "OTRO" ? falta.valor : null,
          descripcionHechos: falta.descripcionHechos,
          fk_personas_fisicas: registroPrincipalId,
          entePublico: entePublico, // entePublico incluido
          normatividadInfringida: normatividadesIds,
        };

        await directus.request(
          withToken(accessToken, createItem("falta_cometida_particulares", faltaData))
        );
      }
      console.log("Faltas cometidas guardadas");

      // ============================================
      // 9. TIPO DE SANCION (O2M complejo)
      // ============================================
      const sancionesFiltradas = (data.tipoSancion ?? []).filter((s: any) => s?.clave);
      for (const sancion of sancionesFiltradas) {
        let sancionEspecificaId = null;

        switch (sancion.clave) {
          case "INHABILITACION":
            if (sancion.inhabilitacion) {
              const inhabilitacionData = {
                plazoAnios: sancion.inhabilitacion.plazoAnios,
                plazoMeses: sancion.inhabilitacion.plazoMeses,
                plazoDias: sancion.inhabilitacion.plazoDias,
                fechaInicial: sancion.inhabilitacion.fechaInicial,
                fechaFinal: sancion.inhabilitacion.fechaFinal,
                entePublico: entePublico, // entePublico incluido
              };
              const newInhabilitacion = await directus.request(
                withToken(accessToken, createItem("inhabilitacion", inhabilitacionData))
              );
              sancionEspecificaId = newInhabilitacion.id;
            }
            break;

          case "INDEMNIZACION":
            if (sancion.indemnizacion) {
              // Guardar plazoPago si existe
              let plazoPagoId = null;
              if (sancion.indemnizacion.plazoPago) {
                const plazoPagoData = {
                  anios: sancion.indemnizacion.plazoPago.anios,
                  meses: sancion.indemnizacion.plazoPago.meses,
                  dias: sancion.indemnizacion.plazoPago.dias,
                  entePublico: entePublico, // entePublico incluido
                };
                const newPlazoPago = await directus.request(
                  withToken(accessToken, createItem("plazo_pago_indemnizacion", plazoPagoData))
                );
                plazoPagoId = newPlazoPago.id;
              }

              // Guardar efectivamenteCobrada si existe
              let efectivamenteCobradaId = null;
              if (sancion.indemnizacion.efectivamenteCobrada) {
                const cobradaData = {
                  monto: sancion.indemnizacion.efectivamenteCobrada.monto,
                  moneda: sancion.indemnizacion.efectivamenteCobrada.moneda,
                  fechaCobro: sancion.indemnizacion.efectivamenteCobrada.fechaCobro,
                  entePublico: entePublico, // entePublico incluido
                };
                const newCobrada = await directus.request(
                  withToken(
                    accessToken,
                    createItem("efectivamente_cobrado_indemnizacion", cobradaData)
                  )
                );
                efectivamenteCobradaId = newCobrada.id;
              }

              // Guardar indemnizacion
              const indemnizacionData = {
                monto: sancion.indemnizacion.monto,
                moneda: sancion.indemnizacion.moneda,
                fechaPagoTotal: sancion.indemnizacion.fechaPagoTotal,
                plazoPago: plazoPagoId,
                efectivamenteCobrado: efectivamenteCobradaId,
                entePublico: entePublico, // entePublico incluido
              };
              const newIndemnizacion = await directus.request(
                withToken(accessToken, createItem("indemnizacion", indemnizacionData))
              );
              sancionEspecificaId = newIndemnizacion.id;
            }
            break;

          case "SANCION_ECONOMICA":
            if (sancion.sancionEconomica) {
              // Guardar plazoPago si existe
              let plazoPagoSEId = null;
              if (sancion.sancionEconomica.plazoPago) {
                const plazoPagoSEData = {
                  anios: sancion.sancionEconomica.plazoPago.anios,
                  meses: sancion.sancionEconomica.plazoPago.meses,
                  dias: sancion.sancionEconomica.plazoPago.dias,
                  entePublico: entePublico, // entePublico incluido
                };
                const newPlazoPagoSE = await directus.request(
                  withToken(accessToken, createItem("plazo_pago", plazoPagoSEData))
                );
                plazoPagoSEId = newPlazoPagoSE.id;
              }

              // Guardar efectivamenteCobrada si existe
              let efectivamenteCobradaSEId = null;
              if (sancion.sancionEconomica.efectivamenteCobrada) {
                const cobradaSEData = {
                  monto: sancion.sancionEconomica.efectivamenteCobrada.monto,
                  moneda: sancion.sancionEconomica.efectivamenteCobrada.moneda,
                  fechaCobro: sancion.sancionEconomica.efectivamenteCobrada.fechaCobro,
                  entePublico: entePublico, // entePublico incluido
                };
                const newCobradaSE = await directus.request(
                  withToken(accessToken, createItem("efectivamente_cobrado", cobradaSEData))
                );
                efectivamenteCobradaSEId = newCobradaSE.id;
              }

              // Guardar sancion economica
              const sancionEconomicaData = {
                monto: sancion.sancionEconomica.monto,
                moneda: sancion.sancionEconomica.moneda,
                fechaPagoTotal: sancion.sancionEconomica.fechaPagoTotal,
                plazoPago: plazoPagoSEId,
                efectivamenteCobrado: efectivamenteCobradaSEId,
                entePublico: entePublico, // entePublico incluido
              };
              const newSancionEconomica = await directus.request(
                withToken(accessToken, createItem("sancion_economica", sancionEconomicaData))
              );
              sancionEspecificaId = newSancionEconomica.id;
            }
            break;

          case "OTRO":
            if (sancion.otro) {
              const otroData = {
                denominacionSancion: sancion.otro.denominacionSancion,
                entePublico: entePublico, // entePublico incluido
              };
              const newOtro = await directus.request(
                withToken(accessToken, createItem("otro_sancion", otroData))
              );
              sancionEspecificaId = newOtro.id;
            }
            break;
        }

        // Guardar el registro tipo_sancion con la referencia correspondiente
        const tipoSancionData: any = {
          clave: sancion.clave,
          fk_id: registroPrincipalId,
          entePublico: entePublico, // entePublico incluido
        };

        // Asignar el ID correspondiente segun la clave
        if (sancion.clave === "INHABILITACION")
          tipoSancionData.inhabilitacion = sancionEspecificaId;
        else if (sancion.clave === "INDEMNIZACION")
          tipoSancionData.indemnizacion = sancionEspecificaId;
        else if (sancion.clave === "SANCION_ECONOMICA")
          tipoSancionData.sancionEconomica = sancionEspecificaId;
        else if (sancion.clave === "OTRO") tipoSancionData.otro = sancionEspecificaId;

        await directus.request(
          withToken(accessToken, createItem("tipo_sancion_personas_fisicas", tipoSancionData))
        );
      }
      console.log("Tipos de sancion guardados");

      console.log("=== GUARDADO EXITOSO ===");

      router.refresh();
      router.push("/inicio/faltas-graves-pf");
      toast({
        variant: "default",
        className: "bg-green-600",
        title: "Exito",
        description: toastMessage,
      });
    } catch (error: any) {
      console.error("=== ERROR AL GUARDAR ===");
      console.error("Error completo:", error);
      console.error("Detalles:", {
        message: error.message,
        errors: error.errors,
        response: error.response,
      });

      let errorMessage = "Error al intentar guardar el registro";

      if (error.errors && Array.isArray(error.errors)) {
        errorMessage = error.errors.map((e: any) => e.message).join(", ");
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDER DEL FORMULARIO
  // ============================================

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
                          // Scroll to section
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
              {/* Campo Estatus - Switch con diseno mejorado */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <FormLabel className="text-sm font-semibold text-primary flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        Estatus de la resolucion <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormDescription className="text-xs text-muted-foreground italic text-right">
                        Indicar si la resolucion es firme o no firme
                      </FormDescription>
                    </div>

                    {/* Contenedor del switch con diseno optimizado */}
                    <div className="relative overflow-hidden rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-5 shadow-sm backdrop-blur-sm">
                      {/* Efecto de resplandor sutil */}
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
                          className={`flex flex-col items-center gap-2 transition-all duration-300 ${field.value === "NO_FIRME" ? "scale-100" : "scale-90 opacity-60"
                            }`}
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
                              <div
                                className="h-1 w-1 rounded-full bg-muted-foreground animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              ></div>
                              <div
                                className="h-1 w-1 rounded-full bg-muted-foreground animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              ></div>
                              <div
                                className="h-1 w-1 rounded-full bg-muted-foreground animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              ></div>
                            </div>
                          )}
                        </div>

                        {/* Switch Central */}
                        <div className="relative flex items-center justify-center">
                          <div
                            className={`absolute inset-0 rounded-full blur-sm transition-all duration-300 ${field.value === "FIRME" ? "bg-primary/40 scale-125" : "bg-muted/20 scale-100"
                              }`}
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
                          className={`flex flex-col items-center gap-2 transition-all duration-300 ${field.value === "FIRME" ? "scale-100" : "scale-90 opacity-60"
                            }`}
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
                              <div
                                className="h-1 w-1 rounded-full bg-primary animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              ></div>
                              <div
                                className="h-1 w-1 rounded-full bg-primary animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              ></div>
                              <div
                                className="h-1 w-1 rounded-full bg-primary animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
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
                        <Input type="date" disabled={loading} {...field} className="border-primary/30" />
                      </FormControl>
                      <FormDescription>Fecha en que se realiza el registro</FormDescription>
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
                        2. Numero de expediente <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Ej: EXP-2025-001" {...field} className="border-primary/30" />
                      </FormControl>
                      <FormDescription>Numero de expediente del procedimiento</FormDescription>
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
            {/* Seccion 3: Datos Generales */}
            <AccordionItem
              value="datos-generales"
              data-section="datos-generales"
              className={`rounded-xl border-2 overflow-hidden bg-card/95 backdrop-blur shadow-lg transition-colors ${errorSummary.some(s => s.accordionValue === "datos-generales") ? "border-destructive/40" : "border-primary/20"}`}
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className={`rounded-lg p-2 mr-4 ${errorSummary.some(s => s.accordionValue === "datos-generales") ? "bg-destructive/10" : "bg-primary/10"}`}>
                    <FileText className={`h-5 w-5 ${errorSummary.some(s => s.accordionValue === "datos-generales") ? "text-destructive" : "text-primary"}`} />
                  </div>
                  <span className={`text-left text-lg font-semibold ${errorSummary.some(s => s.accordionValue === "datos-generales") ? "text-destructive" : "text-primary"}`}>
                    3. Datos generales de la persona fisica sancionada
                  </span>
                  {errorSummary.some(s => s.accordionValue === "datos-generales") && (
                    <span className="ml-auto mr-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                      <AlertCircle className="h-3 w-3" />
                      {errorSummary.find(s => s.accordionValue === "datos-generales")?.count} {errorSummary.find(s => s.accordionValue === "datos-generales")?.count === 1 ? "error" : "errores"}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <DatosGeneralesPFSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Seccion 4: Donde cometio la falta */}
            <AccordionItem
              value="donde-cometio-falta"
              data-section="donde-cometio-falta"
              className={`rounded-xl border-2 overflow-hidden bg-card/95 backdrop-blur shadow-lg transition-colors ${errorSummary.some(s => s.accordionValue === "donde-cometio-falta") ? "border-destructive/40" : "border-primary/20"}`}
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className={`rounded-lg p-2 mr-4 ${errorSummary.some(s => s.accordionValue === "donde-cometio-falta") ? "bg-destructive/10" : "bg-primary/10"}`}>
                    <MapPin className={`h-5 w-5 ${errorSummary.some(s => s.accordionValue === "donde-cometio-falta") ? "text-destructive" : "text-primary"}`} />
                  </div>
                  <span className={`text-left text-lg font-semibold ${errorSummary.some(s => s.accordionValue === "donde-cometio-falta") ? "text-destructive" : "text-primary"}`}>
                    4. Datos del Ente publico donde se cometio la falta administrativa
                  </span>
                  {errorSummary.some(s => s.accordionValue === "donde-cometio-falta") && (
                    <span className="ml-auto mr-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                      <AlertCircle className="h-3 w-3" />
                      {errorSummary.find(s => s.accordionValue === "donde-cometio-falta")?.count} {errorSummary.find(s => s.accordionValue === "donde-cometio-falta")?.count === 1 ? "error" : "errores"}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <DondeCometioFaltaPFSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Seccion 5: Origen del procedimiento */}
            <AccordionItem
              value="origen-procedimiento"
              data-section="origen-procedimiento"
              className={`rounded-xl border-2 overflow-hidden bg-card/95 backdrop-blur shadow-lg transition-colors ${errorSummary.some(s => s.accordionValue === "origen-procedimiento") ? "border-destructive/40" : "border-primary/20"}`}
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className={`rounded-lg p-2 mr-4 ${errorSummary.some(s => s.accordionValue === "origen-procedimiento") ? "bg-destructive/10" : "bg-primary/10"}`}>
                    <Search className={`h-5 w-5 ${errorSummary.some(s => s.accordionValue === "origen-procedimiento") ? "text-destructive" : "text-primary"}`} />
                  </div>
                  <span className={`text-left text-lg font-semibold ${errorSummary.some(s => s.accordionValue === "origen-procedimiento") ? "text-destructive" : "text-primary"}`}>
                    5. Origen del procedimiento
                  </span>
                  {errorSummary.some(s => s.accordionValue === "origen-procedimiento") && (
                    <span className="ml-auto mr-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                      <AlertCircle className="h-3 w-3" />
                      {errorSummary.find(s => s.accordionValue === "origen-procedimiento")?.count} {errorSummary.find(s => s.accordionValue === "origen-procedimiento")?.count === 1 ? "error" : "errores"}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <OrigenProcedimientoPFSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Seccion 6: Falta cometida */}
            <AccordionItem
              value="falta-cometida"
              data-section="falta-cometida"
              className={`rounded-xl border-2 overflow-hidden bg-card/95 backdrop-blur shadow-lg transition-colors ${errorSummary.some(s => s.accordionValue === "falta-cometida") ? "border-destructive/40" : "border-primary/20"}`}
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className={`rounded-lg p-2 mr-4 ${errorSummary.some(s => s.accordionValue === "falta-cometida") ? "bg-destructive/10" : "bg-primary/10"}`}>
                    <AlertCircle className={`h-5 w-5 ${errorSummary.some(s => s.accordionValue === "falta-cometida") ? "text-destructive" : "text-primary"}`} />
                  </div>
                  <span className={`text-left text-lg font-semibold ${errorSummary.some(s => s.accordionValue === "falta-cometida") ? "text-destructive" : "text-primary"}`}>
                    6. Tipo de falta cometida por la persona fisica sancionada
                  </span>
                  {errorSummary.some(s => s.accordionValue === "falta-cometida") && (
                    <span className="ml-auto mr-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                      <AlertCircle className="h-3 w-3" />
                      {errorSummary.find(s => s.accordionValue === "falta-cometida")?.count} {errorSummary.find(s => s.accordionValue === "falta-cometida")?.count === 1 ? "error" : "errores"}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <FaltaCometidaPFSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Seccion 7: Resolucion */}
            <AccordionItem
              value="resolucion"
              data-section="resolucion"
              className={`rounded-xl border-2 overflow-hidden bg-card/95 backdrop-blur shadow-lg transition-colors ${errorSummary.some(s => s.accordionValue === "resolucion") ? "border-destructive/40" : "border-primary/20"}`}
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className={`rounded-lg p-2 mr-4 ${errorSummary.some(s => s.accordionValue === "resolucion") ? "bg-destructive/10" : "bg-primary/10"}`}>
                    <FileText className={`h-5 w-5 ${errorSummary.some(s => s.accordionValue === "resolucion") ? "text-destructive" : "text-primary"}`} />
                  </div>
                  <span className={`text-left text-lg font-semibold ${errorSummary.some(s => s.accordionValue === "resolucion") ? "text-destructive" : "text-primary"}`}>
                    7. Resolucion sancionatoria de la falta cometida por la persona fisica
                  </span>
                  {errorSummary.some(s => s.accordionValue === "resolucion") && (
                    <span className="ml-auto mr-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                      <AlertCircle className="h-3 w-3" />
                      {errorSummary.find(s => s.accordionValue === "resolucion")?.count} {errorSummary.find(s => s.accordionValue === "resolucion")?.count === 1 ? "error" : "errores"}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <ResolucionPFSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Seccion 8: Tipo de sancion */}
            <AccordionItem
              value="tipo-sancion"
              data-section="tipo-sancion"
              className={`rounded-xl border-2 overflow-hidden bg-card/95 backdrop-blur shadow-lg transition-colors ${errorSummary.some(s => s.accordionValue === "tipo-sancion") ? "border-destructive/40" : "border-primary/20"}`}
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className={`rounded-lg p-2 mr-4 ${errorSummary.some(s => s.accordionValue === "tipo-sancion") ? "bg-destructive/10" : "bg-primary/10"}`}>
                    <AlertCircle className={`h-5 w-5 ${errorSummary.some(s => s.accordionValue === "tipo-sancion") ? "text-destructive" : "text-primary"}`} />
                  </div>
                  <span className={`text-left text-lg font-semibold ${errorSummary.some(s => s.accordionValue === "tipo-sancion") ? "text-destructive" : "text-primary"}`}>
                    8. Tipo de sancion impuesta a la persona fisica
                  </span>
                  {errorSummary.some(s => s.accordionValue === "tipo-sancion") && (
                    <span className="ml-auto mr-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                      <AlertCircle className="h-3 w-3" />
                      {errorSummary.find(s => s.accordionValue === "tipo-sancion")?.count} {errorSummary.find(s => s.accordionValue === "tipo-sancion")?.count === 1 ? "error" : "errores"}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <TipoSancionPFSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>
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
                      placeholder="Ej: Informacion adicional sobre el caso..."
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    En este espacio podra realizar las aclaraciones u observaciones que considere
                    pertinentes respecto de alguno o algunos de los apartados del documento.
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
      </FormProvider >
    </>
  );
};
