// SANCIONES (INHABILITACIONES) POR NORMAS DIVERSAS A LA LGRA - PERSONAS FISICAS (5)
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
  required: ["expediente", "otroFisica"],
  properties: {
    expediente: {
      type: "string",
      title: "Expediente",
      description: "Registrar el número de expediente del procedimiento.",
    },
    otroFisica: {
      title: "1. DATOS GENERALES DE LA PERSONA FÍSICA",
      description:
        "Indicar los datos generales de la persona física sancionados.",
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
        objetoSocial: {
          type: "string",
          title: "Objeto social de la actividad",
          //pendiente validar informacion de la descriocipcion de este campo
          description:
            "Describir la o las actividades principales que lleva a cabo la persona física.",
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
                      //Preguntar si este nombre es el correcto
                      title: "Domicilio en la república mexicana",
                      description:
                        "Indicar los siguientes datos: ciudad, provincia, calle, número exterior, número interior (si aplica), código postal, país.",
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
            nivelOdenGobierno: {
              type: "object",
              properties: {
                clave: {
                  title: "Nivel/Orden de Gobierno",
                  description:
                    "Seleccionar el nivel u orden de gobierno al que pertenece el ente público donde se cometió la falta administrativa: Federal, Estatal, Municipal/Alcaldía, otro (especificar).",
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
          title: "3. ORIGEN DEL PROCEDIMIENTO",
          description:
            "Señalar el motivo que dio origen a la investigación por la realización de actos vinculados con faltas administrativas graves por parte de la persona física. ",
          properties: {
            clave: {
              title: "Origen del procedimiento",
              description:
                "Seleccionar conforme al catálogo el origen de la falta administrativa:",
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
          title: "4. FALTA COMETIDA DE LA PERSONA FÍSICA",
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
                type: "string",
                title: "Falta cometida",
                description:
                  "Escribir el tipo de falta cometida por parte de la persona física.",
              },
              nombreNormatividadInfringida: {
                type: "string",
                title: "Normatividad infringida",
                description:
                  "Escribir el nombre de la ley o normatividad infringida por la persona física.",
              },
              articuloNormatividadInfringida: {
                type: "array",
                //preguntar por que cambia el nombre para ver si queda en plural o no
                title: "Artículo infringido",
                items: {
                  title: "Artículo",
                  type: "string",
                  description:
                    "Escribir el artículo(s) infringido de la normatividad infringida.",
                },
              },
              fraccionNormatividadInfringida: {
                type: "array",
                //preguntar por que cambia el nombre para ver si queda en plural o no
                title: "Fracción infringida",
                items: {
                  title: "Fracción",
                  type: "string",
                  description:
                    "Escribir la fracción(es) infringida de la normatividad infringida.",
                },
              },
              descripcionHechos: {
                title: "Descripción breve de los hechos",
                type: "string",
                description: "Señalar una descripción breve de los hechos. ",
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
                "Indicar la fecha de notificación de la resolución firme a la persona física sancionada, en formato dd-mm-aaaa.",
            },
            fechaNotificacionFirme: {
              type: "string",
              format: "date",
              title: "Fecha de notificación firme",
              description:
                "Indicar la fecha de notificación de la resolución firme a la persona física sancionada, en formato dd-mm-aaaa..",
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
            "En esta sección se indicará la sanción y/o sanciones impuestas a la persona física.",
          rrequired: [
            "ordenJurisdiccional",
            "autoridadSancionadora",
            "sancion",
          ],
          properties: {
            ordenJurisdiccional: {
              title: "Orden jurisdiccional de la sanción.",
              description: "Seleccionar: Federal o Estatal.",
              enum: ["FEDERAL", "ESTATAL"],
              enumNames: ["Federal", "Estatal"],
            },
            autoridadSancionadora: {
              type: "string",
              title: "Nombre de la autoridad sancionadora",
              description:
                "Indicar el nombre de la autoridad facultada para aplicar la sanción.",
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
                    enum: ["INHABILITACION", "OTRO"],
                    enumNames: ["Inhabilitación", "Otro"],
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
                          inhabilitado: {
                            type: "object",
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
          title: "7. OBSERVACIONES",
          type: "string",
          description:
            "En este espacio podrá realizar las aclaraciones u observaciones que considere pertinentes respecto de alguno o algunos de los apartados del documento.",
        },
      },
    },
  },
};

export default data;
