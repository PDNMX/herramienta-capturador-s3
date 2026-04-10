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
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Layers } from "lucide-react";
import { AmonestacionNoGravesFields } from "./tipoSancion/AmonestacionNoGravesFields";
import { SuspensionEmpleoNoGravesFields } from "./tipoSancion/SuspensionEmpleoNoGravesFields";
import { DestitucionEmpleoNoGravesFields } from "./tipoSancion/DestitucionEmpleoNoGravesFields";
import { InhabilitacionNoGravesFields } from "./tipoSancion/InhabilitacionNoGravesFields";
import { OtroSancionNoGravesFields } from "./tipoSancion/OtroSancionNoGravesFields";

interface TipoSancionNoGravesSectionProps {
  form: any;
  loading: boolean;
}

const TIPOS_SANCION = [
  { value: "AMONESTACION", label: "Amonestación pública o privada" },
  { value: "SUSPENSION", label: "Suspensión del empleo, cargo o comisión" },
  { value: "DESTITUCION", label: "Destitución del empleo, cargo o comisión" },
  { value: "INHABILITACION", label: "Inhabilitación temporal para desempeñar empleos, cargos o comisiones en el servicio público y para participar en adquisiciones, arrendamientos, servicios u obras públicas" },
  { value: "OTRO", label: "Otro (especifique)" },
];

export const TipoSancionNoGravesSection: React.FC<TipoSancionNoGravesSectionProps> = ({
  form,
  loading,
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tipoSancion",
  });

  const containerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const lastAddedIdRef = useRef<string | null>(null);

  const handleAddSancion = () => {
    append({
      clave: "",
      amonestacion: null,
      suspensionEmpleo: null,
      destitucionEmpleo: null,
      inhabilitacion: null,
      otro: null,
    });
    lastAddedIdRef.current = "pending";
  };

  const handleRemoveSancion = useCallback((index: number, fieldId: string) => {
    const el = containerRefs.current.get(fieldId);
    if (el) {
      el.classList.add("array-item-removing");
      el.addEventListener("animationend", () => { remove(index); }, { once: true });
    } else { remove(index); }
  }, [remove]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground flex-1">Este apartado se refiere a los datos concernientes a la sancion y/o sanciones impuestas al servidor publico</p>
        <div className="flex items-center gap-2 ml-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span className={`text-sm font-semibold text-primary ${fields.length > 1 ? "animate-badge-pulse" : ""}`}>{fields.length}</span>
            <span className="text-xs text-muted-foreground">{fields.length === 1 ? "sancion" : "sanciones"}</span>
          </div>
        </div>
      </div>

      <Button type="button" variant="outline" onClick={handleAddSancion} disabled={loading} className="w-full border-dashed border-2 h-14 group hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-300"><Plus className="h-4 w-4 text-primary" /></div>
          <div className="flex flex-col items-start"><span className="text-sm font-medium">Agregar otro tipo de sancion</span><span className="text-xs text-muted-foreground">Se pueden registrar multiples sanciones para un mismo servidor publico</span></div>
        </div>
      </Button>

      {fields.map((field, index) => {
        const claveValue = form.watch(`tipoSancion.${index}.clave`);
        const isNewItem = lastAddedIdRef.current === "pending" && index === fields.length - 1;
        if (isNewItem) lastAddedIdRef.current = field.id;
        const shouldAnimate = lastAddedIdRef.current === field.id;

        return (
          <div key={field.id} ref={(el) => { if (el) containerRefs.current.set(field.id, el); else containerRefs.current.delete(field.id); }} className={`rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg relative border-l-4 border-l-primary/60 transition-all duration-300 hover:shadow-xl hover:border-primary/30 ${shouldAnimate ? "animate-array-item-enter" : ""}`}>
            {fields.length > 1 && (
              <Button type="button" variant="destructive" size="sm" className="absolute top-4 right-4 transition-opacity duration-200" onClick={() => handleRemoveSancion(index, field.id)} disabled={loading}><Trash2 className="h-4 w-4 mr-2" />Eliminar</Button>
            )}

            <div className="space-y-6">
              <div className="border-b pb-3 flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center border border-primary/30"><span className="text-sm font-bold text-primary">{index + 1}</span></div>
                <div>
                  <h4 className="font-semibold text-lg text-primary mb-0.5">Tipo de Sancion {index + 1}{fields.length > 1 && <span className="text-xs font-normal text-muted-foreground ml-2">de {fields.length}</span>}</h4>
                  <p className="text-xs text-muted-foreground">{fields.length > 1 ? `Registrando ${fields.length} sanciones. Puede agregar o eliminar segun sea necesario.` : "Puede agregar multiples sanciones usando el boton de arriba."}</p>
                </div>
              </div>

              <FormField control={form.control} name={`tipoSancion.${index}.clave`} render={({ field }) => (
                <FormItem><FormLabel>Tipo de sancion <span className="text-red-500">*</span></FormLabel><FormControl><Combobox options={TIPOS_SANCION} value={field.value} onChange={field.onChange} placeholder="Selecciona el tipo de sancion" disabled={loading} searchPlaceholder="Buscar tipo de sancion..." /></FormControl><FormDescription>Elegir la sancion, segun corresponda, conforme al catalogo y que fue dictaminada en la resolucion definitiva</FormDescription><FormMessage /></FormItem>
              )} />

              {claveValue === "AMONESTACION" && (<AmonestacionNoGravesFields form={form} loading={loading} sancionIndex={index} />)}
              {claveValue === "SUSPENSION" && (<SuspensionEmpleoNoGravesFields form={form} loading={loading} sancionIndex={index} />)}
              {claveValue === "DESTITUCION" && (<DestitucionEmpleoNoGravesFields form={form} loading={loading} sancionIndex={index} />)}
              {claveValue === "INHABILITACION" && (<InhabilitacionNoGravesFields form={form} loading={loading} sancionIndex={index} />)}
              {claveValue === "OTRO" && (<OtroSancionNoGravesFields form={form} loading={loading} sancionIndex={index} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
