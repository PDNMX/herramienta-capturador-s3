require('dotenv').config();
//{ useCreateIndex: true };
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Yup = require('yup');
const User = require('./schemas/model.user');
//variables para el s2 y s3
const {nuevoS2Schema} = require('./schemas/S2V2/model.new.s2.js/index.js');
//const sSancionadosS3V2 = require('./schemas/model.new.s3.js');
const { sSancionadosSchemaV2 } = require('./schemas/model.new.s3.js');
const sSancionadosSchemaYupV2 = require('./schemas/model.new.S3.yup.schema.js');
//const newusuarios = require('./schemas/model.new.s2.js');

const { spicSchema } = require('./schemas/model.s2');
const { ssancionadosSchema } = require('./schemas/model.s3s');
const { psancionadosSchema } = require('./schemas/model.s3p');
const { proveedorRegistrosSchemaV2 } = require('./schemas/model.new.S3V2.proveedorRegistros');
////const proveedorRegistrosSchemaV2 = require('./schemas/model.new.S3V2.proveedorRegistros');
////const proveedorRegistrosV2 = require('./schemas/model.new.S3V2.proveedorRegistros');
const Provider = require('./schemas/model.proovedor');
const Catalog = require('./schemas/model.catalog');
const Bitacora = require('./schemas/model.bitacora');
const proveedorRegistros = require('./schemas/model.proveedorRegistros');
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const yaml = require('js-yaml');
const fs = require('fs');

//const newS2User = require('./schemas/model.new.s2.js');
//importar el modelo nuevosUsuarios ubicado en./schemas/model.new.s2.js
//const { nuevosUsuarios } = require('./schemas/model.new.s2.js/index.js');
//const {nuevosUsuarios} = require('./schemas/model.new.s2.js/index.js');
//const nuevosUsuarios = require('./schemas/model.new.s2.js/index.js');
// const regeneratorRuntime = require('regenerator-runtime');
const { SMTPClient } = require('emailjs');
// S2New = mongoosenewS2User.connection.useDb('S2_New')
// import Bitacora from './schemas/model.bitacora';
// import proveedorRegistros from './schemas/model.proveedorRegistros';
// import moment from 'moment-timezone';
// const mongoose = require('mongoose');
// const yaml = require('js-yaml');
// const fs = require('fs');
// import regeneratorRuntime from 'regenerator-runtime';
// import { SMTPClient } from 'emailjs';
var swaggerValidator = require('swagger-object-validator');
var _ = require('underscore');
var jwt = require('jsonwebtoken');

// import regeneratorRuntime from 'regenerator-runtime';
// import { SMTPClient } from 'emailjs';

if (typeof process.env.EMAIL === 'undefined') {
  console.log('no existe el valor de EMAIL en las variables de entorno');
  process.exit(1);
}

if (typeof process.env.PASS_EMAIL === 'undefined') {
  console.log('no existe el valor de PASS_EMAIL en las variables de entorno');
  process.exit(1);
}

if (typeof process.env.HOST_EMAIL === 'undefined') {
  console.log('no existe el valor de HOST_EMAIL en las variables de entorno');
  process.exit(1);
}

// console.table({ email: process.env.EMAIL, pass: process.env.PASS_EMAIL, host: process.env.HOST_EMAIL });

