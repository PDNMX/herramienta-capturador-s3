// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ImportExportButtons } from "@/components/ui/import-export-buttons";
import { Plus, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createColumns } from "./columns";
import { useCurrentSession } from "@/hooks/useCurrentSession";

export const FaltasAdministrativasGravesTable = ({ data, onRefresh }: any) => {
    const router = useRouter();
    const { session } = useCurrentSession();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/50 shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground leading-none mb-1">
                            Faltas Administrativas Graves
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Servidores Públicos
                            <span className="mx-2 text-border">·</span>
                            {data.length} {data.length !== 1 ? "registros" : "registro"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <ImportExportButtons
                        data={data}
                        collection="faltas_administrativas_graves"
                        exportFilename="faltas_admin_graves"
                        accessToken={session?.access_token}
                        onImportSuccess={onRefresh}
                    />
                    <Button
                        size="sm"
                        className="text-xs md:text-sm gap-1.5"
                        onClick={() => router.push(`/inicio/faltas-administrativas-graves/nueva`)}
                    >
                        <Plus className="h-4 w-4" /> Agregar nueva
                    </Button>
                </div>
            </div>
            <DataTable
                searchKey="expediente"
                searchPlaceholder="Buscar por RFC, nombre o expediente..."
                globalFilterFn={(row: any, q: string) => {
                    const dg = row.datosGenerales ?? {};
                    const nombre = [dg.nombres, dg.primerApellido, dg.segundoApellido]
                        .filter(Boolean).join(" ").toLowerCase();
                    const rfc = (dg.rfc ?? "").toLowerCase();
                    const expediente = (row.expediente ?? "").toLowerCase();
                    return nombre.includes(q) || rfc.includes(q) || expediente.includes(q);
                }}
                columns={createColumns(session, onRefresh)}
                data={data}
            />
        </div>
    );
};
