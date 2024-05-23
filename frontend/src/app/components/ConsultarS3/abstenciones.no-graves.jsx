import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
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
  useTheme,
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

const tipoFormulario = "consultar.abstenciones.no-graves";

export const ListForm11 = () => {
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
              <Typography align={"center"}>
                1. DATOS GENERALES DE LA PERSONA SERVIDORA PÚBLICA
              </Typography>
            </Grid>

            <Grid item md={6} xs={12}>
              <Typography align="left">
                <b>Fecha de Captura:</b>{" "}
                {selectedRegistro.fechaCaptura ? (
                  selectedRegistro.fechaCaptura
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>

            <Grid item md={6} xs={12}>
              <Typography align="left">
                <b>Ejercicio:</b>{" "}
                {selectedRegistro.ejercicio ? (
                  selectedRegistro.ejercicio
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>

            <Grid item md={6} xs={12}>
              <Typography align="left">
                <b>Primer Apellido:</b>{" "}
                {selectedRegistro.primerApellido ? (
                  selectedRegistro.primerApellido
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>

            <Grid item md={6} xs={12}>
              <Typography align="left">
                <b>CURP:</b>{" "}
                {selectedRegistro.curp ? selectedRegistro.curp : <Nota />}
              </Typography>
            </Grid>

            <Grid item md={6} xs={12}>
              <Typography align="left">
                <b>Sexo:</b>{" "}
                {selectedRegistro.sexo ? selectedRegistro.sexo : <Nota />}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ m: 3 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography align={"center"}>
                2. DATOS DEL EMPLEO, CARGO O COMISIÓN
              </Typography>
            </Grid>

            <Grid item md={6} xs={12}>
              <Typography align="left"></Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={'FORMATO QUE INDICA LOS DATOS QUE SE INSCRIBIRÁN EN EL SISTEMA NACIONAL DE SERVIDORES PÚBLICOS Y PARTICULARES SANCIONADOS DE LA PLATAFORMA DIGITAL NACIONAL RELACIONADOS CON LAS ABTENCIONES REALIZADAS POR LOS ÓRGANOS INTERNOS DE CONTROL DE LOS ENTES PÚBLICOS.'}
            subheader="Información Registrada"
          />
          <Divider />
          <CardContent>
            {S2List.length === 0 ? ( // Check if S2List is empty
              <>
                <Typography variant="h4" align="left" mb={2}>
                  No hay registros aún. Agrega un registro para comenzar.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    redirectToRoute(
                      "/captura/s3/abstenciones/no-graves",
                    )
                  }>
                  Capturar Información
                </Button>
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
                          {registro.grave.nombres &&
                            registro.grave.nombres + " "}
                          {registro.grave.primerApellido &&
                            registro.grave.primerApellido + " "}
                          {registro.grave.segundoApellido &&
                          registro.grave.segundoApellido.sinSegundoApellido ==
                            true
                            ? ""
                            : registro.grave.segundoApellido.valor}
                        </TableCell>
                        {registro.grave.entePublico && (
                          <TableCell style={{ width: "25%" }} align="left">
                            {registro.grave.entePublico.siglas &&
                              registro.grave.entePublico.siglas}
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
                              onClick={() =>
                                redirectToRoute(
                                  `/editar/s3/faltas-administrativas/graves/${registro._id}`,
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
            )}
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};
