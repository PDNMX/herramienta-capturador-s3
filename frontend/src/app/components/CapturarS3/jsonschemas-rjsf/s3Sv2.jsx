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
    poder: {
      enum: ["EJECUTIVO", "LEGISLATIVO", "JUDICIAL", "ORGANO_AUTONOMO"],
      enumNames: ["Ejecutivo", "Legislativo", "Judicial", "Órgano autónomo"],
    },
    constancias: {
      type: "object",
      title: "Constancia",
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
            },
            {
              properties: {
                sinConstancia: { const: true },
              },
            },
          ],
        },
      },
    },
  },
  type: "object",
  title: "SISTEMA DE SERVIDORES PÚBLICOS SANCIONADOS",
  description: "Nuevo registro",
  properties: {
    expediente: {
      type: "string",
      title: "Expediente",
      description:
        "Capturar el número que refiere al procedimiento único que da inicio en materia de responsabilidades administrativas.",
    },
    tipoDeFalta: {
      title: "Tipo de Falta",
      description: "Selecciona el tipo de falta a registrar.",
      type: "string",
      enumNames: ["No Grave", "Grave"],
      enum: ["NO_GRAVE", "GRAVE"],
    },
  },
  required: ["tipoDeFalta", "expediente"],
  dependencies: {
    tipoDeFalta: {
      oneOf: [
        {
          properties: {
            tipoDeFalta: {
              enum: ["NO_GRAVE"],
            },
            faltaNoGrave: {
              title:
                "1. DATOS GENERALES DE LA PERSONA SERVIDORA PÚBLICA SANCIONADA",
              description:
                "Indicar los datos generales de la persona servidora pública sancionados.",
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
                "autoridadSancionadora",
                "tipoSancion",
                "observaciones",
              ],
              properties: {
                nombres: {
                  type: "string",
                  title: "Nombre (s)",
                  description:
                    "Escribir el o los nombres de la persona servidora pública sancionada, sin abreviaturas, ni signos especiales.",
                },
                primerApellido: {
                  type: "string",
                  title: "Primer Apellido",
                  description:
                    "Escribir el primer apellido de la persona servidora pública sancionada, sin abreviaturas, ni signos especiales.",
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
                                "Escribir el segundo apellido de la persona servidora pública sancionada, sin abreviaturas, ni signos especiales.",
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
                  title: "RFC",
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
                  title: "2. DATOS DEL EMPLEO, CARGO O COMISIÓN",
                  description:
                    "Indicar los datos de empleo, cargo o comisión conforme a los catálogos de cada sección.",
                  required: [
                    "entidadFederativa",
                    "ambitoGobierno",
                    "poderOrganoGobierno",
                    "nombre",
                    "siglas",
                  ],
                  properties: {
                    entidadFederativa: {
                      title: "Entidad federativa",
                      description:
                        "Seleccionar la entidad federativa en la cual se localiza el ente público donde labora la persona servidora pública sancionada.",
                      $ref: "#/definitions/entidad",
                    },
                    ambitoGobierno: {
                      type: "object",
                      title: "Ámbito de gobierno",
                      properties: {
                        clave: {
                          title: "Ámbito de Gobierno",
                          description:
                            "Seleccionar el orden de gobierno al que pertenece el ente público donde labora la persona servidora pública sancionada: Federal, Estatal, Municipal/Alcaldía u otro (especificar).",
                          enum: [
                            "ESTATAL",
                            "FEDERAL",
                            "MUNICIPAL_ALCALDIA",
                            "OTRO",
                          ],
                          enumNames: [
                            "Estatal",
                            "Federal",
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
                                  enum: [
                                    "ESTATAL",
                                    "FEDERAL",
                                    "MUNICIPAL_ALCALDIA",
                                  ],
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                    poderOrganoGobierno: {
                      type: "string",
                      title: "Poder u órgano de gobierno",
                      description:
                        "Seleccionar el poder u órgano de gobierno del ente público donde labora la persona servidora pública sancionada: Ejecutivo, Legislativo, Judicial u Órgano autónomo.",
                      $ref: "#/definitions/poder",
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
                  required: ["nombre", "nivel", "areaAdscripcion"],
                  properties: {
                    nombre: {
                      type: "object",
                      title: "Empleo, cargo o comisión",
                      properties: {
                        clave: {
                          title: "Empleo, cargo o comisión",
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
                            "Ssubsecretaria de estado oficialia mayor MAYOR u homologo",
                            "Secretaria de esatdo u homologo",
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
                      title: "Clave o nivel del empleo, cargo o comisión",
                      description:
                        "Escribir los caracteres alfanuméricos de la clave o nivel del empleo, cargo o comisión que desempeña la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema.",
                    },
                    areaAdscripcion: {
                      type: "string",
                      title: "Denominación del empleo, cargo o comisión",
                      description:
                        "Escribir el nombre de la Unidad Administrativa a la que está adscrita la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema.",
                    },
                  },
                },
                origenInvestigacion: {
                  type: "object",
                  title:
                    "3. ORIGEN Y TIPO DE FALTA COMETIDA POR LA PERSONA SERVIDORA PÚBLICA SANCIONADA",
                  description:
                    "Indicar el origen y tipo de falta cometida conforme a los catálogos de cada sección.",
                  properties: {
                    clave: {
                      title: "Origen de la falta",
                      description:
                        "Seleccionar conforme al catálogo el origen de la falta administrativa:",
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
                        "Auditoria superior de la federacion o entidades de fiscalizacion superior de la entidades federativas",
                        "Auditoria del organo interno de control del ente publico",
                        "Queja ciudadana",
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
                  title: "Tipo de falta cometida",
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
                          "Cumplir con las funciones, atribuciones y comisiones encomendadas, observando en su desempeño disciplina y respeto, tanto a los demás Servidores Públicos como a los particulares con los que llegare a tratar, en los términos que se establezcan en el código de ética;",
                          "Denunciar los actos u omisiones que en ejercicio de sus funciones llegare a advertir, que puedan constituir Faltas administrativas;",
                          "Atender las instrucciones de sus superiores, siempre que éstas sean acordes con las disposiciones relacionadas con el servicio público. En caso de recibir instrucción o encomienda contraria a dichas disposiciones, deberá denunciar esta circunstancia;",
                          "Presentar en tiempo y forma las declaraciones de situación patrimonial y de intereses;",
                          "Registrar, integrar, custodiar y cuidar la documentación e información que por razón de su empleo, cargo o comisión, tenga bajo su responsabilidad, e impedir o evitar su uso, divulgación, sustracción, destrucción, ocultamiento o inutilización indebidos;",
                          "Supervisar que los Servidores Públicos sujetos a su dirección, cumplan con las disposiciones de este artículo;",
                          "Rendir cuentas sobre el ejercicio de las funciones, en términos de las normas aplicables;",
                          "Colaborar en los procedimientos judiciales y administrativos en los que sea parte;",
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
                        title: "Articulo(s) de la normatividad infringida",
                        items: {
                          title: "Arituclo",
                          type: "string",
                          description:
                            "Escribir el artículo(s) infringido de la normatividad infringida.",
                        },
                      },
                      fraccionNormatividadInfringida: {
                        type: "array",
                        title: "Fracción(es) de la normatividad infringida",
                        items: {
                          title: "Fraccion",
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
                                  "INCUMPLIMIENTO",
                                  "DENUNCIE",
                                  "ATENDER",
                                  "PRESENTAR_DECLARACIONES",
                                  "DOCUMENTAR",
                                  "SUPERVISAR",
                                  "RENDIR_CUENTAS",
                                  "CERCIORARSE",
                                  "REVISAR_CONSTITUCION",
                                  "ABSTENERSE",
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
                  description: "Indicar la resolución de la falta cometida.",
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
                        "Escribir el nombre del documento de la sentencia definitiva que resuelve el procedimiento de responsabilidad administrativa y que ha quedado firme.",
                    },
                    fechaResolucion: {
                      type: "string",
                      format: "date",
                      title: "Fecha de resolución",
                      description:
                        "Registrar la echa en la que se emite la resolución sancionatoria de la persona servidora pública sancionada en formato dd-mm-aaaa.",
                    },
                    fechaNotificacion: {
                      type: "string",
                      format: "date",
                      title: "Fecha de notificación",
                      description:
                        "Registrar la fecha en la que se le notifica al servidor público su sentencia en formato dd-mm-aaaa",
                    },
                    fechaResolucionFirme: {
                      type: "string",
                      format: "date",
                      title: "Fecha de resolución firme",
                      description:
                        "Registrar la fecha en que quedó firme la  sentencia de la persona servidora pública en formato dd-mm-aaaa.",
                    },
                    url: {
                      type: "string",
                      title: "URL del documento en formato digital",
                      description:
                        "Colocar el enlace o link de la resolución emitida por la autoridad sancionadora a la que corresponde la sanción en su versión pública.",
                    },
                  },
                },
                autoridadSancionadora: {
                  type: "string",
                  title: "Nombre de la autoridad sancionadora",
                  description:
                    "Indicar el nombre de la autoridad sancionadora facultada para aplicar la sanción.",
                },
                tipoSancion: {
                  type: "array",
                  title:
                    "5. TIPO DE SANCIÓN IMPUESTA A LA PERSONA SERVIDORA PÚBLICA",
                  description: "Indicar el tipo de sanción impuesta",
                  items: {
                    type: "object",
                    title: "Tipo de sancion",
                    required: ["clave"],
                    properties: {
                      clave: {
                        type: "string",
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
                                    $ref: "#/definitions/constancias",
                                  },
                                },
                              },
                            },
                            required: [
                              "descripcion",
                              "amonestacionPublicaPrivada",
                            ],
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
                              suspensionEmpleoCargoComisión: {
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
                                      año: { title: "Año", type: "integer" },
                                      mes: { title: "Mes", type: "integer" },
                                      dia: { title: "Día", type: "integer" },
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
                              destituciónEmpleoCargoComisión: {
                                type: "object",
                                title:
                                  "DESTITUCIÓN DEL EMPLEO CARGO O COMISIÓN",
                                required: ["fechaDestitución", "constancia"],
                                properties: {
                                  fechaDestitución: {
                                    title: "Fecha de destitución",
                                    type: "string",
                                    format: "date",
                                    description:
                                      "Registar la fecha a partir de la cual el servidor público queda destituido de su empleo, cargo o comisión.",
                                  },
                                  constancia: {
                                    $ref: "#/definitions/constancias",
                                  },
                                },
                              },
                            },
                            required: [
                              "descripcion",
                              "destituciónEmpleoCargoComisión",
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
                                    title: "Plazo de la suspensión",
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
                                      año: { title: "Año", type: "integer" },
                                      mes: { title: "Mes", type: "integer" },
                                      dia: { title: "Día", type: "integer" },
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
                observaciones: {
                  title: "6. OBSERVACIONES",
                  type: "string",
                  description:
                    "En este espacio se podrán realizar las observaciones que se consideren pertinentes. aclaraciones u En virtud de que las aclaraciones pueden contener información reservada y/o confidencial, esta información no será de carácter pública.",
                },
              },
            },
          },
          required: ["faltaNoGrave"],
        },
        {
          properties: {
            tipoDeFalta: {
              enum: ["GRAVE"],
            },
            faltaGrave: {
              title:
                "1. DATOS GENERALES DE LA PERSONA SERVIDORA PÚBLICA SANCIONADA",
              description:
                "Indicar los datos generales de la persona servidora pública sancionados.",
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
                "autoridadSancionadora",
                "ordenJurisdiccionalSancion",
                "tipoSancion",
                "observaciones",
              ],
              properties: {
                nombres: {
                  type: "string",
                  title: "Nombre (s)",
                  description:
                    "Escribir el o los nombres de la persona servidora pública sancionada, sin abreviaturas, ni signos especiales.",
                },
                primerApellido: {
                  type: "string",
                  title: "Primer Apellido",
                  description:
                    "Escribir el primer apellido de la persona servidora pública sancionada, sin abreviaturas, ni signos especiales.",
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
                                "Escribir el segundo apellido de la persona servidora pública sancionada, sin abreviaturas, ni signos especiales.",
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
                  title: "RFC",
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
                  title: "2. DATOS DEL EMPLEO, CARGO O COMISIÓN",
                  description:
                    "Indicar los datos de empleo, cargo o comisión conforme a los catálogos de cada sección.",
                  required: [
                    "entidadFederativa",
                    "ambitoGobierno",
                    "poderOrganoGobierno",
                    "nombre",
                    "siglas",
                  ],
                  properties: {
                    entidadFederativa: {
                      title: "Entidad federativa",
                      description:
                        "Seleccionar la entidad federativa en la cual se localiza el ente público donde labora la persona servidora pública sancionada.",
                      $ref: "#/definitions/entidad",
                    },
                    ambitoGobierno: {
                      type: "object",
                      title: "Ámbito de gobierno",
                      properties: {
                        clave: {
                          title: "Ámbito de Gobierno",
                          description:
                            "Seleccionar el orden de gobierno al que pertenece el ente público donde labora la persona servidora pública sancionada: Federal, Estatal, Municipal/Alcaldía u otro (especificar).",
                          enum: [
                            "ESTATAL",
                            "FEDERAL",
                            "MUNICIPAL_ALCALDIA",
                            "OTRO",
                          ],
                          enumNames: [
                            "Estatal",
                            "Federal",
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
                                  enum: [
                                    "ESTATAL",
                                    "FEDERAL",
                                    "MUNICIPAL_ALCALDIA",
                                  ],
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                    poderOrganoGobierno: {
                      type: "string",
                      title: "Poder u órgano de gobierno",
                      description:
                        "Seleccionar el poder u órgano de gobierno del ente público donde labora la persona servidora pública sancionada: Ejecutivo, Legislativo, Judicial u Órgano autónomo.",
                      $ref: "#/definitions/poder",
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
                  required: ["nombre", "nivel", "areaAdscripcion"],
                  properties: {
                    nombre: {
                      type: "object",
                      title: "Empleo, cargo o comisión",
                      properties: {
                        clave: {
                          title: "Empleo, cargo o comisión",
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
                            "Ssubsecretaria de estado oficialia mayor MAYOR u homologo",
                            "Secretaria de esatdo u homologo",
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
                      title: "Clave o nivel del empleo, cargo o comisión",
                      description:
                        "Escribir los caracteres alfanuméricos de la clave o nivel del empleo, cargo o comisión que desempeña la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema.",
                    },
                    areaAdscripcion: {
                      type: "string",
                      title: "Denominación del empleo, cargo o comisión",
                      description:
                        "Escribir el nombre de la Unidad Administrativa a la que está adscrita la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema.",
                    },
                  },
                },
                origenInvestigacion: {
                  type: "object",
                  title:
                    "3. ORIGEN Y TIPO DE FALTA COMETIDA POR LA PERSONA SERVIDORA PÚBLICA SANCIONADA",
                  description:
                    "Indicar el origen y tipo de falta cometida conforme a los catálogos de cada sección.",
                  properties: {
                    clave: {
                      title: "Origen de la falta",
                      description:
                        "Seleccionar conforme al catálogo el origen de la falta administrativa:",
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
                        "Auditoria superior de la federacion o entidades de fiscalizacion superior de la entidades federativas",
                        "Auditoria del organo interno de control del ente publico",
                        "Queja ciudadana",
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
                  title: "Tipo de falta cometida",
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
                          "Seleccionar el tipo de falta cometida por parte de la persona servidora pública sancionada.",
                        enum: [
                          "CAUSAR_DAÑO",
                          "COHECHO",
                          "PECULADO",
                          "DESVIO_RECURSOS",
                          "UTILIZACION_INF",
                          "CONFLICTO_INTERES",
                          "CONTRATACION_INDEBIDA",
                          "ENRIQUECIMIENTO",
                          "SIMULACION",
                          "TRAFICO_INFLUENCIAS",
                          "ENCUBRIMIENTO",
                          "DESACATO",
                          "NEPOTISMO",
                          "OBSTRUCCION",
                          "OTRO",
                        ],
                        enumNames: [
                          "CAUSAR DAÑOS Y PERJUICIOS A LA HACIENDA PÚBLICA",
                          "COHECHO (PSP exija, acepte, obtenga o pretenda obtener, por sí o a través de terceros, con motivo de sus funciones, cualquier beneficio no comprendido en su remuneración)",
                          "PECULADO (PSP autorice, solicite o realice actos de apropiación de recursos públicos, para sí u otro.)",
                          "DESVÍO DE RECURSOS PÚBLICOS(PSP autorice, solicite o realice actos para la asignación o desvío de recursos públicos.)",
                          "UTILIZACIÓN INDEBIDA DE INFORMACIÓN(PSP adquiera para sí u otro, cualquier ventaja o beneficio privado, resultado de información privilegiada.)",
                          "ACTUACIÓN BAJO CONFLICTO DE INTERÉS(PSP intervenga en la atención, tramitación o resolución de asuntos en los que tenga conflicto de interés o impedimento legal.)",
                          "CONTRATACIÓN INDEBIDA(PSP que autorice cualquier tipo de contratación, así como la selección, nombramiento o designación, de quien se encuentre impedido por disposición legal o inhabilitado por resolución de autoridad competente para ocupar un empleo) ",
                          "ENRIQUECIMIENTO OCULTO(PSP que falte a la veracidad en las declaraciones de situación patrimonial o de intereses.)",
                          "SIMULACIÓN DEL ACTO JURÍDICO(PSP induzca a que otra PSP efectúe, retrase u omita realizar algún acto de su competencia para generar cualquier beneficio, provecho o ventaja para sí u otro.)",
                          "TRÁFICO DE INFLUENCIAS(PSP induzca a que otra PSP efectúe, retrase u omita realizar algún acto de su competencia para generar cualquier beneficio, provecho o ventaja para sí u otro.)",
                          "ENCUBRIMIENTO(PSP llegará a advertir actos u omisiones que pudieran constituir faltas administrativas, realice alguna conducta para su ocultamiento.)",
                          "DESACATO(PSP proporcione información falsa, o no dé respuesta, retrasa deliberadamente y sin justificación la entrega de información a autoridades fiscalizadoras o de control interno.)",
                          "NEPOTISMO(PSP que directa o indirectamente, designe o intervenga para contratar a personas con las que tenga lazos de parentesco por consanguinidad, afinidad, matrimonio o concubinato.)",
                          "OBSTRUCCIÓN DE LA JUSTICIA",
                          "OTRO",
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
                        title: "Articulo(s) de la normatividad infringida",
                        items: {
                          type: "number",
                          description:
                            "Escribir el artículo(s) infringido de la normatividad infringida.",
                        },
                      },
                      fraccionNormatividadInfringida: {
                        type: "array",
                        title: "Fracción(es) de la normatividad infringida",
                        items: {
                          type: "number",
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
                                  "CAUSAR_DAÑO",
                                  "COHECHO",
                                  "PECULADO",
                                  "DESVIO_RECURSOS",
                                  "UTILIZACION_INF",
                                  "CONFLICTO_INTERES",
                                  "CONTRATACION_INDEBIDA",
                                  "ENRIQUECIMIENTO",
                                  "SIMULACION",
                                  "TRAFICO_INFLUENCIAS",
                                  "ENCUBRIMIENTO",
                                  "DESACATO",
                                  "NEPOTISMO",
                                  "OBSTRUCCION",
                                  "OTRO",
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
                  description: "Indicar la resolución de la falta cometida.",
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
                        "Escribir el nombre del documento de la sentencia definitiva que resuelve el procedimiento de responsabilidad administrativa y que ha quedado firme.",
                    },
                    fechaResolucion: {
                      type: "string",
                      format: "date",
                      title: "Fecha de resolución",
                      description:
                        "Registrar la echa en la que se emite la resolución sancionatoria de la persona servidora pública sancionada en formato dd-mm-aaaa.",
                    },
                    fechaNotificacion: {
                      type: "string",
                      format: "date",
                      title: "Fecha de notificación",
                      description:
                        "Registrar la fecha en la que se le notifica al servidor público su sentencia en formato dd-mm-aaaa",
                    },
                    fechaResolucionFirme: {
                      type: "string",
                      format: "date",
                      title: "Fecha de resolución firme",
                      description:
                        "Registrar la fecha en que quedó firme la  sentencia de la persona servidora pública en formato dd-mm-aaaa.",
                    },
                    url: {
                      type: "string",
                      title: "URL del documento en formato digital",
                      description:
                        "Colocar el enlace o link de la resolución emitida por la autoridad sancionadora a la que corresponde la sanción en su versión pública.",
                    },
                  },
                },
                autoridadSancionadora: {
                  type: "string",
                  title: "Nombre de la autoridad sancionadora",
                  description:
                    "Indicar el nombre de la autoridad sancionadora facultada para aplicar la sanción.",
                },
                ordenJurisdiccionalSancion: {
                  title: "Orden jurisdiccional de la sanción.",
                  description:
                    "Seleccionar la opción correspondiente al nivel de la orden jurisdiccional de la sanción.",
                  enum: ["FEDERAL", "ESTATAL"],
                },
                tipoSancion: {
                  type: "array",
                  title:
                    "5. TIPO DE SANCIÓN IMPUESTA A LA PERSONA SERVIDORA PÚBLICA",
                  description: "Indicar el tipo de sanción impuesta",
                  items: {
                    type: "object",
                    title: "Tipo de sancion",
                    required: ["clave"],
                    properties: {
                      clave: {
                        type: "string",
                        title: "Tipo de sancion",
                        description:
                          "Elegir una o varias sanciones que fueron dictaminadas en la resolución, conforme a la o las elecciones del catálogo, es como deberá llenarse el resto del formato. Se podrán elegir de las siguientes opciones:",
                        enum: [
                          "SUSPENSION",
                          "DESTITUCION",
                          "SANCION_ECONOMICA",
                          "INHABILITACION",
                          "OTRO",
                        ],
                        enumNames: [
                          "SUSPENSIÓN DEL EMPLEO CARGO O COMISIÓN",
                          "DESTITUCIÓN DEL EMPLEO CARGO O COMISIÓN",
                          "SANCIÓN ECONÓMICA",
                          "INHABILITACIÓN TEMPORAL PARA DESEMPEÑAR EMPLEOS CARGOS O COMISIONES EN EL SERVICIO PÚBLICO Y PARA PARTICIPAR EN ADQUISICIONES Y ARRENDAMIENTOS DE SERVICIOS U OBRAS PÚBLICAS.",
                          "OTRO",
                        ],
                      },
                    },
                    dependencies: {
                      clave: {
                        oneOf: [
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
                              EmpleoCargoComisión: {
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
                                      año: { title: "Año", type: "integer" },
                                      mes: { title: "Mes", type: "integer" },
                                      dia: { title: "Día", type: "integer" },
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
                              destituciónEmpleoCargoComisión: {
                                type: "object",
                                title:
                                  "DESTITUCIÓN DEL EMPLEO CARGO O COMISIÓN",
                                required: ["fechaDestitución", "constancia"],
                                properties: {
                                  fechaDestitución: {
                                    title: "Fecha de destitución",
                                    type: "string",
                                    format: "date",
                                    description:
                                      "Registar la fecha a partir de la cual el servidor público queda destituido de su empleo, cargo o comisión.",
                                  },
                                  constancia: {
                                    $ref: "#/definitions/constancias",
                                  },
                                },
                              },
                            },
                            required: [
                              "descripcion",
                              "destituciónEmpleoCargoComisión",
                            ],
                          },
                          {
                            properties: {
                              clave: {
                                enum: ["SANCION_ECONOMICA"],
                              },
                              descripcion: {
                                type: "string",
                                title: "Descripción",
                                description:
                                  "Descripción o nota aclaratoria del tipo de sanción infringida.",
                              },
                              sanciónEconómica: {
                                type: "object",
                                title: "SANCIÓN ECONÓMICA",
                                required: [
                                  "monto",
                                  "moneda",
                                  "plazo",
                                  "cobrado",
                                  "constancia",
                                ],
                                properties: {
                                  monto: {
                                    type: "number",
                                    title: "Monto",
                                    description:
                                      "Colocar el monto total correspondiente a la sanción económica.",
                                  },
                                  moneda: {
                                    type: "string",
                                    title: "Moneda",
                                    description:
                                      "Colocar el tipo de moneda en formato de tres letras, establecidos en el ISO 4217.",
                                  },
                                  plazo: {
                                    type: "object",
                                    title: "Plazo de la suspensión",
                                    description:
                                      "Colocar el plazo de pago de la sanción económica de la persona servidora pública, empezando por año(s), mes(es) y día(s).",
                                    required: ["año", "mes", "dia"],
                                    properties: {
                                      año: { title: "Año", type: "integer" },
                                      mes: { title: "Mes", type: "integer" },
                                      dia: { title: "Día", type: "integer" },
                                    },
                                  },
                                  cobrado: {
                                    type: "object",
                                    title:
                                      "SANCIÓN ECONÓMICA EFECTIVAMENTE COBRADA",
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
                                          "Colocar el monto total correspondiente a la sanción económica.",
                                      },
                                      moneda: {
                                        type: "string",
                                        title: "Moneda",
                                        description:
                                          "Colocar el tipo de moneda en formato de tres letras, establecidos en el ISO 4217.",
                                      },
                                      fecha: {
                                        type: "string",
                                        format: "date",
                                        title: "Fecha de cobreo de la sanción",
                                        description:
                                          "Registrar la fecha en que se realizó el cobro de la sanción económica en formato dd-mm-aaaa.",
                                      },
                                      fechaPagoSancion: {
                                        type: "string",
                                        format: "date",
                                        title:
                                          "Fecha en la que se realizo el pago total de la sanción",
                                        description:
                                          "En caso de no pagarse en una sola exhibición la sanción económica, especificar la fecha en que la persona servidora pública cubrió el pago total de la sanción económica en formato dd-mm-aaaa.",
                                      },
                                    },
                                  },
                                  constancia: {
                                    $ref: "#/definitions/constancias",
                                  },
                                },
                              },
                            },
                            required: ["descripcion", "sanciónEconómica"],
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
                                    title: "Plazo de la suspensión",
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
                                      año: { title: "Año", type: "integer" },
                                      mes: { title: "Mes", type: "integer" },
                                      dia: { title: "Día", type: "integer" },
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
                observaciones: {
                  title: "6. OBSERVACIONES",
                  type: "string",
                  description:
                    "En este espacio se podrán realizar las observaciones que se consideren pertinentes. aclaraciones u En virtud de que las aclaraciones pueden contener información reservada y/o confidencial, esta información no será de carácter pública.",
                },
              },
            },
          },
          required: ["faltaGrave"],
        },
      ],
    },
  },
};

export default data;
