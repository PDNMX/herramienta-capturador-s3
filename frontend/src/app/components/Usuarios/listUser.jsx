import React from "react";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  TablePagination,
  TableFooter,
  Tooltip,
  Button,
  TableHead,
  Grid,
  IconButton,
  Typography,
  Toolbar,
  useTheme,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { userActions } from "../../_actions/user.action";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import createStyles from "@mui/styles/createStyles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { history } from "../../store/history";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import { requestResetPassword } from "../../store/mutations";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import Nota from "../Common/Nota";
import CheckIcon from "@mui/icons-material/Check";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import TablePaginationActions from "../Common/TablePaginationActionsProps";

export const ListUser = () => {
  const { users, alerta, providerSelect } = useSelector((state) => ({
    users: state.users,
    alerta: state.alert,
    providerSelect: state.providerSelect,
  }));

  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [usuarioId, setUsuarioId] = React.useState("");
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
  const [maxWidth, setMaxWidth] = React.useState("md");
  const optionsDate = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

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

  const confirmAction = (id) => {
    dispatch(userActions.deleteUser(id));
    const initialRange = pagination.page * pagination.pageSize;
    const endRange =
      pagination.page * pagination.pageSize + pagination.pageSize;
    const totalUsers = users.length - 1;
    if (totalUsers <= initialRange) {
      setPagination({
        page: pagination.page - 1,
        pageSize: pagination.pageSize,
      });
    }
    handleClose();
  };

  const confirmActionPassword = (correoElectronico) => {
    alerta.estatus = false;
    const data = [];
    data["correo"] = correoElectronico;
    data["sistema"] = true;
    dispatch(requestResetPassword(data));
    handleClose();
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

  const useStyles = makeStyles((theme) =>
    createStyles({
      titlegridModal: {
        color: "#666666",
      },
      body2: {
        color: "#666666",
      },
      fontblack: {
        color: "#666666",
      },
      titleDialogDetail: {
        flex: 1,
        color: "#ffff",
      },

      tableHead: {
        backgroundColor: "#34b3eb",
      },
      tableHeaderColumn: {
        color: "#ffff",
      },
      toolBarModal: {
        backgroundColor: "#34b3eb",
      },
      whiteStyle: {
        color: "#ffff",
      },
      tableGrantsHead: {
        backgroundColor: "#ffe01b",
      },
    }),
  );

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <>
      {/* Modal Detalle de Usuario */}
      <Dialog
        fullWidth={true}
        maxWidth={maxWidth}
        fullScreen={fullScreen}
        onClose={handleCloseModalUserInfo}
        aria-labelledby="customized-dialog-title"
        open={openModalUserInfo}>
        <Toolbar className={classes.toolBarModal}>
          <Typography variant="h6" className={classes.titleDialogDetail}>
            <b>Detalle del usuario</b>
            <Typography className={classes.whiteStyle}>
              *(DNC) = Dato No Capturado
            </Typography>
          </Typography>
          <IconButton
            className={classes.fontblack}
            edge="end"
            color="inherit"
            onClick={handleCloseModalUserInfo}
            aria-label="close"
            size="large">
            <CloseIcon className={classes.whiteStyle} />
          </IconButton>
        </Toolbar>
        <DialogContent dividers>
          <Grid container item md={12} lg={12}>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Fecha alta</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {new Date(selectedUser.fechaAlta).toLocaleDateString(
                  "es-ES",
                  optionsDate,
                )}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Nombre</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedUser.nombre + " " + selectedUser.apellidoUno}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Apellido uno</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedUser.apellidoUno ? selectedUser.apellidoUno : <Nota />}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Apellido dos</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedUser.apellidoDos ? selectedUser.apellidoDos : <Nota />}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Usuario</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedUser.usuario}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Estatus</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedUser.estatus.toString() == "true"
                  ? "Vigente"
                  : "No vigente"}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Vigencia de contraseña</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {new Date(selectedUser.vigenciaContrasena).toLocaleDateString(
                  "es-ES",
                  optionsDate,
                )}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Cargo</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedUser.cargo}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Correo electrónico</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedUser.correoElectronico}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Teléfono</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedUser.telefono}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Extensión</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedUser.extension ? selectedUser.extension : <Nota />}
              </Typography>
            </Grid>

            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Proveedor</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {renderSelect(selectedUser)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography align={"center"}>Permisos</Typography>
            </Grid>
            <Grid item md={12} sm={12}>
              <TableContainer component={Paper}>
                <Table aria-label="customized table">
                  <TableHead className={classes.tableGrantsHead}>
                    <TableRow>
                      <TableCell>
                        <b>Sistema</b>
                      </TableCell>
                      <TableCell align="center">
                        <b>Permiso</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={"S2"}>
                      <TableCell component="th" scope="row">
                        {
                          "Sistema de los Servidores que Intervienen en Procedimientos de Contratación"
                        }
                      </TableCell>
                      <TableCell align="center">
                        {selectedUser.sistemas.find(
                          (element) => element === "S2",
                        ) ? (
                          <CheckIcon style={{ color: "#34b3eb" }} />
                        ) : (
                          <NotInterestedIcon style={{ color: "red" }} />
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow key={"S3S"}>
                      <TableCell component="th" scope="row">
                        {"Sistema de los Servidores Públicos Sancionados"}
                      </TableCell>
                      <TableCell align="center">
                        {selectedUser.sistemas.find(
                          (element) => element === "S3S",
                        ) ? (
                          <CheckIcon style={{ color: "#34b3eb" }} />
                        ) : (
                          <NotInterestedIcon style={{ color: "red" }} />
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow key={"S3P"}>
                      <TableCell component="th" scope="row">
                        {"Sistema de los Particulares Sancionados"}
                      </TableCell>
                      <TableCell align="center">
                        {selectedUser.sistemas.find(
                          (element) => element === "S3P",
                        ) ? (
                          <CheckIcon style={{ color: "#34b3eb" }} />
                        ) : (
                          <NotInterestedIcon style={{ color: "red" }} />
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
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
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              confirmActionPassword(usuarioCorreo);
            }}
            color="primary"
            autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tabla de Usuarios */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Lista de Usuarios" />
          <Divider />
          <CardContent>
            <TableContainer component={Paper}>
              {users.length > 0 && (
                <Table aria-label="custom pagination table">
                  <TableHead className={classes.tableHead}>
                    <TableRow>
                      <TableCell
                        align="left"
                        style={{ width: "20%" }}
                        className={classes.tableHeaderColumn}>
                        <b>Nombre completo</b>
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{ width: "20%" }}
                        className={classes.tableHeaderColumn}>
                        <b>Usuario</b>
                      </TableCell>
                      <TableCell
                        align="left"
                        className={classes.tableHeaderColumn}>
                        <b>Correo</b>
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{ width: "20%" }}
                        className={classes.tableHeaderColumn}>
                        <b>Proveedor</b>
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ width: "20%" }}
                        className={classes.tableHeaderColumn}>
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
                          <TableCell className={classes.fontblack} align="left">
                            {user.nombre + " " + user.apellidoUno}
                            {user.apellidoDos ? " " + user.apellidoDos : ""}
                          </TableCell>
                          <TableCell className={classes.fontblack} align="left">
                            {user.usuario}
                          </TableCell>
                          <TableCell className={classes.fontblack} align="left">
                            {user.correoElectronico}
                          </TableCell>
                          <TableCell className={classes.fontblack} align="left">
                            {renderSelect(user)}
                          </TableCell>
                          <TableCell
                            className={classes.fontblack}
                            style={{ width: 430 }}
                            align="center">
                            
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
                                onClick={() => redirectToRoute(`/usuario/editar/${user._id}`) }
                                style={{ color: "#ffe01b" }}>
                                  <EditOutlinedIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip
                                title="Reestablecer contraseña"
                                placement="top">
                                <IconButton
                                  onClick={() => handleOpenModalUserPassword( user._id, user.nombre, user.apellidoUno, user.apellidoDos, user.correoElectronico, ) }
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
              )}
            </TableContainer>
          </CardContent>
          <Divider />
          <CardActions>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center">
              <Grid item sx={{ margin: 2 }}>
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
