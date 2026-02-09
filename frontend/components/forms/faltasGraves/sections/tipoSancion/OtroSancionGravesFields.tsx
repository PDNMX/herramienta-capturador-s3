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

interface OtroSancionGravesFieldsProps {
  form: any;
  loading: boolean;
  sancionIndex: number;
}

export const OtroSancionGravesFields: React.FC<OtroSancionGravesFieldsProps> = ({
  form,
  loading,
  sancionIndex,
}) => {
  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          E. Otro
        </h5>
        <p className="text-xs text-muted-foreground">
          Llenar este apartado en caso de que el servidor publico sea acreedor a otro tipo de sancion
        </p>
      </div>

      <FormField
        control={form.control}
        name={`tipoSancion.${sancionIndex}.otro.denominacionSancion`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Denominacion de la sancion <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input disabled={loading} placeholder="Especifique el tipo de sancion" {...field} />
            </FormControl>
            <FormDescription>
              Indicar el nombre de la sancion, sin abreviaturas, sin acentos, ni signos especiales
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
