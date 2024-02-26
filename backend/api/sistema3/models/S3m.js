const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const s3mSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

s3mSchema.plugin(mongoosePaginate);
const S3mConnection = mongoose.connection.useDb("administracionUsuarios");
const S3m = mongoose.connection.useDb('S3').model("s3m", s3mSchema, "s3m");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {S3mConnection, S3m}; 