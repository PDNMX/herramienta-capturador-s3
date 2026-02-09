// @ts-nocheck
import BreadCrumb from "@/components/breadcrumb";
import { FaltasAdministrativasGravesForm } from "@/components/forms/faltasGraves/faltas-administrativas-graves-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export default function Page() {
  const breadcrumbItems = [
    { title: "Nueva falta administrativa grave", link: "/inicio/faltas-administrativas-graves/nueva" },
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <FaltasAdministrativasGravesForm initialData={null} key={null} />
      </div>
    </ScrollArea>
  );
}
