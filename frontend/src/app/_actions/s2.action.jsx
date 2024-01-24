import { S2Constants } from '../_constants/s2.constants';

export const S2Actions = {
    requestCreationS2,
    setpaginationS2,
    requestListS2,
    setListS2,
    deleteRecordRequest,
    deleteRecordDo,
    fillRegEdit,
    requestEditDo,
    setclearS2,
    /* v2 */
    requestCreationS2v2
};

function requestEditDo(values){
    return { type: S2Constants.UPDATE_REG_S2, values };
}

function fillRegEdit(id){
    return {type: S2Constants.FILL_REG_S2_EDIT, id }
}
function deleteRecordRequest(id){
    return {type: S2Constants.DELETE_REQUESTS2, id }
}
function deleteRecordDo(id){
    return {type: S2Constants.DELETE_OPERATIONS2, id }
}

function requestListS2(filters) {
    return { type: S2Constants.REQUEST_LIST_S2, filters };
}

function setListS2(list) {
    return { type: S2Constants.SET_LIST_S2, list };
}

function requestCreationS2(values) {
    return { type: S2Constants.REQUEST_CREATION_S2, values };
}

function setpaginationS2(pagination) {
    return { type: S2Constants.PAGINATION_SET_SCHEMA2, pagination };
}

function setclearS2(){
    return { type: S2Constants.SET_CLEAR_S2}
}

/* v2 */
function requestCreationS2v2(values) {
    return { type: S2Constants.REQUEST_CREATION_S2v2, values };
}

