// @ts-nocheck
"use client";

import BreadCrumb from "@/components/breadcrumb";
import { ActividadTable } from "@/components/tables/actividad-table/table";
import directus from "@/lib/directus";
import { readActivities, withToken } from "@directus/sdk";
import { useEffect, useState, useCallback } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { signOut } from "next-auth/react";

const breadcrumbItems = [
  { title: "Administración", link: "/inicio/administracion/usuarios" },
  { title: "Bitácora", link: "/inicio/administracion/actividad" },
];

// Colecciones de faltas que queremos auditar
const FALTAS_COLLECTIONS = [
  "faltas_administrativas_graves",
  "faltas_administrativas_no_graves",
  "faltas_graves_personas_morales",
  "faltas_graves_personas_fisicas",
];

export default function Page() {
  const { session, status } = useCurrentSession();
  const [actividad, setActividad] = useState([]);

  const fetchData = useCallback(async () => {
    if (!session?.access_token) return;
    try {
      const result = await directus.request(
        withToken(session.access_token, readActivities({
          fields: [
            "id", "action", "timestamp", "ip", "collection", "item",
            "user.id", "user.first_name", "user.last_name", "user.email",
            "user.role.name",
          ] as any,
          filter: {
            _or: [
              // Inicios de sesión (cualquier usuario)
              { action: { _in: ["login", "authenticate"] } },
              // Modificaciones solo en las 4 colecciones de faltas
              {
                _and: [
                  { action: { _in: ["create", "update", "delete"] } },
                  { collection: { _in: FALTAS_COLLECTIONS } },
                ],
              },
            ],
          } as any,
          sort: ["-timestamp"] as any,
          limit: 500,
        }))
      );

      // Excluir actividades del usuario Administrador built-in de Directus
      const filtered = (result as any[]).filter(
        (a) => a.user?.role?.name !== "Administrator"
      );

      setActividad(filtered);
    } catch (error) {
      console.error("Error al cargar actividad:", error);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (session?.forceLogout) {
      signOut({ callbackUrl: "/" });
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [session, status, fetchData]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <ActividadTable data={actividad} onRefresh={fetchData} />
    </div>
  );
}
