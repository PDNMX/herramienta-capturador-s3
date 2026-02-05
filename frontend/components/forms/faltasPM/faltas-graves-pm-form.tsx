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

// Imports de secciones
import { DatosGeneralesPMSection } from "./sections/DatosGeneralesPMSection";
import { DatosDirGeneralPMSection } from "./sections/DatosDirGeneralPMSection";
import { DondeCometioFaltaSection } from "./sections/DondeCometioFaltaSection";
import { OrigenProcedimientoSection } from "./sections/OrigenProcedimientoSection";
import { FaltaCometidaSection } from "./sections/FaltaCometidaSection";
import { ResolucionSection } from "./sections/ResolucionSection";
import { TipoSancionSection } from "./sections/TipoSancionSection";

// ============================================
// SCHEMAS DE VALIDACIÓN - ORGANIZADOS POR SECCIÓN
// ============================================

// 1. Schema para Datos Generales
const datosGeneralesSchema = z.object({
  nombreRazonSocial: z
    .string()
    .min(3, "La denominación o razón social debe tener al menos 3 caracteres"),
  rfc: z
    .string()
    .min(12, "El RFC debe tener al menos 12 caracteres incluyendo la homoclave")
    .max(13, "El RFC no puede tener más de 13 caracteres"),
  objetoSocial: z.string().optional(),
  tipoDomicilio: z
    .enum(["DOMICILIO_MEXICO", "DOMICILIO_EXTRANJERO"])
    .nullable()
    .optional(),
  // Campos Domicilio México
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

// 2. Schema para Representantes (Director General y Representante Legal)
const datosRepresentanteSchema = z.object({
  nombre: z.string().min(1, "Ingresa el nombre de la persona"),
  primerApellido: z.string().min(1, "Ingresa el primer apellido de la persona"),
  segundoApellido: z.string().nullable().optional(),
  rfc: z.string().nullable().optional(),
  curp: z.string().nullable().optional(),
});

// 3. Schema para Donde Cometió la Falta
const dondeCometioFaltaSchema = z.object({
  dondeCometio_entidadFederativa: z.string().min(1, "Selecciona la entidad federativa donde se cometió la falta"),
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

// 4. Schema para Origen del Procedimiento
const origenProcedimientoSchema = z.object({
  origenProcedimiento_clave: z.enum(
    ["ASF_ENTIDADES_FISCALIZACION", "AUDITORIA_OIC", "DENUNCIA", "DE_OFICIO", "OTRO"],
    {
      message: "Selecciona el origen del procedimiento que dio inicio a la investigación",
    }
  ),
  origenProcedimiento_valor: z.string().nullable().optional(),
});

// 5. Schema para Normatividad (parte de Falta Cometida)
const normatividadSchema = z.object({
  nombreNormatividad: z.string().min(1, "Selecciona la normatividad infringida del catálogo"),
  articulo: z.string().min(1, "Indica el o los artículos infringidos"),
  fraccion: z.string().nullable().optional(),
});

// 6. Schema para Falta Cometida
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
      message: "Selecciona el tipo de falta cometida por la persona moral",
    }
  ),
  valor: z.string().nullable().optional(),
  descripcionHechos: z.string().min(10, "La descripción de los hechos debe tener al menos 10 caracteres"),
  normatividadInfringida: z
    .array(normatividadSchema)
    .min(1, "Debes agregar al menos una normatividad infringida"),
});

// 7. Schema para Resolución
const resolucionSchema = z.object({
  resolucion_tituloResolucion: z.string().min(1, "Ingresa el título del documento de resolución"),
  resolucion_fechaResolucion: z.string().min(1, "Selecciona la fecha de la resolución sancionatoria"),
  resolucion_fechaNotificacion: z.string().min(1, "Selecciona la fecha de notificación de la resolución"),
  resolucion_urlResolucion: z.string().url("Ingresa una URL válida (ej: https://ejemplo.gob.mx/resolucion.pdf)"),
  resolucion_fechaResolucionFirme: z.string().min(1, "Selecciona la fecha en que la resolución adquirió firmeza"),
  resolucion_fechaNotificacionFirme: z.string().min(1, "Selecciona la fecha de notificación de la resolución firme"),
  resolucion_urlResolucionFirme: z.string().url("Ingresa una URL válida (ej: https://ejemplo.gob.mx/acuerdo-firme.pdf)"),
  resolucion_fechaEjecucion: z.string().nullable().optional(),
  resolucion_ordenJurisdiccional: z.enum(["FEDERAL", "ESTATAL"], {
    message: "Selecciona el orden jurisdiccional (Federal o Estatal)",
  }),
  resolucion_autoridadResolutora: z.string().min(1, "Ingresa el nombre de la autoridad resolutora"),
  resolucion_autoridadInvestigadora: z.string().min(1, "Ingresa el nombre de la autoridad investigadora"),
  resolucion_autoridadSusbstanciadora: z.string().min(1, "Ingresa el nombre de la autoridad substanciadora"),
});

