// @ts-nocheck
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { User } from "@/constants/data";

export const createColumns = (session): ColumnDef<User>[] => [
  {
    accessorKey: "oic",
    header: () => <div className="text-left">OIC</div>,
    cell: ({ row }) => {
      const oic = row.original.oic;
      return (
        <div className="text-left">{oic?.nombre || 'N/A'}</div>
      );
    },
    size: 450,
    enableSorting: true,
  },
  {
    accessorKey: "sujetosObligados",
    header: () => <div className="text-left">Ente(s) Público(s)</div>,
    cell: ({ row }) => {
      const sujetos = row.original.sujetosObligados || [];
      return (
        <div className="text-left">
          <ul className="list-disc pl-4">
            {sujetos.map((ente, index) => (
              <li key={index}>{ente.nombre}</li>
            ))}
          </ul>
        </div>
      );
    },
    size: 450,
    enableSorting: true,
  },
  {
    accessorKey: "puesto",
    header: () => <div className="text-left">Puesto</div>,
    cell: ({ row }) => <div className="text-left">{row.original.puesto}</div>,
    size: 200,
    enableSorting: true,
  },
  {
    accessorKey: "nombre",
    header: () => <div className="text-left">Nombre</div>,
    cell: ({ row }) => <div className="text-left">{row.original.nombre}</div>,
    size: 200,
    enableSorting: true,
  },
  {
    accessorKey: "correoElectronico",
    header: () => <div className="text-left">Correo Electrónico</div>,
    cell: ({ row }) => <div className="text-left">{row.original.correoElectronico}</div>,
    size: 300,
    enableSorting: true,
  },
  {
    accessorKey: "telefono",
    header: () => <div className="text-left">Teléfono</div>,
    cell: ({ row }) => <div className="text-left">{row.original.telefono}</div>,
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "direccion",
    header: () => <div className="text-left">Dirección</div>,
    cell: ({ row }) => <div className="text-left">{row.original.direccion}</div>,
    size: 300,
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} session={session} />,
    size: 25,
    enableSorting: false,
  },
];