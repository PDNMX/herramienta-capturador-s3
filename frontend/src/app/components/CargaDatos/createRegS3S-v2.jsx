import React from 'react';

import { connect } from 'react-redux';
//import { history } from '../../store/history';
import { useDispatch } from 'react-redux';
import { alertActions } from '../../_actions/alert.actions';
import { S3SActions } from '../../_actions/s3s.action';

import {Grid, Card, CardContent, CardHeader, Divider} from '@mui/material';

//import schema from './validate.s3s';
//import document from './validate.document';
import esquemaS3Sv2 from './jsonschemas-rjsf/s3Sv2';
import uiS3v2 from './uiSchemas/s3Sv2';

import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/mui';

const CreateReg = ({ id, alert, catalogos, registry }) => {
    const data = { ...registry, tipoSancionArray: [], documents: [] };
    return (
        <MyForm
            initialValues={registry != undefined ? registry : data}
            catalogos={catalogos}
            alerta={alert}
            id={id}
        />
    );
};

function MyForm(props) {
    const { initialValues, alerta: alert, catalogos, id } = props;
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    /*const [errors, setErrors] = React.useState({ tipoSancionElement: {}, documentElement: {} });
 */
    //const validate = makeValidate(schema);
    //const required = makeRequired(schema)

    /* const redirectToRoute = (path) => {
        history.push(path);
        dispatch(alertActions.clear());
    }; */

    // yes, this can even be async!
    const handleSubmit = ({ formData }) => {
        /* console.log(formData); */
        if (id != undefined) {
            console.log(formData);
            dispatch(S3SActions.requestCreationS3S({ ...formData, _id: id }));
        } else {
            dispatch(S3SActions.requestCreationS3S(formData));
        }
        setOpen(true);
    }

    const schema = esquemaS3Sv2;
    const uiSchema = uiS3v2;
    //console.log(initialValues);
    const log = (type) => console.log.bind(console, type);
    const handleChange = ({ formData}) => console.log(formData);

    const dataPrueba = {"expediente":"123","tipoDeFalta":"NO_GRAVE","faltaNoGrave":{"nombres":"aaaa","primerApellido":"aaaa","segundoApellido":{"sinSegundoApellido":true},"curp":"aaaa","rfc":"aaaa","sexo":"FEMENINO","entePublico":{"ambitoGobierno":{"clave":"MUNICIPAL_ALCALDIA"},"poderOrganoGobierno":"JUDICIAL","nombre":"aaaaa","siglas":"aaaa"},"empleoCargoComision":{"nombre":{"clave":"COORDINACION_DIRECCIÓN_DE_AREA_U_HOMOLOGO"},"nivel":"aaaa","areaAdscripcion":"aaaaa"},"origenInvestigacion":{"clave":"AUDITORIA_OIC"},"faltaCometida":[{"clave":"ATENDER","nombreNormatividadInfringida":"aaaaa","articuloNormatividadInfringida":["2"],"fraccionNormatividadInfringida":["3"]}],"resolucion":{"documentoResolucion":"aaa","fechaResolucion":"1900-12-12","fechaNotificacion":"1900-12-12","fechaResolucionFirme":"1900-12-12","url":"aaaaaa"},"autoridadSancionadora":"aaaaa","tipoSancion":[{"clave":"AMONESTACION","descripcion":"aaaaa","amonestacionPublicaPrivada":{"tipoAmonestacion":"PUBLICO","constancia":{"sinConstancia":true}}}],"observaciones":"aaaaaa"}}
    //const dataPrueba = {"expediente":"123","tipoDeFalta":"GRAVE","faltaGrave":{"nombres":"aaa","primerApellido":"aaaa","segundoApellido":{"sinSegundoApellido":false,"valor":"aaa"},"curp":"aaa","rfc":"aaa","sexo":"MASCULINO","entePublico":{"ambitoGobierno":{"clave":"ESTATAL"},"poderOrganoGobierno":"ORGANO_AUTONOMO","nombre":"aaa","siglas":"aaa"},"empleoCargoComision":{"nombre":{"clave":"ENLACE_U_HOMOLOGO"},"nivel":"aaa","areaAdscripcion":"aaa"},"origenInvestigacion":{"clave":"AUDITORIA_OIC"},"faltaCometida":[{"clave":"DESVIO_RECURSOS","nombreNormatividadInfringida":"aaa","articuloNormatividadInfringida":[111],"fraccionNormatividadInfringida":[222]}],"resolucion":{"documentoResolucion":"aaa","fechaResolucion":"2020-11-11","fechaNotificacion":"2021-11-11","fechaResolucionFirme":"2022-11-11","url":"aaa"},"autoridadSancionadora":"aaa","ordenJurisdiccionalSancion":"ESTATAL","tipoSancion":[{"clave":"OTRO","valor":"aaa","descripcion":"aaa","otro":{"nombre":"aaa","urlDocumento":"aaa"}}],"observaciones":"aaa"}}
    return (
        <Grid item xs={12}>
            <Card>
                <CardHeader
                    title="Servidores públicos de la Administración Pública Federal que intervienen en procedimientos de contrataciones públicas"
                    subheader={id != undefined ? "Edición" : "Nuevo registro"}
                />
                <Divider />
            <CardContent>
                <Grid container>
                <Grid item xs={12}>
                <Form
                    schema={schema}
                    validator={validator}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    /* onError={log('errors')} */
                    uiSchema={uiSchema}
                    formData={dataPrueba}
                    omitExtraData={true}
                    liveOmit={false}
                    liveValidate={false}
                    noHtml5Validate={true}
                    showErrorList={false}
                />
                </Grid>
                </Grid>
            </CardContent>       
            </Card>
            
        </Grid>
    );
}

function mapStateToProps(state, ownProps) {
    const alert = state.alert;
    const catalogos = state.catalogs;
    if (ownProps.match != undefined) {
        const id = ownProps.match.params.id;
        const registry = state.S3S.find((reg) => reg._id === id);
        return {
            id,
            registry,
            alert,
            catalogos
        };
    } else {

        return { alert, catalogos };
    }
}

function mapDispatchToProps() {
    return {};
}

export const ConnectedCreateRegS3Sv2 = connect(mapStateToProps, mapDispatchToProps)(CreateReg);