// 8. Schemas para Tipos de Sanción
const plazoPagoSchema = z
  .object({
    anios: z.number().min(0).optional().nullable(),
    meses: z.number().min(0).max(11).optional().nullable(),
    dias: z.number().min(0).max(30).optional().nullable(),
  })
  .nullable()
  .optional();

const efectivamenteCobradoSchema = z
  .object({
    monto: z.number().min(0).optional().nullable(),
    moneda: z.enum(["MXN", "USD", "EUR"]).optional().nullable(),
    fechaCobro: z.string().optional().nullable(),
  })
  .nullable()
  .optional();

const inhabilitacionSchema = z
  .object({
    plazoAnios: z.number().min(0, "Ingresa los años del plazo de inhabilitación"),
    plazoMeses: z.number().min(0, "Ingresa los meses del plazo").max(11, "Los meses no pueden ser mayor a 11"),
    plazoDias: z.number().min(0, "Ingresa los días del plazo").max(30, "Los días no pueden ser mayor a 30"),
    fechaInicial: z.string().min(1, "Selecciona la fecha de inicio de la inhabilitación"),
    fechaFinal: z.string().min(1, "Selecciona la fecha de término de la inhabilitación"),
  })
  .nullable()
  .optional();

const indemnizacionSchema = z
  .object({
    monto: z.number().min(0, "Ingresa el monto de la indemnización"),
    moneda: z.enum(["MXN", "USD", "EUR"], {
      message: "Selecciona la moneda de la indemnización",
    }),
    fechaPagoTotal: z.string().nullable().optional(),
    plazoPago: plazoPagoSchema,
    efectivamenteCobrado: efectivamenteCobradoSchema,
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
    efectivamenteCobrado: efectivamenteCobradoSchema,
  })
  .nullable()
  .optional();

