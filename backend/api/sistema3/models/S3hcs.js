const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const s3hcsSchema = new mongoose.Schema({
     meta: mongoose.Mixed,

}, { "strict": false });

s3hcsSchema.plugin(mongoosePaginate);
const S3hcsConnection = mongoose.connection.useDb("administracionUsuarios");
const S3hcs = mongoose.connection.useDb('S3').model("s3hcs", s3hcsSchema, "s3hcs");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = {S3hcsConnection, S3hcs}; 