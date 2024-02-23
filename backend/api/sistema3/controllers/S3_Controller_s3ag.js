const { S3ag } = require("../models/S3ag");
const _ = require("lodash");
const moment = require("moment-timezone");
const { User } = require("../../usuario/models/User");
const {
  proveedorRegistros,
} = require("../../proveedor/models/proveedorRegistros");
const { Type } = require("ajv/dist/compile/util");

module.exports = {
  create_s3ag: async (req, res) => {
    try {
      //// Se obtiene el usuario que hace la petición
      let usuario = req.body.usuario;
      //// Se elimina el usuario del body
      delete req.body.usuario;
      let newdocument = req.body;
      let fecha = moment().tz("America/Mexico_City").format();
      newdocument["fechaCaptura"] = fecha;
      newdocument["fechaActualizacion"] = fecha;
      let s3ag = new S3ag(newdocument);
      let result = await s3ag.save();
       //// se declara el objeto de respuesta
       let objResponse = {};
       objResponse['results'] = result;
       //// A su vez insertamos el proovedor de datos asociado con el usuario
       let datausuario = await User.findById(usuario)
       //console.log('datausuario:', datausuario);
      //let proveedor = await proveedorRegistros.findOne({usuario: datausuario._id});
      console.log('datausuario.proveedorDatos:', datausuario.proveedorDatos);
      console.log('result._id:', result._id);
       const proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: result._id, sistema: 'S3S', fechaCaptura:fecha, fechaActualizacion:fecha});      
       let resp = await proveedorRegistros1.save();

       res.status(200).json({ message: 'Se realizarón las inserciones correctamente en s3ag', objResponse });

       /* res
        .status(200)
        .json({ message: "Sistema 3 creado correctamente.", doc: newdocument }); */
    } catch (error) {
      //console.error('Error al crear usuario:', error);
      return res
        .status(500)
        .json({ message: "Error: ", error: error.message });
    }
  },
};
