/* FALTAS ADMINISTRATIVAS DE SERVIDORES PUBLICOS - GRAVES */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const s3sfgSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

s3sfgSchema.plugin(mongoosePaginate);
const s3sfgConnection = mongoose.connection.useDb("administracionUsuarios");
const S3sfg = mongoose.connection.useDb('S3').model("servidores_faltas_graves", s3sfgSchema, "servidores_faltas_graves");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {s3sfgConnection, S3sfg}; 