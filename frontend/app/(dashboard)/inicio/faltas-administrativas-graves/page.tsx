// @ts-nocheck
"use client";

import BreadCrumb from "@/components/breadcrumb";
import { FaltasAdministrativasGravesTable } from "@/components/tables/faltas-administrativas-graves-table/table";
import directus from "@/lib/directus";
import { readItems, withToken } from "@directus/sdk";
import { useEffect, useState } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { signOut } from "next-auth/react";

const breadcrumbItems = [
  { title: "Faltas Administrativas Graves", link: "/inicio/faltas-administrativas-graves" },
];

export default function Page() {
  const { session, status } = useCurrentSession();
  const [faltas, setFaltas] = useState([]);

  useEffect(() => {
    if (session?.forceLogout) {
      signOut({ callbackUrl: "/" });
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [session, status]);

  const fetchData = async () => {
    if (!session?.access_token) return;
    try {
      const result = await directus.request(
        withToken(session?.access_token, readItems("faltas_administrativas_graves", {
          sort: ["date_created"],
          limit: -1,
          fields: [
            "id", "expediente", "fecha", "status", "observaciones", "date_created",
            "datosGenerales.id", "datosGenerales.nombres", "datosGenerales.primerApellido", "datosGenerales.segundoApellido", "datosGenerales.rfc",
            "faltaCometida.id", "faltaCometida.clave", "faltaCometida.valor",
            "tipoSancion.id", "tipoSancion.clave",
          ],
        }))
      );
      setFaltas(result);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <FaltasAdministrativasGravesTable data={faltas} onRefresh={fetchData} />
    </div>
  );
}
