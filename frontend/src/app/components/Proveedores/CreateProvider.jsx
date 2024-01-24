import React from "react";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/mui";
import { useDispatch, connect } from "react-redux";

import {
  requestCreationProvider,
  requestEditProvider,
} from "../../store/mutations";
import { history } from "../../store/history";
import {
  DialogContent,
  DialogActions,
  Dialog,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";

const CreateProvider = ({
  id,
  provider,
  alert,
}) => {
  return <Proveedor initialValues={provider} id={id} alerta={alert} />;
};

function Proveedor(props) {
  const { initialValues, id, alerta } = props;
  const alert = alerta;
  //alert.status = false;
  //const [loaderDisplay, setLoaderDisplay] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const schema = {
    type: "object",
    required: ["dependencia", "sistemas"],
    properties: {
      dependencia: {
        type: "string",
        title: "Nombre del proveedor",
      },
      sistemas: {
        type: "array",
        title: "Sistemas del proveedor",
        description:
          "Selecciona los sistemas que se podrán usar con el proveedor",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["S2", "S3S", "S3P"],
          enumNames: [
            "Servidores Públicos que Intervienen en Procedimientos de Contratación (S2)",
            "Servidores Públicos Sancionados (S3)",
            "Particulares Sancionados (S3)",
          ],
        },
      },
    },
  };

  const uiSchema = {
    "ui:submitButtonOptions": {
      submitText: "Guardar",
      props: {
        className: "btn btn-info",
        size: "large",
      },
    },
    dependencia: {
      "ui:autofocus": true,
      props: {
        fullWidth: true,
      },
    },
    sistemas: {
      "ui:widget": "checkboxes",
    },
  };

  const dispatch = useDispatch();
  const redirectToRoute = (path) => {
    history.push(path);
  };

  const handleSubmit = ({ formData }) => {
    if (id != undefined) {
      dispatch(requestEditProvider({ ...formData, _id: id }));
    } else {
      dispatch(requestCreationProvider(formData));
    }
    setOpen(true)
    //setLoaderDisplay(true);
  };

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="PROVEEDOR DE DATOS"
            subheader={id != undefined ? "Edición" : "Nuevo registro"}
          />
          <Divider />
          <CardContent>
            <Grid container>
              <Grid item xs={12}>
                <Form
                  schema={schema}
                  validator={validator}
                  /* onChange={log('changed')} */
                  onSubmit={handleSubmit}
                  /* onError={log("errors")} */
                  uiSchema={uiSchema}
                  formData={initialValues}
                  liveOmit={true}
                  showErrorList={false}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Dialog
          disableEscapeKeyDown
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
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
              onClick={() => redirectToRoute("/proveedores")}
              color="primary"
              autoFocus>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}

function mapStateToProps(state, ownProps) {
  const alert = state.alert;
  if (ownProps.match != undefined) {
    const id = ownProps.match.params.id;
    const provider = state.providers.find((provider) => provider._id === id);
    return {
      id,
      provider,
      alert,
    };
  } else {
    return { alert };
  }
}

function mapDispatchToProps() {
  return {};
}

export const ConnectedCreateProvider = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateProvider);
