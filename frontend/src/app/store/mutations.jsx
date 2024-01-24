export const CLEAR_ERRORS_VALIDATION = "CLEAR_ERRORS_VALIDATION";
export const REQUEST_CHANGEPASSWORD_USER = "REQUEST_CHANGEPASSWORD_USER";
export const REQUEST_CONSULT_BITACORA = "REQUEST_CONSULT_BITACORA";
export const REQUEST_CREATION_PROVIDER = "REQUEST_CREATION_PROVIDER";
export const REQUEST_CREATION_USER = "REQUEST_CREATION_USER";
export const REQUEST_EDIT_PROVIDER = "REQUEST_EDIT_PROVIDER";
export const REQUEST_EDIT_USER = "REQUEST_EDIT_USER";
export const REQUEST_RESET_PASSWORD = "REQUEST_RESET_PASSWORD";
export const REQUEST_TOKEN_AUTH = "REQUEST_TOKEN_AUTH";
export const REQUEST_VALIDATION_ERRORS = "REQUEST_VALIDATION_ERRORS";
export const SET_ERRORS_VALIDATION = "SET_ERRORS_VALIDATION ";

export const clearErrorsValidation = () => ({
  type: CLEAR_ERRORS_VALIDATION,
});

export const requestCreationUser = (usuarioJson) => ({
  type: REQUEST_CREATION_USER,
  usuarioJson,
});

export const requestEditUser = (usuarioJson) => ({
  type: REQUEST_EDIT_USER,
  usuarioJson,
});

export const requestTokenAuth = (credentialUser) => ({
  type: REQUEST_TOKEN_AUTH,
  credentialUser,
});

export const requestErrorsValidation = (schema, systemId) => ({
  type: REQUEST_VALIDATION_ERRORS,
  schema,
  systemId,
});

export const setErrorsValidation = (respuestaArray) => ({
  type: SET_ERRORS_VALIDATION,
  respuestaArray,
});

export const requestCreationProvider = (usuarioJson) => ({
  type: REQUEST_CREATION_PROVIDER,
  usuarioJson,
});

export const requestEditProvider = (usuarioJson) => ({
  type: REQUEST_EDIT_PROVIDER,
  usuarioJson,
});

export const requestConsultBitacora = (usuarioJson) => ({
  type: REQUEST_CONSULT_BITACORA,
  usuarioJson,
});

export const requestResetPassword = (credentialUser) => ({
  type: REQUEST_RESET_PASSWORD,
  credentialUser,
});

export const requestChangePassword = (usuarioJson) => ({
  type: REQUEST_CHANGEPASSWORD_USER,
  usuarioJson,
});
