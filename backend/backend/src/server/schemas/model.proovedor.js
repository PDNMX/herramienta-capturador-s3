const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const providerSchema = new Schema({
  dependencia: String,
  fechaAlta: String,
  fechaBaja: String,
  fechaActualizacion: String,
  estatus: Boolean,
  sistemas: { type: [], default: void 0 }
});

providerSchema.plugin(mongoosePaginate);

let Proovedor = model('Proovedores', providerSchema, 'proovedores');

module.exports = Proovedor;
