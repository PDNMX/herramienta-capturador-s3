/* SANCIONES (INHABILITACIONES) POR NORMAS DIVERSAS A LA LGRA - PERSONAS FISICAS */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const s3pfgSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

s3pfgSchema.plugin(mongoosePaginate);
const s3pfgConnection = mongoose.connection.useDb("administracionUsuarios");
const S3pfg = mongoose.connection.useDb('S3').model("particulares_fisicas_faltas_graves", s3pfgSchema, "particulares_fisicas_faltas_graves");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {s3pfgConnection, S3pfg}; 