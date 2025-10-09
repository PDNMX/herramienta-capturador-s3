// @ts-nocheck
import * as z from "zod";

// Schema para representante (Director General y Representante Legal)
export const datosRepresentanteSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  primerApellido: z.string().min(1, "El primer apellido es requerido"),
  segundoApellido: z.string().optional().nullable(),
  rfc: z.string().optional().nullable(),
  curp: z.string().optional().nullable(),
});

// Schema principal del formulario
export const faltasGravesPMSchema = z.object({
  entePublico: z.string().min(1, {
    message: "Ente público es requerido.",
  }),
  status: z.enum(["NO_FIRME", "FIRME"], {
    message: "Selecciona un estatus válido",
  }),
  fecha: z.string().min(1, {
    message: "La fecha es requerida.",
  }),
  expediente: z.string().min(3, {
    message: "El número de expediente debe tener al menos 3 caracteres.",
  }),
  observaciones: z.string().nullable().optional(),

  // Datos Generales de la Persona Moral
  nombreRazonSocial: z.string().min(3, {
    message: "La denominación o razón social debe tener al menos 3 caracteres.",
  }),
  rfc: z
    .string()
    .min(12, {
      message: "El RFC debe tener al menos 12 caracteres (con homoclave).",
    })
    .max(13),
  objetoSocial: z.string().optional(),
  tipoDomicilio: z
    .enum(["DOMICILIO_MEXICO", "DOMICILIO_EXTRANJERO"])
    .nullable()
    .optional(),

  // Campos de Domicilio México (todos opcionales)
  tipoVialidad: z.string().nullable().optional(),
  nombreVialidad: z.string().nullable().optional(),
  numeroExterior: z.string().nullable().optional(),
  numeroInterior: z.string().nullable().optional(),
  coloniaLocalidad: z.string().nullable().optional(),
  municipioAlcaldia: z.string().nullable().optional(),
  codigoPostal: z.string().nullable().optional(),
  entidadFederativa: z.string().nullable().optional(),

  // Campos de Domicilio Extranjero (todos opcionales)
  ciudad: z.string().nullable().optional(),
  provincia: z.string().nullable().optional(),
  calle: z.string().nullable().optional(),
  numeroExteriorExtranjero: z.string().nullable().optional(),
  numeroInteriorExtranjero: z.string().nullable().optional(),
  codigoPostalExtranjero: z.string().nullable().optional(),
  pais: z.string().nullable().optional(),

  // Datos del Director General y Representante Legal
  directorGeneral: datosRepresentanteSchema,
  representanteLegal: datosRepresentanteSchema,

  // Donde cometió la falta
  dondeCometio_entidadFederativa: z.string().min(1, "La entidad federativa es requerida"),
  dondeCometio_nivelOrdenGobierno: z.enum(["FEDERAL", "ESTATAL", "MUNICIPAL_ALCALDIA"], {
    message: "Selecciona un nivel de gobierno válido",
  }),
  dondeCometio_ambitoPublico: z.enum(["EJECUTIVO", "LEGISLATIVO", "JUDICIAL", "ORGANO_AUTONOMO"]).nullable().optional(),
  dondeCometio_nombreEntePublico: z.string().nullable().optional(),
  dondeCometio_siglasEntePublico: z.string().nullable().optional(),

  // Origen del procedimiento
  origenProcedimiento_clave: z.enum(["ASF_ENTIDADES_FISCALIZACION", "AUDITORIA_OIC", "DENUNCIA", "DE_OFICIO", "OTRO"], {
    message: "Selecciona un origen válido",
  }),
  origenProcedimiento_valor: z.string().nullable().optional(),
});

// Type inference
export type FaltasGravesPMFormValues = z.infer<typeof faltasGravesPMSchema>;