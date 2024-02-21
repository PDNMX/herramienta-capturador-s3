const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const providerSchema = new mongoose.Schema({
    //type: mongoose.Schema.Types.Mixed,
    dependencia: String,
    fechaAlta: String,
    fechaBaja: String,
    fechaActualizacion: String,
    estatus: Boolean,
    sistemas: { type: [], default: void 0 } 
  });

providerSchema.plugin(mongoosePaginate);

const providerConnection = mongoose.connection.useDb("administracionUsuarios");
const Provider = mongoose.connection.useDb("administracionUsuarios").model("proovedores", providerSchema, "proovedores");

//const S2 = mongoose.connection.useDb("S2").model("spic", S2Schema, "spic");
// Exportar las funciones del modelo de producto
module.exports = {
  providerConnection,
  Provider
}
/* module.exports = {
  insertProvider: (data) => {
    data['estatus'] = true;
    const provider = new Provider(data);
    return provider.save();
  },
  updateProvider: (id, data) => {
    console.log("hola desde la edicion del provider");
  }
}; */
