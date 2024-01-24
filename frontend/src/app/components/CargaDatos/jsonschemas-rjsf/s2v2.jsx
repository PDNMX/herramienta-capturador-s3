let data = {
  definitions: {
    responsabilidadTipo1: {
      enumNames: [ "Elaborar", "Revisar", "Firmar, Autorizar o Dictaminar", "Supervisar", "Emitir o Suscribir" ],
      enum: ["ELABORAR", "REVISAR", "FIRMAR_AUTORIZAR_DICTAMINAR", "SUPERVISAR", "EMITIR_SUSCRIBIR" ]
    },
    responsabilidadTipo2: {
      enumNames: [ "Elaborar", "Revisar", "Firmar, Autorizar o Dictaminar", "Supervisar" ],
      enum: ["ELABORAR", "REVISAR", "FIRMAR_AUTORIZAR_DICTAMINAR", "SUPERVISAR" ]
    },
    responsabilidadTipo3: {
      enumNames: [ "Elaborar", "Revisar", "Emitir o Suscribir" ],
      enum: ["ELABORAR", "REVISAR", "EMITIR_SUSCRIBIR" ]
    },
  },
  type: "object",
  description:
    "Indicar los datos generales de la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema.",
  title: "1. DATOS GENERALES DE LA PERSONA SERVIDORA PÚBLICA",
  required: [
    "ejercicio",
    "nombres",
    "primerApellido",
    "segundoApellido",
    "curp",
    "rfc",
    "sexo",
    "entePublico",
    "empleoCargoComision",
    "procedimientos",
  ],
  properties: {
    ejercicio: {
      type: "string",
      title: "Ejercicio",
      format: "año",
      description:
        "Capturar el ejercicio fiscal que corresponde al registro de la información.",
      //example: "2018",
    },
    nombres: {
      type: "string",
      title: "Nombre (s)",
      format: 'soloTexto',
      description:
        "Escribir el o los nombres de la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema, sin abreviaturas.",
      //example: "Juan",
    },
    primerApellido: {
      type: "string",
      title: "Primer Apellido",
      format: 'soloTexto',
      description:
        "Escribir el primer apellido de la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema, sin abreviaturas.",
      //example: "Perez",
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
                /* valor: {
                  readOnly: true,
                  type: "string",
                  default: null,
                  const: null,
                  title: "Segundo Apellido",
                  description:
                    "Escribir el segundo apellido de la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema, sin abreviaturas.",
                  //example: "Gomez",
                }, */
              },
              required: ["sinSegundoApellido"],
            },
            {
              properties: {
                sinSegundoApellido: { const: false },
                valor: {
                  type: "string",
                  title: "Segundo Apellido",
                  format: 'soloTexto',
                  description:
                    "Escribir el segundo apellido de la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema, sin abreviaturas.",
                  //example: "Gomez",
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
      format: 'curp',
      description:
        "Escribir los dieciocho caracteres alfanuméricos como la emitió la Secretaría de Gobernación.  En caso de no contar con ella, podrá consultarla en la siguiente página: https://www.gob.mx/curp/",
      example: "PERG850101HDF",
    },
    rfc: {
      type: "string",
      format: 'rfc',
      title: "RFC con Homoclave",
      description:
        "Escribir los primeros diez caracteres básicos y los tres correspondientes a la homoclave. En caso de no contar con este dato, podrá consultarlo en la página del Servicio de Administración Tributaria: https://www.sat.gob.mx/aplicacion/operacion/31274/consulta-tu-clave-de-rfc-mediante-curp",
      example: "PERG850101XXX",
    },
    sexo: {
      type: "string",
      title: "Sexo",
      enum: ["FEMENINO", "MASCULINO"],
      description: "Seleccionar la opción que corresponda.",
      example: "MASCULINO",
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
            "Seleccionar la entidad federativa en la cual se localiza el ente público donde labora la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema.",
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
            {
              clave: "01",
              valor: "Aguascalientes",
            },
            {
              clave: "02",
              valor: "Baja California",
            },
            {
              clave: "03",
              valor: "Baja California Sur",
            },
            {
              clave: "04",
              valor: "Campeche",
            },
            {
              clave: "05",
              valor: "Coahuila de Zaragoza",
            },
            {
              clave: "06",
              valor: "Colima",
            },
            {
              clave: "07",
              valor: "Chiapas",
            },
            {
              clave: "08",
              valor: "Chihuahua",
            },
            {
              clave: "09",
              valor: "Ciudad de México",
            },
            {
              clave: "10",
              valor: "Durango",
            },
            {
              clave: "11",
              valor: "Guanajuato",
            },
            {
              clave: "12",
              valor: "Guerrero",
            },
            {
              clave: "13",
              valor: "Hidalgo",
            },
            {
              clave: "14",
              valor: "Jalisco",
            },
            {
              clave: "15",
              valor: "México",
            },
            {
              clave: "16",
              valor: "Michoacán de Ocampo",
            },
            {
              clave: "17",
              valor: "Morelos",
            },
            {
              clave: "18",
              valor: "Nayarit",
            },
            {
              clave: "19",
              valor: "Nuevo León",
            },
            {
              clave: "20",
              valor: "Oaxaca",
            },
            {
              clave: "21",
              valor: "Puebla",
            },
            {
              clave: "22",
              valor: "Querétaro",
            },
            {
              clave: "23",
              valor: "Quintana Roo",
            },
            {
              clave: "24",
              valor: "San Luis Potosí",
            },
            {
              clave: "25",
              valor: "Sinaloa",
            },
            {
              clave: "26",
              valor: "Sonora",
            },
            {
              clave: "27",
              valor: "Tabasco",
            },
            {
              clave: "28",
              valor: "Tamaulipas",
            },
            {
              clave: "29",
              valor: "Tlaxcala",
            },
            {
              clave: "30",
              valor: "Veracruz de Ignacio de la Llave",
            },
            {
              clave: "31",
              valor: "Yucatán",
            },
            {
              clave: "32",
              valor: "Zacatecas",
            },
          ],
        },
        ambitoGobierno: {
          type: "object",
          title: "Ámbito de gobierno",
          properties: {
            clave: {
              title: "Ámbito de Gobierno",
              description:
                "Seleccionar el orden de gobierno al que pertenece el ente público donde labora la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema.",
              enum: ["ESTATAL", "FEDERAL", "MUNICIPAL_ALCALDIA", "OTRO"],
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
                      format: 'soloTexto',
                      description: "Especifique",
                      type: "string",
                    },
                  },
                  required: ["valor"],
                },
                {
                  properties: {
                    clave: {
                      enum: ["ESTATAL", "FEDERAL", "MUNICIPAL_ALCALDIA"],
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
          enum: ["EJECUTIVO", "LEGISLATIVO", "JUDICIAL", "ORGANO_AUTONOMO"],
          enumNames: [
            "Ejecutivo",
            "Legislativo",
            "Judicial",
            "Órgano autónomo.",
          ],
          description:
            "Seleccionar el poder u órgano de gobierno del ente público donde labora la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema.",
          example: "EJECUTIVO",
        },
        nombre: {
          type: "string",
          format: 'soloTexto',
          title: "Nombre del ente público",
          description:
            "Escribir el nombre completo del ente público donde labora la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema, sin abreviaturas.",
          example: "Secretaría de Hacienda y Crédito Público",
        },
        siglas: {
          type: "string",
          format: 'soloTexto',
          title: "Siglas del ente público",
          description:
            "Escribir las siglas del ente público en el que labora la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema.",
          example: "SHCP",
        },
      },
    },
    empleoCargoComision: {
      type: "object",
      required: ["areaAdscripcion", "nivel", "nombre"],
      properties: {
        areaAdscripcion: {
          type: "string",
          title: "Área de adscripción",
          description: "Escribir el nombre de la unidad administrativa a la que está adscrita la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema. ",
          example: "Departamento de Recursos Humanos",
        },
        nivel: {
          type: "string",
          title: "Clave o nivel del empleo, cargo o comisión",
          description:
            "Escribir el nombre de la unidad administrativa a la que está adscrita la persona servidora pública que interviene en alguno de los procedimientos citados en el objeto del sistema.",
          example: "Q19",
        },
        nombre: {
          type: "string",
          format: 'soloTexto',
          title: "Denominación del empleo, cargo o comisión",
          description:
            "Escribir el nombre completo del empleo, cargo o comisión que aparece en su recibo de nómina, nombramiento, contrato u oficio de comisión.",
          example: "Jefe de Departamento",
        },
      },
    },

    procedimientos: {
      type: "object",
      title:
        "3. TIPO DE PROCEDIMIENTO EN EL QUE PARTICIPA LA PERSONA SERVIDORA PÚBLICA",
      properties: {
        tipo: {
          title:
            "Seleccionar el procedimiento administrativo en el que participa la persona servidora pública, pudiendo elegir entre las siguientes opciones:",
          type: "string",
          enum: [
            "CONTRATACION_PUBLICA",
            "CONCESIONES",
            "ENAJENACION_BIEN_MUEBLE",
            "DICTAMEN_AVALUO",
          ],
          enumNames: [
            "Contratación pública",
            "Otorgamiento de concesiones, licencias, permisos, autorizaciones y sus prórrogas",
            "Enajenación de bienes muebles",
            "Emisión de dictamen valuatorio y justipreciación de rentas",
          ],
        },
      },
      required: ["tipo"],
      dependencies: {
        tipo: {
          oneOf: [
            {
              properties: {
                tipo: {
                  enum: ["CONTRATACION_PUBLICA"],
                },
                tipoArea: {
                  type: "object",
                  title: "Tipo de área de adscripción",
                  description:
                    "Se deberá seleccionar el rol del área en la que labora, pudiendo, de ser el caso, elegir más de una opción:",
                  properties: {
                    tipo: {
                      title: "",
                      description: "",
                      type: "string",
                      enumNames: ["Bienes y servicios", "Obra pública"],
                      enum: ["bienesServicios", "obraPublica"],
                    },
                  },
                  dependencies: {
                    tipo: {
                      oneOf: [
                        {
                          properties: {
                            tipo: {
                              enum: ["bienesServicios"],
                            },
                            areas: {
                              title:
                                "En contratación de adquisiciones y arrendamientos de bienes muebles y servicios de cualquier naturaleza:",
                              type: "array",
                              uniqueItems: true,
                              items: {
                                type: "string",
                                enum: [
                                  "REQUIRENTE",
                                  "CONTRATANTE",
                                  "TECNICA",
                                  "OTRA",
                                ],
                                enumNames: [
                                  "Requirente",
                                  "Contratante",
                                  "Técnica",
                                  "Otra (especificar)",
                                ],
                              },
                            },
                          },
                          dependencies: {
                            areas: {
                              oneOf: [
                                { properties: { areas: { const: ["REQUIRENTE"], } }, },
                                { properties: { areas: { const: ["CONTRATANTE"], } }, },
                                { properties: { areas: { const: ["TECNICA"], } }, },
                                { properties: { areas: { const: ["OTRA"], }, otroValor: { type: "string", title: "Especifique", }, }, },
                                { properties: { areas: { const: ["REQUIRENTE","CONTRATANTE"], } }, },
                                { properties: { areas: { const: ["REQUIRENTE","TECNICA"], } }, },
                                { properties: { areas: { const: ["REQUIRENTE","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["CONTRATANTE","TECNICA"], } }, },
                                { properties: { areas: { const: ["CONTRATANTE","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["TECNICA","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["REQUIRENTE","CONTRATANTE","TECNICA"], } }, },
                                { properties: { areas: { const: ["REQUIRENTE","CONTRATANTE","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["REQUIRENTE","TECNICA","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["CONTRATANTE","TECNICA","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["REQUIRENTE","CONTRATANTE","TECNICA","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                              ],
                            },
                          },
                        },
                        {
                          properties: {
                            tipo: {
                              enum: ["obraPublica"],
                            },
                            areas: {
                              title:
                                "Contratación de obra pública y los servicios relacionados con la misma:",
                              type: "array",
                              uniqueItems: true,
                              items: {
                                type: "string",
                                enum: [
                                  "REQUIRENTE",
                                  "RESPONSABLE_CONTRATACION",
                                  "TECNICA",
                                  "RESPONSABLE_EJECUCION",
                                  "OTRA",
                                ],
                                enumNames: [
                                  "Requirente",
                                  "Responsable de la contratación",
                                  "Técnica",
                                  "Responsable de la ejecucción de los trabajos",
                                  "Otra (especificar)",
                                ],
                              },
                            },
                          },
                          dependencies: {
                            areas: {
                              oneOf: [
                                { properties: { areas: { const: ["REQUIRENTE"], } }, },
                                { properties: { areas: { const: ["RESPONSABLE_CONTRATACION"], } }, },
                                { properties: { areas: { const: ["TECNICA"], } }, },
                                { properties: { areas: { const: ["RESPONSABLE_EJECUCION"], } }, },
                                { properties: { areas: { const: ["OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["REQUIRENTE","RESPONSABLE_CONTRATACION"], } }, },
                                { properties: { areas: { const: ["REQUIRENTE","TECNICA"], } }, },
                                { properties: { areas: { const: ["REQUIRENTE","RESPONSABLE_EJECUCION"], } }, },
                                { properties: { areas: { const: ["REQUIRENTE","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["RESPONSABLE_CONTRATACION","TECNICA"], } }, },
                                { properties: { areas: { const: ["RESPONSABLE_CONTRATACION","RESPONSABLE_EJECUCION"], } }, },
                                { properties: { areas: { const: ["RESPONSABLE_CONTRATACION","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["TECNICA","RESPONSABLE_EJECUCION"], } }, },
                                { properties: { areas: { const: ["TECNICA","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["RESPONSABLE_EJECUCION","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["REQUIRENTE","RESPONSABLE_CONTRATACION","TECNICA"], } }, },
                                { properties: { areas: { const: ["REQUIRENTE","RESPONSABLE_CONTRATACION","RESPONSABLE_EJECUCION"], } }, },
                                { properties: { areas: { const: ["REQUIRENTE","RESPONSABLE_CONTRATACION","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["REQUIRENTE","TECNICA","RESPONSABLE_EJECUCION"], } }, },
                                { properties: { areas: { const: ["REQUIRENTE","TECNICA","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["REQUIRENTE","RESPONSABLE_EJECUCION","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["RESPONSABLE_CONTRATACION","TECNICA","RESPONSABLE_EJECUCION"], } }, },
                                { properties: { areas: { const: ["RESPONSABLE_CONTRATACION","TECNICA","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["RESPONSABLE_CONTRATACION","RESPONSABLE_EJECUCION","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["TECNICA","RESPONSABLE_EJECUCION","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["REQUIRENTE","RESPONSABLE_CONTRATACION","TECNICA","RESPONSABLE_EJECUCION"], } }, },
                                { properties: { areas: { const: ["REQUIRENTE","RESPONSABLE_CONTRATACION","TECNICA","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["REQUIRENTE","RESPONSABLE_CONTRATACION","RESPONSABLE_EJECUCION","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["REQUIRENTE","TECNICA","RESPONSABLE_EJECUCION","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["RESPONSABLE_CONTRATACION","TECNICA","RESPONSABLE_EJECUCION","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                                { properties: { areas: { const: ["REQUIRENTE","RESPONSABLE_CONTRATACION","TECNICA","RESPONSABLE_EJECUCION","OTRA"], }, otroValor: { type: "string", title: "Especifique", } }, },
                              ],
                            },
                          },
                        },
                      ],
                    },
                  },
                },
                nivelesResponsabilidad: {
                  title: "Objeto y Nivel de responsabilidad",
                  type: "object",
                  properties: {
                    idObj1: {
                      title: "a) Autorizaciones o dictámenes previos para llevar a cabo determinado procedimiento de contratación",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo2",
                      },
                    },
                    idObj2: {
                      title:"b) Justificación para la excepción a la licitación pública",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo2",
                      },
                    },
                    idObj3: {
                      title:"c) Convocatoria, invitación o solicitud de cotización y, en su caso, bases del concurso y modificaciones",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo2",
                      },
                    },
                    idObj4: {
                      title: "d) Evaluación de proposiciones",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo2",
                      },
                    },
                    idObj5: {
                      title: "e) Adjudicación del contrato",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo3",
                      },
                    },
                    idObj6: {
                      title: "d) Formalización del contrato",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo3",
                      },
                    },
                  },
                },
              },
            },
            {
              properties: {
                tipo: {
                  enum: ["CONCESIONES"],
                },
                otorgamiento: {
                  type: "array",
                  title:
                    "Identificar el procedimiento que corresponda: Seleccionar el procedimiento que corresponda:",
                  items: {
                    type: "string",
                    enum: [
                      "Concesiones",
                      "Licencias",
                      "Permisos",
                      "Autorizaciones",
                    ],
                    enumNames: [
                      "Concesiones y sus prórrogas",
                      "Licencias y sus prórrogas",
                      "Permisos y sus prórrogas",
                      "Autorizaciones y sus prórrogas",
                    ],
                  },
                  uniqueItems: true,
                },
                nivelesResponsabilidad: {
                  title: "Objeto y Nivel de responsabilidad",
                  type: "object",
                  properties: {
                    idObj1: {
                      title: "a) Convocatoria a concurso o licitación o excitativa a presentar la solicitud de autorización",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo2",
                      },
                    },
                    idObj2: {
                      title: "b) Dictámenes u opiniones previos",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo2",
                      },
                    },
                    idObj3: {
                      title: "c) Visitas de verificación",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo2",
                      },
                    },
                    idObj4: {
                      title:"d) Evaluación del cumplimiento de los requisitos para el otorgamiento de la concesión, licencia, autorización, permiso, o sus prórrogas",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo2",
                      },
                    },
                    idObj5: {
                      title: "e) Determinación sobre el otorgamiento de la concesión,licencia, autorización, permiso o sus prórrogas",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo3",
                      },
                    },
                  },
                },
              },
            },
            {
              properties: {
                tipo: {
                  enum: ["ENAJENACION_BIEN_MUEBLE"],
                },
                nivelesResponsabilidad: {
                  title: "Objeto y Nivel de responsabilidad",
                  type: "object",
                  properties: {
                    idObj1: {
                      title: "a) Autorizaciones o dictámenes previos para llevar a cabo determinado procedimiento de enajenación de bienes muebles",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo2",
                      },
                    },
                    idObj2: {
                      title: "b) Análisis o autorización para llevar a cabo la donación, permuta o dación en pago",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo2",
                      },
                    },
                    idObj3: {
                      title: "c) Modificaciones a las bases",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo2",
                      },
                    },
                    idObj4: {
                      title: "d) Presentación y apertura de ofertas",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo2",
                      },
                    },
                    idObj5: {
                      title: "e) Evaluación de ofertas",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo2",
                      },
                    },
                    idObj6: {
                      title: "f) Adjudicación de los bienes muebles",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo3",
                      },
                    },
                    idObj7: {
                      title: "g) Formalización del contrato",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo3",
                      },
                    },
                  },
                },
              },
            },
            {
              properties: {
                tipo: {
                  enum: ["DICTAMEN_AVALUO"],
                },
                nivelesResponsabilidad: {
                  title: "Objeto y Nivel de responsabilidad",
                  type: "object",
                  properties: {
                    idObj1: {
                      title: "a) Propuestas de asignaciones de avalúos o justipreciaciones de renta a peritos que formen parte del padrón nacional de peritos valuadores del INDAABIN",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo2",
                      },
                    },
                    idObj2: {
                      title: "b) Asignación de avalúos y justipreciaciones de renta a peritos que formen parte del padrón nacional de peritos valuadores del INDAABIN",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo1",
                      },
                    },
                    idObj3: {
                      title: "c) Emisión de dictámenes valuatorios (avalúos y justipreciaciones de renta)",
                      type: "array",
                      uniqueItems: true,
                      items: {
                        $ref: "#/definitions/responsabilidadTipo1",
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },

    observaciones: {
      type: "string",
      title: "4. OBSERVACIONES",
      description: "En este espacio se podrán realizar las aclaraciones u observaciones que se consideren pertinentes.",
    },
  },
};

export default data;
