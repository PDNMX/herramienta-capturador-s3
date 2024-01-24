import {S2Constants} from "../_constants/s2.constants";

export function S2(state = [] ,action){
    switch (action.type){
        case S2Constants.SET_LIST_S2 :
            return  action.list;
        case S2Constants.SET_CLEAR_S2:
            return [];
        case S2Constants.DELETE_OPERATIONS2:
            let array = [];
            if(Array.isArray(action.id)){
                for(let i =0 ; i < state.length; i++){
                    if( action.id.indexOf(state[i]._id.trim()) === -1 ){
                        array.push(state[i]);
                    }
                }
                state=array;
            }else{
                for(let i =0 ; i < state.length; i++){
                    if(state[i]._id === action.id){
                        state.splice(i,1);
                    }
                }
            }

            return state;
    }
    return state;
}
