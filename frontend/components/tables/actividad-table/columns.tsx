// @ts-nocheck
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { LogIn, FilePenLine, FilePlus, Trash2 } from "lucide-react";

const actionConfig: Record<string, { label: string; icon: any; class: string }> = {
  login:        { label: "Inicio de sesión",  icon: LogIn,       class: "bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300" },
  authenticate: { label: "Inicio de sesión",  icon: LogIn,       class: "bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300" },
  create:       { label: "Registro creado",   icon: FilePlus,    class: "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300" },
  update:       { label: "Registro editado",  icon: FilePenLine, class: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300" },
  delete:       { label: "Registro eliminado",icon: Trash2,      class: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300" },
};

const collectionLabels: Record<string, string> = {
  faltas_administrativas_graves:    "F. Adm. Graves",
  faltas_administrativas_no_graves: "F. Adm. No Graves",
  faltas_graves_personas_morales:   "F. Graves — P. Morales",
  faltas_graves_personas_fisicas:   "F. Graves — P. Físicas",
};

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "timestamp",
    header: "Fecha y hora",
    cell: ({ row }) => {
      const ts = row.original.timestamp;
      if (!ts) return <span className="text-muted-foreground">—</span>;
      const d = new Date(ts);
      return (
        <div className="whitespace-nowrap">
          <p className="text-xs font-mono text-foreground">
            {d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
          <p className="text-xs font-mono text-muted-foreground">
            {d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "user",
    header: "Usuario",
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user) return <span className="text-muted-foreground text-xs italic">Sistema</span>;
      const name = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
      return (
        <div>
          <p className="text-sm font-medium leading-none">{name || "—"}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{user.email ?? ""}</p>
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
      const cfg = actionConfig[action] ?? { label: action, icon: null, class: "bg-muted text-muted-foreground" };
      const Icon = cfg.icon;
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.class}`}>
          {Icon && <Icon className="h-3 w-3 shrink-0" />}
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
      const col = row.original.collection;
      const action = row.original.action ?? "";
      const isLogin = action === "login" || action === "authenticate";

      if (isLogin || !col) {
        return <span className="text-xs text-muted-foreground italic">—</span>;
      }

      const label = collectionLabels[col] ?? col;
      return (
        <span
          className="inline-block text-xs font-medium bg-muted text-muted-foreground rounded px-2 py-0.5 max-w-[180px] truncate"
          title={col}
        >
          {label}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "item",
    header: "ID Registro",
    cell: ({ row }) => {
      const action = row.original.action ?? "";
      const isLogin = action === "login" || action === "authenticate";
      if (isLogin) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <span
          className="text-xs font-mono text-muted-foreground truncate max-w-[100px] block"
          title={row.original.item}
        >
          {row.original.item ?? "—"}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "ip",
    header: "IP",
    cell: ({ row }) => {
      const action = row.original.action ?? "";
      const isLogin = action === "login" || action === "authenticate";
      // Solo mostrar IP en inicios de sesión (dato relevante para auditoría de accesos)
      if (!isLogin) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <span className="text-xs font-mono text-muted-foreground">
          {row.original.ip ?? "—"}
        </span>
      );
    },
    enableSorting: false,
  },
];
