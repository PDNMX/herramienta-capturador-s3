let data = {
  expediente: {
    "ui:placeholder": "Ejemplo: 123456789",
  },
  graveFisica: {
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
        "ui:placeholder": "Ejemplo: Secretaría de Hacienda y Crédito Público",
      },
      siglas: {
        "ui:placeholder": "Ejemplo: SHCP",
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
      },
      valor: {
        "ui:placeholder": "...",
      },
    },
    faltaCometida: {
      items: {
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
            "Ejemplo: Ley General de Responsabilidades Administrativas",
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
        "ui:placeholder": "https://www.ejemplo.com/resolucion.pdf",
      },
    },
    tipoSancion: {
      ordenJurisdiccional: {
        "ui:widget": "RadioWidget",
        "ui:options": { inline: true },
      },
      autoridadResolutora: {
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
              años: { "ui:placeholder": "Ejemplo: 2 años" },
              meses: { "ui:placeholder": "Ejemplo: 10 meses" },
              dias: { "ui:placeholder": "Ejemplo: 24 días" },
            },
            constancia: {
              titulo: { "ui:placeholder": "Ejemplo: Constancia de Sanción" },
              url: {
                "ui:placeholder": "https://www.ejemplo.com/constancia.pdf",
              },
            },
          },
          indemnizacion: {
            indemnizacionImpuesta: {
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
            cobrada: {
              moneda: {
                "ui:widget": "RadioWidget",
                "ui:options": { inline: true },
              },
            },
            constancia: {
              titulo: { "ui:placeholder": "Ejemplo: Constancia de Sanción" },
              url: {
                "ui:placeholder": "https://www.ejemplo.com/constancia.pdf",
              },
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
              dias: { "ui:placeholder": "Ejemplo: 24 dias" },
            },
            cobrada: {
              moneda: {
                "ui:widget": "RadioWidget",
                "ui:options": { inline: true },
              },
            },
            constancia: {
              titulo: { "ui:placeholder": "Ejemplo: Constancia de Sanción" },
              url: {
                "ui:placeholder": "https://www.ejemplo.com/constancia.pdf",
              },
            },
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
