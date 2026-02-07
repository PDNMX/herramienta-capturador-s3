// @ts-nocheck
"use client"

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
  const [isLoading, setIsLoading] = useState(true);
  const breadcrumbItems = [
    { title: "Editar", link: `/inicio/faltas-graves-pm/${faltaId}` },
  ];

  useEffect(() => {
    if (status === "authenticated") {
      async function fetchData() {
        try {
          const result = await directus.request(
            withToken(
              session?.access_token,
              readItems("faltas_graves_personas_morales", {
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

                  // datosGenerales → datos_generales_personas_morales (M2O)
                  "datosGenerales.id",
                  "datosGenerales.nombreRazonSocial",
                  "datosGenerales.rfc",
                  "datosGenerales.objetoSocial",
                  "datosGenerales.tipoDomicilio",
                  // datosGenerales.domicilioMexico → domicilio_mexico_morales (M2O)
                  "datosGenerales.domicilioMexico.id",
                  "datosGenerales.domicilioMexico.tipoVialidad",
                  "datosGenerales.domicilioMexico.nombreVialidad",
                  "datosGenerales.domicilioMexico.numeroExterior",
                  "datosGenerales.domicilioMexico.numeroInterior",
                  "datosGenerales.domicilioMexico.coloniaLocalidad",
                  "datosGenerales.domicilioMexico.municipioAlcaldia",
                  "datosGenerales.domicilioMexico.codigoPostal",
                  "datosGenerales.domicilioMexico.entidadFederativa",
                  // datosGenerales.domicilioExtranjero → domicilio_extranjero_morales (M2O)
                  "datosGenerales.domicilioExtranjero.id",
                  "datosGenerales.domicilioExtranjero.ciudad",
                  "datosGenerales.domicilioExtranjero.provincia",
                  "datosGenerales.domicilioExtranjero.calle",
                  "datosGenerales.domicilioExtranjero.numeroExterior",
                  "datosGenerales.domicilioExtranjero.numeroInterior",
                  "datosGenerales.domicilioExtranjero.codigoPostal",
                  "datosGenerales.domicilioExtranjero.pais",

                  // datosDirGeneralReprLegal → datos_dg_rp (M2O)
                  "datosDirGeneralReprLegal.id",
                  // datosDirGeneralReprLegal.directorGeneral → datos_representante (M2O)
                  "datosDirGeneralReprLegal.directorGeneral.id",
                  "datosDirGeneralReprLegal.directorGeneral.nombre",
                  "datosDirGeneralReprLegal.directorGeneral.primerApellido",
                  "datosDirGeneralReprLegal.directorGeneral.segundoApellido",
                  "datosDirGeneralReprLegal.directorGeneral.rfc",
                  "datosDirGeneralReprLegal.directorGeneral.curp",
                  // datosDirGeneralReprLegal.representanteLegal → datos_representante (M2O)
                  "datosDirGeneralReprLegal.representanteLegal.id",
                  "datosDirGeneralReprLegal.representanteLegal.nombre",
                  "datosDirGeneralReprLegal.representanteLegal.primerApellido",
                  "datosDirGeneralReprLegal.representanteLegal.segundoApellido",
                  "datosDirGeneralReprLegal.representanteLegal.rfc",
                  "datosDirGeneralReprLegal.representanteLegal.curp",

                  // dondeCometioLaFalta → donde_cometio_falta (M2O)
                  "dondeCometioLaFalta.id",
                  "dondeCometioLaFalta.entidadFederativa",
                  "dondeCometioLaFalta.nivelOrdenGobierno",
                  "dondeCometioLaFalta.ambitoPublico",
                  "dondeCometioLaFalta.nombreEntePublico",
                  "dondeCometioLaFalta.siglasEntePublico",

                  // origenProcedimiento → origen_procedimiento (M2O)
                  "origenProcedimiento.id",
                  "origenProcedimiento.clave",
                  "origenProcedimiento.valor",

                  // resolucion → resolucion_morales (M2O)
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
                  "resolucion.autoridadSusbstanciadora",

                  // faltaCometida → falta_cometida_morales (O2M via fk_morales)
                  "faltaCometida.id",
                  "faltaCometida.clave",
                  "faltaCometida.valor",
                  "faltaCometida.descripcionHechos",
                  // faltaCometida.normatividadInfringida → normatividad_morales (O2M/M2M)
                  "faltaCometida.normatividadInfringida.id",
                  "faltaCometida.normatividadInfringida.nombreNormatividad",
                  "faltaCometida.normatividadInfringida.articulo",
                  "faltaCometida.normatividadInfringida.fraccion",

                  // tipoSancion → tipo_sancion_personas_morales (O2M via fk_id)
                  "tipoSancion.id",
                  "tipoSancion.clave",
                  // tipoSancion.inhabilitacion → inhabilitacion (M2O)
                  "tipoSancion.inhabilitacion.id",
                  "tipoSancion.inhabilitacion.plazoAnios",
                  "tipoSancion.inhabilitacion.plazoMeses",
                  "tipoSancion.inhabilitacion.plazoDias",
                  "tipoSancion.inhabilitacion.fechaInicial",
                  "tipoSancion.inhabilitacion.fechaFinal",
                  // tipoSancion.indemnizacion → indemnizacion (M2O)
                  "tipoSancion.indemnizacion.id",
                  "tipoSancion.indemnizacion.monto",
                  "tipoSancion.indemnizacion.moneda",
                  "tipoSancion.indemnizacion.fechaPagoTotal",
                  // tipoSancion.indemnizacion.plazoPago → plazo_pago_indemnizacion (M2O)
                  "tipoSancion.indemnizacion.plazoPago.id",
                  "tipoSancion.indemnizacion.plazoPago.anios",
                  "tipoSancion.indemnizacion.plazoPago.meses",
                  "tipoSancion.indemnizacion.plazoPago.dias",
                  // tipoSancion.indemnizacion.efectivamenteCobrado → efectivamente_cobrado_indemnizacion (M2O)
                  "tipoSancion.indemnizacion.efectivamenteCobrado.id",
                  "tipoSancion.indemnizacion.efectivamenteCobrado.monto",
                  "tipoSancion.indemnizacion.efectivamenteCobrado.moneda",
                  "tipoSancion.indemnizacion.efectivamenteCobrado.fechaCobro",
                  // tipoSancion.sancionEconomica → sancion_economica (M2O)
                  "tipoSancion.sancionEconomica.id",
                  "tipoSancion.sancionEconomica.monto",
                  "tipoSancion.sancionEconomica.moneda",
                  "tipoSancion.sancionEconomica.fechaPagoTotal",
                  // tipoSancion.sancionEconomica.plazoPago → plazo_pago (M2O)
                  "tipoSancion.sancionEconomica.plazoPago.id",
                  "tipoSancion.sancionEconomica.plazoPago.anios",
                  "tipoSancion.sancionEconomica.plazoPago.meses",
                  "tipoSancion.sancionEconomica.plazoPago.dias",
                  // tipoSancion.sancionEconomica.efectivamenteCobrado → efectivamente_cobrado (M2O)
                  "tipoSancion.sancionEconomica.efectivamenteCobrado.id",
                  "tipoSancion.sancionEconomica.efectivamenteCobrado.monto",
                  "tipoSancion.sancionEconomica.efectivamenteCobrado.moneda",
                  "tipoSancion.sancionEconomica.efectivamenteCobrado.fechaCobro",
                  // tipoSancion.suspensionActividades → suspension_actividades (M2O)
                  "tipoSancion.suspensionActividades.id",
                  "tipoSancion.suspensionActividades.plazoSuspensionAnios",
                  "tipoSancion.suspensionActividades.plazoSuspensionMeses",
                  "tipoSancion.suspensionActividades.plazoSuspensionDias",
                  "tipoSancion.suspensionActividades.fechaInicial",
                  "tipoSancion.suspensionActividades.fechaFinal",
                  // tipoSancion.disolucionSociedad → disolucion_sociedad (M2O)
                  "tipoSancion.disolucionSociedad.id",
                  "tipoSancion.disolucionSociedad.fechaDisolucion",
                  // tipoSancion.otro → otro_sancion (M2O)
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
        <FaltasGravesPMForm initialData={falta} key={faltaId} />
      </div>
    </ScrollArea>
  );
}
