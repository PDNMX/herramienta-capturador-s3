let data = {
  expediente: {
    "ui:placeholder": "Ejemplo: 123456789",
  },
  hechosFisica: {
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
    telefono: {
      "ui:placeholder": "Ejemplo: 5500000000",
      "ui:enableMarkdownInDescription": true,
      "ui:description":
        "Escribir el número de teléfono de la persona física estandarizado <a target='_blank' href='http://www.itu.int/dms_pub/itu-t/opb/sp/T-SP-E.164D-2009-PDF-S.pdf'> ITU </a>.",
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
    entePublico: {
      nombre: {
        "ui:placeholder": "Ejemplo: Instituto Nacional de Transparencia, Acceso a la Informacion y Proteccion de Datos Personales",
      },
      siglas: {
        "ui:placeholder": "Ejemplo: INAI",
      },
      nivelOdenGobierno: {
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
        "ui:order": [
          "clave",
          "valor",
          "nombreNormatividad",
          "articuloNormatividad",
          "fraccionNormatividad",
          "descripcionHechos",
        ],
        valor: {
          "ui:placeholder": "...",
        },
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
      urlNotificacion: {
        "ui:placeholder": "https://www.ejemplo.com/resolucion.pdf",
      },
      urlResolucion: {
        "ui:placeholder": "https://www.ejemplo.com/resolucion.pdf",
      },
    },
    tipoSancion: {
      ordenJurisdiccional: {
        "ui:widget": "RadioWidget",
        "ui:options": { inline: true },
      },
      autoridadJurisdiccional: {
        "ui:placeholder": "Ejemplo: Secretaría de la Función Pública",
      },
      autoridadInvestigadora: {
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
              años: { "ui:placeholder": "Ejemplo: 2 años" },
              meses: { "ui:placeholder": "Ejemplo: 10 meses" },
              dias: { "ui:placeholder": "Ejemplo: 24 días" },
            },
          },
          prision: {
            plazo: {
              años: { "ui:placeholder": "Ejemplo: 2 años" },
              meses: { "ui:placeholder": "Ejemplo: 10 meses" },
              dias: { "ui:placeholder": "Ejemplo: 24 días" },
            },
          },
          sancionEconomica: {
            sancionImpuesta: {
              moneda: {
                "ui:widget": "RadioWidget",
                "ui:options": { inline: true },
              },
            },
            plazo: {
              años: { "ui:placeholder": "Ejemplo: 2 años" },
              meses: { "ui:placeholder": "Ejemplo: 10 meses" },
              dias: { "ui:placeholder": "Ejemplo: 24 días" },
            },
            cobrado: {
              moneda: {
                "ui:widget": "RadioWidget",
                "ui:options": { inline: true },
              },
            },
          },
          otro: {
            nombre: { "ui:placeholder": "..." },
            descripcion: {
              "ui:placeholder": "Ejemplo: Sancion impuesta por ...",
            },
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
