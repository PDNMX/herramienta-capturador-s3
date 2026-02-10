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

interface DestitucionEmpleoNoGravesFieldsProps {
  form: any;
  loading: boolean;
  sancionIndex: number;
}

export const DestitucionEmpleoNoGravesFields: React.FC<DestitucionEmpleoNoGravesFieldsProps> = ({
  form,
  loading,
  sancionIndex,
}) => {
  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          C. Destitucion del empleo, cargo o comision
        </h5>
        <p className="text-xs text-muted-foreground">
          Se debera llenar si en la resolucion se determino sancionar con la destitucion del empleo, cargo o comision
        </p>
      </div>

      <FormField
        control={form.control}
        name={`tipoSancion.${sancionIndex}.destitucionEmpleo.fechaDestitucion`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha de destitucion (DD-MM-AAAA)</FormLabel>
            <FormControl>
              <Input type="date" disabled={loading} {...field} value={field.value || ""} className="h-10" />
            </FormControl>
            <FormDescription>Indicar la fecha en que se ejecuto la destitucion del servidor publico (opcional)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
