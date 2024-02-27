const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const s3angSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

s3angSchema.plugin(mongoosePaginate);
const s3angConnection = mongoose.connection.useDb("administracionUsuarios");
const S3ang = mongoose.connection.useDb('S3').model("abstenciones_no_graves", s3angSchema, "abstenciones_no_graves");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {s3angConnection, S3ang}; 