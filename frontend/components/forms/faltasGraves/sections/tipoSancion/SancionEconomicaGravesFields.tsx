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

interface SancionEconomicaGravesFieldsProps {
  form: any;
  loading: boolean;
  sancionIndex: number;
}

export const SancionEconomicaGravesFields: React.FC<SancionEconomicaGravesFieldsProps> = ({
  form,
  loading,
  sancionIndex,
}) => {
  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          C. Sanción económica
        </h5>
        <p className="text-xs text-muted-foreground">Llenar este apartado en caso de que la persona servidora pública sea acreedora de una sanción económica</p>
      </div>

      <div className="md:grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.sancionEconomica.monto`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0.01" disabled={loading} placeholder="0.00" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
              </FormControl>
              <FormDescription>Colocar el monto total de la sanción económica</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.sancionEconomica.moneda`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moneda <span className="text-red-500">*</span></FormLabel>
              <Select disabled={loading} onValueChange={field.onChange} value={field.value || "MXN"}>
                <FormControl>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                  <SelectItem value="USD">USD - Dolar Americano</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Colocar el tipo de moneda en formato de tres letras, establecidos en el ISO 4217</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Plazo de pago */}
      <div className="p-4 bg-muted/30 rounded-lg border border-muted space-y-4">
        <p className="text-sm font-semibold text-primary">Plazo de pago</p>
        <p className="text-xs text-muted-foreground">Señalar el plazo para pagar la sanción económica</p>
        <div className="md:grid md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name={`tipoSancion.${sancionIndex}.sancionEconomica.plazoPago.anios`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Año (s)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" disabled={loading} placeholder="0" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`tipoSancion.${sancionIndex}.sancionEconomica.plazoPago.meses`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mes (es)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="11" disabled={loading} placeholder="0" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`tipoSancion.${sancionIndex}.sancionEconomica.plazoPago.dias`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Día (s)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="30" disabled={loading} placeholder="0" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-900">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-blue-800 dark:text-blue-200">
            Si al momento de registrar la información la autoridad no cuenta con los datos señalados en esta sección, estos se podrán registrarse posteriormente mediante una actualización de su registro.
          </p>
        </div>
      </div>

      {/* Efectivamente Cobrada */}
      <div className="p-4 bg-muted/30 rounded-lg border border-muted space-y-4">
        <p className="text-sm font-semibold text-primary">Sanción económica efectivamente cobrada</p>
        <div className="md:grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`tipoSancion.${sancionIndex}.sancionEconomica.sancionEfectivamenteCobrada.monto`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" disabled={loading} placeholder="0.00" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                </FormControl>
                <FormDescription>Indicar el monto efectivamente cobrado</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`tipoSancion.${sancionIndex}.sancionEconomica.sancionEfectivamenteCobrada.moneda`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moneda</FormLabel>
                <Select disabled={loading} onValueChange={field.onChange} value={field.value || "MXN"}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MXN">MXN</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Colocar el tipo de moneda en formato de tres letras, establecidos en el ISO 4217</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.sancionEconomica.sancionEfectivamenteCobrada.fechaCobro`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de cobro de la sanción (DD-MM-AAAA)</FormLabel>
              <FormControl>
                <Input type="date" disabled={loading} {...field} className="h-10" />
              </FormControl>
              <FormDescription>Especificar la fecha en que se realizó el cobro de la sanción económica</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-900">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-blue-800 dark:text-blue-200">
            Si al momento de registrar la información la autoridad no cuenta con los datos señalados en esta sección, estos podrán registrarse posteriormente mediante una actualización de su registro.
          </p>
        </div>
      </div>

      {/* Fecha de pago total */}
      <FormField
        control={form.control}
        name={`tipoSancion.${sancionIndex}.sancionEconomica.fechaPagoTotal`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha de pago total (opcional)</FormLabel>
            <FormControl>
              <Input type="date" disabled={loading} {...field} className="h-10" />
            </FormControl>
            <FormDescription>Especificar la fecha en que se cubrió el pago total de la sanción económica. <p> Si al momento de registrar la información la autoridad no cuenta con el dato de fecha en que se realizó el pago total de la sanción, este podrá registrarse posteriormente mediante una actualización de su registro </p></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
