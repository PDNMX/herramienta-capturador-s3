import { catalogConstants } from "../_constants/catalogs.constants";

export const catalogActions = {
    requestCatalogoByType,
    setGeneroSucces,
    setRamoSucces,
    setPuestoSucces,
    requestRamoCatalogo,
    requestPuestoCatalogo,
    requestTipoAreaCatalogo,
    setTipoAreaSucces,
    requestNivelResponsabilidadCatalogo,
    setNivelResponsabilidadSucces,
    requestTipoProcedimientoCatalogo,
    setTipoProcedimientoSucces,
    requestTipoFaltaCatalogo,
    setTipoFaltaSucces,
    requestTipoSancionCatalogo,
    setTipoSancionSucces,
    requestMonedaCatalogo,
    setMonedaSucces,
    requesTipoDocumentoCatalogo,
    setTipoDocumentoSucces,
    requesTipoPersonaCatalogo,
    setTipoPersonaSucces,
    requestPaisCatalogo,
    setPaisSucces,
    requestEstadoCatalogo,
    setEstadoSucces,
    requestMunicipioByEstadoCatalogo,
    setMunicipioSucces,
    setLocalidadSucces,
    requestVialidadCatalogo,
    setVialidadSucces,
};
/*----------------S3P catalogos*****/

function  requesTipoPersonaCatalogo (docType){
    return {
        type : catalogConstants.TIPO_PERSONA_REQUEST,
        docType
    }
}

function setTipoPersonaSucces(persona){
    return {
        type : catalogConstants.TIPO_PERSONA_SET,
        persona
    }
}

function  requestPaisCatalogo (docType){
    return {
        type : catalogConstants.PAIS_REQUEST,
        docType
    }
}

function setPaisSucces(pais){
    return {
        type : catalogConstants.PAIS_SET,
        pais
    }
}

function  requestEstadoCatalogo (docType){
    return {
        type : catalogConstants.ESTADO_REQUEST,
        docType
    }
}

function setEstadoSucces(estado){
    return {
        type : catalogConstants.ESTADO_SET,
        estado
    }
}


function  requestMunicipioByEstadoCatalogo (idEstado){
    return {
        type : catalogConstants.MUNICIPIO_REQUEST,
        idEstado
    }
}

function setMunicipioSucces(municipio){
    return {
        type : catalogConstants.MUNICIPIO_SET,
        municipio
    }
}

function setLocalidadSucces(localidad){
    return {
        type : catalogConstants.LOCALIDAD_SET,
        localidad
    }
}


function  requestVialidadCatalogo (docType){
    return {
        type : catalogConstants.VIALIDAD_REQUEST,
        docType
    }
}

function setVialidadSucces(vialidad){
    return {
        type : catalogConstants.VIALIDAD_SET,
        vialidad
    }
}

/*-------------------S3S catalogos-*/

function  requestTipoFaltaCatalogo (docType){
    return {
        type : catalogConstants.TIPO_FALTA_REQUEST,
        docType
    }
}

function setTipoFaltaSucces(falta){
    return {
        type : catalogConstants.TIPO_FALTA_SET,
        falta
    }
}

function  requestTipoSancionCatalogo (docType){
    return {
        type : catalogConstants.TIPO_SANCION_REQUEST,
        docType
    }
}

function setTipoSancionSucces(sancion){
    return {
        type : catalogConstants.TIPO_SANCION_SET,
        sancion
    }
}


function  requestMonedaCatalogo (docType){
    return {
        type : catalogConstants.MONEDA_REQUEST,
        docType
    }
}

function setMonedaSucces(moneda){
    return {
        type : catalogConstants.MONEDA_SET,
        moneda
    }
}

function  requesTipoDocumentoCatalogo (docType){
    return {
        type : catalogConstants.TIPO_DOCUMENTO_REQUEST,
        docType
    }
}

function setTipoDocumentoSucces(tipoDoc){
    return {
        type : catalogConstants.TIPO_DOCUMENTO_SET,
        tipoDoc
    }
}




/* ------------------S2---------------*/

function  requestTipoProcedimientoCatalogo (docType){
    return {
        type : catalogConstants.TIPO_PROCEDIMIENTO_REQUEST,
        docType
    }
}
function setTipoProcedimientoSucces(procedimientos){
    return {
        type : catalogConstants.TIPO_PROCEDIMIENTO_SET,
        procedimientos
    }
}

function  requestNivelResponsabilidadCatalogo (docType){
    return {
        type : catalogConstants.NIVEL_RESPONSABILIDAD_REQUEST,
        docType
    }
}
function setNivelResponsabilidadSucces(niveles){
    return {
        type : catalogConstants.NIVEL_RESPONSABILIDAD_SET,
        niveles
    }
}

function requestCatalogoByType(docType){
    return {
        type : catalogConstants.GENERO_REQUEST,
        docType
    }
}


function requestRamoCatalogo(docType){
    return {
        type : catalogConstants.RAMO_REQUEST,
        docType
    }
}


function requestPuestoCatalogo(docType){
    return {
        type : catalogConstants.PUESTO_REQUEST,
        docType
    }
}

function requestTipoAreaCatalogo(docType){
    return {
        type : catalogConstants.TIPO_AREA_REQUEST,
        docType
    }
}
function setGeneroSucces(generos){
    return {
        type : catalogConstants.GENERO_SET,
        generos
    }
}
function setRamoSucces(ramos){
    return {
        type : catalogConstants.RAMO_SET,
        ramos
    }
}
function setPuestoSucces(puestos){
    return {
        type : catalogConstants.PUESTO_SET,
        puestos
    }
}
function setTipoAreaSucces(areas){
    return {
        type : catalogConstants.TIPO_AREA_SET,
        areas
    }
}
