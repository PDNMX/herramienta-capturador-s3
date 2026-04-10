// @ts-nocheck
"use client";

import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

interface AmonestacionNoGravesFieldsProps {
  form: any;
  loading: boolean;
  sancionIndex: number;
}

export const AmonestacionNoGravesFields: React.FC<AmonestacionNoGravesFieldsProps> = ({
  form,
  loading,
  sancionIndex,
}) => {
  const [tipo, setTipo] = useState(form.watch(`tipoSancion.${sancionIndex}.amonestacion.tipo`) ?? null);

  const handleTipoClick = (value: string) => {
    if (tipo === value) {
      setTipo(null);
      form.setValue(`tipoSancion.${sancionIndex}.amonestacion.tipo`, null);
    } else {
      setTipo(value);
      form.setValue(`tipoSancion.${sancionIndex}.amonestacion.tipo`, value);
    }
  };

  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          A. Amonestación
        </h5>
        <p className="text-xs text-muted-foreground">
          Se deberá llenar si en la resolución se determinó sancionar con una amonestación pública o privada
        </p>
      </div>

      <FormField
        control={form.control}
        name={`tipoSancion.${sancionIndex}.amonestacion.tipo`}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>
              Tipo de amonestación <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => !loading && handleTipoClick("PUBLICA")}
                  className={`relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors ${
                    tipo === "PUBLICA" ? "border-primary bg-accent" : "border-muted"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      tipo === "PUBLICA" ? "border-primary" : "border-muted-foreground"
                    }`}>
                      {tipo === "PUBLICA" && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">Pública</Label>
                      <p className="text-xs text-muted-foreground mt-1">Amonestación de carácter público</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => !loading && handleTipoClick("PRIVADA")}
                  className={`relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors ${
                    tipo === "PRIVADA" ? "border-primary bg-accent" : "border-muted"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      tipo === "PRIVADA" ? "border-primary" : "border-muted-foreground"
                    }`}>
                      {tipo === "PRIVADA" && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">Privada</Label>
                      <p className="text-xs text-muted-foreground mt-1">Amonestación de carácter privado</p>
                    </div>
                  </div>
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Seleccionar el tipo de amonestación
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
