/* 
  URL del swaggerhub
  https://app.swaggerhub.com/apis/ALANROJASPDN/pdn-s3s-v2/1.0.0#/
*/

const { Schema, model } = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const { type } = require('../../S2V2/model.joynew.s2');

/* 
    Graves
*/
const s3ServidoreschemaNoGraves = new Schema({
  // Propiedades comunes a todos los sancionados
  tipoDeFalta: { type: String, required: false,},
  expediente:{ type: String, required: false },
  faltaNoGrave: 
  {
    //id: { type: String, required: false },
    ////**** Datos para guardar un historico */
    fechaCaptura: { type: Date, required: false },
    fechaActualizacion: { type: Date, required: false },
    ///**** Datos para guardar un historico */

    nombres: { type: String, required: false },
    primerApellido: { type: String, required: false },
    segundoApellido: { 
      valor: { type: String },
      sinSegundoApellido: { type: Boolean, required:false },
     },
     curp: { type: String, required: false },
     rfc: { type: String, required: false },
     sexo: { type: String, enum: ["FEMENINO", "MASCULINO"], required: false },
      entePublico:{
        type: Schema.Types.Mixed, 
        required: false,
      },
      empleoCargoComision: {
        type: Schema.Types.Mixed,
        required: false,
      },
      origenInvestigacion:{
        type: Schema.Types.Mixed,
        required: false,
      },
      faltaCometida:[{  
        type: Schema.Types.Mixed,
        required: false,
      }],
      resolucion:{
        type: Schema.Types.Mixed,
        required: false,
      },
      tipoSancion:[{type: Schema.Types.Mixed, required: false}],
      autoridadSancionadora:{ type: String, required: false},
      observaciones: { type: String, required: false},
   },
 
});

/* 
  No graves
*/

const s3ServidoreschemaGraves = new Schema({
  tipoDeFalta: {
    type: String,
    required: false,
  },
  expediente:{ type: String, required: false },
  faltaGrave:{
    nombres: { type: String, required: false },
    primerApellido: { type: String, required: false },
    segundoApellido: { 
      valor: { type: String },
      sinSegundoApellido: { type: Boolean, required:false },
     },
     curp: { type: String, required: false },
     rfc: { type: String, required: false },
     sexo: { type: String, enum: ["FEMENINO", "MASCULINO"], required: false },
      entePublico:{
        type: Schema.Types.Mixed, 
        required: false,
      },
      empleoCargoComision: {
        type: Schema.Types.Mixed,
        required: false,
      },
      origenInvestigacion:{
        type: Schema.Types.Mixed,
        required: false,
      },
      faltaCometida:[{  
        type: Schema.Types.Mixed,
        required: false,
      }],
      resolucion:{
        type: Schema.Types.Mixed,
        required: false,
      },
      tipoSancion:[{type: Schema.Types.Mixed, required: false}],
      autoridadSancionadora:{ type: String, required: false},
      ordenJurisdiccionalSancion:{ type: Schema.Types.Mixed, required: false},
      observaciones: { type: String, required: false},
  }
});

s3ServidoreschemaGraves.plugin(mongoosePaginate);
//module.exports = { s3ServidoreschemaGraves };
s3ServidoreschemaNoGraves.plugin(mongoosePaginate);
module.exports = { s3ServidoreschemaGraves, s3ServidoreschemaNoGraves };
