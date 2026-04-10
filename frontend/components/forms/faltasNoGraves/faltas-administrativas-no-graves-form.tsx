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
  Search,
  Briefcase,
  Shield,
} from "lucide-react";
import * as z from "zod";
import { sanitizePayload } from "@/lib/utils";

// Imports de secciones
import { DatosGeneralesNoGravesSection } from "./sections/DatosGeneralesNoGravesSection";
import { EmpleoCargoComisionNoGravesSection } from "./sections/EmpleoCargoComisionNoGravesSection";
import { OrigenProcedimientoNoGravesSection } from "./sections/OrigenProcedimientoNoGravesSection";
import { FaltaCometidaNoGravesSection } from "./sections/FaltaCometidaNoGravesSection";
import { ResolucionNoGravesSection } from "./sections/ResolucionNoGravesSection";
import { TipoSancionNoGravesSection } from "./sections/TipoSancionNoGravesSection";

// ============================================
// SCHEMAS DE VALIDACION - ORGANIZADOS POR SECCION
// ============================================

// 1. Schema para Datos Generales (Servidor Publico)
const datosGeneralesSchema = z.object({
  nombres: z
    .string()
    .min(1, "Ingresa el nombre o nombres del servidor publico"),
  primerApellido: z
    .string()
    .min(1, "Ingresa el primer apellido del servidor publico"),
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
    { message: "Selecciona el sexo del servidor publico" }
  ),
});

// 2. Schema para Empleo, Cargo o Comision
const empleoCargoComisionSchema = z.object({
  empleo_entidadFederativa: z.string().min(1, "Selecciona la entidad federativa"),
  empleo_nivelOrdenGobierno: z.enum(["FEDERAL", "ESTATAL", "MUNICIPAL_ALCALDIA"], {
    message: "Selecciona el nivel u orden de gobierno",
  }),
  empleo_ambitoPublico: z.enum(["EJECUTIVO", "LEGISLATIVO", "JUDICIAL", "ORGANO_AUTONOMO"], {
    message: "Selecciona el ambito publico",
  }),
  empleo_nombreEntePublico: z.string().min(1, "Ingresa el nombre del ente publico"),
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
      "NEGLIGENCIA",
      "ABUSO_FUNCIONES",
      "ACTUACION_CONFLICTO_INTERES",
      "DESACATO",
      "OTRO",
    ],
    {
      message: "Selecciona el tipo de falta cometida por el servidor publico",
    }
  ),
  valor: z.string().nullable().optional(),
  descripcionHechos: z.string().min(10, "La descripcion de los hechos debe tener al menos 10 caracteres"),
  normatividadInfringida: z
    .array(normatividadSchema)
    .min(1, "Debes agregar al menos una normatividad infringida"),
});

// 6. Schema para Resolucion (sin URL ni ordenJurisdiccional)
const resolucionSchema = z.object({
  resolucion_tituloResolucion: z.string().min(1, "Ingresa el titulo del documento de resolucion"),
  resolucion_fechaResolucion: z.string().min(1, "Selecciona la fecha de la resolucion sancionatoria"),
  resolucion_fechaNotificacion: z.string().min(1, "Selecciona la fecha de notificacion de la resolucion"),
  resolucion_fechaResolucionFirme: z.string().min(1, "Selecciona la fecha en que la resolucion adquirio firmeza"),
  resolucion_fechaNotificacionFirme: z.string().min(1, "Selecciona la fecha de notificacion de la resolucion firme"),
  resolucion_fechaEjecucion: z.string().nullable().optional(),
  resolucion_autoridadResolutora: z.string().min(1, "Ingresa el nombre de la autoridad resolutora"),
  resolucion_autoridadInvestigadora: z.string().min(1, "Ingresa el nombre de la autoridad investigadora"),
  resolucion_autoridadSusbstanciadora: z.string().min(1, "Ingresa el nombre de la autoridad substanciadora"),
});

// 7. Schemas para Tipos de Sancion