//connection mongo db
// console.log('mongodb://' + process.env.USERMONGO + ':' + process.env.PASSWORDMONGO + '@' + process.env.HOSTMONGO + '/' + process.env.DATABASE);
const db = mongoose
  .connect('mongodb://' + process.env.USERMONGO + ':' + process.env.PASSWORDMONGO + '@' + process.env.HOSTMONGO + '/' + process.env.DATABASE + '?authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('Connect to MongoDB..'))
  .catch(err => console.error('Could not connect to MongoDB..', err));
mongoose.set('useFindAndModify', false);

//let S2New = mongoose.connection.useDb('S2');
let port = process.env.PORT || 3004;
let app = express();
app.use(cors(), bodyParser.urlencoded({ extended: true }), bodyParser.json());

let server = app.listen(port, function () {
  let host = server.address().address;
  let port = server.address().port;
  console.log(' function cloud Server is listening at http://%s:%s', host, port);
});



async function registroBitacora(data) {
  let response;
  const nuevaBitacora = new Bitacora(data);
  response = await nuevaBitacora.save();
}

async function validateSchema(doc, schema, validacion) {
  let objError = { valid: true };
  let result = await validacion.validateModel(doc, schema);

  if (result.errors.length > 0) {
    // let arrayErrors = result.errorsWithStringTypes();
    let arrayErrors = result.errors;
    let textErrors;
    if (Array.isArray(doc)) {
      objError['docId'] = doc[0].id;
    } else {
      console.log('validateSchema docId', doc.id);
      objError['docId'] = doc.id;
    }
    objError['valid'] = arrayErrors.length === 0 ? true : false;
    objError['errorCount'] = arrayErrors.length;

    let errors = [];
    for (let error of arrayErrors) {
      let obj = {};
      obj['typeError'] = error.errorType;
      let path = '';
      for (let ruta of error.trace) {
        path = path + ruta.stepName + '/';
      }
      obj['pathError'] = path;
      errors.push(obj);
    }
    objError['errors'] = errors;
    objError['errorsHumanReadable'] = result.humanReadable();
  }
  return objError;
}


app.post('/validateSchemaS2', async (req, res) => {
  try {
    var code = validateToken(req);
    var usuario = req.headers.usuario;
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      let fileContents = fs.readFileSync(path.resolve(__dirname, '../resource/openapis2.yaml'), 'utf8');
      let data = yaml.safeLoad(fileContents);
      let schemav2 = data.components.schemas.respSpic;
      let validacion = new swaggerValidator.Handler();

      let newdocument = req.body;
      let respuesta = [];
      let arrayDocuments = [];
      let ids = [];
      let c1 = 1;
      if (Array.isArray(newdocument)) {
        for (let doc of newdocument) {
          doc['id'] = c1.toString();
          doc['fechaCaptura'] = moment().format();
          if (doc['tipoProcedimiento']) {
            if (doc['tipoProcedimiento'].length === 0) {
              delete doc['tipoProcedimiento'];
            }
          }
          c1++;
          respuesta.push(await validateSchema([doc], schemaS2, validacion));
          ids.push(doc.id);
          arrayDocuments.push(doc);
        }
      } else {
        newdocument['id'] = c1.toString();
        newdocument['fechaCaptura'] = moment().format();
        if (newdocument['tipoProcedimiento']) {
          if (newdocument['tipoProcedimiento'].length === 0) {
            delete newdocument['tipoProcedimiento'];
          }
        }
        c1++;
        respuesta.push(await validateSchema([newdocument], schemaS2, validacion));
        arrayDocuments.push(newdocument);
      }

      let wasInvalid;

      for (let val of respuesta) {
        if (!val.valid) {
          wasInvalid = true;
        }
      }

      if (wasInvalid) {
        res.status(500).json({ message: 'Error : La validación no fue exitosa', Status: 500, response: respuesta });
      } else {
        //se insertan
        try {
          let Spic = S2.model('Spic', spicSchema, 'spic');
          let response;
          response = await Spic.insertMany(arrayDocuments);
          let detailObject = {};
          detailObject['numeroRegistros'] = arrayDocuments.length;

          var datausuario = await User.findById(usuario);
          response.map(async row => {
            const proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: row._id, sistema: 'S2' });
            var resp = await proveedorRegistros1.save();
          });
          var bitacora = [];
          bitacora['tipoOperacion'] = 'CREATE';
          bitacora['fechaOperacion'] = moment().format();
          bitacora['usuario'] = usuario;
          bitacora['numeroRegistros'] = arrayDocuments.length;
          bitacora['sistema'] = 'S2';
          registroBitacora(bitacora);
          res.status(200).json({ message: 'Se realizarón las inserciones correctamente', Status: 200, response: response, detail: detailObject });
        } catch (e) {
          console.log(e);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
});

app.post('/validateSchemaS3S', async (req, res) => {
  try {
    var code = validateToken(req);
    var usuario = req.headers.usuario;
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      let fileContents = fs.readFileSync(path.resolve(__dirname, '../resource/openapis3s.yaml'), 'utf8');
      let data = yaml.safeLoad(fileContents);
      let schemaResults = data.components.schemas.ssancionados.properties.results;
      schemaResults.items.properties.tipoFalta = data.components.schemas.tipoFalta;
      schemaResults.items.properties.tipoSancion = data.components.schemas.tipoSancion;

      let schemaS3S = schemaResults;

      let validacion = new swaggerValidator.Handler();
      let newdocument = req.body;
      let respuesta = [];
      let arrayDocuments = [];
      let ids = [];
      let c1 = 1;
      if (Array.isArray(newdocument)) {
        for (let doc of newdocument) {
          doc['id'] = c1.toString();
          if (doc['tipoSancion'].length === 0) {
            delete doc['tipoSancion'];
          }
          c1++;
          respuesta.push(await validateSchema([doc], schemaS3S, validacion));
          ids.push(doc.id);
          arrayDocuments.push(doc);
        }
      } else {
        newdocument['id'] = c1.toString();
        if (newdocument['tipoSancion'].length === 0) {
          delete newdocument['tipoSancion'];
        }
        c1++;
        respuesta.push(await validateSchema([newdocument], schemaS3S, validacion));
        arrayDocuments.push(newdocument);
      }

      let wasInvalid;

      for (let val of respuesta) {
        if (!val.valid) {
          wasInvalid = true;
        }
      }

      if (wasInvalid) {
        res.status(500).json({ message: 'Error : La validación no fue exitosa', Status: 500, response: respuesta });
      } else {
        //se insertan
        try {
          let sancionados = S3S.model('Ssancionados', ssancionadosSchema, 'ssancionados');
          let response;
          response = await sancionados.insertMany(arrayDocuments);
          var datausuario = await User.findById(usuario);
          response.map(async row => {
            const proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: row._id, sistema: 'S3S' });
            var resp = await proveedorRegistros1.save();
          });
          var bitacora = [];
          bitacora['tipoOperacion'] = 'CREATE';
          bitacora['fechaOperacion'] = moment().format();
          bitacora['usuario'] = usuario;
          bitacora['numeroRegistros'] = arrayDocuments.length;
          bitacora['sistema'] = 'S3S';
          registroBitacora(bitacora);
          let detailObject = {};
          detailObject['numeroRegistros'] = arrayDocuments.length;
          res.status(200).json({ message: 'Se realizarón las inserciones correctamente', Status: 200, response: response, detail: detailObject });
        } catch (e) {
          console.log(e);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
});
/* 
app.post('/validateSchemaS3P', async (req, res) => {
  try {
    var code = validateToken(req);
    var usuario = req.headers.usuario;
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      let fileContents = fs.readFileSync(path.resolve(__dirname, '../resource/openapis3p.yaml'), 'utf8');
      let data = yaml.safeLoad(fileContents);
      let schemaResults = data.components.schemas.resParticularesSancionados.properties.results;
      schemaResults.items.properties.particularSancionado.properties.domicilioExtranjero.properties.pais = data.components.schemas.pais;
      schemaResults.items.properties.tipoSancion = data.components.schemas.tipoSancion;

      let schemaS3P = schemaResults;

      let validacion = new swaggerValidator.Handler();
      let newdocument = req.body;
      let respuesta = [];
      let arrayDocuments = [];
      let ids = [];
      let c1 = 1;
      if (Array.isArray(newdocument)) {
        for (let doc of newdocument) {
          doc['id'] = c1.toString();
          doc['fechaCaptura'] = moment().format();
          if (doc['tipoSancion'].length === 0) {
            console.log('no tiene datos');
            delete doc['tipoSancion'];
          }
          c1++;
          respuesta.push(await validateSchema([doc], schemaS3P, validacion));
          ids.push(doc.id);
          arrayDocuments.push(doc);
        }
      } else {
        newdocument['id'] = c1.toString();
        if (newdocument['tipoSancion'].length === 0) {
          console.log('no tiene datos');
          delete newdocument['tipoSancion'];
        }
        newdocument['fechaCaptura'] = moment().format();
        c1++;
        respuesta.push(await validateSchema([newdocument], schemaS3P, validacion));
        arrayDocuments.push(newdocument);
      }

      levalidateSchemaS3St wasInvalid;

      for (let val of respuesta) {
        if (!val.valid) {
          wasInvalid = true;
        }
      }

      if (wasInvalid) {
        res.status(500).json({ message: 'Error : La validación no fue exitosa', Status: 500, response: respuesta });
      } else {
        //se insertan
        validateSchemaS3Stry {
          let psancionados = S3P.model('Psancionados', psancionadosSchema, 'psancionados');
          let response;
          response = await psancionados.insertMany(arrayDocuments);

          var datausuario = await User.findById(usuario);
          response.map(async row => {
            const proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: row._id, sistema: 'S3P' });
            var resp = await proveedorRegistros1.save();
          });
          var bitacora = [];
          bitacora['tipoOperacion'] = 'CREATE';
          bitacora['fechaOperacion'] = moment().format();
          bitacora['usuario'] = usuario;
          bitacora['numeroRegistros'] = arrayDocuments.length;
          bitacora['sistema'] = 'S3P';
          registroBitacora(bitacora);
          let detailObject = {};
          detailObject['numeroRegistros'] = arrayDocuments.length;
          res.status(200).json({ message: 'Se realizarón las inserciones correctamente', Status: 200, response: response, detail: detailObject });
        } catch (e) {
          console.log(e);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
});
 */


/* Sistemas v2 - Inicio */

app.post('/insertS3Sv2', async (req, res) => {
  try {
    var code = validateToken(req);
    var usuario = req.body.usuario;
    delete req.body.usuario;
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      let values = req.body;

      values['fechaCaptura'] = moment().format();
      values['id'] = 'FAKEID';

      let fileContents = fs.readFileSync(path.resolve(__dirname, '../resource/s3S-v2.json'), 'utf8');
      let data = yaml.safeLoad(fileContents);
      console.log(data);
      let schemaResults = data.components.schemas.ssancionados.properties.results;
      schemaResults.items.properties.tipoFalta = data.components.schemas.tipoFalta;
      schemaResults.items.properties.tipoSancion = data.components.schemas.tipoSancion;

      let schemaS3S = schemaResults;
      let validacion = new swaggerValidator.Handler();
      let respuesta = await validateSchema([values], schemaS3S, validacion);
      //se insertan

      if (respuesta.valid) {
        try {
          let sancionados = S3S.model('Ssancionados', ssancionadosSchema, 'ssancionados');
          let response;
          delete values.id;
          let esquema = new sancionados(values);
          const result = await esquema.save();
          let objResponse = {};
          objResponse['results'] = result;
          var datausuario = await User.findById(usuario);
          const proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: result._id, sistema: 'S3S' });
          var resp = await proveedorRegistros1.save();
          var bitacora = [];
          bitacora['tipoOperacion'] = 'CREATE';
          bitacora['fechaOperacion'] = moment().format();
          bitacora['usuario'] = usuario;
          bitacora['numeroRegistros'] = 1;
          bitacora['sistema'] = 'S3S';
          registroBitacora(bitacora);
          res.status(200).json({ message: 'Se realizarón las inserciones correctamente', Status: 200, response: response, detail: objResponse });
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log(respuesta);
        res.status(400).json({ message: 'Error in validation openApi', Status: 400, response: respuesta });
      }
    }
  } catch (e) {
    console.log(e);
  }
});
//// Endpoint original para insertar en S3S
app.post('/insertS3SSchema_1', async (req, res) => {
  try {
    //// Se valida el token
    var code = validateToken(req);
    //// Se obtiene el usuario
    var usuario = req.body.usuario;
    //// Se elimina el usuario del body
    delete req.body.usuario;
    //// Se valida el token
    if (code.code == 401) {
      //// Se regresa el erroren caso de que el token no sea valido
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      //// En caso de que el token sea valido
      //// Se obtienen los valores del body
      let values = req.body;
      //// Se agrega la fecha de captura
      values['fechaCaptura'] = moment().format();
      //// Se agrega el id fake
      values['id'] = 'FAKEID';
      //// Se obtiene el esquema de S3S
      let fileContents = fs.readFileSync(path.resolve(__dirname, '../resource/openapis3s.yaml'), 'utf8');
      let data = yaml.safeLoad(fileContents);
      let schemaResults = data.components.schemas.ssancionados.properties.results;
      schemaResults.items.properties.tipoFalta = data.components.schemas.tipoFalta;
      schemaResults.items.properties.tipoSancion = data.components.schemas.tipoSancion;

      let schemaS3S = schemaResults;
      let validacion = new swaggerValidator.Handler();
      let respuesta = await validateSchema([values], schemaS3S, validacion);
      //se insertan

      if (respuesta.valid) {
        try {
          let sancionados = S3S.model('Ssancionados', ssancionadosSchema, 'ssancionados');
          let response;
          delete values.id;
          let esquema = new sancionados(values);
          const result = await esquema.save();
          let objResponse = {};
          objResponse['results'] = result;
          var datausuario = await User.findById(usuario);
          const proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: result._id, sistema: 'S3S' });
          var resp = await proveedorRegistros1.save();
          var bitacora = [];
          bitacora['tipoOperacion'] = 'CREATE';
          bitacora['fechaOperacion'] = moment().format();
          bitacora['usuario'] = usuario;
          bitacora['numeroRegistros'] = 1;
          bitacora['sistema'] = 'S3S';
          registroBitacora(bitacora);
          res.status(200).json({ message: 'Se realizarón las inserciones correctamente', Status: 200, response: response, detail: objResponse });
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log(respuesta);
        res.status(400).json({ message: 'Error in validation openApi', Status: 400, response: respuesta });
      }
    }
  } catch (e) {
    console.log(e);
  }
});

