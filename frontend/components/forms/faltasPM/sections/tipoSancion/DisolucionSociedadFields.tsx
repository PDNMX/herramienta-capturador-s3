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
import { DatePicker } from "@/components/ui/date-picker";

interface DisolucionSociedadFieldsProps {
  form: any;
  loading: boolean;
  sancionIndex: number;
}

export const DisolucionSociedadFields: React.FC<DisolucionSociedadFieldsProps> = ({
  form,
  loading,
  sancionIndex,
}) => {
  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          E. Disolución de la Sociedad
        </h5>
        <p className="text-xs text-muted-foreground">
          Llenar este apartado si en la resolución se sancionó con la disolución de la sociedad
        </p>
      </div>

      <FormField
        control={form.control}
        name={`tipoSancion.${sancionIndex}.disolucionSociedad.fechaDisolucion`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha de la disolución</FormLabel>
            <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} onBlur={field.onBlur} disabled={loading} />
              </FormControl>
            <FormDescription>
              Especificar la fecha a partir de la cual se disuelve la sociedad de la persona moral
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};