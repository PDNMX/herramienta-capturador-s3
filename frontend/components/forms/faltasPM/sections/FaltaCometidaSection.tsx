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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, AlertCircle } from "lucide-react";
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
  };

  return (
    <div className="space-y-6">
      {/* Descripción de la sección */}
      <p className="text-sm text-muted-foreground">
        En el presente apartado se establecen los datos concernientes al tipo de falta cometida
      </p>

      {fields.map((field, index) => {
        const claveValue = form.watch(`faltaCometida.${index}.clave`);

        return (
          <div
            key={field.id}
            className="rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg relative"
          >
            {/* Botón eliminar (solo si hay más de una falta) */}
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
                  Falta Cometida {index + 1}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {fields.length > 1 
                    ? `Registrando ${fields.length} faltas administrativas. Puede agregar o eliminar faltas según sea necesario.`
                    : "Puede agregar múltiples faltas cometidas usando el botón al final de esta sección."
                  }
                </p>
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

              {/* Normatividades Infringidas (O2M nested) - MOVIDO AQUÍ */}
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

              {/* Descripción de los hechos - MOVIDO AL FINAL */}
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

      {/* Botón para agregar otra falta */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddFalta}
        disabled={loading}
        className="w-full border-dashed border-2 h-12"
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar otra falta cometida
      </Button>

      {/* Ayuda adicional */}
      {fields.length === 1 && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/30">
          <div className="bg-blue-100 dark:bg-blue-800/30 rounded p-1 mt-0.5">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>¿Múltiples faltas?</strong> Si la persona moral cometió más de una falta administrativa, 
              puede agregar cada una de ellas con sus respectivas normatividades infringidas utilizando el botón de arriba.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};