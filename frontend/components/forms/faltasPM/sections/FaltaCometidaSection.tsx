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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Layers } from "lucide-react";
import { NormatividadFields } from "./NormatividadFields";

interface FaltaCometidaSectionProps {
  form: any;
  loading: boolean;
}

const TIPOS_FALTA = [
  { value: "SOBORNO", label: "Soborno" },
  { value: "PARTICIPACION_ILICITA", label: "Participación ilícita" },
  { value: "TRAFICO_INFLUENCIAS", label: "Tráfico de influencias" },
  { value: "UTILIZACION_INFORMACION_FALSA", label: "Utilización de información falsa" },
  { value: "COLUSION", label: "Colusión" },
  { value: "OBSTRUCCION_FACULTADES", label: "Obstrucción de facultades" },
  { value: "CONTRATACION_INDEBIDA", label: "Contratación indebida" },
  { value: "USO_INDEBIDO_RECURSOS_PUBLICOS", label: "Uso indebido de recursos públicos" },
  { value: "OTRO", label: "Otro (especifique)" },
];

export const FaltaCometidaSection: React.FC<FaltaCometidaSectionProps> = ({
  form,
  loading,
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "faltaCometida",
  });

  const containerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const lastAddedIdRef = useRef<string | null>(null);

  const handleAddFalta = () => {
    append({
      clave: "",
      valor: null,
      descripcionHechos: "",
      normatividadInfringida: [{
        nombreNormatividad: "",
        articulo: "",
        fraccion: null,
      }],
    });
    // Mark the next render's newest item for animation
    lastAddedIdRef.current = "pending";
  };

  const handleRemoveFalta = useCallback((index: number, fieldId: string) => {
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
    <div className="space-y-6">
      {/* Section header with counter badge */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground flex-1">
          En el presente apartado se establecen los datos concernientes al tipo de falta cometida
        </p>
        <div className="flex items-center gap-2 ml-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span className={`text-sm font-semibold text-primary ${fields.length > 1 ? "animate-badge-pulse" : ""}`}>
              {fields.length}
            </span>
            <span className="text-xs text-muted-foreground">
              {fields.length === 1 ? "registro" : "registros"}
            </span>
          </div>
        </div>
      </div>

      {/* Botón para agregar otra falta - al inicio para mayor visibilidad */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddFalta}
        disabled={loading}
        className="w-full border-dashed border-2 h-14 group hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-300">
            <Plus className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">Agregar otra falta cometida</span>
            <span className="text-xs text-muted-foreground">
              Se pueden registrar múltiples faltas para una misma persona moral
            </span>
          </div>
        </div>
      </Button>

      {fields.map((field, index) => {
        const claveValue = form.watch(`faltaCometida.${index}.clave`);

        // Determine if this item was just added
        const isNewItem = lastAddedIdRef.current === "pending" && index === fields.length - 1;
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
              rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg relative
              border-l-4 border-l-primary/60
              transition-all duration-300 hover:shadow-xl hover:border-primary/30
              ${shouldAnimate ? "animate-array-item-enter" : ""}
            `}
          >
            {/* Botón eliminar (solo si hay más de una falta) */}
            {fields.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-4 right-4 transition-opacity duration-200"
                onClick={() => handleRemoveFalta(index, field.id)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}

            <div className="space-y-6">
              <div className="border-b pb-3 flex items-center gap-3">
                {/* Numbered circle indicator */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center border border-primary/30">
                  <span className="text-sm font-bold text-primary">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-primary mb-0.5">
                    Falta Cometida {index + 1}
                    {fields.length > 1 && (
                      <span className="text-xs font-normal text-muted-foreground ml-2">
                        de {fields.length}
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {fields.length > 1
                      ? `Registrando ${fields.length} faltas administrativas. Puede agregar o eliminar faltas según sea necesario.`
                      : "Puede agregar múltiples faltas cometidas usando el botón de arriba."
                    }
                  </p>
                </div>
              </div>

              {/* Tipo de falta */}
              <FormField
                control={form.control}
                name={`faltaCometida.${index}.clave`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tipo de falta <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de falta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIPOS_FALTA.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Seleccionar el (los) tipo (s) de falta (s) cometida (s) por la persona moral sancionada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo valor - solo si clave === "OTRO" */}
              {claveValue === "OTRO" && (
                <FormField
                  control={form.control}
                  name={`faltaCometida.${index}.valor`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Especifique el tipo de falta <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Ej: Faltas de particulares en situación especial"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        En caso de seleccionar la opción "OTRO", se deberá especificar el tipo de falta cometida.
                        Puede escribir "FALTAS_PARTICULARES_ESPECIAL" o un texto libre.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Normatividades Infringidas (O2M nested) */}
              <div className="border-t border-b py-6">
                <div className="mb-4">
                  <h5 className="font-semibold text-base text-primary mb-1">
                    Normatividad(es) Infringida(s)
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    Agregue una o más normatividades que fueron infringidas por esta falta.
                  </p>
                </div>
                <NormatividadFields
                  form={form}
                  loading={loading}
                  faltaIndex={index}
                />
              </div>

              {/* Descripción de los hechos */}
              <FormField
                control={form.control}
                name={`faltaCometida.${index}.descripcionHechos`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Descripción breve de los hechos <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="Redactar una descripción breve de los hechos..."
                        className="min-h-[120px]"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Redactar una descripción breve de los hechos, sin incluir información reservada o confidencial,
                      de conformidad con la normatividad en materia de transparencia y protección de datos personales
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );
      })}

    </div>
  );
};
