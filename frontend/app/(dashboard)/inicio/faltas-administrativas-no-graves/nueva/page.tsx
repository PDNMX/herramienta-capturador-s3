// @ts-nocheck
import BreadCrumb from "@/components/breadcrumb";
import { FaltasAdministrativasNoGravesForm } from "@/components/forms/faltasNoGraves/faltas-administrativas-no-graves-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export default function Page() {
  const breadcrumbItems = [
    { title: "Nueva falta administrativa no grave", link: "/inicio/faltas-administrativas-no-graves/nueva" },
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <FaltasAdministrativasNoGravesForm initialData={null} key={null} />
      </div>
    </ScrollArea>
  );
}
