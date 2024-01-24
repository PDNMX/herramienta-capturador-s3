import React from "react";

import { Grid } from "@mui/material";
import { S2Actions } from "../../_actions/s2.action";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
import { history } from "../../store/history";
import { useDispatch } from "react-redux";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { alertActions } from "../../_actions/alert.actions";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import esquemaS3Sv2 from "./jsonschemas-rjsf/s2v2";
import uiS2v2 from "./uiSchemas/s2v2";
import formats from "./customFormats";

//import validator from '@rjsf/validator-ajv8';
import Form from "@rjsf/mui";
import { customizeValidator } from "@rjsf/validator-ajv8";
import spanishLocalizer from "ajv-i18n/localize/es";

const CreateReg = ({ id, alert, catalogos, registry }) => {
  return (
    <MyForm
      initialValues={registry}
      catalogos={catalogos}
      alerta={alert}
      id={id}
    />
  );
};


function MyForm(props) {
  const { initialValues, alerta, id } = props;
  const alert = alerta;
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  console.log(initialValues);

  //const validate = makeValidate(schema);
  //const required = makeRequired(schema)

  const redirectToRoute = (path) => {
    history.push(path);
    dispatch(alertActions.clear());
  };

  const onSubmit = (formData) => {
    console.log("Data submitted: ", formData);
    if (id != undefined) {
      dispatch(S2Actions.requestEditDo({ ...formData, _id: id }));
    } else {
      dispatch(S2Actions.requestCreationS2v2(formData));
    }
    setOpen(true);
  };

  const schema = esquemaS3Sv2;
  const uiSchema = uiS2v2;
  const customFormats = formats;

  const validator = customizeValidator({ customFormats }, spanishLocalizer);

  const handleChange = (formData) => {
    console.log(formData);
  };

  function transformErrors(errors) {
    return errors.map((error) => {
      if (error.property === '.procedimientos.tipoArea.areas') {
        error.message = 'Error en tipo Áreas';
      }
      return error;
    });
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title="SISTEMA DE SERVIDORES PÚBLICOS QUE INTERVENGAN EN PROCEDIMIENTOS DE CONTRATACIONES"
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
                onSubmit={onSubmit}
                /* onError={log("errors")} */
                uiSchema={uiSchema}
                formData={initialValues}
                omitExtraData={false}
                liveOmit={true}
                liveValidate={false}
                noHtml5Validate={true}
                showErrorList={false}
                transformErrors={transformErrors}
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
            disabled={!alert.status}
            onClick={() => redirectToRoute("/consulta/S2v2")}
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

export const ConnectedCreateRegv2 = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateReg);
