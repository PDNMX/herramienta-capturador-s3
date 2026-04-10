import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: string) => {
  throw new Error(error)
}

/**
 * Limpia un objeto de datos antes de enviarlo a Directus.
 * - Convierte strings vacíos ("") → null
 * - Elimina valores undefined (no se envían al backend)
 * Esto evita que Directus dispare validaciones de formato o "required"
 * sobre campos que el usuario dejó vacíos durante pruebas.
 */
export function sanitizePayload<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, v === "" ? null : v])
  ) as Partial<T>;
}
