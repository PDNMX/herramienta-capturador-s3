// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { createColumns } from "./columns";
import { useCurrentSession } from "@/hooks/useCurrentSession";

export const UsuariosTable = ({ data, onRefresh }: any) => {
  const router = useRouter();
  const { session } = useCurrentSession();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-950/50 shrink-0">
            <ShieldCheck className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground leading-none mb-1">
              Usuarios del Sistema
            </h2>
            <p className="text-sm text-muted-foreground">
              Administración
              <span className="mx-2 text-border">·</span>
              {data.length} {data.length !== 1 ? "registros" : "registro"}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="text-xs md:text-sm gap-1.5 shrink-0"
          onClick={() => router.push("/inicio/administracion/usuarios/nuevo")}
        >
          <Plus className="h-4 w-4" /> Nuevo usuario
        </Button>
      </div>
      <DataTable
        searchKey="email"
        columns={createColumns(session, onRefresh)}
        data={data}
      />
    </div>
  );
};
