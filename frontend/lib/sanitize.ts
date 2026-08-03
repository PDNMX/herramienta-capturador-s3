/**
 * Elimina acentos, diéresis y caracteres especiales de un valor de texto.
 * Permite: letras A-Z a-z, números 0-9, espacios y puntuación básica (.,  - / ()).
 * Uso: interceptar onChange en campos que requieren "sin acentos ni signos especiales".
 */
export function sanitizeInput(value: string): string {
  return value
    .normalize("NFD")
    // eslint-disable-next-line no-misleading-character-class
    .replace(/[̀-ͯ]/g, "")           // elimina diacríticos (tildes, diéresis)
    .replace(/[ñÑ]/g, (c) => (c === "ñ" ? "n" : "N"))  // ñ/Ñ → n/N
    .replace(/[^a-zA-Z0-9 .,\-\/()]/g, "");   // elimina caracteres no permitidos
}