const amonestacionSchema = z
  .object({
    tipo: z.enum(["PUBLICA", "PRIVADA"], {
      message: "Selecciona el tipo de amonestacion (publica o privada)",
    }),
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
    fechaDestitucion: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

const inhabilitacionSchema = z
  .object({
    plazoAnios: z.number().min(0, "Ingresa los anios del plazo de inhabilitacion"),
    plazoMeses: z.number().min(0, "Ingresa los meses del plazo de inhabilitacion"),
    plazoDias: z.number().min(0, "Ingresa los dias del plazo de inhabilitacion"),
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
      "AMONESTACION",
      "SUSPENSION",
      "DESTITUCION",
      "INHABILITACION",
      "OTRO",
    ],
    {
      message: "Selecciona el tipo de sancion impuesta al servidor publico",
    }
  ),
  amonestacion: amonestacionSchema,
  suspensionEmpleo: suspensionEmpleoSchema,
  destitucionEmpleo: destitucionEmpleoSchema,
  inhabilitacion: inhabilitacionSchema,
  otro: otroSancionSchema,
});

// ============================================
// SCHEMA PRINCIPAL DEL FORMULARIO
// ============================================

const faltasAdministrativasNoGravesSchema = z
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

type FaltasAdministrativasNoGravesFormValues = z.infer<typeof faltasAdministrativasNoGravesSchema>;

interface FaltasAdministrativasNoGravesFormProps {
  initialData: any | null;
}

// ============================================
// FUNCION PARA OBTENER VALORES POR DEFECTO
// ============================================

