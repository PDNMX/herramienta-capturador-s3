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
  Button,
  TableHead,
  Grid,
  IconButton,
  Typography,
  Snackbar,
  Divider,
  Tooltip,
  Toolbar,
  useTheme,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import Checkbox from "@mui/material/Checkbox";
import { TextField, makeValidate, Select, DatePicker } from "mui-rff";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Alert } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { alertActions } from "../../_actions/alert.actions";
import { history } from "../../store/history";
import { S3PActions } from "../../_actions/s3p.action";
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


export const ListS3PSchemav2 = () => {
  const {
    S3PList,
    alerta,
    paginationSuper,
    catalogos,
    permisos,
    providerUser,
  } = useSelector((state) => ({
    S3PList: state.S3P,
    alerta: state.alert,
    paginationSuper: state.pagination,
    catalogos: state.catalogs,
    permisos: state.permisos,
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
  const [match, setMatch] = React.useState({ params: { id: "" } });
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
      S3PActions.requestListS3P({
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
        S3PActions.requestListS3P({
          query: query,
          page: 1,
          pageSize: parseInt(event.target.value, 10),
        }),
      );
    } else {
      dispatch(
        S3PActions.requestListS3P({
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
    const sizeList = S3PList.length - disco;

    dispatch(S3PActions.deleteRecordRequest(id));
    paginationSuper.totalRows = paginationSuper.totalRows - disco;

    const changePage = sizeList < paginationSuper.page;
    if (changePage && paginationSuper.page > 1) {
      dispatch(
        S3PActions.requestListS3P({
          query: query,
          page: paginationSuper.page - 1,
          pageSize: paginationSuper.pageSize,
        }),
      );
    } else {
      dispatch(
        S3PActions.requestListS3P({
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
      for (const schema of S3PList) {
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

  const schema = Yup.object().shape({
    expediente: Yup.string()
      .matches(
        new RegExp("^[A-zÀ-ú-0-9]{1,25}$"),
        "No se permiten cadenas vacías, máximo 25 caracteres",
      )
      .trim(),
    idnombre: Yup.string()
      .matches(
        new RegExp("^[A-zÀ-ú-0-9_]{1,50}$"),
        "No se permiten cadenas vacías, máximo 50 caracteres",
      )
      .trim(),
    SP3nombres: Yup.string()
      .matches(
        new RegExp("^['A-zÀ-ú- ]{1,25}$"),
        "No se permiten números, ni cadenas vacías máximo 25 caracteres",
      )
      .trim(),
    SP3primerApellido: Yup.string()
      .matches(
        new RegExp("^['A-zÀ-ú- ]{1,25}$"),
        "No se permiten números, ni cadenas vacías máximo 25 caracteres",
      )
      .trim(),
    SP3segundoApellido: Yup.string()
      .matches(
        new RegExp("^['A-zÀ-ú- ]{1,25}$"),
        "No se permiten números, ni cadenas vacías máximo 25 caracteres",
      )
      .trim(),
    fechaCaptura: Yup.string().nullable(true),
  });

  const validate = makeValidate(schema);
  //const required = makeRequired(schema)

  // yes, this can even be async!
  async function onSubmit(values) {
    const newQuery = {};
    for (const [key, value] of Object.entries(values)) {
      if (key === "expediente" && value !== null && value !== "") {
        newQuery["expediente"] = {
          $regex: diacriticSensitiveRegex(value),
          $options: "i",
        };
      } else if (key === "idnombre" && value !== null && value !== "") {
        newQuery["institucionDependencia.nombre"] = {
          $regex: diacriticSensitiveRegex(value),
          $options: "i",
        };
      } else if (key === "SP3nombres" && value !== null && value !== "") {
        newQuery["particularSancionado.nombreRazonSocial"] = {
          $regex: diacriticSensitiveRegex(value),
          $options: "i",
        };
      } else if (key === "tipoPersona" && value !== null && value !== "") {
        const objTipoPersona = JSON.parse(value);
        newQuery["particularSancionado.tipoPersona"] = {
          $in: [objTipoPersona.clave],
        };
      } else if (key === "tipoSancion") {
        if (value.length > 0) {
          const arrayObjTipoSancion = value;
          const acumulado = [];
          for (const obSancion of arrayObjTipoSancion) {
            acumulado.push(JSON.parse(obSancion).clave);
          }
          newQuery["tipoSancion.clave"] = { $in: acumulado };
        }
      } else if (key === "fechaFinal" && value !== null && value !== "") {
        const fecha = Date.parse(value);
        newQuery["inhabilitacion.fechaFinal"] = {
          $regex: formatISO(fecha, { representation: "date" }),
        };
      } else if (key === "fechaCaptura" && value !== null && value !== "") {
        const fecha = Date.parse(value);
        newQuery["fechaCaptura"] = {
          $regex: formatISO(fecha, { representation: "date" }),
        };
      } else if (value !== null && value !== "") {
        newQuery[key] = {
          $regex: diacriticSensitiveRegex(value),
          $options: "i",
        };
      }
    }
    setQuery(newQuery);
    dispatch(
      S3PActions.requestListS3P({
        query: newQuery,
        page: 1,
        pageSize: paginationSuper.pageSize,
      }),
    );
  }

  function resetForm(form) {
    form.reset();
    setQuery({});
    dispatch(
      S3PActions.requestListS3P({
        page: paginationSuper.page,
        pageSize: paginationSuper.pageSize,
      }),
    );
  }

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
        color: "#ffff",
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
        margin: "15px",
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));

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
        fullScreen={fullScreen}
        onClose={handleCloseModalUserInfo}
        aria-labelledby="customized-dialog-title"
        open={openModalUserInfo}>
        <Toolbar className={classes.toolBarModal}>
          <Typography variant="h6" className={classes.titleDialogDetail}>
            <b>Detalle del registro</b>
            <Typography className={classes.whiteStyle}>
              *(DNC) = Dato No Capturado
            </Typography>
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseModalUserInfo}
            aria-label="close"
            size="large">
            <CloseIcon className={classes.whiteStyle} />
          </IconButton>
        </Toolbar>
        <DialogContent dividers>
          <Grid container>
            <Grid item xs={12}>
              <Typography className={classes.titulo} align={"center"}>
                Datos generales
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.expediente ? (
                  selectedRegistro.expediente
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
            <Grid className={classes.gridpadding} item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Nombre / Razón social</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2"
                noWrap={true}>
                {selectedRegistro.particularSancionado?.nombreRazonSocial}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.particularSancionado?.rfc ? (
                  selectedRegistro.particularSancionado.rfc
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.subtitulo} align={"left"}>
                Institución / Dependencia
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.institucionDependencia?.clave ? (
                  selectedRegistro.institucionDependencia.clave
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.institucionDependencia?.siglas ? (
                  selectedRegistro.institucionDependencia.siglas
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={6} sm={12}>
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
                {selectedRegistro.institucionDependencia?.nombre ? (
                  selectedRegistro.institucionDependencia.nombre
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.containerDivider}>
              <Divider
                orientation="horizontal"
                className={classes.divider}
                variant={"inset"}
                light={true}
              />
            </Grid>
            <Grid className={classes.gridpadding} item md={12} sm={12}>
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
                {selectedRegistro.observaciones ? (
                  selectedRegistro.observaciones
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.titulo} align={"center"}>
                Datos de la sanción
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={6} sm={12}>
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
                {selectedRegistro.tipoSancion ? (
                  selectedRegistro.tipoSancion.map((e) => (
                    <li>
                      {e.valor}{" "}
                      {e.descripcion ? " - DESCRIPCIÓN:" + e.descripcion : ""}
                    </li>
                  ))
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={6} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Tipo falta</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.tipoFalta ? (
                  selectedRegistro.tipoFalta
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.subtitulo} align={"left"}>
                Resolución
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Autoridad sancionadora</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2"
                noWrap={true}>
                {selectedRegistro.autoridadSancionadora}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.resolucion?.fechaNotificacion ? (
                  new Date(
                    selectedRegistro.resolucion.fechaNotificacion +
                      "T00:00:00.000",
                  ).toLocaleDateString("es-ES", optionsOnlyDate)
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>URL</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2"
                noWrap={true}>
                {selectedRegistro.resolucion ? (
                  selectedRegistro.resolucion.url
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Sentido</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.resolucion?.sentido ? (
                  selectedRegistro.resolucion.sentido
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>

            <Grid item xs={12} className={classes.containerDivider}>
              <Divider
                orientation="horizontal"
                className={classes.divider}
                variant={"inset"}
                light={true}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography className={classes.subtitulo} align={"left"}>
                Inhabilitación / Multa
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.inhabilitacion?.plazo ? (
                  selectedRegistro.inhabilitacion.plazo
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.inhabilitacion?.fechaInicial ? (
                  new Date(
                    selectedRegistro.inhabilitacion.fechaInicial +
                      "T00:00:00.000",
                  ).toLocaleDateString("es-ES", optionsOnlyDate)
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.inhabilitacion?.fechaFinal ? (
                  new Date(
                    selectedRegistro.inhabilitacion.fechaFinal +
                      "T00:00:00.000",
                  ).toLocaleDateString("es-ES", optionsOnlyDate)
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                  <Nota />
                )}
                {selectedRegistro.multa?.moneda
                  ? selectedRegistro.multa.moneda.clave
                  : ""}
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.containerDivider}>
              <Divider orientation="horizontal" className={classes.divider} />
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.subtitulo} align={"left"}>
                Responsable de la sanción
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.responsableSancion?.nombres ? (
                  selectedRegistro.responsableSancion.nombres
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.responsableSancion?.primerApellido ? (
                  selectedRegistro.responsableSancion.primerApellido
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.responsableSancion?.segundoApellido ? (
                  selectedRegistro.responsableSancion.segundoApellido
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.responsableSancion?.curp ? (
                  selectedRegistro.responsableSancion.curp
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.containerDivider}>
              <Divider
                orientation="horizontal"
                className={classes.divider}
                variant={"inset"}
                light={true}
              />
            </Grid>
            <Grid className={classes.gridpadding} item md={6} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Causa, motivo o hechos</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.causaMotivoHechos}
              </Typography>
            </Grid>

            <Grid className={classes.gridpadding} item md={6} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Acto</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.acto ? selectedRegistro.acto : <Nota />}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.titulo} align={"center"}>
                Datos del particular sancionado
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Tipo persona</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.particularSancionado?.tipoPersona ? (
                  selectedRegistro.particularSancionado.tipoPersona === "M" ? (
                    "Moral"
                  ) : (
                    "Física"
                  )
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>

            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.particularSancionado?.telefono ? (
                  selectedRegistro.particularSancionado.telefono
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={6} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Objeto social</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.particularSancionado?.objetoSocial ? (
                  selectedRegistro.particularSancionado.objetoSocial
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.subtitulo} align={"left"}>
                Director general
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.particularSancionado?.directorGeneral
                  ?.nombres ? (
                  selectedRegistro.particularSancionado.directorGeneral.nombres
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Apellido Paterno</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.particularSancionado?.directorGeneral
                  ?.primerApellido ? (
                  selectedRegistro.particularSancionado.directorGeneral
                    .primerApellido
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Apellido Materno</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.particularSancionado?.directorGeneral
                  ?.segundoApellido ? (
                  selectedRegistro.particularSancionado.directorGeneral
                    .segundoApellido
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.particularSancionado?.directorGeneral
                  ?.curp ? (
                  selectedRegistro.particularSancionado.directorGeneral.curp
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.containerDivider}>
              <Divider
                orientation="horizontal"
                className={classes.divider}
                variant={"inset"}
                light={true}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.subtitulo} align={"left"}>
                Apoderado legal
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.particularSancionado?.apoderadoLegal
                  ?.nombres ? (
                  selectedRegistro.particularSancionado.apoderadoLegal.nombres
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Apellido Paterno</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.particularSancionado?.apoderadoLegal
                  ?.primerApellido ? (
                  selectedRegistro.particularSancionado.apoderadoLegal
                    .primerApellido
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
              <Typography
                className={classes.titlegridModal}
                align="left"
                variant="subtitle2">
                <b>Apellido Materno</b>
              </Typography>
              <Typography
                className={classes.body2}
                align="left"
                variant="body2">
                {selectedRegistro.particularSancionado?.apoderadoLegal
                  ?.segundoApellido ? (
                  selectedRegistro.particularSancionado.apoderadoLegal
                    .segundoApellido
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid className={classes.gridpadding} item md={3} sm={12}>
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
                {selectedRegistro.particularSancionado?.apoderadoLegal?.curp ? (
                  selectedRegistro.particularSancionado.apoderadoLegal.curp
                ) : (
                  <Nota />
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.containerDivider}>
              <Divider
                orientation="horizontal"
                className={classes.divider}
                variant={"inset"}
                light={true}
              />
            </Grid>
            {selectedRegistro.particularSancionado?.domicilioMexico && (
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography className={classes.titulo} align={"center"}>
                      Domicilio México
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2">
                      <b>País</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2">
                      {selectedRegistro.particularSancionado?.domicilioMexico
                        ?.pais?.valor ? (
                        selectedRegistro.particularSancionado.domicilioMexico
                          .pais.valor
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2">
                      <b>Entidad federativa</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2">
                      {selectedRegistro.particularSancionado?.domicilioMexico
                        ?.entidadFederativa?.valor ? (
                        selectedRegistro.particularSancionado.domicilioMexico
                          .entidadFederativa.valor
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2">
                      <b>Municipio</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2">
                      {selectedRegistro.particularSancionado?.domicilioMexico
                        ?.municipio?.valor ? (
                        selectedRegistro.particularSancionado.domicilioMexico
                          .municipio.valor
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2">
                      <b>Localidad</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2">
                      {selectedRegistro.particularSancionado?.domicilioMexico
                        ?.localidad?.valor ? (
                        selectedRegistro.particularSancionado.domicilioMexico
                          .localidad.valor
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2">
                      <b>Vialidad</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2">
                      {selectedRegistro.particularSancionado?.domicilioMexico
                        ?.vialidad?.valor ? (
                        selectedRegistro.particularSancionado.domicilioMexico
                          .vialidad.valor
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2">
                      <b>Código postal</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2">
                      {selectedRegistro.particularSancionado?.domicilioMexico
                        ?.codigoPostal ? (
                        selectedRegistro.particularSancionado.domicilioMexico
                          .codigoPostal
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2">
                      <b>Número exterior</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2">
                      {selectedRegistro.particularSancionado?.domicilioMexico
                        ?.numeroExterior ? (
                        selectedRegistro.particularSancionado.domicilioMexico
                          .numeroExterior
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2">
                      <b>Número interior</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2">
                      {selectedRegistro.particularSancionado?.domicilioMexico
                        ?.numeroInterior ? (
                        selectedRegistro.particularSancionado.domicilioMexico
                          .numeroInterior
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )}

            {selectedRegistro.particularSancionado?.domicilioExtranjero && (
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <Typography className={classes.titulo} align={"center"}>
                    Domicilio extranjero
                  </Typography>
                </Grid>
                <Grid container>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2">
                      <b>País</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2">
                      {selectedRegistro.particularSancionado
                        ?.domicilioExtranjero?.pais?.valor ? (
                        selectedRegistro.particularSancionado
                          .domicilioExtranjero.pais.valor
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2">
                      <b>Calle</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2">
                      {selectedRegistro.particularSancionado
                        ?.domicilioExtranjero?.calle ? (
                        selectedRegistro.particularSancionado
                          .domicilioExtranjero.calle
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2">
                      <b>Ciudad / Localidad</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2">
                      {selectedRegistro.particularSancionado
                        ?.domicilioExtranjero?.ciudadLocalidad ? (
                        selectedRegistro.particularSancionado
                          .domicilioExtranjero.ciudadLocalidad
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2">
                      <b>Estado / Provincia</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2">
                      {selectedRegistro.particularSancionado
                        ?.domicilioExtranjero?.estadoProvincia ? (
                        selectedRegistro.particularSancionado
                          .domicilioExtranjero.estadoProvincia
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2">
                      <b>Código postal</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2">
                      {selectedRegistro.particularSancionado
                        ?.domicilioExtranjero?.codigoPostal ? (
                        selectedRegistro.particularSancionado
                          .domicilioExtranjero.codigoPostal
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2">
                      <b>Número exterior</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2">
                      {selectedRegistro.particularSancionado
                        ?.domicilioExtranjero?.numeroExterior ? (
                        selectedRegistro.particularSancionado
                          .domicilioExtranjero.numeroExterior
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                  <Grid className={classes.gridpadding} item md={3} sm={12}>
                    <Typography
                      className={classes.titlegridModal}
                      align="left"
                      variant="subtitle2">
                      <b>Número interior</b>
                    </Typography>
                    <Typography
                      className={classes.body2}
                      align="left"
                      variant="body2">
                      {selectedRegistro.particularSancionado
                        ?.domicilioExtranjero?.numeroInterior ? (
                        selectedRegistro.particularSancionado
                          .domicilioExtranjero.numeroInterior
                      ) : (
                        <Nota />
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography className={classes.titulo} align={"center"}>
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
        <CardHeader title="S3P v2" subheader="Información Registrada" />
        <Divider />
        {/* <Grid item md={12} sm={12}>
          {selectedCheckBox.length > 0 && (
            <EnhancedTableToolbar></EnhancedTableToolbar>
          )}{" "}
        </Grid> */}

        {/* <Grid
          className={`${classes.gridpadding} ${classes.gridpaddingBottom} `}
          container
          justifyContent={"flex-start"}>
          <Typography variant="body1" className={classes.fontblack}>
            <b>Resultados</b>
          </Typography>
        </Grid> */}
        <CardContent>
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
                      selectedCheckBox.length < S3PList.length
                    }
                    checked={selectedCheckBox.length === S3PList.length}
                    onClick={(event) => handleCheckboxAll(event)}
                  />
                </TableCell>
                <StyledTableCell
                  align="center"
                  className={classes.tableHeaderColumn}>
                  <b>Expediente</b>
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  className={classes.tableHeaderColumn}>
                  <b>Institución/Dependencia</b>
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  className={classes.tableHeaderColumn}>
                  <b>Nombre/Razón Social</b>
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  className={classes.tableHeaderColumn}>
                  <b>Tipo persona</b>
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  className={classes.tableHeaderColumn}>
                  <b>Tipo sanción</b>
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  className={classes.tableHeaderColumn}>
                  <b>Acciones</b>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            {S3PList.map((schema) => (
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
                  <StyledTableCell style={{ width: 140 }} align="center">
                    {schema.expediente}
                  </StyledTableCell>
                  <StyledTableCell style={{ width: 160 }} align="center">
                    {schema.institucionDependencia.nombre}
                  </StyledTableCell>
                  <StyledTableCell style={{ width: 160 }} align="center">
                    {schema.particularSancionado.nombreRazonSocial}
                  </StyledTableCell>
                  <StyledTableCell style={{ width: 160 }} align="center">
                    {schema.particularSancionado.tipoPersona == "F"
                      ? "Física"
                      : "Moral"}
                  </StyledTableCell>
                  <StyledTableCell style={{ width: 160 }} align="left">
                    {schema.tipoSancion?.map((sancion) => (
                      <li>{sancion.valor + " "}</li>
                    ))}
                  </StyledTableCell>

                  <StyledTableCell style={{ width: 260 }} align="center">

                      <Tooltip title="Más información" placement="left">
                        <IconButton
                          onClick={() => handleOpenModalUserInfo(schema)}
                          style={{ color: "#34b3eb" }}
                          aria-label="expand row"
                          size="small">
                          <KeyboardArrowDownIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar registro" placement="top">
                        <IconButton 
                        onClick={() => redirectToRoute(`/editar/S3P/${schema._id}`) }
                        style={{ color: "#ffe01b" }}>
                          <EditOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    {/* <Tooltip title="Eliminar registro" placement="right">
                      <Button
                        style={{ color: "#f44336", padding: "0px" }}
                        onClick={() => {
                          handleClickOpen(schema._id, "nomre");
                        }}>
                        <DeleteOutlineOutlinedIcon />
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
                      colSpan={7}
                      count={paginationSuper.totalRows}
                      rowsPerPage={paginationSuper.pageSize}
                      page={paginationSuper.page - 1}
                      SelectProps={{
                        inputProps: { "aria-label": "Registros por página" },
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
