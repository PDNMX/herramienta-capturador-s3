// @ts-nocheck
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, XCircle } from "lucide-react";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => <div className="text-left">{row.original.nombre}</div>,
    size: '55%'
  },
  {
    accessorKey: "ambitoGobierno",
    header: "Ámbito Gobierno",
    cell: ({ row }) => (
      <div className="text-center">{row.original.ambitoGobierno}</div>
    ),
  },
  {
    accessorKey: "poderGobierno",
    header: "Poder Gobierno",
    cell: ({ row }) => (
      <div className="text-center">{row.original.poderGobierno}</div>
    ),
  },
  {
    accessorKey: "sistema1",
    header: "S1",
    cell: ({ row }) => (
      <div className="flex justify-center items-center h-full">
        {row.original.sistema1 ? (
          <CheckCircle className="text-green-500" />
        ) : (
          <XCircle className="text-red-500" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "sistema2",
    header: "S2",
    cell: ({ row }) => (
      <div className="flex justify-center items-center h-full">
        {row.original.sistema2 ? (
          <CheckCircle className="text-green-500" />
        ) : (
          <XCircle className="text-red-500" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "sistema3",
    header: "S3",
    cell: ({ row }) => (
      <div className="flex justify-center items-center h-full">
        {row.original.sistema3 ? (
          <CheckCircle className="text-green-500" />
        ) : (
          <XCircle className="text-red-500" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "sistema6",
    header: "S6",
    cell: ({ row }) => (
      <div className="flex justify-center items-center h-full">
        {row.original.sistema6 ? (
          <CheckCircle className="text-green-500" />
        ) : (
          <XCircle className="text-red-500" />
        )}
      </div>
    ),
  }
];
