/* Importamos la bibliotecas necesaras para el api del capturador */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const yaml = require('js-yaml');
const fs = require('fs');
const swaggerValidator = require('swagger-object-validator');
const _ = require('underscore');

const joi = require('joi');
//// Biblioteca yup a consideracion para validaciones
const Yup = require('yup');
const User = require('./schemas/model.user.js');
const { Validator } = require('jsonschema');
//// Bibliotecas para la nueva version
const { SMTPClient } = require('emailjs');
//// Se importan los esquemas de la base de datos mongodb
//// Old
const Catalog = require('./schemas/model.catalog.js');
const Bitacora = require('./schemas/model.bitacora.js');
const proveedorRegistros = require('./schemas/model.proveedorRegistros.js');
const Provider = require('./schemas/model.proovedor.js');

const { ObjectId } = require('mongodb');

//// Schemas definidos para el capturador del s3v2
const { s3SancionadosSchemaV2 } = require('./schemas/S3V2/S3S/model.new.joyS3Servidores.js');
const { p3SancionadosSchemaV2 } = require('./schemas/S3V2/S3P/model.new.S3P.js');
const { s3ServidoreschemaGraves, s3ServidoreschemaNoGraves } = require('./schemas/S3V2/S3S/model.new.S3S.js'); 
//// Esquemas definidos v1
const { esquemaS2, schemaUserCreate, schemaUser, schemaProvider } = require('./schemas/yup.esquemas.js');


//// Importando los endpoints del S3
const endpoints = require('./S3/endpoints/endpointsS3.js');

 /* 
    Separando los archivos con los endpoint de los sistemas
*/

/////////*************************** S3 ************************************************************************* */


/* 
    Esquemas del capturador del s3v2 con los once formatos
*/

const { nuevoS3GraveSchema } = require('./schemas/S3OnceFormatos/model.scheme.S3.Grave.js');

/* 
Bibliotecas necesarias para utilizar jsonscheme para generar el modelo de mongoose
*/

//const esquema = require('./schemas/esquema.json');

/* Validaciones de las constiables de entorno referentes al email  */
if (typeof process.env.EMAIL === 'undefined') {
    console.log('no existe el valor de EMAIL en las constiables de entorno');
    process.exit(1);
  }
  
  if (typeof process.env.PASS_EMAIL === 'undefined') {
    console.log('no existe el valor de PASS_EMAIL en las constiables de entorno');
    process.exit(1);
  }
  
  if (typeof process.env.HOST_EMAIL === 'undefined') {
    console.log('no existe el valor de HOST_EMAIL en las constiables de entorno');
    process.exit(1);
  }

  /* Conexiones a la base de datos de mongodb */
  const db = mongoose
  .connect('mongodb://' + process.env.USERMONGO + ':' + process.env.PASSWORDMONGO + '@' + process.env.HOSTMONGO + '/' + process.env.DATABASE+ '?authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('Connect to MongoDB.'))
  .catch(err => console.error('Could not connect to MongoDB.', err));
mongoose.set('useFindAndModify', false);

//// Se configuran las conexiones las distinas bases de datos
let S2 = mongoose.connection.useDb('S2');

//// Se configuran las conexiones las distinas bases de datos
let S3 = mongoose.connection.useDb('S3');

//// Puerto por el que se escucha el api del capturador
let port = process.env.PORT || 3004;
let app = express();
app.use(cors(), bodyParser.urlencoded({ extended: true }), bodyParser.json());

//// Se levanta el servidor de express
let server = app.listen(port, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log(' function cloud Server is listening at http://%s:%s', host, port);
  });


  /* 
  En este bloque se llaman los endpoints del S3 
*/

app.post("/prueba", endpoints.prueba);

