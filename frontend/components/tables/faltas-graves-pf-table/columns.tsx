// @ts-nocheck
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle2,
    AlertCircle,
    Calendar,
    User,
    FileText
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const createColumns = (session, onRefresh?: () => void): ColumnDef<any>[] => [
    {
        accessorKey: "expediente",
        header: () => (
            <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Expediente</span>
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="font-mono font-semibold text-primary">
                    {row.original.expediente || "Sin expediente"}
                </div>
            </div>
        ),
        size: 200,
        enableSorting: true,
    },
    {
        accessorKey: "nombreCompleto",
        header: () => (
            <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Persona Física</span>
            </div>
        ),
        cell: ({ row }) => {
            const nombres = row.original.datosGenerales?.nombres || "";
            const primerApellido = row.original.datosGenerales?.primerApellido || "";
            const segundoApellido = row.original.datosGenerales?.segundoApellido || "";
            const nombreCompleto = [nombres, primerApellido, segundoApellido].filter(Boolean).join(" ") || "Sin nombre";
            const rfc = row.original.datosGenerales?.rfc;
            return (
                <div className="max-w-[500px]">
                    <div className="font-medium truncate">{nombreCompleto}</div>
                    {rfc && (
                        <div className="text-xs text-muted-foreground mt-1">
                            RFC: <span className="font-mono">{rfc}</span>
                        </div>
                    )}
                </div>
            );
        },
        size: 500,
        enableSorting: true,
    },
    {
        accessorKey: "fecha",
        header: () => (
            <div className="flex items-center gap-2 justify-center">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Fecha</span>
            </div>
        ),
        cell: ({ row }) => {
            const fecha = row.original.fecha;
            if (!fecha) return <div className="text-center text-muted-foreground">-</div>;
            try {
                const formatted = format(new Date(fecha), "dd/MMM/yyyy", { locale: es });
                return (
                    <div className="text-center">
                        <div className="font-medium">{formatted}</div>
                    </div>
                );
            } catch {
                return <div className="text-center">{fecha}</div>;
            }
        },
        size: 150,
        enableSorting: true,
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Estatus</div>,
        cell: ({ row }) => {
            const isFirme = row.original.status === "FIRME";
            return (
                <div className="flex justify-center">
                    <Badge
                        variant={isFirme ? "default" : "secondary"}
                        className={isFirme ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                        {isFirme ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                            <AlertCircle className="mr-1 h-3 w-3" />
                        )}
                        {isFirme ? "Firme" : "No Firme"}
                    </Badge>
                </div>
            );
        },
        size: 150,
        enableSorting: true,
    },
    {
        id: "actions",
        header: () => <div className="text-center"></div>,
        cell: ({ row }) => <CellAction data={row.original} session={session} onRefresh={onRefresh} />,
        size: 80,
        enableSorting: false,
    },
];
