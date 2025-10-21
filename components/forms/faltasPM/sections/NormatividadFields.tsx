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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface NormatividadFieldsProps {
  form: any;
  loading: boolean;
  faltaIndex: number;
}

const NORMATIVIDADES = [
  { value: "LRACDMX", label: "Ley de Responsabilidades Administrativas de la Ciudad de México" },
  { value: "LRAAGS", label: "Ley de Responsabilidades Administrativas del Estado de Aguascalientes" },
  { value: "LRABC", label: "Ley de Responsabilidades Administrativas del Estado de Baja California" },
  { value: "LRABCS", label: "Ley de Responsabilidades Administrativas del Estado de Baja California Sur" },
  { value: "LRACHP", label: "Ley de Responsabilidades Administrativas del Estado de Chiapas" },
  { value: "LRAHGO", label: "Ley de Responsabilidades Administrativas del Estado de Hidalgo" },
  { value: "LRAEMM", label: "Ley de Responsabilidades Administrativas del Estado de México y Municipios" },
  { value: "LRAEMOR", label: "Ley de Responsabilidades Administrativas del Estado de Morelos" },
  { value: "LRANAY", label: "Ley de Responsabilidades Administrativas del Estado de Nayarit" },
  { value: "LRAEMMOAX", label: "Ley de Responsabilidades Administrativas del Estado y Municipios de Oaxaca" },
  { value: "LRAQRO", label: "Ley de Responsabilidades Administrativas del Estado de Querétaro" },
  { value: "LRAQR", label: "Ley de Responsabilidades Administrativas del Estado de Quintana Roo" },
  { value: "LRASIN", label: "Ley de Responsabilidades Administrativas del Estado de Sinaloa" },
  { value: "LRASON", label: "Ley de Responsabilidades Administrativas del Estado de Sonora" },
  { value: "LRATAM", label: "Ley de Responsabilidades Administrativas del Estado de Tamaulipas" },
  { value: "LRAYUC", label: "Ley de Responsabilidades Administrativas del Estado de Yucatán" },
  { value: "LRAGTO", label: "Ley de Responsabilidades Administrativas para el Estado de Guanajuato" },
  { value: "LRAMICH", label: "Ley de Responsabilidades Administrativas para el Estado de Michoacán de Ocampo" },
  { value: "LRANL", label: "Ley de Responsabilidades Administrativas para el Estado de Nuevo León" },
  { value: "LRASLP", label: "Ley de Responsabilidades Administrativas para el Estado y Municipios de San Luis Potosí" },
  { value: "LRAVER", label: "Ley de Responsabilidades Administrativas para el Estado de Veracruz de Ignacio de la Llave" },
  { value: "LRPAEJ", label: "Ley de Responsabilidades Políticas y Administrativas del Estado de Jalisco" },
  { value: "LGRA", label: "Ley General de Responsabilidades Administrativas" },
  { value: "LRAEGR465", label: "Ley Número 465 de Responsabilidades Administrativas para el Estado de Guerrero" },
];

export const NormatividadFields: React.FC<NormatividadFieldsProps> = ({
  form,
  loading,
  faltaIndex,
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `faltaCometida.${faltaIndex}.normatividadInfringida`,
  });

  const handleAddNormatividad = () => {
    append({
      nombreNormatividad: "",
      articulo: "",
      fraccion: null,
    });
  };

  return (
    <div className="space-y-4">
      {fields.map((field, normIndex) => (
        <div
          key={field.id}
          className="p-4 bg-muted/30 rounded-lg border border-muted relative"
        >
          {/* Botón eliminar (solo si hay más de una normatividad) */}
          {fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={() => remove(normIndex)}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-primary">
                Normatividad {normIndex + 1}
              </p>
              {fields.length === 1 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Puede agregar múltiples normatividades para esta falta usando el botón al final.
                </p>
              )}
              {fields.length > 1 && normIndex === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Registrando {fields.length} normatividades infringidas para esta falta.
                </p>
              )}
            </div>

            {/* Nombre de la normatividad */}
            <FormField
              control={form.control}
              name={`faltaCometida.${faltaIndex}.normatividadInfringida.${normIndex}.nombreNormatividad`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Normatividad infringida <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la normatividad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {NORMATIVIDADES.map((norm) => (
                        <SelectItem key={norm.value} value={norm.value}>
                          {norm.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Escribir el nombre de la normatividad infringida por la persona moral, sin abreviaturas, sin acentos, ni signos especiales
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Artículo */}
              <FormField
                control={form.control}
                name={`faltaCometida.${faltaIndex}.normatividadInfringida.${normIndex}.articulo`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Artículo(s) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Ej: 34, 35, 36"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Escribir el (los) artículo(s) infringido(s)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fracción */}
              <FormField
                control={form.control}
                name={`faltaCometida.${faltaIndex}.normatividadInfringida.${normIndex}.fraccion`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fracción(es)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Ej: I, II, III (si aplica)"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      En su caso, escribir la(s) fracción(es) infringida(s)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Botón para agregar otra normatividad */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddNormatividad}
        disabled={loading}
        className="w-full border-dashed"
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar otra normatividad infringida
      </Button>
    </div>
  );
};