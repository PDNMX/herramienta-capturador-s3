// @ts-nocheck
import BreadCrumb from "@/components/breadcrumb";
import { FaltasGravesPMForm } from "@/components/forms/faltasPM/faltas-graves-pm-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export default function Page() {
  const breadcrumbItems = [
    { title: "Crear", link: "/inicio/faltas-graves-pm/create" },
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <FaltasGravesPMForm initialData={null} key={null} />
      </div>
    </ScrollArea>
  );
}
