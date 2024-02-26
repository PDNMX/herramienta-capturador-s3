const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const s3ngSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

s3ngSchema.plugin(mongoosePaginate);
const S3ngConnection = mongoose.connection.useDb("administracionUsuarios");
const S3ng = mongoose.connection.useDb('S3').model("s3ng", s3ngSchema, "s3ng");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {S3ngConnection, S3ng}; 