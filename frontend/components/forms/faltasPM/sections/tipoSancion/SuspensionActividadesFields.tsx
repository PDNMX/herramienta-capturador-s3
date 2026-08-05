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

interface SuspensionActividadesFieldsProps {
  form: any;
  loading: boolean;
  sancionIndex: number;
}

export const SuspensionActividadesFields: React.FC<SuspensionActividadesFieldsProps> = ({
  form,
  loading,
  sancionIndex,
}) => {
  const fechaResolucion = useWatch({ control: form.control, name: "resolucion_fechaResolucion" });
  const fechaInicial = useWatch({ control: form.control, name: `tipoSancion.${sancionIndex}.suspensionActividades.fechaInicial` });

  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          D. Suspensión de Actividades
        </h5>
        <p className="text-xs text-muted-foreground">
          Llenar este apartado si en la resolución se sancionó con la suspensión de actividades
        </p>
      </div>

      <div className="md:grid md:grid-cols-3 gap-6">
        {/* Años */}
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.suspensionActividades.plazoSuspensionAnios`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Año (s) <span className="text-red-500">*</span></FormLabel>
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
          name={`tipoSancion.${sancionIndex}.suspensionActividades.plazoSuspensionMeses`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mes (es) <span className="text-red-500">*</span></FormLabel>
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
          name={`tipoSancion.${sancionIndex}.suspensionActividades.plazoSuspensionDias`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Días <span className="text-red-500">*</span></FormLabel>
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
          name={`tipoSancion.${sancionIndex}.suspensionActividades.fechaInicial`}
          rules={{ validate: (v) => !v || !fechaResolucion || v >= fechaResolucion || "No puede ser anterior a la fecha de resolución" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha inicial (DD/MM/AAAA)</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={(val) => { field.onChange(val); form.trigger([`tipoSancion.${sancionIndex}.suspensionActividades.fechaInicial`, `tipoSancion.${sancionIndex}.suspensionActividades.fechaFinal`]); }} onBlur={() => form.trigger(`tipoSancion.${sancionIndex}.suspensionActividades.fechaInicial`)} disabled={loading} min={fechaResolucion || undefined} />
              </FormControl>
              <FormDescription>
                Indicar la fecha en que inicia la suspensión de actividades
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fecha Final */}
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.suspensionActividades.fechaFinal`}
          rules={{ validate: (v) => !v || !fechaInicial || v > fechaInicial || "Debe ser posterior a la fecha inicial" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha final (DD/MM/AAAA)</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={(val) => { field.onChange(val); form.trigger(`tipoSancion.${sancionIndex}.suspensionActividades.fechaFinal`); }} onBlur={() => form.trigger(`tipoSancion.${sancionIndex}.suspensionActividades.fechaFinal`)} disabled={loading} min={fechaInicial || undefined} />
              </FormControl>
              <FormDescription>
                Indicar la fecha en que concluye la suspensión de actividades
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};