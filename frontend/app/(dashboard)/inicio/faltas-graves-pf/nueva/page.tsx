// @ts-nocheck
import BreadCrumb from "@/components/breadcrumb";
import { FaltasGravesPFForm } from "@/components/forms/faltasPF/faltas-graves-pf-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export default function Page() {
  const breadcrumbItems = [
    { title: "Nueva falta grave personas físicas", link: "/inicio/faltas-graves-pf/nueva" },
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <FaltasGravesPFForm initialData={null} key={null} />
      </div>
    </ScrollArea>
  );
}
