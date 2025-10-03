// @ts-nocheck
"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image"; // Import Image component from Next.js
import icoSujetosObligados from "./icons-thead/sujetosObligados.svg";
import icoConexiones from "./icons-thead/conexiones.svg";
import icoS1 from "./icons-thead/s1.svg";
import icoS2 from "./icons-thead/s2.svg";
import icoS3OIC from "./icons-thead/s3OIC.svg";
import icoS3Tribunal from "./icons-thead/s3Tribunal.svg";
import icoS6 from "./icons-thead/s6.svg";
import icoTribunal from "./icons-thead/tribunal.svg";
import icoOIC from "./icons-thead/oic.svg";
import camp from "./icons-thead/cal.svg";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "nombreEntidad",
    header: () => (
      <div className="text-center">
        <span className="cursor-pointer">Entidad Federativa</span>
      </div>
    ),
    cell: ({ row }) => (
      <div data-entidad={row.original.entidad}>
        {row.original.nombreEntidad}
      </div>
    ),
    footer: ({}) => {
      return "Totales:";
    },
    enableSorting: true,
  },
  {
    accessorKey: "resultSujetosObligados",
    header: () => (
      <div className="flex items-center">
        <Image
          className="m-auto cursor-pointer"
          src={icoSujetosObligados}
          alt="Sujetos Obligados"
          width={35}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div data-entidad={row.original.entidad}>
        {row.original.resultSujetosObligados}
      </div>
    ),
    footer: ({ table }) =>
      table
        .getFilteredRowModel()
        .rows.reduce(
          (total, row) => total + row.getValue("resultSujetosObligados"),
          0
        ),
    enableSorting: true,
  },
  {
    accessorKey: "resultOIC",
    header: () => (
      <div className="flex items-center">
        <Image
          className="m-auto cursor-pointer"
          src={icoOIC}
          alt="OIC"
          width={35}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div data-entidad={row.original.entidad}>{row.original.resultOIC}</div>
    ),
    footer: ({ table }) =>
      table
        .getFilteredRowModel()
        .rows.reduce((total, row) => total + row.getValue("resultOIC"), 0),
    enableSorting: true,
  },
  {
    accessorKey: "resultTribunal",
    header: () => (
      <div className="flex items-center">
        <Image
          className="m-auto cursor-pointer"
          src={icoTribunal}
          alt="Tribunal"
          width={35}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div data-entidad={row.original.entidad}>
        {row.original.resultTribunal}
      </div>
    ),
    footer: ({ table }) =>
      table
        .getFilteredRowModel()
        .rows.reduce((total, row) => total + row.getValue("resultTribunal"), 0),
    enableSorting: true,
  },
  {
    accessorKey: "resultSistema1",
    header: () => (
      <div className="flex items-center">
        <Image
          className="m-auto cursor-pointer"
          src={icoS1}
          alt="Sistema 1"
          width={35}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div data-entidad={row.original.entidad}>
        {row.original.resultSistema1}
      </div>
    ),
    footer: ({ table }) =>
      table
        .getFilteredRowModel()
        .rows.reduce((total, row) => total + row.getValue("resultSistema1"), 0),
    enableSorting: false,
  },
  {
    accessorKey: "resultSistema2",
    header: () => (
      <div className="flex items-center">
        <Image
          className="m-auto cursor-pointer"
          src={icoS2}
          alt="Sistema 2"
          width={35}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div data-entidad={row.original.entidad}>
        {row.original.resultSistema2}
      </div>
    ),
    footer: ({ table }) =>
      table
        .getFilteredRowModel()
        .rows.reduce((total, row) => total + row.getValue("resultSistema2"), 0),
    enableSorting: false,
  },
  {
    accessorKey: "resultSistema3OIC",
    header: () => (
      <div className="flex items-center">
        <Image
          className="m-auto cursor-pointer"
          src={icoS3OIC}
          alt="Sistema 3 OIC"
          width={35}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div data-entidad={row.original.entidad}>
        {row.original.resultSistema3OIC}
      </div>
    ),
    footer: ({ table }) =>
      table
        .getFilteredRowModel()
        .rows.reduce(
          (total, row) => total + row.getValue("resultSistema3OIC"),
          0
        ),
    enableSorting: false,
  },
  {
    accessorKey: "resultSistema3Tribunal",
    header: () => (
      <div className="flex items-center">
        <Image
          className="m-auto cursor-pointer"
          src={icoS3Tribunal}
          alt="Sistema 3 Tribunal"
          width={35}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div data-entidad={row.original.entidad}>
        {row.original.resultSistema3Tribunal}
      </div>
    ),
    footer: ({ table }) =>
      table
        .getFilteredRowModel()
        .rows.reduce(
          (total, row) => total + row.getValue("resultSistema3Tribunal"),
          0
        ),
    enableSorting: false,
  },
  {
    accessorKey: "resultSistema6",
    header: () => (
      <div className="flex items-center">
        <Image
          className="m-auto cursor-pointer"
          src={icoS6}
          alt="Sistema 6"
          width={35}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div data-entidad={row.original.entidad}>
        {row.original.resultSistema6}
      </div>
    ),
    footer: ({ table }) =>
      table
        .getFilteredRowModel()
        .rows.reduce((total, row) => total + row.getValue("resultSistema6"), 0),
    enableSorting: false,
  },
  {
    accessorKey: "resultConexiones",
    header: () => (
      <div className="flex items-center">
        <Image
          className="m-auto cursor-pointer"
          src={icoConexiones}
          alt="Conexiones"
          width={35}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div data-entidad={row.original.entidad}>
        {row.original.resultConexiones + "%"}
      </div>
    ),
    footer: "-",
    enableSorting: true,
  },
  {
    accessorKey: "resultCampeonatoS1",
    header: () => (
      <div className="flex items-center">
        <Image
          className="m-auto cursor-pointer"
          src={camp}
          alt="Campeonato"
          width={35}
        />
      </div>
    ),
    cell: ({ row, table }) => {
      const campeonatoValue = row.getValue("resultCampeonatoS1") as number;
      const sortedRows = table.getSortedRowModel().rows;
      const currentSortingState = table.getState().sorting;

      let ranking = "";
      if (
        currentSortingState.length > 0 &&
        currentSortingState[0].id === "resultCampeonatoS1"
      ) {
        // Ordenar las filas por el valor de resultCampeonatoS1 en orden descendente
        const rankedRows = sortedRows.sort(
          (a, b) =>
            (b.getValue("resultCampeonatoS1") as number) -
            (a.getValue("resultCampeonatoS1") as number)
        );

        let currentRank = 1;
        let currentValue = rankedRows[0].getValue(
          "resultCampeonatoS1"
        ) as number;
        let sameRankCount = 0;

        // Recorrer las filas ordenadas para asignar rankings
        for (let i = 0; i < rankedRows.length; i++) {
          const rowValue = rankedRows[i].getValue(
            "resultCampeonatoS1"
          ) as number;
          if (rowValue < currentValue) {
            currentRank += sameRankCount > 0 ? 1 : sameRankCount;
            currentValue = rowValue;
            sameRankCount = 0;
          }
          sameRankCount++;
          if (rowValue === campeonatoValue) {
            ranking = `${currentRank}°`;
            break;
          }
        }
      }

      return (
        <div data-entidad={row.original.entidad} className="relative">
          <div className="text-center">
            <span>{campeonatoValue}%</span>
          </div>
          {ranking && (
            <span className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 rounded">
              {ranking}
            </span>
          )}
        </div>
      );
    },
    footer: "-",
    enableSorting: true,
  },
];
