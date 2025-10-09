// @ts-nocheck
import directus from "@/lib/directus";
import { createItem, updateItem, withToken } from "@directus/sdk";
import type { FaltasGravesPMFormValues } from "./schema";

/**
 * Guarda o actualiza un registro de Falta Grave Persona Moral
 * Maneja todas las relaciones M2O en cascada
 * @param data - Datos del formulario
 * @param initialData - Datos iniciales (null si es nuevo registro)
 * @param accessToken - Token de acceso del usuario
 * @returns Promise con el resultado de la operación
 */
export async function saveFaltaGravePM(
  data: FaltasGravesPMFormValues,
  initialData: any | null,
  accessToken: string
) {
  // ============================================
  // 1. DOMICILIO MÉXICO
  // ============================================
  let domicilioMexicoId = null;

  if (data.tipoDomicilio === "DOMICILIO_MEXICO") {
    const domicilioMexicoData = {
      tipoVialidad: data.tipoVialidad,
      nombreVialidad: data.nombreVialidad,
      numeroExterior: data.numeroExterior,
      numeroInterior: data.numeroInterior,
      coloniaLocalidad: data.coloniaLocalidad,
      municipioAlcaldia: data.municipioAlcaldia,
      codigoPostal: data.codigoPostal,
      entidadFederativa: data.entidadFederativa,
      entePublico: data.entePublico,
    };

    if (initialData?.datosGenerales?.domicilioMexico?.id) {
      await directus.request(
        withToken(
          accessToken,
          updateItem(
            "domicilio_mexico_morales",
            initialData.datosGenerales.domicilioMexico.id,
            domicilioMexicoData
          )
        )
      );
      domicilioMexicoId = initialData.datosGenerales.domicilioMexico.id;
    } else {
      const newDomicilioMexico = await directus.request(
        withToken(
          accessToken,
          createItem("domicilio_mexico_morales", domicilioMexicoData)
        )
      );
      domicilioMexicoId = newDomicilioMexico.id;
    }
  }

  // ============================================
  // 2. DOMICILIO EXTRANJERO
  // ============================================
  let domicilioExtranjeroId = null;

  if (data.tipoDomicilio === "DOMICILIO_EXTRANJERO") {
    const domicilioExtranjeroData = {
      ciudad: data.ciudad,
      provincia: data.provincia,
      calle: data.calle,
      numeroExterior: data.numeroExteriorExtranjero,
      numeroInterior: data.numeroInteriorExtranjero,
      codigoPostal: data.codigoPostalExtranjero,
      pais: data.pais,
      entePublico: data.entePublico,
    };

    if (initialData?.datosGenerales?.domicilioExtranjero?.id) {
      await directus.request(
        withToken(
          accessToken,
          updateItem(
            "domicilio_extranjero_morales",
            initialData.datosGenerales.domicilioExtranjero.id,
            domicilioExtranjeroData
          )
        )
      );
      domicilioExtranjeroId = initialData.datosGenerales.domicilioExtranjero.id;
    } else {
      const newDomicilioExtranjero = await directus.request(
        withToken(
          accessToken,
          createItem("domicilio_extranjero_morales", domicilioExtranjeroData)
        )
      );
      domicilioExtranjeroId = newDomicilioExtranjero.id;
    }
  }

  // ============================================
  // 3. DATOS GENERALES
  // ============================================
  const datosGeneralesData = {
    nombreRazonSocial: data.nombreRazonSocial,
    rfc: data.rfc,
    objetoSocial: data.objetoSocial,
    tipoDomicilio: data.tipoDomicilio,
    domicilioMexico: domicilioMexicoId,
    domicilioExtranjero: domicilioExtranjeroId,
    entePublico: data.entePublico,
  };

  let datosGeneralesId;

  if (initialData?.datosGenerales?.id) {
    await directus.request(
      withToken(
        accessToken,
        updateItem(
          "datos_generales_personas_morales",
          initialData.datosGenerales.id,
          datosGeneralesData
        )
      )
    );
    datosGeneralesId = initialData.datosGenerales.id;
  } else {
    const newDatosGenerales = await directus.request(
      withToken(
        accessToken,
        createItem("datos_generales_personas_morales", datosGeneralesData)
      )
    );
    datosGeneralesId = newDatosGenerales.id;
  }

  // ============================================
  // 4. DIRECTOR GENERAL
  // ============================================
  const directorGeneralData = {
    nombre: data.directorGeneral.nombre,
    primerApellido: data.directorGeneral.primerApellido,
    segundoApellido: data.directorGeneral.segundoApellido,
    rfc: data.directorGeneral.rfc,
    curp: data.directorGeneral.curp,
    entePublico: data.entePublico,
  };

  let directorGeneralId;

  if (initialData?.datosDirGeneralReprLegal?.directorGeneral?.id) {
    await directus.request(
      withToken(
        accessToken,
        updateItem(
          "datos_representante",
          initialData.datosDirGeneralReprLegal.directorGeneral.id,
          directorGeneralData
        )
      )
    );
    directorGeneralId = initialData.datosDirGeneralReprLegal.directorGeneral.id;
  } else {
    const newDirectorGeneral = await directus.request(
      withToken(
        accessToken,
        createItem("datos_representante", directorGeneralData)
      )
    );
    directorGeneralId = newDirectorGeneral.id;
  }

  // ============================================
  // 5. REPRESENTANTE LEGAL
  // ============================================
  const representanteLegalData = {
    nombre: data.representanteLegal.nombre,
    primerApellido: data.representanteLegal.primerApellido,
    segundoApellido: data.representanteLegal.segundoApellido,
    rfc: data.representanteLegal.rfc,
    curp: data.representanteLegal.curp,
    entePublico: data.entePublico,
  };

  let representanteLegalId;

  if (initialData?.datosDirGeneralReprLegal?.representanteLegal?.id) {
    await directus.request(
      withToken(
        accessToken,
        updateItem(
          "datos_representante",
          initialData.datosDirGeneralReprLegal.representanteLegal.id,
          representanteLegalData
        )
      )
    );
    representanteLegalId = initialData.datosDirGeneralReprLegal.representanteLegal.id;
  } else {
    const newRepresentanteLegal = await directus.request(
      withToken(
        accessToken,
        createItem("datos_representante", representanteLegalData)
      )
    );
    representanteLegalId = newRepresentanteLegal.id;
  }

  // ============================================
  // 6. DATOS DG Y REPRESENTANTE LEGAL (WRAPPER)
  // ============================================
  const datosDgRpData = {
    directorGeneral: directorGeneralId,
    representanteLegal: representanteLegalId,
    entePublico: data.entePublico,
  };

  let datosDgRpId;

  if (initialData?.datosDirGeneralReprLegal?.id) {
    await directus.request(
      withToken(
        accessToken,
        updateItem(
          "datos_dg_rp",
          initialData.datosDirGeneralReprLegal.id,
          datosDgRpData
        )
      )
    );
    datosDgRpId = initialData.datosDirGeneralReprLegal.id;
  } else {
    const newDatosDgRp = await directus.request(
      withToken(
        accessToken,
        createItem("datos_dg_rp", datosDgRpData)
      )
    );
    datosDgRpId = newDatosDgRp.id;
  }

  // ============================================
  // 7. DONDE COMETIÓ LA FALTA
  // ============================================
  const dondeCometioFaltaData = {
    entidadFederativa: data.dondeCometio_entidadFederativa,
    nivelOrdenGobierno: data.dondeCometio_nivelOrdenGobierno,
    ambitoPublico: data.dondeCometio_ambitoPublico,
    nombreEntePublico: data.dondeCometio_nombreEntePublico,
    siglasEntePublico: data.dondeCometio_siglasEntePublico,
    entePublico: data.entePublico,
  };

  let dondeCometioFaltaId;

  if (initialData?.dondeCometioLaFalta?.id) {
    await directus.request(
      withToken(
        accessToken,
        updateItem(
          "donde_cometio_falta",
          initialData.dondeCometioLaFalta.id,
          dondeCometioFaltaData
        )
      )
    );
    dondeCometioFaltaId = initialData.dondeCometioLaFalta.id;
  } else {
    const newDondeCometioFalta = await directus.request(
      withToken(
        accessToken,
        createItem("donde_cometio_falta", dondeCometioFaltaData)
      )
    );
    dondeCometioFaltaId = newDondeCometioFalta.id;
  }

  // ============================================
  // 8. ORIGEN DEL PROCEDIMIENTO
  // ============================================
  const origenProcedimientoData = {
    clave: data.origenProcedimiento_clave,
    valor: data.origenProcedimiento_clave === "OTRO" ? data.origenProcedimiento_valor : null,
    entePublico: data.entePublico,
  };

  let origenProcedimientoId;

  if (initialData?.origenProcedimiento?.id) {
    await directus.request(
      withToken(
        accessToken,
        updateItem(
          "origen_procedimiento",
          initialData.origenProcedimiento.id,
          origenProcedimientoData
        )
      )
    );
    origenProcedimientoId = initialData.origenProcedimiento.id;
  } else {
    const newOrigenProcedimiento = await directus.request(
      withToken(
        accessToken,
        createItem("origen_procedimiento", origenProcedimientoData)
      )
    );
    origenProcedimientoId = newOrigenProcedimiento.id;
  }

  // ============================================
  // 9. REGISTRO PRINCIPAL
  // ============================================
  const mainData = {
    entePublico: data.entePublico,
    status: data.status,
    fecha: data.fecha,
    expediente: data.expediente,
    observaciones: data.observaciones,
    datosGenerales: datosGeneralesId,
    datosDirGeneralReprLegal: datosDgRpId,
    dondeCometioLaFalta: dondeCometioFaltaId,
    origenProcedimiento: origenProcedimientoId,
  };

  if (initialData) {
    await directus.request(
      withToken(
        accessToken,
        updateItem(
          "faltas_graves_personas_morales",
          initialData.id,
          mainData
        )
      )
    );
  } else {
    await directus.request(
      withToken(
        accessToken,
        createItem("faltas_graves_personas_morales", mainData)
      )
    );
  }

  return { success: true };
}