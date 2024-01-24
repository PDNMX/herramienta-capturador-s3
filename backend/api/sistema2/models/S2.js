/*const { Schema, model } = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");


// Definir un esquema de Mongoose para el modelo de producto
/* const S2Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
}); */
const mongoose = require("mongoose");

const S2Schema = new mongoose.Schema({
  id: { type: String },
  fechaCaptura: { type: Date },
  fechaActualizacion: { type: Date },
  ejercicio: { type: String },
  nombres: { type: String },
  primerApellido: { type: String },
  segundoApellido: { 
    valor: { type: String },
    sinSegundoApellido: { type: Boolean },
   },
  curp: { type: String },
  rfc: { type: String },
  sexo: { type: String, enum: ["FEMENINO", "MASCULINO"] },
  responsabilidad: {type: mongoose.Schema.Types.Mixed},
  entePublico: 
  {
    type: mongoose.Schema.Types.Mixed
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
      type: mongoose.Schema.Types.Object,
      properties: {
        tipo: { type: String },
        areas: { type: [String] }
      }
    },
    nivelesResponsabilidad: {
      type: mongoose.Schema.Types.Object,
      properties: {
        idObj: { type: String },
        acciones: { type: [String] }
      }
    },
    tipo: { type: String }
  },
  observaciones: { type: String }
  
});

// Crear el modelo de producto utilizando el esquema
const S2 = mongoose.connection.useDb("S2").model("spic", S2Schema, "spic");

// Exportar las funciones del modelo de producto
module.exports = {
  createS2: (data) => {
    const s2 = new S2(data);
    return s2.save();
  },
/*   insertS2: (data) => {
    const s2 = new s2(data);
    return s2.create();
    
  }, */
};
