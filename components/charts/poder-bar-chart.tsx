// @ts-nocheck
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
  CartesianGrid,
  LabelList,
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

const colorMap = {
  resultSistema1: "#F29888",
  resultSistema2: "#B25FAC",
  resultSistema3OIC: "#9085DA",
  resultSistema3Tribunal: "#9085DA",
  resultSistema6: "#42A5CC",
};

export const PoderBarChart = ({ data, tipoColumna }: any) => {
  const colorSistema = colorMap[tipoColumna];

  // Filtrar los datos para excluir 'Legislativo' si es resultSistema3Tribunal
  const filteredData = tipoColumna === "resultSistema3Tribunal"
    ? data.filter(item => item.poder !== "Legislativo")
    : data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Porcentaje de avance</CardTitle>
        <CardDescription>
          En la integración de la información de los entes públicos, por poder u
          órgano de gobierno
          {tipoColumna === "resultSistema3Tribunal" && " (excluyendo poder Legislativo)"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="poder"
              stroke="#888888"
              fontSize={12}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              scale="linear"
              type="number"
              domain={[0, 100]}
              tickFormatter={(tick) => `${tick}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill={colorSistema} radius={8}>
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorSistema} />
              ))}
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