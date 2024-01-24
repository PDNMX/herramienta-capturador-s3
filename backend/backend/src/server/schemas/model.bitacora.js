const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose');

const bitacoraSchema = new Schema({
  tipoOperacion: String,
  fechaOperacion: String,
  usuario: mongoose.ObjectId,
  numeroRegistros: Number,
  sistema: { type: [], default: void 0 }
});

bitacoraSchema.plugin(mongoosePaginate);

let Bitacora = model('Bitacora', bitacoraSchema, 'bitacora');

module.exports = Bitacora;
