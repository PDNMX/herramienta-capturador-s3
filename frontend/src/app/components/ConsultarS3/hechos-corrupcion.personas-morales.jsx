import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  DialogActions,
  Divider,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
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

import CloseIcon from "@mui/icons-material/Close";
import ReactJson from "react-json-view";
import TablePaginationActions from "../Common/TablePaginationActionsProps";

const tipoFormulario = "consultar.hechos-corrupcion.personas-morales";

export const ListForm9 = () => {
  const { S2List, alerta, paginationSuper } = useSelector((state) => ({
    S2List: state.S2,
    alerta: state.alert,
    paginationSuper: state.pagination,
  }));
  const dispatch = useDispatch();
  const [query, setQuery] = React.useState({});
  const [openModalInfo, setOpenModalInfo] = React.useState(false);
  const [selectedRegistro, setSelectedRegistro] = React.useState({});

  const handleOpenModalInfo = (user) => {
    //setSelectedRegistro(user);
    setSelectedRegistro(() => {
      setOpenModalInfo(true);
      return user;
    });
  };

  const handleCloseModal = () => {
    setOpenModalInfo(false);
  };

  const handleCloseSnackbar = () => {
    dispatch(alertActions.clear());
  };

  const handleChangePage = (_, newPage) => {
    dispatch(
      S2Actions.requestListS2(
        {
          query: query,
          page: newPage + 1,
          pageSize: paginationSuper.pageSize,
        },
        tipoFormulario,
      ),
    );
  };

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    if (paginationSuper.page * newSize > paginationSuper.totalRows) {
      dispatch(
        S2Actions.requestListS2(
          {
            query: query,
            page: 1,
            pageSize: parseInt(event.target.value, 10),
          },
          tipoFormulario,
        ),
      );
    } else {
      dispatch(
        S2Actions.requestListS2(
          {
            query: query,
            page: 1,
            pageSize: parseInt(event.target.value, 10),
          },
          tipoFormulario,
        ),
      );
    }
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

      {/* Modal para ver registro */}
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={openModalInfo}>
        <DialogTitle>
          <b>Detalle del registro</b>
        </DialogTitle>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCloseModal}
          aria-label="close"
          sx={{
            position: "absolute",
            right: 20,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>

        <DialogContent dividers>
        <Grid container>
            <Grid item xs={12}>
              <ReactJson
                style={{ padding: "0.8rem" }}
                name={false}
                src={selectedRegistro}
                theme="harmonic"
                iconStyle="triangle"
                enableEdit={false}
                enableAdd={false}
                enableDelete={false}
                enableClipboard={false}
                displayDataTypes={false}
                displayObjectSize={false}
                indentWidth={6}
                collapsed={false}
                collapseStringsAfterLength={false}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ m: 1 }}
              variant="contained"
            color="primary"
            onClick={() =>
              redirectToRoute(
                `/editar/s3/hechos-corrupcion/personas-morales/${selectedRegistro._id}`,
              )
            }>
            Editar
          </Button>
          <Button
            onClick={handleCloseModal}
            sx={{ m: 1 }}
              variant="contained"
            color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              "FORMATO QUE INDICA LOS DATOS QUE SE INSCRIBIRÁN EN EL SISTEMA NACIONAL DE SERVIDORES PÚBLICOS Y PARTICULARES SANCIONADOS DE LA PLATAFORMA DIGITAL NACIONAL RELACIONADOS CON LAS SANCIONES IMPUESTAS A PARTICULARES (PERSONAS MORALES) POR LA COMISIÓN DE HECHOS DE CORRUPCIÓN."
            }
            subheader="Información Registrada"
          />
          <Divider />
          <CardContent sx={{ m: 1 }}>
            {S2List.length === 0 ? ( // Check if S2List is empty
              <>
                <Typography variant="h4" align="center">
                  No hay registros aún. Captura un registro para comenzar.
                </Typography>
              </>
            ) : (
              <TableContainer component={Paper}>
                <Table aria-label="custom pagination table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">
                        <b>Identificador</b>
                      </TableCell>
                      <TableCell align="left">
                        <b>Servidor público</b>
                      </TableCell>
                      <TableCell align="left">
                        <b>Institución</b>
                      </TableCell>
                      <TableCell align="center">
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
                          {registro.hechosMorales.nombres &&
                            registro.hechosMorales.nombres + " "}
                          {registro.hechosMorales.primerApellido &&
                            registro.hechosMorales.primerApellido + " "}
                          {registro.hechosMorales.segundoApellido &&
                          registro.hechosMorales.segundoApellido.sinSegundoApellido ==
                            true
                            ? ""
                            : registro.hechosMorales.segundoApellido.valor}
                        </TableCell>
                        {registro.hechosMorales.entePublico && (
                          <TableCell style={{ width: "25%" }} align="left">
                            {registro.hechosMorales.entePublico.siglas &&
                              registro.hechosMorales.entePublico.siglas}
                          </TableCell>
                        )}
                        <TableCell style={{ width: "15%" }} align="center">
                          <Tooltip title="Más información" placement="top">
                            <IconButton
                              onClick={() => handleOpenModalInfo(registro)}
                              style={{ color: "#34b3eb" }}
                              aria-label="expand row"
                              size="small">
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar registro" placement="top">
                            <IconButton
                              onClick={() =>
                                redirectToRoute(
                                  `/editar/s3/hechos-corrupcion/personas-morales/${registro._id}`,
                                )
                              }
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
            <Button
              sx={{ m: 1 }}
              variant="contained"
              color="primary"
              onClick={() =>
                redirectToRoute(
                  "/captura/s3/hechos-corrupcion/personas-morales",
                )
              }>
              Capturar Información
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
};
