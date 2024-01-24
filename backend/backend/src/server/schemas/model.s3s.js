const { Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

let ssancionadosSchema = new Schema({
  fechaCaptura: String,
  expediente: String,
  institucionDependencia: {
    nombre: String,
    clave: String,
    siglas: String
  },
  servidorPublicoSancionado: {
    rfc: String,
    curp: String,
    nombres: String,
    primerApellido: String,
    segundoApellido: String,
    genero: {
      clave: String,
      valor: String
    },
    puesto: String,
    nivel: String
  },
  autoridadSancionadora: String,
  tipoFalta: {
    clave: String,
    valor: String,
    descripcion: String
  },
  tipoSancion: { type: [], default: void 0 },
  causaMotivoHechos: String,
  resolucion: {
    url: String,
    fechaResolucion: String
  },
  multa: {
    monto: Number,
    moneda: {
      clave: String,
      valor: String
    }
  },
  inhabilitacion: {
    plazo: String,
    fechaInicial: String,
    fechaFinal: String
  },
  documentos: { type: [], default: void 0 },
  observaciones: String
});

ssancionadosSchema.plugin(mongoosePaginate);

module.exports = {
  ssancionadosSchema
};
