import React from "react";
import { Form } from "react-final-form";
import { TextField, makeValidate, Select, Switches, Checkboxes } from "mui-rff";
import { Grid, Button, Tooltip } from "@mui/material";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { requestCreationUser, requestEditUser } from "../../store/mutations";
//import { css } from "@emotion/core";
//import ClipLoader from "react-spinners/ClipLoader";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
//import {alertActions} from "../../_actions/alert.actions";
import { history } from "../../store/history";
import { OnChange } from "react-final-form-listeners";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";

const CreateUser = ({ id, user, alert, providers }) => {
  return (
    <MyForm initialValues={user} id={id} alerta={alert} providers={providers} />
  );
};

function MyForm(props) {
  const { initialValues, id, alerta, providers } = props;
  const alert = alerta;
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = React.useState(false);

  // yes, this can even be async!
  async function onSubmit(values) {
    //alert.status = false;
    setOpenModal(true);
    if (id != undefined) {
      /*let arrsistemas: string[] = [];

            for (let sis in values.sistemas){
                console.log(values.sistemas[sis])
                arrsistemas.push(values.sistemas[sis])
            }
            values["sistemas"]=arrsistemas;*/
      dispatch(requestEditUser({ ...values, _id: id }));
    } else {
      dispatch(requestCreationUser(values));
    }
    setOpenModal(true);
  }
  const schema = Yup.object().shape({
    nombre: Yup.string()
      .matches(
        new RegExp("^[ñáéíóúáéíóúÁÉÍÓÚa'.-zA-Z ]*$"),
        "no se permiten números, ni cadenas vacías",
      )
      .required("El campo nombre es requerido")
      .trim(),
    apellidoUno: Yup.string()
      .matches(
        new RegExp("^[ñáéíóúáéíóúÁÉÍÓÚa'.-zA-Z ]*$"),
        "no se permiten números, ni cadenas vacías",
      )
      .required("El campo Primer apellido es requerido")
      .trim(),
    apellidoDos: Yup.string()
      .matches(
        new RegExp("^[ñáéíóúáéíóúÁÉÍÓÚa'.-zA-Z ]*$"),
        "no se permiten números, ni cadenas vacías",
      )
      .trim(),
    cargo: Yup.string()
      .matches(
        new RegExp("^['A-zÀ-ú ]*$"),
        "no se permiten números, ni cadenas vacías",
      )
      .required("El campo Cargo es requerido")
      .trim(),
    correoElectronico: Yup.string()
      .required("El campo Correo electrónico es requerido")
      .email("Correo no válido"),
    telefono: Yup.string()
      .matches(
        new RegExp("^[0-9]{10}$"),
        "Inserta un número de teléfono válido, 10 caracteres",
      )
      .required("El campo Número de teléfono es requerido")
      .trim(),
    extension: Yup.string()
      .matches(
        new RegExp("^[0-9]{0,10}$"),
        "Inserta un número de extensión valido , máximo 10 caracteres",
      )
      .trim(),
    usuario: Yup.string()
      .matches(
        new RegExp("^[a-zA-Z]{8,}$"),
        "Inserta al menos 8 caracteres, no se permiten caracteres especiales",
      )
      .required("El campo Nombre de usuario es requerido")
      .trim(),
    sistemas: Yup.array()
      .min(1, "El campo Sistemas debe de tener al menos un ítem seleccionado")
      .required("El campo Sistemas aplicables es requerido"),
    proveedorDatos: Yup.string().required(
      "El campo Proveedor de datos es requerido",
    ),
  });

  const validate = makeValidate(schema);
  //const required = makeRequired(schema)

  const { alerta2 } = useSelector((state) => ({
    alerta2: state.alert,
  }));
  //console.log(alerta2);

  /* const handleCloseSnackbar = () => {
        dispatch(alertActions.clear());
    }; */

  const redirectToRoute = (path) => {
    history.push(path);
  };

  let sistemasData = [];
  let sistemaspro = [];
  for (const pro of providers) {
    if (initialValues != undefined) {
      if (pro["value"] == initialValues.proveedorDatos) {
        sistemaspro = pro["sistemas"];
        /* const sistemasNew = [];
        for (const sistema of sistemaspro) {
          if (sistema === "S2") {
            sistemasNew.push({
              label:
                "Sistema de Servidores Públicos que Intervienen en Procedimientos de Contratación",
              value: "S2",
            });
          } else if (sistema === "S3S") {
            sistemasNew.push({
              label: "Sistema de los Servidores Públicos Sancionados",
              value: "S3S",
            });
          } else if (sistema === "S3P") {
            sistemasNew.push({
              label: "Sistema de los Particulares Sancionados",
              value: "S3P",
            });
          }
        } */
        sistemasData = sistemaspro;
      }
    }
  }

  return (
    <div>
      <Grid item xs={12}>
        <Form
          onSubmit={onSubmit}
          initialValues={initialValues}
          validate={validate}
          render={({ handleSubmit, values, submitting }) => (
            <form onSubmit={handleSubmit} noValidate>
              {alerta2.status === undefined && (
                <Card>
                  <CardHeader
                    title="USUARIO"
                    subheader={id != undefined ? "Edición" : "Nuevo registro"}
                  />
                  <Divider />
                  <CardContent>
                    <Grid container>
                      <Grid item xs={12}>
                        <Grid spacing={3} container>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Nombre"
                              name="nombre"
                              required={true}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Primer apellido"
                              name="apellidoUno"
                              required={true}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Segundo apellido"
                              name="apellidoDos"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Cargo"
                              name="cargo"
                              required={true}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            {id != null ? (
                              <TextField
                                label="Correo electrónico"
                                name="correoElectronico"
                                required={true}
                                InputProps={{ readOnly: true }}
                              />
                            ) : (
                              <TextField
                                label="Correo electrónico"
                                name="correoElectronico"
                                required={true}
                              />
                            )}
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Número de teléfono"
                              name="telefono"
                              required={true}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField label="Extensión" name="extension" />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            {id != null ? (
                              <TextField
                                label="Nombre de usuario"
                                name="usuario"
                                required={true}
                                disabled
                                /* InputProps={{ readOnly: true }} */
                              />
                            ) : (
                              <TextField
                                label="Nombre de usuario"
                                name="usuario"
                                required={true}
                              />
                            )}
                          </Grid>
                          {/* {id != null && (
                            <Grid item xs={12} md={6}>
                              <Switches
                                label="Estatus"
                                name="estatus"
                                required={true}
                                data={estatus}
                              />
                            </Grid>
                          )} */}
                          <Grid item xs={12} md={12}>
                            <Select
                              name="proveedorDatos"
                              label="Proveedor de datos"
                              required={true}
                              data={providers}></Select>
                            <OnChange name="proveedorDatos">
                              {(value) => {
                                let sistemasDisponibles = [];
                                for (const prov of providers) {
                                  const obj = prov;
                                  if (value == obj.value) {
                                    sistemasDisponibles = obj.sistemas;
                                  }
                                }
                                sistemasData = sistemasDisponibles;
                              }}
                            </OnChange>
                          </Grid>ñ
                          <Grid item xs={12} md={12}>
                            <Checkboxes
                              name="sistemas"
                              label="Selecciona los formatos correspondientes al proveedor"
                              required={true}
                              data={sistemasData}
                              multiple={true}></Checkboxes>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Grid spacing={3} container justifyContent="flex-start">
                      <Grid item sx={{ margin: 1 }}>
                        <Button
                          variant="contained"
                          type="submit"
                          disabled={submitting}>
                          Guardar
                        </Button>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              )}
              <div className="sweet-loading">
                {alert.status != undefined && (
                  <div>
                    <Grid item xs={12}>
                      <Typography
                        variant={"h5"}
                        paragraph
                        color={"primary"}
                        align={"center"}>
                        <b>Cargando ...</b>
                      </Typography>
                    </Grid>
                  </div>
                )}
                {/* <ClipLoader
                    css={override}
                    size={150}
                    color={"#123abc"}
                    loading={alert.status === undefined ? false : !alert.status }
                /> */}
              </div>
              <pre>{alert.status}</pre>
            </form>
          )}
        />
      </Grid>
      <Dialog
        disableEscapeKeyDown
        open={openModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Resultado"}</DialogTitle>
        <DialogContent>
          <DialogContent id="alert-dialog-description">
            <Typography noWrap variant="h6">
              {alerta2.message}
            </Typography>
          </DialogContent>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!alerta2.status}
            onClick={() => redirectToRoute("/usuarios")}
            color="primary"
            autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function mapStateToProps(state, ownProps) {
  const alert = state.alert;
  const providers = state.providersEnabled;
  if (ownProps.match != undefined) {
    const id = ownProps.match.params.id;
    const user = state.users.find((user) => user._id === id);
    const idUser = state.setUserInSession;
    return {
      id,
      user,
      alert,
      providers,
      idUser,
    };
  } else {
    return { alert, providers };
  }
}

function mapDispatchToProps() {
  return {};
}

export const ConnectedCreateUser = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateUser);
