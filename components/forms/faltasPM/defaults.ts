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
  };
}