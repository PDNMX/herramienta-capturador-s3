// @ts-nocheck
"use client"

import BreadCrumb from "@/components/breadcrumb";
import { FaltasAdministrativasNoGravesForm } from "@/components/forms/faltasNoGraves/faltas-administrativas-no-graves-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { useEffect, useState, use } from "react";
import directus from "@/lib/directus";
import { readItems, withToken } from "@directus/sdk";

export default function Page({ params }) {
  const { faltaId } = use(params);
  const { session, status } = useCurrentSession();

  const [falta, setFalta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const breadcrumbItems = [
    { title: "Editar", link: `/inicio/faltas-administrativas-no-graves/${faltaId}` },
  ];

  useEffect(() => {
    if (status === "authenticated") {
      async function fetchData() {
        try {
          const result = await directus.request(
            withToken(
              session?.access_token,
              readItems("faltas_administrativas_no_graves", {
                limit: 1,
                filter: {
                  id: {
                    _eq: faltaId,
                  },
                },
                fields: [
                  // Campos de la coleccion principal
                  "id",
                  "entePublico",
                  "status",
                  "fecha",
                  "expediente",
                  "observaciones",

                  // datosGenerales (M2O)
                  "datosGenerales.id",
                  "datosGenerales.nombres",
                  "datosGenerales.primerApellido",
                  "datosGenerales.segundoApellido",
                  "datosGenerales.curp",
                  "datosGenerales.rfc",
                  "datosGenerales.sexo",

                  // empleoCargoComision (M2O)
                  "empleoCargoComision.id",
                  "empleoCargoComision.entidadFederativa",
                  "empleoCargoComision.nivelOrdenGobierno",
                  "empleoCargoComision.ambitoPublico",
                  "empleoCargoComision.nombreEntePublico",
                  "empleoCargoComision.siglasEntePublico",
                  "empleoCargoComision.denominacion",
                  "empleoCargoComision.areaAdscripcion",
                  // empleoCargoComision.nivelJerarquico (M2O)
                  "empleoCargoComision.nivelJerarquico.id",
                  "empleoCargoComision.nivelJerarquico.clave",
                  "empleoCargoComision.nivelJerarquico.valor",

                  // origenProcedimiento (M2O)
                  "origenProcedimiento.id",
                  "origenProcedimiento.clave",
                  "origenProcedimiento.valor",

                  // resolucion (M2O) - sin url fields ni ordenJurisdiccional
                  "resolucion.id",
                  "resolucion.tituloResolucion",
                  "resolucion.fechaResolucion",
                  "resolucion.fechaNotificacion",
                  "resolucion.fechaResolucionFirme",
                  "resolucion.fechaNotificacionFirme",
                  "resolucion.fechaEjecucion",
                  "resolucion.autoridadResolutora",
                  "resolucion.autoridadInvestigadora",
                  "resolucion.autoridadSubstanciadora",

                  // faltaCometida (O2M)
                  "faltaCometida.id",
                  "faltaCometida.clave",
                  "faltaCometida.valor",
                  "faltaCometida.descripcionHechos",
                  // faltaCometida.normatividadInfringida (O2M)
                  "faltaCometida.normatividadInfringida.id",
                  "faltaCometida.normatividadInfringida.nombreNormatividad",
                  "faltaCometida.normatividadInfringida.articulo",
                  "faltaCometida.normatividadInfringida.fraccion",

                  // tipoSancion (O2M)
                  "tipoSancion.id",
                  "tipoSancion.clave",
                  // tipoSancion.amonestacion (M2O)
                  "tipoSancion.amonestacion.id",
                  "tipoSancion.amonestacion.tipo",
                  // tipoSancion.suspensionEmpleo (M2O)
                  "tipoSancion.suspensionEmpleo.id",
                  "tipoSancion.suspensionEmpleo.plazoMeses",
                  "tipoSancion.suspensionEmpleo.plazoDias",
                  "tipoSancion.suspensionEmpleo.fechaInicial",
                  "tipoSancion.suspensionEmpleo.fechaFinal",
                  // tipoSancion.destitucionEmpleo (M2O)
                  "tipoSancion.destitucionEmpleo.id",
                  "tipoSancion.destitucionEmpleo.fechaDestitucion",
                  // tipoSancion.inhabilitacion (M2O)
                  "tipoSancion.inhabilitacion.id",
                  "tipoSancion.inhabilitacion.plazoAnios",
                  "tipoSancion.inhabilitacion.plazoMeses",
                  "tipoSancion.inhabilitacion.plazoDias",
                  "tipoSancion.inhabilitacion.fechaInicial",
                  "tipoSancion.inhabilitacion.fechaFinal",
                  // tipoSancion.otro (M2O)
                  "tipoSancion.otro.id",
                  "tipoSancion.otro.denominacionSancion",
                ],
              })
            )
          );
          console.log("=== DATOS CARGADOS PARA EDICIÓN ===", JSON.stringify(result[0], null, 2));
          setFalta(result[0]);
        } catch (error) {
          console.error("Error al cargar los datos:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchData();
    }
  }, [session, status, faltaId]);

  if (isLoading || !falta) {
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-5">
          <BreadCrumb items={breadcrumbItems} />
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Cargando registro...</p>
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
        <FaltasAdministrativasNoGravesForm initialData={falta} key={faltaId} />
      </div>
    </ScrollArea>
  );
}
