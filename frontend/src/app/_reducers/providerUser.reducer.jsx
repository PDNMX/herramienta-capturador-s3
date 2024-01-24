import {userConstants} from "../_constants/user.constants";

export function providerUser(state = [], action) {
    switch (action.type) {
        case userConstants.REQUEST_PROVIDER_SET:
            return action.providerUser;
        default:
            return state
    }
}