//Endpoint para insertar un documento de la coleccion ssancionados y en la coleccion proveedorRegistros
app.post('/insertS3Sv2_1_2', async (req, res) => {
  try {
    var code = validateToken(req);
    var usuario = req.body.usuario;
    delete req.body.usuario;
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      let values = req.body;

      values['fechaCaptura'] = moment().format();
      values['id'] = 'FAKEID';
      console.log(values);
      let fileContents = fs.readFileSync(path.resolve(__dirname, '../resource/openapis3s.yaml'), 'utf8');
      let data = yaml.safeLoad(fileContents);
      let schemaResults = data.components.schemas.ssancionados.properties.results;
      schemaResults.items.properties.tipoFalta = data.components.schemas.tipoFalta;
      schemaResults.items.properties.tipoSancion = data.components.schemas.tipoSancion;

      let schemaS3S = schemaResults;
      let validacion = new swaggerValidator.Handler();
      let respuesta = await validateSchema([values], schemaS3S, validacion);
      //res.status(200).message({ message: 'Se realizarón las inserciones correctamente desde insertS3Sv2_1_2', Status: 200, data: req.body });
      res.status(200).json(respuesta);
      //se insertan

      /*  if (respuesta.valid) {
         try {
           let sancionados = S3S.model('Ssancionados', ssancionadosSchema, 'ssancionados');
           let response;
           delete values.id;
           let esquema = new sancionados(values);
           const result = await esquema.save();
           let objResponse = {};
           objResponse['results'] = result;
           var datausuario = await User.findById(usuario);
           const proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: result._id, sistema: 'S3S' });
           var resp = await proveedorRegistros1.save();
           var bitacora = [];
           bitacora['tipoOperacion'] = 'CREATE';
           bitacora['fechaOperacion'] = moment().format();
           bitacora['usuario'] = usuario;
           bitacora['numeroRegistros'] = 1;
           bitacora['sistema'] = 'S3S';
           registroBitacora(bitacora);
           res.status(200).json({ message: 'Se realizarón las inserciones correctamente', Status: 200, response: response, detail: objResponse });
         } catch (e) {
           console.log(e);_2
         }
       } else {
         console.log(respuesta);
         res.status(400).json({ message: 'Error in validation openApi', Status: 400, response: respuesta });
       }*/
    }
  } catch (e) {
    console.log(e);
  }
});

app.post('/listSchemaS3S_1', async (req, res) => {
  try {
    var code = validateToken(req);
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      var usuario = await User.findById(req.body.idUser);
      var proveedorDatos = usuario.proveedorDatos;
      var sistema = 'S3S';
      const result = await proveedorRegistros.find({ sistema: sistema, proveedorId: proveedorDatos }).then();
      var arrs3s = [];
      _.map(result, row => {
        arrs3s.push(row.registroSistemaId);
      });

      let sancionados = S3S.model('Ssancionados', ssancionadosSchema, 'ssancionados');
      let sortObj = req.body.sort === undefined ? {} : req.body.sort;
      let page = req.body.page === undefined ? 1 : req.body.page; //numero de pagina a mostrar
      let pageSize = req.body.pageSize === undefined ? 10 : req.body.pageSize;
      let query = req.body.query === undefined ? {} : req.body.query;
      if (!query._id) {
        if (arrs3s.length > 0) {
          query = { ...query, _id: { $in: arrs3s } };
        } else {
          query = { _id: { $in: arrs3s } };
        }
      }

      const paginationResult = await sancionados.paginate(query, { page: page, limit: pageSize, sort: sortObj }).then();
      let objpagination = { hasNextPage: paginationResult.hasNextPage, page: paginationResult.page, pageSize: paginationResult.limit, totalRows: paginationResult.totalDocs };
      let objresults = paginationResult.docs;

      let objResponse = {};
      objResponse['pagination'] = objpagination;
      objResponse['results'] = objresults;

      res.status(200).json(objResponse);
    }
  } catch (e) {
    console.log(e);
  }
});
/* Sistemas v2 - Fin */
////////////////////////////////////// Inicio Api S2 version  ////////////////////////////////////////////////////////////////////////////

//Endpoint para obtener todos los documentos de la colección ssancionados
app.get('/getAllS3Sv2_1', async (req, res) => {
  try {
    var code = validateToken(req);
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      const sSancionadosS3V2 = S3S.model('ssancionados', sSancionadosSchemaV2, 'ssancionados');
      const result = await sSancionadosS3V2.find().exec();
      res.status(200).json({ message: 'Operación realizada correctamente', Status: 200, response: result });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Internal server error', Status: 500 });
  }
});

//Endpoint para obtener un documento de la colección ssancionados por id de la colección generado por mongo
app.get('/getS3Sv2ById_1/:id', async (req, res) => {
  try {
    var code = validateToken(req);
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      const sSancionadosS3V2 = S3S.model('ssancionados', sSancionadosSchemaV2, 'ssancionados');
      const id = req.params.id;
      const result = await sSancionadosS3V2.findById(id).exec();

      if (!result) {
        return res.status(404).json({ message: 'Documento no encontrado', Status: 404 });
      }

      res.status(200).json({ message: 'Operación realizada correctamente', Status: 200, response: result });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Internal server error', Status: 500 });
  }
});

//Endpoint para borrar un documento de la coleccion ssancionados 
app.delete('/deleteS3Sv2_1/:id', async (req, res) => {
  try {
    const code = validateToken(req);

    if (code.code !== 200) {
      return res.status(code.code).json({ code: code.code.toString(), message: code.message });
    }

    const id = mongoose.Types.ObjectId(req.params.id);

    // Verificar que el ID sea válido antes de intentar eliminar el documento
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido', Status: 400 });
    }

    const sSancionadosS3V2 = S3S.model('ssancionados', sSancionadosSchemaV2, 'ssancionados');
    const response = await sSancionadosS3V2.findOneAndDelete({ _id: id });

    if (!response) {
      // Si no se encontró el documento, retornar 404
      return res.status(404).json({ message: 'Documento no encontrado', Status: 404 });
    }

    console.log("Documento eliminado correctamente:", response);
    return res.status(200).json({ message: 'Documento eliminado correctamente.', data: response });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ message: 'Error', Status: 500 });
  }
});


/////////////////////////////////////////////////////////SHEMA S2///////////////////////////////////////////

