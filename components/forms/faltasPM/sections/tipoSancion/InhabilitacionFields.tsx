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
  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          Datos de Inhabilitación
        </h5>
        <p className="text-xs text-muted-foreground">
          Complete la información sobre el plazo de inhabilitación
        </p>
      </div>

      <div className="md:grid md:grid-cols-3 gap-6">
        {/* Años */}
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.inhabilitacion.plazoAnios`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Años</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  disabled={loading}
                  placeholder="0"
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
          name={`tipoSancion.${sancionIndex}.inhabilitacion.plazoMeses`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meses</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="11"
                  disabled={loading}
                  placeholder="0"
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
              <FormLabel>Días</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="30"
                  disabled={loading}
                  placeholder="0"
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha inicial de inhabilitación</FormLabel>
              <FormControl>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    disabled={loading}
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fecha Final */}
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.inhabilitacion.fechaFinal`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha final de inhabilitación</FormLabel>
              <FormControl>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    disabled={loading}
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};