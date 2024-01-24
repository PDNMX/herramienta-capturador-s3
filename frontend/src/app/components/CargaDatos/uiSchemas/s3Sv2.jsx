let data = {
  expediente: {
    "ui:placeholder": "Ejemplo: 123456789",
  },
  tipoDeFalta: {
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
  faltaNoGrave: {
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
    empleoCargoComision: {
      "ui:options": {
        title: false,
      },
      nombre: {
        "ui:options": {
          title: false,
        },
      },
      areaAdscripcion: {
        "ui:placeholder": "Ejemplo: Departamento de Recursos Humanos",
      },
      nivel: {
        "ui:placeholder": "Ejemplo: KA4",
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
    origenInvestigacion: {
      faltaCometida: {
        nombreNormatividadInfringida: {
          "ui:placeholder":
            "Ejemplo: Ley General de Responsabilidades Administrativas",
        },
      },
    },
    tipoSancion: {
      items: {
        clave: {
          "ui:widget": "RadioWidget",
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
  faltaGrave: {
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
    empleoCargoComision: {
      "ui:options": {
        title: false,
      },
      nombre: {
        "ui:options": {
          title: false,
        },
      },
      areaAdscripcion: {
        "ui:placeholder": "Ejemplo: Departamento de Recursos Humanos",
      },
      nivel: {
        "ui:placeholder": "Ejemplo: KA4",
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