////////////////////////////////////// Inicio Api S3S version 2.1 /////////////////////////////////////////////////////////////////////////
//// Endpoint funcionando similar al original de la version 1 donde inserta en registroproveedores y en ssancionados
//// Endpoint para insertar un documento de la coleccion ssancionados
//// Similar al endpoint insertS3SSchem
app.post('/insertS3Sv2_1', async (req, res) => {
  try {
    var code = validateToken(req);
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      var usuario = req.body.usuario;
      //// Se elimina el usuario del body
      delete req.body.usuario;
      // Utiliza el esquema de validación para verificar el JSON recibido
      let values = req.body;
      values.faltaGrave.fechaCaptura = moment().format();
      values.faltaGrave.id = 'FAKEID';
      console.log(values);
      //// Se guarda el registro ssancionados en la base de datos
      const sSancionadosS3V2 = S3S.model('ssancionados', sSancionadosSchemaV2, 'ssancionados');//,'ssancionados');
      const sSancionadosS3V2Ind = new sSancionadosS3V2(values);
      //// Si el JSON recibido es válido, puedes continuar con la operación de guardado en MongoDB
      let result = await sSancionadosS3V2Ind.save();
      //// se declara el objeto de respuesta
      let objResponse = {};
      objResponse['results'] = result;
      //// A su vez insertamos el proovedor de datos asociado con el usuario
      let datausuario = await User.findById(usuario);
      let proveedorRegistros = S3S.model('proveedorRegistros', proveedorRegistrosSchemaV2, 'proveedorRegistros');
      let proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: result._id, sistema: 'S3S' });
      //console.log(proveedorRegistros1);
      //console.log(datausuario);
      proveedorRegistros1.fechaCaptura = moment().format();
      let resp = await proveedorRegistros1.save();
      /*
      //console.log(values);let values = req.body;
      values.faltaGrave.fechaCaptura = moment().format();
      values.faltaGrave.id = 'FAKEID';
      //console.log(values); 
      //// Se guarda el registro ssancionados en la base de datos
      const sSancionadosS3V2 = S3S.model('ssancionados', sSancionadosSchemaV2,'ssancionados');//,'ssancionados');
      const sSancionadosS3V2Ind = new sSancionadosS3V2(values);
      //// Si el JSON recibido es válido, puedes continuar con la operación de guardado en MongoDB
      let response = await sSancionadosS3V2Ind.save();
      // A su vez insertamos el proovedor de datos asociado con el usuario
      let datausuario = await User.findById(usuario);
      let proveedorRegistros = S3S.model('proveedorRegistros', proveedorRegistrosSchemaV2, 'proveedorRegistros');
      let proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: datausuario._id, sistema: 'S3S' });
      //console.log(proveedorRegistros1);
      //console.log(datausuario);
      proveedorRegistros.fechaCaptura = moment().format();
      let resp = await proveedorRegistros1.save();
      //console.log(values);
      //console.log();
      res.status(200).json({ message: 'Se realizarón las inserciones correctamente', Status: 200, response: values, usuario: usuario,  datausuario:datausuario, proveedorRegistros1_1:proveedorRegistros1 });

      //console.log();
      res.status(200).json({ message: 'Se realizarón las inserciones correctamente', Status: 200, response: values, usuario: usuario,  datausuario:datausuario, proveedorRegistros1_1:proveedorRegistros1 });
 */
      res.status(200).json({ message: 'Se realizarón las inserciones correctamente', Status: 200, usuario: usuario, datausuario: datausuario, objResponse: objResponse });//, response:response});//, response: values, usuario: usuario,  datausuario:datausuario, proveedorRegistros1_1:proveedorRegistros1 });
    }
  } catch (e) {
    console.log(e);
  }
});
//// Endpoint para leer los documentos de la coleccion ssancionados
//// Endpont funcionando sSimilar al endpoint listS3SSchem
//// Endpoint para leer los documentos de la coleccion ssancionados
app.post('/listS3Sv2_1', async (req, res) => {
  try {
    let code = validateToken(req);
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      let usuario = await User.findById(req.body.id);
      let proveedorDatos = usuario.proveedorDatos;
      let sistema = 'S3S';
      let proveedorRegistros = S3S.model('proveedorRegistros', proveedorRegistrosSchemaV2, 'proveedorRegistros');
      const result = await proveedorRegistros.find({ sistema: sistema, proveedorId: proveedorDatos }).then();
      //console.log(result);
      let arrs3s = [];
      _.map(result, row => {
        arrs3s.push(row.registroSistemaId);
      });
      let sancionados = S3S.model('Ssancionados', ssancionadosSchema, 'ssancionados');
      // Realizar la consulta utilizando el método find() de mongoose
/*    console.log(arrs3s[0]);
      let idSancionado = arrs3s[2];
      let sancio = await sancionados.findById(idSancionado);
      console.log(sancio);
      res.status(200).json({ message: 'Se realizarón las consultas correctamente', Status: 200, result:result, arrs3s:arrs3s,  idSancionado:idSancionado, sancio:sancio });
 */
      let sortObj = req.body.sort === undefined ? {} : req.body.sort;
      let page = req.body.page === undefined ? 1 : req.body.page; //numero de pagina a mostrar
      let pageSize = req.body.pageSize === undefined ? 10 : req.body.pageSize;
      let query = req.body.query === undefined ? {} : req.body.query;
      if (!query._id) {
        if (arrs3s.length > 0) {
          query = { ...query, _id: { $in: arrs3s } };
        } else {
          query = { _id: { $in: arrs3s } };
        }
      }

      const paginationResult = await sancionados.paginate(query, { page: page, limit: pageSize, sort: sortObj }).then();
      let objpagination = { hasNextPage: paginationResult.hasNextPage, page: paginationResult.page, pageSize: paginationResult.limit, totalRows: paginationResult.totalDocs };
      let objresults = paginationResult.docs;

      let objResponse = {};
      objResponse['pagination'] = objpagination;
      objResponse['results'] = objresults;

      res.status(200).json(objResponse);    }
  } catch (e) {
    console.log(e);
  }
});

// Endpoint para actualizar un documento de la coleccion ssancionados  
app.put('/updateS3Sv2_1/:id', async (req, res) => {
  try {
    var code = validateToken(req);
    if (code.code !== 200) {
      return res.status(code.code).json({ code: code.code.toString(), message: code.message });
    }

    const id = req.params.id.toString();
    const values = req.body;

    // Validar el objeto principal utilizando el esquema Yup
    try {
      await sSancionadosSchemaYupV2.validate(values);
    } catch (error) {
      // Si hay errores de validación, responder con el error
      return res.status(400).json({ message: 'Error in validation', Status: 400, response: error });
    }

    const sSancionadosS3V2 = S3S.model('ssancionados', sSancionadosSchemaV2, 'ssancionados');

    if (values._id) {
      // Buscar y actualizar el documento por su _id
      try {
        //let response = await sSancionadosS3V2.findByIdAndUpdate(values._id, values, { upsert: true, new: true }).exec();
        let response = await sSancionadosS3V2.findOneAndUpdate(
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
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', Status: 500 });
      }
    } else {
      // Si no se proporciona el _id, realizamos una nueva inserción
      let esquema = new sSancionadosS3V2(values);
      try {
        let response = await esquema.save();
        // Respondemos con la respuesta exitosa
        return res.status(200).json({ message: 'Operación realizada correctamente', Status: 200, response });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', Status: 500 });
      }
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Internal server error', Status: 500 });
  }
});
////////////////////////////////////// Final Api S3S version 2.1 /////////////////////////////////////////////////////////////////////////
      /**
       * En este punto convertimos el json recibido 
       * para la parte de nivel de responsabilidad 
       * en un array de objetos y que sea compatible 
       * con el modelo de mongoose
      */

      function convertLevels(req) {
        if (req.body.procedimientos.nivelesResponsabilidad) {
          // Convert the levelsResponsabilidad field to an array of objects.
          const levelsResponsabilidad = req.body.nivelesResponsabilidad;
          const convertedLevelsResponsabilidad = levelsResponsabilidad.map(level => {
          const newLevel = {
          ambito: level.ambito,
          nivel: level.nivel,
          identificadorObjeto: level.identificadorObjeto
          };
          return newLevel;
          });
          
          // Replace the original levelsResponsabilidad field with the converted levelsResponsabilidad field.
          //req.body.nivelesResponsabilidad = convertedLevelsResponsabilidad;
          } 
        //return convertedLevelsResponsabilidad;
         req.body.nivelesResponsabilidad = convertedLevelsResponsabilidad;
         return req;
    }
    
//************************************ Inicio API S2 V2.1 ****************************************************/
app.post('/insertS2v2', async (req, res) => {
  try {
    var code = validateToken(req);
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      //"usuario": "64d11643f699b0182466fd52",
      let usuario = req.body.usuario;
      delete req.body.usuario;
      let newdocument = req.body;
      //let newdocument = convertLevels(req.body);
      //newdocument['fechaCaptura'] = moment().tz("America/Mexico_City").format();//moment().format();
      //console.log(newdocument['fechaCaptura']);
      newdocument['fechaCaptura'] = moment().tz("America/Mexico_City").format();
      //let n = newdocument['fechaCaptura'];
      //console.log(n);
      let Spic = S2.model('Spic', nuevoS2Schema, 'spic');      
      let esquema = new Spic(newdocument);
      const result = await esquema.save();
      //const result = await Spic.create(newdocument);
      /// Hasta este punto se inserta en spin de S2
      //onst result = await esquema.insertOne(newdocument);
      let objResponse = {};
      objResponse['results'] = result; 
      let datausuario = await User.findById(usuario);
      const proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: result._id, sistema: 'S2' });
      //let resp = await proveedorRegistros1.save();
      ////let proveedorRegistros = S2.model('proveedorRegistros', proveedorRegistrosSchemaV2, 'proveedorRegistros');
      ////let proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: result._id, sistema: 'S2' });
      //let proveedorRegistros1 = new proveedorRegistrosSchemaV2({ proveedorId: datausuario.proveedorDatos, registroSistemaId: result._id, sistema: 'S2' });
      //console.log(proveedorRegistros1);
      //console.log(datausuario);
      proveedorRegistros1.fechaCaptura = moment().tz("America/Mexico_City").format();
      let resp = await proveedorRegistros1.save();
      //res.status(200).json({ code: '200', message: "iNSERTADO DESDES S2V2 fecha modificada", datausuario:datausuario, objeto:newdocument, datareq:req });
      //let niveles = newdocument.nivelesResponsabilidad;
      //console.log(niveles);
      res.status(200).json({code:200,message:"se inserto correctamente", recibidos:newdocument});
    }
  } catch (e) {
    console.log(e);
  }
});
//// Endpoint para obtener todos los registros de la coleccion de S2
app.post('/getAllS2v2', async (req, res) => {post
  try {
    const Spic = S2.model('Spic', nuevoS2Schema, 'spic'); 
    const registros = await Spic.find().exec();
    res.status(200).json(registros);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los registros' });
  }
});

