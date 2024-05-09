import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  TablePagination,
  TableFooter,
  TableHead,
  Grid,
  IconButton,
  Typography,
  Snackbar,
  Divider,
  Tooltip,
  useTheme,
  Card,
  CardContent,
  CardHeader,
  Paper,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Alert } from "@mui/material";
import { alertActions } from "../../_actions/alert.actions";
import { history } from "../../store/history";
import { S2Actions } from "../../_actions/s2.action";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "@mui/icons-material/Close";
import Nota from "../Common/Nota";
import TablePaginationActions from "../Common/TablePaginationActionsProps";

export const ListForm3 = () => {
  const { S2List, alerta, paginationSuper } = useSelector((state) => ({
    S2List: state.S2,
    alerta: state.alert,
    paginationSuper: state.pagination,
  }));
  const dispatch = useDispatch();
  const [query, setQuery] = React.useState({});
  const [openModalUserInfo, setOpenModalUserInfo] = React.useState(false);
  const [selectedRegistro, setSelectedRegistro] = React.useState({});

  const [maxWidth, _] = React.useState("md");

  const handleOpenModalUserInfo = (user) => {
    //setSelectedRegistro(user);
    setSelectedRegistro(() => {
      setOpenModalUserInfo(true);
      return user;
    }); 
  };

  const handleCloseModalUserInfo = () => {
    setOpenModalUserInfo(false);
  };

  const handleCloseSnackbar = () => {
    dispatch(alertActions.clear());
  };

  const handleChangePage = (_, newPage) => {
    dispatch(
      S2Actions.requestListS2({
        query: query,
        page: newPage + 1,
        pageSize: paginationSuper.pageSize,
      }),
    );
  };

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    if (paginationSuper.page * newSize > paginationSuper.totalRows) {
      dispatch(
        S2Actions.requestListS2({
          query: query,
          page: 1,
          pageSize: parseInt(event.target.value, 10),
        }),
      );
    } else {
      dispatch(
        S2Actions.requestListS2({
          query: query,
          page: 1,
          pageSize: parseInt(event.target.value, 10),
        }),
      );
    }
  };

  const redirectToRoute = (path) => {
    history.push(path);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

    {/* Modal para ver registro */}
      <Dialog
        fullWidth={true}
        maxWidth={maxWidth}
        fullScreen={fullScreen}
        onClose={handleCloseModalUserInfo}
        aria-labelledby="customized-dialog-title"
        open={openModalUserInfo}>
        <DialogTitle>
            <b>Detalle del registro</b>
        </DialogTitle>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCloseModalUserInfo}
          aria-label="close"
          sx={{
            position: 'absolute',
            right: 20,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
        
        <DialogContent dividers>
          <Grid container>
            <Grid item xs={12}>
              <Typography align={"center"}>
              1. DATOS GENERALES DE LA PERSONA SERVIDORA PÚBLICA
              </Typography>
            </Grid>

            <Grid item md={6} xs={12}>
              <Typography
                align="left">
                <b>Fecha de Captura:</b> {selectedRegistro.fechaCaptura ? ( selectedRegistro.fechaCaptura ) : ( <Nota /> )}
              </Typography>
            </Grid>

            <Grid item md={6} xs={12}>
              <Typography
                align="left">
                <b>Ejercicio:</b> {selectedRegistro.ejercicio ? ( selectedRegistro.ejercicio ) : ( <Nota /> )}
              </Typography>
            </Grid>

            <Grid item md={6} xs={12}>
              <Typography
                align="left">
                <b>Primer Apellido:</b> {selectedRegistro.primerApellido ? ( selectedRegistro.primerApellido ) : ( <Nota /> )}
              </Typography>
            </Grid>

            <Grid item md={6} xs={12}>
              <Typography
                align="left">
                <b>CURP:</b> {selectedRegistro.curp ? ( selectedRegistro.curp ) : ( <Nota /> )}
              </Typography>
            </Grid>

            <Grid item md={6} xs={12}>
              <Typography
                align="left">
                <b>Sexo:</b> {selectedRegistro.sexo ? ( selectedRegistro.sexo ) : ( <Nota /> )}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{m: 3}}/>
            </Grid>

            <Grid item xs={12}>
              <Typography align={"center"}>
              2. DATOS DEL EMPLEO, CARGO O COMISIÓN
              </Typography>
            </Grid>

            <Grid item md={6} xs={12}>
              <Typography
                align="left">
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Faltas administrativas graves"
            subheader="Información Registrada"
          />
          <Divider />
          <CardContent>
            <TableContainer component={Paper}>
              <Table aria-label="custom pagination table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="left"
                    >
                      <b>Identificador</b>
                    </TableCell>
                    <TableCell
                      align="left"
                    >
                      <b>Servidor público</b>
                    </TableCell>
                    <TableCell
                      align="left"
                    >
                      <b>Institución</b>
                    </TableCell>
                    <TableCell
                      align="center"
                    >
                      <b>Acciones</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {S2List.map((registro) => (
                    <TableRow key={registro._id}>
                      <TableCell style={{ width: "15%" }} align="left">
                        {registro._id}
                      </TableCell>
                      <TableCell style={{ width: "25%" }} align="left">
                        {registro.grave.nombres && registro.grave.nombres + " "}
                        {registro.grave.primerApellido && registro.grave.primerApellido + " "}
                        {registro.grave.segundoApellido &&
                        registro.grave.segundoApellido.sinSegundoApellido == true
                          ? ""
                          : registro.grave.segundoApellido.valor}
                      </TableCell>
                      {registro.grave.entePublico && (
                        <TableCell style={{ width: "25%" }} align="left">
                          { registro.grave.entePublico.siglas && registro.grave.entePublico.siglas }
                        </TableCell>
                      )}
                      <TableCell style={{ width: "15%" }} align="center">
                        <Tooltip title="Más información" placement="top">
                          <IconButton
                            onClick={() => handleOpenModalUserInfo(registro)}
                            style={{ color: "#34b3eb" }}
                            aria-label="expand row"
                            size="small">
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar registro" placement="top">
                          <IconButton
                            onClick={() => redirectToRoute(`/editar/s3/faltas-administrativas/graves/${registro._id}`) }
                            style={{ color: "#ffe01b" }}>
                            <EditOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

                <TableFooter>
                  <TableRow>
                    {paginationSuper.pageSize != undefined &&
                      paginationSuper.page != undefined && (
                        <TablePagination
                          rowsPerPageOptions={[
                            3,
                            5,
                            10,
                            25,
                            {
                              label: "Todos",
                              value: paginationSuper.totalRows,
                            },
                          ]}
                          colSpan={6}
                          count={paginationSuper.totalRows}
                          rowsPerPage={paginationSuper.pageSize}
                          page={paginationSuper.page - 1}
                          /* SelectProps={{
                            inputProps: {
                              "aria-label": "Registros por página",
                            },
                            native: true,
                          }} */
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      )}
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};