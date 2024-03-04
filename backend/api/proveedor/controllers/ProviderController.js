const { Provider } = require("../models/Provider");
const { User } = require("../../usuario/models/User");
const _ = require("lodash");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const {
  providerSchemaJSON,
} = require("../../common/middlewares/ajvSchemas/ajvProviderSchema");
const moment = require("moment");
const { format } = require("path");

// Función para validar un objeto contra el esquema
function validate(data) {
  const valid = validateProvider(data);
  if (!valid) {
    console.log(validateProvider.errors);
  }
  return valid;
}
module.exports = {
  createProvider: async (req, res) => {
    try {
      // Crear un nuevo objeto AJV
      //const ajv = new Ajv({ allErrors: true,formats: {date: true, time: true }});
      const ajv = new Ajv();
      addFormats(ajv);
      // Agregar el plugin de formatos al objeto AJV
      const validate = ajv.compile(providerSchemaJSON);
      let fecha = moment().tz("America/Mexico_City").format();
      req.body["fechaAlta"] = fecha;
      req.body["fechaActualizacion"] = fecha;
      req.body["estatus"] = true;
      //let nombreDependencia = req.body.dependencia;
      let dataToValidate = req.body;
      const resultadoValidar = validate(dataToValidate);
      if (resultadoValidar === false) {
        console.log("datos no validos para crear el proveedor");
        console.log(validate.errors);
        return res.status(400).json({
          message: "Error al validar el proveedor.",
          error: validate.errors,
        });
      } else {
        console.log("El proveedor es valido");
        let existeProveedor = await Provider.findOne({
          dependencia: dataToValidate.dependencia,
        }).exec();
        if (existeProveedor) {
          return res
            .status(400)
            .json({ message: "Ya existe un proveedor con ese nombre." });
        } else {
          const nuevoProovedor = new Provider(dataToValidate);
          let responce = await nuevoProovedor.save();
          res.status(200).json(responce);
        }
      }
      /*  res
        .status(200)
        .json({
          message: "Proveedor creado correctamente.",
          data: dataToValidate,
        }); */
    } catch (error) {
      console.error("Error al crear proveedor:", error);
      return res
        .status(500)
        .json({ message: "Error al crear proveedor.", error: error.message });
    }
  },
  editProvider: async (req, res) => {
    try {
      const nuevoProovedor = new Provider(req.body);
      let responce;
      //console.log(req.body);
      if (req.body._id) {
        if (req.body.estatus === false) {
          /// desactivar todos los usuarios que tengan el id del proveedor
          await User.updateMany(
            { proveedorDatos: req.body._id },
            { estatus: false }
          ).exec();
          //console.log("Se desactivo el proveedor");
        }
        /// encontrar todos los usuarios que tengan el id del proveedor
        let id = req.body._id.toString();
        let sistemasproveedor = req.body.sistemas;
        let usuarios = await User.find({ proveedorDatos: id });
        let nuevoSistemas = [];
        //console.log("usuarios encontrados");
        //console.log(usuarios);

        usuarios.map(async (row) => {
          if (sistemasproveedor.length < row.sistemas.length) {
            nuevoSistemas = [];
            row.sistemas.map((sistemasusuario) => {
              sistemasproveedor.map((sistema) => {
                if (sistema == sistemasusuario) {
                  nuevoSistemas.push(sistema);
                }
              });
            });
            await User.updateOne({ _id: row._id }, { sistemas: nuevoSistemas });
          } else if (
            (sistemasproveedor.length == 2 || sistemasproveedor.length == 1) &&
            (row.sistemas.length == 1 || row.sistemas.length == 2)
          ) {
            nuevoSistemas = [];
            row.sistemas.map((sistemasusuario) => {
              sistemasproveedor.map((sistema) => {
                if (sistema == sistemasusuario) {
                  nuevoSistemas.push(sistema);
                }
              });
            });
            await User.updateOne({ _id: row._id }, { sistemas: nuevoSistemas });
          }
        });
        responce = await Provider.findByIdAndUpdate(
          req.body._id,
          nuevoProovedor
        ).exec();
        res.status(200).json(responce);
      }

      //res.status(200).json({ message: 'Usuario editado correctamente.' });
    } catch (error) {
      console.error("Error al editar proveedor:", error);
      return res
        .status(500)
        .json({ message: "Error al editar proveedor.", error: error.message });
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
