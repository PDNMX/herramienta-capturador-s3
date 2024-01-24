import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import makeStyles from "@mui/styles/makeStyles";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import { Form } from "react-final-form";
import { requestTokenAuth } from "../../store/mutations";
import { TextField, makeValidate } from "mui-rff";

import * as Yup from "yup";
import { Snackbar, Link } from "@mui/material";
import { Alert } from "@mui/material";
import { alertActions } from "../../_actions/alert.actions";
import { history } from "../../store/history";

export const LoginV = () => {
  return <MyForm initialValues={{ username: "", password: "" }} />;
};

function MyForm(props) {
  const { initialValues } = props;

  const style = makeStyles((theme) => ({
    gridpadding: {
      padding: "30px",
    },

    container1: {
      paddingTop: "75px",
      paddingBottom: "75px",
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      position: "relative",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      backgroundSize: "cover",
    },

    root: {
      maxWidth: 1200,
      margin: "0 auto",
    },
    paper: {
      //marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      //paddingTop: '-100px'
    },
    field: {
      width: "100%",
    },
    item2: {
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },

    fontblack: {
      color: "#666666",
    },
    purpleText: {
      color: "#FFFFFF",
    },

    avatar: {
      margin: theme.spacing(1),
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(2),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      backgroundColor: "#34b3eb",
      color: "#666666",
    },
    logo: {
      margin: "auto",
      display: "block",
      maxWidth: "15%",
      maxHeight: "15%",
    },
    textfield: {
      "&.Mui-focused fieldset": {
        borderColor: "#666666",
      },
      "& label.Mui-focused": {
        color: "#666666",
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: "#34b3eb",
      },
      "& .MuiOutlinedInput-root": {
        "&:hover fieldset": {
          borderColor: "#34b3eb",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#34b3eb",
        },
      },
    },
    boton: {
      backgroundColor: "#ffe01b",
      color: "#666666",
    },
  }));

  const { alerta } = useSelector((state) => ({
    alerta: state.alert,
  }));

  const dispatch = useDispatch();

  const handleCloseSnackbar = () => {
    dispatch(alertActions.clear());
  };

  const { alert } = useSelector((state) => ({
    alert: state.alert,
  }));

  const schema = Yup.object().shape({
    username: Yup.string().required("El Usuario es requerido").trim(),
    password: Yup.string().required("La Contraseña es requerida").trim(),
  });

  const validate = makeValidate(schema);
  //const required = makeRequired(schema)

  // yes, this can even be async!
  async function onSubmit(values) {
    alert.status = false;
    dispatch(requestTokenAuth(values));
  }

  const redirectToRoute = (path) => {
    history.push(path);
  };

  const classes = style();

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alerta.status}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={alerta.type}>
          {alerta.message}
        </Alert>
      </Snackbar>

      <Grid
        container
        spacing={0}
        className={classes.container1}
        justifyContent="center">
        <Grid
          item
          xs={12}
          md={6}
          className={classes.item2}
          container
          direction="row"
          justifyContent="center"
          alignItems="center">
          <Typography
            variant="h4"
            paragraph
            className={classes.fontblack}
            style={{ fontWeight: 600 }}>
            Sistema de Captura de Información
          </Typography>
        </Grid>
      </Grid>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography className={classes.fontblack} component="h1" variant="h5">
            Inicio de sesión
          </Typography>

          <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={validate}
            render={({ handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit} noValidate>
                <Grid className={classes.gridpadding} spacing={3} container>
                  <Grid item xs={12} md={12}>
                    <TextField
                      label="Usuario"
                      name="username"
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      label="Contraseña"
                      name="password"
                      type="password"
                      required={true}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
                    <Button
                      size="large"
                      variant="contained"
                      type="submit"
                      disabled={submitting}>
                      Entrar
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
                    <Link
                      underline="hover"
                      component="button"
                      variant="body2"
                      onClick={() => redirectToRoute("/restaurar-contraseña")}>
                      Restablecer Contraseña
                    </Link>
                  </Grid>
                </Grid>
              </form>
            )}
          />
        </div>
      </Container>
    </div>
  );
}
