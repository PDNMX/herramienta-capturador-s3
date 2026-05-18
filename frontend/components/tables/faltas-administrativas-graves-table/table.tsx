// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createColumns } from "./columns";
import { useCurrentSession } from "@/hooks/useCurrentSession";

export const FaltasAdministrativasGravesTable = ({ data }: any) => {
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
                <Button
                    size="sm"
                    className="text-xs md:text-sm gap-1.5 shrink-0"
                    onClick={() => router.push(`/inicio/faltas-administrativas-graves/nueva`)}
                >
                    <Plus className="h-4 w-4" /> Agregar nueva
                </Button>
            </div>
            <DataTable
                searchKey="expediente"
                columns={createColumns(session)}
                data={data}
            />
        </div>
    );
};
