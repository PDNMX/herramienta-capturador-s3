const Yup = require('yup');


const esquemaS2 = Yup.object().shape({
  ejercicioFiscal: Yup.string().matches(new RegExp('^[0-9]{4}$'), 'Debe tener 4 dígitos'),
  ramo: Yup.string(),
  nombres: Yup.string().matches(new RegExp("^['A-zÀ-ú-. ]{1,25}$"), 'no se permiten números, ni cadenas vacias ').required().trim(),
  primerApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-. ]{1,25}$"), 'no se permiten números, ni cadenas vacias ').required().trim(),
  segundoApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-. ]{1,25}$"), 'no se permiten números, ni cadenas vacias ').trim(),
  genero: Yup.object(),
  idnombre: Yup.string().matches(new RegExp("^[A-zÀ-ú-0-9_.' ]{1,100}$"), 'no se permiten cadenas vacias , max 100 caracteres ').required().trim(),
  idsiglas: Yup.string().matches(new RegExp("^[A-zÀ-ú-0-9_.' ]{1,50}$"), 'no se permiten cadenas vacias , max 50 caracteres ').trim(),
  idclave: Yup.string().matches(new RegExp("^[A-zÀ-ú-0-9_.' ]{1,50}$"), 'no se permiten cadenas vacias , max 50 caracteres ').trim(),
  puestoNombre: Yup.string()
    .matches(new RegExp("^['A-zÀ-ú-. ]{1,25}$"), 'no se permiten números, ni cadenas vacias ')
    .trim()
    .when('puestoNivel', puestoNivel => {
      if (!puestoNivel) return Yup.string().matches(new RegExp("^['A-zÀ-ú-. ]{1,100}$"), 'no se permiten números, ni cadenas vacias, max 100 caracteres ').trim().required('Al menos un campo seccion Puesto, es requerido ');
    }),
  puestoNivel: Yup.string().matches(new RegExp('^[a-zA-Z0-9 ]{1,25}$'), 'no se permiten números, ni cadenas vacias ').trim(),
  tipoArea: Yup.array(),
  nivelResponsabilidad: Yup.array(),
  tipoProcedimiento: Yup.array().min(1).required(),
  sinombres: Yup.string().matches(new RegExp("^['A-zÀ-ú-. ]{1,25}$"), 'no se permiten números, ni cadenas vacias, max 25 caracteres ').trim(),
  siPrimerApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-. ]{1,25}$"), 'no se permiten números, ni cadenas vacias, max 25 caracteres ').trim(),
  siSegundoApellido: Yup.string().matches(new RegExp("^['A-zÀ-ú-. ]{1,25}$"), 'no se permiten números, ni cadenas vacias, max 25 caracteres ').trim(),
  siPuestoNombre: Yup.string().matches(new RegExp("^['A-zÀ-ú-. ]{1,100}$"), 'no se permiten números, ni cadenas vacias, max 100 caracteres ').trim(),
  siPuestoNivel: Yup.string().matches(new RegExp('^[a-zA-Z0-9 ]{1,25}$'), 'no se permiten números, ni cadenas vacias ').trim()
});

const schemaUserCreate = Yup.object().shape({
  vigenciaContrasena: Yup.string().required(),
  fechaAlta: Yup.string().required()
});

const schemaUser = Yup.object().shape({
  nombre: Yup.string().matches(new RegExp("^['A-zÀ-ú ]*$"), 'no se permiten números, ni cadenas vacias').required('El campo nombre es requerido').trim(),
  apellidoUno: Yup.string().matches(new RegExp("^['A-zÀ-ú ]*$"), 'no se permiten números, ni cadenas vacias').required('El campo Primer apellido es requerido').trim(),
  apellidoDos: Yup.string().matches(new RegExp("^['A-zÀ-ú ]*$"), 'no se permiten números, ni cadenas vacias').trim(),
  cargo: Yup.string().matches(new RegExp("^['A-zÀ-ú ]*$"), 'no se permiten números, ni cadenas vacias').required('El campo Cargo es requerido').trim(),
  correoElectronico: Yup.string().required('El campo Correo electrónico es requerido').email(),
  telefono: Yup.string().matches(new RegExp('^[0-9]{10}$'), 'Inserta un número de teléfono valido, 10 caracteres').required('El campo Número de teléfono es requerido').trim(),
  extension: Yup.string().matches(new RegExp('^[0-9]{0,10}$'), 'Inserta un número de extensión valido , maximo 10 caracteres').trim(),
  usuario: Yup.string().matches(new RegExp('^[a-zA-Z0-9]{8,}$'), 'Inserta al menos 8 caracteres, no se permiten caracteres especiales').required('El campo Nombre de usuario es requerido').trim(),
  constrasena: Yup.string(),
  sistemas: Yup.array().min(1).required('El campo Sistemas aplicables es requerido'),
  proveedorDatos: Yup.string().required('El campo Proveedor de datos es requerido'),
  estatus: Yup.boolean().required('El campo Estatus es requerido')
});

const schemaProvider = Yup.object().shape({
  dependencia: Yup.string().required('El nombre de la dependencia es requerido').matches(new RegExp('^[ñáéíóúáéíóúÁÉÍÓÚa-zA-Z ]*$'), 'Inserta solamente caracteres'),
  sistemas: Yup.array().min(1).required('El campo sistemas es requerido'),
  estatus: Yup.boolean().required('El campo estatus es requerido'),
  fechaAlta: Yup.string()
});

module.exports = {
  esquemaS2,
  schemaUserCreate,
  schemaUser,
  schemaProvider
};
