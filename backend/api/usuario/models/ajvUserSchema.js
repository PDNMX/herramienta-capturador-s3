const userSchemaJSON = {
    type: "object",
    properties: {
      nombre: { type: "string" },
      apellidoUno: { type: "string" },
      apellidoDos: { type: "string" },
      cargo: { type: "string" },
      correoElectronico: {type: "string"}, 
      telefono: { type: "string" },
      extension: { type: "string" },
      usuario: { type: "string" },
      sistemas: { type: "array" },
      estatus: { type: "boolean" },
      vigenciaContrasena: { type: "string" },
    },
    required: [
      "nombre",
      "apellidoUno",
      "cargo",
      "correoElectronico",
      "telefono",
      "usuario",
      "sistemas",
    ],
    additionalProperties: 
    true,
  };
  
  module.exports = { userSchemaJSON };
  