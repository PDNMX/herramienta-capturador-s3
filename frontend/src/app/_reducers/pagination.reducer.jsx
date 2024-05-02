import { S2Constants } from "../_constants/s2.constants";

export function pagination(state = {}, action) {
    switch (action.type) {
        case S2Constants.PAGINATION_SET_SCHEMA2:
            return action.pagination;
        default:
            return state

    }
}
