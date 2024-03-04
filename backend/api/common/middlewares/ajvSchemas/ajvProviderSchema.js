//const Ajv = require("ajv");
//const addFormats = require("ajv-formats");
/* require("ajv-errors");
require("ajv-formats"); */

// Definir el esquema de validación JSON
const providerSchemaJSON = {
  type: "object",
  properties: {
    dependencia: { type: "string", pattern: "^[ñáéíóúáéíóúÁÉÍÓÚa-zA-Z ]*$"},
    fechaAlta: { type: "string", format: "date-time"},
    fechaActualizacion: { type: "string", format: "date-time"},
    estatus: { type: "boolean" },
    sistemas: { type: "array", items: { type: "string" } }
  },
  required: ["dependencia", "sistemas", "estatus"],
  additionalProperties: false,

};
/* const providerSchemaJSON = {
  type: "object",
  properties: {
    dependencia: {
      type: "string",
      required: true,
      errorMessage: {
        required: "El nombre de la dependencia es requerido",
      },
      pattern: "^[ñáéíóúáéíóúÁÉÍÓÚa-zA-Z ]*$",
      errorMessage: {
        pattern: "Inserta solamente caracteres",
      },
    },
    sistemas: {
      type: "array",
      minItems: 1,
      required: true,
      errorMessage: {
        required: "El campo sistemas es requerido",
        minItems: "Se requiere al menos un sistema",
      },
    },
    estatus: {
      type: "boolean",
      required: true,
      errorMessage: {
        required: "El campo estatus es requerido",
      },
    },
    fechaAlta: {
      type: "string",
      // No se definió una validación específica para fechaAlta en Yup
    },
    fechaBaja: {
      type: "string",
      // No se definió una validación específica para fechaBaja en Yup},
      fechaActualizacion: {
        type: "string",
      },
    },
  },
};
 */
module.exports = { providerSchemaJSON };
