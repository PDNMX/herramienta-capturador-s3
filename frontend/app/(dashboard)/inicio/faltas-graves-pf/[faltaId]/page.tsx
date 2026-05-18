// @ts-nocheck
"use client"

import BreadCrumb from "@/components/breadcrumb";
import { FaltasGravesPFForm } from "@/components/forms/faltasPF/faltas-graves-pf-form";
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
    { title: "Editar", link: `/inicio/faltas-graves-pf/${faltaId}` },
  ];

  useEffect(() => {
    if (status === "authenticated") {
      async function fetchData() {
        try {
          const result = await directus.request(
            withToken(
              session?.access_token,
              readItems("faltas_graves_personas_fisicas", {
                limit: 1,
                filter: {
                  id: {
                    _eq: faltaId,
                  },
                },
                fields: [
                  // Campos de la colección principal
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
                  "datosGenerales.tipoDomicilio",
                  // datosGenerales.domicilioMexico (M2O)
                  "datosGenerales.domicilioMexico.id",
                  "datosGenerales.domicilioMexico.tipoVialidad",
                  "datosGenerales.domicilioMexico.nombreVialidad",
                  "datosGenerales.domicilioMexico.numeroExterior",
                  "datosGenerales.domicilioMexico.numeroInterior",
                  "datosGenerales.domicilioMexico.coloniaLocalidad",
                  "datosGenerales.domicilioMexico.municipioAlcaldia",
                  "datosGenerales.domicilioMexico.codigoPostal",
                  "datosGenerales.domicilioMexico.entidadFederativa",
                  // datosGenerales.domicilioExtranjero (M2O)
                  "datosGenerales.domicilioExtranjero.id",
                  "datosGenerales.domicilioExtranjero.ciudad",
                  "datosGenerales.domicilioExtranjero.provincia",
                  "datosGenerales.domicilioExtranjero.calle",
                  "datosGenerales.domicilioExtranjero.numeroExterior",
                  "datosGenerales.domicilioExtranjero.numeroInterior",
                  "datosGenerales.domicilioExtranjero.codigoPostal",
                  "datosGenerales.domicilioExtranjero.pais",

                  // dondeCometioLaFalta (M2O)
                  "dondeCometioLaFalta.id",
                  "dondeCometioLaFalta.entidadFederativa",
                  "dondeCometioLaFalta.nivelOrdenGobierno",
                  "dondeCometioLaFalta.ambitoPublico",
                  "dondeCometioLaFalta.nombreEntePublico",
                  "dondeCometioLaFalta.siglasEntePublico",

                  // origenProcedimiento (M2O)
                  "origenProcedimiento.id",
                  "origenProcedimiento.clave",
                  "origenProcedimiento.valor",

                  // resolucion (M2O)
                  "resolucion.id",
                  "resolucion.tituloResolucion",
                  "resolucion.fechaResolucion",
                  "resolucion.fechaNotificacion",
                  "resolucion.urlResolucion",
                  "resolucion.fechaResolucionFirme",
                  "resolucion.fechaNotificacionFirme",
                  "resolucion.urlResolucionFirme",
                  "resolucion.fechaEjecucion",
                  "resolucion.ordenJurisdiccional",
                  "resolucion.autoridadResolutora",
                  "resolucion.autoridadInvestigadora",
                  "resolucion.autoridadSubstanciadora",

                  // faltaCometida (O2M)
                  "faltaCometida.id",
                  "faltaCometida.clave",
                  "faltaCometida.valor",
                  "faltaCometida.descripcionHechos",
                  // faltaCometida.normatividadInfringida (O2M/M2M)
                  "faltaCometida.normatividadInfringida.id",
                  "faltaCometida.normatividadInfringida.nombreNormatividad",
                  "faltaCometida.normatividadInfringida.articulo",
                  "faltaCometida.normatividadInfringida.fraccion",

                  // tipoSancion (O2M)
                  "tipoSancion.id",
                  "tipoSancion.clave",
                  // tipoSancion.inhabilitacion (M2O)
                  "tipoSancion.inhabilitacion.id",
                  "tipoSancion.inhabilitacion.plazoAnios",
                  "tipoSancion.inhabilitacion.plazoMeses",
                  "tipoSancion.inhabilitacion.plazoDias",
                  "tipoSancion.inhabilitacion.fechaInicial",
                  "tipoSancion.inhabilitacion.fechaFinal",
                  // tipoSancion.indemnizacion (M2O)
                  "tipoSancion.indemnizacion.id",
                  "tipoSancion.indemnizacion.monto",
                  "tipoSancion.indemnizacion.moneda",
                  "tipoSancion.indemnizacion.fechaPagoTotal",
                  // tipoSancion.indemnizacion.plazoPago (M2O)
                  "tipoSancion.indemnizacion.plazoPago.id",
                  "tipoSancion.indemnizacion.plazoPago.anios",
                  "tipoSancion.indemnizacion.plazoPago.meses",
                  "tipoSancion.indemnizacion.plazoPago.dias",
                  // tipoSancion.indemnizacion.efectivamenteCobrada (M2O)
                  "tipoSancion.indemnizacion.efectivamenteCobrada.id",
                  "tipoSancion.indemnizacion.efectivamenteCobrada.monto",
                  "tipoSancion.indemnizacion.efectivamenteCobrada.moneda",
                  "tipoSancion.indemnizacion.efectivamenteCobrada.fechaCobro",
                  // tipoSancion.sancionEconomica (M2O)
                  "tipoSancion.sancionEconomica.id",
                  "tipoSancion.sancionEconomica.monto",
                  "tipoSancion.sancionEconomica.moneda",
                  "tipoSancion.sancionEconomica.fechaPagoTotal",
                  // tipoSancion.sancionEconomica.plazoPago (M2O)
                  "tipoSancion.sancionEconomica.plazoPago.id",
                  "tipoSancion.sancionEconomica.plazoPago.anios",
                  "tipoSancion.sancionEconomica.plazoPago.meses",
                  "tipoSancion.sancionEconomica.plazoPago.dias",
                  // tipoSancion.sancionEconomica.efectivamenteCobrada (M2O)
                  "tipoSancion.sancionEconomica.efectivamenteCobrada.id",
                  "tipoSancion.sancionEconomica.efectivamenteCobrada.monto",
                  "tipoSancion.sancionEconomica.efectivamenteCobrada.moneda",
                  "tipoSancion.sancionEconomica.efectivamenteCobrada.fechaCobro",
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

  // No renderizar el formulario hasta que los datos estén cargados
  // Esto garantiza que useForm se inicialice con los datos correctos
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
        <FaltasGravesPFForm initialData={falta} key={faltaId} />
      </div>
    </ScrollArea>
  );
}
