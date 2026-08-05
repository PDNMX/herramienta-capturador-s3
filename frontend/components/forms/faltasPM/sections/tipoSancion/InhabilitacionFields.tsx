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
import { DatePicker } from "@/components/ui/date-picker";
import { useWatch } from "react-hook-form";

interface InhabilitacionFieldsProps {
  form: any;
  loading: boolean;
  sancionIndex: number;
}

export const InhabilitacionFields: React.FC<InhabilitacionFieldsProps> = ({
  form,
  loading,
  sancionIndex,
}) => {
  const fechaResolucion = useWatch({ control: form.control, name: "resolucion_fechaResolucion" });
  const fechaInicial = useWatch({ control: form.control, name: `tipoSancion.${sancionIndex}.inhabilitacion.fechaInicial` });

  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          A. Inhabilitación temporal para participar en adquisiciones, arrendamientos, servicios u obras públicas
        </h5>
        <p className="text-xs text-muted-foreground">
          Se deberá llenar si en la resolución se determinó sancionar con una inhabilitación
        </p>
      </div>

      <div className="md:grid md:grid-cols-3 gap-6">
        {/* Años */}
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.inhabilitacion.plazoAnios`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Año (s) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  disabled={loading}
                  placeholder="El valor mínimo es 0 (cero)"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mes (es) */}
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.inhabilitacion.plazoMeses`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mes (es) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="11"
                  disabled={loading}
                  placeholder="El valor mínimo es 0 (cero)"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Días */}
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.inhabilitacion.plazoDias`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Día (s) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="30"
                  disabled={loading}
                  placeholder="El valor mínimo es 0 (cero)"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="md:grid md:grid-cols-2 gap-6">
        {/* Fecha Inicial */}
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.inhabilitacion.fechaInicial`}
          rules={{ validate: (v) => !v || !fechaResolucion || v >= fechaResolucion || "No puede ser anterior a la fecha de resolución" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Fecha inicial (DD-MM-AAAA) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={(val) => { field.onChange(val); form.trigger([`tipoSancion.${sancionIndex}.inhabilitacion.fechaInicial`, `tipoSancion.${sancionIndex}.inhabilitacion.fechaFinal`]); }} onBlur={() => form.trigger(`tipoSancion.${sancionIndex}.inhabilitacion.fechaInicial`)} disabled={loading} min={fechaResolucion || undefined} />
              </FormControl>
              <FormDescription>
                Indicar la fecha en que inició la inhabilitación
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fecha Final */}
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.inhabilitacion.fechaFinal`}
          rules={{ validate: (v) => !v || !fechaInicial || v > fechaInicial || "Debe ser posterior a la fecha inicial" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Fecha final (DD-MM-AAAA) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={(val) => { field.onChange(val); form.trigger(`tipoSancion.${sancionIndex}.inhabilitacion.fechaFinal`); }} onBlur={() => form.trigger(`tipoSancion.${sancionIndex}.inhabilitacion.fechaFinal`)} disabled={loading} min={fechaInicial || undefined} />
              </FormControl>
              <FormDescription>
                Indicar la fecha en la que se concluyó la inhabilitación
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};