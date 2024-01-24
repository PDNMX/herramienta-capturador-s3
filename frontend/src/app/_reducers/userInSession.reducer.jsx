import { userConstants } from "../_constants/user.constants";

export function userInSession(state = "", action) {
    switch (action.type) {
        case userConstants.USER_SESSION_SET:
            return action.user;
        default:
            return state
    }
}