//// Endpoint list s2v2 from s2
app.post('/lists2v2', async (req, res) => {
  try {
    //const token = req.headers.authorization;
    //var code = validateToken(req);
    let code = validateToken(req);
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      // Deshabilitar estas líneas debido a que las variables usuario y proveedorDatos no se utilizan
      let usuario = await User.findById(req.body.idUser);
      let proveedorDatos = usuario.proveedorDatos;
      let sistema = 'S2';

      ///let proveedorRegistros = S2.model('proveedorRegistros', proveedorRegistrosSchemaV2, 'proveedorRegistros');

      const result = await proveedorRegistros.find({ sistema: sistema, proveedorId: proveedorDatos }).then();
      let arrs2 = [];
      _.map(result, row => {
        arrs2.push(row.registroSistemaId);
      });
      let Spic = S2.model('Spic', nuevoS2Schema, 'spic');
      let sortObj = req.body.sort === undefined ? {} : req.body.sort;
      let page = req.body.page === undefined ? 1 : req.body.page; //numero de pagina a mostrar
      let pageSize = req.body.pageSize === undefined ? 10 : req.body.pageSize;
      let query = req.body.query === undefined ? {} : req.body.query;

      if (!query._id) {
        if (arrs2.length > 0) {
          query = { ...query, _id: { $in: arrs2 } };
        } else {
          query = { _id: { $in: arrs2 } };
        }
      }

      const paginationResult = await Spic.paginate(query, { page: page, limit: pageSize, sort: sortObj }).then();
      let objpagination = { hasNextPage: paginationResult.hasNextPage, page: paginationResult.page, pageSize: paginationResult.limit, totalRows: paginationResult.totalDocs };
      let objresults = paginationResult.docs;

      let objResponse = {};
      objResponse['pagination'] = objpagination;
      objResponse['results'] = objresults;

      res.status(200).json(objResponse);
      
      //const result2 = await Spic.find(arrs2[0]).then();
      ///let res2 = await Spic.findById(arrs2[0]).then();
      //console.log(arrs2[0]);
      // Crear un objeto con las propiedades relevantes del objeto req
      /* const requestData = {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        query: req.query,
        body: req.body
      }; */
      //res.status(200).json({ code: '200', message: 'Listando desde s2v2', requestData, ususario: usuario, proveedorDatos, sistema, result });
      //res.status(200).json({ code: '200', message: 'Listando desde s2v2', requestData, ususario: usuario });
      //res.status(200).json({ code: '200', message: 'Listando desde s2v2', result, arrs2, res2 });
    }
  } catch (e) {
    console.log(e);
  }
});

//// update s2v2 from s2
app.post('/updateS2v2',async (req, res) =>{  
  //let docSend = {};
  let values = req.body;
  //docSend['id'] = values._id;
  values['fechaCaptura'] = moment().format();
  
  let Spic = S2.model('Spic', nuevoS2Schema, 'spic');
  let esquema = new Spic(values);
  let response;  
  //await Spic.findByIdAndDelete(values._id);
  response = await Spic.findByIdAndUpdate(values._id, esquema, { upsert: true, new: true }).exec();
  res.status(200).json({message:'Mensaje de actualizacion correcta', response});

});
//// Endpoint para generar un saludo por post
app.post('/hola', async (req, res) => {

res.status(200).json({message: "hola"});
});
//************************************ Final API S2 V2.1 ****************************************************/
app.post('/insertS2Schema', async (req, res) => {
  try {
    var code = validateToken(req);
    var usuario = req.body.usuario;
    delete req.body.usuario;
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      let fileContents = fs.readFileSync(path.resolve(__dirname, '../resource/openapis2.yaml'), 'utf8');
      let data = yaml.safeLoad(fileContents);
      let schemaS2 = data.components.schemas.respSpic;
      let validacion = new swaggerValidator.Handler();
      let newdocument = req.body;
      newdocument['id'] = 'FAKEID';
      newdocument['fechaCaptura'] = moment().format();
      let respuesta = await validateSchema([newdocument], schemaS2, validacion);
      if (respuesta.valid) {
        try {
          let Spic = S2.model('Spic', spicSchema, 'spic');
          delete req.body.id;
          let esquema = new Spic(req.body);
          const result = await esquema.save();
          let objResponse = {};
          var datausuario = await User.findById(usuario);

          const proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: result._id, sistema: 'S2' });
          var resp = await proveedorRegistros1.save();

          objResponse['results'] = result;
          var bitacora = [];
          bitacora['tipoOperacion'] = 'CREATE';
          bitacora['fechaOperacion'] = moment().format();
          bitacora['usuario'] = usuario;
          bitacora['numeroRegistros'] = 1;
          bitacora['sistema'] = 'S2';
          registroBitacora(bitacora);
          res.status(200).json(objResponse);
        } catch (e) {
          console.log(e);
        }
      } else {
        res.status(400).json({ message: 'Error in validation', Status: 400, response: respuesta });
      }
    }
  } catch (e) {
    console.log(e);
  }
});

app.post('/insertS3SSchema', async (req, res) => {
  try {
    var code = validateToken(req);
    var usuario = req.body.usuario;
    delete req.body.usuario;
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      let values = req.body;

      values['fechaCaptura'] = moment().format();
      values['id'] = 'FAKEID';

      let fileContents = fs.readFileSync(path.resolve(__dirname, '../resource/openapis3s.yaml'), 'utf8');
      let data = yaml.safeLoad(fileContents);
      let schemaResults = data.components.schemas.ssancionados.properties.results;
      schemaResults.items.properties.tipoFalta = data.components.schemas.tipoFalta;
      schemaResults.items.properties.tipoSancion = data.components.schemas.tipoSancion;

      let schemaS3S = schemaResults;
      let validacion = new swaggerValidator.Handler();
      let respuesta = await validateSchema([values], schemaS3S, validacion);
      //se insertan

      if (respuesta.valid) {
        try {
          let sancionados = S3S.model('Ssancionados', ssancionadosSchema, 'ssancionados');
          let response;
          delete values.id;
          let esquema = new sancionados(values);
          const result = await esquema.save();
          let objResponse = {};
          objResponse['results'] = result;
          var datausuario = await User.findById(usuario);
          const proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: result._id, sistema: 'S3S' });
          var resp = await proveedorRegistros1.save();
          var bitacora = [];
          bitacora['tipoOperacion'] = 'CREATE';
          bitacora['fechaOperacion'] = moment().format();
          bitacora['usuario'] = usuario;
          bitacora['numeroRegistros'] = 1;
          bitacora['sistema'] = 'S3S';
          registroBitacora(bitacora);
          res.status(200).json({ message: 'Se realizarón las inserciones correctamente', Status: 200, response: response, detail: objResponse });
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log(respuesta);
        res.status(400).json({ message: 'Error in validation openApi', Status: 400, response: respuesta });
      }
    }
  } catch (e) {
    console.log(e);
  }
});

//////////////////////////////////////////////////////////////////////////SHEMA S2///////////////////////////////////////////

app.post('/insertS3PSchema', async (req, res) => {
  try {
    var code = validateToken(req);
    var usuario = req.body.usuario;
    delete req.body.usuario;
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      let values = req.body;

      values['fechaCaptura'] = moment().format();
      values['id'] = 'FAKEID';

      let fileContents = fs.readFileSync(path.resolve(__dirname, '../resource/openapis3p.yaml'), 'utf8');
      let data = yaml.safeLoad(fileContents);
      let schemaResults = data.components.schemas.resParticularesSancionados.properties.results;
      schemaResults.items.properties.particularSancionado.properties.domicilioExtranjero.properties.pais = data.components.schemas.pais;
      schemaResults.items.properties.tipoSancion = data.components.schemas.tipoSancion;
      let schemaS3P = schemaResults;

      let validacion = new swaggerValidator.Handler();
      let respuesta = await validateSchema([values], schemaS3P, validacion);
      //se insertan

      if (respuesta.valid) {
        try {
          let psancionados = S3P.model('Psancionados', psancionadosSchema, 'psancionados');
          let response;
          delete values.id;
          //   console.log(values);
          let esquema = new psancionados(values);
          const result = await esquema.save();
          let objResponse = {};
          objResponse['results'] = result;
          var datausuario = await User.findById(usuario);

          const proveedorRegistros1 = new proveedorRegistros({ proveedorId: datausuario.proveedorDatos, registroSistemaId: result._id, sistema: 'S3P' });
          var resp = await proveedorRegistros1.save();

          var bitacora = [];
          bitacora['tipoOperacion'] = 'CREATE';
          bitacora['fechaOperacion'] = moment().format();
          bitacora['usuario'] = usuario;
          bitacora['numeroRegistros'] = 1;
          bitacora['sistema'] = 'S3P';
          registroBitacora(bitacora);
          res.status(200).json({ message: 'Se realizarón las inserciones correctamente', Status: 200, response: response, detail: objResponse });
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log(respuesta);
        res.status(400).json({ message: 'Error in validation openApi', Status: 400, response: respuesta });
      }
    }
  } catch (e) {
    console.log(e);
  }
});

