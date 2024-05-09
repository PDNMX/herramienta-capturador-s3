import { take, put } from 'redux-saga/effects';
//import uuid from 'uuid';
import axios from 'axios';
import * as mutations from './mutations';
/* import path from 'path'; */
import moment from 'moment';
import { alertActions } from '../_actions/alert.actions';
import { history } from './history';
import { userConstants } from '../_constants/user.constants';
import { userActions } from '../_actions/user.action';
import { providerConstants } from '../_constants/provider.constants';
import { providerActions } from '../_actions/provider.action';

/* import { catalogActions } from '../_actions/catalog.action'; */
import { S2Constants } from '../_constants/s2.constants';
import { S2Actions } from '../_actions/s2.action';

import jwt_decode from "jwt-decode";

const url_oauth2 = import.meta.env.VITE_URL_OAUTH || process.env.VITE_URL_OAUTH;
const url_api = import.meta.env.VITE_URL_API || process.env.VITE_URL_API;
const client_id = import.meta.env.VITE_CLIENT_ID || process.env.VITE_CLIENT_ID;
const client_secret = import.meta.env.VITE_CLIENT_SECRET || process.env.VITE_CLIENT_SECRET;

const endpointsCaptura = {
	"capturar.abstenciones.graves": url_api + `/S3/ABSTENCIONES-GRAVES/insert`,
	"capturar.abstenciones.no-graves": url_api + `/S3/ABSTENCIONES-NO-GRAVES/insert`,
	"capturar.actos-particulares.personas-fisicas": url_api + `/S3/PARTICULARES-PERSONAS-FISICAS-FALTAS-GRAVES/insert`,
	"capturar.actos-particulares.personas-morales": url_api + `/S3/PARTICULARES-PERSONAS-MORALES-FALTAS-GRAVES/insert`,
	"capturar.faltas-administrativas.graves": url_api + `/S3/SERVIDORES-FALTAS-GRAVES/insert`,
	"capturar.faltas-administrativas.no-graves": url_api + `/S3/SERVIDORES-NO-GRAVES/insert`,
	"capturar.hechos-corrupcion.personas-fisicas": url_api + `/S3/HECHOS-CORRUPCION-PERSONAS-FISICAS/insert`,
	"capturar.hechos-corrupcion.personas-morales": url_api + `/S3/HECHOS-CORRUPCION-PERSONAS-MORALES/insert`,
	"capturar.hechos-corrupcion.servidores-publicos": url_api + `/S3/HECHOS-CORRUPCION-SERVIDORES-PUBLICOS/insert`,
	"capturar.inhabilitaciones.personas-fisicas": url_api + `/S3/INHABILITACIONES-PERSONAS-FISICAS/insert`,
	"capturar.inhabilitaciones.personas-morales": url_api + `/S3/INHABILITACIONES-PERSONAS-MORALES/insert`
}

const endpointsConsulta = {
	"consultar.abstenciones.graves": url_api + `/S3/ABSTENCIONES-GRAVES/list`,
	"consultar.abstenciones.no-graves": url_api + `/S3/ABSTENCIONES-NO-GRAVES/list`,
	"consultar.actos-particulares.personas-fisicas": url_api + `/S3/PARTICULARES-PERSONAS-FISICAS-FALTAS-GRAVES/list`,
	"consultar.actos-particulares.personas-morales": url_api + `/S3/PARTICULARES-PERSONAS-MORALES-FALTAS-GRAVES/list`,
	"consultar.faltas-administrativas.graves": url_api + `/S3/SERVIDORES-FALTAS-GRAVES/list`,
	"consultar.faltas-administrativas.no-graves": url_api + `/S3/SERVIDORES-NO-GRAVES/list`,
	"consultar.hechos-corrupcion.personas-fisicas": url_api + `/S3/HECHOS-CORRUPCION-PERSONAS-FISICAS/list`,
	"consultar.hechos-corrupcion.personas-morales": url_api + `/S3/HECHOS-CORRUPCION-PERSONAS-MORALES/list`,
	"consultar.hechos-corrupcion.servidores-publicos": url_api + `/S3/HECHOS-CORRUPCION-SERVIDORES-PUBLICOS/list`,
	"consultar.inhabilitaciones.personas-fisicas": url_api + `/S3/INHABILITACIONES-PERSONAS-FISICAS/list`,
	"consultar.inhabilitaciones.personas-morales": url_api + `/S3/INHABILITACIONES-PERSONAS-MORALES/list`
}

