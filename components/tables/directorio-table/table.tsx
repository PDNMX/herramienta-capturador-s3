// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AdjustableDataTable } from "@/components/ui/adjustable-data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createColumns } from "./columns";
import directus from "@/lib/directus";
import { readItems, withToken } from "@directus/sdk";
import { useCurrentSession } from "@/hooks/useCurrentSession";

export const DirectorioTable = () => {
  const router = useRouter();
  const { session } = useCurrentSession();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDirectorioData() {
      if (session?.access_token) {
        try {
          setLoading(true);
          const result = await directus.request(
            withToken(
              session.access_token,
              readItems("directorio", {
                filter: {
                  entidad: { _eq: session.user.entidad },
                },
                fields: [
                  "*",
                  "oic.nombre",
                  "sujetosObligados.nombre",
                  "entidad.nombre",
                ],
                limit: -1,
              })
            )
          );
          setData(result);
        } catch (error) {
          console.error("Error al obtener los datos del directorio:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchDirectorioData();
  }, [session]);

  const columns = createColumns(session);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-start justify-between mb-4">
        <Heading
          title="Directorio de Órganos Internos de Control"
          description="Gestión de datos de contacto y localización"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/directorio/create`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Agregar nuevo
        </Button>
      </div>

      <Card className="bg-muted mb-4">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Esta sección integra los datos de contacto y localización de los
            Órganos Internos de Control de los Entes públicos en las entidades
            federativas. Cada Órgano Interno de Control puede estar asignado a
            uno o más Entes públicos dentro de su entidad federativa. Sin
            embargo, es importante resaltar que cada Ente público solo puede
            tener asignado un único Órgano Interno de Control, garantizando una
            relación exclusiva entre el Ente público y el OIC que lo atiende.
          </p>
        </CardContent>
      </Card>

      <Separator className="mb-4" />

      <div className="flex-grow">
        <AdjustableDataTable searchKey="nombre" columns={columns} data={data} />
      </div>
    </div>
  );
};
