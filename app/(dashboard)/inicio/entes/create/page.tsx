// @ts-nocheck
"use client";

import BreadCrumb from "@/components/breadcrumb";
import { FaltasGravesPMForm } from "@/components/forms/faltasPM/faltas-graves-pm-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { useEffect, useState } from "react";
import directus from "@/lib/directus";
import { readItems, withToken } from "@directus/sdk";

export default function Page({ params }) {
  const { faltaId } = params;
  const { session, status } = useCurrentSession();

  const [falta, setFalta] = useState(null);
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [
    {
      title: "Faltas Graves Personas Morales",
      link: "/dashboard/faltas-graves-pm",
    },
    {
      title: faltaId ? "Editar" : "Nueva",
      link: faltaId
        ? `/dashboard/faltas-graves-pm/${faltaId}`
        : "/dashboard/faltas-graves-pm/nueva",
    },
  ];

  useEffect(() => {
    if (status === "authenticated" && faltaId) {
      async function fetchData() {
        try {
          setLoading(true);
          const result = await directus.request(
            withToken(
              session?.access_token,
              readItems("faltas_graves_personas_morales", {
                limit: 1,
                fields: [
                  "*",
                  // Punto 3: Datos Generales
                  "datosGenerales.*",
                  "datosGenerales.domicilioMexico.*",
                  "datosGenerales.domicilioExtranjero.*",

                  // Punto 4: Director General y Representante Legal
                  "datosDirGeneralReprLegal.*",
                  "datosDirGeneralReprLegal.directorGeneral.*",
                  "datosDirGeneralReprLegal.representanteLegal.*",

                  // Punto 5: Donde cometió la falta
                  "dondeCometioLaFalta.*",

                  // Punto 6: Origen del procedimiento
                  "origenProcedimiento.*",

                  // Punto 7: Falta Cometida
                  "faltaCometida.*",
                  "faltaCometida.normatividadInfringida.*",

                  // Punto 8: Resolución
                  "resolucion.*",

                  // Punto 9: Tipo de Sanción (complejo)
                  "tipoSancion.*",
                  "tipoSancion.inhabilitacion.*",
                  "tipoSancion.indemnizacion.*",
                  "tipoSancion.indemnizacion.plazoPago.*",
                  "tipoSancion.indemnizacion.efectivamenteCobrado.*",
                  "tipoSancion.sancionEconomica.*",
                  "tipoSancion.sancionEconomica.plazoPago.*",
                  "tipoSancion.sancionEconomica.efectivamenteCobrado.*",
                  "tipoSancion.suspensionActividades.*",
                  "tipoSancion.disolucionSociedad.*",
                  "tipoSancion.otro.*",
                ],
                filter: {
                  id: {
                    _eq: faltaId,
                  },
                },
              })
            )
          );

          if (result && result.length > 0) {
            setFalta(result[0]);
            console.log("Falta cargada:", result[0]);
          }
        } catch (error) {
          console.error("Error al cargar los datos:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    } else if (status === "authenticated" && !faltaId) {
      // Si no hay faltaId, es un registro nuevo
      setLoading(false);
    }
  }, [session, status, faltaId]);

  // Mostrar loader mientras carga
  if (status === "loading" || (loading && faltaId)) {
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-5">
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Cargando...</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <FaltasGravesPMForm initialData={falta} key={faltaId || "new"} />
      </div>
    </ScrollArea>
  );
}
