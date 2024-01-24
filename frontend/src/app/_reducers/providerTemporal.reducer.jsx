import {providerConstants} from "../_constants/provider.constants";

export function providerSelect(state = [], action) {
    switch (action.type) {
        case providerConstants.PROVIDERS_GETALL_SET:
            return action.providers;
        default:
            return state
    }
}
