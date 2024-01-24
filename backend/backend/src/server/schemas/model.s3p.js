const { Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

let psancionadosSchema = new Schema({
  particularSancionado: {
    domicilioMexico: {
      pais: {
        valor: String,
        clave: String
      },
      entidadFederativa: {
        valor: String,
        clave: String
      },
      municipio: {
        valor: String,
        clave: String
      },
      localidad: {
        valor: String,
        clave: String
      },
      vialidad: {
        valor: String,
        clave: String
      },
      codigoPostal: String,
      numeroExterior: String,
      numeroInterior: String
    },
    domicilioExtranjero: {
      pais: {
        valor: String,
        clave: String
      },
      calle: String,
      ciudadLocalidad: String,
      estadoProvincia: String,
      codigoPostal: String,
      numeroExterior: String,
      numeroInterior: String
    },
    nombreRazonSocial: String,
    objetoSocial: String,
    rfc: String,
    tipoPersona: String,
    telefono: String,
    directorGeneral: {
      nombres: String,
      primerApellido: String,
      segundoApellido: String,
      curp: String
    },
    apoderadoLegal: {
      nombres: String,
      primerApellido: String,
      segundoApellido: String,
      curp: String
    }
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
  fechaCaptura: String,
  expediente: String,
  institucionDependencia: {
    nombre: String,
    clave: String,
    siglas: String
  },
  objetoContrato: String,
  autoridadSancionadora: String,
  tipoFalta: String,
  tipoSancion: { type: [], default: void 0 },
  causaMotivoHechos: String,
  acto: String,
  responsableSancion: {
    nombres: String,
    primerApellido: String,
    segundoApellido: String,
    curp: String
  },
  resolucion: {
    sentido: String,
    url: String,
    fechaNotificacion: String
  },
  documentos: { type: [], default: void 0 },
  observaciones: String
});

psancionadosSchema.plugin(mongoosePaginate);

module.exports = {
  psancionadosSchema
};
