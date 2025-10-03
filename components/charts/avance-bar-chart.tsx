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
  "Sistema 1": "#F29888",
  "Sistema 2": "#B25FAC",
  "Sistema 3 OIC": "#9085DA",
  "Sistema 3 Tribunal": "#9085DA",
  "Sistema 6": "#42A5CC",
};

export const AvanceBarChart = ({ data }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Porcentaje de avance </CardTitle>
        <CardDescription>
          En la integración de la información de los entes públicos a nivel
          nacional
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="sistema"
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
              <Bar dataKey="count" radius={8}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorMap[entry.sistema]} />
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
        ) : (
          <p>No hay datos que mostrar</p>
        )}
      </CardContent>
    </Card>
  );
};
