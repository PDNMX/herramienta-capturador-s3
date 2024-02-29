/* HECHOS DE CORRUPCION - SERVIDORES PUBLICOS */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const S3hcspSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

S3hcspSchema.plugin(mongoosePaginate);
const s3hcpfConnection = mongoose.connection.useDb("administracionUsuarios");
const S3hcsp = mongoose.connection.useDb('S3').model("hechos_corrupcion_servidores_publicos", S3hcspSchema, "hechos_corrupcion_servidores_publicos");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {s3hcpfConnection, S3hcsp}; 