import {providerConstants} from "../_constants/provider.constants";

export function providersEnabled(state = [], action) {
    switch (action.type) {
        case providerConstants.PROVIDERS_GETALL_ENABLED_SET:
            return action.providersEnabled;
        default:
            return state
    }
}
