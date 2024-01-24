import { Form } from "react-final-form";
import { TextField, makeValidate } from "mui-rff";
import {
  Grid,
  Button,
  CardActions,
} from "@mui/material";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  requestChangePassword,
  requestEditUser,
} from "../../store/mutations";
//import { css } from "@emotion/core";
//import ClipLoader from "react-spinners/ClipLoader";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
import { history } from "../../store/history";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";

const ChangePassword = ({ id, user, alert }) => {
  return <MyForm initialValues={user} id={id} alerta={alert} />;
};


/* const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`; */

function MyForm(props) {
  const { initialValues, id } = props;

  const { alerta } = useSelector((state) => ({
    alerta: state.alert,
  }));

  const dispatch = useDispatch();

  // yes, this can even be async!
  async function onSubmit(values) {
    alerta.status = false;
    if (id != undefined) {
      dispatch(requestEditUser({ ...values, _id: id }));
    } else {
      dispatch(requestChangePassword(values));
    }
  }

  const schema = Yup.object().shape({
    constrasena: Yup.string()
      .matches(
        new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*()_+,.\\\\\\/;':\"-]).{8,}$"),
        "Inserta al menos 8 caracteres, al menos una mayúscula, al menos un número, al menos un carácter especial ",
      )
      .required("El campo Contraseña es requerido")
      .trim(),
    passwordConfirmation: Yup.string()
      .required("Confirmar contraseña es un campo requerido")
      .when("constrasena", (password, field) =>
        password
          ? field
              .required("Confirmar contraseña es un campo requerido")
              .oneOf(
                [Yup.ref("constrasena")],
                "Este campo tiene que coincidir con el campo contraseña",
              )
          : field,
      ),
  });

  const validate = makeValidate(schema);
  //const required = makeRequired(schema)


  const changepassword = () => {
    history.push("/usuario/cambiarcontrasena");
  };

  return (
    <>
      <Dialog
        disableEscapeKeyDown
        open={alerta.status}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogContent>
          <DialogContent id="alert-dialog-description">
            <Typography noWrap variant="h6">
              {alerta.message}
            </Typography>
          </DialogContent>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!alerta.status}
            onClick={() => changepassword()}
            color="primary"
            autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Grid item xs={12}>
        <Card>
          <CardHeader title="Cambiar Contraseña" />
          <Divider />
          <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={validate}
            render={({ handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit} noValidate>
                {alerta.status === undefined && (
                  <>
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Contraseña nueva"
                            name="constrasena"
                            type="password"
                            required={true}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Confirmar contraseña nueva"
                            name="passwordConfirmation"
                            type="password"
                            required={true}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        >
                        <Grid item sx={{ ml:1, mb:2 }}>
                          <Button
                            variant="contained"
                            type="submit"
                            disabled={submitting}>
                            Guardar
                          </Button>
                        </Grid>
                      </Grid>
                    </CardActions>
                  </>
                )}
              </form>
            )}
          />
        </Card>
      </Grid>
    </>
  );
}

function mapStateToProps(state, ownProps) {
  const alert = state.alert;
  if (ownProps.match != undefined) {
    const id = ownProps.match.params.id;
    const user = state.users.find((user) => user._id === id);
    const idUser = state.setUserInSession;
    return {
      id,
      user,
      alert,
      idUser,
    };
  } else {
    return { alert };
  }
}

function mapDispatchToProps() {
  return {};
}

export const ConnectedChangePassword = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangePassword);
