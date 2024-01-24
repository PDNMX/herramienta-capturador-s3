import { providerConstants } from "../_constants/provider.constants";

export function providers(state = [], action) {
    switch (action.type) {
        case providerConstants.PROVIDERS_PAGINATION_SUCCESS:
            return action.providers;
        case providerConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case providerConstants.DELETE_OPERATION:
            for(let i =0 ; i < state.length; i++){
                if(state[i]._id === action.id){
                    state.splice(i,1);
                }
            }
            return state;
        case providerConstants.DELETE_SUCCESS:
            // remove deleted user from state
            return {
                items: state.items.filter(provider => provider.id !== action.id)
            };
        case providerConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to user
            return {
                ...state,
                items: state.items.map(provider => {
                    if (provider.id === action.id) {
                        // make copy of user without 'deleting:true' property
                        const { deleting, ...providerCopy } = provider;
                        // return copy of user with 'deleteError:[error]' property
                        return { ...providerCopy, deleteError: action.error };
                    }

                    return provider;
                })
            };
        default:
            return state
    }
}
