const yup = require('yup');

// Define el esquema de validación con yup para "faltaCometida"
const faltaCometidaSchema = yup.object().shape({
  clave: yup.string().oneOf([
    "CAUSAR_DAÑOS",
    "COHECHO",
    "PECULADO",
    "DESVIO_RECURSOS",
    "UTILIZACION_INF",
    "CONFLICTO_INTERES",
    "CONTRATACION_INDEBIDA",
    "ENRIQUECIMIENTO",
    "SIMULACION",
    "TRAFICO_INFLUENCIAS",
    "ENCUBRIMIENTO",
    "DESACATO",
    "NEPOTISMO",
    "OBSTRUCCION",
    "OTRO"
  ]).required(),
  valor: yup.string().required(),
  nombreNormatividadInfringida: yup.string().required(),
  articuloNormatividadInfringida: yup.array().of(yup.number()).required(),
  fraccionNormatividadInfringida: yup.array().of(yup.number()).required()
});

// Define el esquema de validación con yup para "faltaGrave"
const faltaGraveSchema = yup.object().shape({
  id: yup.string().required(),
  fechaCaptura: yup.string(),
  expediente: yup.string(),
  nombres: yup.string(),
  primerApellido: yup.string(),
  segundoApellido: yup.string(),
  curp: yup.string(),
  rfc: yup.string(),
  sexo: yup.string(),
  entePublico: yup.object(), // Puedes agregar validaciones específicas aquí si es necesario
  empleoCargoComision: yup.object(), // Puedes agregar validaciones específicas aquí si es necesario
  origenInvestigacion: yup.object(), // Puedes agregar validaciones específicas aquí si es necesario
  faltaCometida: yup.array().of(faltaCometidaSchema).required()
});

// Define el esquema de validación con yup para el objeto principal (con "tipoDeFalta" y "faltaGrave")
const sSancionadosSchemaYupV2 = yup.object().shape({
  tipoDeFalta: yup.string().required(),
  faltaGrave: faltaGraveSchema.required()
});


module.exports = sSancionadosSchemaYupV2;