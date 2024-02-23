import React from "react";

import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";


const CreateReg = () => {
    return (
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="¡Bienvenido/a a la Herramienta de Captura de Información... "
            />
            <Divider />
            <CardContent>
              <Grid container>
                <Grid item xs={12}>
                    <Typography>Tu participación es clave para construir un entorno más transparente. Gracias por unirte a nosotros en esta lucha.</Typography>
                    <br/>
                    <Typography>¡Juntos por un gobierno más justo y honesto!</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      );
};


export const Inicio = (CreateReg);
