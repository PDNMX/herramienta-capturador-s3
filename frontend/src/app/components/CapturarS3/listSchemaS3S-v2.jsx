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
  Button,
  TableHead,
  Grid,
  IconButton,
  Typography,
  Snackbar,
  Divider,
  Tooltip,
  Toolbar,
  Paper,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Alert } from "@mui/material";

import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { alertActions } from "../../_actions/alert.actions";
import { history } from "../../store/history";
import { S3SActions } from "../../_actions/s3s.action";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Form } from "react-final-form";
import * as Yup from "yup";
import DateFnsUtils from "@date-io/date-fns";
import { formatISO } from "date-fns";
import deLocale from "date-fns/locale/es";
import NumberFormat from "react-number-format";
import { OnChange } from "react-final-form-listeners";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import DocumentTable from "./documentTable";
import Nota from "../Common/Nota";
import TablePaginationActions from "../Common/TablePaginationActionsProps";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export const ListS3SSchemav2 = () => {
  const { S3SList, alerta, paginationSuper, catalogos, providerUser } =
    useSelector((state) => ({
      S3SList: state.S3S,
      alerta: state.alert,
      paginationSuper: state.pagination,
      catalogos: state.catalogs,
      providerUser: state.providerUser,
    }));

  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [RegistroId, setRegistroId] = React.useState("");
  const [nombreUsuario, setNombreUsuario] = React.useState("");
  const [selectedCheckBox, setSelectedCheckBox] = React.useState([]);
  const [query, setQuery] = React.useState({});
  const [openModalUserInfo, setOpenModalUserInfo] = React.useState(false);
  const [selectedRegistro, setSelectedRegistro] =
    React.useState({});
  //const [match, setMatch] = React.useState({params: {id: ""}});
  const [maxWidth, setMaxWidth] = React.useState("md");
  const optionsDate = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const optionsOnlyDate = { year: "numeric", month: "long", day: "numeric" };

  const handleOpenModalUserInfo = (user) => {
    setOpenModalUserInfo(true);
    setSelectedRegistro(user);
  };

  const handleCloseModalUserInfo = () => {
    setOpenModalUserInfo(false);
  };

  const handleClickOpen = (id, nameReg) => {
    setOpen(true);
    setRegistroId(id);
    // setNombreUsuario(name+ " "+ primerApellido+ " "+ segundoApellido);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSnackbar = () => {
    dispatch(alertActions.clear());
  };

  const handleChangePage = (event, newPage) => {
    dispatch(
      S3SActions.requestListS3S({
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
        S3SActions.requestListS3S({
          query: query,
          page: 1,
          pageSize: parseInt(event.target.value, 10),
        }),
      );
    } else {
      dispatch(
        S3SActions.requestListS3S({
          query: query,
          page: 1,
          pageSize: parseInt(event.target.value, 10),
        }),
      );
    }
  };

  const confirmAction = (id) => {
    let disco = 1;
    if (Array.isArray(id)) {
      disco = id.length;
    }
    const sizeList = S3SList.length - disco;

    dispatch(S3SActions.deleteRecordRequest(id));
    paginationSuper.totalRows = paginationSuper.totalRows - disco;
    const changePage = sizeList < paginationSuper.page;

    if (changePage && paginationSuper.page > 1) {
      dispatch(
        S3SActions.requestListS3S({
          query: query,
          page: paginationSuper.page - 1,
          pageSize: paginationSuper.pageSize,
        }),
      );
    } else {
      dispatch(
        S3SActions.requestListS3S({
          query: query,
          page: paginationSuper.page,
          pageSize: paginationSuper.pageSize,
        }),
      );
    }

    setSelectedCheckBox([]);
    handleClose();
  };

  const EnhancedTableToolbar = () => {
    return (
      <Toolbar className={classes.tool}>
        <div className={classes.title}>
          {selectedCheckBox.length > 0 && (
            <Typography color="inherit" variant="subtitle1">
              {selectedCheckBox.length} registros seleccionados
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {selectedCheckBox.length > 0 && (
            <Tooltip title="Delete">
              <Button
                style={{ color: "white", padding: "0px" }}
                onClick={() => {
                  handleClickOpen(selectedCheckBox, "nomre");
                }}>
                <DeleteOutlineOutlinedIcon />
              </Button>
            </Tooltip>
          )}
        </div>
      </Toolbar>
    );
  };

  const handleCheckboxAll = (event) => {
    const array = [];
    if (event.target.checked) {
      for (const schema of S3SList) {
        array.push(schema._id);
      }
    }
    setSelectedCheckBox(array);
  };

  const handleCheckboxClick = (event, id) => {
    event.stopPropagation();

    const selectedIndex = selectedCheckBox.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedCheckBox, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedCheckBox.slice(1));
    } else if (selectedIndex === selectedCheckBox.length - 1) {
      newSelected = newSelected.concat(selectedCheckBox.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedCheckBox.slice(0, selectedIndex),
        selectedCheckBox.slice(selectedIndex + 1),
      );
    }

    setSelectedCheckBox(newSelected);
  };

  function diacriticSensitiveRegex(string = "") {
    string = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return string
      .replace(/a/g, "[a,á,à,ä]")
      .replace(/e/g, "[e,é,ë]")
      .replace(/i/g, "[i,í,ï]")
      .replace(/o/g, "[o,ó,ö,ò]")
      .replace(/u/g, "[u,ü,ú,ù]")
      .replace(/A/g, "[a,á,à,ä]")
      .replace(/E/g, "[e,é,ë]")
      .replace(/I/g, "[i,í,ï]")
      .replace(/O/g, "[o,ó,ö,ò]")
      .replace(/U/g, "[u,ü,ú,ù]");
  }

  /* interface FormFiltersEsquemaS3S {
        ejercicioFiscal: string,
        nombres?: string,
        primerApellido?: string,
        segundoApellido?: string,
        idnombre?: string,
        puestoNombre?: string,
        fechaCaptura?: string

    } */

  //const validate = makeValidate(schema);
  //const required = makeRequired(schema)

  // yes, this can even be async!
  /* async function onSubmit(values: FormDataEsquemaS3S) {
        let newQuery = {};
        for (let [key, value] of Object.entries(values)) {
            if (key === "expediente" && value !== null && value !== '') {
                newQuery["expediente"] = {$regex: diacriticSensitiveRegex(value), $options: 'i'};
            } else if (key === "idnombre" && value !== null && value !== '') {
                newQuery["institucionDependencia.nombre"] = {$regex: diacriticSensitiveRegex(value), $options: 'i'};
            } else if (key === "SPSnombres" && value !== null && value !== '') {
                newQuery["servidorPublicoSancionado.nombres"] = {$regex: diacriticSensitiveRegex(value), $options: 'i'};
            } else if (key === "SPSprimerApellido" && value !== null && value !== '') {
                newQuery["servidorPublicoSancionado.primerApellido"] = {
                    $regex: diacriticSensitiveRegex(value),
                    $options: 'i'
                };
            } else if (key === "SPSsegundoApellido" && value !== null && value !== '') {
                newQuery["servidorPublicoSancionado.segundoApellido"] = {
                    $regex: diacriticSensitiveRegex(value),
                    $options: 'i'
                };
            } else if (key === "tipoSancion") {
                if (value.length > 0) {
                    let arrayObjTipoSancion = value;
                    let acumulado = []
                    for (let obSancion of arrayObjTipoSancion) {
                        
                        acumulado.push(JSON.parse(obSancion).clave);
                    }
                    newQuery["tipoSancion.clave"] = {$in: acumulado};
                }
            } else if (key === "inhabilitacionFechaFinal" && value !== null && value !== '') {
                let fecha = Date.parse(value);
                newQuery["inhabilitacion.fechaFinal"] = formatISO(fecha, {representation: 'date'});
            } else if (key === "fechaCaptura" && value !== null && value !== '') {
                let fecha = Date.parse(value);
                newQuery["fechaCaptura"] = {$regex: formatISO(fecha, {representation: 'date'})};

            }
        }
        setQuery(newQuery);
        dispatch(S3SActions.requestListS3S({query: newQuery, page: 1, pageSize: paginationSuper.pageSize}));
    } */

  /* function resetForm(form) {
        form.reset();
        setQuery({});
        dispatch(S3SActions.requestListS3S({page: paginationSuper.page, pageSize: paginationSuper.pageSize}));
    } */

  const StyledTableCell = withStyles({
    root: {
      color: "#666666",
    },
  })(TableCell);

  const redirectToRoute = (path) => {
    history.push(path);
  };

  const useStyles = makeStyles((theme) =>
    createStyles({
      root: {
        "&$checked": {
          color: "#ffe01b",
        },
      },
      checked: {},
      indeterminate: {
        color: "#666666",
      },
      tool: {
        color: "white",
        backgroundColor: "#7f7e7e",
      },
      spacer: {
        flex: "1 1 100%",
      },
      titleDialogDetail: {
        flex: 1,
      },
      actions: {
        color: theme.palette.text.secondary,
      },
      title: {
        flex: "0 0 auto",
      },
      fontblack: {
        color: "#666666",
      },
      titleModal: {
        "padding-top": "13px",
        color: "#585858",
        "font-size": "17px",
      },
      divider: {
        width: "100%",
        backgroundColor: "##b7a426",
        color: "#b7a426",
        margin: "10px",
      },
      boton: {
        marginTop: "16px",
        marginLeft: "16px",
        marginRight: "16px",
        marginBottom: "0px",
        backgroundColor: "#ffe01b",
        color: "#666666",
      },
      boton2: {
        marginTop: "16px",
        marginLeft: "16px",
        marginRight: "-10px",
        marginBottom: "0px",
        backgroundColor: "#ffe01b",
        color: "#666666",
      },
      filterContainer: {
        padding: "10px 10px 20px 10px",
      },
      gridpadding: {
        "padding-top": "10px",
      },
      gridpaddingBottom: {
        "padding-bottom": "10px",
        "padding-left": "10px",
      },
      titlegridModal: {
        color: "#585858",
      },
      body2: {
        color: "#666666",
      },
      marginright: {
        marginRight: "30px",
        marginTop: "15px",
        backgroundColor: "#ffe01b",
        color: "#666666",
        marginBottom: "30px",
      },
      overSelect: {
        "max-height": "19px",
        "white-space": "normal !important",
      },
      paper: {
        "text-align": "center",
        margin: 0,
        marginTop: "75px",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
      modal: {
        overflowY: "auto",
      },
      tableHead: {
        backgroundColor: "#34b3eb",
      },
      tableHeaderColumn: {
        color: "#ffff",
      },
      whiteStyle: {
        color: "#ffff",
      },
      titulo: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 10,
        textDecoration: "underline",
        textDecorationColor: "#34b3eb",
        color: "#34b3eb",
      },
      toolBarModal: {
        backgroundColor: "#34b3eb",
      },
      subtitulo: {
        fontSize: 15,
        fontWeight: "bold",
        textDecoration: "underline",
        textDecorationColor: "#585858",
        color: "#585858",
        paddingTop: "10px",
      },
      containerDivider: {
        paddingLeft: "15px",
        paddingRight: "15px",
      },
    }),
  );

  const classes = useStyles();

  console.log(S3SList);
  console.log(selectedRegistro);
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
        fullWidth={true}
        maxWidth={maxWidth}
        onClose={handleCloseModalUserInfo}
        aria-labelledby="customized-dialog-title"
        open={openModalUserInfo}>
        <Toolbar>
          <Typography variant="h5" className={classes.titleDialogDetail}>
            <b>Detalle del registro</b>
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseModalUserInfo}
            aria-label="close"
            size="large">
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <DialogContent dividers>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" align={"center"}>
                Datos generales
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Expediente</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.expediente ? selectedRegistro.expediente : ""}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Fecha última actualización</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {new Date(selectedRegistro.fechaCaptura).toLocaleDateString(
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
                <b>Nombres</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.servidorPublicoSancionado?.nombres}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Primer apellido</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.servidorPublicoSancionado?.primerApellido}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Segundo apellido</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.servidorPublicoSancionado?.segundoApellido
                  ? selectedRegistro.servidorPublicoSancionado.segundoApellido
                  : ""}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>RFC</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.servidorPublicoSancionado?.rfc
                  ? selectedRegistro.servidorPublicoSancionado.rfc
                  : ""}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>CURP</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.servidorPublicoSancionado?.curp
                  ? selectedRegistro.servidorPublicoSancionado.curp
                  : ""}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Género</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.servidorPublicoSancionado?.genero
                  ? selectedRegistro.servidorPublicoSancionado.genero.valor
                  : ""}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" align={"left"}>
                Institución / Dependencia
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Clave</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.institucionDependencia?.clave
                  ? selectedRegistro.institucionDependencia.clave
                  : ""}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Siglas</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.institucionDependencia?.siglas
                  ? selectedRegistro.institucionDependencia.siglas
                  : ""}
              </Typography>
            </Grid>
            <Grid item md={6} sm={12}>
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
                {selectedRegistro.institucionDependencia?.nombre
                  ? selectedRegistro.institucionDependencia.nombre
                  : ""}
              </Typography>
            </Grid>

            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Puesto</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.servidorPublicoSancionado?.puesto
                  ? selectedRegistro.servidorPublicoSancionado.puesto
                  : ""}
              </Typography>
            </Grid>

            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Nivel</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.servidorPublicoSancionado?.nivel
                  ? selectedRegistro.servidorPublicoSancionado.nivel
                  : ""}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" align={"center"}>
                Datos de la sanción
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" align={"left"}>
                Resolución
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Autoridad sancionadora</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.autoridadSancionadora
                  ? selectedRegistro.autoridadSancionadora
                  : ""}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Fecha</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.fechaResolucion
                  ? new Date(
                      selectedRegistro.resolucion?.fechaResolucion +
                        "T00:00:00.000",
                    ).toLocaleDateString("es-ES", optionsOnlyDate)
                  : ""}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>URL</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.resolucion
                  ? selectedRegistro.resolucion.url
                  : ""}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" align={"left"}>
                Inhabilitación / Multa
              </Typography>
            </Grid>

            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Plazo</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.inhabilitacion?.plazo
                  ? selectedRegistro.inhabilitacion.plazo
                  : ""}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Fecha inicial</b>
              </Typography>

              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.inhabilitacion?.fechaInicial
                  ? new Date(
                      selectedRegistro.inhabilitacion.fechaInicial +
                        "T00:00:00.000",
                    ).toLocaleDateString("es-ES", optionsOnlyDate)
                  : ""}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Fecha final</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.inhabilitacion?.fechaFinal
                  ? new Date(
                      selectedRegistro.inhabilitacion.fechaFinal +
                        "T00:00:00.000",
                    ).toLocaleDateString("es-ES", optionsOnlyDate)
                  : ""}
              </Typography>
            </Grid>
            <Grid item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Multa</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.multa ? (
                  <NumberFormat
                    value={String(selectedRegistro.multa?.monto)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                ) : (
                  ""
                )}
                {selectedRegistro.multa?.moneda
                  ? selectedRegistro.multa.moneda.clave
                  : ""}
              </Typography>
            </Grid>

            <Grid item md={6} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Tipo sanción</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.tipoSancion
                  ? selectedRegistro.tipoSancion.map((e) => (
                      <li>
                        {e.valor}{" "}
                        {e.descripcion
                          ? " - DESCRIPCIÓN: " + e.descripcion
                          : ""}
                      </li>
                    ))
                  : ""}
              </Typography>
            </Grid>
            <Grid item md={6} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Tipo de falta</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.tipoFalta?.valor
                  ? selectedRegistro.tipoFalta.valor +
                    " " +
                    (selectedRegistro.tipoFalta.descripcion
                      ? " - DESCRIPCIÓN: " +
                        selectedRegistro.tipoFalta.descripcion
                      : "")
                  : ""}
              </Typography>
            </Grid>
            <Grid item md={12} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Causa o Motivo de hechos</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.causaMotivoHechos}
              </Typography>
            </Grid>
            <Grid item md={12} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Observaciones</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.observaciones
                  ? selectedRegistro.observaciones
                  : ""}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" align={"center"}>
                Documentos
              </Typography>
            </Grid>
            {!selectedRegistro.documentos ||
            selectedRegistro.documentos.length < 1 ? (
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                <b>*No se proporcionaron documentos</b>
              </Typography>
            ) : (
              ""
            )}
            {selectedRegistro.documentos &&
              selectedRegistro.documentos.length > 0 && (
                <DocumentTable documents={selectedRegistro.documentos} />
              )}
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {"¿Seguro que desea eliminar el registro " + nombreUsuario + "?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Los cambios no serán reversibles
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              confirmAction(RegistroId);
            }}
            color="primary"
            autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Grid item xs={12}>
        <Card>
          <CardHeader title="S3S v2" subheader="Información Registrada" />
          <Divider />
          <CardContent>
            {/* <Typography variant="body1" className={classes.fontblack}>
              <b>Resultados</b>
            </Typography> */}
            <TableContainer component={Paper}>
              <Table aria-label="custom pagination table">
                <TableHead className={classes.tableHead}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        classes={{
                          root: classes.root,
                          checked: classes.checked,
                          indeterminate: classes.indeterminate,
                        }}
                        indeterminate={
                          selectedCheckBox.length > 0 &&
                          selectedCheckBox.length < S3SList.length
                        }
                        checked={selectedCheckBox.length === S3SList.length}
                        onClick={(event) => handleCheckboxAll(event)}
                      />
                    </TableCell>
                    <StyledTableCell className={classes.tableHeaderColumn}>
                      <b>Institución</b>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableHeaderColumn}>
                      <b>Servidor público</b>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableHeaderColumn}>
                      <b>Tipo falta</b>
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      className={classes.tableHeaderColumn}>
                      <b>Acciones</b>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                {S3SList.map((schema) => (
                  <TableBody key="usuarios">
                    <TableRow key={schema._id}>
                      <TableCell className="selectCheckbox" padding="checkbox">
                        <Checkbox
                          key={"check" + schema._id}
                          onClick={(event) =>
                            handleCheckboxClick(event, schema._id)
                          }
                          className="selectCheckbox"
                          classes={{
                            root: classes.root,
                            checked: classes.checked,
                          }}
                          checked={selectedCheckBox.indexOf(schema._id) > -1}
                        />
                      </TableCell>
                      {/* {schema.faltaGrave && (
                        <StyledTableCell style={{ width: "30%" }}>
                          {schema.faltaGrave.entePublico.nombre}
                        </StyledTableCell>
                      )}
                      {schema.faltaGrave && (
                        <StyledTableCell style={{ width: "30%" }}>
                          {schema.faltaGrave.nombres + " "}
                          {schema.faltaGrave.primerApellido + " "}
                          {schema.faltaGrave.segundoApellido}
                        </StyledTableCell>
                      )} */}

                      <StyledTableCell style={{ width: "20%" }}>
                        {schema.tipoDeFalta}
                      </StyledTableCell>

                      <StyledTableCell style={{ width: "20%" }} align="center">
                        
                          <Tooltip title="Ver registro" placement="top">
                            <IconButton
                              onClick={() => handleOpenModalUserInfo(schema)}
                              style={{ color: "#34b3eb" }}
                              aria-label="expand row"
                              size="small">
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar registro" placement="top">
                            <IconButton 
                            onClick={() => redirectToRoute(`/editar/S3S/${schema._id}`) }
                            style={{ color: "#ffe01b" }}>
                              <EditOutlinedIcon />
                            </IconButton>
                          </Tooltip>

                        {/* <Tooltip title="Eliminar registro" placement="top">
                                                <Button style={{color: '#f44336'}}
                                                        onClick={() => {
                                                            handleClickOpen(schema._id, "nomre")
                                                        }}>
                                                    <DeleteOutlineOutlinedIcon/>
                                                </Button>
                                            </Tooltip> */}
                      </StyledTableCell>
                    </TableRow>
                  </TableBody>
                ))}
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
                          SelectProps={{
                            inputProps: {
                              "aria-label": "Registros por página",
                            },
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
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};
