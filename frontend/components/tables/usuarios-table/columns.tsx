// @ts-nocheck
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import directus from "@/lib/directus";
import { updateUser, withToken } from "@directus/sdk";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const roleColors: Record<string, string> = {
  "Usuario-Capturador": "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
};

const roleDisplayNames: Record<string, string> = {
  "Usuario-Capturador": "Capturista",
};

const isDirectusAdmin = (roleName: string) => roleName === "Administrator";

function StatusCell({ data, session, onRefresh }: any) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isActive = data.status === "active";
  const fullName = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim();

  const toggle = async () => {
    setLoading(true);
    try {
      const newStatus = isActive ? "suspended" : "active";
      await directus.request(
        withToken(session?.access_token, updateUser(data.id, { status: newStatus }))
      );
      toast({ title: newStatus === "active" ? "Usuario activado" : "Usuario desactivado" });
      onRefresh?.();
    } catch {
      toast({ variant: "destructive", title: "Error", description: "No se pudo cambiar el estado." });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={(o) => !o && setOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isActive ? "¿Desactivar usuario?" : "¿Activar usuario?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isActive
                ? <><strong>{fullName}</strong> no podrá iniciar sesión hasta que sea activado nuevamente.</>
                : <><strong>{fullName}</strong> recuperará acceso al sistema.</>
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={toggle}
              disabled={loading}
              className={isActive ? "bg-destructive hover:bg-destructive/90" : "bg-emerald-600 hover:bg-emerald-700"}
            >
              {isActive ? "Sí, desactivar" : "Sí, activar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-center">
        <button
          onClick={() => setOpen(true)}
          title={isActive ? "Clic para desactivar" : "Clic para activar"}
          className={[
            "group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ring-1 ring-inset",
            isActive
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800 hover:bg-red-50 hover:text-red-600 hover:ring-red-200 dark:hover:bg-red-950/30 dark:hover:text-red-400 dark:hover:ring-red-900"
              : "bg-zinc-100 text-zinc-500 ring-zinc-200 dark:bg-zinc-800/60 dark:text-zinc-400 dark:ring-zinc-700 hover:bg-emerald-50 hover:text-emerald-700 hover:ring-emerald-200 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 dark:hover:ring-emerald-800",
          ].join(" ")}
        >
          <span className={[
            "h-1.5 w-1.5 rounded-full shrink-0 transition-colors",
            isActive
              ? "bg-emerald-500 animate-pulse group-hover:bg-red-500 group-hover:animate-none"
              : "bg-zinc-400 group-hover:bg-emerald-500",
          ].join(" ")} />
          <span className="group-hover:hidden">{isActive ? "Activo" : "Inactivo"}</span>
          <span className="hidden group-hover:inline">{isActive ? "Desactivar" : "Activar"}</span>
        </button>
      </div>
    </>
  );
}

export const createColumns = (session, onRefresh?: () => void): ColumnDef<any>[] => [
  {
    accessorKey: "email",
    header: () => <div className="w-full text-left">Usuario</div>,
    cell: ({ row }) => {
      const firstName = row.original.first_name ?? "";
      const lastName = row.original.last_name ?? "";
      const email = row.original.email ?? "";
      const roleName = row.original.role?.name ?? "";
      const isSystem = isDirectusAdmin(roleName);
      const ini = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
      return (
        <div className={`flex items-center gap-3 ${isSystem ? "opacity-60" : ""}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${isSystem ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
            {isSystem ? <Lock className="h-3.5 w-3.5" /> : (ini || "?")}
          </div>
          <div>
            <p className="font-medium text-sm leading-none">{firstName} {lastName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
          </div>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "entePublico",
    header: () => <div className="text-center">Ente Público</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm text-muted-foreground">
        {row.original.entePublico?.nombre || "—"}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "role",
    header: () => <div className="text-center">Rol</div>,
    cell: ({ row }) => {
      const roleName = row.original.role?.name ?? "Sin rol";
      const isSystem = isDirectusAdmin(roleName);
      if (isSystem) {
        return (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 ring-1 ring-inset ring-slate-200 dark:ring-slate-700">
              <ShieldCheck className="h-3 w-3" />
              Sistema
            </span>
          </div>
        );
      }
      const colorClass = roleColors[roleName] ?? "bg-muted text-muted-foreground";
      const displayName = roleDisplayNames[roleName] ?? roleName;
      return (
        <div className="flex justify-center">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ring-black/5 dark:ring-white/10 ${colorClass}`}>
            {displayName}
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Estatus</div>,
    cell: ({ row }) => {
      const roleName = row.original.role?.name ?? "";
      if (isDirectusAdmin(roleName)) return null;
      return <StatusCell data={row.original} session={session} onRefresh={onRefresh} />;
    },
    enableSorting: true,
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => {
      const roleName = row.original.role?.name ?? "";
      if (isDirectusAdmin(roleName)) return null;
      return <CellAction data={row.original} session={session} onRefresh={onRefresh} />;
    },
    enableSorting: false,
  },
];
