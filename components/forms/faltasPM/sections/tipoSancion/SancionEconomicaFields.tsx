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
import { Calendar } from "lucide-react";

interface SancionEconomicaFieldsProps {
  form: any;
  loading: boolean;
  sancionIndex: number;
}

export const SancionEconomicaFields: React.FC<SancionEconomicaFieldsProps> = ({
  form,
  loading,
  sancionIndex,
}) => {
  return (
    <div className="border-t pt-6 space-y-6">
      <div>
        <h5 className="font-semibold text-base text-primary mb-1">
          C. Sanción Económica
        </h5>
        <p className="text-xs text-muted-foreground">Llenar este apartado en caso de que la persona moral sea acreedora de una sanción económica</p>
      </div>

      <div className="md:grid md:grid-cols-2 gap-6">
        {/* Monto */}
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.sancionEconomica.monto`}
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Moneda */}
        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.sancionEconomica.moneda`}
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
                  <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                  <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Plazo de Pago - Siempre visible */}
      <div className="p-4 bg-muted/30 rounded-lg border border-muted space-y-4">
        <p className="text-sm font-semibold text-primary">Plazo de Pago</p>
        <div className="md:grid md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name={`tipoSancion.${sancionIndex}.sancionEconomica.plazoPago.anios`}
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

          <FormField
            control={form.control}
            name={`tipoSancion.${sancionIndex}.sancionEconomica.plazoPago.meses`}
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

          <FormField
            control={form.control}
            name={`tipoSancion.${sancionIndex}.sancionEconomica.plazoPago.dias`}
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
      </div>

      {/* Efectivamente Cobrado - Siempre visible */}
      <div className="p-4 bg-muted/30 rounded-lg border border-muted space-y-4">
        <p className="text-sm font-semibold text-primary">Efectivamente Cobrado</p>
        <div className="md:grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`tipoSancion.${sancionIndex}.sancionEconomica.efectivamenteCobrado.monto`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto cobrado</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`tipoSancion.${sancionIndex}.sancionEconomica.efectivamenteCobrado.moneda`}
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name={`tipoSancion.${sancionIndex}.sancionEconomica.efectivamenteCobrado.fechaCobro`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de cobro</FormLabel>
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

      {/* Fecha de pago total - Al final */}
      <FormField
        control={form.control}
        name={`tipoSancion.${sancionIndex}.sancionEconomica.fechaPagoTotal`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha de pago total (opcional)</FormLabel>
            <FormControl>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  disabled={loading}
                  className="pl-10"
                  {...field}
                  value={field.value || ""}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};