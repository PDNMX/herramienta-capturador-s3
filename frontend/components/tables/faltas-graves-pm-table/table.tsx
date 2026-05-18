// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createColumns } from "./columns";
import { useCurrentSession } from "@/hooks/useCurrentSession";

export const FaltasGravesPMTable = ({ data }: any) => {
    const router = useRouter();
    const { session } = useCurrentSession();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-950/50 shrink-0">
                        <Building2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground leading-none mb-1">
                            Faltas Graves
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Personas Morales
                            <span className="mx-2 text-border">·</span>
                            {data.length} {data.length !== 1 ? "registros" : "registro"}
                        </p>
                    </div>
                </div>
                <Button
                    size="sm"
                    className="text-xs md:text-sm gap-1.5 shrink-0"
                    onClick={() => router.push(`/inicio/faltas-graves-pm/nueva`)}
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