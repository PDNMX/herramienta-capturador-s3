const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const s3hcfSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

s3hcfSchema.plugin(mongoosePaginate);
const S3hcfConnection = mongoose.connection.useDb("administracionUsuarios");
const S3hcf = mongoose.connection.useDb('S3').model("s3hcf", s3hcfSchema, "s3hcf");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {S3hcfConnection, S3hcf}; 