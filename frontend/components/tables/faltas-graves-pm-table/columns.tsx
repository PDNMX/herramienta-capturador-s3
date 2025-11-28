// @ts-nocheck
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle2,
    AlertCircle,
    Calendar,
    Building2,
    FileText,
    Scale
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const FALTA_LABELS = {
    SOBORNO: "Soborno",
    PARTICIPACION_ILICITA: "Participación Ilícita",
    TRAFICO_INFLUENCIAS: "Tráfico de Influencias",
    UTILIZACION_INFORMACION_FALSA: "Información Falsa",
    COLUSION: "Colusión",
    OBSTRUCCION_FACULTADES: "Obstrucción",
    CONTRATACION_INDEBIDA: "Contratación Indebida",
    USO_INDEBIDO_RECURSOS_PUBLICOS: "Uso Indebido",
    OTRO: "Otro"
};

const SANCION_LABELS = {
    INHABILITACION: "Inhabilitación",
    INDEMNIZACION: "Indemnización",
    SANCION_ECONOMICA: "Sanción Económica",
    SUSPENSION_ACTIVIDADES: "Suspensión",
    DISOLUCION_SOCIEDAD: "Disolución",
    OTRO: "Otro"
};

export const createColumns = (session): ColumnDef<any>[] => [
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
        size: 180,
        enableSorting: true,
    },
    {
        accessorKey: "nombreRazonSocial",
        header: () => (
            <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>Persona Moral</span>
            </div>
        ),
        cell: ({ row }) => {
            const nombre = row.original.datosGenerales?.nombreRazonSocial || "Sin nombre";
            const rfc = row.original.datosGenerales?.rfc;
            return (
                <div className="max-w-[350px]">
                    <div className="font-medium truncate">{nombre}</div>
                    {rfc && (
                        <div className="text-xs text-muted-foreground mt-1">
                            RFC: <span className="font-mono">{rfc}</span>
                        </div>
                    )}
                </div>
            );
        },
        size: 350,
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
        size: 130,
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
        size: 130,
        enableSorting: true,
    },
    {
        accessorKey: "faltaCometida",
        header: () => (
            <div className="text-center">
                <span>Tipo de Falta</span>
            </div>
        ),
        cell: ({ row }) => {
            const faltas = row.original.faltaCometida || [];
            if (faltas.length === 0) {
                return <div className="text-center text-muted-foreground text-sm">Sin faltas</div>;
            }
            const falta = FALTA_LABELS[faltas[0].clave] || faltas[0].clave;
            return (
                <div className="flex justify-center gap-1">
                    <Badge variant="outline" className="font-normal">
                        {falta}
                    </Badge>
                    {faltas.length > 1 && (
                        <Badge variant="secondary" className="font-normal">
                            +{faltas.length - 1}
                        </Badge>
                    )}
                </div>
            );
        },
        size: 200,
        enableSorting: false,
    },
    {
        accessorKey: "tipoSancion",
        header: () => (
            <div className="flex items-center gap-2 justify-center">
                <Scale className="h-4 w-4 text-muted-foreground" />
                <span>Sanciones</span>
            </div>
        ),
        cell: ({ row }) => {
            const sanciones = row.original.tipoSancion || [];
            if (sanciones.length === 0) {
                return <div className="text-center text-muted-foreground text-sm">Sin sanciones</div>;
            }

            return (
                <div className="flex flex-wrap gap-1 justify-center max-w-[250px]">
                    {sanciones.slice(0, 2).map((s: any, i: number) => (
                        <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs font-normal bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                            {SANCION_LABELS[s.clave] || s.clave}
                        </Badge>
                    ))}
                    {sanciones.length > 2 && (
                        <Badge variant="secondary" className="text-xs font-normal">
                            +{sanciones.length - 2} más
                        </Badge>
                    )}
                </div>
            );
        },
        size: 250,
        enableSorting: false,
    },
    {
        id: "actions",
        header: () => <div className="text-center"></div>,
        cell: ({ row }) => <CellAction data={row.original} session={session} />,
        size: 60,
        enableSorting: false,
    },
];