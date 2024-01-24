import { take, put, select } from 'redux-saga/effects';
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

import { catalogConstants } from '../_constants/catalogs.constants';
import { catalogActions } from '../_actions/catalog.action';
import { S2Constants } from '../_constants/s2.constants';
import { storeValidate } from './index';
import { S2Actions } from '../_actions/s2.action';
import { bitacoraActions } from '../_actions/bitacora.action';
import { S3SConstants } from '../_constants/s3s.constants';
import { S3SActions } from '../_actions/s3s.action';
import { S3PConstants } from '../_constants/s3p.constants';
import { S3PActions } from '../_actions/s3p.action';

import jwt_decode from "jwt-decode";

import _ from "underscore"
import { formatISO } from 'date-fns';

import momento from 'moment-timezone';

const url_oauth2 = import.meta.env.VITE_URL_OAUTH || process.env.VITE_URL_OAUTH;
const url_api = import.meta.env.VITE_URL_API || process.env.VITE_URL_API;
const client_id = import.meta.env.VITE_CLIENT_ID || process.env.VITE_CLIENT_ID;
const client_secret = import.meta.env.VITE_CLIENT_SECRET || process.env.VITE_CLIENT_SECRET;

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
				let respuestaArray;
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
		let query = { usuario: payload.idUser };
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
			let request = { _id: id };
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
					history.push('/captura/S2v2');
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
		let permisos = [];
		permisos = status.data.sistemas;
		let permiso = false;

		permisos.map((item) => {
			if (item == 'S2') {
				localStorage.setItem('S2', true);
			} else if (item == 'S3S') {
				localStorage.setItem('S3S', true);
			} else if (item == 'S3P') {
				localStorage.setItem('S3P', true);
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
		let fechaActual = moment();
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

export function* creationS3PSchema() {
	while (true) {
		const { values } = yield take(S3PConstants.REQUEST_CREATION_S3P);
		const token = localStorage.token;
		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));
		let usuario = payload.idUser;

		delete values.__v;
		if (values._id) {
			values['_id'] = values._id;
			const { status } = yield axios.post(
				url_api + `/updateS3Pv2`,
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
				yield put(alertActions.success('Registro actualizado con éxito'));
			} else {
				yield put(alertActions.error('Error al crear'));
				//error in response
			}
		} else {
			const { status, data } = yield axios.post(
				url_api + `/insertS3Pv2`,
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
				yield put(alertActions.success('Registro creado con éxito'));
			} else if (status === 401) {
				yield put(alertActions.error(data.message));
				//error in token
			} else {
				yield put(alertActions.error('Error al crear'));
			}
		}
	}
}

export function* creationS3SSchema() {
	while (true) {
		const { values } = yield take(S3SConstants.REQUEST_CREATION_S3S);
		const token = localStorage.token;
		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));
		let usuario = payload.idUser;

		//let docSend = {};

		if (values._id) {
			//docSend['_id'] = values._id;
			const { status } = yield axios.post(
				url_api + `/updateS3Sv2`,
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
				yield put(alertActions.success('Registro actualizado con éxito'));
			} else {
				yield put(alertActions.error('Error al crear'));
				//error in response
			}
		} else {
			const { status, data } = yield axios.post(
				url_api + `/insertS3Sv2`,
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
				yield put(alertActions.success('Registro creado con éxito'));
			} else if (status === 401) {
				yield put(alertActions.error(data.message));
				//error in token
			} else {
				yield put(alertActions.error('Error al crear'));
			}
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
		const { status, data } = yield axios.post(url_api + `/insertS2Schema`, docSend, {
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
		const { values } = yield take(S2Constants.REQUEST_CREATION_S2v2);
		console.log("entra al creationS2v2");
		console.log(values);
		let docSend = values;
		const token = localStorage.token;

		/* docSend['ejercicioFiscal'] = values.ejercicioFiscal;
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
		}; */

		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));
		let usuario = payload.idUser;
		docSend['usuario'] = usuario;
		//docSend['observaciones'] = values.observaciones;
		console.log("docSENDD");
		console.log(docSend);
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
			console.log("paso el registro")
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
			url_api + `/updateS2v2`,
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

function getArrayFormatTipoProcedimiento(array) {
	_.each(array, function(p) {
		p.clave = parseInt(p.clave);
	});
	return array;
}

export function* getListSchemaS2() {
	while (true) {
		const { filters } = yield take(S2Constants.REQUEST_LIST_S2);
		const token = localStorage.token;
		let payload = jwt_decode(token);
		filters['idUser'] = payload.idUser;
		const respuestaArray = yield axios.post(url_api + `/lists2v2`, filters, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			validateStatus: () => true
		});

		yield put(S2Actions.setListS2(respuestaArray.data.results));
		yield put(S2Actions.setpaginationS2(respuestaArray.data.pagination));
	}
}

export function* getListSchemaS3S() {
	while (true) {
		const { filters } = yield take(S3SConstants.REQUEST_LIST_S3S);
		const token = localStorage.token;
		let payload = jwt_decode(token);
		filters['idUser'] = payload.idUser;

		const respuestaArray = yield axios.post(url_api + `/listS3Sv2`, filters, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		yield put(S3SActions.setListS3S(respuestaArray.data.results));
		yield put(S3SActions.setpaginationS3S(respuestaArray.data.pagination));
	}
}

export function* getListSchemaS3P() {
	while (true) {
		const { filters } = yield take(S3PConstants.REQUEST_LIST_S3P);
		const token = localStorage.token;
		let payload = jwt_decode(token);
		filters['idUser'] = payload.idUser;

		const respuestaArray = yield axios.post(url_api + `/listS3Pv2`, filters, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		/* const respuestaArrayTipoPersona = yield axios.post(url_api + `/getCatalogs`, {docType: "tipoPersona"}, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        let arrayFormatS3P = [] ;
        for(let elementS3P of respuestaArray.data.results){
            arrayFormatS3P.push(yield formatS3PField(elementS3P,respuestaArrayTipoPersona));
        }
                yield put (S3PActions.setListS3P(arrayFormatS3P));
                */

		yield put(S3PActions.setListS3P(respuestaArray.data.results));
		yield put(S3PActions.setpaginationS3P(respuestaArray.data.pagination));
	}
}

async function formatS3PField(registro, respuestaArrayTipoPersona) {
	let token = localStorage.token;
	for (let [ key, row ] of Object.entries(registro)) {
		if (key === 'particularSancionado') {
			if (row.tipoPersona) {
				let tipoPersona = row.tipoPersona;

				for (let persona of respuestaArrayTipoPersona.data.results) {
					if (persona.clave === tipoPersona) {
						row.tipoPersona = JSON.stringify({ clave: persona.clave, valor: persona.valor });
					}
				}
			}
			if (row.domicilioMexico) {
				if (row.domicilioMexico.pais) {
					row.domicilioMexico.pais = JSON.stringify(row.domicilioMexico.pais);
				}
				if (row.domicilioMexico.entidadFederativa) {
					row.domicilioMexico.entidadFederativa = JSON.stringify(row.domicilioMexico.entidadFederativa);
				}
				if (row.domicilioMexico.municipio) {
					row.domicilioMexico.municipio = JSON.stringify(row.domicilioMexico.municipio);
				}
				if (row.domicilioMexico.localidad) {
					row.domicilioMexico.localidad = JSON.stringify(row.domicilioMexico.localidad);
				}
				if (row.domicilioMexico.vialidad) {
					row.domicilioMexico.descripcionVialidad = row.domicilioMexico.vialidad.valor;
					row.domicilioMexico.vialidad = JSON.stringify({
						clave: row.domicilioMexico.vialidad.clave,
						valor: row.domicilioMexico.vialidad.clave
					});
				}
			}
		} else if (key === 'multa') {
			if (row.moneda) {
				row.moneda = JSON.stringify(row.moneda);
			}
		} else if (key === 'documentos') {
			if (Array.isArray(row)) {
				for (let i of row) {
					i.tipo = JSON.stringify({ clave: i.tipo, valor: i.tipo });
				}
			}
		} else if (key === 'tipoSancion') {
			let arraySanciones = [];
			for (let objTipoSancion of row) {
				let obj = {};
				if (objTipoSancion.clave && objTipoSancion.valor) {
					obj['tipoSancion'] = JSON.stringify({ clave: objTipoSancion.clave, valor: objTipoSancion.valor });
				}
				if (objTipoSancion.descripcion) {
					obj['descripcion'] = objTipoSancion.descripcion;
				}

				arraySanciones.push(obj);
			}
			registro.tipoSancion = arraySanciones;
		}
	}
	return registro;
}

export function* fillUpdateRegS3P() {
	while (true) {
		const { id } = yield take(S3PConstants.FILL_REG_S3P_EDIT);
		const token = localStorage.token;
		let query = { query: { _id: id } };
		let payload = jwt_decode(token);
		query['idUser'] = payload.idUser;

		const respuestaArray = yield axios.post(url_api + `/listSchemaS3P`, query, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		let registro = respuestaArray.data.results[0];
		let entidadSelect;
		for (let [ key, row ] of Object.entries(registro)) {
			if (key === 'particularSancionado') {
				if (row.tipoPersona) {
					let tipoPersona = row.tipoPersona;

					const respuestaArray = yield axios.post(
						url_api + `/getCatalogs`,
						{ docType: 'tipoPersona' },
						{
							headers: {
								'Content-Type': 'application/json',
								Accept: 'application/json',
								Authorization: `Bearer ${token}`
							}
						}
					);

					for (let persona of respuestaArray.data.results) {
						if (persona.clave === tipoPersona) {
							row.tipoPersona = JSON.stringify({ clave: persona.clave, valor: persona.valor });
						}
					}
				}

				if (row.domicilioMexico) {
					registro.domicilio = 'mex';
					if (row.domicilioMexico.pais) {
						row.domicilioMexico.pais = JSON.stringify(row.domicilioMexico.pais);
					}
					if (row.domicilioMexico.entidadFederativa) {
						row.domicilioMexico.entidadFederativa = JSON.stringify(row.domicilioMexico.entidadFederativa);
						entidadSelect = row.domicilioMexico.entidadFederativa;
						const respuestaArrayMunicipio = yield axios.post(
							url_api + `/getCatalogsMunicipiosPorEstado`,
							{ idEstado: row.domicilioMexico.entidadFederativa },
							{
								headers: {
									'Content-Type': 'application/json',
									Accept: 'application/json',
									Authorization: `Bearer ${token}`
								}
							}
						);

						if (Array.isArray(respuestaArrayMunicipio.data.results)) {
							yield put(catalogActions.setMunicipioSucces(respuestaArrayMunicipio.data.results));
						}
					}
					if (row.domicilioMexico.municipio) {
						row.domicilioMexico.municipio = JSON.stringify(row.domicilioMexico.municipio);
						const respuestaArrayLocalidad = yield axios.post(
							url_api + `/getCatalogsLocalidadesPorEstado`,
							{ idMunicipio: row.domicilioMexico.municipio, idEntidad: entidadSelect },
							{
								headers: {
									'Content-Type': 'application/json',
									Accept: 'application/json',
									Authorization: `Bearer ${token}`
								}
							}
						);

						if (Array.isArray(respuestaArrayLocalidad.data.results)) {
							yield put(catalogActions.setLocalidadSucces(respuestaArrayLocalidad.data.results));
						}
					}
					if (row.domicilioMexico.localidad) {
						row.domicilioMexico.localidad = JSON.stringify(row.domicilioMexico.localidad);
					}
					if (row.domicilioMexico.vialidad) {
						row.domicilioMexico.descripcionVialidad = row.domicilioMexico.vialidad.valor;
						row.domicilioMexico.vialidad = JSON.stringify({
							clave: row.domicilioMexico.vialidad.clave,
							valor: row.domicilioMexico.vialidad.clave
						});
					}
				}
				if (row.domicilioExtranjero) {
					registro.domicilio = 'ext';

					if (row.domicilioExtranjero.pais) {
						row.domicilioExtranjero.pais = JSON.stringify(row.domicilioExtranjero.pais);
					}
				}
			} else if (key === 'multa') {
				if (row.moneda) {
					row.moneda = JSON.stringify(row.moneda);
				}
				// } else if (key === "documentos") {
				//     if (Array.isArray(row)) {
				//         for (let i of row) {
				//             i.tipo = JSON.stringify({clave: i.tipo, valor: i.tipo});

				//             if(i.fecha){
				//                 let fecha = new Date(i.fecha+ "T00:00:00.000");
				//                 i.fecha = momento(fecha).tz("America/Mexico_City");
				//             }
				//         }
				//     }
				// }else if(key === "tipoSancion"){
				//     let arraySanciones= [];
				//     for(let objTipoSancion of row){
				//         let obj={};
				//         if(objTipoSancion.clave && objTipoSancion.valor){
				//             obj["tipoSancion"] = JSON.stringify({clave:objTipoSancion.clave ,valor : objTipoSancion.valor});
				//         }
				//         if(objTipoSancion.descripcion){obj["descripcion"] = objTipoSancion.descripcion;}

				//         arraySanciones.push(obj);
				//     }
				//     registro.tipoSancion = arraySanciones;
			} else if (key === 'resolucion') {
				if (row.fechaNotificacion) {
					let fecha = new Date(row.fechaNotificacion + 'T00:00:00.000');
					row.fechaNotificacion = momento(fecha).tz('America/Mexico_City');
				}
			} else if (key === 'inhabilitacion') {
				if (row.fechaInicial) {
					let fecha = new Date(row.fechaInicial + 'T00:00:00.000');
					row.fechaInicial = momento(fecha).tz('America/Mexico_City');
				}
				if (row.fechaFinal) {
					let fecha = new Date(row.fechaFinal + 'T00:00:00.000');
					row.fechaFinal = momento(fecha).tz('America/Mexico_City');
				}
			}
		}
		yield put(S3PActions.setListS3P([ registro ]));
	}
}

export function* fillUpdateRegS3S() {
	while (true) {
		const { id } = yield take(S3SConstants.FILL_REG_S3S_EDIT);
		const token = localStorage.token;
		let query = { query: { _id: id } };
		let payload = jwt_decode(token);
		query['idUser'] = payload.idUser;

		const respuestaArray = yield axios.post(url_api + `/listSchemaS3S`, query, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		let registro = respuestaArray.data.results[0];
		let newRow = {};

		for (let [ key, row ] of Object.entries(registro)) {
			if (key === 'expediente') {
				newRow[key] = row;
			} else if (key === 'institucionDependencia') {
				if (row.nombre) {
					newRow['idnombre'] = row.nombre;
				}
				if (row.clave) {
					newRow['idclave'] = row.clave;
				}
				if (row.siglas) {
					newRow['idsiglas'] = row.siglas;
				}
			} else if (key === 'servidorPublicoSancionado') {
				if (row.rfc) {
					newRow['SPrfc'] = row.rfc;
				}
				if (row.curp) {
					newRow['SPcurp'] = row.curp;
				}
				if (row.nombres) {
					newRow['SPSnombres'] = row.nombres;
				}
				if (row.primerApellido) {
					newRow['SPSprimerApellido'] = row.primerApellido;
				}
				if (row.segundoApellido) {
					newRow['SPSsegundoApellido'] = row.segundoApellido;
				}
				if (row.genero) {
					newRow['SPSgenero'] = JSON.stringify({
						clave: row.genero.clave.toString(),
						valor: row.genero.valor
					});
				}
				if (row.puesto) {
					newRow['SPSpuesto'] = row.puesto;
				}
				if (row.nivel) {
					newRow['SPSnivel'] = row.nivel;
				}
			} else if (key === 'autoridadSancionadora') {
				newRow[key] = row;
			} else if (key === 'tipoFalta') {
				if (row.descripcion) {
					newRow['tpfdescripcion'] = row.descripcion;
				}
				if (row.clave && row.valor) {
					newRow['tipoFalta'] = JSON.stringify({ clave: row.clave, valor: row.valor });
				}
			} else if (key === 'tipoSancion') {
				let arraySanciones = [];
				for (let objTipoSancion of row) {
					// let obj=objTipoSancion;
					// if(objTipoSancion.clave && objTipoSancion.valor){
					//     obj["tipoSancion"] = JSON.stringify({clave:objTipoSancion.clave ,valor : objTipoSancion.valor});
					// }
					// if(objTipoSancion.descripcion){obj["descripcion"] = objTipoSancion.descripcion;}
					arraySanciones.push(objTipoSancion);
				}
				newRow['tipoSancionArray'] = arraySanciones;
			} else if (key === 'causaMotivoHechos') {
				newRow[key] = row;
			} else if (key === 'resolucion') {
				if (row.url) {
					newRow['resolucionURL'] = row.url;
				}
				if (row.fechaResolucion) {
					let fecha = new Date(row.fechaResolucion + 'T00:00:00.000');
					newRow['resolucionFecha'] = momento(fecha).tz('America/Mexico_City');
				}
			} else if (key === 'multa') {
				let objMulta = {};
				if (row.moneda) {
					objMulta['moneda'] = JSON.stringify({
						clave: row.moneda.clave.toString().toUpperCase(),
						valor: row.moneda.valor.toUpperCase()
					});
				}
				if (row.monto) {
					objMulta['monto'] = row.monto;
				}
				newRow['multa'] = objMulta;
			} else if (key === 'inhabilitacion') {
				if (row.plazo) {
					newRow['inhabilitacionPlazo'] = row.plazo;
				}
				if (row.fechaInicial) {
					let fecha = new Date(row.fechaInicial + 'T00:00:00.000');
					newRow['inhabilitacionFechaInicial'] = momento(fecha).tz('America/Mexico_City');
				}
				if (row.fechaFinal) {
					let fecha = new Date(row.fechaFinal + 'T00:00:00.000');
					newRow['inhabilitacionFechaFinal'] = momento(fecha).tz('America/Mexico_City');
				}
			} else if (key === 'observaciones') {
				newRow[key] = row;
			} else if (key === 'documentos') {
				let arrayDocumentos = [];
				for (let objDocumentos of row) {
					// let obj={};
					// if(objDocumentos.id){ obj["id"] = objDocumentos.id;}
					// if(objDocumentos.titulo){ obj["titulo"] = objDocumentos.titulo;}
					// if(objDocumentos.descripcion){ obj["descripcion"] = objDocumentos.descripcion;}
					// if(objDocumentos.url){ obj["url"] = objDocumentos.url;}
					// if(objDocumentos.fecha){
					//     let fecha = new Date( objDocumentos.fecha+ "T00:00:00.000");
					//     obj["fecha"] = momento(fecha).tz("America/Mexico_City");
					// }
					// if(objDocumentos.tipo){ obj["tipo"] = JSON.stringify({clave:objDocumentos.tipo ,valor : objDocumentos.tipo});}
					arrayDocumentos.push(objDocumentos);
				}

				newRow['documents'] = arrayDocumentos;
			} else {
				newRow[key] = row;
			}
		}
		yield put(S3SActions.setListS3S([ newRow ]));
	}
}

export function* fillUpdateRegS2() {
	while (true) {
		const { id } = yield take(S2Constants.FILL_REG_S2_EDIT);
		const token = localStorage.token;
		let query = { query: { _id: id } };
		let payload = jwt_decode(token);
		query['idUser'] = payload.idUser;

		const respuestaArray = yield axios.post(url_api + `/listS2v2`, query, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		let registro = respuestaArray.data.results[0];

		let newRow = {};
		for (let [ key, row ] of Object.entries(registro)) {
			if (key === 'genero' || key === 'ramo') {
				newRow[key] = JSON.stringify({ clave: row.clave.toString(), valor: row.valor });
			} else if (key === 'tipoArea' || key === 'nivelResponsabilidad' || key === 'tipoProcedimiento') {
				let newArray = [];
				for (let item of row) {
					newArray.push(JSON.stringify({ clave: item.clave.toString(), valor: item.valor }));
				}
				newRow[key] = newArray;
			} else if (key === 'superiorInmediato') {
				if (row.nombres) {
					newRow['sinombres'] = row.nombres;
				}
				if (row.rfc) {
					newRow['siRfc'] = row.rfc;
				}
				if (row.curp) {
					newRow['siCurp'] = row.curp;
				}
				if (row.primerApellido) {
					newRow['siPrimerApellido'] = row.primerApellido;
				}
				if (row.segundoApellido) {
					newRow['siSegundoApellido'] = row.segundoApellido;
				}
				if (row.puesto) {
					if (row.puesto.nombre) {
						newRow['siPuestoNombre'] = row.puesto.nombre;
					}
					if (row.puesto.nivel) {
						newRow['siPuestoNivel'] = row.puesto.nivel;
					}
				}
			} else if (key === 'puesto') {
				if (row.nombre) {
					newRow['puestoNombre'] = row.nombre;
				}
				if (row.nivel) {
					newRow['puestoNivel'] = row.nivel;
				}
			} else if (key === 'institucionDependencia') {
				if (row.nombre) {
					newRow['idnombre'] = row.nombre;
				}
				if (row.siglas) {
					newRow['idsiglas'] = row.siglas;
				}
				if (row.clave) {
					newRow['idclave'] = row.clave;
				}
			} else {
				newRow[key] = row;
			}
		}
		yield put(S2Actions.setListS2([ newRow ]));
	}
}

export function* deleteSchemaS2() {
	while (true) {
		const { id } = yield take(S2Constants.DELETE_REQUESTS2);
		const token = localStorage.token;
		if (token) {
			let request = { _id: id };
			let payload = jwt_decode(token);
			yield put(userActions.setUserInSession(payload.idUser));
			request['usuario'] = payload.idUser;
			try {
				const { status, data } = yield axios.delete(url_api + `/deleteRecordS2`, {
					data: { request },
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						Authorization: `Bearer ${token}`
					},
					validateStatus: () => true
				});
				if (status === 200) {
					yield put(S2Actions.deleteRecordDo(id));
					yield put(alertActions.success(data.messageFront));
				} else if (status === 401) {
					yield put(alertActions.error(data.message));
					//error in token
				} else {
					//error in response
					yield put(alertActions.error('El Registro NO fue eliminado'));
				}
			} catch (e) {
				yield put(alertActions.error('El Registro NO fue eliminado'));
			}
		}
	}
}

export function* deleteSchemaS3S() {
	while (true) {
		const { id } = yield take(S3SConstants.DELETE_REQUESTS3S);
		const token = localStorage.token;
		if (token) {
			let request = { _id: id };
			let payload = jwt_decode(token);
			yield put(userActions.setUserInSession(payload.idUser));
			request['usuario'] = payload.idUser;
			try {
				const { status, data } = yield axios.delete(url_api + `/deleteRecordS3S`, {
					data: { request },
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						Authorization: `Bearer ${token}`
					},
					validateStatus: () => true
				});
				if (status === 200) {
					yield put(S2Actions.deleteRecordDo(id));
					yield put(alertActions.success(data.messageFront));
				} else if (status === 401) {
					yield put(alertActions.error(data.message));
					//error in token
				} else {
					//error in response
					yield put(alertActions.error('El Registro NO fue eliminado'));
				}
			} catch (e) {
				yield put(alertActions.error('El Registro NO fue eliminado'));
			}
		}
	}
}

export function* deleteSchemaS3P() {
	while (true) {
		const { id } = yield take(S3PConstants.DELETE_REQUESTS3P);
		const token = localStorage.token;
		if (token) {
			let request = { _id: id };
			let payload = jwt_decode(token);
			yield put(userActions.setUserInSession(payload.idUser));
			request['usuario'] = payload.idUser;
			try {
				const { status, data } = yield axios.delete(url_api + `/deleteRecordS3P`, {
					data: { request },
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						Authorization: `Bearer ${token}`
					},
					validateStatus: () => true
				});
				if (status === 200) {
					yield put(S2Actions.deleteRecordDo(id));
					yield put(alertActions.success(data.messageFront));
				} else if (status === 401) {
					yield put(alertActions.error(data.message));
					//error in token
				} else {
					//error in response
					yield put(alertActions.error('El Registro NO fue eliminado'));
				}
			} catch (e) {
				yield put(alertActions.error('El Registro NO fue eliminado'));
			}
		}
	}
}

export function* consultBitacora() {
	while (true) {
		const { usuarioJson } = yield take(mutations.REQUEST_CONSULT_BITACORA);
		let fechaActual = moment();
		const token = localStorage.token;
		let payload = jwt_decode(token);
		yield put(userActions.setUserInSession(payload.idUser));
		//usuarioJson["usuario"]=payload.idUser;
		const respuestaArray = yield axios.post(url_api + `/getBitacora`, usuarioJson, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			validateStatus: () => true
		});
		yield put(bitacoraActions.setBitacoraAll(respuestaArray.data.results));
		yield put(alertActions.success('Consulta realizada con éxito'));
		yield put(alertActions.clear());
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
