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
  // 9. RESOLUCIÓN SANCIONATORIA
  // ============================================
  const resolucionData = {
    tituloResolucion: data.resolucion_tituloResolucion,
    fechaResolucion: data.resolucion_fechaResolucion,
    fechaNotificacion: data.resolucion_fechaNotificacion,
    urlResolucion: data.resolucion_urlResolucion,
    fechaResolucionFirme: data.resolucion_fechaResolucionFirme,
    fechaNotificacionFirme: data.resolucion_fechaNotificacionFirme,
    urlResolucionFirme: data.resolucion_urlResolucionFirme,
    fechaEjecucion: data.resolucion_fechaEjecucion,
    ordenJurisdiccional: data.resolucion_ordenJurisdiccional,
    autoridadResolutora: data.resolucion_autoridadResolutora,
    autoridadInvestigadora: data.resolucion_autoridadInvestigadora,
    autoridadSusbstanciadora: data.resolucion_autoridadSusbstanciadora,
    entePublico: data.entePublico,
  };

  let resolucionId;

  if (initialData?.resolucion?.id) {
    await directus.request(
      withToken(
        accessToken,
        updateItem(
          "resolucion_morales",
          initialData.resolucion.id,
          resolucionData
        )
      )
    );
    resolucionId = initialData.resolucion.id;
  } else {
    const newResolucion = await directus.request(
      withToken(
        accessToken,
        createItem("resolucion_morales", resolucionData)
      )
    );
    resolucionId = newResolucion.id;
  }

  // ============================================
  // 10. REGISTRO PRINCIPAL
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
    resolucion: resolucionId,
  };

  let registroPrincipalId;

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
    registroPrincipalId = initialData.id;
  } else {
    const newRegistro = await directus.request(
      withToken(
        accessToken,
        createItem("faltas_graves_personas_morales", mainData)
      )
    );
    registroPrincipalId = newRegistro.id;
  }

  // ============================================
  // 11. FALTA COMETIDA (O2M con normatividades anidadas)
  // ============================================
  // Guardamos cada falta con sus normatividades
  for (const falta of data.faltaCometida) {
    // Primero guardamos todas las normatividades de esta falta
    const normatividadesIds: number[] = [];
    
    for (const normatividad of falta.normatividadInfringida) {
      const normatividadData = {
        nombreNormatividad: normatividad.nombreNormatividad,
        articulo: normatividad.articulo,
        fraccion: normatividad.fraccion,
        entePublico: data.entePublico,
      };

      const newNormatividad = await directus.request(
        withToken(
          accessToken,
          createItem("normatividad_morales", normatividadData)
        )
      );
      normatividadesIds.push(newNormatividad.id);
    }

    // Ahora guardamos la falta con las referencias a normatividades
    const faltaData = {
      clave: falta.clave,
      valor: falta.clave === "OTRO" ? falta.valor : null,
      descripcionHechos: falta.descripcionHechos,
      fk_morales: registroPrincipalId,
      entePublico: data.entePublico,
      normatividadInfringida: normatividadesIds,
    };

    await directus.request(
      withToken(
        accessToken,
        createItem("falta_cometida_morales", faltaData)
      )
    );
  }

  // ============================================
  // 12. TIPO DE SANCIÓN (O2M complejo con estructuras condicionales)
  // ============================================
  for (const sancion of data.tipoSancion) {
    let sancionEspecificaId = null;

    // Guardar según el tipo de sanción
    switch (sancion.clave) {
      case "INHABILITACION":
        if (sancion.inhabilitacion) {
          const inhabilitacionData = {
            plazoAnios: sancion.inhabilitacion.plazoAnios,
            plazoMeses: sancion.inhabilitacion.plazoMeses,
            plazoDias: sancion.inhabilitacion.plazoDias,
            fechaInicial: sancion.inhabilitacion.fechaInicial,
            fechaFinal: sancion.inhabilitacion.fechaFinal,
            entePublico: data.entePublico,
          };
          const newInhabilitacion = await directus.request(
            withToken(accessToken, createItem("inhabilitacion", inhabilitacionData))
          );
          sancionEspecificaId = newInhabilitacion.id;
        }
        break;

      case "INDEMNIZACION":
        if (sancion.indemnizacion) {
          // Guardar plazoPago si existe
          let plazoPagoId = null;
          if (sancion.indemnizacion.plazoPago) {
            const plazoPagoData = {
              anios: sancion.indemnizacion.plazoPago.anios,
              meses: sancion.indemnizacion.plazoPago.meses,
              dias: sancion.indemnizacion.plazoPago.dias,
              entePublico: data.entePublico,
            };
            const newPlazoPago = await directus.request(
              withToken(accessToken, createItem("plazo_pago_indemnizacion", plazoPagoData))
            );
            plazoPagoId = newPlazoPago.id;
          }

          // Guardar efectivamenteCobrado si existe
          let efectivamenteCobradoId = null;
          if (sancion.indemnizacion.efectivamenteCobrado) {
            const cobradoData = {
              monto: sancion.indemnizacion.efectivamenteCobrado.monto,
              moneda: sancion.indemnizacion.efectivamenteCobrado.moneda,
              fechaCobro: sancion.indemnizacion.efectivamenteCobrado.fechaCobro,
              entePublico: data.entePublico,
            };
            const newCobrado = await directus.request(
              withToken(accessToken, createItem("efectivamente_cobrado_indemnizacion", cobradoData))
            );
            efectivamenteCobradoId = newCobrado.id;
          }

          // Guardar indemnización
          const indemnizacionData = {
            monto: sancion.indemnizacion.monto,
            moneda: sancion.indemnizacion.moneda,
            fechaPagoTotal: sancion.indemnizacion.fechaPagoTotal,
            plazoPago: plazoPagoId,
            efectivamenteCobrado: efectivamenteCobradoId,
            entePublico: data.entePublico,
          };
          const newIndemnizacion = await directus.request(
            withToken(accessToken, createItem("indemnizacion", indemnizacionData))
          );
          sancionEspecificaId = newIndemnizacion.id;
        }
        break;

      case "SANCION_ECONOMICA":
        if (sancion.sancionEconomica) {
          // Guardar plazoPago si existe
          let plazoPagoSEId = null;
          if (sancion.sancionEconomica.plazoPago) {
            const plazoPagoSEData = {
              anios: sancion.sancionEconomica.plazoPago.anios,
              meses: sancion.sancionEconomica.plazoPago.meses,
              dias: sancion.sancionEconomica.plazoPago.dias,
              entePublico: data.entePublico,
            };
            const newPlazoPagoSE = await directus.request(
              withToken(accessToken, createItem("plazo_pago", plazoPagoSEData))
            );
            plazoPagoSEId = newPlazoPagoSE.id;
          }

          // Guardar efectivamenteCobrado si existe
          let efectivamenteCobradoSEId = null;
          if (sancion.sancionEconomica.efectivamenteCobrado) {
            const cobradoSEData = {
              monto: sancion.sancionEconomica.efectivamenteCobrado.monto,
              moneda: sancion.sancionEconomica.efectivamenteCobrado.moneda,
              fechaCobro: sancion.sancionEconomica.efectivamenteCobrado.fechaCobro,
              entePublico: data.entePublico,
            };
            const newCobradoSE = await directus.request(
              withToken(accessToken, createItem("efectivamente_cobrado", cobradoSEData))
            );
            efectivamenteCobradoSEId = newCobradoSE.id;
          }

          // Guardar sanción económica
          const sancionEconomicaData = {
            monto: sancion.sancionEconomica.monto,
            moneda: sancion.sancionEconomica.moneda,
            fechaPagoTotal: sancion.sancionEconomica.fechaPagoTotal,
            plazoPago: plazoPagoSEId,
            efectivamenteCobrado: efectivamenteCobradoSEId,
            entePublico: data.entePublico,
          };
          const newSancionEconomica = await directus.request(
            withToken(accessToken, createItem("sancion_economica", sancionEconomicaData))
          );
          sancionEspecificaId = newSancionEconomica.id;
        }
        break;

      case "SUSPENSION_ACTIVIDADES":
        if (sancion.suspensionActividades) {
          const suspensionData = {
            plazoSuspensionAnios: sancion.suspensionActividades.plazoSuspensionAnios,
            plazoSuspensionMeses: sancion.suspensionActividades.plazoSuspensionMeses,
            plazoSuspensionDias: sancion.suspensionActividades.plazoSuspensionDias,
            fechaInicial: sancion.suspensionActividades.fechaInicial,
            fechaFinal: sancion.suspensionActividades.fechaFinal,
            entePublico: data.entePublico,
          };
          const newSuspension = await directus.request(
            withToken(accessToken, createItem("suspension_actividades", suspensionData))
          );
          sancionEspecificaId = newSuspension.id;
        }
        break;

      case "DISOLUCION_SOCIEDAD":
        if (sancion.disolucionSociedad) {
          const disolucionData = {
            fechaDisolucion: sancion.disolucionSociedad.fechaDisolucion,
            entePublico: data.entePublico,
          };
          const newDisolucion = await directus.request(
            withToken(accessToken, createItem("disolucion_sociedad", disolucionData))
          );
          sancionEspecificaId = newDisolucion.id;
        }
        break;

      case "OTRO":
        if (sancion.otro) {
          const otroData = {
            denominacionSancion: sancion.otro.denominacionSancion,
            entePublico: data.entePublico,
          };
          const newOtro = await directus.request(
            withToken(accessToken, createItem("otro_sancion", otroData))
          );
          sancionEspecificaId = newOtro.id;
        }
        break;
    }

    // Guardar el registro tipo_sancion con la referencia correspondiente
    const tipoSancionData: any = {
      clave: sancion.clave,
      fk_id: registroPrincipalId,
      entePublico: data.entePublico, // ✅ AGREGADO
    };

    // Asignar el ID correspondiente según la clave
    if (sancion.clave === "INHABILITACION") tipoSancionData.inhabilitacion = sancionEspecificaId;
    else if (sancion.clave === "INDEMNIZACION") tipoSancionData.indemnizacion = sancionEspecificaId;
    else if (sancion.clave === "SANCION_ECONOMICA") tipoSancionData.sancionEconomica = sancionEspecificaId;
    else if (sancion.clave === "SUSPENSION_ACTIVIDADES") tipoSancionData.suspensionActividades = sancionEspecificaId;
    else if (sancion.clave === "DISOLUCION_SOCIEDAD") tipoSancionData.disolucionSociedad = sancionEspecificaId;
    else if (sancion.clave === "OTRO") tipoSancionData.otro = sancionEspecificaId;

    await directus.request(
      withToken(accessToken, createItem("tipo_sancion_personas_morales", tipoSancionData))
    );
  }

  return { success: true };
}