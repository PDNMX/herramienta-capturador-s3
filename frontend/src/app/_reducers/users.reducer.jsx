import { userConstants } from "../_constants/user.constants";

export function users(state = [], action) {
    switch (action.type) {
        case userConstants.USERS_PAGINATION_SUCCESS:
            return action.users;
        case userConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case userConstants.DELETE_OPERATION:
            for(let i =0 ; i < state.length; i++){
                if(state[i]._id === action.id){
                    state.splice(i,1);
                }
            }
            return state;
        case userConstants.DELETE_SUCCESS:
            // remove deleted user from state
            return {
                items: state.items.filter(user => user.id !== action.id)
            };
        case userConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to user
            return {
                ...state,
                items: state.items.map(user => {
                    if (user.id === action.id) {
                        // make copy of user without 'deleting:true' property
                        const { deleting, ...userCopy } = user;
                        // return copy of user with 'deleteError:[error]' property
                        return { ...userCopy, deleteError: action.error };
                    }

                    return user;
                })
            };
        default:
            return state
    }
}
