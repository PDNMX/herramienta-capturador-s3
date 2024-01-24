import {userConstants} from "../_constants/user.constants";

export function permisos(state = [], action) {
    switch (action.type) {
        case userConstants.REQUEST_PERMISOS_SISTEMA_SET:
            return action.permisos;
        default:
            return state
    }
}