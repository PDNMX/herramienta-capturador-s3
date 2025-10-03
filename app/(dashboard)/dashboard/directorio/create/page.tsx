// @ts-nocheck
import BreadCrumb from "@/components/breadcrumb";
import { DirectorioForm } from "@/components/forms/directorio-form"; // Cambiamos el formulario a DirectorioForm
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export default function Page() {
  const breadcrumbItems = [
    { title: "Crear", link: "/dashboard/directorio/create" }, // Cambiamos el link para el directorio
  ];

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <DirectorioForm initialData={null} key={null} /> {/* Usamos el formulario correspondiente para Directorio */}
      </div>
    </ScrollArea>
  );
}
