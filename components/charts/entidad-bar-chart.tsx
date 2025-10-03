// @ts-nocheck
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  CartesianGrid,
  LabelList,
} from "recharts";
import marcoGeoestadisticoInegi from "../tables/cobertura-table/data-entidades";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const colors = {
  resultSistema1: "#F29888",
  resultSistema2: "#B25FAC",
  resultSistema3OIC: "#9085DA",
  resultSistema3Tribunal: "#9085DA",
  resultSistema6: "#42A5CC",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { originalCount, total } = payload[0].payload;
    return (
      <div className="custom-tooltip p-2 border rounded shadow-lg bg-white text-black">
        <p className="label">{`${originalCount} de ${total}`}</p>
        <p className="intro">{`Total: ${((originalCount / total) * 100).toFixed(
          2
        )}%`}</p>
      </div>
    );
  }

  return null;
};

export const EntidadBarChart = ({ data, selectedColumn }: any) => {
  if (data.length > 0) {
    const datosConNombres = data.map((dato: any) => {
      const entidadEncontrada = marcoGeoestadisticoInegi.find(
        (entidad) => entidad.id === dato.entidad
      );
      const originalCount = parseInt(dato[selectedColumn], 10);
      let total;

      if (selectedColumn === "resultSistema3Tribunal") {
        total = parseInt(dato.resultTribunal, 10) || 1;
      } else if (selectedColumn === "resultSistema3OIC") {
        total = parseInt(dato.resultOIC, 10) || 1;
      } else {
        total = parseInt(dato.resultSujetosObligados, 10) || 1;
      }

      const percentage = (originalCount / total) * 100;

      return {
        ...dato,
        nombreEntidad: entidadEncontrada?.nombre || "Entidad no encontrada",
        abreviacion: entidadEncontrada?.abreviacion || "NA",
        count: parseFloat(percentage.toFixed(2)), // Almacenar el porcentaje
        originalCount, // Almacenar el conteo original para el tooltip
        total, // Almacenar el total para el tooltip
      };
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle>Porcentaje de avance</CardTitle>
          <CardDescription>
            En la integración de sujetos obligados por entidad a la PDN
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={datosConNombres} margin={{ bottom: 65, top: 25 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="nombreEntidad"
                stroke="#888888"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                interval={0} // Asegurar que todas las etiquetas se muestren
                padding={{ left: 20, right: 20 }} // Ajustar el padding
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                type="number"
                domain={[0, 100]}
                scale="linear"
                tickFormatter={(tick) => `${tick}%`} // Añadir el símbolo de porcentaje
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={5}>
                {datosConNombres.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={colors[selectedColumn]} />
                ))}
                <LabelList
                  dataKey="count"
                  position="top"
                  offset={10}
                  angle={-45}
                  className="fill-foreground"
                  fontSize={10}
                  formatter={(value) => `${value}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card>
        <CardContent>
          <p className="text-xl">No hay datos que mostrar</p>
        </CardContent>
      </Card>
    );
  }
};