const suspensionActividadesSchema = z
  .object({
    plazoSuspensionAnios: z.number().min(0, "Ingresa los años del plazo de suspensión"),
    plazoSuspensionMeses: z.number().min(0, "Ingresa los meses del plazo").max(11, "Los meses no pueden ser mayor a 11"),
    plazoSuspensionDias: z.number().min(0, "Ingresa los días del plazo").max(30, "Los días no pueden ser mayor a 30"),
    fechaInicial: z.string().nullable().optional(),
    fechaFinal: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

const disolucionSociedadSchema = z
  .object({
    fechaDisolucion: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

const otroSancionSchema = z
  .object({
    denominacionSancion: z.string().min(1, "Ingresa la denominación de la sanción aplicada"),
  })
  .nullable()
  .optional();

const tipoSancionItemSchema = z.object({
  clave: z.enum(
    [
      "INHABILITACION",
      "INDEMNIZACION",
      "SANCION_ECONOMICA",
      "SUSPENSION_ACTIVIDADES",
      "DISOLUCION_SOCIEDAD",
      "OTRO",
    ],
    {
      message: "Selecciona el tipo de sanción impuesta a la persona moral",
    }
  ),
  inhabilitacion: inhabilitacionSchema,
  indemnizacion: indemnizacionSchema,
  sancionEconomica: sancionEconomicaSchema,
  suspensionActividades: suspensionActividadesSchema,
  disolucionSociedad: disolucionSociedadSchema,
  otro: otroSancionSchema,
});

// ============================================
// SCHEMA PRINCIPAL DEL FORMULARIO
// ============================================

const faltasGravesPMSchema = z
  .object({
    // Campos principales
    entePublico: z.string().optional(),
    status: z.enum(["NO_FIRME", "FIRME"], {
      message: "Indica si la resolución es Firme o No firme",
    }),
    fecha: z.string().min(1, {
      message: "Selecciona la fecha de registro del expediente",
    }),
    expediente: z.string().min(3, {
      message: "Ingresa el número de expediente (mínimo 3 caracteres)",
    }),
    observaciones: z.string().nullable().optional(),

    // Director General y Representante Legal
    directorGeneral: datosRepresentanteSchema,
    representanteLegal: datosRepresentanteSchema,

    // Falta Cometida (array)
    faltaCometida: z.array(faltaCometidaItemSchema).min(1, "Debes registrar al menos una falta cometida"),

    // Tipo de Sanción (array)
    tipoSancion: z
      .array(tipoSancionItemSchema)
      .min(1, "Debes registrar al menos un tipo de sanción"),
  })
  .merge(datosGeneralesSchema)
  .merge(dondeCometioFaltaSchema)
  .merge(origenProcedimientoSchema)
  .merge(resolucionSchema);

type FaltasGravesPMFormValues = z.infer<typeof faltasGravesPMSchema>;

interface FaltasGravesPMFormProps {
  initialData: any | null;
}

// ============================================
// FUNCIÓN PARA OBTENER VALORES POR DEFECTO
// ============================================

function getFaltasGravesPMDefaults(
  initialData: any | null,
  entePublico?: string
): Partial<FaltasGravesPMFormValues> {
  return {
    // Campos principales
    entePublico: initialData?.entePublico ?? entePublico ?? "",
    status: initialData?.status ?? "NO_FIRME",
    fecha: initialData?.fecha ?? new Date().toISOString().split("T")[0],
    expediente: initialData?.expediente ?? "",
    observaciones: initialData?.observaciones ?? "",

    // Datos Generales
    nombreRazonSocial: initialData?.datosGenerales?.nombreRazonSocial ?? "",
    rfc: initialData?.datosGenerales?.rfc ?? "",
    objetoSocial: initialData?.datosGenerales?.objetoSocial ?? "",
    tipoDomicilio: initialData?.datosGenerales?.tipoDomicilio ?? null,

    // Domicilio México
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

    // Director General
    directorGeneral: {
      nombre: initialData?.datosDirGeneralReprLegal?.directorGeneral?.nombre ?? "",
      primerApellido: initialData?.datosDirGeneralReprLegal?.directorGeneral?.primerApellido ?? "",
      segundoApellido: initialData?.datosDirGeneralReprLegal?.directorGeneral?.segundoApellido ?? null,
      rfc: initialData?.datosDirGeneralReprLegal?.directorGeneral?.rfc ?? null,
      curp: initialData?.datosDirGeneralReprLegal?.directorGeneral?.curp ?? null,
    },

    // Representante Legal
    representanteLegal: {
      nombre: initialData?.datosDirGeneralReprLegal?.representanteLegal?.nombre ?? "",
      primerApellido:
        initialData?.datosDirGeneralReprLegal?.representanteLegal?.primerApellido ?? "",
      segundoApellido:
        initialData?.datosDirGeneralReprLegal?.representanteLegal?.segundoApellido ?? null,
      rfc: initialData?.datosDirGeneralReprLegal?.representanteLegal?.rfc ?? null,
      curp: initialData?.datosDirGeneralReprLegal?.representanteLegal?.curp ?? null,
    },

    // Donde cometió la falta
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

    // Resolución
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

    // Tipo de Sanción
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
            efectivamenteCobrado: sancion.indemnizacion.efectivamenteCobrado
              ? {
                monto: sancion.indemnizacion.efectivamenteCobrado.monto ?? 0,
                moneda: sancion.indemnizacion.efectivamenteCobrado.moneda ?? "MXN",
                fechaCobro: sancion.indemnizacion.efectivamenteCobrado.fechaCobro ?? "",
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
            efectivamenteCobrado: sancion.sancionEconomica.efectivamenteCobrado
              ? {
                monto: sancion.sancionEconomica.efectivamenteCobrado.monto ?? 0,
                moneda: sancion.sancionEconomica.efectivamenteCobrado.moneda ?? "MXN",
                fechaCobro: sancion.sancionEconomica.efectivamenteCobrado.fechaCobro ?? "",
              }
              : null,
          }
          : null,
        suspensionActividades: sancion.suspensionActividades
          ? {
            plazoSuspensionAnios: sancion.suspensionActividades.plazoSuspensionAnios ?? 0,
            plazoSuspensionMeses: sancion.suspensionActividades.plazoSuspensionMeses ?? 0,
            plazoSuspensionDias: sancion.suspensionActividades.plazoSuspensionDias ?? 0,
            fechaInicial: sancion.suspensionActividades.fechaInicial ?? "",
            fechaFinal: sancion.suspensionActividades.fechaFinal ?? "",
          }
          : null,
        disolucionSociedad: sancion.disolucionSociedad
          ? {
            fechaDisolucion: sancion.disolucionSociedad.fechaDisolucion ?? "",
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
          suspensionActividades: null,
          disolucionSociedad: null,
          otro: null,
        },
      ],
  };
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

// ============================================
// MAPEO DE CAMPOS A SECCIONES DEL ACORDEÓN
// ============================================

const FIELD_TO_SECTION_MAP: Record<string, { accordionValue: string; sectionLabel: string }> = {
  // Sección 3: Datos Generales
  nombreRazonSocial: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  rfc: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  objetoSocial: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  tipoDomicilio: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  tipoVialidad: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  nombreVialidad: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  entidadFederativa: { accordionValue: "datos-generales", sectionLabel: "3. Datos generales" },
  // Sección 4: Director General / Representante Legal
  directorGeneral: { accordionValue: "datos-dir-general", sectionLabel: "4. Director general y representante legal" },
  representanteLegal: { accordionValue: "datos-dir-general", sectionLabel: "4. Director general y representante legal" },
  // Sección 5: Donde cometió la falta
  dondeCometio_entidadFederativa: { accordionValue: "donde-cometio-falta", sectionLabel: "5. Donde se cometió la falta" },
  dondeCometio_nivelOrdenGobierno: { accordionValue: "donde-cometio-falta", sectionLabel: "5. Donde se cometió la falta" },
  dondeCometio_ambitoPublico: { accordionValue: "donde-cometio-falta", sectionLabel: "5. Donde se cometió la falta" },
  // Sección 6: Origen del procedimiento
  origenProcedimiento_clave: { accordionValue: "origen-procedimiento", sectionLabel: "6. Origen del procedimiento" },
  origenProcedimiento_valor: { accordionValue: "origen-procedimiento", sectionLabel: "6. Origen del procedimiento" },
  // Sección 7: Falta cometida
  faltaCometida: { accordionValue: "falta-cometida", sectionLabel: "7. Falta cometida" },
  // Sección 8: Resolución
  resolucion_tituloResolucion: { accordionValue: "resolucion", sectionLabel: "8. Resolución" },
  resolucion_fechaResolucion: { accordionValue: "resolucion", sectionLabel: "8. Resolución" },
  resolucion_fechaNotificacion: { accordionValue: "resolucion", sectionLabel: "8. Resolución" },
  resolucion_urlResolucion: { accordionValue: "resolucion", sectionLabel: "8. Resolución" },
  resolucion_fechaResolucionFirme: { accordionValue: "resolucion", sectionLabel: "8. Resolución" },
  resolucion_fechaNotificacionFirme: { accordionValue: "resolucion", sectionLabel: "8. Resolución" },
  resolucion_urlResolucionFirme: { accordionValue: "resolucion", sectionLabel: "8. Resolución" },
  resolucion_ordenJurisdiccional: { accordionValue: "resolucion", sectionLabel: "8. Resolución" },
  resolucion_autoridadResolutora: { accordionValue: "resolucion", sectionLabel: "8. Resolución" },
  resolucion_autoridadInvestigadora: { accordionValue: "resolucion", sectionLabel: "8. Resolución" },
  resolucion_autoridadSusbstanciadora: { accordionValue: "resolucion", sectionLabel: "8. Resolución" },
  // Sección 9: Tipo de sanción
  tipoSancion: { accordionValue: "tipo-sancion", sectionLabel: "9. Tipo de sanción" },
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

export const FaltasGravesPMForm: React.FC<FaltasGravesPMFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { session } = useCurrentSession();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [errorSummary, setErrorSummary] = useState<{ sectionLabel: string; accordionValue: string; count: number }[]>([]);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const title = initialData
    ? "Actualizar falta grave personas morales"
    : "Registrar una nueva falta grave personas morales";
  const description = initialData
    ? "Edita la información de la falta administrativa grave"
    : "Formato que indica los datos que se inscribirán en el Sistema Nacional de Servidores Públicos y Particulares Sancionados de la Plataforma Digital Nacional relacionados con las sanciones firmes impuestas a particulares (personas morales) vinculados con faltas administrativas graves en términos de la Ley General de Responsabilidades Administrativas.";
  const toastMessage = initialData
    ? "Falta grave actualizada"
    : "Nueva falta grave registrada.";
  const action = initialData ? "Actualizar" : "Guardar";

  const defaultValues = useMemo(
    () => getFaltasGravesPMDefaults(initialData, session?.user?.entePublico),
    [initialData, session?.user?.entePublico]
  );

  const form = useForm<FaltasGravesPMFormValues>({
    resolver: zodResolver(faltasGravesPMSchema),
    defaultValues,
  });

  // Manejar errores de validación al hacer submit
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
  // FUNCIÓN DE GUARDADO - CORREGIDA CON NOMBRES DE COLECCIONES DEL JSON
  // ============================================

  const onSubmit = async (data: FaltasGravesPMFormValues) => {
    try {
      setLoading(true);

      // IMPORTANTE: Tomar entePublico del usuario logueado
      // Este es un ID que apunta a la colección ente_publico
      const entePublico = session?.user?.entePublico || data.entePublico || null;
      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error("No se encontró el token de acceso");
      }

      console.log("=== INICIANDO GUARDADO ===");
      console.log("entePublico del usuario:", entePublico);

      // ============================================
      // 1. DOMICILIO MÉXICO (si aplica)
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
          entePublico: entePublico, // ✅ entePublico incluido
        };

        if (initialData?.datosGenerales?.domicilioMexico?.id) {
          await directus.request(
            withToken(
              accessToken,
              updateItem(
                "domicilio_mexico_morales",
                initialData.datosGenerales.domicilioMexico.id,
                domicilioMexicoData
              )
            )
          );
          domicilioMexicoId = initialData.datosGenerales.domicilioMexico.id;
        } else {
          const newDomicilioMexico = await directus.request(
            withToken(accessToken, createItem("domicilio_mexico_morales", domicilioMexicoData))
          );
          domicilioMexicoId = newDomicilioMexico.id;
        }
        console.log("Domicilio México guardado:", domicilioMexicoId);
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
          entePublico: entePublico, // ✅ entePublico incluido
        };

        if (initialData?.datosGenerales?.domicilioExtranjero?.id) {
          await directus.request(
            withToken(
              accessToken,
              updateItem(
                "domicilio_extranjero_morales",
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
              createItem("domicilio_extranjero_morales", domicilioExtranjeroData)
            )
          );
          domicilioExtranjeroId = newDomicilioExtranjero.id;
        }
        console.log("Domicilio Extranjero guardado:", domicilioExtranjeroId);
      }

      // ============================================
      // 3. DATOS GENERALES
      // ============================================
      const datosGeneralesData = {
        nombreRazonSocial: data.nombreRazonSocial,
        rfc: data.rfc,
        objetoSocial: data.objetoSocial,
        tipoDomicilio: data.tipoDomicilio,
        domicilioMexico: domicilioMexicoId,
        domicilioExtranjero: domicilioExtranjeroId,
        entePublico: entePublico, // ✅ entePublico incluido
      };

      let datosGeneralesId;
      if (initialData?.datosGenerales?.id) {
        await directus.request(
          withToken(
            accessToken,
            updateItem(
              "datos_generales_personas_morales",
              initialData.datosGenerales.id,
              datosGeneralesData
            )
          )
        );
        datosGeneralesId = initialData.datosGenerales.id;
      } else {
        const newDatosGenerales = await directus.request(
          withToken(accessToken, createItem("datos_generales_personas_morales", datosGeneralesData))
        );
        datosGeneralesId = newDatosGenerales.id;
      }
      console.log("Datos Generales guardados:", datosGeneralesId);

      // ============================================
      // 4. DIRECTOR GENERAL
      // ============================================
      const directorGeneralData = {
        nombre: data.directorGeneral.nombre,
        primerApellido: data.directorGeneral.primerApellido,
        segundoApellido: data.directorGeneral.segundoApellido,
        rfc: data.directorGeneral.rfc,
        curp: data.directorGeneral.curp,
        entePublico: entePublico, // ✅ entePublico incluido
      };

      let directorGeneralId;
      if (initialData?.datosDirGeneralReprLegal?.directorGeneral?.id) {
        await directus.request(
          withToken(
            accessToken,
            updateItem(
              "datos_representante",
              initialData.datosDirGeneralReprLegal.directorGeneral.id,
              directorGeneralData
            )
          )
        );
        directorGeneralId = initialData.datosDirGeneralReprLegal.directorGeneral.id;
      } else {
        const newDirectorGeneral = await directus.request(
          withToken(accessToken, createItem("datos_representante", directorGeneralData))
        );
        directorGeneralId = newDirectorGeneral.id;
      }
      console.log("Director General guardado:", directorGeneralId);

      // ============================================
      // 5. REPRESENTANTE LEGAL
      // ============================================
      const representanteLegalData = {
        nombre: data.representanteLegal.nombre,
        primerApellido: data.representanteLegal.primerApellido,
        segundoApellido: data.representanteLegal.segundoApellido,
        rfc: data.representanteLegal.rfc,
        curp: data.representanteLegal.curp,
        entePublico: entePublico, // ✅ entePublico incluido
      };

      let representanteLegalId;
      if (initialData?.datosDirGeneralReprLegal?.representanteLegal?.id) {
        await directus.request(
          withToken(
            accessToken,
            updateItem(
              "datos_representante",
              initialData.datosDirGeneralReprLegal.representanteLegal.id,
              representanteLegalData
            )
          )
        );
        representanteLegalId = initialData.datosDirGeneralReprLegal.representanteLegal.id;
      } else {
        const newRepresentanteLegal = await directus.request(
          withToken(accessToken, createItem("datos_representante", representanteLegalData))
        );
        representanteLegalId = newRepresentanteLegal.id;
      }
      console.log("Representante Legal guardado:", representanteLegalId);

      // ============================================
      // 6. DATOS DG Y REPRESENTANTE LEGAL (WRAPPER)
      // ============================================
      const datosDgRpData = {
        directorGeneral: directorGeneralId,
        representanteLegal: representanteLegalId,
        entePublico: entePublico, // ✅ entePublico incluido
      };

      let datosDgRpId;
      if (initialData?.datosDirGeneralReprLegal?.id) {
        await directus.request(
          withToken(
            accessToken,
            updateItem("datos_dg_rp", initialData.datosDirGeneralReprLegal.id, datosDgRpData)
          )
        );
        datosDgRpId = initialData.datosDirGeneralReprLegal.id;
      } else {
        const newDatosDgRp = await directus.request(
          withToken(accessToken, createItem("datos_dg_rp", datosDgRpData))
        );
        datosDgRpId = newDatosDgRp.id;
      }
      console.log("Datos DG y Representante Legal guardados:", datosDgRpId);

      // ============================================
      // 7. DONDE COMETIÓ LA FALTA
      // ============================================
      const dondeCometioData = {
        entidadFederativa: data.dondeCometio_entidadFederativa,
        nivelOrdenGobierno: data.dondeCometio_nivelOrdenGobierno,
        ambitoPublico: data.dondeCometio_ambitoPublico,
        nombreEntePublico: data.dondeCometio_nombreEntePublico,
        siglasEntePublico: data.dondeCometio_siglasEntePublico,
        entePublico: entePublico, // ✅ entePublico incluido
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
      console.log("Donde cometió la falta guardado:", dondeCometioId);

      // ============================================
      // 8. ORIGEN DEL PROCEDIMIENTO
      // ============================================
      const origenData = {
        clave: data.origenProcedimiento_clave,
        valor: data.origenProcedimiento_clave === "OTRO" ? data.origenProcedimiento_valor : null,
        entePublico: entePublico, // ✅ entePublico incluido
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
      // 9. RESOLUCIÓN
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
        entePublico: entePublico, // ✅ entePublico incluido
      };

      let resolucionId;
      if (initialData?.resolucion?.id) {
        await directus.request(
          withToken(accessToken, updateItem("resolucion_morales", initialData.resolucion.id, resolucionData))
        );
        resolucionId = initialData.resolucion.id;
      } else {
        const newResolucion = await directus.request(
          withToken(accessToken, createItem("resolucion_morales", resolucionData))
        );
        resolucionId = newResolucion.id;
      }
      console.log("Resolución guardada:", resolucionId);

      // ============================================
      // 10. REGISTRO PRINCIPAL
      // ============================================
      const registroPrincipalData = {
        entePublico: entePublico, // ✅ entePublico incluido
        status: data.status,
        fecha: data.fecha,
        expediente: data.expediente,
        observaciones: data.observaciones,
        datosGenerales: datosGeneralesId,
        datosDirGeneralReprLegal: datosDgRpId,
        dondeCometioLaFalta: dondeCometioId,
        origenProcedimiento: origenId,
        resolucion: resolucionId,
      };

      let registroPrincipalId;
      if (initialData?.id) {
        await directus.request(
          withToken(
            accessToken,
            updateItem("faltas_graves_personas_morales", initialData.id, registroPrincipalData)
          )
        );
        registroPrincipalId = initialData.id;
      } else {
        const newRegistroPrincipal = await directus.request(
          withToken(accessToken, createItem("faltas_graves_personas_morales", registroPrincipalData))
        );
        registroPrincipalId = newRegistroPrincipal.id;
      }
      console.log("Registro principal guardado:", registroPrincipalId);

      // ============================================
      // 11. FALTAS COMETIDAS (O2M con normatividades anidadas)
      // ============================================
      for (const falta of data.faltaCometida) {
        const normatividadesIds = [];

        // Guardar cada normatividad infringida
        for (const normatividad of falta.normatividadInfringida) {
          const normatividadData = {
            nombreNormatividad: normatividad.nombreNormatividad,
            articulo: normatividad.articulo,
            fraccion: normatividad.fraccion,
            entePublico: entePublico, // ✅ entePublico incluido
          };

          const newNormatividad = await directus.request(
            withToken(accessToken, createItem("normatividad_morales", normatividadData))
          );
          normatividadesIds.push(newNormatividad.id);
        }

        // Guardar la falta con las normatividades
        const faltaData = {
          clave: falta.clave,
          valor: falta.clave === "OTRO" ? falta.valor : null,
          descripcionHechos: falta.descripcionHechos,
          fk_morales: registroPrincipalId,
          entePublico: entePublico, // ✅ entePublico incluido
          normatividadInfringida: normatividadesIds,
        };

        await directus.request(
          withToken(accessToken, createItem("falta_cometida_morales", faltaData))
        );
      }
      console.log("Faltas cometidas guardadas");

      // ============================================
      // 12. TIPO DE SANCIÓN (O2M complejo)
      // ============================================
      for (const sancion of data.tipoSancion) {
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
                entePublico: entePublico, // ✅ entePublico incluido
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
                  entePublico: entePublico, // ✅ entePublico incluido
                };
                const newPlazoPago = await directus.request(
                  withToken(accessToken, createItem("plazo_pago_indemnizacion", plazoPagoData))
                );
                plazoPagoId = newPlazoPago.id;
              }

              // Guardar efectivamenteCobrado si existe
              let efectivamenteCobradoId = null;
              if (sancion.indemnizacion.efectivamenteCobrado) {
                const cobradoData = {
                  monto: sancion.indemnizacion.efectivamenteCobrado.monto,
                  moneda: sancion.indemnizacion.efectivamenteCobrado.moneda,
                  fechaCobro: sancion.indemnizacion.efectivamenteCobrado.fechaCobro,
                  entePublico: entePublico, // ✅ entePublico incluido
                };
                const newCobrado = await directus.request(
                  withToken(
                    accessToken,
                    createItem("efectivamente_cobrado_indemnizacion", cobradoData)
                  )
                );
                efectivamenteCobradoId = newCobrado.id;
              }

              // Guardar indemnización
              const indemnizacionData = {
                monto: sancion.indemnizacion.monto,
                moneda: sancion.indemnizacion.moneda,
                fechaPagoTotal: sancion.indemnizacion.fechaPagoTotal,
                plazoPago: plazoPagoId,
                efectivamenteCobrado: efectivamenteCobradoId,
                entePublico: entePublico, // ✅ entePublico incluido
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
                  entePublico: entePublico, // ✅ entePublico incluido
                };
                const newPlazoPagoSE = await directus.request(
                  withToken(accessToken, createItem("plazo_pago", plazoPagoSEData))
                );
                plazoPagoSEId = newPlazoPagoSE.id;
              }

              // Guardar efectivamenteCobrado si existe
              let efectivamenteCobradoSEId = null;
              if (sancion.sancionEconomica.efectivamenteCobrado) {
                const cobradoSEData = {
                  monto: sancion.sancionEconomica.efectivamenteCobrado.monto,
                  moneda: sancion.sancionEconomica.efectivamenteCobrado.moneda,
                  fechaCobro: sancion.sancionEconomica.efectivamenteCobrado.fechaCobro,
                  entePublico: entePublico, // ✅ entePublico incluido
                };
                const newCobradoSE = await directus.request(
                  withToken(accessToken, createItem("efectivamente_cobrado", cobradoSEData))
                );
                efectivamenteCobradoSEId = newCobradoSE.id;
              }

              // Guardar sanción económica
              const sancionEconomicaData = {
                monto: sancion.sancionEconomica.monto,
                moneda: sancion.sancionEconomica.moneda,
                fechaPagoTotal: sancion.sancionEconomica.fechaPagoTotal,
                plazoPago: plazoPagoSEId,
                efectivamenteCobrado: efectivamenteCobradoSEId,
                entePublico: entePublico, // ✅ entePublico incluido
              };
              const newSancionEconomica = await directus.request(
                withToken(accessToken, createItem("sancion_economica", sancionEconomicaData))
              );
              sancionEspecificaId = newSancionEconomica.id;
            }
            break;

          case "SUSPENSION_ACTIVIDADES":
            if (sancion.suspensionActividades) {
              const suspensionData = {
                plazoSuspensionAnios: sancion.suspensionActividades.plazoSuspensionAnios,
                plazoSuspensionMeses: sancion.suspensionActividades.plazoSuspensionMeses,
                plazoSuspensionDias: sancion.suspensionActividades.plazoSuspensionDias,
                fechaInicial: sancion.suspensionActividades.fechaInicial,
                fechaFinal: sancion.suspensionActividades.fechaFinal,
                entePublico: entePublico, // ✅ entePublico incluido
              };
              const newSuspension = await directus.request(
                withToken(accessToken, createItem("suspension_actividades", suspensionData))
              );
              sancionEspecificaId = newSuspension.id;
            }
            break;

          case "DISOLUCION_SOCIEDAD":
            if (sancion.disolucionSociedad) {
              const disolucionData = {
                fechaDisolucion: sancion.disolucionSociedad.fechaDisolucion,
                entePublico: entePublico, // ✅ entePublico incluido
              };
              const newDisolucion = await directus.request(
                withToken(accessToken, createItem("disolucion_sociedad", disolucionData))
              );
              sancionEspecificaId = newDisolucion.id;
            }
            break;

          case "OTRO":
            if (sancion.otro) {
              const otroData = {
                denominacionSancion: sancion.otro.denominacionSancion,
                entePublico: entePublico, // ✅ entePublico incluido
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
          entePublico: entePublico, // ✅ entePublico incluido
        };

        // Asignar el ID correspondiente según la clave
        if (sancion.clave === "INHABILITACION")
          tipoSancionData.inhabilitacion = sancionEspecificaId;
        else if (sancion.clave === "INDEMNIZACION")
          tipoSancionData.indemnizacion = sancionEspecificaId;
        else if (sancion.clave === "SANCION_ECONOMICA")
          tipoSancionData.sancionEconomica = sancionEspecificaId;
        else if (sancion.clave === "SUSPENSION_ACTIVIDADES")
          tipoSancionData.suspensionActividades = sancionEspecificaId;
        else if (sancion.clave === "DISOLUCION_SOCIEDAD")
          tipoSancionData.disolucionSociedad = sancionEspecificaId;
        else if (sancion.clave === "OTRO") tipoSancionData.otro = sancionEspecificaId;

        await directus.request(
          withToken(accessToken, createItem("tipo_sancion_personas_morales", tipoSancionData))
        );
      }
      console.log("Tipos de sanción guardados");

      console.log("=== GUARDADO EXITOSO ===");

      router.refresh();
      router.push("/inicio/faltas-graves-pm");
      toast({
        variant: "default",
        className: "bg-green-600",
        title: "Éxito",
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
  // RENDER DEL FORMULARIO (se mantiene igual)
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
              {/* Campo Estatus - Switch con diseño mejorado */}
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

                    {/* Contenedor del switch con diseño optimizado */}
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
                        2. Número de expediente <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Ej: EXP-2025-001" {...field} className="border-primary/30" />
                      </FormControl>
                      <FormDescription>Número de expediente del procedimiento</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Acordeón con todas las secciones */}
          <Accordion
            type="multiple"
            value={openSections}
            onValueChange={setOpenSections}
            className="w-full space-y-4"
          >
            {/* Sección 3: Datos Generales */}
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
                    3. Datos generales de la persona moral sancionada
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
                <DatosGeneralesPMSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Sección 4: Datos Director General / Representante Legal */}
            <AccordionItem
              value="datos-dir-general"
              data-section="datos-dir-general"
              className={`rounded-xl border-2 overflow-hidden bg-card/95 backdrop-blur shadow-lg transition-colors ${errorSummary.some(s => s.accordionValue === "datos-dir-general") ? "border-destructive/40" : "border-primary/20"}`}
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className={`rounded-lg p-2 mr-4 ${errorSummary.some(s => s.accordionValue === "datos-dir-general") ? "bg-destructive/10" : "bg-primary/10"}`}>
                    <Users className={`h-5 w-5 ${errorSummary.some(s => s.accordionValue === "datos-dir-general") ? "text-destructive" : "text-primary"}`} />
                  </div>
                  <span className={`text-left text-lg font-semibold ${errorSummary.some(s => s.accordionValue === "datos-dir-general") ? "text-destructive" : "text-primary"}`}>
                    4. Datos generales del director general y del representante legal de la persona
                    moral sancionada
                  </span>
                  {errorSummary.some(s => s.accordionValue === "datos-dir-general") && (
                    <span className="ml-auto mr-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                      <AlertCircle className="h-3 w-3" />
                      {errorSummary.find(s => s.accordionValue === "datos-dir-general")?.count} {errorSummary.find(s => s.accordionValue === "datos-dir-general")?.count === 1 ? "error" : "errores"}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <DatosDirGeneralPMSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Sección 5: Donde cometió la falta */}
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
                    5. Datos del Ente público donde se cometió la falta administrativa
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
                <DondeCometioFaltaSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Sección 6: Origen del procedimiento */}
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
                    6. Origen del procedimiento
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
                <OrigenProcedimientoSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Sección 7: Falta cometida */}
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
                    7. Tipo de falta cometida por la persona moral sancionada
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
                <FaltaCometidaSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Sección 8: Resolución */}
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
                    8. Resolución sancionatoria de la falta cometida por la persona moral
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
                <ResolucionSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Sección 9: Tipo de sanción */}
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
                    9. Tipo de sanción impuesta a la persona moral
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
                <TipoSancionSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Campo 10: Observaciones */}
          <div className="rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg">
            <div className="flex items-center mb-6">
              <div className="bg-primary/10 rounded-lg p-2 mr-4">
                <Clipboard className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-primary">10. Observaciones</h3>
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
                    En este espacio podrá realizar las aclaraciones u observaciones que considere
                    pertinentes respecto de alguno o algunos de los apartados del documento.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Botones de acción */}
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