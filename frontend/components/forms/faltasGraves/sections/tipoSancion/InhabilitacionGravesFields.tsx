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

interface InhabilitacionGravesFieldsProps {
  form: any;
  loading: boolean;
  sancionIndex: number;
}

export const InhabilitacionGravesFields: React.FC<InhabilitacionGravesFieldsProps> = ({
  form,
  loading,
  sancionIndex,
}) => {
  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          D. Inhabilitación temporal para desempeñar empleos, cargos o comisiones en el servicio público y para participar en adquisiciones, arrendamientos, servicios u obras públicas
        </h5>
        <p className="text-xs text-muted-foreground">
          Llenar este apartado en caso de que la persona servidora pública haya sido inhabilitada
        </p>
      </div>
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          Plazo de la inhabilitación
        </h5>
        <p className="text-xs text-muted-foreground">
          Colocar el plazo de la inhabilitación
        </p>
      </div>
      <div className="md:grid md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.inhabilitacion.plazoAnios`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Año (s) <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder="Ej: 2" {...field} value={field.value || ""} />
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
              <FormLabel>Mes (es) <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder="Ej: 6" {...field} value={field.value || ""} />
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
              <FormLabel>Día (s) <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder="Ej: 15" {...field} value={field.value || ""} />
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
              <FormDescription>Indicar la fecha en que inició la inhabilitación</FormDescription>
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
              <FormDescription>Indicar la fecha en la que se concluyó la inhabilitación</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
