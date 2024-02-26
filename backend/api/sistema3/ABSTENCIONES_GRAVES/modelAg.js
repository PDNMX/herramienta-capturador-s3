const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const s3agSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

s3agSchema.plugin(mongoosePaginate);
const s3agConnection = mongoose.connection.useDb("administracionUsuarios");
const S3ag = mongoose.connection.useDb('S3').model("abstenciones_graves", s3agSchema, "abstenciones_graves");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {s3agConnection, S3ag}; 