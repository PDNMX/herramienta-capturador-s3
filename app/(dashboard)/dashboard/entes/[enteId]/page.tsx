// @ts-nocheck
"use client"

import BreadCrumb from "@/components/breadcrumb";
import { EnteForm } from "@/components/forms/ente-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { useEffect, useState } from "react";
import directus from "@/lib/directus";
import { readItems, withToken } from "@directus/sdk";

export default function Page({ params }) {
  const { enteId } = params;
  const { session, status } = useCurrentSession();
  
  const [ente, setEnte] = useState([]);
  const breadcrumbItems = [
    { title: "Editar", link: `/dashboard/entes/${enteId}` },
  ];

  useEffect(() => {
    if (status === "authenticated") {
      async function fetchData() {
        try {
          const result = await directus.request(
            withToken(
              session?.access_token, 
              readItems("entes", {
                limit: "1",
                fields: ["*"],
                filter: {
                  id: {
                    _eq: enteId,
                  },
                },
              })
            ),
            
          );
          setEnte(result[0]);
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
        <EnteForm initialData={ente} key={enteId} />
      </div>
    </ScrollArea>
  );
}
