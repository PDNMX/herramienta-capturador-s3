// @ts-nocheck
"use client";

import { DataTable } from "./data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "./columns";
import InfoAlert from "./info-alert"; // Importa el nuevo componente

import marcoGeoestadisticoInegi from "./data-entidades";

export const CoberturaTable = ({ data }: any) => {
  const datosConNombres = data.map((dato) => {
    const entidadEncontrada = marcoGeoestadisticoInegi.find(
      (entidad) => entidad.id === dato.entidad
    );
    if (!entidadEncontrada) {
      return { ...dato, nombreEntidad: "Entidad no encontrada" };
    }
    return { ...dato, nombreEntidad: entidadEncontrada.nombre };
  });

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Tablero Estadístico de Interconexión Nacional`}
          description={
            "Visualiza en tiempo real el avance de los Entes Públicos en la interconexión con los sistemas de la Plataforma Digital Nacional."
          }
        />
      </div>
      <Separator />

      <DataTable
        searchKey="nombreEntidad"
        columns={columns}
        data={datosConNombres}
      />
    </>
  );
};
