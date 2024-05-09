import React from "react";

import { S2Actions } from "../../_actions/s2.action";
import { connect } from "react-redux";
import { history } from "../../store/history";
import { useDispatch } from "react-redux";
import { alertActions } from "../../_actions/alert.actions";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import formats from "./customFormats";
import Form from "@rjsf/mui";
import { customizeValidator } from "@rjsf/validator-ajv8";
import spanishLocalizer from "ajv-i18n/localize/es";

const CreateEdit = ({ id, alert, catalogos, registry, schema, uiSchema, tipoForm }) => {
  return (
    <MyForm
      initialValues={registry}
      catalogos={catalogos}
      alerta={alert}
      id={id}
      schema={schema} // Pasando el schema como prop
      uiSchema={uiSchema} // Pasando uiSchema como prop
      tipoForm={tipoForm}
    />
  );
};

function MyForm(props) {
  const { initialValues, alerta, id, schema, uiSchema, tipoForm } = props;
  const alert = alerta;
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  //console.log(initialValues);

  //const validate = makeValidate(schema);
  //const required = makeRequired(schema)

  const redirectToRoute = (path) => {
    history.push(path);
    dispatch(alertActions.clear());
  };

  const onSubmit = (values) => {
    let formData = values.formData;
    if (id != undefined) {
      dispatch(S2Actions.requestEditDo({ ...formData, _id: id }));
    } else {
      dispatch(S2Actions.requestCreationS2v2(formData, tipoForm));
    }
    setOpen(true);
  };

  //const schema = esquemaS3g;
  //const uiSchema = uiS3g;
  const customFormats = formats;
  const validator = customizeValidator({ customFormats }, spanishLocalizer);

  const handleChange = ({ formData }) => console.log(formData);

  /* function transformErrors(errors) {
    return errors.map((error) => {
      if (error.property === '.procedimientos.tipoArea.areas') {
        error.message = 'Error en tipo Áreas';
      }
      return error;
    });
  } */
  const dataEjemplo = {
    grave: {
      segundoApellido: {
        sinSegundoApellido: true,
      },
      entePublico: {
        nivelOrdenGobierno: {
          clave: "FEDERAL",
        },
        entidadFederativa: {
          clave: "09",
          valor: "Ciudad de México",
        },
        ambitoPublico: "ORGANO_AUTONOMO",
        nombre: "Secretaria Ejecutiva del Sistema Nacional Anticorrupción",
        siglas: "SESNA",
      },
      empleoCargoComision: {
        nombre: {
          clave: "ENLACE_U_HOMOLOGO",
        },
        denominacion:
          "Enlace de Consulta de las Plataformas y Sistemas Digitales Anticorrupción",
        areaAdscripcion: "Unidad de Plataforma Digital Nacional",
      },
      origenInvestigacion: {
        clave: "DENUNCIA_SP",
      },
      faltaCometida: [
        {
          articuloNormatividad: ["10"],
          fraccionNormatividad: ["20"],
          articuloNormatividadInfringida: ["Articulo 21"],
          fraccionNormatividadInfringida: ["Fracción 6"],
          clave: "CONTRATACION_INDEBIDA",
          normatividadInfringida:
            "Ley General de Responsabilidades Administrativas",
          descripcionHechos: "Lo contrato su tío el inombrable",
          nombreNormatividad: "Ley General de Responsabilidades",
        },
      ],
      resolucion: {
        documentoResolucion: "Sentencia Final",
        fechaResolucion: "2022-03-01",
        fechaNotificacion: "2022-03-15",
        urlResolucion: "https://www.google.com",
        fechaResolucionFirme: "2022-04-01",
        fechaNotificacionFirme: "2022-04-17",
        urlResolucionFirme: "https://www.promodescuentos.com/12%0183?dxjk=0$",
      },
      tipoSancion: {
        sancion: [
          {
            clave: "DESTITUCION",
            destitucionEmpleo: {
              fechaDestitucion: "2022-05-15",
            },
          },
        ],
        ordenJurisdiccional: "FEDERAL",
        autoridadResolutora: "OIC de la SESNA",
        autoridadInvestigadora: "Comite de ética",
        autoridadSubstanciadora: "Su jefa directa",
      },
      nombres: "Alan",
      primerApellido: "Rojas",
      curp: "RXBA990410HDFJTL00",
      rfc: "ROBA990410GQ8",
      sexo: "HOMBRE",
      observaciones:
        "Tambien se impondra sancion por molestar a una pequeña persona..",
    },
    expediente: "2018",
  };

  return (
    <Grid item xs={12}>
      <Card>
        {/* <CardHeader title="FORMATO QUE INDICA LOS DATOS QUE SE INSCRIBIRÁN EN EL SISTEMA NACIONAL DE SERVIDORES PÚBLICOS Y PARTICULARES SANCIONADOS DE LA PLATAFORMA DIGITAL NACIONAL RELACIONADOS CON LAS SANCIONES QUE SE ENCUENTREN FIRMES IMPUESTAS A PERSONAS SERVIDORAS PÚBLICAS POR LA COMISIÓN DE FALTAS ADMINISTRATIVAS GRAVES EN TÉRMINOS DE LA LEY GENERAL DE RESPONSABILIDADES ADMINISTRATIVAS." />
        <Divider /> */}
        <CardHeader
          title={
            id != undefined
              ? "Edición"
              : "Nuevo registro"
          }
        />
        <Divider />
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              <Form
                schema={schema}
                validator={validator}
                onChange={handleChange}
                onSubmit={onSubmit}
                /* onError={log("errors")} */
                uiSchema={uiSchema}
                formData={initialValues}
                omitExtraData={false}
                liveOmit={true}
                liveValidate={false}
                noHtml5Validate={true}
                showErrorList={false}
                /* transformErrors={transformErrors} */
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Dialog
        disableEscapeKeyDown
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"xs"}>
        {/* <DialogTitle id="alert-dialog-title">{"Resultado"}</DialogTitle> */}
        <DialogContent>
          <DialogContent id="alert-dialog-description">
            <Typography noWrap variant="h6">
              {alert.message}
            </Typography>
          </DialogContent>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!alert.status}
            onClick={() => redirectToRoute("/consultar/s3/faltas-administrativas/graves")}
            color="primary"
            autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

function mapStateToProps(state, ownProps) {
  const alert = state.alert;
  const catalogos = state.catalogs;
  if (ownProps.match != undefined) {
    const id = ownProps.match.params.id;
    const registry = state.S2.find((reg) => reg._id === id);
    return {
      id,
      registry,
      alert,
      catalogos,
    };
  } else {
    return { alert, catalogos };
  }
}

function mapDispatchToProps() {
  return {};
}

export const CreateEditForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateEdit);
