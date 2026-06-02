// @ts-nocheck
"use client";

import BreadCrumb from "@/components/breadcrumb";
import { UsuariosTable } from "@/components/tables/usuarios-table/table";
import directus from "@/lib/directus";
import { readUsers, withToken } from "@directus/sdk";
import { useEffect, useState } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { signOut } from "next-auth/react";

const breadcrumbItems = [
  { title: "Administración", link: "/inicio/administracion/usuarios" },
  { title: "Usuarios", link: "/inicio/administracion/usuarios" },
];

export default function Page() {
  const { session, status } = useCurrentSession();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    if (session?.forceLogout) {
      signOut({ callbackUrl: "/" });
    } else if (status === "authenticated") {
      async function fetchData() {
        try {
          const result = await directus.request(
            withToken(
              session?.access_token,
              readUsers({
                fields: ["id", "first_name", "last_name", "email", "status", "entePublico.id", "entePublico.nombre", "role.id", "role.name"],
                sort: ["first_name"],
                limit: -1,
              })
            )
          );
          setUsuarios(result as any[]);
        } catch (error) {
          console.error("Error al cargar usuarios:", error);
        }
      }
      fetchData();
    }
  }, [session, status]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <UsuariosTable data={usuarios} />
    </div>
  );
}
