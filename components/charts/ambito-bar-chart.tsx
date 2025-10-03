// @ts-nocheck
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { conectados, totalEntes, count } = payload[0].payload;
    return (
      <div className="custom-tooltip p-2 border rounded shadow-lg bg-white text-black">
        <p className="label">{`${conectados} de ${totalEntes}`}</p>
        <p className="intro">{`Total: ${count}%`}</p>
      </div>
    );
  }

  return null;
};

export const AmbitoBarChart = ({ data, tipoColumna }: any) => {
  const colors: object = {
    resultSistema1: "#F29888",
    resultSistema2: "#B25FAC",
    resultSistema3OIC: "#9085DA",
    resultSistema3Tribunal: "#9085DA",
    resultSistema6: "#42A5CC",
  };

  const colorSistema = colors[tipoColumna];

  // Filtrar los datos para excluir 'Municipal' si es resultSistema3Tribunal
  const filteredData = tipoColumna === "resultSistema3Tribunal"
    ? data.filter(item => item.ambito !== "Municipal")
    : data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Porcentaje de avance</CardTitle>
        <CardDescription>
          En la integración de la información de los entes públicos, por ámbito
          de gobierno
          {tipoColumna === "resultSistema3Tribunal" && " (excluyendo ámbito Municipal)"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="ambito"
              stroke="#888888"
              fontSize={12}
              padding={{ left: 20, right: 20 }}
              interval={0}
            />
            <YAxis
              type="number"
              stroke="#888888"
              fontSize={12}
              domain={[0, 100]}
              scale="linear"
              tickFormatter={(tick) => `${tick}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill={colorSistema} radius={8}>
              <LabelList
                dataKey="count"
                position="top"
                offset={10}
                className="fill-foreground"
                fontSize={12}
                formatter={(value) => `${value}%`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};