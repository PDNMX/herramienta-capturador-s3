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

interface OtroSancionPFFieldsProps {
  form: any;
  loading: boolean;
  sancionIndex: number;
}

export const OtroSancionPFFields: React.FC<OtroSancionPFFieldsProps> = ({
  form,
  loading,
  sancionIndex,
}) => {
  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          D. Otro
        </h5>
        <p className="text-xs text-muted-foreground">
          Llenar este apartado en caso de que la persona fisica sea acreedora a otro tipo de sanción prevista en las leyes locales anticorrupcion de las entidades federativas
        </p>
      </div>

      <FormField
        control={form.control}
        name={`tipoSancion.${sancionIndex}.otro.denominacionSancion`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Denominación de la sanción <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input
                disabled={loading}
                placeholder="Especifique el tipo de sanción"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Indicar el nombre de la sanción, sin abreviaturas, sin acentos, ni signos especiales
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
