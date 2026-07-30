// @ts-nocheck
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Lock } from "lucide-react";

const roleColors: Record<string, string> = {
  "Usuario-Capturador": "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
  "Api-Interconexion": "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
};

const roleDisplayNames: Record<string, string> = {
  "Usuario-Capturador": "Capturista",
  "Api-Interconexion": "API",
};

const isDirectusAdmin = (roleName: string) => roleName === "Administrator";

export const createColumns = (session, onRefresh?: () => void): ColumnDef<any>[] => [
  {
    accessorKey: "email",
    header: () => (
      <div className="flex items-center gap-2">
        <UserCircle className="h-4 w-4 text-muted-foreground" />
        <span>Usuario</span>
      </div>
    ),
    cell: ({ row }) => {
      const firstName = row.original.first_name ?? "";
      const lastName = row.original.last_name ?? "";
      const email = row.original.email ?? "";
      const roleName = row.original.role?.name ?? "";
      const isSystem = isDirectusAdmin(roleName);
      const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
      return (
        <div className={`flex items-center gap-3 ${isSystem ? "opacity-60" : ""}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${isSystem ? "bg-muted" : "bg-primary/10"}`}>
            {isSystem
              ? <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              : <span className="text-xs font-semibold text-primary">{initials || "?"}</span>
            }
          </div>
          <div>
            <p className="font-medium text-sm leading-none">
              {firstName} {lastName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
          </div>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "entePublico",
    header: "Ente Público",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.entePublico?.nombre || "—"}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const roleName = row.original.role?.name ?? "Sin rol";
      const isSystem = isDirectusAdmin(roleName);
      if (isSystem) {
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <Lock className="h-3 w-3" />
            Usuario del Sistema
          </span>
        );
      }
      const colorClass = roleColors[roleName] ?? "bg-muted text-muted-foreground";
      const displayName = roleDisplayNames[roleName] ?? roleName;
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
          {displayName}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Estatus</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      const isActive = status === "active";
      return (
        <div className="flex justify-center">
          <Badge variant={isActive ? "default" : "secondary"}
            className={isActive ? "bg-green-600 hover:bg-green-700" : ""}>
            {isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: "actions",
    header: () => <div className="text-center"></div>,
    cell: ({ row }) => {
      const roleName = row.original.role?.name ?? "";
      if (isDirectusAdmin(roleName)) return null;
      return <CellAction data={row.original} session={session} onRefresh={onRefresh} />;
    },
    enableSorting: false,
  },
];
