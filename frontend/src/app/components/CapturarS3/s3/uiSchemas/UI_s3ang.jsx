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
  absNoGrave: {
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
          "Ejemplo: Instituto Nacional de Transparencia, Acceso a la Informacion y Proteccion de Datos Personales",
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
      nivel: {
        "ui:placeholder": "Ejemplo: Departamento de desarrollo de sistemas",
      },
      areaAdscripcion: {
        "ui:placeholder":
          "Ejemplo: Dirección general de tecnologías de la información",
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
            "ui:placeholder": "Ejemplo: Artículo 10, ...",
          },
        },
        fraccionNormatividad: {
          items: {
            "ui:placeholder": "Ejemplo: Fracción 20, ...",
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
      url: {
        "ui:placeholder": "https://www.ejemplo.com/resolucion.pdf",
      },
    },
    tipoSancion: {
      "ui:options": { label: false },
      autoridadResolutora: {
        "ui:placeholder": "Ejemplo: Secretaría de la Función Pública",
      },
      autoridadInvestigadora: {
        "ui:placeholder": "Ejemplo: Secretaría de la Función Pública",
      },
      autoridadSubstanciadora: {
        "ui:placeholder": "Ejemplo: Secretaría de la Función Pública",
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
