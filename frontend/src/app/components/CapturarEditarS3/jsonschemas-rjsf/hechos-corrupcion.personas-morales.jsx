// HECHOS DE CORRUPCION - PERSONAS MORALES (9)
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
    general: {
      type: "object",
      required: ["nombres", "primerApellido", "segundoApellido", "rfc", "curp"],
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
            "Escribir el primer apellido sin abreviaturas, sin acentos, ni signos especiales.",
        },
        segundoApellido: {
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
                        "Escribir el segundo apellido , sin abreviaturas, sin acento, ni signos especiales.",
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
      },
    },
  },
  type: "object",
  required: ["expediente", "hechosMorales"],
  properties: {
    expediente: {
      type: "string",
      title: "Expediente",
      description: "Registrar el número de expediente del procedimiento.",
    },
    hechosMorales: {
      title: "1. DATOS GENERALES DE LA PERSONA MORAL",
      description:
        "En esta sección se registrarán los datos generales de la persona moral sancionada.",
      type: "object",
      required: [
        "rfc",
        "razonSocial",
        "domicilioMexico",
        "directorApoderado",
        "entePublico",
        "origenTipo",
        "resolucion",
        "tipoSancion",
        "observaciones",
      ],
      properties: {
        rfc: {
          type: "string",
          title: "RFC con homoclave",
        },
        //En el documento de descripciones está en otro orden primero va denominación o razón social
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
        //En el documento de descripciones este campo no tiene descripción
        //ni algún ejemplo, checar con Yu.
        objetoSocial: {
          type: "string",
          title: "Objeto social de la actividad",
          description: "Proporcionar el objeto social de la persona moral.",
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
                      //se va a usar el siguiente titulo?
                      title: "Domicilio en la República Mexicana",
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
                          title: "Municipio/Alcaldía",
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
            "En este apartado se indicaran los datos del Director General y el Apoderado Legal de la persona moral.",
          properties: {
            directorGeneral: {
              title: "Director general de la persona moral",
              $ref: "#/definitions/general",
            },
            representanteLegal: {
              title: "Representante legal de la persona moral",
              $ref: "#/definitions/general",
            },
          },
        },
        entePublico: {
          type: "object",
          title:
            "3. DATOS DEL ENTE PÚBLICO EN DONDE SE COMETIÓ EL HECHO DE CORRUPCIÓN",
          description:
            "Indicar (si aplica) los datos del ente público donde se cometió el hecho de corrupción.",
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
                "Seleccionar la entidad federativa en la cual se localiza el ente público donde se cometió el hecho de corrupción.",
              $ref: "#/definitions/entidad",
            },
            nivelOrdenGobierno: {
              type: "object",
              properties: {
                clave: {
                  title: "Nivel/Orden de Gobierno",
                  description:
                    "Seleccionar el orden de gobierno al que pertenece el ente público donde labora la persona moral sancionada: Federal, Estatal, Municipal/Alcaldía u otro (especificar).",
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
        },
        origenInvestigacion: {
          type: "object",
          title: "4. ORIGEN DEL PROCEDIMIENTO",
          description:
            "Seleccionar conforme al catálogo el motivo que dio origen al procedimiento:",
          required: ["clave"],
          properties: {
            clave: {
              title: "Origen del procedimiento",
              // se quita ésta descripción por que ya era redundante
              /*description:
                "Seleccionar conforme al catálogo el origen de la falta administrativa:",*/
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
          title: "5. TIPO DE DELITO COMETIDO POR LA PERSONA MORAL",
          description:
            "En esta sección se señalarán los datos relativos al delito cometido por la persona moral.",
          items: {
            type: "object",
            required: ["clave", "nombreNormatividad", "articuloNormatividad"],
            properties: {
              nombreNormatividad: {
                type: "string",
                title: "Ley o normatividad infringida",
                description:
                  "Escribir el nombre de la ley o normatividad infringida.",
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
                description:
                  "Realizar una descripción breve de los hechos sin incluir información reservada o confidencial.",
              },
            },
          },
        },
        resolucion: {
          type: "object",
          title:
            "6. RESOLUCIÓN FIRME POR LA COMISIÓN DE DELITOS POR HECHOS DE CORRUPCIÓN",
          description:
            "En esta sección se señalarán los datos relativos a la resolución firme.",
          required: [
            "documentoResolucion",
            "fechaResolucion",
            "fechaNotificacion",
            "urlResolucion",
            "fechaResolucionFirme",
            "fechaNotificacionFirme",
            "urlResolucionFirme",
          ],
          properties: {
            documentoResolucion: {
              type: "string",
              title: "Título del documento",
              description:
                "Escribir el nombre del documento de la resolución definitiva que resuelve el procedimiento y que ha quedado firme, sin abreviaturas, sin acentos, ni signos especiales.",
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
                "Indicar la fecha en que se notifica la resolución a la persona moral, en formato DD-MM-AAAA.",
            },
            urlResolucion: {
              type: "string",
              title: "URL del documento en formato digital",
              description:
                "Colocar el enlace o link de la resolución emitida por la autoridad a la que corresponde la sanción en su versión pública.",
            },
            fechaResolucionFirme: {
              type: "string",
              format: "date",
              title: "Fecha de la resolución firme",
              description:
                "Colocar la fecha en que quedó firme la resolución de la persona servidora pública en formato DD-MM-AAAA.",
            },
            fechaNotificacionFirme: {
              type: "string",
              format: "date",
              title: "Fecha de notificación de la resolución firme",
              description:
                "Indicar la fecha en que se notifica la resolución firme a la persona moral, en formato DD-MM-AAAA.",
            },
            urlResolucionFirme: {
              type: "string",
              title: "URL del documento en formato digital",
              description:
                "Colocar el enlace o link de la resolución firme emitida por la autoridad correspondiente en su versión pública.",
            },
          },
        },
        tipoSancion: {
          type: "object",
          title: "7. TIPO DE SANCIÓN APLICADA A LA PERSONA MORAL",
          description:
            "En esta sección se indicará la sanción y/o sanciones impuestas a la persona moral.",
          required: ["ordenJurisdiccional", "autoridadSancionadora", "sancion"],
          properties: {
            ordenJurisdiccional: {
              title: "Orden jurisdiccional de la sanción.",
              description: "Seleccionar: Federal o Estatal.",
              enum: ["FEDERAL", "ESTATAL"],
              enumNames: ["Federal", "Estatal"],
            },
            autoridadSancionadora: {
              type: "string",
              title: "Autoridad jurisdiccional ",
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
                title: "Tipo de sanción",
                required: ["clave"],
                properties: {
                  clave: {
                    title: "Tipo de sanción",
                    description:
                      "Elegir una o varias sanciones que fueron dictaminadas en la resolución, conforme a la o las elecciones del catálogo, es como deberá llenarse el resto del formato. Se podrán elegir de las siguientes opciones:",
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
                            required: ["plazo", "fechaInicial", "fechaFinal"],
                            properties: {
                              plazo: {
                                type: "object",
                                title: "Plazo de la inhabilitación",
                                description:
                                  "Colocar el plazo de pago de la inhabilitación de la persona moral, empezando por año (s), mes (es) y día (s).",
                                required: ["año", "mes", "dia"],
                                properties: {
                                  año: { title: "Año (s)", type: "string" },
                                  mes: { title: "Mes (es)", type: "string" },
                                  dia: { title: "Día (s)", type: "string" },
                                },
                              },
                              fechaInicial: {
                                type: "string",
                                format: "date",
                                title: "Fecha inicial de la inhabilitación",
                                description:
                                  "Indicar la fecha en la que inició la inhabilitación de la persona moral en formato DD-MM-AAAA.",
                              },
                              fechaFinal: {
                                type: "string",
                                format: "date",
                                title: "Fecha final de la inhabilitación",
                                description:
                                  "Indicar la fecha en la que se concluyó la inhabilitación en formato DD-MM-AAAA.",
                              },
                            },
                          },
                        },
                        required: ["inhabilitacion"],
                      },
                      {
                        properties: {
                          clave: {
                            enum: ["INDEMNIZACION"],
                          },
                          indemnizacion: {
                            type: "object",
                            title: "INDEMNIZACIÓN",
                            description:
                              "Este campo se deberá llenar si en la resolución se sancionó con una indemnización.",
                            required: ["monto", "moneda", "plazo", "cobrado"],
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
                                  "Seleccionar el tipo de moneda en formato de tres letras, establecidos en el ISO 4217.",
                                enum: ["MXN", "UMA"],
                              },
                              plazo: {
                                type: "object",
                                title: "Plazo de la sanción",
                                description:
                                  "Señalar el plazo para dar cumplimiento a la indemnización empezando por año (s), mes (es) y día (s).",
                                required: ["año", "mes", "dia"],
                                properties: {
                                  año: { title: "Año (s)", type: "string" },
                                  mes: { title: "Mes (es)", type: "string" },
                                  dia: { title: "Día (s)", type: "string" },
                                },
                              },
                              cobrado: {
                                type: "object",
                                title: "Indemnización efectivamente cobrada",
                                description:
                                  "Indicar el monto efectivamente cobrado: monto y moneda.",
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
                                    title: "Fecha de cobro de la indemnización",
                                    description:
                                      "Especificar la fecha en que se realizó el cobro en formato DD-MM-AAAA.",
                                  },
                                  fechaPagoSancion: {
                                    type: "string",
                                    format: "date",
                                    title:
                                      "Fecha en que se realizó el pago total de la indemnización",
                                    description:
                                      "En caso de el pago de la indemnización no se realice en una sola exhibición, especificar la fecha en que la persona moral cubrió el pago total de la sanción económica en formato DD-MM-AAAA.",
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
                            description:
                              "Llenar este apartado en caso de que la persona moral sea acreedora a una sanción económica.",
                            required: ["monto", "moneda", "plazo", "cobrado"],
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
                              plazo: {
                                type: "object",
                                title: "Plazo de la sanción",
                                description:
                                  "Colocar el plazo de pago de la sanción económica de la persona moral, empezando por año (s), mes (es) y día (s).",
                                required: ["año", "mes", "dia"],
                                properties: {
                                  año: { title: "Año (s)", type: "string" },
                                  mes: { title: "Mes (es)", type: "string" },
                                  dia: { title: "Día (s)", type: "string" },
                                },
                              },
                              cobrado: {
                                type: "object",
                                title:
                                  "Sanción Económica efectivamente cobrada",
                                description:
                                  "Indicar el monto efectivamente cobrado: monto y moneda.",
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
                                      "Indicar el monto efectivamente cobrado.",
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
                                      "Fecha en la que se realizo el pago total de la sanción",
                                    description:
                                      "En caso de que el pago de la sanción económica no se realice en una sola exhibición, especificar la fecha en que la persona moral cubrió el pago total de la sanción económica en formato DD-MM-AAAA.",
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
                            enum: ["SUSPENSION_DE_ACTIVIDADES"],
                          },
                          suspensionActividades: {
                            type: "object",
                            title: "SUSPENSIÓN DE ACTIVIDADES",
                            description:
                              "Este campo se deberá llenar si en la resolución se sancionó con la suspensión de actividades.",
                            required: ["fechaInicial", "fechaFinal"],
                            properties: {
                              fechaInicial: {
                                title: "Fecha inicial",
                                type: "string",
                                format: "date",
                                description:
                                  "Registrar la fecha en la que inició la suspensión de actividades en formato DD-MM-AAAA.",
                              },
                              fechaFinal: {
                                title: "Fecha final",
                                type: "string",
                                format: "date",
                                description:
                                  "Indicar la fecha en la que se concluyó la suspensión de actividades en formato DD-MM-AAAA.",
                              },
                            },
                          },
                        },
                        required: ["suspensionActividades"],
                      },
                      {
                        properties: {
                          clave: {
                            enum: ["DISOLUCION_DE_LA_SOCIEDAD"],
                          },
                          disolucionSociedad: {
                            type: "object",
                            title: "DISOLUCIÓN DE LA SOCIEDAD",
                            description:
                              "Este campo se deberá llenar si en la resolución se sancionó con la disolución de la sociedad.",
                            required: ["fechaDisolucion"],
                            properties: {
                              fechaDisolucion: {
                                title: "Fecha de la disolución",
                                type: "string",
                                format: "date",
                                description:
                                  "Especificar la fecha a partir de la cual se disuelve la sociedad de la persona moral en forma DD-MM-AAAA.",
                              },
                            },
                          },
                        },
                        required: ["disolucionSociedad"],
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
                                title: "Denominación de la sanción",
                                type: "string",
                                description:
                                  "Indicar la denominación de la sanción",
                              },
                            },
                          },
                        },
                        required: ["valor", "otro"],
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
            "En este espacio se podrán realizar las observaciones que se consideren pertinentes. aclaraciones u En virtud de que las aclaraciones pueden contener información reservada y/o confidencial, esta información no será de carácter pública.",
        },
      },
    },
  },
};

export default schema;