export function* validationErrors() {
	while (true) {
		const { schema, systemId } = yield take(mutations.REQUEST_VALIDATION_ERRORS);
		const token = localStorage.token;
		if (token) {
			let payload = jwt_decode(token);
			yield put(userActions.setUserInSession(payload.idUser));
			var usuario = payload.idUser;
			let SCHEMA;
			try {
				SCHEMA = JSON.parse(schema);
			} catch (e) {
				yield put(alertActions.error('Error encontrado en sintaxis del archivo Json ' + e));
			}

			try {
				let urlValidation;

				if (systemId === 'S2') {
					urlValidation = `/validateSchemaS2`;
				} else if (systemId === 'S3S') {
					urlValidation = `/validateSchemaS3S`;
				} else if (systemId === 'S3P') {
					urlValidation = `/validateSchemaS3P`;
				}

				const { status, data } = yield axios.post(url_api + urlValidation, SCHEMA, {
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						Authorization: `Bearer ${token}`,
						usuario: usuario
					},
					validateStatus: () => true
				});

				if (status === 500) {
					yield put(mutations.setErrorsValidation(data.response));
					yield put(
						alertActions.error(
							'No se realizó el registro ya que se encontraron errores en la validación, favor de verificar'
						)
					);
				} else if (status === 401) {
					yield put(alertActions.error(data.message));
					//error in token
				} else if (status === 200) {
					let numeroRegistros = data.detail.numeroRegistros;
					yield put(alertActions.success('Se insertaron ' + numeroRegistros + ' registros correctamente'));
				}
			} catch (e) {
				yield put(alertActions.error('Error encontrado en la petición hacia el servidor ' + e));
			}
		} else {
			console.log('error in token');
		}
	}
}

export function* requestUserPerPage() {
	while (true) {
		const { objPaginationReq } = yield take(userConstants.USERS_PAGINATION_REQUEST);
		const token = localStorage.token;
		const respuestaArray = yield axios.post(url_api + `/getUsersFull`, objPaginationReq, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		yield put(userActions.setPerPageSucces(respuestaArray.data.results));
	}
}

export function* requestProviderPerPage() {
	while (true) {
		const { objPaginationReq } = yield take(providerConstants.PROVIDERS_PAGINATION_REQUEST);
		const token = localStorage.token;
		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));
		const respuestaArray = yield axios.post(url_api + `/getProvidersFull`, objPaginationReq, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		yield put(providerActions.setPerPageSucces(respuestaArray.data.results));
	}
}

export function* fillTemporalUser() {
	while (true) {
		const { id } = yield take(userConstants.USER_TEMPORAL_REQUEST);
		const token = localStorage.token;
		if (token) {
			let query = { query: { _id: id } };
			const respuestaArray = yield axios.post(url_api + `/getUsers`, query, {
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			yield put(userActions.setPerPageSucces(respuestaArray.data.results));
		}
	}
}

export function* fillTemporalProvider() {
	while (true) {
		const { id } = yield take(providerConstants.PROVIDER_TEMPORAL_REQUEST);
		const token = localStorage.token;
		if (token) {
			let query = { query: { _id: id } };
			const respuestaArray = yield axios.post(url_api + `/getProviders`, query, {
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			yield put(providerActions.setPerPageSucces(respuestaArray.data.results));
		}
	}
}

export function* fillAllProviders() {
	while (true) {
		yield take(providerConstants.PROVIDERS_GETALL);

		const token = localStorage.token;
		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));
		let query = { usuario: payload.idUser };
		query['all'] = true;

		const respuestaArray = yield axios.post(url_api + `/getProvidersFull`, query, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		yield put(providerActions.setProvidersAll(respuestaArray.data.results));
	}
}

export function* fillAllProvidersEnabled() {
	while (true) {
		yield take(providerConstants.PROVIDERS_GETALL_ENABLED);

		const token = localStorage.token;
		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));
		let query = { usuario: payload.idUser };
		query['all'] = false;

		const respuestaArray = yield axios.post(url_api + `/getProvidersFull`, query, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		var arrdata = [];
		respuestaArray.data.results.forEach(function(row) {
			arrdata.push({ label: row.label, value: row.value, sistemas: row.sistemas });
		});
		yield put(providerActions.setProvidersAllEnable(arrdata));
	}
}

export function* fillAllUsers() {
	while (true) {
		yield take(userConstants.USERS_GETALL);

		const token = localStorage.token;
		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));
		let query = { usuario: payload.idUser };

		const respuestaArray = yield axios.post(url_api + `/getUsersAll`, query, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		respuestaArray.data.results.push({ label: 'NINGUNO', value: '' });
		yield put(userActions.setUsersAll(respuestaArray.data.results));
	}
}

export function* deleteUser() {
	while (true) {
		const { id } = yield take(userConstants.DELETE_REQUEST);
		const token = localStorage.token;
		if (token) {
			try {
				let payload = jwt_decode(token);
				yield put(userActions.setUserInSession(payload.idUser));

				let request = { _id: id, user: payload.idUser };
				const { status, data } = yield axios.delete(url_api + `/deleteUser`, {
					data: { request },
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						Authorization: `Bearer ${token}`
					},
					validateStatus: () => true
				});
				if (status === 200) {
					yield put(userActions.deleteUserDo(id));
					yield put(alertActions.success('Se elimino el usuario con éxito'));
				} else if (status === 401) {
					yield put(alertActions.error(data.message));
					//error in token
				} else {
					//error in response
					yield put(alertActions.error('El usuario NO fue eliminado'));
				}
			} catch (e) {
				yield put(alertActions.error('El usuario NO fue eliminado'));
			}
		}
	}
}

