// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ImportExportButtons } from "@/components/ui/import-export-buttons";
import { Plus, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { createColumns } from "./columns";
import { useCurrentSession } from "@/hooks/useCurrentSession";

export const FaltasGravesPFTable = ({ data, onRefresh }: any) => {
    const router = useRouter();
    const { session } = useCurrentSession();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/50 shrink-0">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground leading-none mb-1">
                            Faltas Graves
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Personas Físicas
                            <span className="mx-2 text-border">·</span>
                            {data.length} {data.length !== 1 ? "registros" : "registro"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <ImportExportButtons
                        data={data}
                        collection="faltas_graves_personas_fisicas"
                        exportFilename="faltas_graves_pf"
                        accessToken={session?.access_token}
                        onImportSuccess={onRefresh}
                    />
                    <Button
                        size="sm"
                        className="text-xs md:text-sm gap-1.5"
                        onClick={() => router.push(`/inicio/faltas-graves-pf/nueva`)}
                    >
                        <Plus className="h-4 w-4" /> Agregar nueva
                    </Button>
                </div>
            </div>
            <DataTable
                searchKey="expediente"
                columns={createColumns(session)}
                data={data}
            />
        </div>
    );
};
