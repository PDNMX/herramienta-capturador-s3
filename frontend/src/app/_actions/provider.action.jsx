import { providerConstants } from '../_constants/provider.constants';
export const providerActions = {
    requestPerPage,
    setPerPageSucces,
    setPagination,
    fillProviderUpdate,
    deleteProvider,
    deleteProviderDo,
    requestAllProviders,
    setProvidersAll,
    requestAllProvidersEnabled,
    setProvidersAllEnable
};

function requestAllProviders(var1){
    return {
      type : providerConstants.PROVIDERS_GETALL,
        var1
    }
}

function deleteProvider(id){
    return{
        type: providerConstants.DELETE_REQUEST,
        id
    }
}

function deleteProviderDo(id){
    return{
        type: providerConstants.DELETE_OPERATION,
        id
    }
}

function fillProviderUpdate(id){
    return {
        type: providerConstants.PROVIDER_TEMPORAL_REQUEST,
        id
    }
}

function requestPerPage(objPaginationReq) {
    return {
        type: providerConstants.PROVIDERS_PAGINATION_REQUEST,
        objPaginationReq
    };
}

function setPagination(objPagination){
    return {type : providerConstants.PAGINATION_SET , objPagination}
}

function setPerPageSucces(providers) {
    return {type : providerConstants.PROVIDERS_PAGINATION_SUCCESS, providers}
}

function setProvidersAll (providers){
    return {type : providerConstants.PROVIDERS_GETALL_SET, providers}
}

function requestAllProvidersEnabled(){
    return {
        type : providerConstants.PROVIDERS_GETALL_ENABLED,
    }
}

function setProvidersAllEnable(providersEnabled){
    return {type : providerConstants.PROVIDERS_GETALL_ENABLED_SET, providersEnabled}
}