export function* deleteProvider() {
	while (true) {
		const { id } = yield take(providerConstants.DELETE_REQUEST);
		const token = localStorage.token;
		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));
		let request = { _id: id, usuario: payload.idUser };
		const { status, data } = yield axios.delete(url_api + `/deleteProvider`, {
			data: { request },
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			validateStatus: () => true
		});
		if (status === 200) {
			yield put(providerActions.deleteProviderDo(id));
			yield put(alertActions.success('Proveedor eliminado con éxito'));
		} else if (status === 401) {
			yield put(alertActions.error(data.message));
			//error in token
		} else {
			yield put(alertActions.error('Error al eliminar'));
		}
	}
}

export function* loginUser() {
	while (true) {
		const { credentialUser } = yield take(mutations.REQUEST_TOKEN_AUTH);
		let userName = credentialUser.username;
		let password = credentialUser.password;

		const requestBody = {
			client_id: client_id,
			grant_type: 'password',
			username: userName,
			password: password,
			client_secret: client_secret
		};

		try {
			const token = yield axios.post(url_oauth2 + `/oauth/token`, requestBody, {
				headers: { validateStatus: () => true, 'Content-Type': 'application/x-www-form-urlencoded' }
			});
			localStorage.setItem('token', token.data.access_token);
			yield put(alertActions.clear());
			const toke = localStorage.token;
			let payload = jwt_decode(toke);
			const usuario = { id_usuario: payload.idUser };
			usuario['id_usuario'] = payload.idUser;

			const status = yield axios.post(url_api + `/validationpassword`, usuario, {
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${toke}`
				},
				validateStatus: () => true
			});

			if (status.data.estatus === false) {
				history.push('/ingresar');
				yield put(alertActions.error('Usuario desactivado.¡Debes contactar al administrador!.'));
			} else {
				localStorage.setItem('cambiarcontrasena', status.data.contrasenaNueva);

				yield put(userActions.setVigenciaPass(status.data.contrasenaNueva));
				yield put(userActions.setRol(status.data.rol));
				yield put(userActions.setPermisosSistema(status.data.sistemas));
				yield put(userActions.setProvider(status.data.proveedor));

				localStorage.setItem('rol', status.data.rol);
				localStorage.setItem('sistemas', status.data.sistemas);

				if (status.data.contrasenaNueva === true) {
					history.push('/usuario/cambiarcontrasena');
					yield put(alertActions.error('¡Debes cambiar tu contraseña de manera obligatoria!'));
				} else if (status.data.rol == '2') {
					history.push('/inicio');
				} else {
					history.push('/usuarios');
				}
			}
		} catch (err) {
			if (err.response) {
				yield put(alertActions.error(err.response.data.message));
			} else {
				yield put(alertActions.error(err.toString()));
			}
		}
	}
}

export function* permisosSistemas() {
	while (true) {
		yield take(userConstants.REQUEST_PERMISOS_SISTEMA);
		const toke = localStorage.token;
		let payload = jwt_decode(toke);

		const usuario = { id_usuario: payload.idUser };
		usuario['id_usuario'] = payload.idUser;

		const status = yield axios.post(url_api + `/validationpassword`, usuario, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${toke}`
			},
			validateStatus: () => true
		});

		localStorage.setItem('cambiarcontrasena', status.data.contrasenaNueva);

		yield put(userActions.setVigenciaPass(status.data.contrasenaNueva));
		yield put(userActions.setRol(status.data.rol));
		yield put(userActions.setPermisosSistema(status.data.sistemas));
		yield put(userActions.setProvider(status.data.proveedor));

		localStorage.setItem('rol', status.data.rol);
		localStorage.setItem('sistemas', [ status.data.sistemas ]);
		localStorage.setItem('S2', false);
		localStorage.setItem('S3S', false);
		localStorage.setItem('S3P', false);
		localStorage.setItem('faltas-administrativas-graves', false);
		let permisos = [];
		permisos = status.data.sistemas;

		permisos.map((item) => {
			if (item == 'S2') {
				localStorage.setItem('S2', true);
			} else if (item == 'S3S') {
				localStorage.setItem('S3S', true);
			} else if (item == 'S3P') {
				localStorage.setItem('S3P', true);
			} else if (item == 'faltas-administrativas-graves') {
				localStorage.setItem('faltas-administrativas-graves', true);
			}
		});
	}
}

