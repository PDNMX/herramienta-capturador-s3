/* 
URL del swaggerhub
https://app.swaggerhub.com/apis/RBalan21/pdn-s3p-v2/1.0.0#/psancionados/post_psancionados
*/

const { Schema, model } = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const personaMoral = new Schema({
    razonSocial: { type: String, required: true },
    rfc: { type: String, required: true },
    telefono: { type: Number, requiered: true },
    objetoSocial: { type: String, required: true },
    domicilioMexico: {
        type: Schema.Types.Mixed,
        required: true,
    },
    directorApoderado: {
        type: Schema.Types.Mixed,
        required: true,
    },
    entePublico: {
        type: Schema.Types.Mixed,
        required: true,
    },
    origenInvestigacion:{
        type: Schema.Types.Mixed,
        required: true,
    },
    faltaCometida:{
        type: Schema.Types.Mixed,
        required: true,
    },
    resolucion:{
        type: Schema.Types.Mixed,
        required: true,
    },
    autoridadSancionadora:{
        type: String,
        required: true,
    },
    ordenJurisdiccionalSancion:{
        type: Schema.Types.Mixed,
        required: true,
    },
    tipoSancion:{
        type: Schema.Types.Mixed,
        required: true,
    },
    observaciones:{
        type: String,
        required: true,
    },
});

const personaFisica = new Schema({
    expediente: { type: String, requiered: true},
    nombres: { type: String, required: true },
    primerApellido: { type: String, required: true },
    segundoApellido: { 
        valor: { type: String },
        sinSegundoApellido: { type: Boolean, required:true },
       },
    curp: { type: String, required: true },
    rfc: { type: String, required: true },
    telefono: { type: Number, requiered: true },
    objetoSocial: { type: String, required: true },
    domicilioMexico: { 
        type: Schema.Types.Mixed,
        required: true,
    },
    domicilioExtranjero: {
        type: Schema.Types.Mixed,
        required: true,
    },
    entePublico: {
        type: Schema.Types.Mixed,
        required: true,
    },
    faltaCometida: {
        type: Schema.Types.Mixed,
        required: true,
    },
    origenInvestigacion: {
        type: Schema.Types.Mixed,
        required: true,
    },
    resolucion: {
        type: Schema.Types.Mixed,
        required: true,
    },
    autoridadSancionadora: { type: String, required: true },
    ordenJurisdiccionalSancion: { type: String, required: true },
    tipoSancion: {
        type: Schema.Types.Mixed,
        required: true,
    },
    observaciones: { type: String, required: true },
});

const s3sp= new Schema({
    id: { type: String },
    fechaCaptura: { type: Date },
    fechaActualizacion: { type: Date },
    tipoPersona: { type: Schema.Types.Mixed, required: true },
});

const p3SancionadosSchemaV2 = new Schema({
    id: { type: String },
    fechaCaptura: { type: Date },
    fechaActualizacion: { type: Date },
    expdiente: { type: String },
    personaFisica:{
        type: personaFisica,
    }
}); 

p3SancionadosSchemaV2.plugin(mongoosePaginate);
module.exports = { p3SancionadosSchemaV2 };
