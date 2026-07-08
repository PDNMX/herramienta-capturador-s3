// @ts-nocheck
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const actionConfig: Record<string, { label: string; class: string }> = {
  create: { label: "Crear", class: "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300" },
  update: { label: "Actualizar", class: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300" },
  delete: { label: "Eliminar", class: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300" },
  login: { label: "Login", class: "bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300" },
  logout: { label: "Logout", class: "bg-gray-100 dark:bg-gray-950/40 text-gray-600 dark:text-gray-400" },
  authenticate: { label: "Autenticar", class: "bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300" },
};

const collectionLabels: Record<string, string> = {
  faltas_administrativas_graves: "FAG",
  faltas_administrativas_no_graves: "FANG",
  faltas_graves_personas_morales: "FG-PM",
  faltas_graves_personas_fisicas: "FG-PF",
  directus_users: "Usuarios",
  ente_publico: "Entes",
  directus_files: "Archivos",
};

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "timestamp",
    header: "Fecha y hora",
    cell: ({ row }) => {
      const ts = row.original.timestamp;
      if (!ts) return <span className="text-muted-foreground">—</span>;
      return (
        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
          {new Date(ts).toLocaleString("es-MX", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </span>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "user",
    header: "Usuario",
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user) return <span className="text-muted-foreground text-xs">Sistema</span>;
      const name = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
      const email = user.email ?? "";
      return (
        <div>
          <p className="text-sm font-medium leading-none">{name || "—"}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "action",
    header: "Acción",
    cell: ({ row }) => {
      const action = row.original.action ?? "";
      const cfg = actionConfig[action] ?? { label: action, class: "bg-muted text-muted-foreground" };
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.class}`}>
          {cfg.label}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "collection",
    header: "Colección",
    cell: ({ row }) => {
      const col = row.original.collection ?? "";
      const label = collectionLabels[col] ?? col;
      return (
        <span className="text-xs text-muted-foreground font-mono" title={col}>
          {label}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "item",
    header: "ID Registro",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-muted-foreground truncate max-w-[120px] block" title={row.original.item}>
        {row.original.item ?? "—"}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "ip",
    header: "IP",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-muted-foreground">
        {row.original.ip ?? "—"}
      </span>
    ),
    enableSorting: false,
  },
];
