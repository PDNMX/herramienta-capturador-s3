// @ts-nocheck
"use client"

import BreadCrumb from "@/components/breadcrumb";
import { FaltasGravesPMForm } from "@/components/forms/faltasPM/faltas-graves-pm-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { useEffect, useState } from "react";
import directus from "@/lib/directus";
import { readItem, withToken } from "@directus/sdk";
import { Loader2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * ============================================
 * VERSIÓN SIMPLIFICADA PARA DEBUG
 * Primero probamos con menos campos para identificar el problema
 * ============================================
 */

export default function Page({ params }) {
  const { faltaId } = params;
  const { session, status } = useCurrentSession();

  const [falta, setFalta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const breadcrumbItems = [
    { title: "Faltas Graves PM", link: "/inicio/faltas-graves-pm" },
    { title: "Editar", link: `/inicio/faltas-graves-pm/${faltaId}` },
  ];

  useEffect(() => {
    if (status === "authenticated" && session?.access_token) {
      async function fetchData() {
        try {
          setLoading(true);
          setError(null);

          console.log("=== DEBUG INFO ===");
          console.log("📍 ID de falta:", faltaId);
          console.log("👤 Usuario:", session?.user?.email);
          console.log("🔑 Token presente:", !!session?.access_token);

          // PASO 1: Probar con campos mínimos primero
          console.log("🔍 PASO 1: Intentando con campos básicos...");

          try {
            const testBasico = await directus.request(
              withToken(
                session.access_token,
                readItem("faltas_graves_personas_morales", faltaId, {
                  fields: ["id", "expediente", "fecha", "status", "observaciones"],
                })
              )
            );

            console.log("✅ PASO 1 EXITOSO - Campos básicos:", testBasico);

            // PASO 2: Probar con una relación simple
            console.log("🔍 PASO 2: Intentando con datosGenerales...");

            const testConRelacion = await directus.request(
              withToken(
                session.access_token,
                readItem("faltas_graves_personas_morales", faltaId, {
                  fields: [
                    "id",
                    "expediente",
                    "fecha",
                    "status",
                    "observaciones",
                    "datosGenerales.id",
                    "datosGenerales.nombreRazonSocial",
                    "datosGenerales.rfc",
                  ],
                })
              )
            );

            console.log("✅ PASO 2 EXITOSO - Con datosGenerales:", testConRelacion);

            // PASO 3: Intentar con todos los campos
            console.log("🔍 PASO 3: Intentando con TODOS los campos...");

            const todosLosCampos = await directus.request(
              withToken(
                session.access_token,
                readItem("faltas_graves_personas_morales", faltaId, {
                  fields: [
                    "*",
                    "datosGenerales.*",
                    "directorGeneral.*",
                    "representanteLegal.*",
                    "dondeCometioFalta.*",
                    "origenProcedimiento.*",
                    "resolucion.*",
                    "faltasCometidas.falta_cometida_id.*",
                    "faltasCometidas.falta_cometida_id.normatividadesInfringidas.normatividad_id.*",
                    "multas.multa_id.*",
                    "multas.multa_id.plazoPago.*",
                    "multas.multa_id.efectivamenteCobrado.*",
                    "inhabilitaciones.inhabilitacion_id.*",
                    "inhabilitaciones.inhabilitacion_id.plazo.*",
                    "suspensionesActividades.suspension_actividades_id.*",
                    "suspensionesActividades.suspension_actividades_id.plazo.*",
                    "disoluciones.disolucion_id.*",
                    "indemnizaciones.indemnizacion_id.*",
                    "indemnizaciones.indemnizacion_id.plazoPago.*",
                    "indemnizaciones.indemnizacion_id.efectivamenteCobrado.*",
                    "otrasSanciones.otra_sancion_id.*",
                  ],
                })
              )
            );

            console.log("✅ PASO 3 EXITOSO - Todos los campos:", todosLosCampos);

            // Transformar datos
            const datosTransformados = transformarDatos(todosLosCampos);

            setDebugInfo({
              pasos: "Todos los pasos exitosos",
              camposBasicos: Object.keys(testBasico),
              relacionesEncontradas: Object.keys(todosLosCampos).filter(k => typeof todosLosCampos[k] === 'object'),
            });

            setFalta(datosTransformados);

          } catch (innerError) {
            console.error("❌ Error en uno de los pasos:", innerError);

            // Mostrar información detallada del error
            setDebugInfo({
              error: innerError.message,
              errors: innerError.errors || [],
              status: innerError.response?.status,
              url: innerError.response?.url,
            });

            throw innerError;
          }

        } catch (err) {
          console.error("❌ Error general:", err);

          let mensajeError = "Error al cargar los datos";

          if (err.message?.includes("403") || err.message?.includes("Forbidden")) {
            mensajeError = "Error de permisos (403 Forbidden). Verifica los permisos en Directus.";
          } else if (err.message?.includes("404")) {
            mensajeError = "Registro no encontrado (404). Verifica que el ID sea correcto.";
          } else if (err.message?.includes("401")) {
            mensajeError = "Sesión expirada (401). Intenta cerrar sesión y volver a iniciar.";
          }

          setError(mensajeError);
        } finally {
          setLoading(false);
        }
      }

      fetchData();
    }
  }, [session, status, faltaId]);

  // Función de transformación simplificada
  function transformarDatos(data) {
    if (!data) return null;

    return {
      // Campos básicos
      expediente: data.expediente || "",
      fecha: data.fecha || "",
      status: data.status || "NO_FIRME",
      observaciones: data.observaciones || "",

      // Datos Generales
      ...(data.datosGenerales && {
        nombreRazonSocial: data.datosGenerales.nombreRazonSocial || "",
        rfc: data.datosGenerales.rfc || "",
        objetoSocial: data.datosGenerales.objetoSocial || "",
        tipoDomicilio: data.datosGenerales.tipoDomicilio || null,
        tipoVialidad: data.datosGenerales.tipoVialidad || null,
        nombreVialidad: data.datosGenerales.nombreVialidad || null,
        numeroExterior: data.datosGenerales.numeroExterior || null,
        numeroInterior: data.datosGenerales.numeroInterior || null,
        coloniaLocalidad: data.datosGenerales.coloniaLocalidad || null,
        municipioAlcaldia: data.datosGenerales.municipioAlcaldia || null,
        codigoPostal: data.datosGenerales.codigoPostal || null,
        entidadFederativa: data.datosGenerales.entidadFederativa || null,
        ciudad: data.datosGenerales.ciudad || null,
        provincia: data.datosGenerales.provincia || null,
        calle: data.datosGenerales.calle || null,
        numeroExteriorExtranjero: data.datosGenerales.numeroExteriorExtranjero || null,
        numeroInteriorExtranjero: data.datosGenerales.numeroInteriorExtranjero || null,
        codigoPostalExtranjero: data.datosGenerales.codigoPostalExtranjero || null,
        pais: data.datosGenerales.pais || null,
      }),

      // Director General
      ...(data.directorGeneral && {
        directorGeneral_nombre: data.directorGeneral.nombre || "",
        directorGeneral_primerApellido: data.directorGeneral.primerApellido || "",
        directorGeneral_segundoApellido: data.directorGeneral.segundoApellido || null,
        directorGeneral_rfc: data.directorGeneral.rfc || null,
        directorGeneral_curp: data.directorGeneral.curp || null,
      }),

      // Representante Legal
      ...(data.representanteLegal && {
        representanteLegal_nombre: data.representanteLegal.nombre || "",
        representanteLegal_primerApellido: data.representanteLegal.primerApellido || "",
        representanteLegal_segundoApellido: data.representanteLegal.segundoApellido || null,
        representanteLegal_rfc: data.representanteLegal.rfc || null,
        representanteLegal_curp: data.representanteLegal.curp || null,
      }),

      // Donde Cometió la Falta
      ...(data.dondeCometioFalta && {
        dondeCometio_entidadFederativa: data.dondeCometioFalta.entidadFederativa || "",
        dondeCometio_nivelOrdenGobierno: data.dondeCometioFalta.nivelOrdenGobierno || "FEDERAL",
        dondeCometio_ambitoPublico: data.dondeCometioFalta.ambitoPublico || null,
        dondeCometio_nombreEntePublico: data.dondeCometioFalta.nombreEntePublico || null,
        dondeCometio_siglasEntePublico: data.dondeCometioFalta.siglasEntePublico || null,
      }),

      // Origen Procedimiento
      ...(data.origenProcedimiento && {
        origenProcedimiento_clave: data.origenProcedimiento.clave || "DE_OFICIO",
        origenProcedimiento_valor: data.origenProcedimiento.valor || null,
      }),

      // Resolución
      ...(data.resolucion && {
        resolucion_tituloResolucion: data.resolucion.tituloResolucion || "",
        resolucion_fechaResolucion: data.resolucion.fechaResolucion || "",
        resolucion_fechaNotificacion: data.resolucion.fechaNotificacion || "",
        resolucion_urlResolucion: data.resolucion.urlResolucion || "",
        resolucion_fechaResolucionFirme: data.resolucion.fechaResolucionFirme || "",
        resolucion_fechaNotificacionFirme: data.resolucion.fechaNotificacionFirme || "",
        resolucion_urlResolucionFirme: data.resolucion.urlResolucionFirme || "",
        resolucion_fechaEjecucion: data.resolucion.fechaEjecucion || null,
        resolucion_ordenJurisdiccional: data.resolucion.ordenJurisdiccional || "FEDERAL",
        resolucion_autoridadResolutora: data.resolucion.autoridadResolutora || "",
        resolucion_autoridadInvestigadora: data.resolucion.autoridadInvestigadora || "",
        resolucion_autoridadSusbstanciadora: data.resolucion.autoridadSusbstanciadora || "",
      }),

      // Faltas Cometidas
      faltasCometidas: transformarFaltasCometidas(data.faltasCometidas),

      // Sanciones
      multas: transformarMultas(data.multas),
      inhabilitaciones: transformarInhabilitaciones(data.inhabilitaciones),
      suspensionesActividades: transformarSuspensiones(data.suspensionesActividades),
      disoluciones: transformarDisoluciones(data.disoluciones),
      indemnizaciones: transformarIndemnizaciones(data.indemnizaciones),
      otrasSanciones: transformarOtrasSanciones(data.otrasSanciones),
    };
  }

  // Helpers de transformación
  function transformarFaltasCometidas(faltasCometidas) {
    if (!faltasCometidas || !Array.isArray(faltasCometidas)) return [];

    return faltasCometidas
      .filter(rel => rel?.falta_cometida_id)
      .map(rel => ({
        clave: rel.falta_cometida_id.clave || "OTRO",
        valor: rel.falta_cometida_id.valor || null,
        descripcionHechos: rel.falta_cometida_id.descripcionHechos || "",
        normatividadInfringida: transformarNormatividades(
          rel.falta_cometida_id.normatividadesInfringidas
        ),
      }));
  }

  function transformarNormatividades(normatividadesRelation) {
    if (!normatividadesRelation || !Array.isArray(normatividadesRelation)) return [];

    return normatividadesRelation
      .filter(rel => rel?.normatividad_id)
      .map(rel => ({
        nombreNormatividad: rel.normatividad_id.nombreNormatividad || "",
        articulo: rel.normatividad_id.articulo || "",
        fraccion: rel.normatividad_id.fraccion || null,
      }));
  }

  function transformarMultas(multas) {
    if (!multas || !Array.isArray(multas)) return [];

    return multas
      .filter(rel => rel?.multa_id)
      .map(rel => ({
        monto: rel.multa_id.monto ?? null,
        moneda: rel.multa_id.moneda || null,
        tipoMoneda: rel.multa_id.tipoMoneda || null,
        plazoPago: rel.multa_id.plazoPago ? {
          anios: rel.multa_id.plazoPago.anios ?? null,
          meses: rel.multa_id.plazoPago.meses ?? null,
          dias: rel.multa_id.plazoPago.dias ?? null,
        } : null,
        efectivamenteCobrado: rel.multa_id.efectivamenteCobrado ? {
          monto: rel.multa_id.efectivamenteCobrado.monto ?? null,
          moneda: rel.multa_id.efectivamenteCobrado.moneda || null,
          tipoMoneda: rel.multa_id.efectivamenteCobrado.tipoMoneda || null,
        } : null,
      }));
  }

  function transformarInhabilitaciones(inhabilitaciones) {
    if (!inhabilitaciones || !Array.isArray(inhabilitaciones)) return [];

    return inhabilitaciones
      .filter(rel => rel?.inhabilitacion_id)
      .map(rel => ({
        plazo: rel.inhabilitacion_id.plazo ? {
          anios: rel.inhabilitacion_id.plazo.anios ?? null,
          meses: rel.inhabilitacion_id.plazo.meses ?? null,
          dias: rel.inhabilitacion_id.plazo.dias ?? null,
        } : null,
        fechaInicialSancion: rel.inhabilitacion_id.fechaInicialSancion || null,
        fechaFinalSancion: rel.inhabilitacion_id.fechaFinalSancion || null,
      }));
  }

  function transformarSuspensiones(suspensiones) {
    if (!suspensiones || !Array.isArray(suspensiones)) return [];

    return suspensiones
      .filter(rel => rel?.suspension_actividades_id)
      .map(rel => ({
        plazo: rel.suspension_actividades_id.plazo ? {
          anios: rel.suspension_actividades_id.plazo.anios ?? null,
          meses: rel.suspension_actividades_id.plazo.meses ?? null,
          dias: rel.suspension_actividades_id.plazo.dias ?? null,
        } : null,
        fechaInicialSancion: rel.suspension_actividades_id.fechaInicialSancion || null,
        fechaFinalSancion: rel.suspension_actividades_id.fechaFinalSancion || null,
      }));
  }

  function transformarDisoluciones(disoluciones) {
    if (!disoluciones || !Array.isArray(disoluciones)) return [];

    return disoluciones
      .filter(rel => rel?.disolucion_id)
      .map(rel => ({
        fechaSancion: rel.disolucion_id.fechaSancion || null,
      }));
  }

  function transformarIndemnizaciones(indemnizaciones) {
    if (!indemnizaciones || !Array.isArray(indemnizaciones)) return [];

    return indemnizaciones
      .filter(rel => rel?.indemnizacion_id)
      .map(rel => ({
        monto: rel.indemnizacion_id.monto ?? null,
        moneda: rel.indemnizacion_id.moneda || null,
        tipoMoneda: rel.indemnizacion_id.tipoMoneda || null,
        plazoPago: rel.indemnizacion_id.plazoPago ? {
          anios: rel.indemnizacion_id.plazoPago.anios ?? null,
          meses: rel.indemnizacion_id.plazoPago.meses ?? null,
          dias: rel.indemnizacion_id.plazoPago.dias ?? null,
        } : null,
        efectivamenteCobrado: rel.indemnizacion_id.efectivamenteCobrado ? {
          monto: rel.indemnizacion_id.efectivamenteCobrado.monto ?? null,
          moneda: rel.indemnizacion_id.efectivamenteCobrado.moneda || null,
          tipoMoneda: rel.indemnizacion_id.efectivamenteCobrado.tipoMoneda || null,
        } : null,
      }));
  }

  function transformarOtrasSanciones(otrasSanciones) {
    if (!otrasSanciones || !Array.isArray(otrasSanciones)) return [];

    return otrasSanciones
      .filter(rel => rel?.otra_sancion_id)
      .map(rel => ({
        descripcion: rel.otra_sancion_id.descripcion || "",
      }));
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />

        {/* Debug Info */}
        {debugInfo && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Información de Debug</AlertTitle>
            <AlertDescription>
              <pre className="text-xs mt-2 p-2 bg-muted rounded overflow-auto max-h-40">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Cargando registro...</p>
              <p className="text-xs text-muted-foreground">
                Probando diferentes niveles de campos
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4 text-center max-w-md">
              <div className="rounded-full bg-destructive/10 p-3">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Error al cargar el registro</h3>
                <p className="text-muted-foreground text-sm mb-4">{error}</p>

                {error.includes("403") && (
                  <Alert variant="destructive" className="text-left">
                    <AlertTitle>Solución para Error 403:</AlertTitle>
                    <AlertDescription className="text-xs space-y-2 mt-2">
                      <p>1. Ve a Directus Admin → Settings → Roles & Permissions</p>
                      <p>2. Selecciona tu rol de usuario</p>
                      <p>3. Asegúrate de tener permiso READ en todas las colecciones:</p>
                      <ul className="list-disc list-inside ml-2 mt-1">
                        <li>faltas_graves_personas_morales</li>
                        <li>datos_generales_personas_morales</li>
                        <li>datos_representante</li>
                        <li>donde_cometio_falta</li>
                        <li>origen_procedimiento</li>
                        <li>resolucion_morales</li>
                        <li>faltas_cometidas (y todas las junction tables)</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </Button>
            </div>
          </div>
        )}

        {/* Formulario */}
        {!loading && !error && falta && (
          <FaltasGravesPMForm initialData={falta} key={faltaId} />
        )}
      </div>
    </ScrollArea>
  );
}