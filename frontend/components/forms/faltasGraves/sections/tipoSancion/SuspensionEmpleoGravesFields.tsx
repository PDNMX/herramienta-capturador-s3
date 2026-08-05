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

interface SuspensionEmpleoGravesFieldsProps {
  form: any;
  loading: boolean;
  sancionIndex: number;
}

export const SuspensionEmpleoGravesFields: React.FC<SuspensionEmpleoGravesFieldsProps> = ({
  form,
  loading,
  sancionIndex,
}) => {
  const fechaResolucion = useWatch({ control: form.control, name: "resolucion_fechaResolucion" });
  const fechaInicial = useWatch({ control: form.control, name: `tipoSancion.${sancionIndex}.suspensionEmpleo.fechaInicial` });

  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          A. Suspension del empleo, cargo o comision
        </h5>
        <p className="text-xs text-muted-foreground">
          Se debera llenar si en la resolución se determinó sancionar con la suspensión del empleo, cargo o comisión
        </p>
      </div>
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          Plazo de la suspensión
        </h5>
        <p className="text-xs text-muted-foreground">
          Colocarel plazo de la suspensión de la persona servidora pública
        </p>
      </div>
      <div className="md:grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.suspensionEmpleo.plazoMeses`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mes (es) <span className="text-red-500">*</span></FormLabel>
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
              <FormLabel>Día (s) <span className="text-red-500">*</span></FormLabel>
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
          rules={{ validate: (v) => !v || !fechaResolucion || v >= fechaResolucion || "No puede ser anterior a la fecha de resolución" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha inicial (DD-MM-AAAA) <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={(val) => { field.onChange(val); form.trigger([`tipoSancion.${sancionIndex}.suspensionEmpleo.fechaInicial`, `tipoSancion.${sancionIndex}.suspensionEmpleo.fechaFinal`]); }} onBlur={() => form.trigger(`tipoSancion.${sancionIndex}.suspensionEmpleo.fechaInicial`)} disabled={loading} min={fechaResolucion || undefined} />
              </FormControl>
              <FormDescription>Indicar la fecha en la que inició la suspensión del empleo, cargo o comisión de la persona servidora pública</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.suspensionEmpleo.fechaFinal`}
          rules={{ validate: (v) => !v || !fechaInicial || v > fechaInicial || "Debe ser posterior a la fecha inicial" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha final (DD-MM-AAAA) <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={(val) => { field.onChange(val); form.trigger(`tipoSancion.${sancionIndex}.suspensionEmpleo.fechaFinal`); }} onBlur={() => form.trigger(`tipoSancion.${sancionIndex}.suspensionEmpleo.fechaFinal`)} disabled={loading} min={fechaInicial || undefined} />
              </FormControl>
              <FormDescription>Indicar la fecha en la que se concluye la suspensión del empleo, cargo o comisión de la persona servidora pública</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
