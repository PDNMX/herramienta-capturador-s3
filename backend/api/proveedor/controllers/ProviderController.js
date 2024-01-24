const ProviderModel = require("../models/Provider");

module.exports = {
    createProvider: (req, res) => {
        const {body} = req;
        body['estatus'] = true;
        //console.log(req.body);
        
         ProviderModel.insertProvider(body)
        .then((provider) => {
            //console.log(req);
            return res.status(200).json({
              status: true,
              data: provider.toJSON(),
              message : "proveedor creado correctamente desde proyecto con nombre api"
            });
          })
          .catch((err) => {
            return res.status(500).json({
              status: false,
              error: err,
              message: "hubo un error"
            });
          }); 
      },
      editProvider: (req, res) => {
        /* const {body} = req;
        let id = req.body._id.toString();
        //let sistemasproveedor = req.body.sistemas;
        //let usuarios = await User.find({ proveedorDatos: id });
        let nuevoSistemas = []; */

        console.log("hola desde la edicion del provider");
        // Hacer el siguiente update para la tabla users en caso de que se cumpla la condicion 
        /* 
         if (req.body._id) {
          if (req.body.estatus == false) {
        */
        //User.updateMany({ proveedorDatos: req.body._id }, { estatus: false }).exec();

        // Validación de datos
        /* if (!body.name || !body.description) {
          return res.status(400).json({
            status: false,
            error: "Los campos nombre y descripción son obligatorios",
          });
        } */
      
        // Actualización del proveedor
        /* ProviderModel.updateProvider(id, body)
          .then((provider) => {
            //console.log(req);
            return res.status(200).json({
              status: true,
              data: provider.toJSON(),
              message: "Proveedor editado correctamente desde proyecto con nombre api",
            });
          })
          .catch((err) => {
            return res.status(500).json({
              status: false,
              error: err,
              message: "Hubo un error",
            });
          }); */
      },
      
}