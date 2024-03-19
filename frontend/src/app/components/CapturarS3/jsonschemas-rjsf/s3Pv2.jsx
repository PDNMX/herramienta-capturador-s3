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
      enumNames:["Ejecutivo","Legislativo","Judicial","Organo autonomo"],
    },
    domicilio: {
      type: "object",
      title: "Domicilio",
      properties: {
        domicilioExtranjero: {
          type: "boolean",
          default: false,
          title: "Domicilio extranjero",
        },
      },
      dependencies: {
        domicilioExtranjero: {
          oneOf: [
            {
              properties: {
                domicilioExtranjero: { const: true },
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
                  type: "string",
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
              required: ["domicilioExtranjero"],
            },
            {
              properties: {
                domicilioExtranjero: { const: false },
                vialidad: {
                  type: "object",
                  title: "",
                  required: ["clave", "valor", "numeroExterior", "colonia"],
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
                      description: "Escribir el nombre completo de la colonia.",
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
              required: [
                "vialidad",
                "localidad",
                "municipio",
                "codigoPostal",
                "entidadFederativa",
              ],
            },
          ],
        },
      },
    },
    origen: {
      type: "object",
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
            "Auditoría Superior de la Federación o Entidades de Fiscalización Superior de las Entidades Federativas",
            "Auditoría del Órgano Interno de Control del Ente Público",
            "Queja Ciudadana",
            "Denuncia Ciudadana",
            "Denuncia de Servidor Público",
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
    resoluciones: {
      type: "object",
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
    general: {
      type: "object",
      required: ["nombres", "primerApellido", "segundoApellido", "rfc", "curp"],
      properties: {
        nombres: {
          type: "string",
          title: "Nombre (s)",
          description:
            "Escribir el o los nombres, sin abreviaturas, ni signos especiales.",
        },
        primerApellido: {
          type: "string",
          title: "Primer Apellido",
          description:
            "Escribir el primer apellido sin abreviaturas, ni signos especiales.",
        },
        segundoApellido: {
          title: "",
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
                        "Escribir el segundo apellido , sin abreviaturas, ni signos especiales.",
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
          title: "RFC",
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
  },
  type: "object",
  title: "SISTEMA DE PARTICULARES SANCIONADOS",
  description: "Nuevo registro",
  properties: {
    expediente: {
      type: "string",
      description:
        "Número de expediente del procedimiento que se inicie en materia de responsabilidades administrativas.",
      example: "EXP-2023-456",
    },
    tipoPersona: {
      title: "Tipo de persona",
      description: "Selecciona el tipo de persona a registrar.",
      type: "string",
      enumNames: ["Persona Física", "Persona Moral"],
      enum: ["FISICA", "MORAL"],
    },
  },
  required: ["tipoPersona"],
  dependencies: {
    tipoPersona: {
      oneOf: [
        {
          properties: {
            tipoPersona: {
              enum: ["FISICA"],
            },
            personaFisica: {
              type: "object",
              title: "1. DATOS GENERALES DE LA PERSONA FÍSICA SANCIONADA",
              description:
                "Indicar los datos generales de la persona física sancionada.",
              required: [
                "nombres",
                "primerApellido",
                "segundoApellido",
                "curp",
                "rfc",
                "telefono",
                "objetoSocial",
                "domicilioMexico",
                "entePublico",
                "faltaCometida",
                "origenInvestigacion",
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
                    "Escribir el o los nombres de la persona física sancionada, sin abreviaturas, ni signos especiales.",
                },
                primerApellido: {
                  type: "string",
                  title: "Primer Apellido",
                  description:
                    "Escribir el primer apellido de la persona física sancionada, sin abreviaturas, ni signos especiales.",
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
                                "Escribir el segundo apellido de la persona física sancionada, sin abreviaturas, ni signos especiales.",
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
                telefono: {
                  type: "string",
                  title: "Telefono",
                  description:
                    "Escribir el número de teléfono de la persona física estandarizado http://www.itu.int/dms_pub/itu-t/opb/sp/T-SP-E.164D-2009-PDF-S.pdf",
                },
                objetoSocial: {
                  type: "string",
                  title: "Objeto social de la actividad",
                  description:
                    "Describir la o las actividades principales que lleva a cabo la persona física.",
                },
                domicilioMexico: {
                  $ref: "#/definitions/domicilio",
                },
                entePublico: {
                  type: "object",
                  title:
                    "2. DATOS DEL ENTE PÚBLICO EN DONDE SE COMETIÓ LA FALTA ADMINISTRATIVA",
                  description: "",
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
                        "Seleccionar la entidad federativa en la cual se localiza el ente público donde se cometió la falta administrativa.",
                      $ref: "#/definitions/entidad",
                    },
                    ambitoGobierno: {
                      type: "object",
                      title: "Ámbito de gobierno",
                      properties: {
                        clave: {
                          title: "Ámbito de Gobierno",
                          description:
                            "Seleccionar el orden de gobierno al que pertenece el ente público en donde se cometió la falta administrativa: Federal, Estatal, Municipal/Alcaldía u otro (especificar).",
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
                        "Seleccionar el poder u órgano de gobierno del ente público en donde se cometió la falta administrativa: EJECUTIVO, LEGISLATIVO, JUDICIAL, ÓRGANO AUTÓNOMO.",
                      $ref: "#/definitions/poder",
                    },
                    nombre: {
                      type: "string",
                      title: "Nombre del ente público",
                      description:
                        "Escribir el nombre completo del ente público en donde se cometió la falta administrativa, sin abreviaturas, sin acentos, ni signos especiales.",
                    },
                    siglas: {
                      type: "string",
                      title: "Siglas del ente público",
                      description:
                        "Escribir las siglas del ente público en donde se cometió la falta administrativa.",
                    },
                  },
                },
                faltaCometida: {
                  type: "array",
                  title: "3. FALTA COMETIDA DE LA PERSONA FÍSICA",
                  items: {
                    type: "object",
                    title: "Tipo de falta cometida",
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
                          "Otro"
                        ],
                      },
                      nombreNormatividadInfringida: {
                        type: "string",
                        title: "Ley y/o normatividad infringida",
                        description:
                          "Escribir el nombre de la ley o normatividad infringida por la persona física.",
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
                            "Escribir la fracción(s) infringida de la normatividad infringida.",
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
                origenInvestigacion: {
                  title: "4. ORIGEN DE LA FALTA ADMINISTRATIVA",
                  $ref: "#/definitions/origen",
                },
                resolucion: {
                  title: "5. TIPO DE SANCIÓN APLICADA A LA PERSONA FÍSICA",
                  $ref: "#/definitions/resoluciones",
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
                  title: "6. TIPO DE SANCIÓN APLICADA A LA PERSONA FÍSICA ",
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
                          "INHABILITADO",
                          "INDEMNIZACION",
                          "SANCION_ECONOMICA",
                          "OTRO",
                        ],
                        enumNames: [
                          "Inhabilitado",
                          "Indemnización",
                          "Sanción económica",
                          "Otro"
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
                              descripcion: {
                                type: "string",
                                title: "Descripción",
                                description:
                                  "Descripción o nota aclaratoria del tipo de sanción infringida.",
                              },
                              inhabilitacion: {
                                type: "object",
                                title: "INHABILITADO",
                                required: ["plazo", "constancia"],
                                properties: {
                                  plazo: {
                                    type: "string",
                                    title: "Plazo de inhabilitacion",
                                    description:
                                      "Colocar el tiempo que la Persona Física queda inhabilitada, empezando por año(s), mes(es) y día(s).",
                                  },
                                  fechaInicial: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha inicial de la suspensión",
                                    description:
                                      "Registrar la fecha en la que inició la inhabilitación de la persona física en formato dd-mm-aaaa.",
                                  },
                                  fechaFinal: {
                                    type: "string",
                                    format: "date",
                                    title: "Fecha final de la suspensión",
                                    description:
                                      "Indicar la fecha en la que se concluyó la inhabilitación de la persona física en formato dd-mm-aaaa.",
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
                                enum: ["INDEMNIZACION"],
                              },
                              descripcion: {
                                type: "string",
                                title: "Descripción",
                                description:
                                  "Descripción o nota aclaratoria del tipo de sanción infringida.",
                              },
                              indemmozacionE: {
                                type: "object",
                                title: "INDEMNIZACION",
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
                                      "Colocar el monto total correspondiente a la indemnizacion.",
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
                                      "Colocar el plazo de pago de la indemnizacion de la persona física, empezando por año(s), mes(es) y día(s).",
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
                                          "Colocar el monto total cobrado de la indemnizacion.",
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
                                          "Registrar la fecha en que se realizó el cobro de la indemnizacion en formato dd-mm-aaaa.",
                                      },
                                      fechaPagoSancion: {
                                        type: "string",
                                        format: "date",
                                        title:
                                          "Fecha en la que se realizo el pago total de la sanción",
                                        description:
                                          "En caso de no pagarse en una sola exhibición la indemnizacion, especificar la fecha en que la persona física cubrió el pago total de la sanción económica en formato dd-mm-aaaa.",
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
                                      "Colocar el plazo de pago de la sanción económica de la persona física, empezando por año(s), mes(es) y día(s).",
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
                                          "En caso de no pagarse en una sola exhibición la sanción económica, especificar la fecha en que la persona física cubrió el pago total de la sanción económica en formato dd-mm-aaaa.",
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
                  title: "7. OBSERVACIONES",
                  type: "string",
                  description:
                    "En este espacio se podrán realizar las observaciones que se consideren pertinentes. aclaraciones u En virtud de que las aclaraciones pueden contener información reservada y/o confidencial, esta información no será de carácter pública.",
                },
              },
            },
          },
          required: ["personaFisica"],
        },
        {
          properties: {
            tipoPersona: {
              enum: ["MORAL"],
            },
            personaMoral: {
              title: "1. DATOS GENERALES DE LA PERSONA MORAL",
              description:
                "Indicar los datos generales de la persona moral sancionada.",
              type: "object",
              required: [
                "rfc",
                "razonSocial",
                "telefono",
                "objetoSocial",
                "domicilioMexico",
                "directorGeneral",
                "representanteLegal",
                "entePublico",
                "faltaCometida",
                "origenInvestigacion",
                "resolucion",
                "autoridadSancionadora",
                "ordenJurisdiccionalSancion",
                "tipoSancion",
                "observaciones",
              ],
              properties: {
                rfc: {
                  type: "string",
                  title: "RFC",
                  description:
                    "Escribir los primeros diez caracteres básicos y los tres correspondientes a la homoclave. En caso de no contar con este dato, podrá consultarlo en la página del Servicio de Administración Tributaria: https://www.sat.gob.mx/aplicacion/operacion/31274/consulta-tu-clave-de-rfc-mediante-curp",
                },
                razonSocial: {
                  type: "string",
                  title: "CURP",
                  description:
                    "Indicar la denominación o razón social de la empresa tal y como se encuentra registrada en la escritura pública.",
                },
                telefono: {
                  type: "string",
                  title: "Telefono",
                  description:
                    "Escribir el número de teléfono de la persona moral estandarizado http://www.itu.int/dms_pub/itu-t/opb/sp/T-SP-E.164D-2009-PDF-S.pdf",
                },
                objetoSocial: {
                  type: "string",
                  title: "Objeto social de la actividad",
                  description:
                    "Describir la o las actividades principales que lleva a cabo la persona moral.",
                },
                domicilioMexico: {
                  $ref: "#/definitions/domicilio",
                },
                directorApoderado: {
                  type: "object",
                  title:
                    "2. DATOS GENERALES DEL DIRECTOR GENERAL Y APODERADO LEGAL DE LA PERSONA MORAL",
                  properties: {
                    directorGeneral: {
                      title: "Director general de la persona moral",
                      $ref: "#/definitions/general"
                    },
                    representanteLegal: {
                      title: "Representante legal de la persona moral",
                      $ref: "#/definitions/general"
                    },
                  },
                },
                entePublico: {
                  type: "object",
                  title:
                    "3. DATOS DEL ENTE PÚBLICO EN DONDE SE COMETIÓ LA FALTA ADMINISTRATIVA",
                  description: "",
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
                        "Seleccionar la entidad federativa en la cual se localiza el ente público donde se cometió la falta administrativa.",
                      $ref: "#/definitions/entidad",
                    },
                    ambitoGobierno: {
                      type: "object",
                      title: "Ámbito de gobierno",
                      properties: {
                        clave: {
                          title: "Ámbito de Gobierno",
                          description:
                            "Seleccionar el orden de gobierno al que pertenece el ente público en donde se cometió la falta administrativa: Federal, Estatal, Municipal/Alcaldía u otro (especificar).",
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
                        "Seleccionar el poder u órgano de gobierno del ente público en donde se cometió la falta administrativa: EJECUTIVO, LEGISLATIVO, JUDICIAL, ÓRGANO AUTÓNOMO.",
                      $ref: "#/definitions/poder",
                    },
                    nombre: {
                      type: "string",
                      title: "Nombre del ente público",
                      description:
                        "Escribir el nombre completo del ente público en donde se cometió la falta administrativa, sin abreviaturas, sin acentos, ni signos especiales.",
                    },
                    siglas: {
                      type: "string",
                      title: "Siglas del ente público",
                      description:
                        "Escribir las siglas del ente público en donde se cometió la falta administrativa.",
                    },
                  },
                },
                origenInvestigacion: {
                  title: "4. ORIGEN DE LA FALTA ADMINISTRATIVA",
                  $ref: "#/definitions/origen",
                },
                faltaCometida: {
                  type: "array",
                  title: "5. FALTA COMETIDA DE LA PERSONA MORAL",
                  items: {
                    type: "object",
                    title: "Tipo de falta cometida",
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
                          "Otro"
                        ],
                      },
                      nombreNormatividadInfringida: {
                        type: "string",
                        title: "Ley y/o normatividad infringida",
                        description:
                          "Escribir el nombre de la ley o normatividad infringida por la persona moral.",
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
                            "Escribir la fracción(s) infringida de la normatividad infringida.",
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
                  title: "6. TIPO DE SANCIÓN APLICADA A LA PERSONA MORAL",
                  $ref: "#/definitions/resoluciones",
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
                  title: "7. TIPO DE SANCIÓN APLICADA A LA PERSONA MORAL ",
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
                          "INHABILITADO",
                          "INDEMNIZACION",
                          "SANCION_ECONOMICA",
                          "SUSPENSION_DE_ACTIVIDADES",
                          "DISOLUCION_DE_LA_SOCIEDAD",
                          "OTRO",
                        ],
                        enumNames: [
                          "Inhabilitado",
                          "Indemnización",
                          "Sanción económica",
                          "Suspensión de actividades",
                          "Disolución de la sociedad",
                          "Otro"
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
                              descripcion: {
                                type: "string",
                                title: "Descripción",
                                description:
                                  "Descripción o nota aclaratoria del tipo de sanción infringida.",
                              },
                              inhabilitacion: {
                                type: "object",
                                title: "INHABILITADO",
                                required: ["plazo", "constancia"],
                                properties: {
                                  plazo: {
                                    type: "object",
                                    title: "Plazo de la suspensión",
                                    description:
                                      "Colocar el plazo de la inhabilitación de la persona moral, empezando por año(s), mes(es) y día(s).",
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
                                          "Registrar la fecha en la que inició la inhabilitación de la persona moral en formato dd-mm-aaaa.",
                                      },
                                      fechaFinal: {
                                        type: "string",
                                        format: "date",
                                        title: "Fecha final de la suspensión",
                                        description:
                                          "Indicar la fecha en la que se concluyó la inhabilitación de la persona moral en formato dd-mm-aaaa.",
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
                                enum: ["INDEMNIZACION"],
                              },
                              descripcion: {
                                type: "string",
                                title: "Descripción",
                                description:
                                  "Descripción o nota aclaratoria del tipo de sanción infringida.",
                              },
                              indemmozacionE: {
                                type: "object",
                                title: "INDEMNIZACION",
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
                                      "Colocar el monto total correspondiente a la indemnizacion.",
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
                                      "Colocar el plazo de pago de la indemnizacion de la persona moral, empezando por año(s), mes(es) y día(s).",
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
                                          "Colocar el monto total cobrado de la indemnizacion.",
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
                                          "Registrar la fecha en que se realizó el cobro de la indemnizacion en formato dd-mm-aaaa.",
                                      },
                                      fechaPagoSancion: {
                                        type: "string",
                                        format: "date",
                                        title:
                                          "Fecha en la que se realizo el pago total de la sanción",
                                        description:
                                          "En caso de no pagarse en una sola exhibición la indemnizacion, especificar la fecha en que la persona moral cubrió el pago total de la sanción económica en formato dd-mm-aaaa.",
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
                                      "Colocar el plazo de pago de la sanción económica de la persona moral, empezando por año(s), mes(es) y día(s).",
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
                                          "En caso de no pagarse en una sola exhibición la sanción económica, especificar la fecha en que la persona moral cubrió el pago total de la sanción económica en formato dd-mm-aaaa.",
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
                                enum: ["SUSPENSION_DE_ACTIVIDADES"],
                              },
                              descripcion: {
                                type: "string",
                                title: "Descripción",
                                description:
                                  "Descripción o nota aclaratoria del tipo de sanción infringida.",
                              },
                              suspensionActividades: {
                                type: "object",
                                title:
                                  "SUSPENSIÓN DE ACTIVIDADES",
                                required: ["fechaInicial", "fechaFinal","constancia"],
                                properties: {
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
                                  constancia: {
                                    $ref: "#/definitions/constancias",
                                  },
                                },
                              },
                            },
                            required: [
                              "descripcion",
                              "suspensionActividades",
                            ],
                          },
                          {
                            properties: {
                              clave: {
                                enum: ["DISOLUCION_DE_LA_SOCIEDAD"],
                              },
                              descripcion: {
                                type: "string",
                                title: "Descripción",
                                description:
                                  "Descripción o nota aclaratoria del tipo de sanción infringida.",
                              },
                              disolucionSociedad: {
                                type: "object",
                                title:
                                  "DISOLUCIÓN DE LA SOCIEDAD",
                                required: ["fechaDisolucion","constancia"],
                                properties: {
                                  fechaDisolucion: {
                                    title: "Fecha inicial",
                                    type: "string",
                                    format: "date",
                                    description:
                                      "Indicar la fecha a partir de la cual se disuleve la sociedad en formato dd-mm-aaaa.",
                                  },
                                  constancia: {
                                    $ref: "#/definitions/constancias",
                                  },
                                },
                              },
                            },
                            required: [
                              "descripcion",
                              "disolucionSociedad",
                            ],
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
                  title: "8. OBSERVACIONES",
                  type: "string",
                  description:
                    "En este espacio se podrán realizar las observaciones que se consideren pertinentes. aclaraciones u En virtud de que las aclaraciones pueden contener información reservada y/o confidencial, esta información no será de carácter pública.",
                },
              },
            },
          },
          required: ["personaMoral"],
        },
      ],
    },
  },
};

export default data;
