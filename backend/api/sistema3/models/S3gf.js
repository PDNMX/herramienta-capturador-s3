const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const s3gfSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

s3gfSchema.plugin(mongoosePaginate);
const S3gfConnection = mongoose.connection.useDb("administracionUsuarios");
const S3gf = mongoose.connection.useDb('S3').model("s3gf", s3gfSchema, "s3gf");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {S3gfConnection, S3gf}; 