/* const providerSchemaJSON = {
  type: "object",
  properties: {
    dependencia: { type: "string", pattern: "^[ñáéíóúáéíóúÁÉÍÓÚa-zA-Z ]*$"},
    fechaAlta: { type: "string", format: "date-time"},
    fechaActualizacion: { type: "string", format: "date-time"},
    estatus: { type: "boolean" },
    sistemas: { type: "array", items: { type: "string" } }
  },
  required: ["dependencia", "sistemas", "estatus"],
  additionalProperties: true,

}; */
// Definir el esquema de validación JSON
const providerSchemaJSON = {
  type: "object",
  properties: {
      dependencia: {
          type: "string",
          pattern: "^[ñaéíóúÁÉÍÓÚa-zA-Z ]*$",
      },
      fechaAlta: {
          type: "string", // Cambia a "string" para representar la fecha
      },
      fechaActualizacion: {
          type: "string", // Cambia a "string" si también es una fecha
      },
      estatus: { type: "boolean" },
      sistemas: {
          type: "array",
          items: { type: "object"
          /* properties:{
            label: { type: "string" },
            value: { type: "string" },
          } */
        },
      },
  },
  required: ["dependencia", "sistemas", "estatus"],
  additionalProperties: true,
};

module.exports = { providerSchemaJSON };
