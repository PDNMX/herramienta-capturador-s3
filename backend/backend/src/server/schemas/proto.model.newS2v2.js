const mongoose = require("mongoose");

const PersonaServidorPublicoSchema = new mongoose.Schema({
  ejercicio: {
    type: Number,
    required: true,
  },
  nombres: {
    type: String,
    required: true,
  },
  primerApellido: {
    type: String,
    required: true,
  },
  segundoApellido: {
    type: String,
  },
  curp: {
    type: String,
    required: true,
  },
  rfc: {
    type: String,
    required: true,
  },
  sexo: {
    type: String,
    enum: ["FEMENINO", "MASCULINO"],
    required: true,
  },
  entePublico: {
    type: EntePublicoSchema,
    required: true,
  },
  empleoCargoComision: {
    type: EmpleoCargoComisionSchema,
    required: true,
  },
  procedimientos: {
    type: Array,
    items: {
      type: ProcedimientoSchema,
    },
    required: true,
  },
  observaciones: {
    type: String,
  },
  fechaCaptura: {
    type: Date,
    required: true,
  },
});

const EntePublicoSchema = new mongoose.Schema({
  entidadFederativa: {
    type: String,
    required: true,
  },
  ambitoGobierno: {
    type: String,
    required: true,
  },
  poderOrganoGobierno: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  siglas: {
    type: String,
    required: true,
  },
});

const EmpleoCargoComisionSchema = new mongoose.Schema({
  areaAdscripcion: {
    type: String,
    required: true,
  },
  nivel: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
});

const ProcedimientoSchema = new mongoose.Schema({
  tipoArea: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
  },
  nivelesResponsabilidad: {
    type: Array,
    items: {
      type: String,
    },
  },
});

module.exports = PersonaServidorPublicoSchema;
