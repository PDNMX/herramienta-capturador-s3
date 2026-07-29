// @ts-nocheck
"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, PowerOff, Power } from "lucide-react";
import { useState } from "react";
import directus from "@/lib/directus";
import { updateUser, withToken } from "@directus/sdk";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export const CellAction = ({ data, session, onRefresh }: any) => {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { toast } = useToast();
  const isActive = data.status === "active";
  const fullName = `${data.first_name} ${data.last_name}`;

  const toggleStatus = async () => {
    try {
      setLoading(true);
      const newStatus = isActive ? "suspended" : "active";
      await directus.request(
        withToken(session?.access_token, updateUser(data.id, { status: newStatus }))
      );
      toast({
        title: isActive ? "Usuario desactivado" : "Usuario activado",
        description: `${fullName} ha sido ${isActive ? "desactivado" : "activado"}.`,
      });
      onRefresh?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo cambiar el estatus.",
      });
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      {/* Confirmación solo para desactivar */}
      <AlertModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={toggleStatus}
        loading={loading}
        title="¿Desactivar usuario?"
        description={`Estás a punto de desactivar a ${fullName}. El usuario no podrá iniciar sesión hasta que sea activado nuevamente.`}
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
          <Link href={`/inicio/administracion/usuarios/${data.id}`}>
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={() => isActive ? setConfirmOpen(true) : toggleStatus()}
            disabled={loading}
            className={`cursor-pointer ${isActive ? "text-destructive focus:text-destructive" : "text-green-600 focus:text-green-600"}`}
          >
            {isActive
              ? <><PowerOff className="mr-2 h-4 w-4" /> Desactivar</>
              : <><Power className="mr-2 h-4 w-4" /> Activar</>
            }
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
