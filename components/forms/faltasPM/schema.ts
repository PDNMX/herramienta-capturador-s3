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

  // Punto 7: Falta Cometida (O2M con normatividades anidadas)
  faltaCometida: z.array(
    z.object({
      clave: z.enum([
        "SOBORNO",
        "PARTICIPACION_ILICITA",
        "TRAFICO_INFLUENCIAS",
        "UTILIZACION_INFORMACION_FALSA",
        "COLUSION",
        "OBSTRUCCION_FACULTADES",
        "CONTRATACION_INDEBIDA",
        "USO_INDEBIDO_RECURSOS_PUBLICOS",
        "OTRO"
      ], {
        message: "Selecciona un tipo de falta válido",
      }),
      valor: z.string().nullable().optional(),
      descripcionHechos: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
      normatividadInfringida: z.array(
        z.object({
          nombreNormatividad: z.enum([
            "LRACDMX",
            "LRAAGS",
            "LRABC",
            "LRABCS",
            "LRACHP",
            "LRAHGO",
            "LRAEMM",
            "LRAEMOR",
            "LRANAY",
            "LRAEMMOAX",
            "LRAQRO",
            "LRAQR",
            "LRASIN",
            "LRASON",
            "LRATAM",
            "LRAYUC",
            "LRAGTO",
            "LRAMICH",
            "LRANL",
            "LRASLP",
            "LRAVER",
            "LRPAEJ",
            "LGRA",
            "LRAEGR465"
          ], {
            message: "Selecciona una normatividad válida",
          }),
          articulo: z.string().min(1, "El artículo es requerido"),
          fraccion: z.string().nullable().optional(),
        })
      ).min(1, "Debe agregar al menos una normatividad infringida"),
    })
  ).min(1, "Debe agregar al menos una falta cometida"),

  // Punto 8: Resolución Sancionatoria
  resolucion_tituloResolucion: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  resolucion_fechaResolucion: z.string().min(1, "La fecha de resolución es requerida"),
  resolucion_fechaNotificacion: z.string().min(1, "La fecha de notificación es requerida"),
  resolucion_urlResolucion: z.string().url("Debe ser una URL válida").min(1, "La URL de resolución es requerida"),
  resolucion_fechaResolucionFirme: z.string().min(1, "La fecha de resolución firme es requerida"),
  resolucion_fechaNotificacionFirme: z.string().min(1, "La fecha de notificación firme es requerida"),
  resolucion_urlResolucionFirme: z.string().url("Debe ser una URL válida").min(1, "La URL de resolución firme es requerida"),
  resolucion_fechaEjecucion: z.string().nullable().optional(),
  resolucion_ordenJurisdiccional: z.enum(["FEDERAL", "ESTATAL"], {
    message: "Selecciona un orden jurisdiccional válido",
  }),
  resolucion_autoridadResolutora: z.string().min(3, "La autoridad resolutora es requerida"),
  resolucion_autoridadInvestigadora: z.string().min(3, "La autoridad investigadora es requerida"),
  resolucion_autoridadSustanciadora: z.string().min(3, "La autoridad sustanciadora es requerida"),

  // Punto 9: Tipo de Sanción (O2M con estructuras condicionales)
  tipoSancion: z.array(
    z.object({
      clave: z.enum([
        "INHABILITACION",
        "INDEMNIZACION",
        "SANCION_ECONOMICA",
        "SUSPENSION_ACTIVIDADES",
        "DISOLUCION_SOCIEDAD",
        "OTRO"
      ]),
      // Inhabilitación
      inhabilitacion: z.object({
        plazoAnios: z.number().min(0),
        plazoMeses: z.number().min(0).max(11),
        plazoDias: z.number().min(0).max(30),
        fechaInicial: z.string().min(1),
        fechaFinal: z.string().min(1),
      }).nullable().optional(),
      // Indemnización
      indemnizacion: z.object({
        monto: z.number().min(0),
        moneda: z.enum(["MXN", "USD", "EUR"]),
        fechaPagoTotal: z.string().nullable().optional(),
        plazoPago: z.object({
          anios: z.number().min(0),
          meses: z.number().min(0).max(11),
          dias: z.number().min(0).max(30),
        }).nullable().optional(),
        efectivamenteCobrado: z.object({
          monto: z.number().min(0),
          moneda: z.enum(["MXN", "USD", "EUR"]),
          fechaCobro: z.string().min(1),
        }).nullable().optional(),
      }).nullable().optional(),
      // Sanción Económica
      sancionEconomica: z.object({
        monto: z.number().min(0),
        moneda: z.enum(["MXN", "USD", "EUR"]),
        fechaPagoTotal: z.string().nullable().optional(),
        plazoPago: z.object({
          anios: z.number().min(0),
          meses: z.number().min(0).max(11),
          dias: z.number().min(0).max(30),
        }).nullable().optional(),
        efectivamenteCobrado: z.object({
          monto: z.number().min(0),
          moneda: z.enum(["MXN", "USD", "EUR"]),
          fechaCobro: z.string().min(1),
        }).nullable().optional(),
      }).nullable().optional(),
      // Suspensión de Actividades
      suspensionActividades: z.object({
        plazoSuspensionAnios: z.number().min(0),
        plazoSuspensionMeses: z.number().min(0).max(11),
        plazoSuspensionDias: z.number().min(0).max(30),
        fechaInicial: z.string().min(1),
        fechaFinal: z.string().min(1),
      }).nullable().optional(),
      // Disolución de Sociedad
      disolucionSociedad: z.object({
        fechaDisolucion: z.string().min(1),
      }).nullable().optional(),
      // Otro
      otro: z.object({
        denominacionSancion: z.string().min(3),
      }).nullable().optional(),
    })
  ).min(1, "Debe agregar al menos un tipo de sanción"),
});

// Type inference
export type FaltasGravesPMFormValues = z.infer<typeof faltasGravesPMSchema>;