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

interface DatosGeneralesNoGravesSectionProps {
  form: any;
  loading: boolean;
}

export const DatosGeneralesNoGravesSection: React.FC<DatosGeneralesNoGravesSectionProps> = ({
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
        En el presente apartado se establecen los datos generales del servidor publico sancionado
      </p>

      <div className="md:grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="nombres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nombre(s) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder="Ej: Juan Carlos" {...field} />
              </FormControl>
              <FormDescription>Se deberá escribir el o los nombres del servidor público sancionado</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="primerApellido"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Primer apellido <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder="Ej: Garcia" {...field} />
              </FormControl>
              <FormDescription>Escribir el primer apellido del servidor publico</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="segundoApellido"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Segundo apellido</FormLabel>
            <FormControl>
              <Input disabled={loading} placeholder="Ej: Lopez" {...field} value={field.value || ""} />
            </FormControl>
            <FormDescription>Escribir el segundo apellido del servidor publico (si aplica)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="md:grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="curp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                CURP <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder="Ej: GARL850101HDFRPN09" maxLength={18} {...field} />
              </FormControl>
              <FormDescription>Escribir los dieciocho caracteres alfanuméricos que componen la CURP del servidor público</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rfc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                RFC <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder="Ej: GARL850101AB1" maxLength={13} {...field} />
              </FormControl>
              <FormDescription>Escribir los primeros diez caracteres básicos y los tres correspondientes a la homoclave</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
            <FormDescription>Seleccionar el sexo del servidor publico sancionado</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
