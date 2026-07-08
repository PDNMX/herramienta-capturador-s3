// @ts-nocheck
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Building2 } from "lucide-react";

export const createColumns = (session): ColumnDef<any>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground font-mono">{row.original.id}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "nombre",
    header: () => (
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span>Nombre</span>
      </div>
    ),
    cell: ({ row }) => (
      <span className="font-medium text-sm">{row.original.nombre}</span>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    header: () => <div className="text-center"></div>,
    cell: ({ row }) => <CellAction data={row.original} session={session} />,
    enableSorting: false,
  },
];
