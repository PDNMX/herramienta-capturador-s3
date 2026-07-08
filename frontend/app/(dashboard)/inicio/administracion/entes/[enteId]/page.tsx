// @ts-nocheck
"use client";

import React from "react";
import BreadCrumb from "@/components/breadcrumb";
import { EnteForm } from "@/components/forms/entes/ente-form";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import directus from "@/lib/directus";
import { readItem, withToken } from "@directus/sdk";
import { useEffect, useState } from "react";

const breadcrumbItems = [
  { title: "Administración", link: "/inicio/administracion/usuarios" },
  { title: "Entes Públicos", link: "/inicio/administracion/entes" },
  { title: "Editar", link: "#" },
];

export default function Page({ params }: { params: Promise<{ enteId: string }> }) {
  const { enteId } = React.use(params);
  const { session, status } = useCurrentSession();
  const [ente, setEnte] = useState<any>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.access_token) return;
    directus.request(
      withToken(session.access_token, readItem("ente_publico" as any, enteId, {
        fields: ["id", "nombre"] as any,
      }))
    )
      .then((res: any) => setEnte(res))
      .catch((err) => console.error("Error al cargar ente:", err));
  }, [session, status, enteId]);

  if (!ente) return null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <div className="space-y-2 mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Editar Ente Público</h1>
        <p className="text-sm text-muted-foreground">{ente.nombre}</p>
      </div>
      <EnteForm initialData={ente} />
    </div>
  );
}
