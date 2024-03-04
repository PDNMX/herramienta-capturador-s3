// ABSTENCIONES - GRAVES (10)
let data = {
  type: "object",
  required: ["expediente", "absGrave"],
  properties: {
    expediente: {
      type: "string",
      title: "Expediente",
      description: "Registrar el número de expediente del procedimiento.",
    },
    absGrave: {
      title: "1. DATOS GENERALES DE LA PERSONA SERVIDORA PÚBLICA.",
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
        "faltaCometida",
        "resolucion",
        "tipoSancion",
        "observaciones",
      ],
      properties: {
        nombres: {
          type: "string",
          title: "Nombre(s)",
          description:
            "Escribir el o los nombres de la persona servidora pública, sin abreviaturas, ni signos especiales.",
        },
        primerApellido: {
          type: "string",
          title: "Primer apellido",
          description:
            "Escribir el primer apellido de la persona servidora pública, sin abreviaturas, ni signos especiales.",
        },
        segundoApellido: {
          title: "Segundo apellido",
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
                      title: "Segundo apellido",
                      description:
                        "Escribir el segundo apellido de la persona servidora pública, sin abreviaturas, ni signos especiales.",
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
        },
        rfc: {
          type: "string",
          title: "RFC con homoclave",
        },
        sexo: {
          type: "string",
          enum: ["MUJER", "HOMBRE"],
          enumNames: ["Mujer", "Hombre"],
          title: "Sexo",
          description: "Seleccionar la opción que corresponda: mujer/hombre.",
        },
        entePublico: {
          type: "object",
          title:
            "2. DATOS DEL EMPLEO, CARGO O COMISIÓN DE LA PERSONA SERVIDORA PÚBLICA",
          description:
            "Indicar los datos de empleo, cargo o comisión conforme a los catálogos de cada sección.",
          required: [
            "entidadFederativa",
            "nivelOrdenGobierno",
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
            nivelOrdenGobierno: {
              type: "object",
              properties: {
                clave: {
                  title: "Nivel/Orden de Gobierno",
                  description:
                    "Seleccionar el nivel u orden de gobierno al que pertenece el ente público donde labora la persona servidora pública sancionada: Federal, Estatal, Municipal/Alcaldía, otro (especificar).",
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
                "Indicar el nombre completo del ente público donde labora la persona servidora pública sancionada, sin abreviaturas, sin acentos, ni signos especiales, sin abreviaturas, sin acentos, ni signos especiales.",
            },
            siglas: {
              type: "string",
              title: "Siglas del ente público",
              description:
                "Especificar las siglas del ente público en el que labora la persona servidora pública sancionada.",
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
                    "Nivel jerárquico del empleo, cargo o comisión de la persona servidora pública",
                  description:
                    "Señalar el nivel jerárquico del empleo, cargo o comisión que desempeña la persona servidora pública sancionada.",
                  enum: [
                    "OPERATIVO_U_HOMOLOGO",
                    "ENLACE_U_HOMOLOGO",
                    "JEFATURA_DE_DEPARTAMENTO_U_HOMOLOGO",
                    "SUBDIRECCION_DE_AREA_U_HOMOLOGO",
                    "DIRECCION_DE_AREA_U_HOMOLOGO",
                    "DIRECCION_GENERAL_U_HOMOLOGO",
                    "JEFATURA_DE_UNIDAD_U_HOMOLOGO",
                    "SUBSECRETARIA_DE_ESTADO_OFICIALIA_MAYOR_U_HOMOLOGO",
                    "SECRETARIA_DE_ESTADO_U_HOMOLOGO",
                    "OTRO",
                  ],
                  enumNames: [
                    "Operativo u homólogo",
                    "Enlace u homólogo",
                    "Jefatura de departamento u homólogo",
                    "Subdirección de área u homólogo",
                    "Dirección de área u homólogo",
                    "Dirección general u homólogo",
                    "Jefatura de unidad u homólogo",
                    "Subsecretaría de estado oficialía mayor u homólogo",
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
                            "DIRECCION_DE_AREA_U_HOMOLOGO",
                            "DIRECCION_GENERAL_U_HOMOLOGO",
                            "JEFATURA_DE_UNIDAD_U_HOMOLOGO",
                            "SUBSECRETARIA_DE_ESTADO_OFICIALIA_MAYOR_U_HOMOLOGO",
                            "SECRETARIA_DE_ESTADO_U_HOMOLOGO",
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
          title: "3. ORIGEN DEL PROCEDIMIENTO",
          description:
            "Señalar el motivo que dio origen a la investigación por la comisión de la falta administrativa grave.",
          properties: {
            clave: {
              title:
                "Señalar el motivo que dio origen a la investigación por la comisión de la falta administrativa grave.",
              description:
                "Seleccionar conforme al catálogo el origen de la falta administrativa:",
              //La siguiente lista no coindiciden entre el formato y el documento de las descripciones, nos basamos en el formato.
              enum: [
                "AUDITORIA_SUPERIOR",
                "AUDITORIA_OIC",
                "DENUNCIA_SP",
                "OFICIO",
                "OTRO",
              ],
              enumNames: [
                "Auditoría superior de la federación o entidades de fiscalización superior de la entidades federativas",
                "Auditoría del órgano interno de control del ente público",
                "Denuncia de servidor público",
                "De oficio",
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
          title: "4. PROBABLE FALTA COMETIDA POR LA PERSONA SERVIDORA PÚBLICA",
          items: {
            type: "object",
            title:
              "Seleccionar el tipo de falta cometida por parte de la persona servidora pública sancionada.",
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
                  "Seleccionar el tipo de falta cometida de la persona servidora pública sancionada.",
                enum: [
                  "ABUSO_FUNCIONES",
                  "COHECHO",
                  "PECULADO",
                  "DESVIO_RECURSOS",
                  "UTILIZACION_INF",
                  "CONFLICTO_INTERES",
                  "CONTRATACION_INDEBIDA",
                  "ENRIQUECIMIENTO",
                  "TRAFICO_INFLUENCIAS",
                  "SIMULACION",
                  "ENCUBRIMIENTO",
                  "DESACATO",
                ],
                enumNames: [
                  "Abuso de funciones",
                  "Cohecho",
                  "Peculado",
                  "Desvío de recursos públicos",
                  "Utilización indebida de información",
                  "Actuación bajo conflicto de interés",
                  "Contratación indebida",
                  "Enriquecimiento oculto",
                  "Tráfico de influencias",
                  "Simulación del acto jurídico",
                  "Encubrimiento",
                  "Desacato",
                ],
              },
              nombreNormatividad: {
                type: "string",
                title: "Normatividad infringida",
                description:
                  "Escribir el nombre de la normatividad infringida por la persona servidora pública, sin abreviaturas, sin acentos, ni signos especiales.",
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
              descripcionHechos: {
                title: "Descripción breve de los hechos",
                type: "string",
                description: "Señalar una descripción breve de los hechos.",
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
                          "ABUSO_FUNCIONES",
                          "COHECHO",
                          "PECULADO",
                          "DESVIO_RECURSOS",
                          "UTILIZACION_INF",
                          "CONFLICTO_INTERES",
                          "CONTRATACION_INDEBIDA",
                          "ENRIQUECIMIENTO",
                          "TRAFICO_INFLUENCIAS",
                          "SIMULACION",
                          "ENCUBRIMIENTO",
                          "DESACATO",
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
          title: "5. RESOLUCIÓN O ACUERDO DE ABSTENCIÓN",
          description:
            "En esta sección se señalarán los datos relativos a la resolución o acuerdo que se dicte para determinar la abstención de imposición de sanción o de inicio de procedimiento administrativo.",
          required: [
            "documentoResolucion",
            "fechaResolucion",
            "fechaNotificacion",
            "url",
          ],
          properties: {
            documentoResolucion: {
              type: "string",
              title: "Titulo del documento",
              description:
                "Escribir el nombre del documento de la resolución o acuerdo de abstención de imposición de sanción o de inicio de procedimiento administrativo, sin abreviaturas, sin acentos, ni signos especiales.",
            },
            fechaResolucion: {
              type: "string",
              format: "date",
              title: "Fecha de resolución",
              description:
                "Colocar la fecha en la que se emite la resolución o el acuerdo en formato DD-MM-AAAA.",
            },
            fechaNotificacion: {
              type: "string",
              format: "date",
              title: "Fecha de notificación",
              description:
                "En su caso, indicar la fecha en que se notifica la resolución o acuerdo de abstención, en formato DD-MM-AAAA.",
            },
            url: {
              type: "string",
              title: "URL del documento en formato digital",
              description:
                "Colocar el enlace o link de la resolución o acuerdo emitido por la autoridad correspondiente en su versión pública.",
            },
            descripcionAbstención: {
              type: "string",
              title: "Descripción breve de la abstención",
              description: "Señalar una descripción breve de las causas por las que se concedió la abstención sin datos reservados ni confidenciales.",
            },
          },
        },
        tipoSancion: {
          type: "object",
          required: ["autoridadInvestigadora", "autoridadSubstanciadora", "ordenJurisdiccional"],
          properties: {
            ordenJurisdiccional: {
              title: "Orden jurisdiccional de la sanción.",
              description:
                "Seleccionar la opción correspondiente al nivel de la orden jurisdiccional de la autoridad.",
              enum: ["FEDERAL", "ESTATAL"],
              enumNames: ["Federal", "Estatal"],
            },
            autoridadResolutora: {
              type: "string",
              title: "Autoridad resolutora",
              description:
                "En su caso, indicar el nombre de la autoridad facultada para aplicar la sanción.",
            },
            autoridadInvestigadora: {
              type: "string",
              title: "Autoridad investigadora",
              description:
                "Especificar el nombre de la autoridad encargada de la investigación de la abstención grave",
            },
            autoridadSubstanciadora: {
              type: "string",
              title: "Nombre de la autoridad substanciadora.",
              description:
                "Señalar el nombre de la autoridad substanciadora del procedimiento.",
            },
          },
        },
        observaciones: {
          title: "6. OBSERVACIONES",
          type: "string",
          description:
            "En este espacio podrá realizar las aclaraciones u observaciones que considere pertinentes respecto de alguno o algunos de los apartados del documento.",
        },
      },
    },
  },
};

export default data;
