import { userConstants } from '../_constants/user.constants';
import {providerConstants} from "../_constants/provider.constants";
import {bitacoraConstants} from "../_constants/bitacora.constants";
export const userActions = {
    requestPerPage,
    setPerPageSucces,
    setPagination,
    fillUserUpdate,
    deleteUser,
    deleteUserDo,
    requesUserInSession,
    setUserInSession,
    removeSessionLogIn,
    requestAllUsers,
    setUsersAll,
    setUserPassword,
    requestVigenciaPass,
    setVigenciaPass,
    requestRol,
    setRol,
    requestPermisosSistema,
    setPermisosSistema,
    setProvider,
    requestProvider
};

function requestAllUsers(){
    return {
        type :  userConstants.USERS_GETALL,
    }
}

function requesUserInSession(token){
    return{
        type : userConstants.USER_REQUEST_SESSION_SET,
        token
    }
}

function setUserInSession(user){
    return{
        type : userConstants.USER_SESSION_SET,
        user
    }
}

function removeSessionLogIn(){
    return{
        type: userConstants.USER_SESSION_REMOVE
    }
}
function deleteUser(id){
    return{
        type: userConstants.DELETE_REQUEST,
        id
    }
}


function deleteUserDo(id){
    return{
        type: userConstants.DELETE_OPERATION,
        id
    }
}

function fillUserUpdate(id){
    return {
        type: userConstants.USER_TEMPORAL_REQUEST,
        id
    }
}

function requestPerPage(objPaginationReq) {
    return {
        type: userConstants.USERS_PAGINATION_REQUEST,
        objPaginationReq
    };
}

function setPagination(objPagination){
    return {type : userConstants.PAGINATION_SET , objPagination}
}



function setPerPageSucces(users) {
    return {type : userConstants.USERS_PAGINATION_SUCCESS, users}
}

function setUsersAll (users){
    return {type : userConstants.USERS_GETALL_SET, users}
}

function setUserPassword(password){
    return{
        type : userConstants.USER_PASSWORD_SET,
        password
    }
}

function requestVigenciaPass(vigencia){
    return {
        type :  userConstants.REQUEST_VIGENCIA_PASS,
    }
}

function setVigenciaPass (vigencia){
    return {type : userConstants.REQUEST_VIGENCIA_PASS_SET, vigencia}
}

function requestRol(vigencia){
    return {
        type :  userConstants.REQUEST_ROL,
    }
}

function setRol (rol){
    return {type : userConstants.REQUEST_ROL_SET, rol}
}

function requestPermisosSistema(){
    return {
        type :  userConstants.REQUEST_PERMISOS_SISTEMA,
    }
}

function setPermisosSistema (permisos){
    return {type : userConstants.REQUEST_PERMISOS_SISTEMA_SET, permisos}
}

function setProvider(providerUser){
    return {type : userConstants.REQUEST_PROVIDER_SET, providerUser}
}

function requestProvider(){
    return {
        type :  userConstants.REQUEST_PROVIDER,
    }
}