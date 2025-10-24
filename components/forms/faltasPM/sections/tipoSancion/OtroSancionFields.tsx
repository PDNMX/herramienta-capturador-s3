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

interface OtroSancionFieldsProps {
  form: any;
  loading: boolean;
  sancionIndex: number;
}

export const OtroSancionFields: React.FC<OtroSancionFieldsProps> = ({
  form,
  loading,
  sancionIndex,
}) => {
  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          Otra Sanción
        </h5>
      </div>

      <FormField
        control={form.control}
        name={`tipoSancion.${sancionIndex}.otro.denominacionSancion`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Denominación de la sanción</FormLabel>
            <FormControl>
              <Input
                disabled={loading}
                placeholder="Especifique el tipo de sanción"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Indicar el nombre o tipo de sanción que no esté contemplada en las opciones anteriores
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};