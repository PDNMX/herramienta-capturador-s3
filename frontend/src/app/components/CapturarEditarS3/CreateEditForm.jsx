import React from "react";

import { S2Actions } from "../../_actions/s2.action";
import { connect } from "react-redux";
import { history } from "../../store/history";
import { useDispatch } from "react-redux";
import { alertActions } from "../../_actions/alert.actions";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import formats from "./customFormats";
import Form from "@rjsf/mui";
import { customizeValidator } from "@rjsf/validator-ajv8";
import spanishLocalizer from "ajv-i18n/localize/es";

import rutasRedirect from "../RutasRedirect";
/* import data from "./customFormats"; */

const CreateEdit = ({ id, alert, catalogos, registry, schema, uiSchema, tipoForm }) => {
  return (
    <MyForm
      initialValues={registry}
      catalogos={catalogos}
      alerta={alert}
      id={id}
      schema={schema} // Pasando el schema como prop
      uiSchema={uiSchema} // Pasando uiSchema como prop
      tipoForm={tipoForm}
    />
  );
};

function MyForm(props) {
  const { initialValues, alerta, id, schema, uiSchema, tipoForm } = props;
  const alert = alerta;
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  console.log(rutasRedirect[tipoForm])

  const redirectToRoute = (path) => {
    history.push(path);
    dispatch(alertActions.clear());
  };

  const onSubmit = (values) => {
    let formData = values.formData;
    if (id != undefined) {
      dispatch(S2Actions.requestEditDo({ ...formData, _id: id }));
    } else {
      dispatch(S2Actions.requestCreationS2v2(formData, tipoForm));
    }
    setOpen(true);
  };

  const customFormats = formats;
  const validator = customizeValidator({ customFormats }, spanishLocalizer);

  const handleChange = ({ formData }) => console.log(formData);

  /* function transformErrors(errors) {
    return errors.map((error) => {
      if (error.property === '.procedimientos.tipoArea.areas') {
        error.message = 'Error en tipo Áreas';
      }
      return error;
    });
  } */
  const dataEjemplo = {
    "absNoGrave": {
        "segundoApellido": {
            "sinSegundoApellido": false,
            "valor": "gomez"
        },
        "entePublico": {
            "nivelOrdenGobierno": {
                "clave": "FEDERAL"
            },
            "entidadFederativa": {
                "clave": "09",
                "valor": "Ciudad de México"
            },
            "ambitoPublico": "LEGISLATIVO",
            "nombre": "instrituto nacional de transparencia",
            "siglas": "*inai"
        },
        "empleoCargoComision": {
            "nombre": {
                "clave": "DIRECCION_DE_AREA_U_HOMOLOGO"
            },
            "nivel": "departamento de sistemas de intomacón",
            "areaAdscripcion": "subdirección de adquisicioness"
        },
        "origenInvestigacion": {
            "clave": "AUDITORIA_OIC"
        },
        "faltaCometida": [
            {
                "articuloNormatividad": [
                    "45"
                ],
                "fraccionNormatividad": [
                    "76"
                ],
                "clave": "ATENDER",
                "descripcionHechos": "peculado",
                "nombreNormatividad": "aaaaa"
            }
        ],
        "resolucion": {
            "documentoResolucion": "sentencia final",
            "fechaResolucion": "2020-05-06",
            "fechaNotificacion": "2020-08-08",
            "url": "www.sjadashjk.com",
            "descripcionAbstención": "sin pruebas suficientes"
        },
        "tipoSancion": {
            "autoridadResolutora": "secretaria de la función pública",
            "autoridadInvestigadora": "secretaria de la función pública",
            "autoridadSubstanciadora": "secretaria de la función pública"
        },
        "nombres": "Juan",
        "primerApellido": "rodriguez",
        "curp": "perg850101hdf",
        "rfc": "perg850101hdf",
        "sexo": "HOMBRE",
        "observaciones": "fyi...."
    },
    "expediente": "3"
}


  return (
    <Grid item xs={12}>
      <Card>
        {/* <CardHeader title="FORMATO QUE INDICA LOS DATOS QUE SE INSCRIBIRÁN EN EL SISTEMA NACIONAL DE SERVIDORES PÚBLICOS Y PARTICULARES SANCIONADOS DE LA PLATAFORMA DIGITAL NACIONAL RELACIONADOS CON LAS SANCIONES QUE SE ENCUENTREN FIRMES IMPUESTAS A PERSONAS SERVIDORAS PÚBLICAS POR LA COMISIÓN DE FALTAS ADMINISTRATIVAS GRAVES EN TÉRMINOS DE LA LEY GENERAL DE RESPONSABILIDADES ADMINISTRATIVAS." />
        <Divider /> */}
        <CardHeader
          title={
            id != undefined
              ? "Edición"
              : "Nuevo registro"
          }
        />
        <Divider />
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              <Form
                schema={schema}
                validator={validator}
                onChange={handleChange}
                onSubmit={onSubmit}
                /* onError={log("errors")} */
                uiSchema={uiSchema}
                formData={initialValues}
                omitExtraData={false}
                liveOmit={true}
                liveValidate={false}
                noHtml5Validate={true}
                showErrorList={false}
                /* transformErrors={transformErrors} */
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Dialog
        disableEscapeKeyDown
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"xs"}>
        {/* <DialogTitle id="alert-dialog-title">{"Resultado"}</DialogTitle> */}
        <DialogContent>
          <DialogContent id="alert-dialog-description">
            <Typography noWrap variant="h6">
              {alert.message}
            </Typography>
          </DialogContent>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            disabled={!alert.status}
            onClick={() => redirectToRoute(rutasRedirect[tipoForm])}
            color="primary"
            autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

function mapStateToProps(state, ownProps) {
  const alert = state.alert;
  const catalogos = state.catalogs;
  if (ownProps.match != undefined) {
    const id = ownProps.match.params.id;
    const registry = state.S2.find((reg) => reg._id === id);
    return {
      id,
      registry,
      alert,
      catalogos,
    };
  } else {
    return { alert, catalogos };
  }
}

function mapDispatchToProps() {
  return {};
}

export const CreateEditForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateEdit);
