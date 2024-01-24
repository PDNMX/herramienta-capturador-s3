import React from 'react';
import Paper from '@mui/material/Paper';
import {useDispatch, useSelector} from 'react-redux';
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
    Divider
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {providerActions} from "../../_actions/provider.action";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert } from '@mui/material';
import {history} from "../../store/history";
import VisibilityIcon from "@mui/icons-material/Visibility";
//import { Theme } from "@mui/material/styles";
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import {alertActions} from "../../_actions/alert.actions";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from '@mui/icons-material/Check';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import TablePaginationActions from '../Common/TablePaginationActionsProps';

export const ListProvider = () => {

    const {providers, alerta, providerSelect} = useSelector(state => ({
        providers: state.providers,
        alerta: state.alert,
        providerSelect: state.providerSelect
    }));
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [providerId, setProviderId] = React.useState("");
    const [nombreDependencia, setnombreDependencia] = React.useState("");
    const [pagination, setPagination] = React.useState({page: 0, pageSize: 10});
    const [openModalProviderInfo, setOpenModalProviderInfo] = React.useState(false);
    const [selectedProvider, setSelectedProvider] = React.useState({
        _id: "",
        fechaAlta: "",
        fechaActualizacion: "",
        dependencia: "",
        estatus: "",
        sistemas: []
    });
    const optionsDate = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    const [maxWidth, setMaxWidth] = React.useState('md');

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
    }

    const handleCloseSnackbar = () => {
        dispatch(alertActions.clear());
    };

    const handleChangePage = (event, newPage) => {
        setPagination({page: newPage, pageSize: pagination.pageSize});
        //dispatch(userActions.requestPerPage({page : newPage ,pageSize: pagination.pageSize}));
    };

    const handleChangeRowsPerPage = (event) => {
        const newSize = parseInt(event.target.value, 10);
        if ((pagination.page+1) * newSize > providers.length) {
            setPagination({page: 0, pageSize: parseInt(event.target.value, 10)});
        } else {
            setPagination({page: pagination.page, pageSize: parseInt(event.target.value, 10)});
        }
    };

    const confirmAction = (id) => {
        dispatch(providerActions.deleteProvider(id));
        const initialRange = pagination.page * pagination.pageSize;
        const endRange = pagination.page * pagination.pageSize + pagination.pageSize;
        const totalProviders = providers.length - 1;
        if (totalProviders <= initialRange) {
            setPagination({page: pagination.page - 1, pageSize: pagination.pageSize});
        }

        handleClose();
    }

    const StyledTableCell = withStyles({
        root: {
            color: '#666666'
        }
    })(TableCell);

    const redirectToRoute = (path) => {
        history.push(path);
    }

    const StyledTableRow = withStyles((theme) =>
        createStyles({
            root: {
                '&:nth-of-type(odd)': {
                    backgroundColor: theme.palette.action.hover,
                },
            },
        }),
    )(TableRow);


    const useStyles = makeStyles((theme) =>
        createStyles({
            titlegridModal: {
                color: '#666666'
            },
            body2: {
                color: '#666666'
            },
            fontblack: {
                color: '#666666'
            },
            titleDialogDetail: {
                flex: 1,
                color: '#ffff'
            },
            
            tableHead: {
                backgroundColor: '#34b3eb'
            },
            tableHeaderColumn: {
                color: '#ffff'
            },
            toolBarModal: {
                backgroundColor: "#34b3eb"
            },
            whiteStyle: {
                color: '#ffff'
            },
            tableGrantsHead:{
                backgroundColor: '#ffe01b'
            },

        }),
    );

    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

    return (
      <>
        <Grid item xs={12}>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={alerta.status}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={alerta.type}>
              {alerta.message}
            </Alert>
          </Snackbar>
        </Grid>

        <Dialog
          fullWidth={true}
          maxWidth={maxWidth}
          fullScreen={fullScreen}
          onClose={handleCloseModalProviderInfo}
          aria-labelledby="customized-dialog-title"
          open={openModalProviderInfo}>
          <Toolbar className={classes.toolBarModal}>
            <Typography variant="h6" className={classes.titleDialogDetail}>
              <b>Detalle del proveedor</b>
              <Typography className={classes.whiteStyle}>
                *(DNC) = Dato No Capturado
              </Typography>
            </Typography>
            <IconButton
              className={classes.fontblack}
              edge="end"
              color="inherit"
              onClick={handleCloseModalProviderInfo}
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
                  <b>Proveedor</b>
                </Typography>
                <Typography
                  className={classes.body2}
                  align="left"
                  variant="body2">
                  {selectedProvider.dependencia}
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
                  {selectedProvider.estatus ? "Vigente" : "No vigente"}
                </Typography>
              </Grid>
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
                  {new Date(selectedProvider.fechaAlta).toLocaleDateString(
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
                  <b>Fecha actualización</b>
                </Typography>
                <Typography
                  className={classes.body2}
                  align="left"
                  variant="body2">
                  {selectedProvider.fechaActualizacion != null
                    ? new Date(
                        selectedProvider.fechaActualizacion,
                      ).toLocaleDateString("es-ES", optionsDate)
                    : ""}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.titulo} align={"center"}>
                  Permisos
                </Typography>
              </Grid>
              <Grid item md={12} sm={12}>
                <TableContainer component={Paper}>
                  <Table aria-label="customized table">
                    <TableHead className={classes.tableGrantsHead}>
                      <TableRow>
                        <StyledTableCell>
                          <b>Sistema</b>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <b>Permiso</b>
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <StyledTableRow key={"S2"}>
                        <StyledTableCell component="th" scope="row">
                          {
                            "Sistema de los Servidores que Intervienen en Procedimientos de Contratación"
                          }
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {selectedProvider.sistemas.find(
                            (element) => element === "S2",
                          ) ? (
                            <CheckIcon style={{ color: "#34b3eb" }} />
                          ) : (
                            <NotInterestedIcon style={{ color: "red" }} />
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow key={"S3S"}>
                        <StyledTableCell component="th" scope="row">
                          {"Sistema de los Servidores Públicos Sancionados"}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {selectedProvider.sistemas.find(
                            (element) => element === "S3S",
                          ) ? (
                            <CheckIcon style={{ color: "#34b3eb" }} />
                          ) : (
                            <NotInterestedIcon style={{ color: "red" }} />
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow key={"S3P"}>
                        <StyledTableCell component="th" scope="row">
                          {"Sistema de los Particulares Sancionados"}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {selectedProvider.sistemas.find(
                            (element) => element === "S3P",
                          ) ? (
                            <CheckIcon style={{ color: "#34b3eb" }} />
                          ) : (
                            <NotInterestedIcon style={{ color: "red" }} />
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
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
            <CardHeader title="Lista de Proveedores" />
            <Divider />
            <CardContent>
              <TableContainer component={Paper}>
                {providers.length > 0 && (
                  <Table>
                    <TableHead className={classes.tableHead}>
                      <TableRow>
                        <TableCell
                          className={classes.tableHeaderColumn}
                          style={{ width: "40%" }}
                          align="left">
                          <b>Proveedor</b>
                        </TableCell>
                        <TableCell
                          className={classes.tableHeaderColumn}
                          style={{ width: "20%" }}
                          align="left">
                          <b>Estatus</b>
                        </TableCell>
                        <TableCell
                          className={classes.tableHeaderColumn}
                          style={{ width: "20%" }}
                          align="left">
                          <b>Fecha alta</b>
                        </TableCell>
                        <TableCell
                          className={classes.tableHeaderColumn}
                          style={{ width: "20%" }}
                          align="center">
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
                              className={classes.fontblack}
                              component="th"
                              scope="row"
                              style={{ width: "auto" }}
                              align="left">
                              {provider.dependencia}
                            </TableCell>
                            <TableCell
                              className={classes.fontblack}
                              style={{ width: "auto" }}
                              align="left">
                              {provider.estatus ? "Vigente" : "No vigente"}
                            </TableCell>
                            <TableCell
                              className={classes.fontblack}
                              style={{ width: "auto" }}
                              align="left">
                              {new Date(provider.fechaAlta).toLocaleDateString(
                                "es-ES",
                                optionsDate,
                              )}
                            </TableCell>
                            <TableCell style={{ width: 230 }} align="center">
                              <Tooltip title="Más información" placement="top">
                                  <IconButton
                                  onClick={() => handleOpenModalProviderInfo(provider) }
                                    style={{ color: "#34b3eb" }}
                                    aria-label="expand row"
                                    size="small">
                                    <VisibilityIcon />
                                  </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar proveedor" placement="top">
                                <IconButton
                                  onClick={() => redirectToRoute( `/proveedor/editar/${provider._id}`, ) }
                                  style={{ color: "#ffe01b" }}
                                 >
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
}



