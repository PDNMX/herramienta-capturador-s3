import React from "react";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
  Snackbar
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
//import { userActions } from "../../_actions/user.action";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { history } from "../../store/history";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import { requestResetPassword } from "../../store/mutations";
import { alertActions } from "../../_actions/alert.actions";
import CloseIcon from "@mui/icons-material/Close";
import TablePaginationActions from "../Common/TablePaginationActionsProps";

const listaFormatos = {
  "faltas-administrativas.graves":
    "Faltas Administrativas de Servidores Públicos: GRAVES",
  "faltas-administrativas.no-graves":
    "Faltas Administrativas de Servidores Públicos: NO GRAVES",
  "actos-particulares.personas-fisicas":
    "Actos de Particulares vinculados con Faltas Graves: PERSONAS FÍSICAS",
  "actos-particulares.personas-morales":
    "Actos de Particulares vinculados con Faltas Graves: PERSONAS MORALES",
  "inhabilitaciones.personas-fisicas":
    "Sanciones (Inhabilitaciones) por normas diversas a la LGRA: PERSONAS FÍSICAS",
  "inhabilitaciones.personas-morales":
    "Sanciones (Inhabilitaciones) por normas diversas a la LGRA: PERSONAS MORALES",
  "hechos-corrupcion.servidores-publicos":
    "Hechos de Corrupción: SERVIDORES PÚBLICOS",
  "hechos-corrupcion.personas-fisicas":
    "Hechos de Corrupción: PERSONAS FÍSICAS",
  "hechos-corrupcion.personas-morales":
    "Hechos de Corrupción: PERSONAS MORALES",
  "abstenciones.graves": "Abstenciones: GRAVES",
  "abstenciones.no-graves": "Abstenciones: NO GRAVES",
};

