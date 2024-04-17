import { storeValidate } from "../store";
import { Provider } from "react-redux";
import { Router, Route } from "react-router-dom";
import { history } from "../store/history";
import { Redirect } from "react-router";
import { userActions } from "../_actions/user.action";
import { catalogActions } from "../_actions/catalog.action";
import { alertActions } from "../_actions/alert.actions";
import { ConnectedMenuV } from "./Menu/MenuV";
import { providerActions } from "../_actions/provider.action";
import { LoginV } from "./Login/Login";
import { S2Actions } from "../_actions/s2.action";

import { ResetPasswordV } from "./Login/ResetPassword";

const labelSesionExpirada =
  "La sesión ha expirado, favor de iniciar sesión de nuevo";
const labelNoSeHaIniciado = "No se ha iniciado sesión";

export const App = () => (
  <Router history={history}>
    <Provider store={storeValidate}>
      <Route
        exact
        path="/"
        render={() => {
          return <Redirect to="/ingresar" />;
        }}
      />
      <Route exact path="/ingresar" render={() => <LoginV />} />
      <Route
        exact
        path="/restaurar-contraseña"
        render={() => <ResetPasswordV />}
      />
      {/* ----------- NUEVAS VERSIONES - INICIO ----------- */}
      {/* ----------- NUEVAS VERSIONES - s3: 11 Formatos ----------- */}
      <Route
        exact
        path="/inicio"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2"
              ) {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(userActions.requestPermisosSistema());
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV propiedades={{ renderView: "inicio" }} />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />
      <Route
        exact
        path="/captura/s3/faltas-administrativas/graves"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2" /* && localStorage.S2=="true" */
              ) {
                storeValidate.dispatch(userActions.requestPermisosSistema());
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "createReg-form1" }}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/captura/s3/faltas-administrativas/no-graves"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2" /* && localStorage.S2=="true" */
              ) {
                storeValidate.dispatch(userActions.requestPermisosSistema());
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "createReg-form2" }}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/consulta/s3/faltas-administrativas/graves"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2" &&
                localStorage["faltas-administrativas-graves"] == "true"
              ) {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(S2Actions.setclearS2());
                storeValidate.dispatch(userActions.requestPermisosSistema());
                storeValidate.dispatch(S2Actions.requestListS2({}));
                //storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{
                      renderView: "consultar.faltas-administrativas-graves",
                    }}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

