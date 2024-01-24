const { Schema, model } = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const nuevoS3GraveSchema = new Schema({
    expediente: { type: String },
    //grave: { type:  Schema.Types.Mixed },
    grave:{
        nombres: { type: String },
        primerApellido: { type: String },
        segundoApellido: { type: String },
        curp: { type: String },
        rfc: { type: String },
        sexo: { type: String },
        entePublico: { type: Schema.Types.Mixed },
        empleoCargoComision: { type: Schema.Types.Mixed },
        origenInvestigacion: { type: Schema.Types.Mixed },
        faltaCometida: [{ type: Schema.Types.Mixed }],
        resolucion: { type: Schema.Types.Mixed },
        tipoSancion: { type: Schema.Types.Mixed },
        observaciones: { type: String },
    }
});

nuevoS3GraveSchema.plugin(mongoosePaginate);
module.exports = { nuevoS3GraveSchema };