function getFaltasAdministrativasNoGravesDefaults(
  initialData: any | null,
  entePublico?: string
): Partial<FaltasAdministrativasNoGravesFormValues> {
  return {
    // Campos principales
    entePublico: initialData?.entePublico ?? entePublico ?? "",
    status: initialData?.status ?? "NO_FIRME",
    fecha: initialData?.fecha ?? new Date().toISOString().split("T")[0],
    expediente: initialData?.expediente ?? "",
    observaciones: initialData?.observaciones ?? "",

    // Datos Generales (Servidor Publico)
    nombres: initialData?.datosGenerales?.nombres ?? "",
    primerApellido: initialData?.datosGenerales?.primerApellido ?? "",
    segundoApellido: initialData?.datosGenerales?.segundoApellido ?? null,
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
    resolucion_fechaResolucionFirme: initialData?.resolucion?.fechaResolucionFirme ?? "",
    resolucion_fechaNotificacionFirme: initialData?.resolucion?.fechaNotificacionFirme ?? "",
    resolucion_fechaEjecucion: initialData?.resolucion?.fechaEjecucion ?? null,
    resolucion_autoridadResolutora: initialData?.resolucion?.autoridadResolutora ?? "",
    resolucion_autoridadInvestigadora: initialData?.resolucion?.autoridadInvestigadora ?? "",
    resolucion_autoridadSusbstanciadora: initialData?.resolucion?.autoridadSusbstanciadora ?? "",

    // Tipo de Sancion
    tipoSancion:
      initialData?.tipoSancion?.map((sancion: any) => ({
        clave: sancion.clave ?? "",
        amonestacion: sancion.amonestacion
          ? { tipo: sancion.amonestacion.tipo ?? "" }
          : null,
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
            fechaDestitucion: sancion.destitucionEmpleo.fechaDestitucion ?? null,
          }
          : null,
        inhabilitacion: sancion.inhabilitacion
          ? {
            plazoAnios: sancion.inhabilitacion.plazoAnios ?? 0,
            plazoMeses: sancion.inhabilitacion.plazoMeses ?? 0,
            plazoDias: sancion.inhabilitacion.plazoDias ?? 0,
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
          amonestacion: null,
          suspensionEmpleo: null,
          destitucionEmpleo: null,
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
  empleo_entidadFederativa: { accordionValue: "empleo-cargo-comision", sectionLabel: "4. Empleo, cargo o comision" },
  empleo_nivelOrdenGobierno: { accordionValue: "empleo-cargo-comision", sectionLabel: "4. Empleo, cargo o comision" },
  empleo_ambitoPublico: { accordionValue: "empleo-cargo-comision", sectionLabel: "4. Empleo, cargo o comision" },
  empleo_nombreEntePublico: { accordionValue: "empleo-cargo-comision", sectionLabel: "4. Empleo, cargo o comision" },
  empleo_nivelJerarquico_clave: { accordionValue: "empleo-cargo-comision", sectionLabel: "4. Empleo, cargo o comision" },
  empleo_denominacion: { accordionValue: "empleo-cargo-comision", sectionLabel: "4. Empleo, cargo o comision" },
  empleo_areaAdscripcion: { accordionValue: "empleo-cargo-comision", sectionLabel: "4. Empleo, cargo o comision" },
  // Seccion 5: Origen del procedimiento
  origenProcedimiento_clave: { accordionValue: "origen-procedimiento", sectionLabel: "5. Origen del procedimiento" },
  origenProcedimiento_valor: { accordionValue: "origen-procedimiento", sectionLabel: "5. Origen del procedimiento" },
  // Seccion 6: Falta cometida
  faltaCometida: { accordionValue: "falta-cometida", sectionLabel: "6. Falta cometida" },
  // Seccion 7: Resolucion
  resolucion_tituloResolucion: { accordionValue: "resolucion", sectionLabel: "7. Resolucion" },
  resolucion_fechaResolucion: { accordionValue: "resolucion", sectionLabel: "7. Resolucion" },
  resolucion_fechaNotificacion: { accordionValue: "resolucion", sectionLabel: "7. Resolucion" },
  resolucion_fechaResolucionFirme: { accordionValue: "resolucion", sectionLabel: "7. Resolucion" },
  resolucion_fechaNotificacionFirme: { accordionValue: "resolucion", sectionLabel: "7. Resolucion" },
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

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const FaltasAdministrativasNoGravesForm: React.FC<FaltasAdministrativasNoGravesFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { session } = useCurrentSession();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [errorSummary, setErrorSummary] = useState<{ sectionLabel: string; accordionValue: string; count: number }[]>([]);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const title = initialData
    ? "Actualizar falta administrativa no grave"
    : "Registrar una nueva falta administrativa no grave";
  const description = initialData
    ? "Edita la informacion de la falta administrativa no grave del servidor publico"
    : "Formato que indica los datos que se inscribiran en el Sistema Nacional de Servidores Publicos y Particulares Sancionados de la Plataforma Digital Nacional relacionados con las sanciones firmes impuestas a servidores publicos vinculados con faltas administrativas no graves en terminos de la Ley General de Responsabilidades Administrativas.";
  const toastMessage = initialData
    ? "Falta administrativa no grave actualizada"
    : "Nueva falta administrativa no grave registrada.";
  const action = initialData ? "Actualizar" : "Guardar";

  const defaultValues = useMemo(
    () => getFaltasAdministrativasNoGravesDefaults(initialData, session?.user?.entePublico),
    [initialData, session?.user?.entePublico]
  );

  const form = useForm<FaltasAdministrativasNoGravesFormValues>({
    // resolver: zodResolver(faltasAdministrativasNoGravesSchema), // validaciones desactivadas temporalmente
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      const newDefaults = getFaltasAdministrativasNoGravesDefaults(initialData, session?.user?.entePublico);
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

  const onSubmit = async (rawData: FaltasAdministrativasNoGravesFormValues) => {
    const data = sanitizePayload(rawData) as FaltasAdministrativasNoGravesFormValues;
    try {
      setLoading(true);

      const entePublico = session?.user?.entePublico || data.entePublico || null;
      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error("No se encontro el token de acceso");
      }

      console.log("=== INICIANDO GUARDADO ===");

      // ============================================
      // 1. DATOS GENERALES (Servidor Publico)
      // ============================================
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
          withToken(accessToken, updateItem("datos_generales_no_graves", initialData.datosGenerales.id, datosGeneralesData))
        );
        datosGeneralesId = initialData.datosGenerales.id;
      } else {
        const newDatosGenerales = await directus.request(
          withToken(accessToken, createItem("datos_generales_no_graves", datosGeneralesData))
        );
        datosGeneralesId = newDatosGenerales.id;
      }
      console.log("Datos Generales guardados:", datosGeneralesId);

      // ============================================
      // 2. NIVEL JERARQUICO (M2O dentro de empleoCargoComision)
      // ============================================
      const nivelJerarquicoData = {
        clave: data.empleo_nivelJerarquico_clave,
        valor: data.empleo_nivelJerarquico_clave === "OTRO" ? data.empleo_nivelJerarquico_valor : null,
        entePublico: entePublico,
      };

      let nivelJerarquicoId;
      if (initialData?.empleoCargoComision?.nivelJerarquico?.id) {
        await directus.request(
          withToken(accessToken, updateItem("nivel_jerarquico_no_graves", initialData.empleoCargoComision.nivelJerarquico.id, nivelJerarquicoData))
        );
        nivelJerarquicoId = initialData.empleoCargoComision.nivelJerarquico.id;
      } else {
        const newNivelJerarquico = await directus.request(
          withToken(accessToken, createItem("nivel_jerarquico_no_graves", nivelJerarquicoData))
        );
        nivelJerarquicoId = newNivelJerarquico.id;
      }
      console.log("Nivel Jerarquico guardado:", nivelJerarquicoId);

      // ============================================
      // 3. EMPLEO, CARGO O COMISION
      // ============================================
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
          withToken(accessToken, updateItem("empleo_cargo_comision_no_graves", initialData.empleoCargoComision.id, empleoCargoComisionData))
        );
        empleoCargoComisionId = initialData.empleoCargoComision.id;
      } else {
        const newEmpleoCargoComision = await directus.request(
          withToken(accessToken, createItem("empleo_cargo_comision_no_graves", empleoCargoComisionData))
        );
        empleoCargoComisionId = newEmpleoCargoComision.id;
      }
      console.log("Empleo Cargo Comision guardado:", empleoCargoComisionId);

      // ============================================
      // 4. ORIGEN DEL PROCEDIMIENTO
      // ============================================
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
      }
      console.log("Origen del procedimiento guardado:", origenId);

      // ============================================
      // 5. RESOLUCION
      // ============================================
      const resolucionData = {
        tituloResolucion: data.resolucion_tituloResolucion,
        fechaResolucion: data.resolucion_fechaResolucion,
        fechaNotificacion: data.resolucion_fechaNotificacion,
        fechaResolucionFirme: data.resolucion_fechaResolucionFirme,
        fechaNotificacionFirme: data.resolucion_fechaNotificacionFirme,
        fechaEjecucion: data.resolucion_fechaEjecucion,
        autoridadResolutora: data.resolucion_autoridadResolutora,
        autoridadInvestigadora: data.resolucion_autoridadInvestigadora,
        autoridadSusbstanciadora: data.resolucion_autoridadSusbstanciadora,
        entePublico: entePublico,
      };

      let resolucionId;
      if (initialData?.resolucion?.id) {
        await directus.request(
          withToken(accessToken, updateItem("resolucion_no_graves", initialData.resolucion.id, resolucionData))
        );
        resolucionId = initialData.resolucion.id;
      } else {
        const newResolucion = await directus.request(
          withToken(accessToken, createItem("resolucion_no_graves", resolucionData))
        );
        resolucionId = newResolucion.id;
      }
      console.log("Resolucion guardada:", resolucionId);

      // ============================================
      // 6. REGISTRO PRINCIPAL
      // ============================================
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
          withToken(accessToken, updateItem("faltas_administrativas_no_graves", initialData.id, registroPrincipalData))
        );
        registroPrincipalId = initialData.id;
      } else {
        const newRegistroPrincipal = await directus.request(
          withToken(accessToken, createItem("faltas_administrativas_no_graves", registroPrincipalData))
        );
        registroPrincipalId = newRegistroPrincipal.id;
      }
      console.log("Registro principal guardado:", registroPrincipalId);

      // ============================================
      // 7. FALTAS COMETIDAS (O2M con normatividades anidadas)
      // ============================================
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
            withToken(accessToken, createItem("normatividad_no_graves", normatividadData))
          );
          normatividadesIds.push(newNormatividad.id);
        }

        const faltaData = {
          clave: falta.clave,
          valor: falta.clave === "OTRO" ? falta.valor : null,
          descripcionHechos: falta.descripcionHechos,
          fk_no_graves: registroPrincipalId,
          entePublico: entePublico,
          normatividadInfringida: normatividadesIds,
        };

        await directus.request(
          withToken(accessToken, createItem("falta_cometida_no_graves", faltaData))
        );
      }
      console.log("Faltas cometidas guardadas");

      // ============================================
      // 8. TIPO DE SANCION (O2M)
      // ============================================
      const sancionesFiltradas = (data.tipoSancion ?? []).filter((s: any) => s?.clave);
      for (const sancion of sancionesFiltradas) {
        let amonestacionId = null;
        let suspensionEmpleoId = null;
        let destitucionEmpleoId = null;
        let inhabilitacionId = null;
        let otroId = null;

        switch (sancion.clave) {
          case "AMONESTACION":
            if (sancion.amonestacion) {
              const amonestacionData = {
                tipo: sancion.amonestacion.tipo,
                entePublico: entePublico,
              };
              const newAmonestacion = await directus.request(
                withToken(accessToken, createItem("amonestacion_sancion", amonestacionData))
              );
              amonestacionId = newAmonestacion.id;
            }
            break;

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
            }
            break;
        }

        const tipoSancionData: any = {
          clave: sancion.clave,
          fk_id: registroPrincipalId,
          entePublico: entePublico,
        };

        if (sancion.clave === "AMONESTACION") tipoSancionData.amonestacion = amonestacionId;
        else if (sancion.clave === "SUSPENSION") tipoSancionData.suspensionEmpleo = suspensionEmpleoId;
        else if (sancion.clave === "DESTITUCION") tipoSancionData.destitucionEmpleo = destitucionEmpleoId;
        else if (sancion.clave === "INHABILITACION") tipoSancionData.inhabilitacion = inhabilitacionId;
        else if (sancion.clave === "OTRO") tipoSancionData.otro = otroId;

        await directus.request(
          withToken(accessToken, createItem("tipo_sancion_no_graves", tipoSancionData))
        );
      }
      console.log("Tipos de sancion guardados");

      console.log("=== GUARDADO EXITOSO ===");

      router.refresh();
      router.push("/inicio/faltas-administrativas-no-graves");
      toast({
        variant: "default",
        className: "bg-green-600",
        title: "Exito",
        description: toastMessage,
      });
    } catch (error: any) {
      console.error("=== ERROR AL GUARDAR ===");
      console.error("Error completo:", error);

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
                        Estatus de la resolucion <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormDescription className="text-xs text-muted-foreground italic text-right">
                        Indicar si la resolucion es firme o no firme
                      </FormDescription>
                    </div>

                    <div className="relative overflow-hidden rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-5 shadow-sm backdrop-blur-sm">
                      <div className={`absolute inset-0 transition-opacity duration-300 ${field.value === "FIRME" ? "opacity-100" : "opacity-0"}`}>
                        <div className="absolute right-0 top-0 h-24 w-24 bg-primary/15 rounded-full blur-2xl"></div>
                      </div>
                      <div className={`absolute inset-0 transition-opacity duration-300 ${field.value === "NO_FIRME" ? "opacity-100" : "opacity-0"}`}>
                        <div className="absolute left-0 top-0 h-24 w-24 bg-muted/20 rounded-full blur-2xl"></div>
                      </div>

                      <div className="relative flex items-center justify-between gap-6">
                        <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${field.value === "NO_FIRME" ? "scale-100" : "scale-90 opacity-60"}`}>
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

                        <div className="relative flex items-center justify-center">
                          <div className={`absolute inset-0 rounded-full blur-sm transition-all duration-300 ${field.value === "FIRME" ? "bg-primary/40 scale-125" : "bg-muted/20 scale-100"}`}></div>
                          <FormControl>
                            <Switch
                              checked={field.value === "FIRME"}
                              onCheckedChange={(checked) => field.onChange(checked ? "FIRME" : "NO_FIRME")}
                              disabled={loading}
                              className="data-[state=checked]:bg-primary scale-125 relative z-10"
                            />
                          </FormControl>
                        </div>

                        <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${field.value === "FIRME" ? "scale-100" : "scale-90 opacity-60"}`}>
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
            {renderAccordionSection("datos-generales", "3. Datos generales del servidor publico sancionado", Users, <DatosGeneralesNoGravesSection form={form} loading={loading} />)}
            {renderAccordionSection("empleo-cargo-comision", "4. Empleo, cargo o comision", Briefcase, <EmpleoCargoComisionNoGravesSection form={form} loading={loading} />)}
            {renderAccordionSection("origen-procedimiento", "5. Origen del procedimiento", Search, <OrigenProcedimientoNoGravesSection form={form} loading={loading} />)}
            {renderAccordionSection("falta-cometida", "6. Tipo de falta cometida por el servidor publico", AlertCircle, <FaltaCometidaNoGravesSection form={form} loading={loading} />)}
            {renderAccordionSection("resolucion", "7. Resolucion sancionatoria", FileText, <ResolucionNoGravesSection form={form} loading={loading} />)}
            {renderAccordionSection("tipo-sancion", "8. Tipo de sancion impuesta al servidor publico", Shield, <TipoSancionNoGravesSection form={form} loading={loading} />)}
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
      </FormProvider>
    </>
  );
};
