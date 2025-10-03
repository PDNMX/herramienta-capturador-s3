// @ts-nocheck
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { User } from "@/constants/data";
import { CheckCircle, XCircle } from "lucide-react";

export const createColumns = (visibilityMap, session): ColumnDef<User>[] => [
  {
    accessorKey: "nombre",
    header: () => <div className="text-left">Nombre</div>, // Header aligned to the left
    cell: ({ row }) => <div className="text-left">{row.original.nombre}</div>, // Cell content aligned to the left
    size: 450,
    enableSorting: true,
  },
  visibilityMap.ambitoGobierno && {
    accessorKey: "ambitoGobierno",
    header: () => <div className="text-center whitespace-nowrap">Ámbito Gobierno</div>,
    cell: ({ row }) => (
      <div className="text-center whitespace-nowrap">
        {row.original.ambitoGobierno}
      </div>
    ),
    size: 130,
    enableSorting: true,
  },
  visibilityMap.poderGobierno && {
    accessorKey: "poderGobierno",
    header: () => <div className="text-center whitespace-nowrap">Poder Gobierno</div>,
    cell: ({ row }) => (
      <div className="text-center whitespace-nowrap">
        {row.original.poderGobierno}
      </div>
    ),
    size: 130,
    enableSorting: true,
  },
  visibilityMap.sistema1 && {
    accessorKey: "sistema1",
    header: () => <div className="text-center">S1</div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center h-full">
        {row.original.sistema1 ? (
          <CheckCircle className="text-green-500" />
        ) : (
          <XCircle className="text-red-500" />
        )}
      </div>
    ),
    size: 25,
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.original[columnId] ? 1 : 0;
      const b = rowB.original[columnId] ? 1 : 0;
      return a - b;
    },
  },
  visibilityMap.sistema2 && {
    accessorKey: "sistema2",
    header: () => <div className="text-center">S2</div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center h-full">
        {row.original.sistema2 ? (
          <CheckCircle className="text-green-500" />
        ) : (
          <XCircle className="text-red-500" />
        )}
      </div>
    ),
    size: 25,
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.original[columnId] ? 1 : 0;
      const b = rowB.original[columnId] ? 1 : 0;
      return a - b;
    },
  },
  visibilityMap.sistema3 && {
    accessorKey: "sistema3",
    header: () => <div className="text-center">S3</div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center h-full">
        {row.original.sistema3 ? (
          <CheckCircle className="text-green-500" />
        ) : (
          <XCircle className="text-red-500" />
        )}
      </div>
    ),
    size: 25,
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.original[columnId] ? 1 : 0;
      const b = rowB.original[columnId] ? 1 : 0;
      return a - b;
    },
  },
  visibilityMap.sistema6 && {
    accessorKey: "sistema6",
    header: () => <div className="text-center">S6</div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center h-full">
        {row.original.sistema6 ? (
          <CheckCircle className="text-green-500" />
        ) : (
          <XCircle className="text-red-500" />
        )}
      </div>
    ),
    size: 25,
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.original[columnId] ? 1 : 0;
      const b = rowB.original[columnId] ? 1 : 0;
      return a - b;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center"></div>,
    cell: ({ row }) => <CellAction data={row.original} session={session} />,
    size: 25,
    enableSorting: false,
  },
].filter(Boolean);
