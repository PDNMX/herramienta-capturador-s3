const { S3m } = require("../models/S3m");
const _ = require("lodash");
const moment = require("moment-timezone");
const { User } = require("../../usuario/models/User");
const {
  proveedorRegistros,
} = require("../../proveedor/models/proveedorRegistros");
const { Type } = require("ajv/dist/compile/util");

module.exports = {
  create_s3m: async (req, res) => {
    try {
      //// Se obtiene el usuario que hace la petición
      let usuario = req.body.usuario;
      //// Se elimina el usuario del body
      delete req.body.usuario;
      let newdocument = req.body;
      let fecha = moment().tz("America/Mexico_City").format();
      newdocument["fechaCaptura"] = fecha;
      newdocument["fechaActualizacion"] = fecha;
      let s3m = new S3m(newdocument);
      let result = await s3m.save();
       //// se declara el objeto de respuesta
      let objResponse = {};
      objResponse['results'] = result;
       //// A su vez insertamos el proovedor de datos asociado con el usuario
      let datausuario = await User.findById(usuario)
       //console.log('datausuario:', datausuario);
      //let proveedor = await proveedorRegistros.findOne({usuario: datausuario._id});
      let sistema = 's3m';
      const proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: result._id, sistema: sistema, fechaCaptura:fecha, fechaActualizacion:fecha});      
      let resp = await proveedorRegistros1.save();

      res.status(200).json({ mesme: 'Se realizarón las inserciones correctamente en S3m', objResponse });

       /* res
        .status(200)
        .json({ mesme: "Sistema 3 creado correctamente.", doc: newdocument }); */
    } catch (error) {
      //console.error('Error al crear usuario:', error);
      return res
        .status(500)
        .json({ mesme: "Error: ", error: error.mesme });
    }
  },
  getAll_s3m: async (req, res) => {
    try {
      let sortObj = req.body.sort === undefined ? {} : req.body.sort;
      let page = req.body.page === undefined ? 1 : req.body.page; //numero de pagina a mostrar
      let pageSize = req.body.pageSize === undefined ? 10 : req.body.pageSize;
      let query = req.body.query === undefined ? {} : req.body.query;
      console.log({ page: page, limit: pageSize, sort: sortObj });
      const paginationResult = await S3m.paginate(query, { page: page, limit: pageSize, sort: sortObj }).then();
      let objpagination = { hasNextPage: paginationResult.hasNextPage, page: paginationResult.page, pageSize: paginationResult.limit, totalRows: paginationResult.totalDocs };
      let objresults = paginationResult.docs;

      let objResponse = {};
      objResponse['pagination'] = objpagination;
      objResponse['results'] = objresults;

    res.status(200).json(objResponse);
    }
      catch (error) {
        //console.error('Error al crear usuario:', error);
        return res.status(500).json({ mesme: 'Error al crear usuario.', error: error.mesme });
      }
  },
  list_s3m: async (req, res) => {
    try {
      let usuario = req.body.usuario;
      let dataUsuario = await User.findById(usuario);
      //console.log('dataUsuario:', dataUsuario);
      let proveedorDatos = dataUsuario.proveedorDatos;
      let sistema = 's3m';
      //console.log(proveedorDatos)
      const result = await proveedorRegistros.find({ sistema: sistema, proveedorId: proveedorDatos }).then();
      //console.log(result);
      let arrs3m = [];
      _.map(result, row => {
        arrs3m.push(row.registroSistemaId);
      });

      //let sancionados = S3P.model('Psancionados', p3SancionadosSchemaV2FNOG, 'psancionados');
      let sortObj = req.body.sort === undefined ? {} : req.body.sort;
      let page = req.body.page === undefined ? 1 : req.body.page; //numero de pagina a mostrar
      let pageSize = req.body.pageSize === undefined ? 10 : req.body.pageSize;
      let query = req.body.query === undefined ? {} : req.body.query;
      if (!query._id) {
        if (arrs3m.length > 0) {
          query = { ...query, _id: { $in: arrs3m } };
        } else {
          query = { _id: { $in: arrs3m } };
        }
      }

      const paginationResult = await S3m.paginate(query, { page: page, limit: pageSize, sort: sortObj }).then();
      let objpagination = { hasNextPage: paginationResult.hasNextPage, page: paginationResult.page, pageSize: paginationResult.limit, totalRows: paginationResult.totalDocs };
      let objresults = paginationResult.docs;

      let objResponse = {};
      objResponse['pagination'] = objpagination;
      objResponse['results'] = objresults;

      res.status(200).json(objResponse); 
      //res.status(200).json({ mesme: 'Se realizarón las inserciones correctamente en S3m' });
    } catch (error) {
      return res
        .status(500)
        .json({ mesme: "Error: ", error: error.mesme });
    }
  },
  update_s3m: async (req, res) => {
    try {
      console.log("update_s3m")
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
      let response;
      try{
        response = await S3m.findByIdAndUpdate(id, newdocument, { upsert: false, new: true }).exec();
      }catch (error){
        res.status(500).json(error);
      }        
      // Se devuelve la respuesta
      //res.status(200).json({ code: '200', mesme: 'Actualizando desde s2v2', id, newdocument });
      res.status(200).json(response);
     /*  const values = req.body;

      let response = await S3m.findOneAndUpdate(
        { _id: id },
        values,
        { new: true },
        (err, data) => {
          if (err) {
            console.error("Error al actualizar el documento:", err);
            res.status(500).json({ mesme: 'Error al actualizar el documento' });
          } else if (!data) {
            console.log("Documento no encontrado");
            res.status(404).json({ mesme: 'Documento no encontrado' });
          } else {
            console.log("Documento actualizado correctamente:", data);
            res.status(200).json({ mesme: 'Documento actualizado correctamente.', data: data });
          }
          console.log("endpoint de actualizar ejecutado correctamente");
        }
      );
      // Respondemos con la respuesta exitosa
      return res.status(200).json({ mesme: 'Operación realizada correctamente', Status: 200, response });  
 */
    } catch (error) { 
      return res
        .status(500)
        .json({ mesme: "Error: ", error: error.mesme });
    }
  }
  };
