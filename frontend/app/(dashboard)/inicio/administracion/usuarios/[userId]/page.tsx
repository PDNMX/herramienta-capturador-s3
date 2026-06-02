// @ts-nocheck
"use client";

import React from "react";
import BreadCrumb from "@/components/breadcrumb";
import { UsuarioForm } from "@/components/forms/usuarios/usuario-form";
import directus from "@/lib/directus";
import { readUser, withToken } from "@directus/sdk";
import { useEffect, useState } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { ShieldCheck } from "lucide-react";

const breadcrumbItems = [
  { title: "Administración", link: "/inicio/administracion/usuarios" },
  { title: "Usuarios", link: "/inicio/administracion/usuarios" },
  { title: "Editar", link: "#" },
];

export default function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = React.use(params);
  const { session, status } = useCurrentSession();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    if (status === "authenticated" && userId) {
      async function fetchData() {
        try {
          const result = await directus.request(
            withToken(
              session?.access_token,
              readUser(userId, {
                fields: ["id", "first_name", "last_name", "email", "entePublico.id", "entePublico.nombre", "status", "role.id", "role.name"],
              })
            )
          );
          setUsuario(result);
        } catch (error) {
          console.error("Error al cargar usuario:", error);
        }
      }
      fetchData();
    }
  }, [session, status, userId]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-950/50 shrink-0">
          <ShieldCheck className="h-5 w-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground leading-none mb-1">
            Editar Usuario
          </h2>
          <p className="text-sm text-muted-foreground">
            {usuario ? `${usuario.first_name} ${usuario.last_name}` : "Cargando..."}
            <span className="mx-2 text-border">·</span>
            Administración
          </p>
        </div>
      </div>
      {usuario ? (
        <UsuarioForm initialData={usuario} />
      ) : (
        <div className="text-sm text-muted-foreground">Cargando datos del usuario...</div>
      )}
    </div>
  );
}
