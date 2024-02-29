/* ACTOS DE PARTICULARES VINCULADOS CON FALTAS GRAVES - PERSONAS MORALES */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const s3pmfgSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

s3pmfgSchema.plugin(mongoosePaginate);
const S3pmfgConnection = mongoose.connection.useDb("administracionUsuarios");
const S3pmfg = mongoose.connection.useDb('S3').model("particulares_morales_faltas_graves", s3pmfgSchema, "particulares_morales_faltas_graves");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag")
module.exports = {S3pmfgConnection, S3pmfg}; 