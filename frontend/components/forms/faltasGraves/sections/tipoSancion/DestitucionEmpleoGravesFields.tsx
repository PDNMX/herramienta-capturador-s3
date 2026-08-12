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

interface DestitucionEmpleoGravesFieldsProps {
  form: any;
  loading: boolean;
  sancionIndex: number;
}

export const DestitucionEmpleoGravesFields: React.FC<DestitucionEmpleoGravesFieldsProps> = ({
  form,
  loading,
  sancionIndex,
}) => {
  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          B. Destitución del empleo, cargo o comisión
        </h5>
        <p className="text-xs text-muted-foreground">
          Se deberá llenar si en la resolución definitiva se impuso destitución del empleo, cargo o comisión a la persona servidora pública
        </p>
      </div>

      <FormField
        control={form.control}
        name={`tipoSancion.${sancionIndex}.destitucionEmpleo.fechaDestitucion`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha de la destitución (DD-MM-AAAA) <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <DatePicker value={field.value} onChange={field.onChange} onBlur={field.onBlur} disabled={loading} />
            </FormControl>
            <FormDescription>
              Indicar la fecha de destitución de la persona servidora pública.
              <span className="block mt-1">Si al momento de registrar la información la autoridad no cuenta con dicho dato, posteriormente podrá registrar mediante una actualización.</span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
