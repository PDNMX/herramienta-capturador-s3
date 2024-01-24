import { catalogConstants } from "../_constants/catalogs.constants";

export function catalogs(state = {genero: [], ramo: [], puesto: [] ,tipoSancion : [], moneda : [] , tipoDoc: [], tipoPersona: [], paises:[], estados:[] ,vialidades:[], municipios: [], localidades:[] }, action) {
    switch (action.type) {
        case catalogConstants.GENERO_SET:
            return {...state , genero : action.generos};
        case catalogConstants.RAMO_SET:
            return {...state , ramo : action.ramos};
        case catalogConstants.PUESTO_SET:
            return {...state , puesto : action.puestos};
        case catalogConstants.TIPO_AREA_SET:
            return {...state , tipoArea : action.areas};
        case catalogConstants.NIVEL_RESPONSABILIDAD_SET:
            return {...state, nivelResponsabilidad : action.niveles}
        case catalogConstants.TIPO_PROCEDIMIENTO_SET:
            return {...state , tipoProcedimiento : action.procedimientos}
        case catalogConstants.TIPO_FALTA_SET:
            return {...state , tipoFalta : action.falta}
        case catalogConstants.TIPO_SANCION_SET:
            return {...state , tipoSancion : action.sancion}
        case catalogConstants.MONEDA_SET:
            return {...state , moneda : action.moneda}
        case catalogConstants.TIPO_DOCUMENTO_SET:
            return {...state , tipoDoc : action.tipoDoc}
        case catalogConstants.TIPO_PERSONA_SET:
            return {...state , tipoPersona : action.persona}
        case catalogConstants.PAIS_SET:
            return {...state , paises : action.pais}
        case catalogConstants.ESTADO_SET:
            return {...state , estados : action.estado}
        case catalogConstants.MUNICIPIO_SET:
            return {...state , municipios : action.municipio}
        case catalogConstants.LOCALIDAD_SET:
            return {...state , localidades : action.localidad}
        case catalogConstants.VIALIDAD_SET:
            return {...state , vialidades : action.vialidad}

        default:
            return state
    }
}
