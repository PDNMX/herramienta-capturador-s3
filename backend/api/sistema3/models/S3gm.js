const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const s3gmSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

s3gmSchema.plugin(mongoosePaginate);
const S3gmConnection = mongoose.connection.useDb("administracionUsuarios");
const S3gm = mongoose.connection.useDb('S3').model("s3gm", s3gmSchema, "s3gm");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {S3gmConnection, S3gm}; 