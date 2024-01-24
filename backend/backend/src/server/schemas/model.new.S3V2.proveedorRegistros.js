const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose');
  /* Agregar como atributos para una tabla elproveedorId: type String,
  registroSistemaId: type string,
  sistema: String */
const proveedorRegistrosSchemaV2 = new Schema({
  proveedorId: { type: String, required: true },
  registroSistemaId: { type: String, required: true },
  sistema: { type: String, required: true },
  fechaCaptura: { type: String, required: true }
});
//// para que apunte a otras bd

module.exports = { proveedorRegistrosSchemaV2 };

/* proveedorRegistrosSchemaV2.plugin(mongoosePaginate);
let proveedorRegistrosV2 = model('proveedorRegistros', proveedorRegistrosSchemaV2, 'proveedorRegistros');

module.exports = proveedorRegistrosV2; */
