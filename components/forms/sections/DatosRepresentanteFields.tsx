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
                    placeholder="Ej: García"
                    {...field}
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
                    placeholder="Ej: Pérez (si aplica)"
                    {...field}
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>RFC con homoclave</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Ej: GAPC850101XY9"
                    maxLength={13}
                    {...field}
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
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>CURP</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Ej: GAPC850101HDFRRL09"
                    maxLength={18}
                    {...field}
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