import { storeValidate } from "../store";
import { Provider } from "react-redux";
import { Router, Route, Redirect } from "react-router-dom";
import { history } from "../store/history";
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

const PrivateRoute = ({ renderView, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
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

            // valida si es del tipo consulta, y hace el request para listar
            const tipoView = renderView.split(".");
            if (tipoView[0] === "consultar") {
              //console.log(tipoView[0]);
              storeValidate.dispatch(S2Actions.requestListS2({}, renderView));
              storeValidate.dispatch(S2Actions.setclearS2());
            }

            storeValidate.dispatch(alertActions.clear());
            return (
              <ConnectedMenuV
                {...props}
                propiedades={{
                  renderView,
                  match: tipoView[0] === "editar" ? props.match : undefined,
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
);

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
      <PrivateRoute
        exact
        path="/inicio"
        
        renderView="inicio"
      />
      {/* ----------- RUTAS DE CAPTURA - INICIO ----------- */}
      <PrivateRoute
        exact
        path="/captura/s3/faltas-administrativas/graves"
        
        renderView="capturar.faltas-administrativas.graves"
      />
      <PrivateRoute
        exact
        path="/captura/s3/faltas-administrativas/no-graves"
        
        renderView="capturar.faltas-administrativas.no-graves"
      />
      <PrivateRoute
        exact
        path="/captura/s3/actos-particulares/personas-fisicas"
        
        renderView="capturar.actos-particulares.personas-fisicas"
      />
      <PrivateRoute
        exact
        path="/captura/s3/actos-particulares/personas-morales"
        
        renderView="capturar.actos-particulares.personas-morales"
      />
      <PrivateRoute
        exact
        path="/captura/s3/inhabilitaciones/personas-fisicas"
        
        renderView="capturar.inhabilitaciones.personas-fisicas"
      />
      <PrivateRoute
        exact
        path="/captura/s3/inhabilitaciones/personas-morales"
        
        renderView="capturar.inhabilitaciones.personas-morales"
      />
      <PrivateRoute
        exact
        path="/captura/s3/hechos-corrupcion/servidores-publicos"
        
        renderView="capturar.hechos-corrupcion.servidores-publicos"
      />
      <PrivateRoute
        exact
        path="/captura/s3/hechos-corrupcion/personas-fisicas"
        
        renderView="capturar.hechos-corrupcion.personas-fisicas"
      />
      <PrivateRoute
        exact
        path="/captura/s3/hechos-corrupcion/personas-morales"
        
        renderView="capturar.hechos-corrupcion.personas-morales"
      />
      <PrivateRoute
        exact
        path="/captura/s3/abstenciones/graves"
        
        renderView="capturar.abstenciones.graves"
      />
      <PrivateRoute
        exact
        path="/captura/s3/abstenciones/no-graves"
        
        renderView="capturar.abstenciones.no-graves"
      />
      {/* ----------- RUTAS DE CAPTURA - FIN ----------- */}

      {/* ----------- RUTAS DE CONSULTA - INICIO ----------- */}
      <PrivateRoute
        exact
        path="/consultar/s3/faltas-administrativas/graves"
        
        renderView="consultar.faltas-administrativas.graves"
      />
      <PrivateRoute
        exact
        path="/consultar/s3/faltas-administrativas/no-graves"
        
        renderView="consultar.faltas-administrativas.no-graves"
      />
      <PrivateRoute
        exact
        path="/consultar/s3/actos-particulares/personas-fisicas"
        
        renderView="consultar.actos-particulares.personas-fisicas"
      />
      <PrivateRoute
        exact
        path="/consultar/s3/actos-particulares/personas-morales"
        
        renderView="consultar.actos-particulares.personas-morales"
      />
      <PrivateRoute
        exact
        path="/consultar/s3/inhabilitaciones/personas-fisicas"
        
        renderView="consultar.inhabilitaciones.personas-fisicas"
      />
      <PrivateRoute
        exact
        path="/consultar/s3/inhabilitaciones/personas-morales"
        
        renderView="consultar.inhabilitaciones.personas-morales"
      />
      <PrivateRoute
        exact
        path="/consultar/s3/hechos-corrupcion/servidores-publicos"
        
        renderView="consultar.hechos-corrupcion.servidores-publicos"
      />
      <PrivateRoute
        exact
        path="/consultar/s3/hechos-corrupcion/personas-fisicas"
        
        renderView="consultar.hechos-corrupcion.personas-fisicas"
      />
      <PrivateRoute
        exact
        path="/consultar/s3/hechos-corrupcion/personas-morales"
        
        renderView="consultar.hechos-corrupcion.personas-morales"
      />
      <PrivateRoute
        exact
        path="/consultar/s3/abstenciones/graves"
        
        renderView="consultar.abstenciones.graves"
      />
      <PrivateRoute
        exact
        path="/consultar/s3/abstenciones/no-graves"
        
        renderView="consultar.abstenciones.no-graves"
      />

      <PrivateRoute
        exact
        path="/editar/s3/faltas-administrativas/graves/:id"
        
        renderView="editar.faltas-administrativas.graves"
      />

      <PrivateRoute
        exact
        path="/editar/s3/faltas-administrativas/no-graves/:id"
        
        renderView="editar.faltas-administrativas.no-graves"
      />

      <PrivateRoute
        exact
        path="/editar/s3/actos-particulares/personas-fisicas/:id"
        
        renderView="editar.actos-particulares.personas-fisicas"
      />
      <PrivateRoute
        exact
        path="/editar/s3/actos-particulares/personas-morales/:id"
        
        renderView="editar.actos-particulares.personas-morales"
      />
      <PrivateRoute
        exact
        path="/editar/s3/inhabilitaciones/personas-fisicas/:id"
        
        renderView="editar.inhabilitaciones.personas-fisicas"
      />
      <PrivateRoute
        exact
        path="/editar/s3/inhabilitaciones/personas-morales/:id"
        
        renderView="editar.inhabilitaciones.personas-morales"
      />
      <PrivateRoute
        exact
        path="/editar/s3/hechos-corrupcion/servidores-publicos/:id"
        
        renderView="editar.hechos-corrupcion.servidores-publicos"
      />
      <PrivateRoute
        exact
        path="/editar/s3/hechos-corrupcion/personas-fisicas/:id"
        
        renderView="editar.hechos-corrupcion.personas-fisicas"
      />
      <PrivateRoute
        exact
        path="/editar/s3/hechos-corrupcion/personas-morales/:id"
        
        renderView="editar.hechos-corrupcion.personas-morales"
      />
      <PrivateRoute
        exact
        path="/editar/s3/abstenciones/graves/:id"
        
        renderView="editar.abstenciones.graves"
      />
      <PrivateRoute
        exact
        path="/editar/s3/abstenciones/no-graves/:id"
        
        renderView="editar.abstenciones.no-graves"
      />

      {/* Temporales s2 v2 */}
      <PrivateRoute
        exact
        path="/consulta/S2v2"
        
        renderView="S2Schemav2"
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
