import {userConstants} from "../_constants/user.constants";

export function userSelect(state = [], action) {
    switch (action.type) {
        case userConstants.USERS_GETALL_SET:
            return action.users;
        default:
            return state
    }
}
