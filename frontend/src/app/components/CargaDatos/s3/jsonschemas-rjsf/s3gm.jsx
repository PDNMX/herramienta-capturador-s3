// ACTOS DE PARTICULARES VINCULADOS CON FALTAS GRAVES - PERSONAS MORALES (4)
let data = {
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
    general: {
      type: "object",
      required: ["nombres", "primerApellido", "segundoApellido", "rfc"],
      properties: {
        nombres: {
          type: "string",
          title: "Nombre (s)",
          description:
            "Escribir el o los nombres completos, sin abreviaturas, sin acentos, ni signos especiales.",
        },
        primerApellido: {
          type: "string",
          title: "Primer Apellido",
          description:
            "Escribir el primer apellido completo, sin abreviaturas, sin acentos, ni signos especiales.",
        },
        segundoApellido: {
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
                      title: "Segundo Apellido",
                      description:
                        "En caso de tener solo un apellido, deberá colocarse en el espacio del primer apellido y dejar el espacio del segundo apellido en blanco y posteriormente seleccionar la opción de: No cuento con segundo apellido.",
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
          description:
            "Escribir los primeros diez caracteres básicos y los tres correspondientes a la homoclave. En caso de no contar con este dato, podrá consultarlo en la página del Servicio de Administración Tributaria: https://www.sat.gob.mx/aplicacion/operacion/31274/consulta-tu-clave-de-rfc-mediante-curp",
        },
        curp: {
          type: "string",
          title: "CURP",
          description:
            "Escribir los dieciocho caracteres alfanuméricos como la emitió la Secretaría de Gobernación.  En caso de no contar con ella, podrá consultarla en la siguiente página: https://www.gob.mx/curp/",
        },
      },
    },
    constancias: {
      type: "object",
      properties: {
        sinConstancia: {
          type: "boolean",
          default: false,
          title: "No existe constancia",
        },
      },
      dependencies: {
        sinConstancia: {
          oneOf: [
            {
              properties: {
                sinConstancia: { const: false },
                titulo: {
                  type: "string",
                  title: "Título de la constancia.",
                  description:
                    "Proporcionar el nombre del título de la constancia de la inhabilitación.",
                },
                fecha: {
                  type: "string",
                  format: "date",
                  title: "Fecha de la expedición.",
                  description:
                    "Indicar la fecha de expedición de la constancia de la persona física en formato dd-mm-aaaa.",
                },
                url: {
                  type: "string",
                  title: "URL de la constancia de inhabilitación",
                  description:
                    "Colocar el enlace o link del documento digital de la constancia.",
                },
              },
              required: ["sinConstancia", "titulo", "fecha", "url"],
            },
            {
              properties: {
                sinConstaancia: { const: true },
              },
              required: ["sinConstancia"],
            },
          ],
        },
      },
    },
  },
  type: "object",
  required: ["expediente", "graveMorales"],
  properties: {
    expediente: {
      type: "string",
      title: "Expediente",
      description: "Registrar el número de expediente del procedimiento.",
    },
    graveMorales: {
      title: "1. DATOS GENERALES DE LA PERSONA MORAL",
      description:
        "En esta sección se registrarán los datos generales de la persona moral sancionada.",
      type: "object",
      required: [
        "rfc",
        "razonSocial",
        "domicilioMexico",
        "entePublico",
        "faltaCometida",
        "origenInvestigacion",
        "resolucion",
        "tipoSancion",
      ],
      properties: {
        rfc: {
          type: "string",
          title: "RFC con homoclave",
        },
        //Homologar ya que en el documento de descripciones vienen en otro orden los campos
        razonSocial: {
          type: "string",
          title: "Denominación/Razón social",
          description:
            "Deberá proporcionar la denominación o razón social de la institución tal y como se encuentra registrada en la escritura pública.",
        },
        telefono: {
          type: "string",
          title: "Teléfono",
        },
        //Falta descripcion en el documento checar
        objetoSocial: {
          type: "string",
          title: "Objeto social de la actividad",
          description:
            "Describir la o las actividades principales que lleva a cabo la persona moral.",
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
                      description:
                        "Indicar los siguientes datos: ciudad, provincia, calle, número exterior, número interior (si aplica), código postal, país.",
                      required: [
                        "vialidad",
                        "localidad",
                        "municipio",
                        "codigoPostal",
                        "entidadFederativa",
                      ],
                      properties: {
                        //falta hacer las descripciones para cada uno de los campos de Domicilio Mexico
                        vialidad: {
                          type: "object",
                          required: [
                            "clave",
                            "valor",
                            "numeroExterior",
                            "numeroInterior",
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
                      description:
                        "Indicar los siguientes datos: ciudad, provincia, calle, número exterior, número interior (si aplica), código postal, país.",
                      required: [
                        "ciudadLocalidad",
                        "estadoProvincia",
                        "calle",
                        "numeroExterior",
                        "numeroInterior",
                        "codigoPostal",
                        "pais",
                      ],
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
        directorApoderado: {
          type: "object",
          title:
            "2. DATOS GENERALES DEL DIRECTOR GENERAL Y APODERADO LEGAL DE LA PERSONA MORAL",
          description:
            "En este apartado se indicaran los datos del Director General y el Apoderado Legal de la persona moral. ",
          properties: {
            directorGeneral: {
              title: "Director general de la persona moral",
              description:
                "En este apartado se indicaran los datos del Director General de la persona moral.",
              $ref: "#/definitions/general",
            },
            representanteLegal: {
              title: "Representante legal de la persona moral",
              description:
                "En este apartado se indicaran los datos del Apoderado Legal de la persona moral.",
              $ref: "#/definitions/general",
            },
          },
        },
        entePublico: {
          type: "object",
          title:
            "3. DATOS DEL ENTE PÚBLICO EN DONDE SE COMETIÓ LA FALTA ADMINISTRATIVA",
          description:
            "Indicar (si aplica) los datos del ente público donde se cometió la falta administrativa.",
          properties: {
            entidadFederativa: {
              title: "Entidad federativa",
              description:
                "Seleccionar la entidad federativa en la cual se localiza el ente público donde se cometió la falta administrativa.",
              $ref: "#/definitions/entidad",
            },
            nivelOdenGobierno: {
              type: "object",
              properties: {
                clave: {
                  title: "Nivel/Orden de Gobierno",
                  description:
                    "Seleccionar el nivel u orden de gobierno al que pertenece el ente público donde se cometió la falta administrativa: Federal, Estatal, Municipal/Alcaldía u otro (especificar).",
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
                "Escribir el nombre completo del ente público sin abreviaturas, sin acentos, ni signos especiales.",
            },
            siglas: {
              type: "string",
              title: "Siglas del ente público",
              description: "Escribir (si aplica) las siglas del ente público.",
            },
          },
        },
        origenInvestigacion: {
          type: "object",
          title: "4. ORIGEN DE LA FALTA ADMINISTRATIVA",
          description:
            "Señalar el motivo que dio origen a la investigación por la realización de actos vinculados con faltas administrativas graves por parte de la persona moral.",
          properties: {
            clave: {
              title: "Origen de la falta administrativa",
              description:
                "Seleccionar conforme al catálogo el origen de la falta administrativa:",
              //preguntar cual catalogo esta correcto si el de la hoja del formato o el documento de descripciones
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
          title: "5. FALTA COMETIDA DE LA PERSONA MORAL",
          items: {
            type: "object",
            title: "Falta cometida",
            required: [
              "clave",
              "nombreNormatividadInfringida",
              "articuloNormatividadInfringida",
              "fraccionNormatividadInfringida",
            ],
            properties: {
              clave: {
                title: "Falta cometida",
                description:
                  "Seleccionar el tipo de falta cometida por parte de la persona moral sancionada.",
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
              nombreNormatividadInfringida: {
                type: "string",
                title: "Nombre de la Ley y/o Normatividad infringida",
                description:
                  "Escribir el nombre de la ley o normatividad infringida.",
              },
              articuloNormatividadInfringida: {
                type: "array",
                title: "Artículo infringida",
                items: {
                  title: "Artículo",
                  type: "string",
                  description:
                    "Escribir el artículo(s) infringido de la normatividad infringida.",
                },
              },
              fraccionNormatividadInfringida: {
                type: "array",
                title: "Fracción infringida",
                items: {
                  title: "Fracción",
                  type: "string",
                  description:
                    "Escribir la fracción(s) infringida de la normatividad infringida.",
                },
              },
              //Colocar en el documento de descripciones o en caso quitarla
              descripcionHechos: {
                title: "Descripción breve de los hechos",
                type: "string",
                description: "Señalar una descripción breve de los hechos. ",
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
          title: "6. RESOLUCIÓN DE LA FALTA COMETIDA POR LA PERSONA MORAL",
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
              title: "Titulo del documento",
              description:
                "Escribir el nombre del documento de la resolución que resuelve el procedimiento de responsabilidad administrativa y que ha quedado firme.",
            },
            fechaResolucion: {
              type: "string",
              format: "date",
              title: "Fecha de resolución",
              description:
                "Colocar la fecha en la que se emite la resolución firme en formato dd-mm-aaaa.",
            },
            fechaNotificacion: {
              type: "string",
              format: "date",
              title: "Fecha de notificación",
              description:
                "Indicar la fecha en que se notifica la resolución firme en formato dd-mm-aaaa.",
            },
            //falta descripcion en el documento
            urlNotificacion: {
              type: "string",
              title: "URL del documento en formato digital",
              description:
                "Colocar el enlace o link de la resolución firme emitida por la autoridad a la que corresponde la sanción en su versión pública.",
            },
            fechaResolucionFirme: {
              type: "string",
              format: "date",
              title: "Fecha de resolución firme",
              description:
                "Colocar la fecha en que quedó firme la resolución en formato dd-mm-aaaa.",
            },
            fechaNotificacionFirme: {
              type: "string",
              format: "date",
              title: "Fecha de notificación firme",
              description:
                "Indicar la fecha de notificación de la resolución firme a la persona moral sancionada, en formato dd-mm-aaaa.",
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
          title: "7. TIPO DE SANCIÓN APLICADA A LA PERSONA MORAL",
          description:
            "En esta sección se indicará la sanción y/o sanciones impuestas a la persona moral.",
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
              description: "Seleccionar: Federal o Estatal.",
              enum: ["FEDERAL", "ESTATAL"],
              enumNames: ["Federal", "Estatal"],
            },
            autoridadResolutora: {
              type: "string",
              title: "Nombre de la autoridad sancionadora",
              description:
                "Indicar el nombre de la autoridad facultada para aplicar la sanción.",
            },
            autoridadInvestigadora: {
              type: "string",
              title: "Nombre de la autoridad investigadora",
              description:
                "Especificar el nombre de la autoridad encargada de la investigación.",
            },
            autoridadSubstanciadora: {
              type: "string",
              title: "Nombre de la autoridad substanciadora.",
              description:
                "Señalar el nombre de la autoridad substanciadora del procedimiento.",
            },
            //Corregir el documento de descripciones ya que en las opciones falta agregar las demas opciones del campo
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
                    title: "Tipo de sancion",
                    enum: [
                      "INHABILITACION",
                      "INDEMNIZACION",
                      "SANCION_ECONOMICA",
                      "SUSPENSION_DE_ACTIVIDADES",
                      "DISOLUCION_DE_LA_SOCIEDAD",
                      "OTRO",
                    ],
                    enumNames: [
                      "Inhabilitación",
                      "Indemnización",
                      "Sanción económica",
                      "Suspensión de actividades",
                      "Disolución de la sociedad",
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
                            title: "INHABILITACIÓN",
                            description:
                              "Este campo se deberá llenar si en la resolución se sancionó con una inhabilitación.",
                            required: ["plazo", "constancia"],
                            properties: {
                              plazo: {
                                type: "object",
                                title: "Plazo de la sanción",
                                description:
                                  "Colocar el plazo de la inhabilitación de la persona moral sancionada, empezando por año(s), mes(es) y día(s).",
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
                                    title: "Fecha inicial de la inhabilitación",
                                    description:
                                      "Indicar la fecha en la que inició la inhabilitación de la persona moral en formato dd-mm-aaaa.",
                                  },
                                  fechaFinal: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha final de la inhabilitación",
                                    description:
                                      "Indicar la fecha en la que se concluyó la inhabilitación en formato dd-mm-aaaa.",
                                  },
                                },
                              },
                              constancia: {
                                title: "Constancia de la inhabilitación",
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
                        required: ["descripcion", "indemnizacion"],
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
                            enum: ["SUSPENSION_DE_ACTIVIDADES"],
                          },
                          suspensionActividades: {
                            type: "object",
                            title: "SUSPENSIÓN DE ACTIVIDADES",
                            required: ["plazo", "constancia"],
                            properties: {
                              plazo: {
                                type: "object",
                                title: "Plazo de la suspensión",
                                description:
                                  "Señalar el plazo de la suspensión de actividades: años, meses y días.",
                                required: [
                                  "años",
                                  "meses",
                                  "dias",
                                  "fechaInicial",
                                  "fechaFinal",
                                ],
                                properties: {
                                  años: { title: "Años", type: "string" },
                                  meses: { title: "Meses", type: "string" },
                                  dias: { title: "Días", type: "string" },
                                  fechaInicial: {
                                    title: "Fecha inicial",
                                    type: "string",
                                    format: "date",
                                    description:
                                      "Registrar la fecha en la que inició la suspensión de actividades de la persona moral en formato dd-mm-aaaa.",
                                  },
                                  fechaFinal: {
                                    title: "Fecha final",
                                    type: "string",
                                    format: "date",
                                    description:
                                      "Indicar la fecha en la que se concluyó la suspensión de actividades de la persona moral en formato dd-mm-aaaa.",
                                  },
                                },
                              },
                            },
                          },
                        },
                        required: ["descripcion", "suspensionActividades"],
                      },
                      {
                        properties: {
                          clave: {
                            enum: ["DISOLUCION_DE_LA_SOCIEDAD"],
                          },
                          disolucionSociedad: {
                            type: "object",
                            title: "DISOLUCIÓN DE LA SOCIEDAD",
                            required: ["fechaDisolucion", "constancia"],
                            properties: {
                              fechaDisolucion: {
                                title: "Fecha de la disolución",
                                type: "string",
                                format: "date",
                                description:
                                  "Especificar la fecha a partir de la cual se disuelve la sociedad de la persona moral en forma dd-mm-aaaa. ",
                              },
                            },
                          },
                        },
                        required: ["descripcion", "disolucionSociedad"],
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
                            required: ["nombre"],
                            properties: {
                              nombre: {
                                title: "Nombre de la sanción",
                                type: "string",
                                description:
                                  "Indicar el nombre de la sanción ",
                              },
                              //preguntar si va el campo de descripcion de los hechos
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
          title: "8. OBSERVACIONES",
          type: "string",
          description:
            "En este espacio podrá realizar las aclaraciones u observaciones que considere pertinentes respecto de alguno o algunos de los apartados del documento.",
        },
      },
    },
  },
};

export default data;
