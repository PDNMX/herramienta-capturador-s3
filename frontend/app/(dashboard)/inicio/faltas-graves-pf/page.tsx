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

  useEffect(() => {
    if (session?.forceLogout) {
      signOut({ callbackUrl: "/" });
    } else if (status === "authenticated") {
      async function fetchData() {
        try {
          const result = await directus.request(
            withToken(session?.access_token, readItems("faltas_graves_personas_fisicas", {
              sort: ["date_created"],
              limit: -1,
              fields: [
                "id",
                "expediente",
                "fecha",
                "status",
                "observaciones",
                "date_created",
                // Datos Generales
                "datosGenerales.id",
                "datosGenerales.nombres",
                "datosGenerales.primerApellido",
                "datosGenerales.segundoApellido",
                "datosGenerales.rfc",
                // Falta cometida
                "faltaCometida.id",
                "faltaCometida.clave",
                "faltaCometida.valor",
                // Tipo de sanción
                "tipoSancion.id",
                "tipoSancion.clave",
              ],
            }))
          );

          setFaltas(result);
        } catch (error) {
          console.error("Error al cargar los datos:", error);
        }
      }

      fetchData();
    }
  }, [session, status]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <FaltasGravesPFTable data={faltas} />
    </div>
  );
}
