// @ts-nocheck
"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import directus from "@/lib/directus"; // Importa directus
import { useToast } from "@/components/ui/use-toast";
import { deleteItem, withToken } from "@directus/sdk"; // Importa deleteItem
import Link from "next/link";

export const CellAction = ({ data, session }: any) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (localStorage.getItem("deleted") === "true") {
      toast({
        variant: "default",
        title: "Registro del directorio eliminado exitosamente",
      });
      localStorage.removeItem("deleted"); // Elimina el estado después de mostrar el toast
    }
  }, []);

  const onConfirm = async () => {
    try {
      setLoading(true);
      if (data && session) {
        await directus.request(
          withToken(session?.access_token, deleteItem("directorio", data.id)),
        );
        localStorage.setItem("deleted", "true"); // Almacena el estado
        window.location.reload();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Algo salió mal.",
        description: "Hubo un problema con tu solicitud.",
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
          <Link href={`/dashboard/directorio/${data.id}`}>
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="cursor-pointer">
            <Trash className="mr-2 h-4 w-4" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
