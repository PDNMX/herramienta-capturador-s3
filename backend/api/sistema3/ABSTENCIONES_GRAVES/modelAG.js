const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const s3agSchema = new mongoose.Schema({
  id: String,
  expediente: { type: String, require: true },
  absGrave: {
    nombres: { type: String, require: true },
    primerApellido: { type: String, require: true },
    segundoApellido: { type: String, require: true },
    curp: { type: String, require: true },
    rfc: { type: String, require: true },
    sexo: { type: String, enum: ["FEMENINO", "MASCULINO"], require: true },
    entePublico: {
      entidadFederativa: {
        type: [],
        default: void 0,
      },
      nivelOrdenGobierno: {
        type: [],
        default: void 0,
      },
      ambitoPublico: {
        type: String,
        enum: ["EJECUTIVO", "LEGISLATIVO", "JUDICIAL", "ORGANO_AUTONOMO"],
        require: true,
      },
      nombre: String,
      siglas: String,
    },
    empleoCargoComision: {
      clave: {
        type: String,
        enum: [
          "OPERATIVO_U_HOMOLOGO",
          "ENLACE_U_HOMOLOGO",
          "JEFATURA_DE_DEPARTAMENTO_U_HOMOLOGO",
          "SUBDIRECCION_DE_AREA_U_HOMOLOGO",
          "DIRECCION_DE_AREA_U_HOMOLOGO",
          "DIRECCION_GENERAL_U_HOMOLOGO",
          "JEFATURA_DE_UNIDAD_U_HOMOLOGO",
          "SUBSECRETARIA_DE_ESTADO_OFICIALIA_MAYOR_U_HOMOLOGO",
          "SECRETARIA_DE_ESTADO_U_HOMOLOGO",
          "OTRO",
        ],
        require: true,
      },
      nivel: String,
      areaAdscripcion: String,
    },
    origenInvestigacion: {
      clave: {
        type: String,
        enum: [
          "AUDITORIA_SUPERIOR",
          "AUDITORIA_OIC",
          "DENUNCIA_SP",
          "OFICIO",
          "OTRO",
        ],
        require: true,
      },
    },
    faltaCometida:{type:[String], require: true },
    
  },
});

s3agSchema.plugin(mongoosePaginate);
const s3agConnection = mongoose.connection.useDb("administracionUsuarios");
const S3ag = mongoose.connection.useDb("S3").model("abstenciones_graves", s3agSchema, "abstenciones_graves");
//const s3ag = mongoose.model("s3ag", s3agSchema, "s3ag");

module.exports = { s3agConnection, S3ag };
