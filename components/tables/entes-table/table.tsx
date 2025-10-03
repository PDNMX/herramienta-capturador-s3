// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createColumns } from "./columns"; // Asegúrate de importar createColumns
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCurrentSession } from "@/hooks/useCurrentSession"; // Asegúrate de importar useCurrentSession

const columnVisibilityMap = {
  SO: {
    ambitoGobierno: true,
    poderGobierno: true,
    sistema1: true,
    sistema2: true,
    sistema3: false,
    sistema6: true,
  },
  OIC: {
    ambitoGobierno: true,
    poderGobierno: true,
    sistema1: false,
    sistema2: false,
    sistema3: true,
    sistema6: false,
  },
};

export const EntesTable = ({ data }: any) => {
  const router = useRouter();
  const { session } = useCurrentSession();

  // Filtrar datos basados en los campos controlOIC y controlTribunal
  const sujetosObligados = data.filter((item: any) => !item.controlOIC);
  const organoInternoControl = data.filter((item: any) => item.controlOIC || item.controlTribunal);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title="Entes Públicos"
          description="Administrar Entes Públicos"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/entes/create`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Agregar nuevo
        </Button>
      </div>
      <Separator />

      <Tabs defaultValue="SO" className="space-y-4">
        <TabsList>
          <TabsTrigger value="SO">
            Sujetos Obligados ({sujetosObligados.length})
          </TabsTrigger>
          <TabsTrigger value="OIC">
            Autoridades Resolutoras ({organoInternoControl.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="SO" className="space-y-4">
          <DataTable
            searchKey="nombre"
            columns={createColumns(columnVisibilityMap.SO, session)}
            data={sujetosObligados}
          />
        </TabsContent>

        <TabsContent value="OIC" className="space-y-4">
          <DataTable
            searchKey="nombre"
            columns={createColumns(columnVisibilityMap.OIC, session)}
            data={organoInternoControl}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};