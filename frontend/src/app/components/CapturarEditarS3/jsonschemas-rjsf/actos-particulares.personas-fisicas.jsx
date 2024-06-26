// ACTOS DE PARTICULARES VINCULADOS CON FALTAS GRAVES - PERSONAS FISICAS (3)
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
  required: ["expediente", "graveFisica"],
  properties: {
    expediente: {
      type: "string",
      title: "Expediente",
      description: "Registrar el número de expediente del procedimiento.",
    },
    graveFisica: {
      title: "1. DATOS GENERALES DE LA PERSONA FÍSICA SANCIONADA",
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
        "faltaCometida",
        "origenInvestigacion",
        "resolucion",
        "tipoSancion",
      ],
      properties: {
        nombres: {
          type: "string",
          title: "Nombre(s)",
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
          title: "Segundo Apellido",
          type: "object",
          properties: {
            sinSegundoApellido: {
              type: "boolean",
              default: false,
              title: "No cuento con segundo apellido.",
              description:
                "En caso de tener solo un apellido, deberá colocarse en el espacio del primer apellido y dejar el espacio del segundo apellido en blanco y posteriormente seleccionar la opción de:",
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
                        "Escribir el segundo apellido completo, sin abreviaturas, sin acentos, ni signos especiales.",
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
                      title: "Domicilio",
                      required: [
                        "vialidad",
                        "localidad",
                        "municipio",
                        "codigoPostal",
                        "entidadFederativa",
                      ],
                      description:
                        "Indicar los siguientes datos: ciudad, provincia, calle, número exterior, número interior (si aplica), código postal, país.",
                      properties: {
                        vialidad: {
                          type: "object",
                          required: [
                            "clave",
                            "valor",
                            "numeroExterior",
                            "colonia",
                          ],
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
                          description: "Nombre del municipio/alcaldia.",
                        },
                        codigoPostal: {
                          type: "integer",
                          title: "Codigo Postal",
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
                      properties: [
                        "ciudadLocalidad",
                        "estadoProvincia",
                        "calle",
                        "numeroExterior",
                        "codigoPostal",
                        "pais",
                      ],
                      description:
                        "Indicar los siguientes datos: ciudad, provincia, calle, número exterior, número interior (si aplica), código postal, país.",
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
                          title: "Codigo Postal",
                          description:
                            "Escribir el codigo postal del domicilio extranjero.",
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
            "2. DATOS DEL ENTE PÚBLICO EN DONDE SE COMETIÓ LA FALTA ADMINISTRATIVA",
          description:
            "Indicar (si aplica) los datos del ente público donde se cometió la falta administrativa.",
          properties: {
            entidadFederativa: {
              title: "Entidad federativa",
              description:
                "Seleccionar la entidad federativa en la cual se localiza el ente público donde se cometió la falta administrativa.",
              $ref: "#/definitions/entidad",
            },
            nivelOrdenGobierno: {
              type: "object",
              properties: {
                clave: {
                  title: "Nivel/Orden de Gobierno",
                  description:
                    "Seleccionar el nivel u orden de gobierno al que pertenece el ente público donde se cometió la falta administrativa:",
                  enum: ["FEDERAL", "ESTATAL", "MUNICIPAL_ALCALDIA", "OTRO"],
                  enumNames: [
                    "Federal",
                    "Estatal",
                    "Municipal y/o Alcadía",
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
              description: "Seleccionar el ámbito público:",
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
        },
        origenInvestigacion: {
          type: "object",
          title: "3. ORIGEN DEL PROCEDIMIENTO",
          properties: {
            clave: {
              title: "Origen del procedimiento",
              description:
                "Señalar el motivo que dio origen a la investigación por la realización de actos vinculados con faltas administrativas graves por parte de la persona física.",
              enum: [
                "AUDITORIA_SUPERIOR",
                "AUDITORIA_OIC",
                "OFICIO",
                "DENUNCIA_CIUDADADA",
                "DENUNCIA_SP",
                "OTRO",
              ],
              enumNames: [
                "Auditoria superior de la federación o entidades de fiscalización superior de la entidades federativas",
                "Auditoria del organo interno de control del ente público",
                "De Oficio",
                "Denuncia ciudadana",
                "Denuncia de servidor publico",
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
                      enum: [
                        "AUDITORIA_SUPERIOR",
                        "AUDITORIA_OIC",
                        "OFICIO",
                        "DENUNCIA_CIUDADADA",
                        "DENUNCIA_SP",
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
        faltaCometida: {
          type: "array",
          title: "4. TIPO DE FALTA COMEDITA POR LA PERSONA FÍSICA SANCIONADA",
          items: {
            type: "object",
            title: "Falta cometida",
            required: [
              "clave",
              "nombreNormatividad",
              "articuloNormatividad",
              "fraccionNormatividad",
            ],
            properties: {
              clave: {
                title: "Falta cometida",
                description:
                  "Seleccionar el tipo de falta cometida por parte de la persona física sancionada.",
                enum: [
                  "SOBORNO",
                  "PARTICIPACION_ILICITA",
                  "TRAFICO_DE_INFLUENCIAS",
                  "UTILIZACION_DE_INFORMACION_FALSA",
                  "COLUSION",
                  "OBSTRUCCION_DE_FACULTADES",
                  "CONTRATACION_INDEBIDA",
                  "USO_INDEBIDO_DE_RECURSOS_PUBLICOS",
                  "OTRO",
                ],
                enumNames: [
                  "Soborno",
                  "Participación ilícita",
                  "Tráfico de influencias",
                  "Utilización de información falsa",
                  "Colusión",
                  "Obstrucción de facultades",
                  "Contratación indebida",
                  "Uso indebido de recursos públicos",
                  "Otro",
                ],
              },
              nombreNormatividad: {
                type: "string",
                title: "Normatividad infringida",
                description:
                  "Escribir el nombre de la ley o normatividad infringida.",
              },
              articuloNormatividad: {
                type: "array",
                //preguntar por que cambia el nombre para ver si queda en plural o no
                title: "Artículo(s) infringido",
                items: {
                  title: "Artículo",
                  type: "string",
                  description: "Escribir el(los) artículo(s) infringido(s).",
                },
              },
              fraccionNormatividad: {
                type: "array",
                //preguntar por que cambia el nombre para ver si queda en plural o no
                title: "Fracción(es) infringida",
                items: {
                  title: "Fracción",
                  type: "string",
                  description:
                    "En su caso, escribir la(s) fracción(es) infringida(s).",
                },
              },
              descripcionHechos: {
                title: "Descripción breve de los hechos",
                type: "string",
                description:
                  "Proporcionar una descripción breve de los hechos, sin incluir información reservada ni confidencial.",
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
                        enum: [
                          "SOBORNO",
                          "PARTICIPACION_ILICITA",
                          "TRAFICO_DE_INFLUENCIAS",
                          "UTILIZACION_DE_INFORMACION_FALSA",
                          "COLUSION",
                          "OBSTRUCCION_DE_FACULTADES",
                          "CONTRATACION_INDEBIDA",
                          "USO_INDEBIDO_DE_RECURSOS_PUBLICOS",
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        resolucion: {
          type: "object",
          title: "5. RESOLUCIÓN DE LA FALTA COMETIDA POR LA PERSONA FÍSICA",
          description:
            "En esta sección se señalarán los datos relativos a la resolución firme.",
          required: [
            "documentoResolucion",
            "fechaResolucion",
            "fechaNotificacion",
            "fechaResolucionFirme",
            "fechaNotificacionFirme",
          ],
          properties: {
            documentoResolucion: {
              type: "string",
              title: "Título del documento",
              description:
                "Escribir el nombre del documento de la resolución definitiva que resuelve el procedimiento de responsabilidad administrativa y que ha quedado firme, sin abreviaturas, sin acentos, ni signos especiales.",
            },
            fechaResolucion: {
              type: "string",
              format: "date",
              title: "Fecha de la resolución",
              description:
                "Colocar la fecha en la que se emite la resolución sancionatoria en formato DD-MM-AAAA.",
            },
            fechaNotificacion: {
              type: "string",
              format: "date",
              title: "Fecha de notificación",
              description:
                "Indicar la fecha en que se notifica la resolución a la persona servidora pública sancionada, en formato DD-MM-AAAA. ",
            },
            urlResolucion: {
              type: "string",
              title: "URL del documento en formato digital",
              description:
                "Colocar el enlace o link de la resolución emitida por la autoridad a la que corresponde la sanción, en su versión pública.",
            },
            fechaResolucionFirme: {
              type: "string",
              format: "date",
              title: "Fecha de resolución firme",
              description:
                "Colocar la fecha en que quedó firme la resolución de la persona servidora pública en formato DD-MM-AAAA.",
            },
            fechaNotificacionFirme: {
              type: "string",
              format: "date",
              title: "Fecha de notificación de la resolución firme",
              description:
                "Indicar la fecha en que se notifica la resolución firme a la persona servidora pública sancionada.",
            },
            urlResolucionFirme: {
              type: "string",
              title: "URL del documento en formato digital",
              description:
                "Colocar el enlace o link del acuerdo o resolución firme emitida por la autoridad a la que corresponde la sanción, en su versión pública.",
            },
          },
        },
        tipoSancion: {
          type: "object",
          title: "6. TIPO DE SANCIÓN APLICADA A LA PERSONA FÍSICA",
          description:
            "En esta sección se indicará la sanción y/o sanciones impuestas a la persona física.",
          required: [
            "ordenJurisdiccional",
            "autoridadResolutora",
            "autoridadInvestigadora",
            "autoridadSubstanciadora",
            "sancion",
          ],
          properties: {
            ordenJurisdiccional: {
              title: "Orden jurisdiccional de la sanción.",
              description: "Seleccionar:",
              enum: ["FEDERAL", "ESTATAL"],
              enumNames: ["Federal", "Estatal"],
            },
            autoridadResolutora: {
              type: "string",
              title: "Autoridad resolutora",
              description:
                "Indicar el nombre de la autoridad facultada para aplicar la sanción.",
            },
            autoridadInvestigadora: {
              type: "string",
              title: "Autoridad investigadora",
              description:
                "Especificar el nombre de la autoridad encargada de la investigación.",
            },
            autoridadSubstanciadora: {
              type: "string",
              title: "Autoridad substanciadora ",
              description:
                "Señalar el nombre de la autoridad substanciadora del procedimiento.",
            },
            sancion: {
              type: "array",
              title: "Tipo de sancion",
              description:
                "En esta sección se podrá elegir una o varias sanciones conforme al catálogo y que fueron impuestas en la resolución definitiva. Se podrán elegir de las siguientes opciones:",
              items: {
                type: "object",
                title: "Tipo de sancion",
                required: ["clave"],
                properties: {
                  clave: {
                    enum: [
                      "INHABILITADO",
                      "INDEMNIZACION",
                      "SANCION_ECONOMICA",
                      "OTRO",
                    ],
                    enumNames: [
                      "Inhabilitación",
                      "Indemnización",
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
                            enum: ["INHABILITADO"],
                          },
                          inhabilitado: {
                            type: "object",
                            //revisar el nombre ya que cambia para personas fisicas y personas morales
                            title:
                              "INHABILITACIÓN TEMPORAL PARA PARA PARTICIPAR EN ADQUISICIONES, ARRENDAMIENTOS, SERVICIOS U OBRAS PÚBLICAS.",
                            description:
                              "Este campo se deberá llenar si en la resolución se sancionó con una inhabilitación.",
                            required: ["plazo"],
                            properties: {
                              plazo: {
                                //Homologar con el de Servidores Publicos o dejar como esta en el formato de este formulario
                                type: "object",
                                title: "Plazo de la inhabilitación",
                                description:
                                  "Colocar el plazo de la inhabilitación de la persona física sancionada, empezando por año(s), mes(es) y día(s).",
                                required: [
                                  "años",
                                  "meses",
                                  "dias",
                                  "fechaInicial",
                                  "fechaFinal",
                                ],
                                properties: {
                                  años: { title: "Año(s)", type: "string" },
                                  meses: { title: "Mes(es)", type: "string" },
                                  dias: { title: "Día(s)", type: "string" },
                                  fechaInicial: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha inicial",
                                    description:
                                      "Indicar la fecha en la que inició la inhabilitación de la persona física en formato dd-mm-aaaa.",
                                  },
                                  fechaFinal: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha final",
                                    description:
                                      "Indicar la fecha en la que se concluyó la inhabilitación en formato dd-mm-aaaa.",
                                  },
                                },
                              },
                              constancia: {
                                title:
                                  "Título de la constancia de inhabilitación.",
                                $ref: "#/definitions/constancias",
                              },
                            },
                          },
                        },
                        required: ["descripcion", "inhabilitacion"],
                      },
                      {
                        properties: {
                          clave: {
                            enum: ["INDEMNIZACION"],
                          },
                          indemnizacion: {
                            type: "object",
                            title: "INDEMNIZACIÓN",
                            required: [
                              "indemnizacionImpuesta",
                              "plazo",
                              "cobrada",
                            ],
                            properties: {
                              indemnizacionImpuesta: {
                                type: "object",
                                title: "Indemnización impuesta",
                                required: ["monto", "moneda"],
                                properties: {
                                  monto: {
                                    type: "number",
                                    title: "Monto",
                                    description:
                                      "Colocar el monto total de la indemnización.",
                                  },
                                  moneda: {
                                    title: "Moneda",
                                    description:
                                      "Colocar el tipo de moneda en formato de tres letras, establecidos en el ISO 4217.",
                                    enum: ["MXN", "UMA"],
                                  },
                                },
                              },
                              plazo: {
                                type: "object",
                                title: "Plazo de pago",
                                description:
                                  "Señalar el plazo para dar cumplimiento a la indemnización: años, meses y días.",
                                required: ["años", "meses", "dias"],
                                properties: {
                                  años: { title: "Años", type: "string" },
                                  meses: { title: "Meses", type: "string" },
                                  dias: { title: "Días", type: "string" },
                                },
                              },
                              cobrada: {
                                type: "object",
                                title: "Indemnización efectivamente cobrada",
                                description:
                                  "Indicar el monto efectivamente cobrado: monto y moneda",
                                required: [
                                  "monto",
                                  "moneda",
                                  "fecha",
                                  "fechaPagoSancion",
                                ],
                                properties: {
                                  monto: {
                                    type: "number",
                                    title: "Monto",
                                    description:
                                      "Colocar el monto total de la indemnización efectivamente cobrada.",
                                  },
                                  moneda: {
                                    title: "Moneda",
                                    description:
                                      "Colocar el tipo de moneda en formato de tres letras, establecidos en el ISO 4217.",
                                    enum: ["MXN", "UMA"],
                                  },
                                  fecha: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha de cobro de la indemnización",
                                    description:
                                      "Especificar la fecha en que se realizó el cobro en formato dd-mm-aaaa.",
                                  },
                                  fechaPagoSancion: {
                                    type: "string",
                                    format: "date",
                                    title:
                                      "Fecha en que se realizó el pago total de la indemnización",
                                    description:
                                      "En caso de el pago de la indemnización no se realice en una sola exhibición, especificar la fecha en que la persona física cubrió el pago total de la sanción económica en formato dd-mm-aaaa.",
                                  },
                                },
                              },
                            },
                          },
                        },
                        required: ["indemnizacion"],
                      },
                      {
                        properties: {
                          clave: {
                            enum: ["SANCION_ECONOMICA"],
                          },
                          sancionEconomica: {
                            type: "object",
                            title: "SANCIÓN ECONÓMICA",
                            required: [
                              "sancionImpuesta",
                              "plazo",
                              "cobrada",
                              "constancia",
                            ],
                            properties: {
                              sancionImpuesta: {
                                type: "object",
                                title: "Sanción econónomica impuesta",
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
                                      "Colocar el tipo de moneda en formato de tres letras, establecidos en el ISO 4217.",
                                    enum: ["MXN", "UMA"],
                                  },
                                },
                              },
                              plazo: {
                                type: "object",
                                title: "Plazo de la sanción económica",
                                description:
                                  "Señalar el plazo para dar cumplimiento a la sanción económica: años, meses y días.",
                                required: ["años", "meses", "dias"],
                                properties: {
                                  años: { title: "Años", type: "string" },
                                  meses: { title: "Meses", type: "string" },
                                  dias: { title: "Días", type: "string" },
                                },
                              },
                              cobrada: {
                                type: "object",
                                title:
                                  "Sanción económica efectivamente cobrada",
                                description:
                                  "Indicar el monto efectivamente cobrado: monto y moneda ",
                                required: [
                                  "monto",
                                  "moneda",
                                  "fecha",
                                  "fechaPagoSancion",
                                ],
                                properties: {
                                  monto: {
                                    type: "number",
                                    title: "Monto",
                                    description:
                                      "Colocar el monto total de la sanción económica efectivamente cobrada.",
                                  },
                                  moneda: {
                                    title: "Moneda",
                                    description:
                                      "Colocar el tipo de moneda en formato de tres letras, establecidos en el ISO 4217.",
                                    enum: ["MXN", "UMA"],
                                  },
                                  fecha: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha de cobro de la sanción ",
                                    description:
                                      "Especificar la fecha en que se realizó el cobro de la sanción económica en formato dd-mm-aaaa.",
                                  },
                                  fechaPagoSancion: {
                                    type: "string",
                                    format: "date",
                                    title:
                                      "Fecha en que se realizó el pago total de la sanción ",
                                    description:
                                      "En caso de que la sanción económica no se realice en una sola exhibición, especificar la fecha en que la persona física cubrió el pago total de la sanción económica en formato dd-mm-aaaa.",
                                  },
                                },
                              },
                            },
                          },
                        },
                        required: ["descripcion", "sancionEconomica"],
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
                              "Llenar este apartado en caso de que el particular sea acreedor a otra sanción prevista en las leyes locales anticorrupción de las entidades federativas.",
                            required: ["nombre", "urlDocumento"],
                            properties: {
                              //preguntar si esta opcion no va como la de servidores publicos con denominacion de la sancion y la descripcion de los hechos
                              nombre: {
                                title: "Nombre de la sanción",
                                type: "string",
                                description: "Indicar el nombre de la sanción ",
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
            "En este espacio podrá realizar las aclaraciones u observaciones que considere pertinentes respecto de alguno o algunos de los apartados del documento.",
        },
      },
    },
  },
};

export default schema;
