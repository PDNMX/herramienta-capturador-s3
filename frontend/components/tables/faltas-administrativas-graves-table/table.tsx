// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createColumns } from "./columns";
import { useCurrentSession } from "@/hooks/useCurrentSession";

export const FaltasAdministrativasGravesTable = ({ data }: any) => {
    const router = useRouter();
    const { session } = useCurrentSession();

    return (
        <>
            <div className="flex items-start justify-between">
                <Heading
                    title="Faltas Administrativas Graves - Servidores Públicos"
                    description={`Gestión de ${data.length} registro${data.length !== 1 ? 's' : ''}`}
                />
                <Button
                    className="text-xs md:text-sm"
                    onClick={() => router.push(`/inicio/faltas-administrativas-graves/nueva`)}
                >
                    <Plus className="mr-2 h-4 w-4" /> Agregar nueva
                </Button>
            </div>
            <Separator />
            <DataTable
                searchKey="expediente"
                columns={createColumns(session)}
                data={data}
            />
        </>
    );
};
