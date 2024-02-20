import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Divider, Stack, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import makeStyles from "@mui/styles/makeStyles";

import { Form } from "react-final-form";
import { requestResetPassword } from "../../store/mutations";
import { TextField, makeValidate } from "mui-rff";
import { Link } from "@mui/material";

import * as Yup from "yup";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import { alertActions } from "../../_actions/alert.actions";
import { history } from "../../store/history";

import Card from "@mui/material/Card";
import AuthFooter from "./AuthFooter";
import { useTheme } from "@mui/material/styles";

import logoS3 from "../../../../public/ico_s3.svg";

export const ResetPasswordV = () => {
  return <MyForm initialValues={{ correo: "" }} />;
};

function MyForm(props) {
  const { initialValues } = props;

  const style = makeStyles(() => ({
    fontblack: {
      color: "#666666",
    },
    root: {
      backgroundColor: "#eef2f6",
      minHeight: "100vh",
    },
  }));

  const { alerta } = useSelector((state) => ({
    alerta: state.alert,
  }));

  const dispatch = useDispatch();

  const handleCloseSnackbar = () => {
    dispatch(alertActions.clear());
  };

  const redirectToRoute = (path) => {
    history.push(path);
  };

  const { alert } = useSelector((state) => ({
    alert: state.alert,
  }));

  const schema = Yup.object().shape({
    correo: Yup.string().required("El Correo es requerido").email(),
  });

  const validate = makeValidate(schema);
  //const required = makeRequired(schema)

  // yes, this can even be async!
  async function onSubmit(values) {
    alert.status = false;
    dispatch(requestResetPassword(values));
  }

  const classes = style();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{ minHeight: "100vh" }}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={alerta.status}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={alerta.type}>
            {alerta.message}
          </Alert>
        </Snackbar>
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: "calc(100vh - 68px)" }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <Card
                sx={{
                  maxWidth: { xs: 400, lg: 475 },
                  margin: { xs: 2.5, md: 3 },
                  "& > *": {
                    flexGrow: 1,
                    flexBasis: "50%",
                  },
                  textAlign: "center",
                  borderBottom: "0.3rem solid #9085DA",
                }}>
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                  justifyContent="center">
                  <Grid item sx={{ mb: 3 }}>
                    <Link to="#"></Link>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction={matchDownSM ? "column-reverse" : "row"}
                      alignItems="center"
                      justifyContent="center">
                      <Grid item>
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}
                          ml={1}
                          mr={1}>
                          <img src={logoS3} alt="logo-s3" height={120} />
                          <Typography
                            variant="h4"
                            className={classes.fontblack}>
                            Herramienta de captura de información del <br/>Sistema nacional de servidores públicos y particulares sancionados
                          </Typography>
                          <Typography
                            className={classes.fontblack}
                            variant="subtitle1">
                            Introduce tu correo electrónico
                          </Typography>
                          <Form
                            onSubmit={onSubmit}
                            initialValues={initialValues}
                            validate={validate}
                            render={({ handleSubmit, submitting }) => (
                              <form onSubmit={handleSubmit} noValidate>
                                <Grid p={2} spacing={3} container>
                                  <Grid item xs={12} md={12}>
                                    <TextField
                                      label="Correo electrónico"
                                      name="correo"
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
                                      Restablecer
                                    </Button>
                                  </Grid>
                                  
                                </Grid>
                              </form>
                            )}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* <Grid item xs={12}></Grid> */}
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} mb={2}>
                    <Grid
                      item
                      container
                      direction="column"
                      alignItems="center"
                      xs={12}>
                      <Link
                        underline="hover"
                        component="button"
                        variant="body2"
                        onClick={() =>
                          redirectToRoute("/ingresar")
                        }>
                        Regresar
                      </Link>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </div>
  );
}
