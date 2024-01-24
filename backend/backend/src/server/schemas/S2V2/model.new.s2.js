const { Schema, model } = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const nuevoS2Schema = new Schema({
  id: { type: String },
  fechaCaptura: { type: Date },
  fechaActualizacion: { type: Date },
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
  responsabilidad: {type: Schema.Types.Mixed},
  entePublico: 
  {
    type: Schema.Types.Mixed
 /*    entidadFederativa: { type: String },
    ambitoGobierno: { clave: { type: String }, valor: { type: String } },
    poderOrganoGobierno: { type: String, },
    nombre: { type: String },
    siglas: { type: String }, */
  },
  empleoCargoComision: 
  {
    areaAdscripcion: { type: String },
    nivel: { type: String },
    nombre: { type: String },
  },
  procedimientos: 
  {
    tipoArea: {
      type: Schema.Types.Object,
      properties: {
        tipo: { type: String },
        areas: { type: [String] }
      }
    },
    nivelesResponsabilidad: {
      type: Schema.Types.Object,
      properties: {
        idObj: { type: String },
        acciones: { type: [String] }
      }
    },
    tipo: { type: String }
  },
  observaciones: { type: String }
  
});

nuevoS2Schema.plugin(mongoosePaginate);
module.exports = { nuevoS2Schema };