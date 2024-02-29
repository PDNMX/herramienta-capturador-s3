/* FALTAS ADMINISTRATIVAS DE SERVIDORES PUBLICOS - GRAVES */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const s3sfngSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

s3sfngSchema.plugin(mongoosePaginate);
const s3sfngConnection = mongoose.connection.useDb("administracionUsuarios");
const S3sfng = mongoose.connection.useDb('S3').model("servidores_faltas_no_graves", s3sfngSchema, "servidores_faltas_no_graves");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {s3sfngConnection, S3sfng}; 