import {userConstants} from "../_constants/user.constants";

export function vigencia(state = [], action) {
    switch (action.type) {
        case userConstants.REQUEST_VIGENCIA_PASS_SET:
            return action.vigencia;
        default:
            return state
    }
}