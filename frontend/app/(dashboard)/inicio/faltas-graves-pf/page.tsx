// @ts-nocheck
"use client";

import BreadCrumb from "@/components/breadcrumb";
import { FaltasGravesPFTable } from "@/components/tables/faltas-graves-pf-table/table";
import directus from "@/lib/directus";
import { readItems, withToken } from "@directus/sdk";
import { useEffect, useState } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { signOut } from "next-auth/react";

const breadcrumbItems = [
  { title: "Faltas Graves Personas Físicas", link: "/inicio/faltas-graves-pf" },
];

export default function Page() {
  const { session, status } = useCurrentSession();
  const [faltas, setFaltas] = useState([]);

  const fetchData = async () => {
    if (!session?.access_token) return;
    try {
      const result = await directus.request(
        withToken(session?.access_token, readItems("faltas_graves_personas_fisicas", {
          sort: ["date_created"],
          limit: -1,
          fields: [
            "id", "expediente", "fecha", "status", "observaciones", "date_created",
            "datosGenerales.id", "datosGenerales.nombres", "datosGenerales.primerApellido", "datosGenerales.segundoApellido", "datosGenerales.rfc",
          ],
        }))
      );
      setFaltas(result);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  useEffect(() => {
    if (session?.forceLogout) {
      signOut({ callbackUrl: "/" });
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [session, status]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <FaltasGravesPFTable data={faltas} onRefresh={fetchData} />
    </div>
  );
}
