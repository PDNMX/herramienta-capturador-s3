let data = {
  id: {
    "ui:placeholder": "Ejemplo: 123456789",
  },
  ejercicio: {
    "ui:placeholder": "Ejemplo: 2018",
  },
  nombres: {
    "ui:placeholder": "Ejemplo: Juan",
  },
  primerApellido: {
    "ui:placeholder": "Ejemplo: Rodríguez",
  },

  empleoCargoComision: {
    "ui:options": {
      title: false,
    },
    areaAdscripcion: {
      "ui:placeholder": "Ejemplo: Departamento de Recursos Humanos",
    },
    nivel: {
      "ui:placeholder": "Ejemplo: KA4",
    },
    nombre: {
      "ui:placeholder": "Ejemplo: Dirección de Sistemas Informáticos",
    },
  },

  segundoApellido: {
    "ui:placeholder": "Ejemplo: Gómez",
    "ui:order": [
      "valor",
      "sinSegundoApellido",
    ],
    "ui:options": {
      title: false,
    },
    valor: {
      "ui:placeholder": "Ejemplo: Gomez",
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
  observaciones: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 10,
      label: "4. OBSERVACIONES",
    },
    "ui:placeholder": "..."
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

  entePublico: {
    nombre: {
      "ui:placeholder": "Ejemplo: Secretaría de Hacienda y Crédito Público",
    },
    siglas: {
      "ui:placeholder": "Ejemplo: SHCP",
    },
    ambitoGobierno: {
      "ui:options": { label: false },
      clave: {
        "ui:widget": "RadioWidget",
        "ui:options": {
          inline: true,
        },
      },
    },
    poderOrganoGobierno: {
      "ui:widget": "RadioWidget",
      "ui:options": {
        inline: true,
      },
    },
  },

  procedimientos: {
    tipo: {
      "ui:widget": "RadioWidget",
      /* "ui:options": {
        inline: true
      }, */
    },
    tipoArea: {
      tipo: {
        "ui:widget": "RadioWidget",
        "ui:options": {
          inline: true,
        },
      },
      areas: {
        "ui:widget": "checkboxes",
        "ui:options": {
          inline: true,
        },
      },
    },
    otorgamiento: {
      "ui:widget": "checkboxes",
      "ui:options": {
        inline: true,
      },
    },
    nivelesResponsabilidad: {
      idObj1: {
        "ui:widget": "checkboxes",
        "ui:options": {
          inline: true,
        },
      },
      idObj2: {
        "ui:widget": "checkboxes",
        "ui:options": {
          inline: true,
        },
      },
      idObj3: {
        "ui:widget": "checkboxes",
        "ui:options": {
          inline: true,
        },
      },
      idObj4: {
        "ui:widget": "checkboxes",
        "ui:options": {
          inline: true,
        },
      },
      idObj5: {
        "ui:widget": "checkboxes",
        "ui:options": {
          inline: true,
        },
      },
      idObj6: {
        "ui:widget": "checkboxes",
        "ui:options": {
          inline: true,
        },
      },
      idObj7: {
        "ui:widget": "checkboxes",
        "ui:options": {
          inline: true,
        },
      },
    }
  },
};

export default data;
