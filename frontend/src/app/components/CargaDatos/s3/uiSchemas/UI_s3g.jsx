let data = {
  definitions: {
    constancias: {
      titulo: { "ui:placeholder": "Ejemplo: Constancia de Sanción" },
      url: { "ui:placeholder": "https://www.ejemplo.com/constancia.pdf" },
    },
  },
  expediente: {
    "ui:placeholder": "Ejemplo: 123456789",
  },
  grave: {
    nombres: {
      "ui:placeholder": "Ejemplo: Juan",
    },
    primerApellido: {
      "ui:placeholder": "Ejemplo: Rodríguez",
    },
    segundoApellido: {
      "ui:placeholder": "Ejemplo: Gómez",
      "ui:widget": "textarea",
      "ui:order": ["valor", "sinSegundoApellido",],
      "ui:options": {
        title: false,
      },
      valor: {
        "ui:placeholder": "Ejemplo: Gomez",
      },
    },
    sexo: {
      "ui:widget": "RadioWidget",
      "ui:options": {
        inline: true,
      },
    },
    curp: {
      "ui:placeholder": "Ejemplo: PERG850101HDF",
      "ui:enableMarkdownInDescription": true,
      "ui:description":
        "Escribir los dieciocho caracteres alfanuméricos como la emitió la Secretaría de Gobernación.  En caso de no contar con ella, podrá consultarla en la siguiente página: <a target='_blank' href='https://www.gob.mx/curp/'>Consulta tu CURP</a>.",
    },
    rfc: {
      "ui:placeholder": "Ejemplo: XAXX010101000",
      "ui:enableMarkdownInDescription": true,
      "ui:description":
        "Escribir los primeros diez caracteres básicos y los tres correspondientes a la homoclave. En caso de no contar con este dato, podrá consultarlo en la página del <a target='_blank' href='https://www.sat.gob.mx/aplicacion/operacion/31274/consulta-tu-clave-de-rfc-mediante-curp'>Servicio de Administración Tributaria</a>.",
    },
    entePublico: {
      nombre: {
        "ui:placeholder":
          "Ejemplo: Instituto nacional de transparencia, acceso a la información y protección de datos personales",
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
    empleoCargoComision: {
      "ui:options": { label: false },
      nombre: {
        "ui:options": { label: false },
        clave: {},
        valor: { "ui:placeholder": "..." },
      },
      denominacion: {
        "ui:placeholder":
          "Ejemplo: Subdirección general de tecnologias de la información",
      },
      areaAdscripcion: {
        "ui:placeholder":
          "Ejemplo: Dirección general de tecnologias de la información",
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
          "normatividadInfringida",
          "articuloNormatividadInfringida",
          "fraccionNormatividadInfringida",
          "descripcionHechos",
        ],
        valor: {
          "ui:placeholder": "...",
        },
        normatividadInfringida: {
          "ui:placeholder":
            "Ejemplo: Ley General de Responsabilidades Administrativas o Ley General de Responsabilidades Administrativas del estado de Guanajuato",
        },
        articuloNormatividadInfringida: {
          items: {
            "ui:placeholder": "Ejemplo: Artículo 10, Artículo 20, ...",
          },
        },
        fraccionNormatividadInfringida: {
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
      //campo nuevo
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
            "ui:options": { label: false },
            "ui:widget": "RadioWidget",
          },
          suspensionEmpleo: {
            plazo: {
              meses: { "ui:placeholder": "Ejemplo: 10 meses" },
              dias: { "ui:placeholder": "Ejemplo: 24 días" },
            },
          },
          destituciónEmpleoCargoComision: {
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
              dias: { "ui:placeholder": "Ejemplo: 24 días" },
            },
            cobrado: {
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
          inhabilitacion: {
            plazo: {
              años: { "ui:placeholder": "Ejemplo: 2 años" },
              meses: { "ui:placeholder": "Ejemplo: 10 meses" },
              dias: { "ui:placeholder": "Ejemplo: 24 días" },
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
