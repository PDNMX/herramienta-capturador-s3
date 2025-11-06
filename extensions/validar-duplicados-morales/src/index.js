// export default ({ filter }, { services, getSchema }) => {
//   console.log("✅ Registrando hook validar-duplicados-morales");

//   // Se ejecuta para todos los updates; filtramos por colección usando meta.collection
//   filter('items.update', async (data, meta, context) => {
//     if (meta.collection !== 'faltas_graves_personas_morales') return data;

//     console.log('🟡 Hook ejecutado para colección:', meta.collection);
//     return validarDuplicados(data, meta, context, services, getSchema);
//   });

//   // También lo registramos para los creates
//   filter('items.create', async (data, meta, context) => {
//     if (meta.collection !== 'faltas_graves_personas_morales') return data;

//     console.log('🟡 Hook ejecutado para colección:', meta.collection);
//     return validarDuplicados(data, meta, context, services, getSchema);
//   });
// };

// async function validarDuplicados(data, meta, context, services, getSchema) {
//   console.log('🔍 Validando duplicados con data (parcial):', JSON.stringify(data, null, 2));
//   console.log('--- META ---', meta);

//   const { ItemsService } = services;
//   const schema = await getSchema();
//   const accountability = context?.accountability;

//   // payload: los cambios que vienen (puede ser solo { status: 'FIRME' })
//   let payload = data?.$trigger?.payload || data || {};

//   // Si no tenemos expediente o datosGenerales en el payload,
//   // intentamos recuperar el registro completo usando meta.keys[0]
//   if ((!payload.expediente || !payload.datosGenerales) && meta?.keys?.[0]) {
//     try {
//       const itemsService = new ItemsService('faltas_graves_personas_morales', { schema, accountability });
//       const full = await itemsService.readOne(meta.keys[0]);
//       // combinamos: los cambios (payload) sobrescriben el full cuando existan
//       payload = { ...full, ...payload };
//       console.log('ℹ️ Se obtuvo registro completo para validar:', { id: meta.keys[0], payload });
//     } catch (e) {
//       console.warn('⚠️ No se pudo leer el registro completo:', e.message);
//       // si falla leer el registro completo, devolvemos data para no bloquear por error técnico
//       return data;
//     }
//   }

//   const expediente = payload?.expediente;
//   const datosGeneralesId = payload?.datosGenerales;

//   if (!expediente || !datosGeneralesId) {
//     console.log('⚠️ Faltan expediente o datosGenerales en payload final, no validamos duplicados.');
//     return data;
//   }

//   // obtener services/ItemsService ya con schema y accountability
//   const datosGeneralesService = new ItemsService('datos_generales_personas_morales', {
//     schema,
//     accountability,
//   });

//   let datosGenerales;
//   try {
//     datosGenerales = await datosGeneralesService.readOne(datosGeneralesId);
//   } catch (e) {
//     console.warn('⚠️ No se pudo obtener datos_generales:', e.message);
//     return data;
//   }

//   const rfc = datosGenerales?.rfc;
//   if (!rfc) {
//     console.log('⚠️ RFC no encontrado en datos_generales; no validamos.');
//     return data;
//   }

//   const faltasService = new ItemsService('faltas_graves_personas_morales', {
//     schema,
//     accountability,
//   });

//   const filtros = {
//     _and: [
//       { expediente: { _eq: expediente } },
//       { datosGenerales: { rfc: { _eq: rfc } } },
//     ],
//   };

//   // Excluir el mismo id si es update
//   const currentId = meta?.keys?.[0] || payload.id;
//   if (currentId) filtros._and.push({ id: { _neq: currentId } });

//   const duplicados = await faltasService.readByQuery({ filter: filtros, limit: 1 });

//   if (duplicados?.length > 0) {
//     console.log('❌ Duplicado detectado:', duplicados);
//     throw new Error(`Ya existe un registro de sanción para este RFC (${rfc}) y expediente (${expediente})`);
//   }

//   console.log('✅ Sin duplicados detectados');
//   return data;
// }
export default ({ filter }) => {
  console.log("✅ Registrando hook validar-duplicados-morales");

	filter('faltas_graves_personas_morales.items.update', async (data, meta, context) => {
		console.log('😊 Entro aqui con el el nombre especifico ');
	});

  filter('items.update', async (data, meta, context) => {
    if (meta.collection !== 'faltas_graves_personas_morales') return data;
    console.log('🟡 Hook ejecutado para colección:', meta.collection);
    await validarDuplicados(data, meta, context);
    return data;
  });

  filter('items.create', async (data, meta, context) => {
    if (meta.collection !== 'faltas_graves_personas_morales') return data;
    console.log('🟡 Hook ejecutado para colección:', meta.collection);
    await validarDuplicados(data, meta, context);
    return data;
  });
};

async function validarDuplicados(data, meta, context) {
  console.log('🔍 Validando duplicados...');
  const { database } = context;
  const id = meta.keys?.[0];

  // 1️⃣ Leer el registro completo
  const registro = await database
    .select('*')
    .from('faltas_graves_personas_morales')
    .where({ id })
    .first();

  if (!registro) {
    console.warn('⚠️ No se encontró el registro completo');
    return;
  }

  const expediente = registro.expediente;
  const datosGeneralesId = registro.datosGenerales;

  if (!expediente || !datosGeneralesId) {
    console.log('⚠️ Faltan expediente o datosGenerales');
    return;
  }

  // 2️⃣ Leer el RFC desde la tabla relacionada
  const datosGenerales = await database
    .select('rfc')
    .from('datos_generales_personas_morales')
    .where({ id: datosGeneralesId })
    .first();

  const rfc = datosGenerales?.rfc;
  if (!rfc) {
    console.log('⚠️ RFC no encontrado');
    return;
  }

  console.log(`🔎 Buscando duplicados para RFC ${rfc} y expediente ${expediente}...`);

  // 3️⃣ Obtener los IDs de datosGenerales con el mismo RFC
  const idsRelacionados = await database
    .select('id')
    .from('datos_generales_personas_morales')
    .where({ rfc });

  const ids = idsRelacionados.map((r) => r.id);

  // 4️⃣ Buscar duplicados en la colección principal
  const duplicado = await database
    .select('id', 'expediente')
    .from('faltas_graves_personas_morales')
    .whereIn('datosGenerales', ids)
    .where({ expediente })
    .whereNot({ id })
    .first();

  if (duplicado) {
    console.log('❌ Duplicado detectado:', duplicado);
    throw new Error(`Ya existe un registro de sanción para este RFC (${rfc}) y expediente (${expediente})`);
  }

  console.log('✅ Sin duplicados detectados');
}
