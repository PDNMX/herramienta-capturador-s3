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
import { Calendar } from "lucide-react";

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
                  placeholder="El valor minimo es 0 (cero)"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Meses */}
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
                  placeholder="El valor minimo es 0 (cero)"
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
                  placeholder="El valor minimo es 0 (cero)"
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha inicial (DD/MM/AAAA)</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  disabled={loading}
                  {...field}
                  className="h-10"
                />
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha final (DD/MM/AAAA)</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  disabled={loading}
                  {...field}
                  className="h-10"
                />
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