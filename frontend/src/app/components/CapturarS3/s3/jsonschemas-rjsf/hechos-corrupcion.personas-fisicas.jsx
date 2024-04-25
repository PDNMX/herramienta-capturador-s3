// HECHOS DE CORRUPCION - PERSONAS FISICAS (8)
let schema = {
  definitions: {
    entidad: {
      enumNames: [
        "Aguascalientes",
        "Baja California",
        "Baja California Sur",
        "Campeche",
        "Coahuila de Zaragoza",
        "Colima",
        "Chiapas",
        "Chihuahua",
        "Ciudad de México",
        "Durango",
        "Guanajuato",
        "Guerrero",
        "Hidalgo",
        "Jalisco",
        "México",
        "Michoacán de Ocampo",
        "Morelos",
        "Nayarit",
        "Nuevo León",
        "Oaxaca",
        "Puebla",
        "Querétaro",
        "Quintana Roo",
        "San Luis Potosí",
        "Sinaloa",
        "Sonora",
        "Tabasco",
        "Tamaulipas",
        "Tlaxcala",
        "Veracruz de Ignacio de la Llave",
        "Yucatán",
        "Zacatecas",
      ],
      enum: [
        { clave: "01", valor: "Aguascalientes" },
        { clave: "02", valor: "Baja California" },
        { clave: "03", valor: "Baja California Sur" },
        { clave: "04", valor: "Campeche" },
        { clave: "05", valor: "Coahuila de Zaragoza" },
        { clave: "06", valor: "Colima" },
        { clave: "07", valor: "Chiapas" },
        { clave: "08", valor: "Chihuahua" },
        { clave: "09", valor: "Ciudad de México" },
        { clave: "10", valor: "Durango" },
        { clave: "11", valor: "Guanajuato" },
        { clave: "12", valor: "Guerrero" },
        { clave: "13", valor: "Hidalgo" },
        { clave: "14", valor: "Jalisco" },
        { clave: "15", valor: "México" },
        { clave: "16", valor: "Michoacán de Ocampo" },
        { clave: "17", valor: "Morelos" },
        { clave: "18", valor: "Nayarit" },
        { clave: "19", valor: "Nuevo León" },
        { clave: "20", valor: "Oaxaca" },
        { clave: "21", valor: "Puebla" },
        { clave: "22", valor: "Querétaro" },
        { clave: "23", valor: "Quintana Roo" },
        { clave: "24", valor: "San Luis Potosí" },
        { clave: "25", valor: "Sinaloa" },
        { clave: "26", valor: "Sonora" },
        { clave: "27", valor: "Tabasco" },
        { clave: "28", valor: "Tamaulipas" },
        { clave: "29", valor: "Tlaxcala" },
        { clave: "30", valor: "Veracruz de Ignacio de la Llave" },
        { clave: "31", valor: "Yucatán" },
        { clave: "32", valor: "Zacatecas" },
      ],
    },
  },
  type: "object",
  required: ["expediente", "hechosFisica"],
  properties: {
    expediente: {
      type: "string",
      title: "Expediente",
      description: "Registrar el número de expediente del procedimiento.",
    },
    hechosFisica: {
      title: "1. DATOS GENERALES DE LA PERSONA FÍSICA",
      description:
        "En esta sección se registrarán los datos generales de la persona física sancionada.",
      type: "object",
      required: [
        "nombres",
        "primerApellido",
        "segundoApellido",
        "rfc",
        "curp",
        "domicilio",
        "entePublico",
        "origenTipo",
        "resolucion",
        "tipoSancion",
      ],
      properties: {
        nombres: {
          type: "string",
          title: "Nombre (s)",
          description:
            "Escribir el o los nombres, sin abreviaturas, sin acentos, ni signos especiales.",
        },
        primerApellido: {
          type: "string",
          title: "Primer apellido",
          description:
            "Escribir los apellidos completos, sin abreviaturas, sin acentos, ni signos especiales.",
        },
        segundoApellido: {
          title: "Segundo apellido",
          type: "object",
          properties: {
            sinSegundoApellido: {
              type: "boolean",
              default: false,
              title: "No cuento con segundo apellido",
            },
          },
          dependencies: {
            sinSegundoApellido: {
              oneOf: [
                {
                  properties: {
                    sinSegundoApellido: { const: true },
                  },
                  required: ["sinSegundoApellido"],
                },
                {
                  properties: {
                    sinSegundoApellido: { const: false },
                    valor: {
                      type: "string",
                      title: "Segundo apellido",
                      description:
                        "En caso de tener solo un apellido, deberá colocarse en el espacio del primer apellido y dejar el espacio del segundo apellido en blanco y posteriormente seleccionar la opción de: No tengo segundo apellido.",
                    },
                  },
                  required: ["sinSegundoApellido", "valor"],
                },
              ],
            },
          },
        },
        rfc: {
          type: "string",
          title: "RFC con homoclave",
        },
        curp: {
          type: "string",
          title: "CURP",
        },
        telefono: {
          type: "string",
          title: "Telefono",
          description:
            "Proporcionar el número telefónico de la persona física sancionada.",
        },
        domicilio: {
          type: "object",
          title: "Domicilio",
          properties: {
            tipoDomicilio: {
              type: "boolean",
              default: false,
              title: "Domicilio extranjero",
            },
          },
          dependencies: {
            tipoDomicilio: {
              oneOf: [
                {
                  properties: {
                    tipoDomicilio: { const: false },
                    domicilioMexico: {
                      type: "object",
                      title: "Domicilio en la república mexicana",
                      description:
                        "Indicar los siguientes datos: tipo de vialidad, nombre de la vialidad, número exterior, número interior (si aplica), colonia o localidad, municipio, código postal, y entidad federativa.",
                      properties: {
                        //falta hacer las descripciones para cada uno de los campos de Domicilio Mexico
                        vialidad: {
                          type: "object",
                          properties: {
                            clave: {
                              type: "string",
                              title: "Tipo de vialidad",
                              description:
                                "Colocar el nombre de la vialidad correspondiente con base al catálogo de vialidades del marco Geoestadístico Nacional. https://www.inegi.org.mx/temas/mg/#Documentacion",
                            },
                            valor: {
                              type: "string",
                              title: "Nombre de la vialidad",
                              description:
                                "Escribir el nombre completo de la calle, boulevard, avenida, etc.",
                            },
                            numeroExterior: {
                              type: "string",
                              title: "Número exterior",
                              description: "Escribir el número exterior.",
                            },
                            numeroInterior: {
                              type: "string",
                              title: "Número interior",
                              description: "Escribir el número interior.",
                            },
                            colonia: {
                              type: "string",
                              title: "Colonia",
                              description:
                                "Escribir el nombre completo de la colonia.",
                            },
                          },
                        },
                        localidad: {
                          type: "string",
                          title: "Localidad",
                          description: "Nombre de la localidad.",
                        },
                        municipio: {
                          type: "string",
                          title: "Municipio",
                          description: "Nombre del Municipio/Alcaldía.",
                        },
                        codigoPostal: {
                          type: "integer",
                          title: "Código Postal",
                          description: "Escribir el número código postal.",
                        },
                        entidadFederativa: {
                          title: "Entidad federativa",
                          description:
                            "Seleccionar la entidad federativa que corresponda al domicilio completo previamente documentado.",
                          $ref: "#/definitions/entidad",
                        },
                      },
                    },
                  },
                },
                {
                  properties: {
                    tipoDomicilio: { const: true },
                    domicilioExtranjero: {
                      type: "object",
                      title: "Domicilio Extranjero",
                      description:
                        "Indicar los siguientes datos: ciudad, provincia, calle, número exterior, número interior (si aplica), código postal y país.",
                      properties: {
                        //Faltan las descripciones para los campos de Domicilio Extranjero
                        ciudadLocalidad: {
                          type: "string",
                          title: "Ciudad",
                          description:
                            "Escribir el nombre de la localidad del domicilio extranjero.",
                        },
                        estadoProvincia: {
                          type: "string",
                          title: "Provincia",
                          description:
                            "Escribir el nombre del estado/provincia del domicilio extranjero.",
                        },
                        calle: {
                          type: "string",
                          title: "Calle",
                          description:
                            "Escribir el nombre de la calle del domicilio extranjero.",
                        },
                        numeroExterior: {
                          type: "string",
                          title: "Numero Exterior",
                          description:
                            "Escribir el numero exterior del domicilio extranjero.",
                        },
                        numeroInterior: {
                          type: "string",
                          title: "Numero Interior",
                          description:
                            "Escribir el numero interior del domicilio extranjero.",
                        },
                        codigoPostal: {
                          type: "integer",
                          title: "Código Postal",
                          description:
                            "Escribir el código postal del domicilio extranjero.",
                        },
                        pais: {
                          type: "string",
                          title: "Pais",
                          description:
                            "Nombre del país especificado en estándar ISO3166.",
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        entePublico: {
          type: "object",
          title:
            "2. DATOS DEL ENTE PÚBLICO EN DONDE SE COMETIÓ EL DELITO POR HECHO DE CORRUPCIÓN",
          description:
            "Indicar (si aplica) los datos del ente público donde se cometió el hecho de corrupción",
          properties: {
            entidadFederativa: {
              title: "Entidad federativa",
              description:
                "Seleccionar la entidad federativa en la cual se localiza el ente público donde se cometió el hecho de corrupción.",
              $ref: "#/definitions/entidad",
            },
            nivelOrdenGobierno: {
              type: "object",
              properties: {
                clave: {
                  title: "Nivel/Orden de Gobierno",
                  description:
                    "Seleccionar el nivel u orden de gobierno al que pertenece el ente público donde se cometió el hecho de corrupción: Federal, Estatal, Municipal/Alcaldía, otro (especificar).",
                  enum: ["FEDERAL", "ESTATAL", "MUNICIPAL_ALCALDIA", "OTRO"],
                  enumNames: [
                    "Federal",
                    "Estatal",
                    "Municipal/Alcadía",
                    "Otro",
                  ],
                },
              },
              required: ["clave"],
              dependencies: {
                clave: {
                  oneOf: [
                    {
                      properties: {
                        clave: {
                          enum: ["OTRO"],
                        },
                        valor: {
                          title: "Otro",
                          description: "Especifique",
                          type: "string",
                        },
                      },
                      required: ["valor"],
                    },
                    {
                      properties: {
                        clave: {
                          enum: ["FEDERAL", "ESTATAL", "MUNICIPAL_ALCALDIA"],
                        },
                      },
                    },
                  ],
                },
              },
            },
            ambitoPublico: {
              type: "string",
              title: "Ambito público",
              description:
                "Seleccionar el ámbito público: Ejecutivo, Legislativo, Judicial u Órgano autónomo.",
              enum: ["EJECUTIVO", "LEGISLATIVO", "JUDICIAL", "ORGANO_AUTONOMO"],
              enumNames: [
                "Ejecutivo",
                "Legislativo",
                "Judicial",
                "Órgano autónomo",
              ],
            },
            nombre: {
              type: "string",
              title: "Nombre del ente público",
              description:
                "Indicar el nombre completo del ente público sin abreviaturas, sin acentos, ni signos especiales.",
            },
            siglas: {
              type: "string",
              title: "Siglas del ente público",
              description: "Indicar (si aplica) las siglas del ente público.",
            },
          },
          required: ["ambitoPublico", "nombre", "siglas"],
        },
        origenInvestigacion: {
          type: "object",
          title: "3. ORIGEN DEL PROCEDIMIENTO",
          description:
            "Seleccionar conforme al catálogo el motivo que dio origen al procedimiento:",
          required: ["clave"],
          properties: {
            clave: {
              title: "Origen del procedimiento",
              enum: ["DENUNCIA_CIUDADANA", "DENUNCIA_SP", "OFICIO", "OTRO"],
              enumNames: [
                "Denuncia ciudadana",
                "Denuncia de servidor público",
                "Oficio",
                "Otro",
              ],
            },
          },
          dependencies: {
            clave: {
              oneOf: [
                {
                  properties: {
                    clave: {
                      enum: ["OTRO"],
                    },
                    valor: {
                      title: "Otro",
                      description: "Especifique",
                      type: "string",
                    },
                  },
                  required: ["valor"],
                },
                {
                  properties: {
                    clave: {
                      enum: ["DENUNCIA_CIUDADADA", "DENUNCIA_SP", "OFICIO"],
                    },
                  },
                },
              ],
            },
          },
        },
        faltaCometida: {
          type: "array",
          title: "4. TIPO DE DELITO POR HECHOS DE CORRUPCIÓN",
          description:
            "En esta sección se señalarán los datos relativos al delito cometido por la persona física.",
          items: {
            type: "object",
            required: [
              "nombreNormatividad",
              "articuloNormatividad",
              "fraccionNormatividad",
            ],
            properties: {
              nombreNormatividad: {
                type: "string",
                title: "Normatividad infringida",
                description:
                  "Escribir el nombre de la normatividad infringida.",
              },
              articuloNormatividad: {
                type: "array",
                title: "Artículo (s) de la normatividad infringida",
                items: {
                  title: "Artículo (s)",
                  type: "string",
                  description: "Escribir el (los) artículo (s) infringido (s).",
                },
              },
              fraccionNormatividad: {
                type: "array",
                title: "Fracción (es) de la normatividad infringida",
                items: {
                  title: "Fracción (es)",
                  type: "string",
                  description:
                    "En su caso, escribir la (s) fracción (es) infringida (s).",
                },
              },
            },
          },
        },
        resolucion: {
          type: "object",
          title:
            "5. RESOLUCIÓN FIRME POR LA COMISIÓN DE DELITOS POR HECHOS DE CORRUPCIÓN",
          description:
            "En esta sección se señalarán los datos relativos a la resolución firme.",
          required: [
            "documentoResolucion",
            "fechaResolucion",
            "fechaNotificacion",
            "fechaResolucionFirme",
            "url",
          ],
          properties: {
            documentoResolucion: {
              type: "string",
              title: "Título del documento",
              description:
                "Escribir el nombre del documento de la resolución que resuelve el procedimiento.",
            },
            fechaResolucion: {
              type: "string",
              format: "date",
              title: "Fecha de resolución",
              description:
                "Colocar la fecha en la que se emite la resolución en formato DD-MM-AAAA.",
            },
            fechaNotificacion: {
              type: "string",
              format: "date",
              title: "Fecha de notificación",
              description:
                "Indicar la fecha en que se notifica la resolución en formato DD-MM-AAAA.",
            },
            urlNotificacion: {
              type: "string",
              title: "URL del documento en formato digital",
              description:
                "Colocar el enlace o link de la resolución firme emitida por la autoridad a la que corresponde la sanción en su versión pública.",
            },
            fechaResolucionFirme: {
              type: "string",
              format: "date",
              title: "Fecha de la resolución firme",
              description:
                "Colocar la fecha en que quedó firme la resolución en formato DD-MM-AAAA.",
            },
            fechaNotificacionFirme: {
              type: "string",
              format: "date",
              title: "Fecha de notificación de la resolución firme",
              description:
                "Indicar la fecha de notificación de la resolución firme a la persona física sancionada, en formato DD-MM-AAAA.",
            },
            urlResolucion: {
              type: "string",
              title: "URL del documento en formato digital",
              description:
                "Colocar el enlace o link de la resolución emitida por la autoridad a la que corresponde la sanción en su versión pública.",
            },
          },
        },
        tipoSancion: {
          type: "object",
          title: "6. TIPO DE SANCIÓN APLICADA A LA PERSONA FÍSICA",
          description:
            "En esta sección se indicará el tipo de sanción y/o sanciones impuestas a la persona física.",
          required: ["ordenJurisdiccional", "autoridadJurisdiccional", "autoridadInvestigadora", "sancion"],
          properties: {
            ordenJurisdiccional: {
              title: "Orden jurisdiccional de la sanción.",
              description: "Seleccionar: Federal o Estatal.",
              enum: ["FEDERAL", "ESTATAL"],
              enumNames: ["Federal", "Estatal"],
            },
            autoridadJurisdiccional: {
              type: "string",
              title: "Autoridad jurisdiccional",
              description:
                "Indicar el nombre de la autoridad facultada para aplicar la sanción.",
            },
            autoridadInvestigadora: {
              type: "string",
              title: "Autoridad investigadora",
              description:
                "Especificar el nombre de la autoridad encargada de la investigación.",
            },
            sancion: {
              type: "array",
              title: "Tipo de sanción",
              description:
                "En esta sección se podrá elegir una o varias sanciones conforme al catálogo y que fueron impuestas en la resolución definitiva. Se podrán elegir de las siguientes opciones:",
              items: {
                type: "object",
                required: ["clave"],
                properties: {
                  clave: {
                    title: "Tipo de sancion",
                    description:
                      "Elegir una o varias sanciones que fueron dictaminadas en la resolución, conforme a la o las elecciones del catálogo, es como deberá llenarse el resto del formato. Se podrán elegir de las siguientes opciones:",
                    enum: [
                      "INHABILITACION",
                      "PRISION",
                      "SANCION_ECONOMICA",
                      "OTRO",
                    ],
                    enumNames: [
                      "Inhabilitación",
                      "Prisión",
                      "Sanción económica",
                      "Otro",
                    ],
                  },
                },
                dependencies: {
                  clave: {
                    oneOf: [
                      {
                        properties: {
                          clave: {
                            enum: ["INHABILITACION"],
                          },
                          inhabilitacion: {
                            type: "object",
                            title:
                              "INHABILITACIÓN",
                            description:
                              "Este campo se deberá llenar si en la resolución se sancionó con una inhabilitación.",
                            required: ["plazo"],
                            properties: {
                              plazo: {
                                type: "object",
                                title: "Plazo de la inhabilitación",
                                description:
                                  "Colocar el plazo de la inhabilitación de la persona física sancionada, empezando por año (s), mes (es) y día (s).",
                                required: [
                                  "años",
                                  "meses",
                                  "dias",
                                  "fechaInicial",
                                  "fechaFinal",
                                ],
                                properties: {
                                  años: { title: "Año (s)", type: "string" },
                                  meses: { title: "Mes (es)", type: "string" },
                                  dias: { title: "Día (s)", type: "string" },
                                  fechaInicial: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha inicial",
                                    description:
                                      "Indicar la fecha en la que inició la inhabilitación de la persona física en formato DD-MM-AAAA.",
                                  },
                                  fechaFinal: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha final",
                                    description:
                                      "Indicar la fecha en la que se concluyó la inhabilitación en formato DD-MM-AAAA.",
                                  },
                                },
                              },
                            },
                          },
                        },
                        required: ["inhabilitacion"],
                      },
                      {
                        properties: {
                          clave: {
                            enum: ["PRISION"],
                          },
                          prision: {
                            type: "object",
                            title: "PRISIÓN",
                            properties: {
                              plazo: {
                                type: "object",
                                title: "Plazo de la prisión",
                                description:
                                  "Especificar el tiempo por el que la persona física se le condenó a prisión comenzando por año (s), mes (es) y día (s)",
                                required: ["años", "meses", "dias"],
                                properties: {
                                  años: { title: "Año (s)", type: "string" },
                                  meses: { title: "Mes (es)", type: "string" },
                                  dias: { title: "Día (s)", type: "string" },
                                },
                              },
                            },
                          },
                        },
                        required: ["prision"],
                      },
                      {
                        properties: {
                          clave: {
                            enum: ["SANCION_ECONOMICA"],
                          },
                          sancionEconomica: {
                            type: "object",
                            title: "SANCIÓN ECONÓMICA",
                            description:
                              "Llenar este apartado en caso de que la persona física sea acreedora a una sanción económica.",
                            required: [
                              "sancionImpuesta",
                              "plazo",
                              "cobrado",
                              "constancia",
                            ],
                            properties: {
                              sancionImpuesta: {
                                type: "object",
                                title: "",
                                required: ["monto", "moneda"],
                                properties: {
                                  monto: {
                                    type: "number",
                                    title: "Monto",
                                    description:
                                      "Colocar el monto total de la sanción económica.",
                                  },
                                  moneda: {
                                    title: "Moneda",
                                    description:
                                      "Seleccionar el tipo de moneda en formato de tres letras, establecidos en el ISO 4217.",
                                    enum: ["MXN", "UMA"],
                                  },
                                },
                              },
                              plazo: {
                                type: "object",
                                title: "Plazo de la sanción económica",
                                description:
                                  "Señalar el plazo para dar cumplimiento a la sanción económica empezando por año (s), mes (es) y día (s).",
                                required: ["años", "meses", "dias"],
                                properties: {
                                  años: { title: "Año (s)", type: "string" },
                                  meses: { title: "Mes (es)", type: "string" },
                                  dias: { title: "Día (s)", type: "string" },
                                },
                              },
                              cobrado: {
                                type: "object",
                                title:
                                  "Sanción económica efectivamente cobrada",
                                  description: "Indicar el monto efectivamente cobrado: monto y moneda.",
                                properties: {
                                  monto: {
                                    type: "number",
                                    title: "Monto",
                                    description:
                                      "Indicar el monto efectivamente cobrado",
                                  },
                                  moneda: {
                                    title: "Moneda",
                                    description:
                                      "Seleccionar el tipo de moneda en formato de tres letras, establecidos en el ISO 4217.",
                                    enum: ["MXN", "UMA"],
                                  },
                                  fecha: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha de cobro de la sanción",
                                    description:
                                      "Especificar la fecha en que se realizó el cobro de la sanción económica en formato DD-MM-AAAA.",
                                  },
                                  fechaPagoSancion: {
                                    type: "string",
                                    format: "date",
                                    title:
                                      "Fecha en la que se realizó el pago total de la sanción",
                                    description:
                                      "En caso de que la sanción económica no se realice en una sola exhibición, especificar la fecha en que la persona física cubrió el pago total de la sanción económica en formato DD-MM-AAAA.",
                                  },
                                },
                              },
                            },
                          },
                        },
                        required: ["sancionEconomica"],
                      },
                      {
                        properties: {
                          clave: {
                            enum: ["OTRO"],
                          },
                          otro: {
                            type: "object",
                            title: "OTRO",
                            description:
                              "Llenar este apartado en caso de que el particular sea acreedor a otra sanción prevista en las leyes locales de las entidades federativas.",
                            properties: {
                              nombre: {
                                title: "Denominación de la sanción",
                                type: "string",
                                description:
                                  "Indicar la denominación de la sanción.",
                              },
                            },
                          },
                        },
                        required: ["otro"],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        observaciones: {
          title: "7. OBSERVACIONES",
          type: "string",
          description:
            "En este espacio se podrán realizar las observaciones que se consideren pertinentes. aclaraciones u En virtud de que las aclaraciones pueden contener información reservada y/o confidencial, esta información no será de carácter pública.",
        },
      },
    },
  },
};

export default schema;
