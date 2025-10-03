// @ts-nocheck
"use client";

import BreadCrumb from "@/components/breadcrumb";
import { DirectorioForm } from "@/components/forms/directorio-form"; // Cambiamos el formulario a DirectorioForm
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { useEffect, useState } from "react";
import directus from "@/lib/directus";
import { readItems, withToken } from "@directus/sdk";

export default function Page({ params }) {
  const { directorioId } = params; // Cambiamos enteId a directorioId
  const { session, status } = useCurrentSession();
  
  const [directorio, setDirectorio] = useState([]);
  const breadcrumbItems = [
    { title: "Editar", link: `/dashboard/directorio/${directorioId}` },
  ];

  useEffect(() => {
    if (status === "authenticated") {
      async function fetchData() {
        try {
          const result = await directus.request(
            withToken(
              session?.access_token, 
              readItems("directorio", {
                limit: "1",
                fields: ["*"],
                filter: {
                  id: {
                    _eq: directorioId, // Filtramos por directorioId
                  },
                },
              })
            ),
          );
          setDirectorio(result[0]); // Asignamos el primer resultado
        } catch (error) {
          console.error("Error al cargar los datos:", error);
        }
      }
      fetchData();
    }
  }, [session, status, directorioId]);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <DirectorioForm initialData={directorio} key={directorioId} /> {/* Usamos DirectorioForm */}
      </div>
    </ScrollArea>
  );
}