export function* verifyTokenGetUser() {
	while (true) {
		const { token } = yield take(userConstants.USER_REQUEST_SESSION_SET);
		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));
	}
}

export function* closeSession() {
	while (true) {
		yield take(userConstants.USER_SESSION_REMOVE);
		localStorage.removeItem('token');
		localStorage.removeItem('cambiarcontrasena');
		localStorage.removeItem('rol');
		localStorage.clear();
		history.push('/ingresar');
	}
}

export function* creationUser() {
	while (true) {
		const { usuarioJson } = yield take(mutations.REQUEST_CREATION_USER);
		const token = localStorage.token;
		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));

		if (payload.contrasenaNueva === true) {
			history.push('/usuario/cambiarcontrasena');
			yield put(alertActions.error('Debes cambiar tu contraseña de manera obligatoria.'));
		}

		usuarioJson['user'] = payload.idUser;
		try {
			const { status, data } = yield axios.post(url_api + `/create/user`, usuarioJson, {
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${token}`
				},
				validateStatus: () => true
			});

			if (status === 500) {
				yield put(alertActions.clear());
				history.push('/usuario/crear');
				yield put(
					alertActions.error(
						'El nombre de usuario y/o correo electrónico ya han sido registrados anteriormente.'
					)
				);
			} else if (status === 200) {
				//all OK
				yield put(alertActions.clear());
				yield put(alertActions.success('Usuario creado con éxito'));
			} else if (status === 401) {
				yield put(alertActions.error(data.message));
				//error in token
			} else {
				yield put(alertActions.error('Error al crear'));
			}
		} catch (e) {
			yield put(alertActions.error('Error al crear ' + e.toString()));
		}
	}
}

export function* editUser() {
	while (true) {
		const { usuarioJson } = yield take(mutations.REQUEST_EDIT_USER);
		const token = localStorage.token;
		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));

		usuarioJson['user'] = payload.idUser;
		try {
			const { status, data } = yield axios.put(url_api + `/edit/user`, usuarioJson, {
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${token}`
				},
				validateStatus: () => true
			});

			if (status === 500) {
				yield put(alertActions.error(data.message));
				//history.push('/usuarios');
			} else if (status === 200) {
				//all OK
				yield put(alertActions.success('Usuario editado con éxito'));
			} else if (status === 401) {
				yield put(alertActions.error(data.message));
				//error in token
			} else {
				yield put(alertActions.error('Error al actualizar'));
			}
		} catch (e) {
			yield put(alertActions.error('Error al actualizar ' + e.toString()));
		}
	}
}

