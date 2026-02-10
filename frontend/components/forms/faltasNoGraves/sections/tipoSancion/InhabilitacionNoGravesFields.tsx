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

interface InhabilitacionNoGravesFieldsProps {
  form: any;
  loading: boolean;
  sancionIndex: number;
}

export const InhabilitacionNoGravesFields: React.FC<InhabilitacionNoGravesFieldsProps> = ({
  form,
  loading,
  sancionIndex,
}) => {
  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          D. Inhabilitacion
        </h5>
        <p className="text-xs text-muted-foreground">
          Se debera llenar si en la resolucion se determino sancionar con una inhabilitacion
        </p>
      </div>

      <div className="md:grid md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.inhabilitacion.plazoAnios`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anio(s) <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="number" min="0" disabled={loading} placeholder="Ej: 2" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.inhabilitacion.plazoMeses`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mes(es) <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="number" min="0" disabled={loading} placeholder="Ej: 6" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.inhabilitacion.plazoDias`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dia(s) <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="number" min="0" disabled={loading} placeholder="Ej: 15" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="md:grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.inhabilitacion.fechaInicial`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha inicial (DD-MM-AAAA) <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="date" disabled={loading} {...field} className="h-10" />
              </FormControl>
              <FormDescription>Indicar la fecha en que inicio la inhabilitacion</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.inhabilitacion.fechaFinal`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha final (DD-MM-AAAA) <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="date" disabled={loading} {...field} className="h-10" />
              </FormControl>
              <FormDescription>Indicar la fecha en la que se concluyo la inhabilitacion</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
