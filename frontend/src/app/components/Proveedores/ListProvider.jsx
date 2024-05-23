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
  Snackbar,
  useTheme,
  Toolbar,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Divider,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { providerActions } from "../../_actions/provider.action";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Alert } from "@mui/material";
import { history } from "../../store/history";
import VisibilityIcon from "@mui/icons-material/Visibility";
//import { Theme } from "@mui/material/styles";
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

export const ListProvider = () => {
  const { providers, alerta, providerSelect } = useSelector((state) => ({
    providers: state.providers,
    alerta: state.alert,
    providerSelect: state.providerSelect,
  }));
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [providerId, setProviderId] = React.useState("");
  const [nombreDependencia, setnombreDependencia] = React.useState("");
  const [pagination, setPagination] = React.useState({ page: 0, pageSize: 10 });
  const [openModalProviderInfo, setOpenModalProviderInfo] =
    React.useState(false);
  const [selectedProvider, setSelectedProvider] = React.useState({
    _id: "",
    fechaAlta: "",
    fechaActualizacion: "",
    dependencia: "",
    estatus: "",
    sistemas: [],
  });
  const optionsDate = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const handleOpenModalProviderInfo = (provider) => {
    setOpenModalProviderInfo(true);
    setSelectedProvider(provider);
  };

  const handleCloseModalProviderInfo = () => {
    setOpenModalProviderInfo(false);
  };

  const handleClickOpen = (id, dependencia) => {
    setOpen(true);
    setProviderId(id);
    setnombreDependencia(dependencia);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSnackbar = () => {
    dispatch(alertActions.clear());
  };

  const handleChangePage = (event, newPage) => {
    setPagination({ page: newPage, pageSize: pagination.pageSize });
    //dispatch(userActions.requestPerPage({page : newPage ,pageSize: pagination.pageSize}));
  };

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    if ((pagination.page + 1) * newSize > providers.length) {
      setPagination({ page: 0, pageSize: parseInt(event.target.value, 10) });
    } else {
      setPagination({
        page: pagination.page,
        pageSize: parseInt(event.target.value, 10),
      });
    }
  };

  const confirmAction = (id) => {
    dispatch(providerActions.deleteProvider(id));
    const initialRange = pagination.page * pagination.pageSize;
    const endRange =
      pagination.page * pagination.pageSize + pagination.pageSize;
    const totalProviders = providers.length - 1;
    if (totalProviders <= initialRange) {
      setPagination({
        page: pagination.page - 1,
        pageSize: pagination.pageSize,
      });
    }

    handleClose();
  };

  const redirectToRoute = (path) => {
    history.push(path);
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

      <Dialog
        maxWidth={"md"}
        onClose={handleCloseModalProviderInfo}
        aria-labelledby="customized-dialog-title"
        open={openModalProviderInfo}>
        <Toolbar>
          <Typography variant="h6">
            <b>Detalle del proveedor</b>
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseModalProviderInfo}
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
          <Grid container item md={12} lg={12}>
            <Grid item mb={1} md={6} sm={12}>
              <Typography align="left" variant="body">
                <b>Proveedor:</b> {selectedProvider.dependencia}
              </Typography>
            </Grid>

            <Grid item mb={1} md={6} sm={12}>
              <Typography align="left" variant="body">
                <b>Estatus:</b> {selectedProvider.estatus ? "Vigente" : "No vigente"}
              </Typography>
            </Grid>
            <Grid item mb={1} md={6} sm={12}>
              <Typography align="left" variant="body">
                <b>Fecha alta:</b> {new Date(selectedProvider.fechaAlta).toLocaleDateString( "es-MX", )}
              </Typography>
            </Grid>
            <Grid item mb={1} md={6} sm={12}>
              <Typography align="left" variant="body">
                <b>Fecha actualización:</b> {selectedProvider.fechaActualizacion != null ? new Date( selectedProvider.fechaActualizacion, ).toLocaleDateString("es-MX") : ""}
              </Typography>
            </Grid>
            <Grid item mb={1} md={12} sm={12}>
              <Typography>
                <b>Formatos disponibles:</b>
              </Typography>
              <ul>
                {selectedProvider.sistemas.map((item, index) => (
                  <li key={index}>{listaFormatos[item.label] || item.label}</li> // Muestra el título o el valor original si no hay título
                ))}
              </ul>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {"¿Seguro que desea eliminar el proveedor: " +
            nombreDependencia +
            "?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Los cambios no seran reversibles
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              confirmAction(providerId);
            }}
            color="primary"
            autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Lista de Proveedores" subheader="Información Registrada"/>
          <Divider />
          <CardContent>
          {providers.length === 0 ? (
              <Typography variant="h4" align="left" mb={2}>
                No hay registros aún. Agrega un registro para comenzar.
              </Typography>
            ) : (<TableContainer component={Paper}>
              {providers.length > 0 && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "40%" }} align="left">
                        <b>Proveedor</b>
                      </TableCell>
                      <TableCell style={{ width: "20%" }} align="left">
                        <b>Estatus</b>
                      </TableCell>
                      <TableCell style={{ width: "20%" }} align="left">
                        <b>Fecha alta</b>
                      </TableCell>
                      <TableCell style={{ width: "20%" }} align="center">
                        <b>Acciones</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody key="providers">
                    {providers
                      .slice(
                        pagination.page * pagination.pageSize,
                        pagination.page * pagination.pageSize +
                          pagination.pageSize,
                      )
                      .map((provider) => (
                        <TableRow key={provider._id}>
                          <TableCell
                            component="th"
                            scope="row"
                            style={{ width: "auto" }}
                            align="left">
                            {provider.dependencia}
                          </TableCell>
                          <TableCell style={{ width: "auto" }} align="left">
                            {provider.estatus ? "Vigente" : "No vigente"}
                          </TableCell>
                          <TableCell style={{ width: "auto" }} align="left">
                            {new Date(provider.fechaAlta).toLocaleDateString(
                              "es-ES",
                              optionsDate,
                            )}
                          </TableCell>
                          <TableCell style={{ width: 230 }} align="center">
                            <Tooltip title="Más información" placement="top">
                              <IconButton
                                onClick={() =>
                                  handleOpenModalProviderInfo(provider)
                                }
                                style={{ color: "#34b3eb" }}
                                aria-label="expand row"
                                size="small">
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar proveedor" placement="top">
                              <IconButton
                                onClick={() =>
                                  redirectToRoute(
                                    `/proveedor/editar/${provider._id}`,
                                  )
                                }
                                style={{ color: "#ffe01b" }}>
                                <EditOutlinedIcon />
                              </IconButton>
                            </Tooltip>
                            {/* <Tooltip
                                title="Eliminar proveedor"
                                placement="top">
                                <Button
                                  onClick={() => {
                                    handleClickOpen(
                                      provider._id,
                                      provider.dependencia,
                                    );
                                  }}>
                                  <DeleteOutlineOutlinedIcon
                                    style={{ color: "#f44336" }}
                                  />
                                </Button>
                              </Tooltip> */}
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
                              { label: "Todos", value: providers.length },
                            ]}
                            colSpan={6}
                            count={providers.length}
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
            </TableContainer>)}
            
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
                  onClick={() => redirectToRoute("/proveedor/crear")}
                  variant="contained">
                  Crear Proveedor
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
};
