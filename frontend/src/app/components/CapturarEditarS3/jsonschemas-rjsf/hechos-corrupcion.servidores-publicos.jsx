// HECHOS DE CORRUPCION - SERVIDORES PUBLICOS (7)
let schema = {
  definitions: {
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
  required: ["expediente", "hechosServidores"],
  properties: {
    expediente: {
      type: "string",
      title: "Expediente",
      description: "Registrar el número de expediente del procedimiento.",
    },
    hechosServidores: {
      title: "1. DATOS GENERALES DE LA PERSONA SERVIDORA PÚBLICA SANCIONADA",
      description:
        "En esta sección se registrarán los datos generales de la persona servidora pública.",
      type: "object",
      required: [
        "nombres",
        "primerApellido",
        "segundoApellido",
        "curp",
        "rfc",
        "sexo",
        "entePublico",
        "empleoCargoComision",
        "origenInvestigacion",
        "resolucion",
        "tipoSancion",
      ],
      properties: {
        nombres: {
          type: "string",
          title: "Nombre(s)",
          description:
            "Escribir el o los nombres completos, sin abreviaturas, sin acentos, ni signos especiales.",
        },
        primerApellido: {
          type: "string",
          title: "Primer apellido",
          description:
            "Escribir el primer apellido completo, sin abreviaturas, sin acentos, ni signos especiales.",
        },
        segundoApellido: {
          title: "Segundo Apellido",
          type: "object",
          properties: {
            sinSegundoApellido: {
              type: "boolean",
              default: false,
              title: "No cuento con segundo apellido.",
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
                        "En caso de tener solo un apellido, deberá colocarse en el espacio del primer apellido y dejar el espacio del segundo apellido en blanco y posteriormente seleccionar la opción de: No cuento con segundo apellido.",
                    },
                  },
                  required: ["sinSegundoApellido", "valor"],
                },
              ],
            },
          },
        },
        curp: {
          type: "string",
          title: "CURP",
          description:
            "Escribir los dieciocho caracteres alfanuméricos como la emitió la Secretaría de Gobernación.En caso de no contar con ella, podrá consultarla en la siguiente página: https://www.gob.mx/curp/ ",
        },
        rfc: {
          type: "string",
          title: "RFC con homoclave",
          description:
            "Escribir los primeros diez caracteres básicos y los tres correspondientes a la homoclave. En caso de no contar con este dato, podrá consultarlo en la página del Servicio de Administración Tributaria: https://www.sat.gob.mx/aplicacion/operacion/31274/consulta-tu-clave-de-rfc-mediante-curp",
        },
        sexo: {
          type: "string",
          enum: ["FEMENINO", "MASCULINO"],
          enumNames: ["Femenino", "Masculino"],
          title: "Sexo",
          description:
            "Seleccionar la opción que corresponda: femenino/masculino.",
        },
        entePublico: {
          type: "object",
          //Homologar con el formato o especificar el correcto
          title:
            "2.	DATOS DEL ENTE PÚBLICO EN DONDE SE COMETIÓ EL HECHO DE CORRUPCIÓN",
          description:
            "Indicar los datos de empleo, cargo o comisión conforme a los catálogos de cada sección.",
          required: [
            "entidadFederativa",
            "nivelOrdenGobierno",
            "ambitoPublico",
            "nombre",
          ],
          properties: {
            entidadFederativa: {
              title: "Entidad federativa",
              description:
                "Seleccionar la entidad federativa en la cual se localiza el ente público donde labora la persona servidora pública sancionada.",
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
            nivelOrdenGobierno: {
              type: "object",
              properties: {
                clave: {
                  title: "Nivel/Orden de Gobierno",
                  description:
                    "Seleccionar el orden de gobierno al que pertenece el ente público donde labora la persona servidora pública sancionada: Federal, Estatal, Municipal/Alcaldía u otro (especificar).",
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
                "Seleccionar el ámbito público del ente público donde labora la persona servidora pública sancionada: Ejecutivo, Legislativo, Judicial u Órgano autónomo.",
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
                "Escribir el nombre completo del ente público donde labora la persona servidora pública sancionada, sin abreviaturas, ni signos especiales.",
            },
            siglas: {
              type: "string",
              title: "Siglas del ente público",
              description:
                "Escribir las siglas del ente público en el que labora la persona servidora pública sancionada.",
            },
          },
        },
        empleoCargoComision: {
          type: "object",
          required: ["nombre", "denominacion", "areaAdscripcion"],
          properties: {
            nombre: {
              type: "object",
              required: ["clave"],
              properties: {
                clave: {
                  title:
                    "Nivel jerárquico del empleo, cargo o comisiónde la persona servidora pública",
                  description:
                    "Señalar el nivel jerárquico del empleo, cargo o comisión que desempeña la persona servidora pública sancionada.",
                  enum: [
                    "OPERATIVO_U_HOMOLOGO",
                    "ENLACE_U_HOMOLOGO",
                    "JEFATURA_DE_DEPARTAMENTO_U_HOMOLOGO",
                    "SUBDIRECCION_DE_AREA_U_HOMOLOGO",
                    "DIRECTOR_DE_AREA_U_HOMÓLOGO",
                    "DIRECCION_GENERAL_U_HOMOLOGO",
                    "JEFATURA_DE_UNIDAD_U_HOMOLOGO",
                    "SUBSECRETARIA_DE_ESTADO_OFICIALIA_MAYOR_U_HOMOLOGO",
                    "SECRETARIA_DE_ESTADO_U_HOMÓLOGO",
                    "OTRO",
                  ],
                  enumNames: [
                    "Operativo u homólogo",
                    "Enlace u homólogo",
                    "Jefatura de departamento u homólogo",
                    "Subdirección de área u homólogo",
                    "Director de área u homólogo",
                    "Dirección General u homólogo",
                    "Jefatura de Unidad u homólogo",
                    "Subsecretaría de estado, oficial mayor u homólogo",
                    "Secretaría de estado u homólogo",
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
                          enum: [
                            "OPERATIVO_U_HOMOLOGO",
                            "ENLACE_U_HOMOLOGO",
                            "JEFATURA_DE_DEPARTAMENTO_U_HOMOLOGO",
                            "SUBDIRECCION_DE_AREA_U_HOMOLOGO",
                            "DIRECTOR_DE_AREA_U_HOMÓLOGO",
                            "DIRECCION_GENERAL_U_HOMOLOGO",
                            "JEFATURA_DE_UNIDAD_U_HOMOLOGO",
                            "SUBSECRETARIA_DE_ESTADO_OFICIALIA_MAYOR_U_HOMOLOGO",
                            "SECRETARIA_DE_ESTADO_U_HOMÓLOGO",
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            },
            denominacion: {
              type: "string",
              title: "Denominación del empleo, cargo o comisión",
              description:
                "Escribir la denominación completa del empleo, cargo o comisión que aparece en su recibo de nómina, nombramiento, contrato u oficio de comisión, sin abreviaturas, sin acentos, ni signos especiales.",
            },
            areaAdscripcion: {
              type: "string",
              title: "Área de adscripción",
              description:
                "Especificar el nombre de la Unidad Administrativa a la que está adscrita la persona servidora pública sancionada, sin abreviaturas, sin acentos, ni signos especiales.",
            },
          },
        },
        origenInvestigacion: {
          type: "object",
          title:
            "3. ORIGEN DEL PROCEDIMIENTO Y TIPO DE DELITO POR HECHO DE CORRUPCIÓN",
          properties: {
            clave: {
              title: "Origen de la falta administrativa",
              description:
                "Seleccionar conforme al catálogo el motivo que dio origen al procedimiento:",
              enum: ["DENUNCIA_CIUDADADA", "DENUNCIA_SP", "OFICIO", "OTRO"],
              enumNames: [
                "Denuncia ciudadana",
                "Denuncia de servidor publico",
                "Oficio",
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
          title: "4.	TIPO DE DELITO COMETIDO ",
          description:
            "En esta sección se señalarán los datos relativos a la resolución.",
          items: {
            type: "object",
            title: "Tipo de delito",
            required: [
              "clave",
              "normatividadInfringida",
              "articuloNormatividadInfringida",
              "fraccionNormatividadInfringida",
            ],
            properties: {
              clave: {
                title: "Tipo de delito por hechos de corrupción",
                //FALTA ESTA DESCRIPCIÓN
                description:
                  "Seleccionar el tipo de delito cometido por parte de la persona servidora pública sancionada.",
                enum: [
                  "EJERCICIO_ILICITO",
                  "ABUSO_AUTORIDAD",
                  "COALICION",
                  "USO_ILICITO",
                  "RENUMERACION_ILICITA",
                  "CONCUSION",
                  "INTIMIDACION",
                  "EJERCICIO_ABUSIVO",
                  "TRAFICO",
                  "COHECHO",
                  "COHECHO_SE",
                  "PECULADO",
                  "ENRIQUECIMINETO",
                  "OTRO",
                ],
                enumNames: [
                  "Ejercicio ilícito de servicio público",
                  "Abuso de autoridad",
                  "Coalición de servidores públicos",
                  "Uso ilícito de atribuciones y facultades",
                  "Remuneración ilícita",
                  "Concusión",
                  "Intimidación",
                  "Ejercicio abusivo de funciones",
                  "Tráfico de influencias",
                  "Cohecho",
                  "Cohecho a servidores públicos extranjeros",
                  "Peculado",
                  "Enriquecimiento ilícito",
                  "Otro",
                ],
              },
              normatividadInfringida: {
                type: "string",
                title: "Normatividad infringida",
                description:
                  "Escribir el nombre de la ley o normatividad infringida.",
              },
              articuloNormatividadInfringida: {
                type: "array",
                title: "Artículo(s) de la normatividad infringida",
                items: {
                  title: "Artículo",
                  type: "string",
                  description:
                    "Escribir el artículo(s) infringido de la normatividad infringida.",
                },
              },
              fraccionNormatividadInfringida: {
                type: "array",
                title: "Fracción(es) de la normatividad infringida",
                items: {
                  title: "Fracción",
                  type: "string",
                  description:
                    "Escribir la fracción(s) infringida de la normatividad infringida.",
                },
              },
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
                          "EJERCICIO_ILICITO",
                          "ABUSO_AUTORIDAD",
                          "COALICION",
                          "USO_ILICITO",
                          "RENUMERACION_ILICITA",
                          "CONCUSION", //REVISAR
                          "INTIMIDACION",
                          "EJERCICIO_ABUSIVO",
                          "TRAFICO",
                          "COHECHO",
                          "COHECHO_SE",
                          "PECULADO",
                          "ENRIQUECIMINETO",
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
          title:
            "5. RESOLUCIÓN FIRME POR LA COMISIÓN DE DELITOS POR HECHOS DE CORRUPCIÓN",
          description:
            "En esta sección se señalarán los datos relativos a la resolución.",
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
                "Colocar la fecha en la que se emite la resolución sancionatoria en formato dd-mm-aaaa.",
            },
            fechaNotificacion: {
              type: "string",
              format: "date",
              title: "Fecha de notificación",
              description:
                "Indicar la fecha en que se notifica la resolución al servidor público sancionado.",
            },
            //Campo nuevo-Url del documento en formato digital
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
                "Colocar la fecha en que quedó firme la resolución de la persona servidora pública en formato dd-mm-aaaa.",
            },
            fechaNotificacionFirme: {
              type: "string",
              format: "date",
              title: "Fecha de notificación firme",
              description:
                "Indicar la fecha en que se notifica la resolución al servidor público sancionado.",
            },
            urlResolucion: {
              type: "string",
              title: "URL del documento en formato digital",
              description:
                "Colocar el enlace o link de la resolución firme emitida por la autoridad a la que corresponde la sanción en su versión pública.",
            },
          },
        },
        tipoSancion: {
          type: "object",
          title: "6. TIPO DE SANCIÓN APLICADA A LA PERSONA SERVIDORA PÚBLICA",
          description:
            "En esta sección se indicará el tipo de sanción y/o sanciones impuestas a la persona servidora pública.",
          required: [
            "ordenJurisdiccional",
            "autoridadJurisdiccional",
            "sancion",
          ],
          properties: {
            ordenJurisdiccional: {
              title: "Orden jurisdiccional de la sanción.",
              description:
                "Seleccionar la opción correspondiente el orden jurisdiccional de la sanción: FEDERAL o ESTATAL.",
              enum: ["FEDERAL", "ESTATAL"],
              enumNames: ["Federal", "Estatal"],
            },
            autoridadJurisdiccional: {
              type: "string",
              title: "Nombre de la autoridad sancionadora",
              description:
                "Indicar el nombre de la autoridad facultada para dictar la sanción.",
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
                    title: "Tipo de sancion",
                    description:
                      "Elegir una o varias sanciones que fueron dictaminadas en la resolución, conforme a la o las elecciones del catálogo, es como deberá llenarse el resto del formato. Se podrán elegir de las siguientes opciones:",
                    enum: [
                      "PRISION",
                      "SUSPENSION",
                      "DESTITUCION",
                      "SANCION_ECONOMICA",
                      "INHABILITACION",
                      "OTRO",
                    ],
                    enumNames: [
                      "Prisión",
                      "Suspensión del empleo cargo o comisión",
                      "Destitución de su empleo cargo o comisión",
                      "Sanción económica",
                      "Inhabilitación temporal para desempeñar empleos cargos o comisiones en el servicio público y para participar en adquisiciones arrendamientos servicios u obras públicas",
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
                            enum: ["PRISION"],
                          },
                          prision: {
                            type: "object",
                            title: "PRISIÓN",
                            properties: {
                              plazo: {
                                type: "object",
                                title: "Plazo de la sanción",
                                description:
                                  "Especificar el tiempo por el que la persona servidora pública se le condenó a prisión en formato de dd-mm-aaaa.",
                                required: ["años", "meses", "dias"],
                                properties: {
                                  años: { title: "Año(s)", type: "string" },
                                  meses: { title: "Mes(es)", type: "string" },
                                  dias: { title: "Día(s)", type: "string" },
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
                            enum: ["SUSPENSION"],
                          },
                          suspensionEmpleo: {
                            type: "object",
                            title: "SUSPENSIÓN DEL EMPLEO CARGO O COMISIÓN",
                            description:
                              "Este campo se deberá llenar si en la resolución se determinó sancionar con la suspensión del empleo, cargo o comisión.",
                            required: ["plazo"],
                            properties: {
                              plazo: {
                                type: "object",
                                title: "Plazo de la suspensión",
                                description:
                                  "Colocar el plazo de la suspensión de la persona servidora pública sancionada, el cual podrán ser en meses o días naturales.",
                                required: [
                                  "meses",
                                  "dias",
                                  "fechaInicial",
                                  "fechaFinal",
                                ],
                                properties: {
                                  meses: { title: "Meses", type: "string" },
                                  dias: { title: "Días", type: "string" },
                                  fechaInicial: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha inicial",
                                    description:
                                      "Indicar la fecha en la que inició la suspensión de la persona servidora pública en formato dd-mm-aaaa.",
                                  },
                                  fechaFinal: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha final",
                                    description:
                                      "Indicar la fecha en la que se concluyó la suspensión de la persona servidora pública en formato dd-mm-aaaa.",
                                  },
                                },
                              },
                            },
                          },
                        },
                        required: ["suspensionEmpleoCargoComisión"],
                      },
                      {
                        properties: {
                          clave: {
                            enum: ["DESTITUCION"],
                          },
                          destitucionEmpleo: {
                            type: "object",
                            title: "DESTITUCIÓN DEL EMPLEO CARGO O COMISIÓN",
                            description:
                              "Este apartado se deberá llenar si en la resolución definitiva se le impuso destitución del empleo, cargo o comisión a la persona servidora pública.",
                            required: ["fechaDestitucion", "constancia"],
                            properties: {
                              fechaDestitucion: {
                                title: "Fecha de la destitución",
                                type: "string",
                                format: "date",
                                description:
                                  "indicar la fecha de destitución de la persona servidora pública en formato dd-mm-aaaa.",
                              },
                            },
                          },
                        },
                        required: ["destituciónEmpleoCargoComision"],
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
                              "Llenar este apartado en caso de que el servidor público sea acreedor a una sanción económica.",
                            required: [
                              "sancionImpuesta",
                              "plazo",
                              "cobrado",
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
                                  años: { title: "Año(s)", type: "string" },
                                  meses: { title: "Mes(es)", type: "string" },
                                  dias: { title: "Día(s)", type: "string" },
                                },
                              },
                              cobrado: {
                                type: "object",
                                title:
                                  "Sanción económica efectivamente cobrada",
                                description:
                                  "Indicar el monto efectivamente cobrado: monto y moneda",
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
                                      "Colocar el tipo de moneda en formato de tres letras, establecidos en el ISO 4217.",
                                    enum: ["MXN", "UMA"],
                                  },
                                  fecha: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha de cobro de la sanción",
                                    description:
                                      "Especificar la fecha en que se realizó el cobro de la sanción económica en formato dd-mm-aaaa.",
                                  },
                                  fechaPagoSancion: {
                                    type: "string",
                                    format: "date",
                                    title:
                                      "Fecha en la que se realizo el pago total de la sanción",
                                    description:
                                      "En caso de que la sanción económica no se realice en una sola exhibición, especificar la fecha en que la persona servidora pública cubrió el pago total de la sanción económica en formato dd-mm-aaaa.",
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
                            enum: ["INHABILITACION"],
                          },
                          inhabilitacion: {
                            type: "object",
                            title:
                              "INHABILITACIÓN TEMPORAL PARA DESEMPEÑAR EMPLEOS CARGOS O COMISIONES EN EL SERVICIO PÚBLICO Y PARA PARTICIPAR EN ADQUISICIONES Y ARRENDAMIENTOS DE SERVICIOS U OBRAS PÚBLICAS",
                            description:
                              "Esta sección deberá llenarse en caso de que el servidor público sea sancionado con una inhabilitación.",
                            required: ["plazo", "constancia"],
                            properties: {
                              plazo: {
                                type: "object",
                                title: "Plazo de la inhabilitación del empleo",
                                description:
                                  "Colocar el plazo de la inhabilitación de la persona servidora pública, empezando por año(s), mes(es) y día(s).",
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
                                      "Indicar la fecha en la que inició la inhabilitación de la persona servidora pública en formato dd-mm-aaaa.",
                                  },
                                  fechaFinal: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha final",
                                    description:
                                      "Indicar la fecha en la que se concluyó la inhabilitación de la persona servidora pública en formato dd-mm-aaaa.",
                                  },
                                },
                              },
                              //PREGUNTAR A YURI SI USARA LA PARTE DE CONSTANCIA EN SANCION DE INHABILITACIONES
                              constancia: {
                                title: "Constancia de la inhabilitación",
                                $ref: "#/definitions/constancias",
                              },
                            },
                          },
                        },
                        required: ["inhabilitacion"],
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
                              "Llenar este apartado en caso de que el servidor público sea acreedor a otra sanción prevista en las leyes locales anticorrupción de las entidades federativas.",
                            properties: {
                              nombre: {
                                title: "Sanción",
                                type: "string",
                                description:
                                  "Indicar el nombre de la sanción, sin abreviaturas, sin acentos, ni signos especiales.",
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
