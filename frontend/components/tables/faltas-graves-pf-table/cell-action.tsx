// @ts-nocheck
"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import directus from "@/lib/directus";
import { useToast } from "@/components/ui/use-toast";
import { deleteItem, withToken } from "@directus/sdk";
import Link from "next/link";

export const CellAction = ({ data, session }: any) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (localStorage.getItem("deleted-falta-pf") === "true") {
            toast({
                variant: "default",
                title: "Registro eliminado",
                description: "La falta grave ha sido eliminada exitosamente.",
            });
            localStorage.removeItem("deleted-falta-pf");
        }
    }, [toast]);

    const onConfirm = async () => {
        try {
            setLoading(true);
            if (data && session) {
                await directus.request(
                    withToken(
                        session?.access_token,
                        deleteItem("faltas_graves_personas_fisicas", data.id)
                    )
                );
                localStorage.setItem("deleted-falta-pf", "true");
                window.location.reload();
            }
        } catch (error: any) {
            console.error("Error:", error);
            toast({
                variant: "destructive",
                title: "Error al eliminar",
                description: error.message || "Hubo un problema al eliminar el registro.",
            });
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onConfirm}
                loading={loading}
            />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href={`/inicio/faltas-graves-pf/${data.id}`}>
                        <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </DropdownMenuItem>
                    </Link>
                    {/* <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                    </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
