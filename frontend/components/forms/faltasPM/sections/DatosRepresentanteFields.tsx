// @ts-nocheck
"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sanitizeInput } from "@/lib/sanitize";
import { CURP_REGEX, RFC_REGEX, validarCoincidenciaLetras } from "@/lib/curp-rfc";

interface DatosRepresentanteFieldsProps {
  form: any;
  loading: boolean;
  fieldPrefix: "directorGeneral" | "representanteLegal";
  title: string;
}

export const DatosRepresentanteFields: React.FC<
  DatosRepresentanteFieldsProps
> = ({ form, loading, fieldPrefix, title }) => {
  return (
    <div className="rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg">
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-base mb-1">{title}</h4>
        </div>

        <div className="md:grid md:grid-cols-2 gap-6">
          {/* Nombre(s) */}
          <FormField
            control={form.control}
            name={`${fieldPrefix}.nombre`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nombre(s) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Ej: Juan Carlos"
                    {...field}
                    onChange={(e) => field.onChange(sanitizeInput(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Escribir el o los nombres, sin abreviaturas, sin acentos ni
                  signos especiales
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Primer apellido */}
          <FormField
            control={form.control}
            name={`${fieldPrefix}.primerApellido`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Primer apellido <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Ej: Garcia"
                    {...field}
                    onChange={(e) => field.onChange(sanitizeInput(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  En caso de tener un sólo apellido, deberá colocarse aquí y
                  dejar el segundo apellido en blanco
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Segundo apellido */}
          <FormField
            control={form.control}
            name={`${fieldPrefix}.segundoApellido`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Segundo apellido</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Ej: Perez (si aplica)"
                    {...field}
                    onChange={(e) => field.onChange(sanitizeInput(e.target.value))}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* RFC con homoclave */}
          <FormField
            control={form.control}
            name={`${fieldPrefix}.rfc`}
            rules={{
              validate: {
                formato: (v) => RFC_REGEX.test(v?.toUpperCase() ?? "") || "El RFC no tiene el formato correcto (12 ó 13 caracteres: 4 letras, fecha, homoclave)",
                coincidencia: (v) => {
                  const values = form.getValues()[fieldPrefix] ?? {};
                  return validarCoincidenciaLetras(v ?? "", values.nombre ?? "", values.primerApellido ?? "", values.segundoApellido) ||
                    "Las primeras letras del RFC no corresponden con el nombre y apellidos capturados";
                },
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>RFC con homoclave <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Ej: GAPC850101XY9"
                    maxLength={13}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                    onBlur={() => form.trigger(`${fieldPrefix}.rfc`)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Escribir los primeros diez caracteres básicos y los tres
                  correspondientes a la homoclave
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CURP */}
          <FormField
            control={form.control}
            name={`${fieldPrefix}.curp`}
            rules={{
              validate: {
                formato: (v) => !v || CURP_REGEX.test(v?.toUpperCase() ?? "") || "La CURP no tiene el formato correcto (18 caracteres alfanuméricos)",
                coincidencia: (v) => {
                  if (!v) return true;
                  const values = form.getValues()[fieldPrefix] ?? {};
                  return validarCoincidenciaLetras(v, values.nombre ?? "", values.primerApellido ?? "", values.segundoApellido) ||
                    "Las primeras letras de la CURP no corresponden con el nombre y apellidos capturados";
                },
              },
            }}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>CURP</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Ej: GAPC850101HDFRRL09"
                    maxLength={18}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                    onBlur={() => form.trigger(`${fieldPrefix}.curp`)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Escribir los dieciocho caracteres alfanuméricos como aparece
                  en el documento que emite la Secretaría de Gobernación. En
                  caso de no contar con ese dato, podrá consultarlo en:{" "}
                  <a
                    href="https://www.gob.mx/curp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://www.gob.mx/curp/
                  </a>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};