const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const catalogSchema = new Schema({
  clave: String,
  valor: String,
  siglas: String,
  nombre: String,
  doctype: String
});

catalogSchema.plugin(mongoosePaginate);

let Catalog = model('Catalogos', catalogSchema, 'catalogos');

module.exports = Catalog;
