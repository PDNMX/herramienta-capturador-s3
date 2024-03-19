/* FALTAS ADMINISTRATIVAS DE SERVIDORES PUBLICOS - GRAVES */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const s3sfgSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

const s3sfgSchemaMeta = new mongoose.Schema({
     metadata: mongoose.Mixed,
     data: mongoose.Mixed
}, { "strict": false });


s3sfgSchemaMeta.plugin(mongoosePaginate);
const s3sfgConnection = mongoose.connection.useDb("administracionUsuarios");
const S3sfg = mongoose.connection.useDb('S3').model("servidores_faltas_graves", s3sfgSchema, "servidores_faltas_graves");
const S3sfgMeta = mongoose.connection.useDb('S3').model("servidores_faltas_graves_meta", s3sfgSchemaMeta, "servidores_faltas_graves_meta");
module.exports = {s3sfgConnection, S3sfg, S3sfgMeta}; 