export function* creationProvider() {
	while (true) {
		const { usuarioJson } = yield take(mutations.REQUEST_CREATION_PROVIDER);
		let fechaActual = moment();
		if (usuarioJson['estatus'] == undefined || usuarioJson['estatus'] == null) {
			usuarioJson['estatus'] = true;
			usuarioJson['fechaAlta'] = fechaActual.format();
		} else {
			usuarioJson['fechaActualizacion'] = fechaActual.format();
		}
		const token = localStorage.token;
		//const {token} = yield take (userConstants.USER_REQUEST_SESSION_SET);
		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));
		usuarioJson['usuario'] = payload.idUser;
		const { status, data } = yield axios.post(url_api + `/create/provider`, usuarioJson, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			validateStatus: () => true
		});
		if (status === 200) {
			//all OK
			yield put(alertActions.success('Proveedor creado con éxito'));
		} else if (status === 401) {
			yield put(alertActions.error(data.message));
			//error in token
		} else {
			yield put(alertActions.error('Error al crear'));
		}
	}
}

export function* editProvider() {
	while (true) {
		const { usuarioJson } = yield take(mutations.REQUEST_EDIT_PROVIDER);
		let fechaActual = moment();
		if (usuarioJson['estatus'] == undefined || usuarioJson['estatus'] == null) {
			usuarioJson['estatus'] = true;
			usuarioJson['fechaAlta'] = fechaActual.format();
		} else {
			usuarioJson['fechaActualizacion'] = fechaActual.format();
		}
		const token = localStorage.token;
		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));
		usuarioJson['usuario'] = payload.idUser;
		const { status, data } = yield axios.put(url_api + `/edit/provider`, usuarioJson, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			validateStatus: () => true
		});
		if (status === 200) {
			//all OK
			yield put(alertActions.success('Proveedor actualizado con éxito'));
		} else if (status === 401) {
			yield put(alertActions.error(data.message));
			//error in token
		} else {
			yield put(alertActions.error('Error al actualizar'));
		}
	}
}


export function* creationS2Schema() {
	while (true) {
		const { values } = yield take(S2Constants.REQUEST_CREATION_S2);
		let docSend = {};
		const token = localStorage.token;

		docSend['ejercicioFiscal'] = values.ejercicioFiscal;
		if (values.ramo) {
			let ramoObj = JSON.parse(values.ramo);
			docSend['ramo'] = { clave: parseInt(ramoObj.clave), valor: ramoObj.valor };
		}
		if (values.rfc) {
			docSend['rfc'] = values.rfc;
		}
		if (values.curp) {
			docSend['curp'] = values.curp;
		}
		docSend['nombres'] = values.nombres;
		docSend['primerApellido'] = values.primerApellido;
		docSend['segundoApellido'] = values.segundoApellido;
		if (values.genero) {
			docSend['genero'] = JSON.parse(values.genero);
		}
		docSend['institucionDependencia'] = { nombre: values.idnombre, clave: values.idclave, siglas: values.idsiglas };
		docSend['puesto'] = { nombre: values.puestoNombre, nivel: values.puestoNivel };
		if (values.tipoArea) {
			docSend['tipoArea'] = JSON.parse('[' + values.tipoArea + ']');
		}
		if (values.tipoProcedimiento) {
			let ObjTipoProcedimiento = JSON.parse('[' + values.tipoProcedimiento + ']');
			docSend['tipoProcedimiento'] = getArrayFormatTipoProcedimiento(ObjTipoProcedimiento);
		}
		if (values.nivelResponsabilidad) {
			docSend['nivelResponsabilidad'] = JSON.parse('[' + values.nivelResponsabilidad + ']');
		}

		docSend['superiorInmediato'] = {
			rfc: values.siRfc,
			curp: values.siCurp,
			nombres: values.sinombres,
			primerApellido: values.siPrimerApellido,
			segundoApellido: values.siSegundoApellido,
			puesto: { nombre: values.siPuestoNombre, nivel: values.siPuestoNivel }
		};

		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));
		let usuario = payload.idUser;
		docSend['usuario'] = usuario;
		docSend['observaciones'] = values.observaciones;
		const { status, data } = yield axios.post(url_api + `/insertS2v2`, docSend, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			validateStatus: () => true
		});
		if (status === 200) {
			//all OK
			yield put(alertActions.success('Registro creado con éxito '));
		} else if (status === 401) {
			yield put(alertActions.error(data.message));
			//error in token
		} else {
			yield put(alertActions.error('Error al crear'));
		}
	}
}

