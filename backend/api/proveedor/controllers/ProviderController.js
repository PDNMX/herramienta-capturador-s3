const {Provider} = require("../models/Provider");
const {User} = require("../../usuario/models/User")
const _ = require('lodash');

module.exports = {
    createProvider: async (req, res) => {
      try{
        req.body['estatus'] = true; 
        let nombreDependencia = req.body.dependencia;
        // validar que no existe la dependencia que se va a insertar de lo contrario mandar un estatus 500
        let validarDependencia
        validarDependencia = await Provider.findOne({dependencia:nombreDependencia});
        if (validarDependencia)
          {
            //console.log("Ya existe una dependencia con ese nombre");
            //console.log(validarDependencia);
            return res.status(500).json({message:"Ya existe una dependencia con ese nombre", error:error.message});
          }
        else{
          const nuevoProovedor = new Provider(req.body);
          let responce;
          responce = nuevoProovedor.save();

          res.status(200).json({ message: 'Usuario creado correctamente.', data:responce });
        }
      }  
      catch (error) {
        //console.error('Error al crear usuario:', error);
        return res.status(500).json({ message: 'Error al crear usuario.', error: error.message });
    }
  },
  editProvider: async (req, res) => {
    try{
      const nuevoProovedor = new Provider(req.body);
      let responce;
      //console.log(req.body);
      if (req.body._id) {
        if (req.body.estatus === false) {
          /// desactivar todos los usuarios que tengan el id del proveedor
          await User.updateMany({ proveedorDatos: req.body._id }, { estatus: false }).exec();
          //console.log("Se desactivo el proveedor");
        }
          /// encontrar todos los usuarios que tengan el id del proveedor
          let id = req.body._id.toString();
          let sistemasproveedor = req.body.sistemas;
          let usuarios = await User.find({ proveedorDatos: id });
          let nuevoSistemas = [];
          //console.log("usuarios encontrados");
          //console.log(usuarios);
          
          usuarios.map(async row => {
            if (sistemasproveedor.length < row.sistemas.length) {
              nuevoSistemas = [];
              row.sistemas.map(sistemasusuario => {
                sistemasproveedor.map(sistema => {
                  if (sistema == sistemasusuario) {
                    nuevoSistemas.push(sistema);
                  }
                });
              });
              await User.updateOne({ _id: row._id }, { sistemas: nuevoSistemas });
            } else if ((sistemasproveedor.length == 2 || sistemasproveedor.length == 1) && (row.sistemas.length == 1 || row.sistemas.length == 2)) {
              nuevoSistemas = [];
              row.sistemas.map(sistemasusuario => {
                sistemasproveedor.map(sistema => {
                  if (sistema == sistemasusuario) {
                    nuevoSistemas.push(sistema);
                  }
                });
              });
              await User.updateOne({ _id: row._id }, { sistemas: nuevoSistemas });
            }
          }); 
          responce = await Provider.findByIdAndUpdate(req.body._id, nuevoProovedor).exec();
          res.status(200).json(responce);
      }

      //res.status(200).json({ message: 'Usuario editado correctamente.' });
    }catch (error) {
      console.error('Error al editar usuario:', error);
      return res.status(500).json({ message: 'Error al editar usuario.', error: error.message });
    }
  },
  getProviders: async (req, res) => {
      try {

        let sortObj = req.body.sort === undefined ? {} : req.body.sort;
        let page = req.body.page === undefined ? 1 : req.body.page; //numero de pagina a mostrar
        let pageSize = req.body.pageSize === undefined ? 10 : req.body.pageSize;
        let query = req.body.query === undefined ? {} : req.body.query;
        console.log({ page: page, limit: pageSize, sort: sortObj });
        const paginationResult = await Provider.paginate(query, { page: page, limit: pageSize, sort: sortObj }).then();
        let objpagination = { hasNextPage: paginationResult.hasNextPage, page: paginationResult.page, pageSize: paginationResult.limit, totalRows: paginationResult.totalDocs };
        let objresults = paginationResult.docs;

        let objResponse = {};
        objResponse['pagination'] = objpagination;
        objResponse['results'] = objresults;

      res.status(200).json(objResponse);
        /* const providers = await Provider.find({estatus:true}).exec();
        console.log(providers);
        res.status(200).json(providers); */
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
        return res.status(500).json({ message: 'Error al obtener proveedores.', error: error.message });
      }
    },
    /// Validar si se está utilizando la función
    getProvidersFull: async (req, res) => {
      try {
        let result = [];
    
        if (req.body.all == true) {
          result = await Provider.find().then();
        } else {
          result = await Provider.find({ fechaBaja: null }).then();
        }
    
        let strippedRows = []; // Define strippedRows fuera del bloque try
    
        try {
          strippedRows = result.map(row => {
            let rowExtend = _.extend({ label: row.dependencia, value: row._id }, row.toObject());
            return rowExtend;
          });
        } catch (e) {
          console.log(e);
        }
    
        let objResponse = { results: strippedRows };
        res.status(200).json(objResponse);
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
        return res.status(500).json({ message: 'Error al obtener proveedores.', error: error.message });
      }
    }

}