app.post('/listSchemaS3S', async (req, res) => {
  try {
    var code = validateToken(req);
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      var usuario = await User.findById(req.body.idUser);
      var proveedorDatos = usuario.proveedorDatos;
      var sistema = 'S3S';
      const result = await proveedorRegistros.find({ sistema: sistema, proveedorId: proveedorDatos }).then();
      var arrs3s = [];
      _.map(result, row => {
        arrs3s.push(row.registroSistemaId);
      });

      let sancionados = S3S.model('Ssancionados', ssancionadosSchema, 'ssancionados');
      let sortObj = req.body.sort === undefined ? {} : req.body.sort;
      let page = req.body.page === undefined ? 1 : req.body.page; //numero de pagina a mostrar
      let pageSize = req.body.pageSize === undefined ? 10 : req.body.pageSize;
      let query = req.body.query === undefined ? {} : req.body.query;
      if (!query._id) {
        if (arrs3s.length > 0) {
          query = { ...query, _id: { $in: arrs3s } };
        } else {
          query = { _id: { $in: arrs3s } };
        }
      }

      const paginationResult = await sancionados.paginate(query, { page: page, limit: pageSize, sort: sortObj }).then();
      let objpagination = { hasNextPage: paginationResult.hasNextPage, page: paginationResult.page, pageSize: paginationResult.limit, totalRows: paginationResult.totalDocs };
      let objresults = paginationResult.docs;

      let objResponse = {};
      objResponse['pagination'] = objpagination;
      objResponse['results'] = objresults;

      res.status(200).json(objResponse);
    }
  } catch (e) {
    console.log(e);
  }
});

app.post('/listSchemaS2', async (req, res) => {
  try {
    var code = validateToken(req);
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      var usuario = await User.findById(req.body.idUser);
      var proveedorDatos = usuario.proveedorDatos;
      var sistema = 'S2';

      const result = await proveedorRegistros.find({ sistema: sistema, proveedorId: proveedorDatos }).then();
      var arrs2 = [];
      _.map(result, row => {
        arrs2.push(row.registroSistemaId);
      });

      let Spic = S2.model('Spic', spicSchema, 'spic');
      let sortObj = req.body.sort === undefined ? {} : req.body.sort;
      let page = req.body.page === undefined ? 1 : req.body.page; //numero de pagina a mostrar
      let pageSize = req.body.pageSize === undefined ? 10 : req.body.pageSize;
      let query = req.body.query === undefined ? {} : req.body.query;

      if (!query._id) {
        if (arrs2.length > 0) {
          query = { ...query, _id: { $in: arrs2 } };
        } else {
          query = { _id: { $in: arrs2 } };
        }
      }

      const paginationResult = await Spic.paginate(query, { page: page, limit: pageSize, sort: sortObj }).then();
      let objpagination = { hasNextPage: paginationResult.hasNextPage, page: paginationResult.page, pageSize: paginationResult.limit, totalRows: paginationResult.totalDocs };
      let objresults = paginationResult.docs;

      let objResponse = {};
      objResponse['pagination'] = objpagination;
      objResponse['results'] = objresults;

      res.status(200).json(objResponse);
    }
  } catch (e) {
    console.log(e);
  }
});

app.post('/listSchemaS3P', async (req, res) => {
  try {
    var code = validateToken(req);
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      var usuario = await User.findById(req.body.idUser);
      var proveedorDatos = usuario.proveedorDatos;
      var sistema = 'S3P';
      const result = await proveedorRegistros.find({ sistema: sistema, proveedorId: proveedorDatos }).then();
      var arrs3p = [];
      _.map(result, row => {
        arrs3p.push(row.registroSistemaId);
      });

      let sancionados = S3P.model('Psancionados', psancionadosSchema, 'psancionados');
      let sortObj = req.body.sort === undefined ? {} : req.body.sort;
      let page = req.body.page === undefined ? 1 : req.body.page; //numero de pagina a mostrar
      let pageSize = req.body.pageSize === undefined ? 10 : req.body.pageSize;
      let query = req.body.query === undefined ? {} : req.body.query;

      if (!query._id) {
        if (arrs3p.length > 0) {
          query = { ...query, _id: { $in: arrs3p } };
        } else {
          query = { _id: { $in: arrs3p } };
        }
      }

      const paginationResult = await sancionados.paginate(query, { page: page, limit: pageSize, sort: sortObj }).then();
      let objpagination = { hasNextPage: paginationResult.hasNextPage, page: paginationResult.page, pageSize: paginationResult.limit, totalRows: paginationResult.totalDocs };
      let objresults = paginationResult.docs;

      let objResponse = {};
      objResponse['pagination'] = objpagination;
      objResponse['results'] = objresults;

      res.status(200).json(objResponse);
    }
  } catch (e) {
    console.log(e);
  }
});

app.delete('/deleteRecordS2', async (req, res) => {
  try {
    var code = validateToken(req);
    var bitacora = [];
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      if (req.body.request._id) {
        let Spic = S2.model('Spic', spicSchema, 'spic');
        let deletedRecord;
        let numRecords = 0;
        if (Array.isArray(req.body.request._id)) {
          numRecords = req.body.request._id.length;
          deletedRecord = await Spic.deleteMany({
            _id: {
              $in: req.body.request._id
            }
          })
            .catch(err => res.status(400).json({ message: err.message, code: '400' }))
            .then();
        } else {
          numRecords = 1;
          deletedRecord = await Spic.findByIdAndDelete(req.body.request._id)
            .catch(err => res.status(400).json({ message: err.message, code: '400' }))
            .then();
        }

        bitacora['tipoOperacion'] = 'DELETE';
        bitacora['fechaOperacion'] = moment().format();
        bitacora['usuario'] = req.body.request.usuario;
        bitacora['numeroRegistros'] = numRecords;
        bitacora['sistema'] = 'S2';
        registroBitacora(bitacora);
        res.status(200).json({ message: 'OK', Status: 200, response: deletedRecord, messageFront: 'Se eliminaron ' + numRecords + ' registros correctamente ' });
      } else {
        res.status(500).json({ message: 'Datos incompletos', code: '500' });
      }
    }
  } catch (e) {
    console.log(e);
  }
});

app.delete('/deleteRecordS3S', async (req, res) => {
  try {
    var code = validateToken(req);
    var bitacora = [];
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      if (req.body.request._id) {
        let sancionados = S3S.model('Ssancionados', ssancionadosSchema, 'ssancionados');
        let deletedRecord;
        let numRecords = 0;
        if (Array.isArray(req.body.request._id)) {
          numRecords = req.body.request._id.length;
          deletedRecord = await sancionados
            .deleteMany({
              _id: {
                $in: req.body.request._id
              }
            })
            .catch(err => res.status(400).json({ message: err.message, code: '400' }))
            .then();
        } else {
          numRecords = 1;
          deletedRecord = await sancionados
            .findByIdAndDelete(req.body.request._id)
            .catch(err => res.status(400).json({ message: err.message, code: '400' }))
            .then();
        }

        bitacora['tipoOperacion'] = 'DELETE';
        bitacora['fechaOperacion'] = moment().format();
        bitacora['usuario'] = req.body.request.usuario;
        bitacora['numeroRegistros'] = numRecords;
        bitacora['sistema'] = 'S3S';
        registroBitacora(bitacora);
        res.status(200).json({ message: 'OK', Status: 200, response: deletedRecord, messageFront: 'Se eliminaron ' + numRecords + ' registros correctamente ' });
      } else {
        res.status(500).json({ message: 'Datos incompletos', code: '500' });
      }
    }
  } catch (e) {
    console.log(e);
  }
});

app.delete('/deleteRecordS3P', async (req, res) => {
  try {
    var code = validateToken(req);
    var bitacora = [];
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      if (req.body.request._id) {
        let sancionados = S3P.model('Psancionados', psancionadosSchema, 'psancionados');
        let deletedRecord;
        let numRecords = 0;
        if (Array.isArray(req.body.request._id)) {
          numRecords = req.body.request._id.length;
          deletedRecord = await sancionados
            .deleteMany({
              _id: {
                $in: req.body.request._id
              }
            })
            .catch(err => res.status(400).json({ message: err.message, code: '400' }))
            .then();
        } else {
          numRecords = 1;
          deletedRecord = await sancionados
            .findByIdAndDelete(req.body.request._id)
            .catch(err => res.status(400).json({ message: err.message, code: '400' }))
            .then();
        }

        bitacora['tipoOperacion'] = 'DELETE';
        bitacora['fechaOperacion'] = moment().format();
        bitacora['usuario'] = req.body.request.usuario;
        bitacora['numeroRegistros'] = numRecords;
        bitacora['sistema'] = 'S3P';
        registroBitacora(bitacora);
        res.status(200).json({ message: 'OK', Status: 200, response: deletedRecord, messageFront: 'Se eliminaron ' + numRecords + ' registros correctamente ' });
      } else {
        res.status(500).json({ message: 'Datos incompletos', code: '500' });
      }
    }
  } catch (e) {
    console.log(e);
  }
});

