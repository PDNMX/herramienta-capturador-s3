import { S3PConstants } from '../_constants/s3p.constants';
import {S2Constants} from "../_constants/s2.constants";

export const S3PActions = {
    requestCreationS3P,
    setpaginationS3P,
    requestListS3P,
    setListS3P,
    deleteRecordRequest,
    deleteRecordDo,
    fillRegEdit,
    requestEditDo,
    setclearS3P
};

function requestEditDo(values){
    return { type: S3PConstants.UPDATE_REG_S3P, values };
}

function fillRegEdit(id){
    return {type: S3PConstants.FILL_REG_S3P_EDIT, id }
}
function deleteRecordRequest(id){
    return {type: S3PConstants.DELETE_REQUESTS3P, id }
}

function deleteRecordDo(id){
    return {type: S3PConstants.DELETE_OPERATIONS3P, id }
}

function requestListS3P(filters) {
    return { type: S3PConstants.REQUEST_LIST_S3P, filters };
}

function setListS3P(list) {
    return { type: S3PConstants.SET_LIST_S3P, list };
}

function requestCreationS3P(values) {
    return { type: S3PConstants.REQUEST_CREATION_S3P, values };
}

function setpaginationS3P(pagination) {
    return { type: S3PConstants.PAGINATION_SET_SCHEMAS3P, pagination };
}

function setclearS3P(){
    return { type: S3PConstants.SET_CLEAR_S3P}
}
