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
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { sanitizeInput } from "@/lib/sanitize";
import { CURP_REGEX, RFC_REGEX, validarCoincidenciaLetras } from "@/lib/curp-rfc";

interface DatosGeneralesGravesSectionProps {
  form: any;
  loading: boolean;
}

export const DatosGeneralesGravesSection: React.FC<DatosGeneralesGravesSectionProps> = ({
  form,
  loading,
}) => {
  const [sexo, setSexo] = useState(form.watch("sexo") ?? null);

  const handleSexoClick = (value: string) => {
    if (sexo === value) {
      setSexo(null);
      form.setValue("sexo", null);
    } else {
      setSexo(value);
      form.setValue("sexo", value);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        En el presente apartado se establecen los datos concernientes a la persona servidora pública que cometió la falta administrativa
      </p>

      <div className="md:grid md:grid-cols-2 gap-6">
        {/* Nombres */}
        <FormField
          control={form.control}
          name="nombres"
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
                Se deberá escribir el o los nombres, así como los apellidos, sin abreviaturas, sin acentos, ni signos especiales. En caso de tener sólo un apellido, deberá colocarse en el espacio del primer apellido y dejar el espacio del segundo apellido en blanco
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Primer Apellido */}
        <FormField
          control={form.control}
          name="primerApellido"
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
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Segundo Apellido */}
      <FormField
        control={form.control}
        name="segundoApellido"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Segundo apellido</FormLabel>
            <FormControl>
              <Input
                disabled={loading}
                placeholder="Ej: Lopez"
                {...field}
                onChange={(e) => field.onChange(sanitizeInput(e.target.value))}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="md:grid md:grid-cols-2 gap-6">
        {/* CURP */}
        <FormField
          control={form.control}
          name="curp"
          rules={{
            validate: {
              formato: (v) => CURP_REGEX.test(v?.toUpperCase() ?? "") || "La CURP no tiene el formato correcto (18 caracteres alfanuméricos)",
              coincidencia: (v) => {
                const { nombres, primerApellido, segundoApellido } = form.getValues();
                return validarCoincidenciaLetras(v ?? "", nombres ?? "", primerApellido ?? "", segundoApellido) ||
                  "Las primeras letras de la CURP no corresponden con el nombre y apellidos capturados";
              },
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                CURP <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Ej: GARL850101HDFRPN09"
                  maxLength={18}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                  onBlur={() => form.trigger("curp")}
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

        {/* RFC */}
        <FormField
          control={form.control}
          name="rfc"
          rules={{
            validate: {
              formato: (v) => RFC_REGEX.test(v?.toUpperCase() ?? "") || "El RFC no tiene el formato correcto (12 ó 13 caracteres: 4 letras, fecha, homoclave)",
              coincidencia: (v) => {
                const { nombres, primerApellido, segundoApellido } = form.getValues();
                return validarCoincidenciaLetras(v ?? "", nombres ?? "", primerApellido ?? "", segundoApellido) ||
                  "Las primeras letras del RFC no corresponden con el nombre y apellidos capturados";
              },
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                RFC <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Ej: GARL850101AB1"
                  maxLength={13}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                  onBlur={() => form.trigger("rfc")}
                />
              </FormControl>
              <FormDescription>
                Escribir los primeros diez caracteres básicos y los tres correspondientes a la homoclave
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Sexo */}
      <FormField
        control={form.control}
        name="sexo"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>
              Sexo <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => !loading && handleSexoClick("MUJER")}
                  className={`relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors ${
                    sexo === "MUJER" ? "border-primary bg-accent" : "border-muted"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      sexo === "MUJER" ? "border-primary" : "border-muted-foreground"
                    }`}>
                      {sexo === "MUJER" && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">Mujer</Label>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => !loading && handleSexoClick("HOMBRE")}
                  className={`relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors ${
                    sexo === "HOMBRE" ? "border-primary bg-accent" : "border-muted"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      sexo === "HOMBRE" ? "border-primary" : "border-muted-foreground"
                    }`}>
                      {sexo === "HOMBRE" && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">Hombre</Label>
                    </div>
                  </div>
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Seleccionar la opción que corresponda
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
