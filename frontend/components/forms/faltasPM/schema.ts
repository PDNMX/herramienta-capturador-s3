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
  // ✅ MODIFICADO: entePublico ahora es opcional - se tomará automáticamente del usuario
  entePublico: z.string().optional(),
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
  resolucion_autoridadSusbstanciadora: z.string().min(3, "La autoridad substanciadora es requerida"),

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
      // Inhabilitación - CON VALIDACIÓN OBLIGATORIA
      inhabilitacion: z.object({
        plazoAnios: z.number({
          required_error: "El campo Año(s) es obligatorio",
          invalid_type_error: "Debe ingresar un número válido",
        }).min(0, "El valor no puede ser negativo"),
        plazoMeses: z.number({
          required_error: "El campo Mes(es) es obligatorio",
          invalid_type_error: "Debe ingresar un número válido",
        }).min(0, "El valor no puede ser negativo").max(11, "El valor máximo es 11 meses"),
        plazoDias: z.number({
          required_error: "El campo Día(s) es obligatorio",
          invalid_type_error: "Debe ingresar un número válido",
        }).min(0, "El valor no puede ser negativo").max(30, "El valor máximo es 30 días"),
        fechaInicial: z.string({
          required_error: "La fecha inicial es obligatoria",
        }).min(1, "La fecha inicial es obligatoria"),
        fechaFinal: z.string({
          required_error: "La fecha final es obligatoria",
        }).min(1, "La fecha final es obligatoria"),
      }).nullable().optional(),
      // Indemnización - SOLO MONTO Y MONEDA OBLIGATORIOS
      indemnizacion: z.object({
        monto: z.number({
          required_error: "El monto es obligatorio",
          invalid_type_error: "Debe ingresar un monto válido",
        }).min(0, "El monto no puede ser negativo"),
        moneda: z.enum(["MXN", "USD", "EUR"], {
          required_error: "La moneda es obligatoria",
          invalid_type_error: "Seleccione una moneda válida",
        }),
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
      // Sanción Económica - SOLO MONTO Y MONEDA OBLIGATORIOS
      sancionEconomica: z.object({
        monto: z.number({
          required_error: "El monto es obligatorio",
          invalid_type_error: "Debe ingresar un monto válido",
        }).min(0, "El monto no puede ser negativo"),
        moneda: z.enum(["MXN", "USD", "EUR"], {
          required_error: "La moneda es obligatoria",
          invalid_type_error: "Seleccione una moneda válida",
        }),
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
    // ⭐ VALIDACIÓN CONDICIONAL
    .superRefine((data, ctx) => {
      // INHABILITACIÓN
      if (data.clave === "INHABILITACION") {
        if (!data.inhabilitacion) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Los datos de inhabilitación son obligatorios cuando se selecciona este tipo de sanción",
            path: ["inhabilitacion"],
          });
        } else {
          // Validar campos numéricos
          if (data.inhabilitacion.plazoAnios === null || data.inhabilitacion.plazoAnios === undefined) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "El campo Año(s) es obligatorio",
              path: ["inhabilitacion", "plazoAnios"],
            });
          }
          if (data.inhabilitacion.plazoMeses === null || data.inhabilitacion.plazoMeses === undefined) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "El campo Mes(es) es obligatorio",
              path: ["inhabilitacion", "plazoMeses"],
            });
          }
          if (data.inhabilitacion.plazoDias === null || data.inhabilitacion.plazoDias === undefined) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "El campo Día(s) es obligatorio",
              path: ["inhabilitacion", "plazoDias"],
            });
          }
          if (!data.inhabilitacion.fechaInicial || data.inhabilitacion.fechaInicial.trim() === "") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "La fecha inicial es obligatoria",
              path: ["inhabilitacion", "fechaInicial"],
            });
          }
          if (!data.inhabilitacion.fechaFinal || data.inhabilitacion.fechaFinal.trim() === "") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "La fecha final es obligatoria",
              path: ["inhabilitacion", "fechaFinal"],
            });
          }
          
          // Validación de fechas
          if (data.inhabilitacion.fechaInicial && data.inhabilitacion.fechaFinal) {
            const fechaInicial = new Date(data.inhabilitacion.fechaInicial);
            const fechaFinal = new Date(data.inhabilitacion.fechaFinal);
            
            if (fechaFinal < fechaInicial) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La fecha final debe ser posterior o igual a la fecha inicial",
                path: ["inhabilitacion", "fechaFinal"],
              });
            }
          }
        }
      }
      
      // INDEMNIZACIÓN - SOLO MONTO Y MONEDA OBLIGATORIOS
      if (data.clave === "INDEMNIZACION") {
        if (!data.indemnizacion) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Los datos de indemnización son obligatorios cuando se selecciona este tipo de sanción",
            path: ["indemnizacion"],
          });
        } else {
          // Validar solo monto y moneda
          if (data.indemnizacion.monto === null || data.indemnizacion.monto === undefined) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "El monto es obligatorio",
              path: ["indemnizacion", "monto"],
            });
          }
          if (!data.indemnizacion.moneda) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "La moneda es obligatoria",
              path: ["indemnizacion", "moneda"],
            });
          }
        }
      }
      
      // SANCIÓN ECONÓMICA - SOLO MONTO Y MONEDA OBLIGATORIOS
      if (data.clave === "SANCION_ECONOMICA") {
        if (!data.sancionEconomica) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Los datos de sanción económica son obligatorios cuando se selecciona este tipo de sanción",
            path: ["sancionEconomica"],
          });
        } else {
          // Validar solo monto y moneda
          if (data.sancionEconomica.monto === null || data.sancionEconomica.monto === undefined) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "El monto es obligatorio",
              path: ["sancionEconomica", "monto"],
            });
          }
          if (!data.sancionEconomica.moneda) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "La moneda es obligatoria",
              path: ["sancionEconomica", "moneda"],
            });
          }
        }
      }
      
      // SUSPENSIÓN DE ACTIVIDADES
      if (data.clave === "SUSPENSION_ACTIVIDADES" && !data.suspensionActividades) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Los datos de suspensión de actividades son obligatorios cuando se selecciona este tipo de sanción",
          path: ["suspensionActividades"],
        });
      }
      
      // DISOLUCIÓN DE SOCIEDAD
      if (data.clave === "DISOLUCION_SOCIEDAD" && !data.disolucionSociedad) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Los datos de disolución de sociedad son obligatorios cuando se selecciona este tipo de sanción",
          path: ["disolucionSociedad"],
        });
      }
      
      // OTRO
      if (data.clave === "OTRO" && !data.otro) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Los datos de la sanción son obligatorios cuando se selecciona 'Otro'",
          path: ["otro"],
        });
      }
    })
  ).min(1, "Debe agregar al menos un tipo de sanción"),
});

// Type inference
export type FaltasGravesPMFormValues = z.infer<typeof faltasGravesPMSchema>;