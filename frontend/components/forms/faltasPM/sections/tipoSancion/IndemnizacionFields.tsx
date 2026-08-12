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
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IndemnizacionFieldsProps {
  form: any;
  loading: boolean;
  sancionIndex: number;
}

export const IndemnizacionFields: React.FC<IndemnizacionFieldsProps> = ({
  form,
  loading,
  sancionIndex,
}) => {
  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          B. Indemnización
        </h5>
        <p className="text-xs text-muted-foreground">Se deberá llenar si en la resolución definitiva se impuso indemnización</p>
      </div>

      <div className="md:grid md:grid-cols-2 gap-6">
        {/* Monto - OBLIGATORIO */}
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.indemnizacion.monto`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Monto <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={loading}
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription> Colocar el monto total de la indemnización </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Moneda - OBLIGATORIO */}
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.indemnizacion.moneda`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Moneda <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                disabled={loading}
                onValueChange={field.onChange}
                value={field.value || "MXN"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                  <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription> Colocar el tipo de moneda en formato de tres letras, establecidos en el ISO 4217</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Plazo de pago - Siempre visible */}
      <div className="p-4 bg-muted/30 rounded-lg border border-muted space-y-4">
        <p className="text-sm font-semibold text-primary">Plazo de pago</p>
        <p className="text-xs text-muted-foreground">
          Señalar el plazo determinado para dar cumplimiento a la indemnización
        </p>
        <div className="md:grid md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name={`tipoSancion.${sancionIndex}.indemnizacion.plazoPago.anios`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Años</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    disabled={loading}
                    placeholder="El valor mínimo es 0 (cero)"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage /> 
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`tipoSancion.${sancionIndex}.indemnizacion.plazoPago.meses`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mes (es)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="11"
                    disabled={loading}
                    placeholder="El valor mínimo es 0 (cero)"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`tipoSancion.${sancionIndex}.indemnizacion.plazoPago.dias`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Día (s)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="30"
                    disabled={loading}
                    placeholder="El valor mínimo es 0 (cero)"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
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
            Si al momento de registrar la información la autoridad no cuenta con los datos señalados en esta sección, estos podrán registrarse posteriormente mediante una actualización de su registro
          </p>
        </div>
      </div>

      {/* Efectivamente Cobrado - Siempre visible */}
      <div className="p-4 bg-muted/30 rounded-lg border border-muted space-y-4">
        <p className="text-sm font-semibold text-primary">Indemnización Efectivamente Cobrada</p>
        <div className="md:grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`tipoSancion.${sancionIndex}.indemnizacion.efectivamenteCobrado.monto`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    disabled={loading}
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription> Indicar el monto efectivamente cobrado </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`tipoSancion.${sancionIndex}.indemnizacion.efectivamenteCobrado.moneda`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moneda</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value || "MXN"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MXN">MXN</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription> Colocar el tipo de moneda en formato de tres letras, establecidos en el ISO 4217</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.indemnizacion.efectivamenteCobrado.fechaCobro`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de cobro de la indemnización</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} onBlur={field.onBlur} disabled={loading} />
              </FormControl>
              <FormDescription> Especificar la fecha en que se realizó el cobro </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-900">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-blue-800 dark:text-blue-200">
            Si al momento de registrar la información la autoridad no cuenta con los datos señalados en esta sección, estos podrán registrarse posteriormente mediante una actualización de su registro
          </p>
        </div>
      </div>

      {/* Fecha de pago total - Al final */}
      <FormField
        control={form.control}
        name={`tipoSancion.${sancionIndex}.indemnizacion.fechaPagoTotal`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha en que se realizó el pago total de la indemnización (DD-MM-AAAA)</FormLabel>
            <FormControl>
              <DatePicker value={field.value} onChange={field.onChange} onBlur={field.onBlur} disabled={loading} />
            </FormControl>
            <FormMessage />
            <FormDescription>Especificar la fecha en que se cubrió el pago total de la indemnización.</FormDescription>
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-900 mt-2">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Si al momento de registrar la información la autoridad no cuenta con el dato de fecha en que se realizó el pago total de la indemnización, este podrá registrarse posteriormente mediante una actualización de su registro
              </p>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};