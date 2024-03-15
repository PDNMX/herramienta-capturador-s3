import { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import makeStyles from "@mui/styles/makeStyles";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Menu from "@mui/material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import PeopleIcon from "@mui/icons-material/People";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MenuItem from "@mui/material/MenuItem";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { ConnectedCreateProvider } from "../Proveedores/CreateProvider";
import { history } from "../../store/history";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
/* import { LoadFileV } from "../UploadFile/LoadFileV"; */
import { connect } from "react-redux";
import { ConnectedCreateUser } from "../Usuarios/createUser";
import { ConnectedChangePassword } from "../Usuarios/changePassword";
import { ListUser } from "../Usuarios/listUser";
import { ListProvider } from "../Proveedores/ListProvider";

import { ConnectedCreateRegv2 } from "../CargaDatos/createRegS2-v2";
import { ConnectedCreateRegS3Sv2 } from "../CargaDatos/createRegS3S-v2";
import { ConnectedCreateRegS3Pv2 } from "../CargaDatos/createRegS3P-v2";

/* S3 - 11 Forms CAPTURA */
import { CreateRegForm1 } from "../CargaDatos/s3/form1";
import { CreateRegForm2 } from "../CargaDatos/s3/form2";
import { CreateRegForm3 } from "../CargaDatos/s3/form3";
import { CreateRegForm4 } from "../CargaDatos/s3/form4";
import { CreateRegForm5 } from "../CargaDatos/s3/form5";
import { CreateRegForm6 } from "../CargaDatos/s3/form6";
import { CreateRegForm7 } from "../CargaDatos/s3/form7";
import { CreateRegForm8 } from "../CargaDatos/s3/form8";
import { CreateRegForm9 } from "../CargaDatos/s3/form9";
import { CreateRegForm10 } from "../CargaDatos/s3/form10";
import { CreateRegForm11 } from "../CargaDatos/s3/form11";

/* S3 - 11 ADMIN DATA */
import { ListForm1 } from "../../components/AdminDatos/faltas-administrativas-graves";

//import { useLocation } from "react-router-dom";
import { userActions } from "../../_actions/user.action";

import { ListS2Schemav2 } from "../CargaDatos/listSchemaS2-v2";
import { ListS3SSchemav2 } from "../CargaDatos/listSchemaS3S-v2";
import { ListS3PSchemav2 } from "../CargaDatos/listSchemaS3P-v2";

import { Inicio } from "../Inicio";

import { useSelector } from "react-redux";

import ControlPointIcon from "@mui/icons-material/ControlPoint";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CircleIcon from "@mui/icons-material/Circle";

import logoS3 from "../../../assets/img/ico_s3_light.svg";

const MenuV = ({ vistaRender, match, closeSession }) => {
  const { vigencia, permisos } = useSelector((state) => ({
    vigencia: state.vigencia,
    permisos: state.permisos,
  }));
  // falta iterar los permisos
  //console.log(permisos);

  //MSubmenus
  //const [submenuAdmonDatosS2, setsubmenuAdmonDatosS2] = useState(false);
  const [checkedUser, setCheckedUser] = useState(false);
  const [checkedProveedor, setCheckedProveedor] = useState(false);

  const [checkedFaltasGraves, setCheckFaltasGraves] = useState(false);
  const [checkedFaltasNoGraves, setCheckFaltasNoGraves] = useState(false);
  const [checkedActosParticularesFisicas, setCheckActosParticularesFisicas] =
    useState(false);
  const [checkedActosParticularesMorales, setCheckActosParticularesMorales] =
    useState(false);
  const [checkedInhabilitacionesFisicas, setCheckInhabilitacionesFisicas] =
    useState(false);
  const [checkedInhabilitacionesMorales, setCheckInhabilitacionesMorales] =
    useState(false);
  const [
    checkedCorrupcionServidoresPublicos,
    setCheckCorrupcionServidoresPublicos,
  ] = useState(false);
  const [checkedCorrupcionFisicas, setCheckCorrupcionFisicas] = useState(false);
  const [checkedCorrupcionMorales, setCheckCorrupcionMorales] = useState(false);
  const [checkedAbstencionesGraves, setCheckAbstencionesGraves] =
    useState(false);
  const [checkedAbstencionesNoGraves, setCheckAbstencionesNoGraves] =
    useState(false);

  const rol = localStorage.getItem("rol");

  const redirectToRoute = (path) => {
    const cambiarcontrasena = localStorage.getItem("cambiarcontrasena");
    if (vigencia === true || cambiarcontrasena === true) {
      history.push("/usuario/cambiarcontrasena");
    } else {
      history.push(path);
    }
  };

  //Cerrar sesión
  const [anchorEl, setAnchorEl] = useState(null);

  //Mostrar opciones de cerrar sesión
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //Cerrar opciones de cerrar sesión
  const handleClose = () => {
    setAnchorEl(null);
  };

  const cerrarSesion = () => {
    closeSession();
  };
  const drawerWidth = 260;

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      background: "#9085DA",
    },
  }));

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={classes.appBar}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Button disabled>
            <img src={logoS3} alt="logo-s3" height={35}/>
          </Button>

          <Typography component="div" variant="h6" color="#fff" noWrap>
            Herramienta de captura de información del Sistema nacional de
            servidores públicos y particulares sancionados
          </Typography>

          <div>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}>
              <ManageAccountsIcon style={{ color: "#fff" }} fontSize="large" />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}>
              <MenuItem
                onClick={() => redirectToRoute("/usuario/cambiarcontrasena")}>
                Cambiar contraseña
              </MenuItem>
              <MenuItem onClick={() => cerrarSesion()}>Cerrar sesión</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={"permanent"}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}>
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          {rol == 2 && (
            <>
              {/* Faltas Administrativas de Servidores Públicos */}
              <List
                component="div"
                disablePadding
                subheader="Faltas Administrativas de Servidores Públicos"
                sx={{
                  padding: "0.6rem",
                }}>
                {/* GRAVES */}
                <ListItem
                  onClick={() => setCheckFaltasGraves((prev) => !prev)}
                  key={"m3"}
                  disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Graves" />
                    {checkedFaltasGraves ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={checkedFaltasGraves}>
                  <ListItem
                    onClick={() =>
                      redirectToRoute(
                        "/captura/s3/faltas-administrativas/graves",
                      )
                    }
                    disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Capturar Información" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem onClick={() => redirectToRoute("/consulta/s3/faltas-administrativas/graves")} disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Administrar Información" />
                    </ListItemButton>
                  </ListItem>
                </Collapse>

                {/* NO GRAVES */}
                <ListItem
                  onClick={() => setCheckFaltasNoGraves((prev) => !prev)}
                  disablePadding>
                  <ListItemButton>
                    <ListItemText primary="No Graves" />
                    {checkedFaltasNoGraves ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={checkedFaltasNoGraves}>
                  <ListItem
                    onClick={() =>
                      redirectToRoute(
                        "/captura/s3/faltas-administrativas/no-graves",
                      )
                    }
                    disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Capturar Información" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem onClick={() => redirectToRoute("#")} disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Administrar Información" />
                    </ListItemButton>
                  </ListItem>
                </Collapse>
                <Divider sx={{ mt: 0.25, mb: 1.25 }} />
              </List>

              {/* Actos de Particulares vinculados con Faltas Graves */}
              <List
                component="div"
                disablePadding
                subheader="Actos de Particulares vinculados con Faltas Graves"
                sx={{
                  padding: "0.6rem",
                }}>
                {/* Personas Físicas */}
                <ListItem
                  onClick={() =>
                    setCheckActosParticularesFisicas((prev) => !prev)
                  }
                  disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Personas Físicas" />
                    {checkedActosParticularesFisicas ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse in={checkedActosParticularesFisicas}>
                  <ListItem
                    onClick={() =>
                      redirectToRoute(
                        "/captura/s3/actos-particulares/personas-fisicas",
                      )
                    }
                    disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Capturar Información" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem onClick={() => redirectToRoute("#")} disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Administrar Información" />
                    </ListItemButton>
                  </ListItem>
                </Collapse>

                {/* Personas Morales */}
                <ListItem
                  onClick={() =>
                    setCheckActosParticularesMorales((prev) => !prev)
                  }
                  disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Personas Morales" />
                    {checkedActosParticularesMorales ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse in={checkedActosParticularesMorales}>
                  <ListItem
                    onClick={() =>
                      redirectToRoute(
                        "/captura/s3/actos-particulares/personas-morales",
                      )
                    }
                    disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Capturar Información" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem onClick={() => redirectToRoute("#")} disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Administrar Información" />
                    </ListItemButton>
                  </ListItem>
                </Collapse>
                <Divider sx={{ mt: 0.25, mb: 1.25 }} />
              </List>

              {/* Sanciones (Inhabilitaciones) por normas diversas a la LGRA */}
              <List
                component="div"
                disablePadding
                subheader="Sanciones (Inhabilitaciones) por normas diversas a la LGRA"
                sx={{
                  padding: "0.6rem",
                }}>
                {/* Personas Físicas */}
                <ListItem
                  onClick={() =>
                    setCheckInhabilitacionesFisicas((prev) => !prev)
                  }
                  disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Personas Físicas" />
                    {checkedInhabilitacionesFisicas ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse in={checkedInhabilitacionesFisicas}>
                  <ListItem
                    onClick={() =>
                      redirectToRoute(
                        "/captura/s3/inhabilitaciones/personas-fisicas",
                      )
                    }
                    disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Capturar Información" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem onClick={() => redirectToRoute("#")} disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Administrar Información" />
                    </ListItemButton>
                  </ListItem>
                </Collapse>

                {/* Personas Morales */}
                <ListItem
                  onClick={() =>
                    setCheckInhabilitacionesMorales((prev) => !prev)
                  }
                  disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Personas Morales" />
                    {checkedInhabilitacionesMorales ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse in={checkedInhabilitacionesMorales}>
                  <ListItem
                    onClick={() =>
                      redirectToRoute(
                        "/captura/s3/inhabilitaciones/personas-morales",
                      )
                    }
                    disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Capturar Información" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem onClick={() => redirectToRoute("#")} disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Administrar Información" />
                    </ListItemButton>
                  </ListItem>
                </Collapse>
                <Divider sx={{ mt: 0.25, mb: 1.25 }} />
              </List>

              {/* Hechos de Corrupción */}
              <List
                component="div"
                disablePadding
                subheader="Hechos de Corrupción"
                sx={{
                  padding: "0.6rem",
                }}>
                {/* Servidores Públicos */}
                <ListItem
                  onClick={() =>
                    setCheckCorrupcionServidoresPublicos((prev) => !prev)
                  }
                  disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Servidores Públicos" />
                    {checkedCorrupcionServidoresPublicos ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse in={checkedCorrupcionServidoresPublicos}>
                  <ListItem
                    onClick={() =>
                      redirectToRoute(
                        "/captura/s3/hechos-corrupcion/servidores-publicos",
                      )
                    }
                    disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Capturar Información" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem onClick={() => redirectToRoute("#")} disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Administrar Información" />
                    </ListItemButton>
                  </ListItem>
                </Collapse>

                {/* Personas Físicas */}
                <ListItem
                  onClick={() => setCheckCorrupcionFisicas((prev) => !prev)}
                  disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Personas Físicas" />
                    {checkedCorrupcionFisicas ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={checkedCorrupcionFisicas}>
                  <ListItem
                    onClick={() =>
                      redirectToRoute(
                        "/captura/s3/hechos-corrupcion/personas-fisicas",
                      )
                    }
                    disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Capturar Información" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem onClick={() => redirectToRoute("#")} disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Administrar Información" />
                    </ListItemButton>
                  </ListItem>
                </Collapse>

                {/* Personas Morales */}
                <ListItem
                  onClick={() => setCheckCorrupcionMorales((prev) => !prev)}
                  disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Personas Morales" />
                    {checkedCorrupcionMorales ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={checkedCorrupcionMorales}>
                  <ListItem
                    onClick={() =>
                      redirectToRoute(
                        "/captura/s3/hechos-corrupcion/personas-morales",
                      )
                    }
                    disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Capturar Información" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem onClick={() => redirectToRoute("#")} disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Administrar Información" />
                    </ListItemButton>
                  </ListItem>
                </Collapse>
                <Divider sx={{ mt: 0.25, mb: 1.25 }} />
              </List>

              {/* Abstenciones */}
              <List
                component="div"
                disablePadding
                subheader="Abstenciones"
                sx={{
                  padding: "0.6rem",
                }}>
                {/* GRAVES */}
                <ListItem
                  onClick={() => setCheckAbstencionesGraves((prev) => !prev)}
                  disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Graves" />
                    {checkedAbstencionesGraves ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse in={checkedAbstencionesGraves}>
                  <ListItem
                    onClick={() =>
                      redirectToRoute("/captura/s3/abstenciones/graves")
                    }
                    disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Capturar Información" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem onClick={() => redirectToRoute("#")} disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Administrar Información" />
                    </ListItemButton>
                  </ListItem>
                </Collapse>

                {/* NO GRAVES */}
                <ListItem
                  onClick={() => setCheckAbstencionesNoGraves((prev) => !prev)}
                  disablePadding>
                  <ListItemButton>
                    <ListItemText primary="No Graves" />
                    {checkedAbstencionesNoGraves ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse in={checkedAbstencionesNoGraves}>
                  <ListItem
                    onClick={() =>
                      redirectToRoute("/captura/s3/abstenciones/no-graves")
                    }
                    disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Capturar Información" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem onClick={() => redirectToRoute("#")} disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Administrar Información" />
                    </ListItemButton>
                  </ListItem>
                </Collapse>
              </List>
            </>
          )}

          {/* {rol == 2 && (
            <ListItem onClick={(e) => menuDatos2(e)} key={"m3"} disablePadding>
              <ListItemButton sx={{ p: 2 }}>
                <ListItemIcon>
                  <KeyboardIcon className={classes.itemThree} />
                </ListItemIcon>
                <ListItemText primary="Capturar Información" />
                {checkedDatos2 ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
          )}
          {permisos.map(
            (item) =>
              item === "S3S" && (
                <Collapse in={checkedDatosS3S} key="S3S">
                  <ListItem
                    onClick={() => redirectToRoute("#")}
                    key={"m3s3sv2"}
                    disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Sistema 3: Servidores Públicos" />
                    </ListItemButton>
                  </ListItem>
                </Collapse>
              ),
          )}
          {permisos.map(
            (item) =>
              item === "S3P" && (
                <Collapse in={checkedDatosS3P} key="S3P">
                  <ListItem
                    onClick={() => redirectToRoute("/captura/S3Pv2")}
                    key={"m3s3pv2"}
                    disablePadding>
                    <ListItemButton sx={{ pl: 3.5 }}>
                      <ListItemIcon>
                        <CircleIcon sx={{ maxHeight: "8px" }} />
                      </ListItemIcon>
                      <ListItemText secondary="Sistema 3: Particulares" />
                    </ListItemButton>
                  </ListItem>
                </Collapse>
              ),
          )} */}

          {/* ADMINiSTRACIÓN */}
          {rol == 1 && (
            <>
              <ListItem
                onClick={() => setCheckedUser((prev) => !prev)}
                key={"mu"}
                disablePadding>
                <ListItemButton sx={{ p: 2 }}>
                  <ListItemIcon>
                    <PeopleIcon style={{ color: "#9085DA" }} />
                  </ListItemIcon>
                  <ListItemText primary="Usuarios" />
                  {checkedUser ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={!checkedUser}>
                <ListItem
                  onClick={() => redirectToRoute("/usuario/crear")}
                  key={"mu1"}
                  disablePadding>
                  <ListItemButton sx={{ pl: 3.5 }}>
                    <ListItemIcon>
                      <ControlPointIcon />
                    </ListItemIcon>
                    <ListItemText primary="Crear" />
                  </ListItemButton>
                </ListItem>
                <ListItem
                  onClick={() => redirectToRoute("/usuarios")}
                  key={"mu2"}
                  disablePadding>
                  <ListItemButton sx={{ pl: 3.5 }}>
                    <ListItemIcon>
                      <FormatListBulletedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Listar" />
                  </ListItemButton>
                </ListItem>
              </Collapse>
              <ListItem
                onClick={() => setCheckedProveedor((prev) => !prev)}
                key={"mp"}
                disablePadding>
                <ListItemButton sx={{ p: 2 }}>
                  <ListItemIcon>
                    <AssignmentIcon style={{ color: "#9085DA" }} />
                  </ListItemIcon>
                  <ListItemText primary="Proveedores" />
                  {checkedProveedor ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={!checkedProveedor}>
                <ListItem
                  onClick={() => redirectToRoute("/proveedor/crear")}
                  key={"mp1"}
                  disablePadding>
                  <ListItemButton sx={{ pl: 3.5 }}>
                    <ListItemIcon>
                      <ControlPointIcon />
                    </ListItemIcon>
                    <ListItemText primary="Crear" />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  onClick={() => redirectToRoute("/proveedores")}
                  key={"mp2"}
                  disablePadding>
                  <ListItemButton sx={{ pl: 3.5 }}>
                    <ListItemIcon>
                      <FormatListBulletedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Listar" />
                  </ListItemButton>
                </ListItem>
              </Collapse>
            </>
          )}
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#EEF2F6",
          minHeight: "100vh",
          padding: "15px",
        }}>
        <Toolbar />
        <Grid
          container
          spacing={0}
          direction="row"
          justifyContent="center"
          alignItems="center">
          {/* {vistaRender === "cargamasiva" && <LoadFileV />} */}
          {vistaRender === "createuser" && <ConnectedCreateUser />}
          {vistaRender === "edituser" && <ConnectedCreateUser match={match} />}
          {vistaRender === "users" && <ListUser />}
          {vistaRender === "cambiarcontrasena" && <ConnectedChangePassword />}
          {vistaRender === "createprovider" && <ConnectedCreateProvider />}
          {vistaRender === "editprovider" && (
            <ConnectedCreateProvider match={match} />
          )}
          {vistaRender === "providers" && <ListProvider />}
          {vistaRender === "inicio" && <Inicio />}

          {/* ----------- NUEVAS VERSIONES - INICIO ----------- */}
          {/* ----------- NUEVAS VERSIONES - s3: 11 Formatos ----------- */}

          {/* Faltas Administrativas de Servidores Públicos */}
          {vistaRender === "createReg-form1" && <CreateRegForm1 />}
          {vistaRender === "admin.faltas-administrativas-graves" && <ListForm1 />}
          {vistaRender === "createReg-form2" && <CreateRegForm2 />}
          {/* Actos de Particulares vinculados con Faltas Graves */}
          {vistaRender === "createReg-form3" && <CreateRegForm3 />}
          {vistaRender === "createReg-form4" && <CreateRegForm4 />}
          {/* Sanciones (Inhabilitaciones) por normas diversas a la LGRA */}
          {vistaRender === "createReg-form5" && <CreateRegForm5 />}
          {vistaRender === "createReg-form6" && <CreateRegForm6 />}
          {/* Hechos de Corrupción */}
          {vistaRender === "createReg-form7" && <CreateRegForm7 />}
          {vistaRender === "createReg-form8" && <CreateRegForm8 />}
          {vistaRender === "createReg-form9" && <CreateRegForm9 />}
          {/* Abstenciones */}
          {vistaRender === "createReg-form10" && <CreateRegForm10 />}
          {vistaRender === "createReg-form11" && <CreateRegForm11 />}

          {vistaRender === "createRegv2" && <ConnectedCreateRegv2 />}
          {vistaRender === "createRegS3Sv2" && <ConnectedCreateRegS3Sv2 />}
          {vistaRender === "createRegS3Pv2" && <ConnectedCreateRegS3Pv2 />}

          {vistaRender === "editRegS3Sv2" && (
            <ConnectedCreateRegS3Sv2 match={match} />
          )}
          {vistaRender === "editRegS2v2" && (
            <ConnectedCreateRegv2 match={match} />
          )}

          {vistaRender === "S2Schemav2" && <ListS2Schemav2 />}
          {vistaRender === "S3SSchemav2" && <ListS3SSchemav2 />}
          {vistaRender === "S3PSchemav2" && <ListS3PSchemav2 />}

          {/* ----------- NUEVAS VERSIONES - FIN ----------- */}
        </Grid>
      </Box>
    </div>
  );
};

function mapStateToProps(_, ownProps) {
  let vistaRender = ownProps.propiedades.renderView;
  let match = ownProps.match;
  return { vistaRender, match };
}

const mapDispatchToProps = (dispatch) => ({
  closeSession() {
    dispatch(userActions.removeSessionLogIn());
  },
});

export const ConnectedMenuV = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuV);
