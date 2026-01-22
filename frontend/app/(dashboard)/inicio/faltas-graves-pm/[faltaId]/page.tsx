// @ts-nocheck
"use client"

import BreadCrumb from "@/components/breadcrumb";
import { FaltasGravesPMForm } from "@/components/forms/faltasPM/faltas-graves-pm-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { useEffect, useState } from "react";
import directus from "@/lib/directus";
import { readItems, withToken } from "@directus/sdk";

export default function Page({ params }) {
  const { faltaId } = params;
  const { session, status } = useCurrentSession();

  const [falta, setFalta] = useState([]);
  const breadcrumbItems = [
    { title: "Editar", link: `/inicio/faltas-graves-pm/${faltaId}` },
  ];

  useEffect(() => {
    if (status === "authenticated") {
      async function fetchData() {
        try {
          const result = await directus.request(
            withToken(
              session?.access_token,
              readItems("faltas_graves_personas_morales", {
                limit: "1",
                fields: ["*"],
                filter: {
                  id: {
                    _eq: faltaId,
                  },
                },
              })
            ),

          );
          setFalta(result[0]);
          //console.log(JSON.stringify(result[0]))
        } catch (error) {
          console.error("Error al cargar los datos:", error);
        }
      }
      fetchData();
    }
  }, [session, status]);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <FaltasGravesPMForm initialData={falta} key={faltaId} />
      </div>
    </ScrollArea>
  );
}
