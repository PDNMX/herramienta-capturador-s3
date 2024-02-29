/* SANCIONES (INHABILITACIONES) POR NORMAS DIVERSAS A LA LGRA - PERSONAS FISICAS */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const s3fSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

s3fSchema.plugin(mongoosePaginate);
const s3fConnection = mongoose.connection.useDb("administracionUsuarios");
const S3f = mongoose.connection.useDb('S3').model("inhabilitaciones_personas_fisicas", s3fSchema, "inhabilitaciones_personas_fisicas");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {s3fConnection, S3f}; 