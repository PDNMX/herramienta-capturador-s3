const { Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const nuevoS2Schema = new Schema({
  id: { type: String },
  fechaCaptura: { type: Date },
  ejercicio: { type: Number },
  nombres: { type: String },
  primerApellido: { type: String },
  segundoApellido: { 
    valor: { type: String },
    sinSegundoApellido: { type: Boolean },
   },
  curp: { type: String },
  rfc: { type: String },
  sexo: { type: String, enum: ["FEMENINO", "MASCULINO"] },
  entePublico: {
    entidadFederativa: {
      clave: { type: String },
      valor: { type: String },
    },
    ambitoGobierno: {
      clave: {
        type: String,
        enum: ["FEDERAL", "ESTATAL", "MUNICIPAL_ALCALDIA", "OTRO"],
      },
      valor: { type: String },
    },
    poderOrganoGobierno: {
      type: String,
      enum: ["EJECUTIVO", "LEGISLATIVO", "JUDICIAL", "ORGANO_AUTONOMO"],
    },
    nombre: { type: String },
    siglas: { type: String },
  },
  empleoCargoComision: {
    areaAdscripcion: { type: String },
    nivel: { type: String },
    nombre: { type: String },
  },
  procedimientos: {
    tipoArea: {
      tipo: { type: String },
      areas: { type: Array },
    },
    nivelesResponsabilidad: {
      type: Schema.Types.Mixed, // Usar un tipo Mixed para permitir objetos de objetos
      required: false,
    },
    tipo: {
      type: String,
      enum: [
        "CONTRATACION_PUBLICA",
        "CONCESIONES",
        "LICENCIAS",
        "PERMISOS",
        "AUTORIZACIONES",
        "ENAJENACION_BIEN_MUEBLE",
        "DICTAMEN_AVALUO",
      ],
    },
    tipo: {
      type: String,
      enum: [
        "CONTRATACION_PUBLICA",
        "CONCESIONES",
        "LICENCIAS",
        "PERMISOS",
        "AUTORIZACIONES",
        "ENAJENACION_BIEN_MUEBLE",
        "DICTAMEN_AVALUO",
      ],
    },
  },
  observaciones: { type: String },
});

nuevoS2Schema.plugin(mongoosePaginate);
module.exports = { nuevoS2Schema };