export const ListUser = () => {
  const { users, alerta, providerSelect } = useSelector((state) => ({
    users: state.users,
    alerta: state.alert,
    providerSelect: state.providerSelect,
  }));

  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  /* const [usuarioId, setUsuarioId] = React.useState(""); */
  const [nombreUsuario, setNombreUsuario] = React.useState("");
  const [pagination, setPagination] = React.useState({ page: 0, pageSize: 10 });
  const [openModalUserInfo, setOpenModalUserInfo] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState({
    _id: "",
    cargo: "",
    correoElectronico: "",
    telefono: "",
    extension: "",
    usuario: "",
    estatus: "",
    sistemas: [],
    fechaAlta: "",
    vigenciaContrasena: "",
    nombre: "",
    apellidoUno: "",
    apellidoDos: "",
  });

  const [openPassword, setOpenPassword] = React.useState(false);
  const [usuarioCorreo, setUsuarioCorreo] = React.useState("");

  const renderSelect = (user) => {
    let c1 = false;
    for (const value of providerSelect) {
      if (value._id === user.proveedorDatos) {
        c1 = true;
        return value.label;
      }
    }
    if (!c1) {
      return <TableCell></TableCell>;
    }
  };

  const handleOpenModalUserInfo = (user) => {
    setOpenModalUserInfo(true);
    setSelectedUser(user);
  };

  const handleCloseModalUserInfo = () => {
    setOpenModalUserInfo(false);
  };

  /* const handleClickOpen = (id, name, primerApellido, segundoApellido) => {
        setOpen(true);
        setUsuarioId(id);
        setNombreUsuario(name + " " + primerApellido + " " + segundoApellido);
    }; */

  const handleClose = () => {
    setOpen(false);
    setOpenPassword(false);
  };

  const handleChangePage = (event, newPage) => {
    setPagination({ page: newPage, pageSize: pagination.pageSize });
    //dispatch(userActions.requestPerPage({page : newPage ,pageSize: pagination.pageSize}));
  };

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    if ((pagination.page + 1) * newSize > users.length) {
      setPagination({ page: 0, pageSize: parseInt(event.target.value, 10) });
    } else {
      setPagination({
        page: pagination.page,
        pageSize: parseInt(event.target.value, 10),
      });
    }
    //dispatch(userActions.requestPerPage({pageSize: parseInt(event.target.value, 10) }));
  };

  const confirmActionPassword = (correoElectronico) => {
    const data = [];
    data["correo"] = correoElectronico;
    data["sistema"] = true;
    dispatch(requestResetPassword(data));
    handleClose();
    //setOpen(true);
  };
  const redirectToRoute = (path) => {
    history.push(path);
  };

  const handleOpenModalUserPassword = (
    id,
    name,
    primerApellido,
    segundoApellido,
    correoElectronico,
  ) => {
    setOpenPassword(true);
    setNombreUsuario(name + " " + primerApellido + " " + segundoApellido);
    setUsuarioCorreo(correoElectronico);
  };

  const handleCloseSnackbar = () => {
    dispatch(alertActions.clear());
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alerta.status}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={alerta.type}>
          {alerta.message}
        </Alert>
      </Snackbar>
      {/* Modal Detalle de Usuario */}
      <Dialog
        maxWidth={"md"}
        onClose={handleCloseModalUserInfo}
        aria-labelledby="customized-dialog-title"
        open={openModalUserInfo}>
        <Toolbar>
          <Typography variant="h6">
            <b>Detalle del usuario</b>
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseModalUserInfo}
            aria-label="close"
            size="large"
            sx={{
              position: "absolute",
              right: 20,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <DialogContent dividers>
          <Grid container>
            <Grid item mb={1} md={12} xs={12}>
              <Typography align="left" variant="body">
                <b>Fecha alta: </b>{" "}
                {new Date(selectedUser.fechaAlta).toLocaleDateString("es-MX")}
              </Typography>
            </Grid>
            <Grid item mb={1} md={4} xs={12}>
              <Typography align="left" variant="body">
                <b>Nombre:</b> {selectedUser.nombre}
              </Typography>
            </Grid>
            <Grid item mb={1} md={4} xs={12}>
              <Typography align="left" variant="body">
                <b>Primer Apellido:</b> {selectedUser.apellidoUno}
              </Typography>
            </Grid>
            <Grid item mb={1} md={4} xs={12}>
              <Typography align="left" variant="body">
                <b>Segundo Apellido:</b> {selectedUser.apellidoDos}
              </Typography>
            </Grid>

            <Grid item mb={1} md={4} xs={12}>
              <Typography align="left" variant="body">
                <b>Usuario: </b>
                {selectedUser.usuario}
              </Typography>
            </Grid>
            <Grid item mb={1} md={4} xs={12}>
              <Typography align="left" variant="body">
                <b>Estatus:</b>{" "}
                {selectedUser.estatus.toString() == "true"
                  ? "Vigente"
                  : "No vigente"}
              </Typography>
            </Grid>
            <Grid item mb={1} md={4} xs={12}>
              <Typography align="left" variant="body">
                <b>Vigencia de contraseña:</b>{" "}
                {new Date(selectedUser.vigenciaContrasena).toLocaleDateString(
                  "es-MX",
                )}
              </Typography>
            </Grid>

            <Grid item mb={1} md={4} xs={12}>
              <Typography align="left" variant="body">
                <b>Cargo:</b> {selectedUser.cargo}
              </Typography>
            </Grid>
            <Grid item mb={1} md={4} xs={12}>
              <Typography align="left" variant="body">
                <b>Teléfono:</b> {selectedUser.telefono}
              </Typography>
            </Grid>
            <Grid item mb={1} md={4} xs={12}>
              <Typography align="left" variant="body">
                <b>Extensión:</b> {selectedUser.extension}
              </Typography>
            </Grid>

            <Grid item mb={1} md={12} xs={12}>
              <Typography align="left" variant="body">
                <b>Correo electrónico:</b> {selectedUser.correoElectronico}
              </Typography>
            </Grid>

            <Grid item mb={1} md={12} xs={12}>
              <Typography align="left" variant="body">
                <b>Proveedor:</b> {renderSelect(selectedUser)}
              </Typography>
            </Grid>
            <Grid item mb={1} md={12} xs={12}>
              <Typography>
                <b>Formatos disponibles:</b>
              </Typography>
              <ul>
                {selectedUser.sistemas.map((item, index) => (
                  <li key={index}>{listaFormatos[item] || item}</li> // Muestra el título o el valor original si no hay título
                ))}
              </ul>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Modal Restablecer la contraseña */}
      <Dialog
        open={openPassword}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {"¿Deseas reestablecer la contraseña de " + nombreUsuario + "?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            La contraseña se generará de manera automática y se enviará a su
            correo electrónico.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleClose}
            color="primary"
            autoFocus>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              confirmActionPassword(usuarioCorreo);
            }}
            color="primary"
            variant="contained">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tabla de Usuarios */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Lista de Usuarios"
            subheader="Información Registrada"
          />
          <Divider />
          <CardContent>
            {users.length === 0 ? (
              <Typography variant="h4" align="left" mb={2}>
                No hay registros aún. Agrega un registro para comenzar.
              </Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table aria-label="custom pagination table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" style={{ width: "20%" }}>
                        <b>Nombre completo</b>
                      </TableCell>
                      <TableCell align="left" style={{ width: "20%" }}>
                        <b>Usuario</b>
                      </TableCell>
                      <TableCell align="left">
                        <b>Correo</b>
                      </TableCell>
                      <TableCell align="left" style={{ width: "20%" }}>
                        <b>Proveedor</b>
                      </TableCell>
                      <TableCell align="center" style={{ width: "20%" }}>
                        <b>Acciones</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody key="usuarios">
                    {users
                      .slice(
                        pagination.page * pagination.pageSize,
                        pagination.page * pagination.pageSize +
                          pagination.pageSize,
                      )
                      .map((user) => (
                        <TableRow key={user._id}>
                          <TableCell align="left">
                            {user.nombre + " " + user.apellidoUno}
                            {user.apellidoDos ? " " + user.apellidoDos : ""}
                          </TableCell>
                          <TableCell align="left">{user.usuario}</TableCell>
                          <TableCell align="left">
                            {user.correoElectronico}
                          </TableCell>
                          <TableCell align="left">
                            {renderSelect(user)}
                          </TableCell>
                          <TableCell style={{ width: 430 }} align="center">
                            <Tooltip title="Más información" placement="top">
                              <IconButton
                                onClick={() => handleOpenModalUserInfo(user)}
                                style={{ color: "#34b3eb" }}
                                aria-label="expand row"
                                size="small">
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar usuario" placement="top">
                              <IconButton
                                onClick={() =>
                                  redirectToRoute(`/usuario/editar/${user._id}`)
                                }
                                style={{ color: "#ffe01b" }}>
                                <EditOutlinedIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title="Reestablecer contraseña"
                              placement="top">
                              <IconButton
                                onClick={() =>
                                  handleOpenModalUserPassword(
                                    user._id,
                                    user.nombre,
                                    user.apellidoUno,
                                    user.apellidoDos,
                                    user.correoElectronico,
                                  )
                                }
                                style={{ color: "#67BFB7" }}
                                aria-label="expand row"
                                size="small">
                                <EnhancedEncryptionIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      {pagination.pageSize != undefined &&
                        pagination.page != undefined && (
                          <TablePagination
                            rowsPerPageOptions={[
                              3,
                              5,
                              10,
                              25,
                              { label: "Todos", value: users.length },
                            ]}
                            colSpan={6}
                            count={users.length}
                            rowsPerPage={pagination.pageSize}
                            page={pagination.page}
                            SelectProps={{
                              inputProps: { "aria-label": "rows per page" },
                              native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                          />
                        )}
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            )}
          </CardContent>
          <Divider />
          <CardActions>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center">
              <Grid item mb={1} sx={{ margin: 2 }}>
                <Button
                  onClick={() => redirectToRoute(`/usuario/crear`)}
                  variant="contained">
                  Crear Usuario
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
};
