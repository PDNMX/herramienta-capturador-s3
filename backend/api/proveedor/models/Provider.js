const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    //type: mongoose.Schema.Types.Mixed,
    dependencia: String,
    fechaAlta: String,
    fechaBaja: String,
    fechaActualizacion: String,
    estatus: Boolean,
    sistemas: { type: [], default: void 0 } 
  });

const Provider = mongoose.connection.useDb("administracionUsuarios").model("proovedores", providerSchema, "proovedores");

//const S2 = mongoose.connection.useDb("S2").model("spic", S2Schema, "spic");
// Exportar las funciones del modelo de producto
module.exports = {
  insertProvider: (data) => {
    data['estatus'] = true;
    const provider = new Provider(data);
    return provider.save();
  },
  updateProvider: (id, data) => {
    console.log("hola desde la edicion del provider");
  }
};
