// @ts-nocheck
"use client";

import { DataTable } from "@/components/ui/data-table";
import { Activity, RefreshCw } from "lucide-react";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";

interface ActividadTableProps {
  data: any[];
  onRefresh?: () => void;
}

export const ActividadTable = ({ data, onRefresh }: ActividadTableProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/50 shrink-0">
            <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground leading-none mb-1">
              Bitácora de Actividad
            </h2>
            <p className="text-sm text-muted-foreground">
              Inicios de sesión y modificaciones en faltas
              <span className="mx-2 text-border">·</span>
              {data.length} {data.length !== 1 ? "registros" : "registro"}
            </p>
          </div>
        </div>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh} className="gap-1.5 text-xs shrink-0">
            <RefreshCw className="h-3.5 w-3.5" />
            Actualizar
          </Button>
        )}
      </div>
      <DataTable
        searchKey="collection"
        columns={columns}
        data={data}
      />
    </div>
  );
};
