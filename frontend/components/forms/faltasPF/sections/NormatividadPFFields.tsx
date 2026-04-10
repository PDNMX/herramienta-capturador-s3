// @ts-nocheck
"use client";

import { useFieldArray } from "react-hook-form";
import { useRef, useCallback } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, BookOpen } from "lucide-react";

interface NormatividadPFFieldsProps {
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

export const NormatividadPFFields: React.FC<NormatividadPFFieldsProps> = ({
  form,
  loading,
  faltaIndex,
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `faltaCometida.${faltaIndex}.normatividadInfringida`,
  });

  const containerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const lastAddedIdRef = useRef<string | null>(null);

  const handleAddNormatividad = () => {
    append({
      nombreNormatividad: "",
      articulo: "",
      fraccion: null,
    });
    lastAddedIdRef.current = "pending";
  };

  const handleRemoveNormatividad = useCallback((index: number, fieldId: string) => {
    const el = containerRefs.current.get(fieldId);
    if (el) {
      el.classList.add("array-item-removing");
      el.addEventListener("animationend", () => {
        remove(index);
      }, { once: true });
    } else {
      remove(index);
    }
  }, [remove]);

  return (
    <div className="space-y-4">
      {/* Nested counter badge */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 border border-muted">
          <BookOpen className="h-3 w-3 text-muted-foreground" />
          <span className={`text-xs font-semibold text-primary ${fields.length > 1 ? "animate-badge-pulse" : ""}`}>
            {fields.length}
          </span>
          <span className="text-xs text-muted-foreground">
            {fields.length === 1 ? "normatividad" : "normatividades"}
          </span>
        </div>
      </div>

      {/* Botón para agregar otra normatividad - al inicio para mayor visibilidad */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddNormatividad}
        disabled={loading}
        className="w-full border-dashed group hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-300">
            <Plus className="h-3 w-3 text-primary" />
          </div>
          <span className="text-xs font-medium">Agregar otra normatividad infringida</span>
        </div>
      </Button>

      {fields.map((field, normIndex) => {
        // Determine if this item was just added
        const isNewItem = lastAddedIdRef.current === "pending" && normIndex === fields.length - 1;
        if (isNewItem) {
          lastAddedIdRef.current = field.id;
        }
        const shouldAnimate = lastAddedIdRef.current === field.id;

        return (
          <div
            key={field.id}
            ref={(el) => {
              if (el) containerRefs.current.set(field.id, el);
              else containerRefs.current.delete(field.id);
            }}
            className={`
              p-4 bg-muted/30 rounded-lg border border-muted relative
              border-l-[3px] border-l-primary/40
              transition-all duration-300
              ${shouldAnimate ? "animate-array-item-enter" : ""}
            `}
          >
            {/* Botón eliminar (solo si hay más de una normatividad) */}
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                onClick={() => handleRemoveNormatividad(normIndex, field.id)}
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {/* Small numbered indicator */}
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <span className="text-xs font-bold text-primary">{normIndex + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Normatividad {normIndex + 1}
                    {fields.length > 1 && (
                      <span className="text-xs font-normal text-muted-foreground ml-1.5">
                        de {fields.length}
                      </span>
                    )}
                  </p>
                </div>
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
                    <FormControl>
                      <Combobox
                        options={NORMATIVIDADES}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecciona la normatividad"
                        disabled={loading}
                        searchPlaceholder="Buscar normatividad..."
                      />
                    </FormControl>
                    <FormDescription>
                      Escribir el nombre de la normatividad infringida por la persona física, sin abreviaturas, sin acentos, ni signos especiales
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
                        Escribir el (los) artículo (s) infringido (s)
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
                        En su caso, escribir la (s) fracción (es) infringida (s)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );
      })}

    </div>
  );
};