app.post('/updateS3PSchema', async (req, res) => {
  try {
    var code = validateToken(req);
    var usuario = req.body.usuario;
    delete req.body.usuario;
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      let id = req.body._id;
      delete req.body._id;
      let values = req.body;
      values['fechaCaptura'] = moment().format();
      values['id'] = 'FAKEID';

      let fileContents = fs.readFileSync(path.resolve(__dirname, '../resource/openapis3p.yaml'), 'utf8');
      let data = yaml.safeLoad(fileContents);
      let schemaResults = data.components.schemas.resParticularesSancionados.properties.results;
      schemaResults.items.properties.particularSancionado.properties.domicilioExtranjero.properties.pais = data.components.schemas.pais;
      schemaResults.items.properties.tipoSancion = data.components.schemas.tipoSancion;
      let schemaS3P = schemaResults;

      let validacion = new swaggerValidator.Handler();
      let respuesta = await validateSchema([values], schemaS3P, validacion);
      //se insertan

      if (respuesta.valid) {
        try {
          values['_id'] = id;
          let psancionados = S3P.model('Psancionados', psancionadosSchema, 'psancionados');
          let esquema = new psancionados(values);
          let response;
          if (values._id) {
            await psancionados.findByIdAndDelete(values._id);
            response = await psancionados
              .findByIdAndUpdate(values._id, esquema, {
                upsert: true,
                new: true
              })
              .exec();
            let objResponse = {};
            objResponse['results'] = response;
            var bitacora = [];
            bitacora['tipoOperacion'] = 'UPDATE';
            bitacora['fechaOperacion'] = moment().format();
            bitacora['usuario'] = usuario;
            bitacora['numeroRegistros'] = 1;
            bitacora['sistema'] = 'S3P';
            registroBitacora(bitacora);
            res.status(200).json(response);
          } else {
            res.status(500).json({ message: 'Error : Datos incompletos', Status: 500 });
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log(respuesta);
        res.status(400).json({ message: 'Error in validation openApi', Status: 400, response: respuesta });
      }
    }
  } catch (e) {
    console.log(e);
  }
});

app.post('/updateS3SSchema', async (req, res) => {
  try {
    var code = validateToken(req);
    var usuario = req.body.usuario;
    delete req.body.usuario;
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      let id = req.body._id;
      delete req.body._id;
      let values = req.body;
      values['fechaCaptura'] = moment().format();
      values['id'] = 'FAKEID';

      let fileContents = fs.readFileSync(path.resolve(__dirname, '../resource/openapis3s.yaml'), 'utf8');
      let data = yaml.safeLoad(fileContents);
      let schemaResults = data.components.schemas.ssancionados.properties.results;
      schemaResults.items.properties.tipoFalta = data.components.schemas.tipoFalta;
      schemaResults.items.properties.tipoSancion = data.components.schemas.tipoSancion;

      let schemaS3S = schemaResults;
      let validacion = new swaggerValidator.Handler();
      let respuesta = await validateSchema([values], schemaS3S, validacion);
      //se insertan

      if (respuesta.valid) {
        try {
          values['_id'] = id;
          let sancionados = S3S.model('Ssancionados', ssancionadosSchema, 'ssancionados');
          let esquema = new sancionados(values);
          let response;
          if (values._id) {
            await sancionados.findByIdAndDelete(values._id);
            response = await sancionados
              .findByIdAndUpdate(values._id, esquema, {
                upsert: true,
                new: true
              })
              .exec();
            let objResponse = {};
            objResponse['results'] = response;
            var bitacora = [];
            bitacora['tipoOperacion'] = 'UPDATE';
            bitacora['fechaOperacion'] = moment().format();
            bitacora['usuario'] = usuario;
            bitacora['numeroRegistros'] = 1;
            bitacora['sistema'] = 'S3S';
            registroBitacora(bitacora);
            res.status(200).json(response);
          } else {
            res.status(500).json({ message: 'Error : Datos incompletos', Status: 500 });
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log(respuesta);
        res.status(400).json({ message: 'Error in validation openApi', Status: 400, response: respuesta });
      }
    }
  } catch (e) {
    console.log(e);
  }
});

app.post('/updateS2Schema', async (req, res) => {
  try {
    var code = validateToken(req);
    if (code.code == 401) {
      res.status(401).json({ code: '401', validateSchmessage: code.message });
    } else if (code.code == 200) {
      let docSend = {};
      let values = req.body;
      try {
        await esquemaS2.validate(values);
      } catch (e) {
        let errorMessage = {};
        errorMessage['errores'] = e.errors;
        errorMessage['campo'] = e.path;
        errorMessage['tipoError'] = e.type;
        errorMessage['mensaje'] = e.message;
        res.status(400).json(errorMessage);
      }

      docSend['id'] = values._id;
      docSend['fechaCaptura'] = moment().format();

      if (values.rfc) {
        docSend['rfc'] = values.rfc;
      }
      if (values.curp) {
        docSend['curp'] = values.curp;
      }
      if (values.ejercicioFiscal) {
        docSend['ejercicioFiscal'] = values.ejercicioFiscal;
      }
      if (values.ramo) {
        let ramoObj = JSON.parse(values.ramo);
        docSend['ramo'] = { clave: parseInt(ramoObj.clave), valor: ramoObj.valor };
      }
      if (values.nombres) {
        docSend['nombres'] = values.nombres;
      }
      if (values.primerApellido) {
        docSend['primerApellido'] = values.primerApellido;
      }
      if (values.segundoApellido) {
        docSend['segundoApellido'] = values.segundoApellido;
      }
      if (values.genero) {
        docSend['genero'] = JSON.parse(values.genero);
      }

      let ObjInstitucionDepe = {};
      if (values.idnombre) {
        ObjInstitucionDepe = { ...ObjInstitucionDepe, nombre: values.idnombre };
      }
      if (values.idclave) {
        ObjInstitucionDepe = { ...ObjInstitucionDepe, clave: values.idclave };
      }
      if (values.idsiglas) {
        ObjInstitucionDepe = { ...ObjInstitucionDepe, siglas: values.idsiglas };
      }
      docSend['institucionDependencia'] = ObjInstitucionDepe;

      let objPuesto = {};
      if (values.puestoNombre) {
        objPuesto = { ...objPuesto, nombre: values.puestoNombre };
      }
      if (values.puestoNivel) {
        objPuesto = { ...objPuesto, nivel: values.puestoNivel };
      }
      docSend['puesto'] = objPuesto;

      if (values.tipoArea && values.tipoArea.length > 0) {
        docSend['tipoArea'] = JSON.parse('[' + values.tipoArea + ']');
      }
      if (values.tipoProcedimiento && values.tipoProcedimiento.length > 0) {
        let ObjTipoProcedimiento = JSON.parse('[' + values.tipoProcedimiento + ']');
        docSend['tipoProcedimiento'] = getArrayFormatTipoProcedimiento(ObjTipoProcedimiento);
      }
      if (values.nivelResponsabilidad && values.nivelResponsabilidad.length > 0) {
        docSend['nivelResponsabilidad'] = JSON.parse('[' + values.nivelResponsabilidad + ']');
      }

      let objSuperiorInmediato = {};
      if (values.siRfc) {
        objSuperiorInmediato = { ...objSuperiorInmediato, rfc: values.siRfc };
      }
      if (values.siCurp) {
        objSuperiorInmediato = { ...objSuperiorInmediato, curp: values.siCurp };
      }
      if (values.sinombres) {
        objSuperiorInmediato = { ...objSuperiorInmediato, nombres: values.sinombres };
      }
      if (values.siPrimerApellido) {
        objSuperiorInmediato = { ...objSuperiorInmediato, primerApellido: values.siPrimerApellido };
      }
      if (values.siSegundoApellido) {
        objSuperiorInmediato = { ...objSuperiorInmediato, segundoApellido: values.siSegundoApellido };
      }
      let puestoObj = {};
      if (values.siPuestoNombre) {
        puestoObj = { ...puestoObj, nombre: values.siPuestoNombre };
      }
      if (values.siPuestoNivel) {
        puestoObj = { ...puestoObj, nivel: values.siPuestoNivel };
      }
      if (values.siPuestoNombre || values.siPuestoNivel) {
        objSuperiorInmediato = { ...objSuperiorInmediato, puesto: puestoObj };
      }

      docSend['superiorInmediato'] = objSuperiorInmediato;

      if (values.observaciones) {
        docSend['observaciones'] = values.observaciones;
      }
      //console.log("ya paso la validacion  "+ JSON.stringify(docSend));

      let fileContents = fs.readFileSync(path.resolve(__dirname, '../resource/openapis2.yaml'), 'utf8');
      let data = yaml.safeLoad(fileContents);
      let schemaS2 = data.components.schemas.respSpic;
      let validacion = new swaggerValidator.Handler();
      let newdocument = docSend;
      let respuesta = await validateSchema([newdocument], schemaS2, validacion);
      if (respuesta.valid) {
        try {
          docSend['_id'] = values._id;
          let Spic = S2.model('Spic', spicSchema, 'spic');
          let esquema = new Spic(docSend);
          let response;
          if (req.body._id) {
            await Spic.findByIdAndDelete(values._id);
            response = await Spic.findByIdAndUpdate(values._id, esquema, { upsert: true, new: true }).exec();
            var bitacora = [];
            bitacora['tipoOperacion'] = 'UPDATE';
            bitacora['fechaOperacion'] = moment().format();
            bitacora['usuario'] = req.body.usuario;
            bitacora['numeroRegistros'] = 1;
            bitacora['sistema'] = 'S2';
            registroBitacora(bitacora);
            res.status(200).json(response);
          } else {
            res.status(500).json({ message: 'Error : Datos incompletos', Status: 500 });
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log(respuesta);
        res.status(400).json({ message: 'Error in validation openApi', Status: 400, response: respuesta });
      }
    }
  } catch (e) {
    console.log(e);
  }
});

app.post('/getBitacora', async (req, res) => {
  try {
    function horaActual(horaAct) {
      var zona = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
      var hora = new Date(horaAct - zona).toISOString().slice(0, -5);
      return hora;
    }

    function toIsoString(date) {
      var tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function (num) {
          var norm = Math.floor(Math.abs(num));
          return (norm < 10 ? '0' : '') + norm;
        };

      return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + dif + pad(tzo / 60) + ':' + pad(tzo % 60);
    }

    var fechaInicial = new Date(req.body.fechaInicial);
    fechaInicial = toIsoString(fechaInicial);

    var fechaFinal = new Date(req.body.fechaFinal);
    fechaFinal = toIsoString(fechaFinal);

    let objResponse = {};
    let strippedRows;

    if (fechaInicial == '' || fechaFinal == '') {
      res.status(500).json({ message: 'Error : Datos incompletos', Status: 500 });
    }

    var code = validateToken(req);
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      let sortObj = req.body.sort === undefined ? {} : req.body.sort;
      let page = req.body.page === undefined ? 1 : req.body.page; //numero de pagina a mostrar
      let pageSize = req.body.pageSize === undefined ? 10 : req.body.pageSize;
      let query = req.body.query === undefined ? {} : req.body.query;

      if (typeof req.body.sistema != 'undefined' && typeof req.body.usuarioBitacora != 'undefined') {
        var paginationResult = await Bitacora.aggregate([
          {
            $lookup: {
              from: 'usuarios',
              localField: 'usuario',
              foreignField: '_id',
              as: 'Data'
            }
          },
          {
            $match: {
              fechaOperacion: { $gte: fechaInicial, $lte: fechaFinal },
              sistema: { $in: req.body.sistema }
            }
          }
        ]);

        var us = await User.findById(req.body.usuarioBitacora);
        var arrusuarios = [];
        _.map(paginationResult, function (item) {
          if (item.usuario == req.body.usuarioBitacora) {
            arrusuarios.push({ tipoOperacion: item.tipoOperacion, fechaOperacion: item.fechaOperacion, sistema: item.sistema, numeroRegistros: item.numeroRegistros, idUsuario: item.usuario, Data: [{ usuario: us.usuario }] });
          }
        });
        paginationResult = arrusuarios;
      } else if (typeof req.body.sistema != 'undefined') {
        var paginationResult = await Bitacora.aggregate([
          {
            $lookup: {
              from: 'usuarios',
              localField: 'usuario',
              foreignField: '_id',
              as: 'Data'
            }
          },
          {
            $match: {
              fechaOperacion: { $gte: fechaInicial, $lte: fechaFinal },
              sistema: { $in: req.body.sistema }
            }
          }
        ]);
      } else if (typeof req.body.usuarioBitacora != 'undefined') {
        var paginationResult = await Bitacora.find({ fechaOperacion: { $gte: fechaInicial, $lte: fechaFinal } });
        var us = await User.findById(req.body.usuarioBitacora);
        var arrusuarios = [];
        _.map(paginationResult, function (item) {
          if (item.usuario == req.body.usuarioBitacora) {
            arrusuarios.push({ tipoOperacion: item.tipoOperacion, fechaOperacion: item.fechaOperacion, sistema: item.sistema, numeroRegistros: item.numeroRegistros, idUsuario: item.usuario, Data: [{ usuario: us.usuario }] });
          }
        });
        paginationResult = arrusuarios;
      } else {
        var paginationResult = await Bitacora.aggregate([
          {
            $lookup: {
              from: 'usuarios',
              localField: 'usuario',
              foreignField: '_id',
              as: 'Data'
            }
          },
          {
            $match: { fechaOperacion: { $gte: fechaInicial, $lte: fechaFinal } }
          }
        ]);
      }

      formato(paginationResult);

      function formato(paginationResult) {
        moment.locale('es');
        strippedRows = _.map(paginationResult, function (row) {
          var fecha = moment(row.fechaOperacion).tz('America/Mexico_City').format('LLLL');
          var sistema = row.sistema;
          var sistema_label = '';
          var tipoOperacion = row.tipoOperacion;
          var tipo = '';

          if (sistema == 'S2') {
            sistema_label = 'Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación.';
          }
          if (sistema == 'S3S') {
            sistema_label = 'Sistema de los Servidores Públicos Sancionados.';
          }
          if (sistema == 'S3P') {
            sistema_label = 'Sistema de los Particulares Sancionados.';
          }
          if (tipoOperacion == 'CREATE') {
            tipo = 'Alta';
          }
          if (tipoOperacion == 'DELETE') {
            tipo = 'Eliminación';
          }
          if (tipoOperacion == 'UPDATE') {
            tipo = 'Actualización';
          }
          if (tipoOperacion == 'READ') {
            tipo = 'Consulta';
          }

          var nombre_usuario = '';
          _.map(row.Data, function (item) {
            nombre_usuario = item.usuario;
          });

          let rowExtend = _.extend({ fecha: fecha, tipo: tipo, sistema_label: sistema_label, numeroRegistros: row.numeroRegistros, nombre: nombre_usuario });
          return rowExtend;
        });

        paginationResult['resultado'] = strippedRows;
      }

      let objpagination = { hasNextPage: paginationResult.hasNextPage, page: paginationResult.page, pageSize: paginationResult.limit, totalRows: paginationResult.totalDocs };
      let objresults = paginationResult;
      let objResponse = {};
      //objResponse["pagination"] = objpagination;
      objResponse['results'] = paginationResult['resultado'];

      res.status(200).json(objResponse);
    }
  } catch (e) {
    console.log(e);
  }
});





app.post('/prueba', async (req, res) => {
  try {
    var code = validateToken(req);
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
      res.status(200).json({ message: 'prueba con resultado correcto para el s3 y el s2.', Status: 200 });
      console.log("prueba ejecutada correctamente desde server_nousado.js")
    }
  } catch (e) {
    console.log(e);
  }
}
);

app.post('/insertar-ejemplo', async (req, res) => {
  try {
    const nuevoS2RegistroInd = new nuevoS2Registro(req.body);
    let responce;
    responce = await nuevoS2RegistroInd.save();
    res.status(200).json(responce);
    //res.status(200).json({ message: 'prueba con resultado correcto funcionando.', Status: 200});
    //res.status(200).json({ message: 'prueba con resultado correcto para insertar.', data1: req.entePublico, Status: 200});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al insertar el documento' });
  }
});

app.post('/consultar-ejemplo', async (req, res) => {
  try {
    //leer el json que se encuentra en .datos_prueba.json

    nuevoS2Registro.find({}).exec((err, data) => {
      if (err) {
        res.status(500).json({ message: 'Error al consultar el documento' });
      }
      //res.status(200).json({ message: 'prueba con resultado correcto para consultar.', data1: data, Status: 200});
      res.send(data); //envia el json a la pagina web

    });
    //const{ id, fechaCaptura, ejercicio, nombres, primerApellido, segundoApellido, curp, rfc, sexo, entePublico, entidad} = req.body;
    //res.json(req.body);
    //res.status(200).json({ message: 'prueba con resultado correcto funcionando.', Status: 200});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al consultar el documento' });
  }
});


app.post('/usuariosNuevosS2', (req, res) => {
  const nuevoUsuario = req.body; // Objeto JSON recibido en la solicitud

  // Crea una nueva instancia del modelo con los datos recibidos
  const newS2 = new newusuarios(nuevoUsuario);

  // Guarda el usuario en la base de datos
  newS2.save()
    .then(() => {
      res.status(201).json({ message: 'Usuario guardado exitosamente' });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

/* app.post('/updatezS2v2/:id', async (req, res) => {
  try {
    //const token = req.headers.authorization;
    //var code = validateToken(req);
    let code = validateToken(req);
    if (code.code == 401) {
      res.status(401).json({ code: '401', message: code.message });
    } else if (code.code == 200) {
    ///// Se obtiene el id del usuario que esta realizando la peticion
    const id = req.params.id.toString();
    delete req.params.id;
    let newdocument = req.body;
    //delete newdocument.id;
    // let newdocument = convertLevels(req.body);
    // console.log(newdocument['fechaCaptura']);
    let fecha = moment().tz("America/Mexico_City").format();
    //newdocument['fechaCaptura'] = fecha;
    newdocument['fechaActualizacion'] = fecha;
    ///// Se instancia el modelo de la coleccion de spic
    let Spic = S2.model('Spic', nuevoS2Schema, 'spic');      
    let esquema = new Spic(newdocument);

    // await Spic.findByIdAndDelete(values._id);
    response = await Spic.findByIdAndUpdate(id, esquema, { upsert: true, new: true }).exec();

    res.status(200).json({ code: '200', message: 'Actualizando desde s2v2', id, newdocument });
    }
  } catch (e) {
    console.log(e);
  }
}); */
 