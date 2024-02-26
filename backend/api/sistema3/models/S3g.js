const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const s3gSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

s3gSchema.plugin(mongoosePaginate);
const S3gConnection = mongoose.connection.useDb("administracionUsuarios");
const S3g = mongoose.connection.useDb('S3').model("s3g", s3gSchema, "s3g");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {S3gConnection, S3g}; 