/* v2 INiCIO */
export function* creationS2v2() {
	while (true) {
		const { values, tipoFormulario } = yield take(S2Constants.REQUEST_CREATION_S2v2);
		let docSend = values;
		const token = localStorage.token;

		let endpoint = endpointsCaptura[tipoFormulario];
		console.log(`entra al saga: ${tipoFormulario} - ${endpoint}` )
		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));
		let usuario = payload.idUser;
		docSend['usuario'] = usuario;
		const { status, data } = yield axios.post(endpoint, docSend, {
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization' : `Bearer ${token}`
			},
			validateStatus: () => true
		});
		if (status === 200) {
			//all OK
			yield put(alertActions.success('Registro creado con éxito'));
		} else if (status === 401) {
			yield put(alertActions.error(data.message));
			//error in token
		} else {
			yield put(alertActions.error('Error al crear'));
		}
	}
}

/* v2 FiN */



export function* updateS2Schema() {
	while (true) {
		const { values } = yield take(S2Constants.UPDATE_REG_S2);
		const token = localStorage.token;
		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));
		let usuario = payload.idUser;
		const { status, data } = yield axios.put(
			url_api + `/S3/SERVIDORES-FALTAS-GRAVES/update`,
			{ ...values, usuario: usuario },
			{
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${token}`
				},
				validateStatus: () => true
			}
		);
		if (status === 200) {
			//all OK
			yield put(alertActions.success('Registro actualizado con éxito '));
		} else if (status === 401) {
			yield put(alertActions.error(data.message));
			//error in token
		} else {
			yield put(alertActions.error('Error al actualizar'));
		}
	}
}

export function* getListSchemaS2() {
	while (true) {
		//console.log("entraaa")
		const { filters, tipoFormulario } = yield take(S2Constants.REQUEST_LIST_S2);
		const token = localStorage.token;
		let payload = jwt_decode(token);
		// se cambio el idUser a usuario
		filters['usuario'] = payload.idUser;
		let endpoint = endpointsConsulta[tipoFormulario];
		console.log(endpoint)
		
		try {
			let respuesta = yield axios.post(endpoint, filters, {
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${token}`
				},
				validateStatus: () => true
			});

			if (respuesta.status === 200) {
				yield put(S2Actions.setListS2(respuesta.data.results));
				console.log(respuesta.data.results)
				yield put(S2Actions.setpaginationS2(respuesta.data.pagination));
			} else {
				//error in response
				yield put(alertActions.error(respuesta.data.message));
			}
		} catch (error) {
			yield put(alertActions.error('Error al listar la información'));
		}
	}
}


export function* fillUpdateRegS2() {
	while (true) {
		const { id } = yield take(S2Constants.FILL_REG_S2_EDIT);
		const token = localStorage.token;
		let query = { query: { _id: id } };
		let payload = jwt_decode(token);
		query['idUser'] = payload.idUser;

		

		let newRow = {};
		
		yield put(S2Actions.setListS2([ newRow ]));
	}
}

export function* ResetPassword() {
	while (true) {
		const { credentialUser } = yield take(mutations.REQUEST_RESET_PASSWORD);
		let correo = credentialUser.correo;
		let status;

		const requestBody = {
			correo: correo
		};

		try {
			status = yield axios.post(url_api + `/resetpassword`, requestBody, {
				headers: { validateStatus: () => true, 'Content-Type': 'application/x-www-form-urlencoded' }
			});
			//localStorage.setItem("token", token.data.access_token);
			if (credentialUser.sistema === true) {
				history.push('/usuarios');
			} else {
				history.push('/restaurar-contraseña');
			}

			if (status.data.Status === 200) {
				yield put(alertActions.success(status.data.message));
			} else {
				//error in response
				yield put(alertActions.error(status.data.message));
			}
		} catch (err) {
			yield put(alertActions.error('El Registro modificado'));
		}
	}
}

export function* changePassword() {
	while (true) {
		const { usuarioJson } = yield take(mutations.REQUEST_CHANGEPASSWORD_USER);
		const token = localStorage.token;
		let payload = jwt_decode(token);
		let status;
		yield put(userActions.setUserInSession(payload.idUser));
		usuarioJson['user'] = payload.idUser;

		try {
			status = yield axios.post(url_api + `/changepassword`, usuarioJson, {
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${token}`
				},
				validateStatus: () => true
			});

			if (status.data.Status === 200) {
				yield put(alertActions.success(status.data.message));
				closeSession();
				setTimeout(function() {
					history.push('/ingresar');
				}, 3000);
			} else {
				//error in response
				yield put(alertActions.error(status.data.message));
			}
		} catch (err) {
			yield put(alertActions.error('El Registro no fue modificado'));
		}
	}
}
