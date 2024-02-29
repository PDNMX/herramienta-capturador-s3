const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose');

const proveedorRegistrosSchema = new Schema({
  proveedorId: mongoose.ObjectId,
  registroSistemaId: mongoose.ObjectId,
  sistema: Object,//cambiar a objeto
  fechaCaptura: Date,
  fechaActualizacion: Date,

  timestamps: {
    createdAt: Date,
    updatedAt: Date,
  },
});

proveedorRegistrosSchema.plugin(mongoosePaginate);

//const proveedorRegistros = model('proveedorRegistros', proveedorRegistrosSchema, 'proveedorRegistros');
const proveedorRegistros = mongoose.connection.useDb("administracionUsuarios").model("proveedorRegistros", proveedorRegistrosSchema, "proveedorRegistros");

module.exports = {proveedorRegistros};
