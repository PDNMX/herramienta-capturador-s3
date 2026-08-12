// CURP: 4 letras + 6 dígitos fecha + sexo + 2 estado + 3 consonantes + 1 diferenciador + 1 verificador
export const CURP_REGEX = /^[A-Z]{4}\d{6}[HM][A-Z]{2}[A-Z]{3}[A-Z\d]\d$/;

// RFC persona física: 4 letras + 6 dígitos fecha + 3 homoclave (siempre 13 chars)
export const RFC_REGEX = /^[A-Z]{4}\d{6}[A-Z\d]{3}$/;

// RFC persona moral: 3 letras (razón social) + 6 dígitos fecha + 3 homoclave (siempre 12 chars)
export const RFC_PM_REGEX = /^[A-Z]{3}\d{6}[A-Z\d]{3}$/;

const VOCALES = new Set(["A", "E", "I", "O", "U"]);

// Palabras compuestas que se omiten al derivar la letra del nombre
const NOMBRES_OMITIDOS = new Set(["MARIA", "JOSE", "MA", "J"]);

function normalizar(s: string): string {
  return s
    .toUpperCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ÑN]/g, (c) => (c === "Ñ" ? "N" : "N"))
    .replace(/[^A-Z]/g, "");
}

/**
 * Deriva las 4 letras iniciales que deben aparecer en CURP y RFC
 * a partir del nombre y apellidos del servidor público.
 *
 * Regla oficial (SAT / RENAPO):
 *   L1 = primerApellido[0]
 *   L2 = primera vocal interna de primerApellido
 *   L3 = segundoApellido[0]  (X si no hay segundo apellido)
 *   L4 = primer nombre[0]    (omitir MARIA/JOSE si hay segundo nombre)
 */
export function derivarLetrasIniciales(
  nombres: string,
  primerApellido: string,
  segundoApellido?: string | null
): string {
  const ap1 = normalizar(primerApellido);
  const ap2 = normalizar(segundoApellido ?? "");

  // Primer nombre útil (saltar MARIA/JOSE si hay otro nombre)
  const partes = normalizar(nombres)
    .split(/\s+/)
    .filter(Boolean);
  const nom =
    partes.length > 1 && NOMBRES_OMITIDOS.has(partes[0])
      ? partes[1]
      : partes[0] ?? "";

  const L1 = ap1[0] ?? "";
  const L2 = ap1.slice(1).split("").find((c) => VOCALES.has(c)) ?? "";
  const L3 = ap2[0] ?? "X";
  const L4 = nom[0] ?? "";

  return `${L1}${L2}${L3}${L4}`;
}

/**
 * Valida que al menos 3 de las 4 primeras letras del CURP/RFC
 * coincidan con las derivadas del nombre y apellidos.
 * La tolerancia de 1 letra cubre el ajuste por palabras altisonantes.
 */
export function validarCoincidenciaLetras(
  curpOrRfc: string,
  nombres: string,
  primerApellido: string,
  segundoApellido?: string | null
): boolean {
  if (!nombres || !primerApellido) return true; // sin datos de nombre, no validar
  const derivadas = derivarLetrasIniciales(nombres, primerApellido, segundoApellido);
  if (derivadas.length < 4) return true; // datos incompletos, no validar
  const primeras4 = curpOrRfc.slice(0, 4).toUpperCase();
  let coincidencias = 0;
  for (let i = 0; i < 4; i++) {
    if (primeras4[i] === derivadas[i]) coincidencias++;
  }
  return coincidencias >= 3;
}
