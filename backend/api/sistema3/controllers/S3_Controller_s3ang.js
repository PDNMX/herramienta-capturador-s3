const { S3ang } = require("../models/S3ang");
const _ = require("lodash");
const moment = require("moment-timezone");
const { User } = require("../../usuario/models/User");
const {
  proveedorRegistros,
} = require("../../proveedor/models/proveedorRegistros");
const { Type } = require("ajv/dist/compile/util");

module.exports = {
create_S3ang: async (req, res) => {
    try {
      console.log('create_S3ang');
      //// Se obtiene el usuario que hace la petición
      let usuario = req.body.usuario;
      //// Se elimina el usuario del body
      delete req.body.usuario;
      let newdocument = req.body;
      let fecha = moment().tz("America/Mexico_City").format();
      newdocument["fechaCaptura"] = fecha;
      newdocument["fechaActualizacion"] = fecha;
      let s3ang = new S3ang(newdocument);
      let result = await s3ang.save();
       //// se declara el objeto de respuesta
       let objResponse = {};
       objResponse['results'] = result;
       //// A su vez insertamos el proovedor de datos asociado con el usuario
       let datausuario = await User.findById(usuario)
       //console.log('datausuario:', datausuario);
      //let proveedor = await proveedorRegistros.findOne({usuario: datausuario._id});
      console.log('datausuario.proveedorDatos:', datausuario.proveedorDatos);
      console.log('result._id:', result._id);
      let sistema = 'S3ang';
      const proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: result._id, sistema: sistema, fechaCaptura:fecha, fechaActualizacion:fecha});      
      let resp = await proveedorRegistros1.save();
      res.status(200).json({ message: 'Se realizarón las inserciones correctamente en S3ang', objResponse });
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
   getAll_S3ang: async (req, res) => {
    try {
      let sortObj = req.body.sort === undefined ? {} : req.body.sort;
      let page = req.body.page === undefined ? 1 : req.body.page; //numero de pagina a mostrar
      let pageSize = req.body.pageSize === undefined ? 10 : req.body.pageSize;
      let query = req.body.query === undefined ? {} : req.body.query;
      console.log({ page: page, limit: pageSize, sort: sortObj });
      const paginationResult = await S3ang.paginate(query, { page: page, limit: pageSize, sort: sortObj }).then();
      let objpagination = { hasNextPage: paginationResult.hasNextPage, page: paginationResult.page, pageSize: paginationResult.limit, totalRows: paginationResult.totalDocs };
      let objresults = paginationResult.docs;

      let objResponse = {};
      objResponse['pagination'] = objpagination;
      objResponse['results'] = objresults;

    res.status(200).json(objResponse);
    }
      catch (error) {
        //console.error('Error al crear usuario:', error);
        return res.status(500).json({ message: 'Error al crear usuario.', error: error.message });
      }
  },
  list_S3ang: async (req, res) => {
    try {
      let usuario = req.body.usuario;
      let dataUsuario = await User.findById(usuario);
      //console.log('dataUsuario:', dataUsuario);
      let proveedorDatos = dataUsuario.proveedorDatos;
      let sistema = 'S3ang';
      //console.log(proveedorDatos)
      const result = await proveedorRegistros.find({ sistema: sistema, proveedorId: proveedorDatos }).then();
      //console.log(result);
      let arrs3sag = [];
      _.map(result, row => {
        arrs3sag.push(row.registroSistemaId);
      });

      //let sancionados = S3P.model('Psancionados', p3SancionadosSchemaV2FNOG, 'psancionados');
      let sortObj = req.body.sort === undefined ? {} : req.body.sort;
      let page = req.body.page === undefined ? 1 : req.body.page; //numero de pagina a mostrar
      let pageSize = req.body.pageSize === undefined ? 10 : req.body.pageSize;
      let query = req.body.query === undefined ? {} : req.body.query;
      if (!query._id) {
        if (arrs3sag.length > 0) {
          query = { ...query, _id: { $in: arrs3sag } };
        } else {
          query = { _id: { $in: arrs3sag } };
        }
      }

      const paginationResult = await S3ang.paginate(query, { page: page, limit: pageSize, sort: sortObj }).then();
      let objpagination = { hasNextPage: paginationResult.hasNextPage, page: paginationResult.page, pageSize: paginationResult.limit, totalRows: paginationResult.totalDocs };
      let objresults = paginationResult.docs;

      let objResponse = {};
      objResponse['pagination'] = objpagination;
      objResponse['results'] = objresults;

      res.status(200).json(objResponse); 
      //res.status(200).json({ message: 'Se realizarón las inserciones correctamente en S3ang' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error: ", error: error.message });
    }
  },
  update_S3ang: async (req, res) => {
    try {
    console.log('update_S3ang');
    console.log(req.body.usuario);
      const id = req.body.usuario;

      
      //const id = req.body._id;
      //console.log(id);
      // Se eliminan los campos innecesarios de la solicitud
      delete req.body._id;
      // Se obtiene el nuevo documento a actualizar
      let newdocument = req.body;  
      // Se establece la fecha de actualización
      newdocument['fechaActualizacion'] = moment().tz("America/Mexico_City").format()
      // Se instancia el modelo de la colección de spic
      //let Spic = S2.model('Spic', nuevoS2Schema, 'spic');
      // Se actualiza el documento
      const response = await S3ang.findByIdAndUpdate(id, newdocument, { upsert: false, new: true }).exec();
        
      // Se devuelve la respuesta
      //res.status(200).json({ code: '200', message: 'Actualizando desde s2v2', id, newdocument });
      res.status(200).json(response);
     /*  const values = req.body;

      let response = await S3ang.findOneAndUpdate(
        { _id: id },
        values,
        { new: true },
        (err, data) => {
          if (err) {
            console.error("Error al actualizar el documento:", err);
            res.status(500).json({ message: 'Error al actualizar el documento' });
          } else if (!data) {
            console.log("Documento no encontrado");
            res.status(404).json({ message: 'Documento no encontrado' });
          } else {
            console.log("Documento actualizado correctamente:", data);
            res.status(200).json({ message: 'Documento actualizado correctamente.', data: data });
          }
          console.log("endpoint de actualizar ejecutado correctamente");
        }
      );
      // Respondemos con la respuesta exitosa
      return res.status(200).json({ message: 'Operación realizada correctamente', Status: 200, response });  
 */
    } catch (error) { 
      return res
        .status(500)
        .json({ message: "Error: ", error: error.message });
    }
  } 
  };
