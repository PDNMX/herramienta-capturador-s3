const { string } = require('joi');
const { Schema, model } = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");


const s3SancionadosSchemaV2Grave = new Schema({
  tipoDeFalta: {
    type: String,
    required: false
  },
  faltaGrave: {
    id: {
      type: String,
      required: true
    },
    fechaCaptura: {
      type: Date,
      required: true
    },
    fechaActualizacion: {
      type: Date,
      required: false
    },
    expediente: {
      type: String,
      required: true
    },
    nombres: {
      type: String,
      required: true
    },
    primerApellido: {
      type: String,
      required: true
    },
    segundoApellido:{
      valor: {
        type: String
      },
      sinSegundoApellido: {
        type: Boolean,
        required: true
      }
    },
    curp: {
      type: String,
      required: true
      },
    rfc: {
      type: String,
      required: true
      },
    sexo: {
      type: String,
      enum: ['MASCULINO', 'FEMENINO'],
      required: true
    }
  }
  });

s3SancionadosSchemaV2Grave.plugin(mongoosePaginate);
module.exports = { s3SancionadosSchemaV2Grave };