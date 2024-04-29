const { Provider } = require("../models/Provider");
const { User } = require("../../usuario/models/User");
const _ = require("lodash");
//const { providerSchemaJSON } = require("../models/ajvProviderSchema");
const moment = require("moment");
const { format } = require("path");

const { providerSchemaJSON } = require("../models/ajvProviderSchema");
const Ajv = require('ajv');

module.exports = {
  createProvider: async (req, res) => {
    try {
      console.log(typeof(req.body));
      console.log(req.body);
      
     /*  if (req.body.usuario)
          delete req.body.usuario; */
      const ajv = new Ajv();
      const validate = ajv.compile(providerSchemaJSON);
      let dataToValidate = req.body;
      const isValid = validate(dataToValidate);
      if (isValid) {
        let fecha = moment().tz("America/Mexico_City").format('YYYY-MM-DD'); 
        dataToValidate["fechaAlta"] = fecha;
        dataToValidate["fechaActualizacion"] = fecha;
        dataToValidate["estatus"] = true;
  
        let existeProveedor = await Provider.findOne({
          dependencia: dataToValidate.dependencia,
        }).exec();
        
        if (existeProveedor) {
          return res.status(400).json({ message: "Ya existe un proveedor con ese nombre." });
        } else {
          const nuevoProveedor = new Provider(dataToValidate);
          let responce = await nuevoProveedor.save();
          // Devolver solo la información necesaria, por ejemplo, el ID del nuevo proveedor
          //return res.status(200).json({ message: "Proveedor creado exitosamente.", newProviderId: responce._id });
          return res.status(200).json({responce});
        }
      } else {
        console.log("Los datos no cumplen con el esquema. Errores:");
        console.log(validate.errors);
        return res.status(400).json({ message: "Los datos no cumplen con el esquema.", errors: validate.errors });
      }
    } catch (error) {
      console.error("Error al crear proveedor:", error);
      return res.status(500).json({ message: "Error al crear proveedor.", error: error.message });
    }
  },  
  editProvider: async (req, res) => {
    try {
      const ajv = new Ajv();
      const validate = ajv.compile(providerSchemaJSON);
      let dataToValidate = _.omit(req.body, ['_id']); // Eliminar la propiedad _id antes de validar
      //let dataToValidate = req.body;
  
      const isValid = validate(dataToValidate);
      if (!isValid) {
        console.log("Los datos no son válidos para actualizar el proveedor. Errores:");
        console.log(validate.errors);
        return res.status(400).json({ message: "Error al validar el proveedor.", errors: validate.errors });
      }
  
      let fecha = moment().tz("America/Mexico_City").format();
      dataToValidate["fechaActualizacion"] = fecha;
  
      let updatedProvider;
      if (req.body.estatus === false) {
        await User.updateMany({ proveedorDatos: req.body._id }, { estatus: false }).exec();
      }
  
      let id = req.body._id.toString();
      let sistemasProveedor = req.body.sistemas;
  
      // Consultar los usuarios relacionados con este proveedor
      let usuarios = await User.find({ proveedorDatos: id });
  
      usuarios.forEach(async (row) => {
        let nuevoSistemas = [];
        if (sistemasProveedor.length < row.sistemas.length ||
            (sistemasProveedor.length <= 2 && row.sistemas.length <= 2)) {
          row.sistemas.forEach((sistemaUsuario) => {
            sistemasProveedor.forEach((sistema) => {
              if (sistema === sistemaUsuario) {
                nuevoSistemas.push(sistema);
              }
            });
          });
          await User.updateOne({ _id: row._id }, { sistemas: nuevoSistemas });
        }
      });
  
      updatedProvider = await Provider.findByIdAndUpdate(req.body._id, dataToValidate, { new: true }).exec();
      res.status(200).json(updatedProvider);
    } catch (error) {
      console.error("Error al editar proveedor:", error);
      return res.status(500).json({ message: "Error al editar proveedor.", error: error.message });
    }
  },  
  getProviders: async (req, res) => {
    try {
      let sortObj = req.body.sort === undefined ? {} : req.body.sort;
      let page = req.body.page === undefined ? 1 : req.body.page; //numero de pagina a mostrar
      let pageSize = req.body.pageSize === undefined ? 10 : req.body.pageSize;
      let query = req.body.query === undefined ? {} : req.body.query;
      console.log({ page: page, limit: pageSize, sort: sortObj });
      const paginationResult = await Provider.paginate(query, {
        page: page,
        limit: pageSize,
        sort: sortObj,
      }).then();
      let objpagination = {
        hasNextPage: paginationResult.hasNextPage,
        page: paginationResult.page,
        pageSize: paginationResult.limit,
        totalRows: paginationResult.totalDocs,
      };
      let objresults = paginationResult.docs;

      let objResponse = {};
      objResponse["pagination"] = objpagination;
      objResponse["results"] = objresults;

      res.status(200).json(objResponse);
      /* const providers = await Provider.find({estatus:true}).exec();
        console.log(providers);
        res.status(200).json(providers); */
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      return res.status(500).json({
        message: "Error al obtener proveedores.",
        error: error.message,
      });
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
        strippedRows = result.map((row) => {
          let rowExtend = _.extend(
            { label: row.dependencia, value: row._id },
            row.toObject()
          );
          return rowExtend;
        });
      } catch (e) {
        console.log(e);
      }

      let objResponse = { results: strippedRows };
      res.status(200).json(objResponse);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      return res.status(500).json({
        message: "Error al obtener proveedores.",
        error: error.message,
      });
    }
  },
};
