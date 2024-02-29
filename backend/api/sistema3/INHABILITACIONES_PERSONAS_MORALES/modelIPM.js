/* SANCIONES (INHABILITACIONES) POR NORMAS DIVERSAS A LA LGRA - PERSONAS MORALES */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const s3ipmSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

s3ipmSchema.plugin(mongoosePaginate);
const s3ipmConnection = mongoose.connection.useDb("administracionUsuarios");
const S3ipm = mongoose.connection.useDb('S3').model("inhabilitaciones_personas_morales", s3ipmSchema, "inhabilitaciones_personas_morales");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {s3ipmConnection, S3ipm}; 