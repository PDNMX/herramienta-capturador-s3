const Joi = require('joi');

const JoiSchemaS2 = Joi.object({
  usuario: Joi.string().min(3).max(30).required(),
  //usuario: Joi|string().min(3).max(30).required(),
  nombres: Joi.string()
            .pattern(/^[^\d]+$/)
            .min(3).max(30).required(),
  primerApellido: Joi.string()
            .pattern(/^[^\d]+$/)
            .min(3).max(30).required(),
/*   segundoApellido: Joi.object({
    sinSegundoApellido: Joi.boolean(),
    valor: Joi.string(),
    }), */
  segundoApellido: Joi.object({
    sinSegundoApellido: Joi.boolean().required(),
    // El atributo valor debe ser una cadena de caracteres
  valor: Joi.string()
  // Si sinSegundoApellido es falso, entonces valor es obligatorio
  .when('sinSegundoApellido', { is: false, then: Joi.required() })
  // Si sinSegundoApellido es verdadero, entonces valor está prohibido
  .when('sinSegundoApellido', { is: true, then: Joi.forbidden() }),
  }),
  ejercicio: Joi.number().integer().min(2015).max(2021).required(),
  curp: Joi.string().regex(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/),
  rfc: Joi.string().regex(/^([A-ZÑ\x26]{3,4})([0-9]{6})([A-Z0-9]{3})$/),
  sexo: Joi.string().valid('MASCULINO', 'FEMENINO').required(),
  observaciones: Joi.string().min(3).max(300),
  entePublico: Joi.object()
                  .min(1)
                  .required(),
  empleoCargoComision: Joi.object()
                  .min(1)
                  .required(),
   procedimientos: Joi.object()
                  .min(1)
                  .required(), 

  /*
  entePublico: Joi.object({
    entidadFederativa: Joi.string().min(3).max(30).required(),
    ambitoGobierno: Joi.object({
      clave: Joi.string().min(3).max(30).required(),
      valor: Joi.string().min(3).max(30).required(),
    }),
    poderOrganoGobierno: Joi.string().min(3).max(30).required(),
    nombre: Joi.string().min(3).max(30).required(),
    siglas: Joi.string().min(3).max(30).required(),
  }),
  empleoCargoComision: Joi.object({
    areaAdscripcion: Joi.string().min(3).max(30).required(),
    nivel: Joi.string().min(3).max(30).required(),
    nombre: Joi.string().min(3).max(30).required(),
  }),
  procedimientos: Joi.object({
    tipoArea: Joi.object({
      tipo: Joi.string().min(3).max(30).required(),
      areas: Joi.array().items(Joi.string().min(3).max(30).required()),
    }),
    nivelesResponsabilidad: Joi.object({
      idObj: Joi.string().min(3).max(30).required(),
      acciones: Joi.array().items(Joi.string().min(3).max(30).required()),
    }),
    tipo: Joi.string().min(3).max(30).required(),
  }),
  observaciones: Joi.string().min(3).max(30).required(), */
});

module.exports = JoiSchemaS2;
