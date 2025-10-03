// @ts-nocheck
import React, { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import dataMex from "./data-mexico";
import { scalePow } from "d3-scale";
import { interpolateRgb } from "d3-interpolate";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const generateColorRange = (baseColor: string) => {
  const lighterColor = interpolateRgb(baseColor, "#ffffff")(0.99);
  const darkerColor = interpolateRgb(baseColor, "#000000")(0.01);

  // Usar una escala de potencia en lugar de una escala lineal
  return scalePow<string>()
    .exponent(0.3) // Ajusta este valor para controlar la curvatura de la escala
    .domain([0, 50, 100])
    .range([lighterColor, baseColor, darkerColor])
    .clamp(true); // Asegura que los valores fuera del dominio se ajusten al rango
};

const ColorLegend = ({ colorScale, width, height, x, y }) => {
  const gradientId = "colorGradient";
  const numStops = 20; // Número de paradas en el gradiente

  return (
    <g transform={`translate(${x},${y})`}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          {Array.from({ length: numStops }, (_, i) => i / (numStops - 1)).map(
            (t) => (
              <stop
                key={t}
                offset={`${t * 100}%`}
                stopColor={colorScale(t * 100)}
              />
            )
          )}
        </linearGradient>
      </defs>
      <rect
        stroke="#888888"
        strokeWidth={0.5}
        width={width}
        height={height}
        fill={`url(#${gradientId})`}
      />
      <text fill="#888" x="0" y={height + 15} fontSize="12">
        0%
      </text>
      <text
        fill="#888"
        x={width}
        y={height + 15}
        fontSize="12"
        textAnchor="end"
      >
        100%
      </text>
    </g>
  );
};

export const AvanceMapa = ({
  data,
  baseColor = "#fff",
}: {
  data: any[];
  baseColor?: string;
}) => {
  const [tooltipContent, setTooltipContent] = useState("");

  const colorScale = useMemo(
    () => generateColorRange(baseColor, 10),
    [baseColor]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa de avance</CardTitle>
        <CardDescription>
          En la integración de sujetos obligados por entidad a la PDN
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ComposableMap
          className="w-full max-h-[600px] h-[60vh] overflow-hidden"
          projection="geoMercator"
          projectionConfig={{
            center: [-102, 24],
            scale: 1450,
          }}
        >
          <Geographies geography={dataMex}>
            {({ geographies }: any) =>
              geographies.map((geo: any) => {
                const porcentajeAvance = data.find(
                  (s: any) => s.entidad == geo.properties.clave
                );
                const percentage = porcentajeAvance
                  ? porcentajeAvance.count
                  : 0;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={
                      (percentage && porcentajeAvance) || Number(percentage)
                        ? colorScale(percentage)
                        : "#fff"
                    }
                    stroke="#888888"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: "none",
                      },
                      hover: {
                        fill:
                          (percentage && porcentajeAvance) || Number(percentage)
                            ? interpolateRgb(
                                colorScale(percentage),
                                "#000000"
                              )(0.3)
                            : interpolateRgb("#fff", "#000000")(0.3),
                        strokeWidth: 1,
                        outline: "none",
                        transition: "all 250ms",
                      },
                    }}
                    onMouseEnter={() => {
                      setTooltipContent(
                        `${porcentajeAvance.nombreEntidad}: ${
                          Number(percentage) ? percentage + "%" : "0%"
                        }`
                      );
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    data-tooltip-id="my-tooltip"
                  />
                );
              })
            }
          </Geographies>
          <ColorLegend
            colorScale={colorScale}
            width={150}
            height={15}
            x={620}
            y={40}
          />
        </ComposableMap>
        <Tooltip id="my-tooltip" content={tooltipContent} />
      </CardContent>
    </Card>
  );
};
