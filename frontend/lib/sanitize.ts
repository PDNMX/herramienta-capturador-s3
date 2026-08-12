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

/**
 * Sanitizador para campos de dirección (vialidad, colonia, municipio).
 * Permite: letras con acentos, números, espacios, guiones y punto.
 * Bloquea: @, #, $, %, &, *, (, ), !, etc.
 */
export function sanitizeAddress(value: string): string {
  return value.replace(/[^a-zA-ZÀ-ÿñÑ0-9 \-\.]/g, "");
}

/**
 * Sanitizador específico para campos de nombre y apellido.
 * Permite: letras A-Z a-z, espacios y guiones (para nombres compuestos como García-López).
 * Bloquea: números, paréntesis, puntuación y cualquier otro carácter especial.
 */
export function sanitizeName(value: string): string {
  return value
    .normalize("NFD")
    // eslint-disable-next-line no-misleading-character-class
    .replace(/[̀-ͯ]/g, "")           // elimina diacríticos
    .replace(/[ñÑ]/g, (c) => (c === "ñ" ? "n" : "N"))  // ñ/Ñ → n/N
    .replace(/[^a-zA-Z \-\.]/g, ""); // solo letras, espacios, guiones y punto (ej: Ma. Fernanda)
}
