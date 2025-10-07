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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface DatosGeneralesPMSectionProps {
  form: any;
  loading: boolean;
}

export const DatosGeneralesPMSection: React.FC<DatosGeneralesPMSectionProps> = ({
  form,
  loading,
}) => {
  const [tipoDomicilio, setTipoDomicilio] = useState(
    form.watch("tipoDomicilio") ?? "DOMICILIO_MEXICO"
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          3. Datos generales de la persona moral sancionada
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          En el presente apartado se establecen los datos concernientes a la persona moral sancionada
        </p>
      </div>

      <div className="md:grid md:grid-cols-2 gap-6">
        {/* Denominación o razón social */}
        <FormField
          control={form.control}
          name="nombreRazonSocial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Denominación o razón social <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Ej: Constructora ABC S.A. de C.V."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Se deberá proporcionar la denominación o razón social de la institución tal y como se encuentra registrada en la escritura pública
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* RFC con homoclave */}
        <FormField
          control={form.control}
          name="rfc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                RFC con homoclave <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Ej: ABC123456XYZ"
                  maxLength={13}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Escribir los primeros nueve caracteres básicos y los tres correspondientes a la homoclave
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Objeto social */}
      <FormField
        control={form.control}
        name="objetoSocial"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Objeto social
            </FormLabel>
            <FormControl>
              <Textarea
                disabled={loading}
                placeholder="Ej: Construcción, diseño y desarrollo de obras civiles..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Referir la actividad o actividades que desarrolla la persona moral
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tipo de domicilio */}
      <FormField
        control={form.control}
        name="tipoDomicilio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Tipo de domicilio <span className="text-red-500">*</span>
            </FormLabel>
            <Select
              disabled={loading}
              onValueChange={(value) => {
                setTipoDomicilio(value);
                field.onChange(value);
                // Limpiar el domicilio no seleccionado
                if (value === "DOMICILIO_MEXICO") {
                  form.setValue("domicilioExtranjero", null);
                } else {
                  form.setValue("domicilioMexico", null);
                }
              }}
              value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de domicilio" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="DOMICILIO_MEXICO">
                  Domicilio en la República Mexicana
                </SelectItem>
                <SelectItem value="DOMICILIO_EXTRANJERO">
                  Domicilio en el extranjero
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Domicilio México - Placeholder */}
      {tipoDomicilio === "DOMICILIO_MEXICO" && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 p-4">
          <h4 className="font-semibold mb-2">Domicilio en la República Mexicana</h4>
          <p className="text-sm text-muted-foreground">
            Indicar los siguientes datos: tipo de vialidad, nombre de la vialidad, número exterior, número interior (si aplica), colonia/localidad, municipio/alcaldía, código postal y entidad federativa.
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
            Esta sección se configurará en el siguiente paso
          </p>
        </div>
      )}

      {/* Domicilio Extranjero - Placeholder */}
      {tipoDomicilio === "DOMICILIO_EXTRANJERO" && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 p-4">
          <h4 className="font-semibold mb-2">Domicilio en el extranjero</h4>
          <p className="text-sm text-muted-foreground">
            En su caso, indicar los siguientes datos: ciudad/localidad, estado/provincia, calle, número exterior, número interior (si aplica), código postal y país.
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
            Esta sección se configurará en el siguiente paso
          </p>
        </div>
      )}
    </div>
  );
};