<Route
        exact
        path="/editar/s3/faltas-administrativas/graves/:id"
        render={({ match }) => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2" /* &&
                localStorage.S2 == "true" */
              ) {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(userActions.requestPermisosSistema());
                //storeValidate.dispatch(S2Actions.fillRegEdit(match.params.id));
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "editar.faltas-administrativas-graves" }}
                    match={match}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/captura/s3/actos-particulares/personas-fisicas"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2" /* && localStorage.S2=="true" */
              ) {
                storeValidate.dispatch(userActions.requestPermisosSistema());
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "createReg-form3" }}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/captura/s3/actos-particulares/personas-morales"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2" /* && localStorage.S2=="true" */
              ) {
                storeValidate.dispatch(userActions.requestPermisosSistema());
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "createReg-form4" }}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/captura/s3/inhabilitaciones/personas-fisicas"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2" /* && localStorage.S2=="true" */
              ) {
                storeValidate.dispatch(userActions.requestPermisosSistema());
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "createReg-form5" }}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/captura/s3/inhabilitaciones/personas-morales"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2" /* && localStorage.S2=="true" */
              ) {
                storeValidate.dispatch(userActions.requestPermisosSistema());
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "createReg-form6" }}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/captura/s3/hechos-corrupcion/servidores-publicos"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2" /* && localStorage.S2=="true" */
              ) {
                storeValidate.dispatch(userActions.requestPermisosSistema());
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "createReg-form7" }}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/captura/s3/hechos-corrupcion/personas-fisicas"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2" /* && localStorage.S2=="true" */
              ) {
                storeValidate.dispatch(userActions.requestPermisosSistema());
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "createReg-form8" }}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/captura/s3/hechos-corrupcion/personas-morales"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2" /* && localStorage.S2=="true" */
              ) {
                storeValidate.dispatch(userActions.requestPermisosSistema());
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "createReg-form9" }}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/captura/s3/abstenciones/graves"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2" /* && localStorage.S2=="true" */
              ) {
                storeValidate.dispatch(userActions.requestPermisosSistema());
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "createReg-form10" }}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/captura/s3/abstenciones/no-graves"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2" /* && localStorage.S2=="true" */
              ) {
                storeValidate.dispatch(userActions.requestPermisosSistema());
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "createReg-form11" }}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/captura/S2v2"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2" /* && localStorage.S2=="true" */
              ) {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(userActions.requestPermisosSistema());
                storeValidate.dispatch(
                  catalogActions.requestCatalogoByType("genero"),
                );
                storeValidate.dispatch(
                  catalogActions.requestRamoCatalogo("ramo"),
                );
                storeValidate.dispatch(
                  catalogActions.requestPuestoCatalogo("puesto"),
                );
                storeValidate.dispatch(
                  catalogActions.requestTipoAreaCatalogo("tipoArea"),
                );
                storeValidate.dispatch(
                  catalogActions.requestNivelResponsabilidadCatalogo(
                    "nivelResponsabilidad",
                  ),
                );
                storeValidate.dispatch(
                  catalogActions.requestTipoProcedimientoCatalogo(
                    "tipoProcedimiento",
                  ),
                );
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV propiedades={{ renderView: "createRegv2" }} />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/consulta/S2v2"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2" &&
                localStorage.S2 == "true"
              ) {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(S2Actions.setclearS2());
                storeValidate.dispatch(userActions.requestPermisosSistema());
                storeValidate.dispatch(S2Actions.requestListS2({}));
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV propiedades={{ renderView: "S2Schemav2" }} />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/editar/S2v2/:id"
        render={({ match }) => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (
                localStorage.token &&
                localStorage.rol == "2" &&
                localStorage.S2 == "true"
              ) {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(userActions.requestPermisosSistema());
                storeValidate.dispatch(
                  catalogActions.requestCatalogoByType("genero"),
                );
                storeValidate.dispatch(
                  catalogActions.requestRamoCatalogo("ramo"),
                );
                storeValidate.dispatch(
                  catalogActions.requestPuestoCatalogo("puesto"),
                );
                storeValidate.dispatch(
                  catalogActions.requestTipoAreaCatalogo("tipoArea"),
                );
                storeValidate.dispatch(
                  catalogActions.requestNivelResponsabilidadCatalogo(
                    "nivelResponsabilidad",
                  ),
                );
                storeValidate.dispatch(
                  catalogActions.requestTipoProcedimientoCatalogo(
                    "tipoProcedimiento",
                  ),
                );
                storeValidate.dispatch(S2Actions.fillRegEdit(match.params.id));
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "editRegS2v2" }}
                    match={match}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      {/* ----------- NUEVAS VERSIONES - FIN ----------- */}

      {/* Administración de usuarios */}
      <Route
        exact
        path="/usuario/crear"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (localStorage.token && localStorage.rol == "1") {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(
                  providerActions.requestAllProvidersEnabled(),
                );
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV propiedades={{ renderView: "createuser" }} />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />
      <Route
        exact
        path="/usuario/editar/:id"
        render={({ match }) => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (localStorage.token && localStorage.rol == "1") {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(
                  userActions.fillUserUpdate(match.params.id),
                );
                storeValidate.dispatch(
                  providerActions.requestAllProvidersEnabled(),
                );
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "edituser" }}
                    match={match}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />
      <Route
        exact
        path="/usuarios"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              storeValidate.dispatch(
                userActions.requesUserInSession(localStorage.token),
              );
              if (localStorage.token && localStorage.rol == "1") {
                storeValidate.dispatch(providerActions.requestAllProviders());
                storeValidate.dispatch(
                  userActions.requestPerPage({ page: 1, pageSize: 10 }),
                );
                return <ConnectedMenuV propiedades={{ renderView: "users" }} />;
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/proveedor/crear"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (localStorage.token && localStorage.rol == "1") {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "createprovider" }}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/proveedor/editar/:id"
        render={({ match }) => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (localStorage.token && localStorage.rol == "1") {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(
                  providerActions.fillProviderUpdate(match.params.id),
                );
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "editprovider" }}
                    match={match}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />

      <Route
        exact
        path="/proveedores"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (localStorage.token && localStorage.rol == "1") {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(
                  providerActions.requestPerPage({ page: 1, pageSize: 10 }),
                );
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV propiedades={{ renderView: "providers" }} />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />
      <Route
        exact
        path="/usuario/cambiarcontrasena"
        render={() => {
          if (localStorage.token) {
            if (
              JSON.parse(window.atob(localStorage.token.split(".")[1])) <
              (new Date().getTime() + 1) / 1000
            ) {
              storeValidate.dispatch(alertActions.error(labelSesionExpirada));
              localStorage.clear();
              return <Redirect to="/ingresar" />;
            } else {
              if (localStorage.token) {
                storeValidate.dispatch(
                  userActions.requesUserInSession(localStorage.token),
                );
                storeValidate.dispatch(providerActions.requestAllProviders());
                storeValidate.dispatch(alertActions.clear());
                return (
                  <ConnectedMenuV
                    propiedades={{ renderView: "cambiarcontrasena" }}
                  />
                );
              } else {
                return <Redirect to="/ingresar" />;
              }
            }
          } else {
            storeValidate.dispatch(alertActions.error(labelNoSeHaIniciado));
            return <Redirect to="/ingresar" />;
          }
        }}
      />
    </Provider>
  </Router>
);
