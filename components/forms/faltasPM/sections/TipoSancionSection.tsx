// @ts-nocheck
"use client";

import { useFieldArray } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { InhabilitacionFields } from "./tipoSancion/InhabilitacionFields";
import { IndemnizacionFields } from "./tipoSancion/IndemnizacionFields";
import { SancionEconomicaFields } from "./tipoSancion/SancionEconomicaFields";
import { SuspensionActividadesFields } from "./tipoSancion/SuspensionActividadesFields";
import { DisolucionSociedadFields } from "./tipoSancion/DisolucionSociedadFields";
import { OtroSancionFields } from "./tipoSancion/OtroSancionFields";

interface TipoSancionSectionProps {
  form: any;
  loading: boolean;
}

const TIPOS_SANCION = [
  { value: "INHABILITACION", label: "Inhabilitación temporal para participar en adquisiciones, arrendamientos, servicios u obras públicas" },
  { value: "INDEMNIZACION", label: "Indemnización" },
  { value: "SANCION_ECONOMICA", label: "Sanción Económica" },
  { value: "SUSPENSION_ACTIVIDADES", label: "Suspensión de Actividades" },
  { value: "DISOLUCION_SOCIEDAD", label: "Disolución de la Sociedad" },
  { value: "OTRO", label: "Otro (especifique)" },
];

export const TipoSancionSection: React.FC<TipoSancionSectionProps> = ({
  form,
  loading,
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tipoSancion",
  });

  const handleAddSancion = () => {
    append({
      clave: "",
      inhabilitacion: null,
      indemnizacion: null,
      sancionEconomica: null,
      suspensionActividades: null,
      disolucionSociedad: null,
      otro: null,
    });
  };

  return (
    <div className="space-y-6">
      {/* Descripción de la sección */}
      <p className="text-sm text-muted-foreground">
        Este apartado se refiere a los datos concernientes a la sanción y/o sanciones impuestas a la persona moral
      </p>

      {fields.map((field, index) => {
        const claveValue = form.watch(`tipoSancion.${index}.clave`);

        return (
          <div
            key={field.id}
            className="rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg relative"
          >
            {/* Botón eliminar (solo si hay más de una sanción) */}
            {fields.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => remove(index)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}

            <div className="space-y-6">
              <div className="border-b pb-3">
                <h4 className="font-semibold text-lg text-primary mb-1">
                  Tipo de Sanción {index + 1}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {fields.length > 1
                    ? `Registrando ${fields.length} sanciones. Puede agregar o eliminar según sea necesario.`
                    : "Puede agregar múltiples sanciones usando el botón al final de esta sección."}
                </p>
              </div>

              {/* Selector de tipo de sanción */}
              <FormField
                control={form.control}
                name={`tipoSancion.${index}.clave`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tipo de sanción: elegir la sanción, según corresponda, conforme al catálogo y que fue dictaminada en la resolución definitiva <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de sanción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIPOS_SANCION.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campos condicionales según el tipo de sanción */}
              {claveValue === "INHABILITACION" && (
                <InhabilitacionFields
                  form={form}
                  loading={loading}
                  sancionIndex={index}
                />
              )}

              {claveValue === "INDEMNIZACION" && (
                <IndemnizacionFields
                  form={form}
                  loading={loading}
                  sancionIndex={index}
                />
              )}

              {claveValue === "SANCION_ECONOMICA" && (
                <SancionEconomicaFields
                  form={form}
                  loading={loading}
                  sancionIndex={index}
                />
              )}

              {claveValue === "SUSPENSION_ACTIVIDADES" && (
                <SuspensionActividadesFields
                  form={form}
                  loading={loading}
                  sancionIndex={index}
                />
              )}

              {claveValue === "DISOLUCION_SOCIEDAD" && (
                <DisolucionSociedadFields
                  form={form}
                  loading={loading}
                  sancionIndex={index}
                />
              )}

              {claveValue === "OTRO" && (
                <OtroSancionFields
                  form={form}
                  loading={loading}
                  sancionIndex={index}
                />
              )}
            </div>
          </div>
        );
      })}

      {/* Botón para agregar otra sanción */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddSancion}
        disabled={loading}
        className="w-full border-dashed border-2 h-12"
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar otro tipo de sanción
      </Button>

      {/* Ayuda adicional */}
      {fields.length === 1 && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/30">
          <div className="bg-blue-100 dark:bg-blue-800/30 rounded p-1 mt-0.5">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>¿Múltiples sanciones?</strong> Si se impusieron diferentes tipos de sanciones a la persona moral,
              puede agregar cada una de ellas utilizando el botón de arriba.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};