let data = {
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
                  title: "Título de la constancia de la sanción",
                  description:
                    "Proporcionar el nombre del título de la constancia de la persona servidora pública.",
                },
                fecha: {
                  type: "string",
                  format: "date",
                  title: "Fecha de la constancia de la sanción",
                  description:
                    "Indicar la fecha de expedición de la constancia de la persona servidora pública en formato dd-mm-aaaa.",
                },
                url: {
                  type: "string",
                  title: "URL del documento digital",
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
  required: ["expediente", "noGrave"],
  properties: {
    expediente: {
      type: "string",
      title: "Expediente",
      description:
        "Capturar el número que refiere al procedimiento único que da inicio en materia de responsabilidades administrativas.",
    },
    noGrave: {
      title: "1. DATOS GENERALES DE LA PERSONA SERVIDORA PÚBLICA SANCIONADA",
      description:
        "En esta sección se registran los datos generales de la persona servidora pública sancionada.",
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
        "faltaCometida",
        "resolucion",
        "tipoSancion",
        "observaciones",
      ],
      properties: {
        nombres: {
          type: "string",
          title: "Nombre (s)",
          description:
            "Escribir el o los nombres de la persona servidora pública sancionada, sin abreviaturas.",
        },
        primerApellido: {
          type: "string",
          title: "Primer Apellido",
          description:
            "Escribir el primer apellido de la persona servidora pública sancionada, sin abreviaturas.",
        },
        segundoApellido: {
          title: "Segundo Apellido",
          type: "object",
          properties: {
            sinSegundoApellido: {
              type: "boolean",
              default: false,
              title: "No tengo segundo apellido",
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
                        "Escribir el segundo apellido de la persona servidora pública sancionada, sin abreviaturas.",
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
            "Escribir los dieciocho caracteres alfanuméricos como la emitió la Secretaría de Gobernación.  En caso de no contar con ella, podrá consultarla en la siguiente página: https://www.gob.mx/curp/",
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
          description: "Seleccionar la opción que corresponda.",
        },
        entePublico: {
          type: "object",
          title: "2. DATOS DEL EMPLEO, CARGO O COMISIÓN DE LA PERSONA SERVIDORA PÚBLICA SANCIONADA",
          description:
            "Indicar los datos de empleo, cargo o comisión conforme a los catálogos de cada sección.",
          required: [
            "entidadFederativa",
            "nivelOdenGobierno",
            "ambitoPublico",
            "nombre",
            "siglas",
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
            nivelOdenGobierno: {
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
                "Seleccionar el poder u órgano de gobierno del ente público donde labora la persona servidora pública sancionada: Ejecutivo, Legislativo, Judicial u Órgano autónomo.",
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
                "Escribir el nombre completo del ente público donde labora la persona servidora pública sancionada, sin abreviaturas.",
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
          required: ["clave", "nivel", "areaAdscripcion"],
          properties: {
            nombre: {
              type: "object",
              properties: {
                clave: {
                  title:
                    "Empleo, cargo o comisión de la persona servidora pública sancionada",
                  description:
                    "Escribir el nombre completo del empleo, cargo o comisión que aparece en su recibo de nómina, nombramiento, contrato u oficio de comisión.",
                  enum: [
                    "OPERATIVO_U_HOMOLOGO",
                    "ENLACE_U_HOMOLOGO",
                    "JEFATURA_DE_DEPARTAMENTO_U_HOMOLOGO",
                    "SUBDIRECCION_DE_AREA_U_HOMOLOGO",
                    "COORDINACION_DIRECCIÓN_DE_AREA_U_HOMOLOGO",
                    "DIRECCION_GENERAL_ADJUNTA_U_HOMÓLOGO",
                    "DIRECCION_GENERAL_U_HOMOLOGO",
                    "JEFATURA_DE_UNIDAD_U_HOMOLOGO",
                    "SUBSECRETARIA_DE_ESTADO_OFICIALIA_MAYOR_U_HOMOLOGO",
                    "SECRETARIA_DE_ESTADO_U_HOMÓLOGO",
                    "OTRO",
                  ],
                  enumNames: [
                    "Operativo u homologo",
                    "Enlace u homologo",
                    "Jefatura de departamento u homologo",
                    "Subdireccion de area u homologo",
                    "Coordinacion direccon de area u homologo",
                    "Direccion general adjunta u homologo",
                    "Direccion general u homologo",
                    "Jefatura de unidad u homologo",
                    "Subsecretaria de estado oficialia mayor MAYOR u homologo",
                    "Secretaria de esatdo u homologo",
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
                            "COORDINACION_DIRECCIÓN_DE_AREA_U_HOMOLOGO",
                            "DIRECCION_GENERAL_ADJUNTA_U_HOMÓLOGO",
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
            nivel: {
              type: "string",
              title: "Nivel del empleo, cargo o comisión",
              description:
                "Escribir los caracteres alfanuméricos de la clave o nivel del empleo, cargo o comisión que desempeña la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema.",
            },
            areaAdscripcion: {
              type: "string",
              title: "Denominación del area de adscripción",
              description:
                "Escribir el nombre de la Unidad Administrativa a la que está adscrita la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema.",
            },
          },
        },
        origenInvestigacion: {
          type: "object",
          title:
            "3. ORIGEN DE LA FALTA ADMINISTRATIVA",
          description:
            "En esta sección se indicarán los datos relacionados con el origen del procedimiento y el tipo de falta cometida por la persona servidora pública.",
          properties: {
            clave: {
              title: "Origen de la falta administrativa",
              description:
                "Señalar el motivo que dio origen a la investigación por la comisión de la falta administrativa no grave.",
              enum: [
                "AUDITORIA_SUPERIOR",
                "AUDITORIA_OIC",
                "QUEJA",
                "DENUNCIA_CIUDADADA",
                "DENUNCIA_SP",
                "OFICIO",
                "OTRO",
              ],
              enumNames: [
                "Auditoría Superior de la Federación o entidades de fiscalización superior de la entidades federativas",
                "Auditoría del órgano interno de control del ente público",
                "Queja ciudadana",
                "Denuncia ciudadana",
                "Denuncia de servidor público",
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
                      enum: [
                        "AUDITORIA_SUPERIOR",
                        "AUDITORIA_OIC",
                        "QUEJA",
                        "DENUNCIA_CIUDADADA",
                        "DENUNCIA_SP",
                        "OFICIO",
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
          title: "4. TIPO DE FALTA COMETIDA POR LA PERSONA SERVIDORA PÚBLICA SANCIONADA",
          items: {
            type: "object",
            title: "Falta cometida",
            description: "Por actos u omisiones que incumplan o transgredan las siguientes obligaciones:",
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
                  "Seleccionar el tipo de falta cometida por parte de la persona servidora pública sancionada.",
                enum: [
                  "CUMPLIMIENTO",
                  "DENUNCIE",
                  "ATENDER",
                  "PRESENTAR_DECLARACIONES",
                  "DOCUMENTAR",
                  "SUPERVISAR",
                  "RENDIR_CUENTAS",
                  "CERCIORARSE",
                  "OTRO",
                ],
                enumNames: [
                  "Cumplir con las funciones, atribuciones y comisiones encomendadas, observando en su desempeño disciplina y respeto, tanto a los demás servidores públicos como a los particulares con los que llegare a tratar, en los términos que se establezcan en el código de ética",
                  "Denunciar los actos u omisiones que en ejercicio de sus funciones llegare a advertir, que puedan constituir faltas administrativas",
                  "Atender las instrucciones de sus superiores, siempre que éstas sean acordes con las disposiciones relacionadas con el servicio público. En caso de recibir instrucción o encomienda contraria a dichas disposiciones, deberá denunciar esta circunstancia",
                  "Presentar en tiempo y forma las declaraciones de situación patrimonial y de intereses",
                  "Registrar, integrar, custodiar y cuidar la documentación e información que por razón de su empleo, cargo o comisión, tenga bajo su responsabilidad, e impedir o evitar su uso, divulgación, sustracción, destrucción, ocultamiento o inutilización indebidos",
                  "Supervisar que los servidores públicos sujetos a su dirección, cumplan con las disposiciones de este artículo",
                  "Rendir cuentas sobre el ejercicio de las funciones, en términos de las normas aplicables",
                  "Colaborar en los procedimientos judiciales y administrativos en los que sea parte",
                  "Otro",
                ],
              },
              nombreNormatividadInfringida: {
                type: "string",
                title: "Ley y/o normatividad infringida",
                description:
                  "Escribir el nombre de la ley o normatividad infringida por la persona servidora pública.",
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
                    "Escribir la fracción(es) infringida de la normatividad infringida.",
                },
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
                          "CUMPLIMIENTO",
                          "DENUNCIE",
                          "ATENDER",
                          "PRESENTAR_DECLARACIONES",
                          "DOCUMENTAR",
                          "SUPERVISAR",
                          "RENDIR_CUENTAS",
                          "CERCIORARSE",
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
            "4. RESOLUCIÓN DE LA FALTA COMETIDA POR LA PERSONA SERVIDORA PÚBLICA SANCIONADA",
          description: "En esta sección se señalizarán los datos relativos a la resolución firme.",
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
              title: "Titulo del documento",
              description:
                "Escribir el nombre del documento de la resolución que da fin al procedimiento de responsabilidad administrativa y que ha quedado firme.",
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
                "Indicar la fecha en que se notifica la resolución firme al servidor público sancionado formato dd-mm-aaaa.",
            },
            fechaResolucionFirme: {
              type: "string",
              format: "date",
              title: "Fecha de resolución firme",
              description:
                "Colocar la fecha en que quedó firme la resolución de la persona servidora pública en formato dd-mm-aaaa.",
            },
            url: {
              type: "string",
              title: "URL del documento en formato digital",
              description:
                "Colocar el enlace o link de la resolución firme emitida por la autoridad sancionadora a la que corresponde la sanción en su versión pública.",
            },
          },
        },
        tipoSancion: {
          type: "object",
          title: "5. TIPO DE SANCIÓN IMPUESTA A LA PERSONA SERVIDORA PÚBLICA",
          description: "Indicar el tipo de sanción impuesta",
          required: [
            "autoridadSancionadora",
            "autoridadInvestigadora",
            "autoridadSubstanciadora",
            "sancion",
          ],
          properties: {
            autoridadSancionadora: {
              type: "string",
              title: "Nombre de la autoridad sancionadora",
              description:
                "Indicar el nombre de la autoridad sancionadora facultada para aplicar la sanción.",
            },
            autoridadInvestigadora: {
              type: "string",
              title: "Nombre de la autoridad investigadora",
              description: "Indicar el nombre de la autoridad invetigadora.",
            },
            autoridadSubstanciadora: {
              type: "string",
              title: "Nombre de la autoridad substanciadora.",
              description: "Indicar el nombre de la autoridad substanciadora.",
            },
            sancion: {
              type: "array",
              title: "Tipo de sancion",
              items: {
                type: "object",
                title: "Tipo de sanción",
                required: ["clave"],
                properties: {
                  clave: {
                    title: "Tipo de sancion",
                    description:
                      "Elegir una o varias sanciones que fueron dictaminadas en la resolución, conforme a la o las elecciones del catálogo, es como deberá llenarse el resto del formato. Se podrán elegir de las siguientes opciones:",
                    enum: [
                      "AMONESTACION",
                      "SUSPENSION",
                      "DESTITUCION",
                      "INHABILITACION",
                      "OTRO",
                    ],
                    enumNames: [
                      "Amonestacion publica o privada",
                      "Suspension del empleo cargo o comision",
                      "Destitucion de su empleo cargo o comision",
                      "Inhabilitacion temporal para desempenar empleos cargos o comisiones en el servicio publico y para participar en adquisiciones arrendamientos servicios u obras publicas",
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
                            enum: ["AMONESTACION"],
                          },
                          descripcion: {
                            type: "string",
                            title: "Descripción",
                            description:
                              "Descripción o nota aclaratoria del tipo de sanción infringida.",
                          },
                          amonestacionPublicaPrivada: {
                            type: "object",
                            title: "AMONESTACIÓN PÚBLICA O PRIVADA ",
                            required: ["tipoAmonestacion", "constancia"],
                            properties: {
                              tipoAmonestacion: {
                                title: "Tipo de amonestación",
                                description:
                                  "Seleccionar el tipo de amonestación correspondiente a la amonestación si es: PÚBLICA o PRIVADA",
                                enum: ["PUBLICO", "PRIVADO"],
                                enumNames: ["Publico", "Privado"],
                              },
                              constancia: {
                                title: "Constancia de la amonestación",
                                $ref: "#/definitions/constancias",
                              },
                            },
                          },
                        },
                        required: ["descripcion", "amonestacionPublicaPrivada"],
                      },
                      {
                        properties: {
                          clave: {
                            enum: ["SUSPENSION"],
                          },
                          descripcion: {
                            type: "string",
                            title: "Descripción",
                            description:
                              "Descripción o nota aclaratoria del tipo de sanción infringida.",
                          },
                          suspensionEmpleo: {
                            type: "object",
                            title: "SUSPENSIÓN DEL EMPLEO CARGO O COMISIÓN",
                            required: ["plazo", "constancia"],
                            properties: {
                              plazo: {
                                type: "object",
                                title: "Plazo de la suspensión",
                                description:
                                  "Colocar el plazo de la suspensión de la persona servidora pública, empezando por año(s), mes(es) y día(s).",
                                required: [
                                  "año",
                                  "mes",
                                  "dia",
                                  "fechaInicial",
                                  "fechaFinal",
                                ],
                                properties: {
                                  año: { title: "Año", type: "string" },
                                  mes: { title: "Mes", type: "string" },
                                  dia: { title: "Día", type: "string" },
                                  fechaInicial: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha inicial de la suspensión",
                                    description:
                                      "Indicar la fecha en la que inició la suspensión de la persona servidora pública en formato dd-mm-aaaa.",
                                  },
                                  fechaFinal: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha final de la suspensión",
                                    description:
                                      "Indicar la fecha en la que se concluyó la suspensión de la persona servidora pública en formato dd-mm-aaaa.",
                                  },
                                },
                              },
                              constancia: {
                                title: "Constancia de la suspensión",
                                $ref: "#/definitions/constancias",
                              },
                            },
                          },
                        },
                        required: [
                          "descripcion",
                          "suspensionEmpleoCargoComisión",
                        ],
                      },
                      {
                        properties: {
                          clave: {
                            enum: ["DESTITUCION"],
                          },
                          descripcion: {
                            type: "string",
                            title: "Descripción",
                            description:
                              "Descripción o nota aclaratoria del tipo de sanción infringida.",
                          },
                          destituciónEmpleoCargoComision: {
                            type: "object",
                            title: "DESTITUCIÓN DEL EMPLEO CARGO O COMISIÓN",
                            required: [
                              "destituciónEmpleoCargoComision",
                              "constancia",
                            ],
                            properties: {
                              fechaDestitución: {
                                title: "Fecha de destitución",
                                type: "string",
                                format: "date",
                                description:
                                  "Registar la fecha a partir de la cual el servidor público queda destituido de su empleo, cargo o comisión.",
                              },
                              constancia: {
                                title: "Constancia de la destitución",
                                $ref: "#/definitions/constancias",
                              },
                            },
                          },
                        },
                        required: [
                          "descripcion",
                          "destituciónEmpleoCargoComision",
                        ],
                      },
                      {
                        properties: {
                          clave: {
                            enum: ["INHABILITACION"],
                          },
                          descripcion: {
                            type: "string",
                            title: "Descripción",
                            description:
                              "Descripción o nota aclaratoria del tipo de sanción infringida.",
                          },
                          inhabilitacion: {
                            type: "object",
                            title:
                              "INHABILITACIÓN TEMPORAL PARA DESEMPEÑAR EMPLEOS CARGOS O COMISIONES EN EL SERVICIO PÚBLICO Y PARA PARTICIPAR EN ADQUISICIONES Y ARRENDAMIENTOS DE SERVICIOS U OBRAS PÚBLICAS",
                            required: ["plazo", "constancia"],
                            properties: {
                              plazo: {
                                type: "object",
                                title: "Plazo de la inhabilitación",
                                description:
                                  "Colocar el plazo de la inhabilitación de la persona servidora pública, empezando por año(s), mes(es) y día(s).",
                                required: [
                                  "año",
                                  "mes",
                                  "dia",
                                  "fechaInicial",
                                  "fechaFinal",
                                ],
                                properties: {
                                  año: { title: "Año", type: "string" },
                                  mes: { title: "Mes", type: "string" },
                                  dia: { title: "Día", type: "string" },
                                  fechaInicial: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha inicial de la suspensión",
                                    description:
                                      "Registrar la fecha en la que inició la inhabilitación de la persona servidora pública en formato dd-mm-aaaa.",
                                  },
                                  fechaFinal: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha final de la suspensión",
                                    description:
                                      "Indicar la fecha en la que se concluyó la inhabilitación de la persona servidora pública en formato dd-mm-aaaa.",
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
                            enum: ["OTRO"],
                          },
                          valor: {
                            title: "Otro",
                            description: "Especifique",
                            type: "string",
                          },
                          descripcion: {
                            type: "string",
                            title: "Descripción",
                            description:
                              "Descripción o nota aclaratoria del tipo de sanción infringida.",
                          },
                          otro: {
                            type: "object",
                            title: "OTRO",
                            required: ["nombre", "urlDocumento"],
                            properties: {
                              nombre: {
                                title: "Nombre de la sanción",
                                type: "string",
                                description:
                                  "Escribir el título de la constancia de la sanción impuesta.",
                              },
                              urlDocumento: {
                                type: "string",
                                title: "URL del documento digital",
                                description:
                                  "Colocar el enlace o link del documento digital de la constancia.",
                              },
                            },
                          },
                        },
                        required: ["valor", "descripcion", "otro"],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        observaciones: {
          title: "6. OBSERVACIONES",
          type: "string",
          description:
            "En este espacio se podrán realizar las observaciones que se consideren pertinentes. aclaraciones u En virtud de que las aclaraciones pueden contener información reservada y/o confidencial, esta información no será de carácter pública.",
        },
      },
    },
  },
};

export default data;
