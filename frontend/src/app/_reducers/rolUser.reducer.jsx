import {userConstants} from "../_constants/user.constants";

export function rol(state = [], action) {
    switch (action.type) {
        case userConstants.REQUEST_ROL_SET:
            return action.rol;
        default:
            return state
    }
}