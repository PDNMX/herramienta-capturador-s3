// @ts-nocheck
import type { FaltasGravesPMFormValues } from "./schema";

/**
 * Genera los valores por defecto para el formulario de Faltas Graves PM
 * @param initialData - Datos iniciales si se está editando un registro
 * @param entePublico - ID del ente público del usuario logueado
 * @returns Objeto con todos los valores por defecto del formulario
 */
export function getFaltasGravesPMDefaults(
  initialData: any | null,
  entePublico?: string
): Partial<FaltasGravesPMFormValues> {
  return {
    // Campos principales
    entePublico: initialData?.entePublico ?? entePublico ?? "",
    status: initialData?.status ?? "NO_FIRME",
    fecha: initialData?.fecha ?? new Date().toISOString().split("T")[0],
    expediente: initialData?.expediente ?? "",
    observaciones: initialData?.observaciones ?? "",

    // Datos Generales
    nombreRazonSocial: initialData?.datosGenerales?.nombreRazonSocial ?? "",
    rfc: initialData?.datosGenerales?.rfc ?? "",
    objetoSocial: initialData?.datosGenerales?.objetoSocial ?? "",
    tipoDomicilio: initialData?.datosGenerales?.tipoDomicilio ?? null,

    // Domicilio México
    tipoVialidad: initialData?.datosGenerales?.domicilioMexico?.tipoVialidad ?? null,
    nombreVialidad: initialData?.datosGenerales?.domicilioMexico?.nombreVialidad ?? null,
    numeroExterior: initialData?.datosGenerales?.domicilioMexico?.numeroExterior ?? null,
    numeroInterior: initialData?.datosGenerales?.domicilioMexico?.numeroInterior ?? null,
    coloniaLocalidad: initialData?.datosGenerales?.domicilioMexico?.coloniaLocalidad ?? null,
    municipioAlcaldia: initialData?.datosGenerales?.domicilioMexico?.municipioAlcaldia ?? null,
    codigoPostal: initialData?.datosGenerales?.domicilioMexico?.codigoPostal ?? null,
    entidadFederativa: initialData?.datosGenerales?.domicilioMexico?.entidadFederativa ?? null,

    // Domicilio Extranjero
    ciudad: initialData?.datosGenerales?.domicilioExtranjero?.ciudad ?? null,
    provincia: initialData?.datosGenerales?.domicilioExtranjero?.provincia ?? null,
    calle: initialData?.datosGenerales?.domicilioExtranjero?.calle ?? null,
    numeroExteriorExtranjero: initialData?.datosGenerales?.domicilioExtranjero?.numeroExterior ?? null,
    numeroInteriorExtranjero: initialData?.datosGenerales?.domicilioExtranjero?.numeroInterior ?? null,
    codigoPostalExtranjero: initialData?.datosGenerales?.domicilioExtranjero?.codigoPostal ?? null,
    pais: initialData?.datosGenerales?.domicilioExtranjero?.pais ?? null,

    // Director General
    directorGeneral: {
      nombre: initialData?.datosDirGeneralReprLegal?.directorGeneral?.nombre ?? "",
      primerApellido: initialData?.datosDirGeneralReprLegal?.directorGeneral?.primerApellido ?? "",
      segundoApellido: initialData?.datosDirGeneralReprLegal?.directorGeneral?.segundoApellido ?? null,
      rfc: initialData?.datosDirGeneralReprLegal?.directorGeneral?.rfc ?? null,
      curp: initialData?.datosDirGeneralReprLegal?.directorGeneral?.curp ?? null,
    },

    // Representante Legal
    representanteLegal: {
      nombre: initialData?.datosDirGeneralReprLegal?.representanteLegal?.nombre ?? "",
      primerApellido: initialData?.datosDirGeneralReprLegal?.representanteLegal?.primerApellido ?? "",
      segundoApellido: initialData?.datosDirGeneralReprLegal?.representanteLegal?.segundoApellido ?? null,
      rfc: initialData?.datosDirGeneralReprLegal?.representanteLegal?.rfc ?? null,
      curp: initialData?.datosDirGeneralReprLegal?.representanteLegal?.curp ?? null,
    },

    // Donde cometió la falta
    dondeCometio_entidadFederativa: initialData?.dondeCometioLaFalta?.entidadFederativa ?? "",
    dondeCometio_nivelOrdenGobierno: initialData?.dondeCometioLaFalta?.nivelOrdenGobierno ?? "FEDERAL",
    dondeCometio_ambitoPublico: initialData?.dondeCometioLaFalta?.ambitoPublico ?? null,
    dondeCometio_nombreEntePublico: initialData?.dondeCometioLaFalta?.nombreEntePublico ?? null,
    dondeCometio_siglasEntePublico: initialData?.dondeCometioLaFalta?.siglasEntePublico ?? "",

    // Origen del procedimiento
    origenProcedimiento_clave: initialData?.origenProcedimiento?.clave ?? "DENUNCIA",
    origenProcedimiento_valor: initialData?.origenProcedimiento?.valor ?? null,

    // Punto 7: Falta Cometida (O2M con normatividades anidadas)
    faltaCometida: initialData?.faltaCometida?.map((falta: any) => ({
      clave: falta.clave ?? "",
      valor: falta.valor ?? null,
      descripcionHechos: falta.descripcionHechos ?? "",
      normatividadInfringida: falta.normatividadInfringida?.map((norm: any) => ({
        nombreNormatividad: norm.nombreNormatividad ?? "",
        articulo: norm.articulo ?? "",
        fraccion: norm.fraccion ?? null,
      })) ?? [{
        nombreNormatividad: "",
        articulo: "",
        fraccion: null,
      }],
    })) ?? [{
      clave: "",
      valor: null,
      descripcionHechos: "",
      normatividadInfringida: [{
        nombreNormatividad: "",
        articulo: "",
        fraccion: null,
      }],
    }],

    // Punto 8: Resolución Sancionatoria
    resolucion_tituloResolucion: initialData?.resolucion?.tituloResolucion ?? "",
    resolucion_fechaResolucion: initialData?.resolucion?.fechaResolucion ?? "",
    resolucion_fechaNotificacion: initialData?.resolucion?.fechaNotificacion ?? "",
    resolucion_urlResolucion: initialData?.resolucion?.urlResolucion ?? "",
    resolucion_fechaResolucionFirme: initialData?.resolucion?.fechaResolucionFirme ?? "",
    resolucion_fechaNotificacionFirme: initialData?.resolucion?.fechaNotificacionFirme ?? "",
    resolucion_urlResolucionFirme: initialData?.resolucion?.urlResolucionFirme ?? "",
    resolucion_fechaEjecucion: initialData?.resolucion?.fechaEjecucion ?? null,
    resolucion_ordenJurisdiccional: initialData?.resolucion?.ordenJurisdiccional ?? "FEDERAL",
    resolucion_autoridadResolutora: initialData?.resolucion?.autoridadResolutora ?? "",
    resolucion_autoridadInvestigadora: initialData?.resolucion?.autoridadInvestigadora ?? "",
    resolucion_autoridadSustanciadora: initialData?.resolucion?.autoridadSustanciadora ?? "",

    // Punto 9: Tipo de Sanción (O2M)
    tipoSancion: initialData?.tipoSancion?.map((sancion: any) => ({
      clave: sancion.clave ?? "",
      inhabilitacion: sancion.inhabilitacion ? {
        plazoAnios: sancion.inhabilitacion.plazoAnios ?? 0,
        plazoMeses: sancion.inhabilitacion.plazoMeses ?? 0,
        plazoDias: sancion.inhabilitacion.plazoDias ?? 0,
        fechaInicial: sancion.inhabilitacion.fechaInicial ?? "",
        fechaFinal: sancion.inhabilitacion.fechaFinal ?? "",
      } : null,
      indemnizacion: sancion.indemnizacion ? {
        monto: sancion.indemnizacion.monto ?? 0,
        moneda: sancion.indemnizacion.moneda ?? "MXN",
        fechaPagoTotal: sancion.indemnizacion.fechaPagoTotal ?? null,
        plazoPago: sancion.indemnizacion.plazoPago ? {
          anios: sancion.indemnizacion.plazoPago.anios ?? 0,
          meses: sancion.indemnizacion.plazoPago.meses ?? 0,
          dias: sancion.indemnizacion.plazoPago.dias ?? 0,
        } : null,
        efectivamenteCobrado: sancion.indemnizacion.efectivamenteCobrado ? {
          monto: sancion.indemnizacion.efectivamenteCobrado.monto ?? 0,
          moneda: sancion.indemnizacion.efectivamenteCobrado.moneda ?? "MXN",
          fechaCobro: sancion.indemnizacion.efectivamenteCobrado.fechaCobro ?? "",
        } : null,
      } : null,
      sancionEconomica: sancion.sancionEconomica ? {
        monto: sancion.sancionEconomica.monto ?? 0,
        moneda: sancion.sancionEconomica.moneda ?? "MXN",
        fechaPagoTotal: sancion.sancionEconomica.fechaPagoTotal ?? null,
        plazoPago: sancion.sancionEconomica.plazoPago ? {
          anios: sancion.sancionEconomica.plazoPago.anios ?? 0,
          meses: sancion.sancionEconomica.plazoPago.meses ?? 0,
          dias: sancion.sancionEconomica.plazoPago.dias ?? 0,
        } : null,
        efectivamenteCobrado: sancion.sancionEconomica.efectivamenteCobrado ? {
          monto: sancion.sancionEconomica.efectivamenteCobrado.monto ?? 0,
          moneda: sancion.sancionEconomica.efectivamenteCobrado.moneda ?? "MXN",
          fechaCobro: sancion.sancionEconomica.efectivamenteCobrado.fechaCobro ?? "",
        } : null,
      } : null,
      suspensionActividades: sancion.suspensionActividades ? {
        plazoSuspensionAnios: sancion.suspensionActividades.plazoSuspensionAnios ?? 0,
        plazoSuspensionMeses: sancion.suspensionActividades.plazoSuspensionMeses ?? 0,
        plazoSuspensionDias: sancion.suspensionActividades.plazoSuspensionDias ?? 0,
        fechaInicial: sancion.suspensionActividades.fechaInicial ?? "",
        fechaFinal: sancion.suspensionActividades.fechaFinal ?? "",
      } : null,
      disolucionSociedad: sancion.disolucionSociedad ? {
        fechaDisolucion: sancion.disolucionSociedad.fechaDisolucion ?? "",
      } : null,
      otro: sancion.otro ? {
        denominacionSancion: sancion.otro.denominacionSancion ?? "",
      } : null,
    })) ?? [{
      clave: "",
      inhabilitacion: null,
      indemnizacion: null,
      sancionEconomica: null,
      suspensionActividades: null,
      disolucionSociedad: null,
      otro: null,
    }],
  };
}