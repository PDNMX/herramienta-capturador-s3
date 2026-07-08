// @ts-nocheck
"use client";

import BreadCrumb from "@/components/breadcrumb";
import { EntesTable } from "@/components/tables/entes-table/table";
import directus from "@/lib/directus";
import { readItems, withToken } from "@directus/sdk";
import { useEffect, useState, useCallback } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { signOut } from "next-auth/react";

const breadcrumbItems = [
  { title: "Administración", link: "/inicio/administracion/usuarios" },
  { title: "Entes Públicos", link: "/inicio/administracion/entes" },
];

export default function Page() {
  const { session, status } = useCurrentSession();
  const [entes, setEntes] = useState([]);

  const fetchData = useCallback(async () => {
    if (!session?.access_token) return;
    try {
      const result = await directus.request(
        withToken(session.access_token, readItems("ente_publico" as any, {
          fields: ["id", "nombre"] as any,
          sort: ["nombre"] as any,
          limit: -1,
        }))
      );
      setEntes(result as any[]);
    } catch (error) {
      console.error("Error al cargar entes:", error);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (session?.forceLogout) {
      signOut({ callbackUrl: "/" });
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [session, status, fetchData]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <EntesTable data={entes} onRefresh={fetchData} />
    </div>
  );
}
