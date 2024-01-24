let data = {
  definitions: {
    domicilio: {
      domicilioExtranjero: {
        "ui:options": { label: false },
        vialidad: {
          clave: {
            "ui:placeholder": "Ejemplo: Calle",
          }
        },
      },
    },
  },
  expediente: {
    "ui:placeholder": "Ejemplo: 123456789",
  },
  tipoPersona: {
    "ui:widget": "RadioWidget",
    "ui:autofocus": true,
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
  personaFisica: {
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
    telefono: {
      "ui:placeholder": "Ejemplo: 5500000000",
      "ui:enableMarkdownInDescription": true,
      "ui:description":
        "Escribir el número de teléfono de la persona física estandarizado <a target='_blank' href='http://www.itu.int/dms_pub/itu-t/opb/sp/T-SP-E.164D-2009-PDF-S.pdf'> ITU </a>",
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
    tipoSancion: {
      items: {
        clave: {
          "ui:widget": "RadioWidget",
          "ui:options": {
            inline: true,
          },
        },
        amonestacionPublicaPrivada: {
          tipoAmonestacion: {
            "ui:widget": "RadioWidget",
            "ui:options": {
              inline: true,
            },
          },
        },
      },
    },
    observaciones: {
      "ui:widget": "textarea",
      "ui:options": {
        rows: 10,
        label: "4. OBSERVACIONES",
      },
      "ui:placeholder": "...",
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
  },
  personaMoral: {
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
    tipoSancion: {
      items: {
        clave: {
          "ui:widget": "RadioWidget",
          "ui:options": {
            inline: true,
          },
        },
      },
    },
    observaciones: {
      "ui:widget": "textarea",
      "ui:options": {
        rows: 10,
        label: "4. OBSERVACIONES",
      },
      "ui:placeholder": "...",
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
  },
};

export default data;
