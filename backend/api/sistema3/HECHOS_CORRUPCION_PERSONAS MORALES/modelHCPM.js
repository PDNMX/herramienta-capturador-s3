/* HECHOS DE CORRUPCION - PERSONAS FISICAS  */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const S3hcpmSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

S3hcpmSchema.plugin(mongoosePaginate);
const s3hcpmConnection = mongoose.connection.useDb("administracionUsuarios");
const S3hcpm = mongoose.connection.useDb('S3').model("hechos_corrupcion_personas_morales", S3hcpmSchema, "hechos_corrupcion_personas_morales");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {s3hcpmConnection, S3hcpm}; 