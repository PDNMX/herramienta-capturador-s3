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

interface SuspensionEmpleoNoGravesFieldsProps {
  form: any;
  loading: boolean;
  sancionIndex: number;
}

export const SuspensionEmpleoNoGravesFields: React.FC<SuspensionEmpleoNoGravesFieldsProps> = ({
  form,
  loading,
  sancionIndex,
}) => {
  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          B. Suspension del empleo, cargo o comision
        </h5>
        <p className="text-xs text-muted-foreground">
          Se debera llenar si en la resolucion se determino sancionar con una suspension del empleo, cargo o comision
        </p>
      </div>

      <div className="md:grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.suspensionEmpleo.plazoMeses`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mes(es) <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="number" min="0" disabled={loading} placeholder="El valor minimo es 0 (cero)" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.suspensionEmpleo.plazoDias`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dia(s) <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="number" min="0" max="30" disabled={loading} placeholder="El valor minimo es 0 (cero)" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="md:grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.suspensionEmpleo.fechaInicial`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha inicial (DD-MM-AAAA) <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="date" disabled={loading} {...field} className="h-10" />
              </FormControl>
              <FormDescription>Indicar la fecha en que inicio la suspension</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.suspensionEmpleo.fechaFinal`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha final (DD-MM-AAAA) <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="date" disabled={loading} {...field} className="h-10" />
              </FormControl>
              <FormDescription>Indicar la fecha en la que se concluyo la suspension</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
