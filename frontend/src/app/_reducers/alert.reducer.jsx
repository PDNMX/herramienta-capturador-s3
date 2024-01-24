import { alertConstants } from '../_constants/alert.constants';

export function alert(state = {}, action) {
    switch (action.type) {
        case alertConstants.SUCCESS:
            return {
                type: 'success',
                message: action.message,
                status: true
            };
        case alertConstants.ERROR:
            return {
                type: 'error',
                message: action.message,
                status: true
            };
        case alertConstants.CLEAR:
            return {};
        default:
            return state
    }
}
