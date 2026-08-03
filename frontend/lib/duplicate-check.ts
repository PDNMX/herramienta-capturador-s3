import directus from "@/lib/directus";
import { readItems, withToken } from "@directus/sdk";

interface DuplicateResult {
  isDuplicate: boolean;
  existingId?: string;
}

/**
 * Verifica si ya existe un registro con la misma persona (CURP + RFC) y mismo expediente.
 * Solo aplica al crear registros nuevos; en edición se excluye el propio registro.
 *
 * @param collection  Nombre de la colección principal (ej. "faltas_administrativas_graves")
 * @param expediente  Número de expediente a verificar
 * @param rfc         RFC del sancionado
 * @param accessToken Token de acceso Directus
 * @param curp        CURP del sancionado (opcional: personas morales no tienen CURP)
 * @param excludeId   ID del registro actual (para modo edición)
 */
export async function checkDuplicate(
  collection: string,
  expediente: string,
  rfc: string,
  accessToken: string,
  curp?: string | null,
  excludeId?: string | null
): Promise<DuplicateResult> {
  try {
    const filter: any = {
      _and: [
        { expediente: { _eq: expediente.trim() } },
        { datosGenerales: { rfc: { _eq: rfc.trim().toUpperCase() } } },
      ],
    };

    if (curp) {
      filter._and.push({ datosGenerales: { curp: { _eq: curp.trim().toUpperCase() } } });
    }

    const results = await directus.request(
      withToken(
        accessToken,
        readItems(collection as any, {
          filter,
          limit: 5,
          fields: ["id", "expediente"],
        })
      )
    ) as any[];

    const duplicates = excludeId
      ? results.filter((r: any) => r.id !== excludeId)
      : results;

    return {
      isDuplicate: duplicates.length > 0,
      existingId: duplicates[0]?.id,
    };
  } catch {
    // Si la query falla (permisos, etc.) dejamos pasar para no bloquear al usuario
    return { isDuplicate: false };
  }
}
