let data = {
  expediente: {
    "ui:placeholder": "Ejemplo: 123456789",
  },
  hechosMorales: {
    rfc: {
      "ui:placeholder": "Ejemplo: XAXX010101000",
      "ui:enableMarkdownInDescription": true,
      "ui:description":
        "Escribir los primeros diez caracteres básicos y los tres correspondientes a la homoclave. En caso de no contar con este dato, podrá consultarlo en la página del <a target='_blank' href='https://www.sat.gob.mx/aplicacion/operacion/31274/consulta-tu-clave-de-rfc-mediante-curp'>Servicio de Administración Tributaria</a>.",
    },
    razonSocial: {
      "ui:placeholder": "Ejemplo: Empresa de Servicios de Consultoría",
    },
    telefono: {
      "ui:placeholder": "Ejemplo: 5500000000",
      "ui:enableMarkdownInDescription": true,
      "ui:description":
        "Proporcionar el número telefónico de la persona moral sancionada <a target='_blank' href='http://www.itu.int/dms_pub/itu-t/opb/sp/T-SP-E.164D-2009-PDF-S.pdf'> ITU </a>.",
    },
    objetoSocial: {
      "ui:placeholder":
        "Ejemplo: Adquisición y enajenación de bienes inmuebles de cualquier",
    },
    domicilio: {
      "ui:options": {
        title: false,
      },
      //false
      domicilioMexico: {
        vialidad: {
          "ui:options": { label: false },
          clave: {
            "ui:placeholder": "Ejemplo: Calle",
            "ui:enableMarkdownInDescription": true,
            "ui:description":
              "Colocar el nombre de la vialidad correspondiente con base al catálogo de vialidades del marco <a target='_blank' href='https://www.inegi.org.mx/temas/mg/#Documentacion'> Geoestadístico Nacional </a>.",
          },
          valor: { "ui:placeholder": "Ejemplo: Adolfo López Mateos" },
          numeroExterior: { "ui:placeholder": "Ejemplo: 21" },
          numeroInterior: { "ui:placeholder": "Ejemplo: 4A" },
          colonia: { "ui:placeholder": "Ejemplo: San Cristóbal Centro" },
        },
        localidad: { "ui:placeholder": "Ejemplo: Ecatepec de Morelos" },
        municipio: { "ui:placeholder": "Ejemplo: Ecatepec de Morelos" },
        codigoPostal: { "ui:placeholder": "Ejemplo: 55000" },
        entidadFederativa: {},
      },
      //true
      domicilioExtranjero: {
        ciudadLocalidad: { "ui:placeholder": "Ejemplo: San Jose" },
        estadoProvincia: { "ui:placeholder": "Ejemplo: California" },
        calle: { "ui:placeholder": "Ejemplo: Elizabeth St" },
        numeroExterior: { "ui:placeholder": "Ejemplo: 421" },
        numeroInterior: { "ui:placeholder": "Ejemplo: 202" },
        pais: { "ui:placeholder": "Ejemplo: Estados Unidos de América" },
      },
    },
    directorApoderado: {
      directorGeneral: {
        nombres: {
          "ui:placeholder": "Ejemplo: Juan",
        },
        primerApellido: {
          "ui:placeholder": "Ejemplo: Rodríguez",
        },
        segundoApellido: {
          "ui:placeholder": "Ejemplo: Gómez",
          "ui:widget": "textarea",
          "ui:order": ["valor", "sinSegundoApellido"],
          "ui:options": {
            title: false,
          },
          valor: {
            "ui:placeholder": "Ejemplo: Gomez",
          },
        },
        rfc: {
          "ui:placeholder": "Ejemplo: XAXX010101000",
          "ui:enableMarkdownInDescription": true,
          "ui:description":
            "Escribir los primeros diez caracteres básicos y los tres correspondientes a la homoclave. En caso de no contar con este dato, podrá consultarlo en la página del <a target='_blank' href='https://www.sat.gob.mx/aplicacion/operacion/31274/consulta-tu-clave-de-rfc-mediante-curp'>Servicio de Administración Tributaria</a>.",
        },
        curp: {
          "ui:placeholder": "Ejemplo: PERG850101HDF",
          "ui:enableMarkdownInDescription": true,
          "ui:description":
            "Escribir los dieciocho caracteres alfanuméricos como la emitió la Secretaría de Gobernación.  En caso de no contar con ella, podrá consultarla en la siguiente página: <a target='_blank' href='https://www.gob.mx/curp/'>Consulta tu CURP</a>.",
        },
      },
      representanteLegal: {
        nombres: {
          "ui:placeholder": "Ejemplo: Juan",
        },
        primerApellido: {
          "ui:placeholder": "Ejemplo: Rodríguez",
        },
        segundoApellido: {
          "ui:placeholder": "Ejemplo: Gómez",
          "ui:widget": "textarea",
          "ui:order": ["valor", "sinSegundoApellido"],
          "ui:options": {
            title: false,
          },
          valor: {
            "ui:placeholder": "Ejemplo: Gomez",
          },
        },
        rfc: {
          "ui:placeholder": "Ejemplo: XAXX010101000",
          "ui:enableMarkdownInDescription": true,
          "ui:description":
            "Escribir los primeros diez caracteres básicos y los tres correspondientes a la homoclave. En caso de no contar con este dato, podrá consultarlo en la página del <a target='_blank' href='https://www.sat.gob.mx/aplicacion/operacion/31274/consulta-tu-clave-de-rfc-mediante-curp'>Servicio de Administración Tributaria</a>.",
        },
        curp: {
          "ui:placeholder": "Ejemplo: PERG850101HDF",
          "ui:enableMarkdownInDescription": true,
          "ui:description":
            "Escribir los dieciocho caracteres alfanuméricos como la emitió la Secretaría de Gobernación.  En caso de no contar con ella, podrá consultarla en la siguiente página: <a target='_blank' href='https://www.gob.mx/curp/'>Consulta tu CURP</a>.",
        },
      },
    },
    entePublico: {
      nombre: {
        "ui:placeholder": "Ejemplo: Instituto Nacional de Transparencia, Acceso a la informacion y Proteccion de Datos Personales",
      },
      siglas: {
        "ui:placeholder": "Ejemplo: INAI",
      },
      nivelOrdenGobierno: {
        "ui:options": { label: false },
        clave: {
          "ui:widget": "RadioWidget",
          "ui:options": {
            inline: true,
          },
        },
        valor: {
          "ui:placeholder": "...",
        },
      },
      ambitoPublico: {
        "ui:widget": "RadioWidget",
        "ui:options": {
          inline: true,
        },
      },
    },
    empleoCargoComision: {
      "ui:options": { label: false },
      nombre: {
        "ui:options": { label: false },
        clave: {},
        valor: { "ui:placeholder": "..." },
      },
      nivel: { "ui:placeholder": "Ejemplo: KA4" },
      areaAdscripcion: {
        "ui:placeholder": "Ejemplo: Departamento de Recursos Humanos",
      },
    },
    origenInvestigacion: {
      clave: {
        "ui:widget": "RadioWidget",
        "ui:options": { inline: true },
      },
      valor: {
        "ui:placeholder": "...",
      },
    },
    faltaCometida: {
      items: {
        "ui:options": { label: false },
        nombreNormatividad: {
          "ui:placeholder":
            "Ejemplo: Código Penal Federal.",
        },
        articuloNormatividad: {
          items: {
            "ui:placeholder": "Ejemplo: Artículo 10, Artículo 20, ...",
          },
        },
        fraccionNormatividad: {
          items: {
            "ui:placeholder": "Ejemplo: Fracción 10, Fracción 20, ...",
          },
        },
        descripcionHechos: {
          "ui:placeholder": "Ejemplo: ...",
        },
      },
    },
    resolucion: {
      documentoResolucion: {
        "ui:placeholder": "Ejemplo: Sentencia Final",
      },
      urlResolucion: {
        "ui:placeholder": "https://www.ejemplo.com/resolucion.pdf",
      },
      urlResolucionFirme: {
        "ui:placeholder": "https://www.ejemplo.com/resolucion-firme.pdf",
      },
    },
    tipoSancion: {
      ordenJurisdiccional: {
        "ui:widget": "RadioWidget",
        "ui:options": { inline: true },
      },
      autoridadSancionadora: {
        "ui:placeholder": "Ejemplo: Secretaría de la Función Pública",
      },
      autoridadInvestigadora: {
        "ui:placeholder": "Ejemplo: Secretaría de la Función Pública",
      },
      autoridadSubstanciadora: {
        "ui:placeholder": "Ejemplo: Secretaría de la Función Pública",
      },
      sancion: {
        //"ui:options": { label: false },
        items: {
          "ui:options": { label: false },
          clave: {
            "ui:widget": "RadioWidget",
            "ui:options": { label: false, inline: true },
          },
          valor: {
            "ui:placeholder": "...",
          },
          descripcion: {
            "ui:placeholder": "Ejemplo: Sancion impuesta por ...",
          },
          inhabilitacion: {
            plazo: {
              año: { "ui:placeholder": "Ejemplo: 2 años" },
              mes: { "ui:placeholder": "Ejemplo: 10 meses" },
              dia: { "ui:placeholder": "Ejemplo: 24 dias" },
            },
          },
          indemnizacion: {
            moneda: {
              "ui:widget": "RadioWidget",
              "ui:options": { inline: true },
            },
            plazo: {
              año: { "ui:placeholder": "Ejemplo: 2 años" },
              mes: { "ui:placeholder": "Ejemplo: 10 meses" },
              dia: { "ui:placeholder": "Ejemplo: 24 dias" },
            },
            cobrado: {
              moneda: {
                "ui:widget": "RadioWidget",
                "ui:options": { inline: true },
              },
            },
          },
          sancionEconomica: {
            moneda: {
              "ui:widget": "RadioWidget",
              "ui:options": { inline: true },
            },
            plazo: {
              año: { "ui:placeholder": "Ejemplo: 2 años" },
              mes: { "ui:placeholder": "Ejemplo: 10 meses" },
              dia: { "ui:placeholder": "Ejemplo: 24 dias" },
            },
            cobrado: {
              moneda: {
                "ui:widget": "RadioWidget",
                "ui:options": { inline: true },
              },
            },
          },
          suspensionActividades: {
          },
          disolucionSociedad: {
          },
          otro: {
            nombre: { "ui:placeholder": "..." },
          },
        },
      },
    },
    observaciones: {
      "ui:widget": "textarea",
      "ui:options": { rows: 10 },
      "ui:placeholder": "...",
    },
  },
  "ui:submitButtonOptions": {
    submitText: "Guardar",
    norender: false,
    props: {
      disabled: false,
      color: "primary",
      size: "large",
    },
  },
};

export default data;
