// @ts-nocheck
"use client";

import BreadCrumb from "@/components/breadcrumb";
import { EnteForm } from "@/components/forms/entes/ente-form";

const breadcrumbItems = [
  { title: "Administración", link: "/inicio/administracion/usuarios" },
  { title: "Entes Públicos", link: "/inicio/administracion/entes" },
  { title: "Nuevo", link: "/inicio/administracion/entes/nuevo" },
];

export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <div className="space-y-2 mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Nuevo Ente Público</h1>
        <p className="text-sm text-muted-foreground">Registra un nuevo ente público en el sistema</p>
      </div>
      <EnteForm />
    </div>
  );
}
