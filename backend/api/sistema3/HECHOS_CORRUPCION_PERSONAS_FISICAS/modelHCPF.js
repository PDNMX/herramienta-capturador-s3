/* HECHOS DE CORRUPCION - PERSONAS FISICAS  */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const S3hcpfSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

S3hcpfSchema.plugin(mongoosePaginate);
const s3hcpfConnection = mongoose.connection.useDb("administracionUsuarios");
const S3hcpf = mongoose.connection.useDb('S3').model("hechos_corrupcion_personas_fisicas", S3hcpfSchema, "hechos_corrupcion_personas_fisicas");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {s3hcpfConnection, S3hcpf}; 