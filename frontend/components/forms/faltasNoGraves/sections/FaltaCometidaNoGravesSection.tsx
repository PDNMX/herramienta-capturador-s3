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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Layers } from "lucide-react";
import { NormatividadNoGravesFields } from "./NormatividadNoGravesFields";

interface FaltaCometidaNoGravesSectionProps {
  form: any;
  loading: boolean;
}

const TIPOS_FALTA = [
  { value: "CUMPLIR_FUNCIONES_DISCIPLINA_RESPETO", label: "Incumplir con las funciones, atribuciones y comisiones encomendadas, observando en todo momento las instrucciones que les indique el superior jerárquico, salvo que estas sean contrarias a derecho; así como no observar las medidas disciplinarias establecidas en las disposiciones aplicables y las que regulen el funcionamiento del ente público" },
  { value: "DENUNCIAR_FALTAS_ADMINISTRATIVAS", label: "No denunciar por escrito al superior jerárquico o al Órgano interno de control las faltas administrativas de que tenga conocimiento" },
  { value: "ATENDER_INSTRUCCIONES_EVITAR_CONFLICTO_INTERES", label: "No atender las instrucciones del superior jerárquico respecto a su deber de abstención para evitar conflictos de intereses" },
  { value: "PRESENTAR_DECLARACIONES_PATRIMONIALES", label: "No presentar en tiempo y forma las declaraciones de situación patrimonial y de intereses, en los términos establecidos en el Título Tercero de la presente Ley, así como presentar dichas declaraciones con información falsa o sin incluir la información relevante" },
  { value: "SUPERVISAR_ACCIONES_INFERIORES_JERARQUICOS", label: "No supervisar las acciones de los servidores públicos bajo su mando, con la finalidad de que desempeñen sus empleos, cargos o comisiones conforme a las disposiciones de esta Ley" },
  { value: "RENDIR_CUENTAS_INFORMES", label: "No rendir cuentas sobre el ejercicio de las funciones que tenga encomendadas y no proporcionar la documentación e información que le sea requerida, en los plazos que establezca la ley" },
  { value: "COLABORAR_PROCEDIMIENTOS_AUDITORIA", label: "No colaborar en los procedimientos de responsabilidades administrativas, de control y de auditoría" },
  { value: "CAUSAR_DANO_PATRIMONIO_PUBLICO", label: "Causar daños y perjuicios al patrimonio público o privado de las personas, por negligencia o imprudencia en el desempeño del empleo, cargo o comisión" },
  { value: "INCUMPLIR_DISPOSICIONES_DECLARACIONES", label: "Incumplir con las disposiciones establecidas en la presente Ley en materia de evolución patrimonial, declaración de intereses y constancia de presentación de declaración fiscal" },
  { value: "OTRO", label: "Otro (especifique)" },
];

export const FaltaCometidaNoGravesSection: React.FC<FaltaCometidaNoGravesSectionProps> = ({
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
      normatividadInfringida: [{ nombreNormatividad: "", articulo: "", fraccion: null }],
    });
    lastAddedIdRef.current = "pending";
  };

  const handleRemoveFalta = useCallback((index: number, fieldId: string) => {
    const el = containerRefs.current.get(fieldId);
    if (el) {
      el.classList.add("array-item-removing");
      el.addEventListener("animationend", () => { remove(index); }, { once: true });
    } else {
      remove(index);
    }
  }, [remove]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground flex-1">En el presente apartado se establecen los datos concernientes al tipo de falta cometida</p>
        <div className="flex items-center gap-2 ml-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span className={`text-sm font-semibold text-primary ${fields.length > 1 ? "animate-badge-pulse" : ""}`}>{fields.length}</span>
            <span className="text-xs text-muted-foreground">{fields.length === 1 ? "registro" : "registros"}</span>
          </div>
        </div>
      </div>

      <Button type="button" variant="outline" onClick={handleAddFalta} disabled={loading} className="w-full border-dashed border-2 h-14 group hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-300"><Plus className="h-4 w-4 text-primary" /></div>
          <div className="flex flex-col items-start"><span className="text-sm font-medium">Agregar otra falta cometida</span><span className="text-xs text-muted-foreground">Se pueden registrar multiples faltas para un mismo servidor publico</span></div>
        </div>
      </Button>

      {fields.map((field, index) => {
        const claveValue = form.watch(`faltaCometida.${index}.clave`);
        const isNewItem = lastAddedIdRef.current === "pending" && index === fields.length - 1;
        if (isNewItem) lastAddedIdRef.current = field.id;
        const shouldAnimate = lastAddedIdRef.current === field.id;

        return (
          <div key={field.id} ref={(el) => { if (el) containerRefs.current.set(field.id, el); else containerRefs.current.delete(field.id); }} className={`rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg relative border-l-4 border-l-primary/60 transition-all duration-300 hover:shadow-xl hover:border-primary/30 ${shouldAnimate ? "animate-array-item-enter" : ""}`}>
            {fields.length > 1 && (
              <Button type="button" variant="destructive" size="sm" className="absolute top-4 right-4 transition-opacity duration-200" onClick={() => handleRemoveFalta(index, field.id)} disabled={loading}><Trash2 className="h-4 w-4 mr-2" />Eliminar</Button>
            )}

            <div className="space-y-6">
              <div className="border-b pb-3 flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center border border-primary/30"><span className="text-sm font-bold text-primary">{index + 1}</span></div>
                <div>
                  <h4 className="font-semibold text-lg text-primary mb-0.5">Falta Cometida {index + 1}{fields.length > 1 && <span className="text-xs font-normal text-muted-foreground ml-2">de {fields.length}</span>}</h4>
                  <p className="text-xs text-muted-foreground">{fields.length > 1 ? `Registrando ${fields.length} faltas administrativas. Puede agregar o eliminar faltas segun sea necesario.` : "Puede agregar multiples faltas cometidas usando el boton de arriba."}</p>
                </div>
              </div>

              <FormField control={form.control} name={`faltaCometida.${index}.clave`} render={({ field }) => (
                <FormItem><FormLabel>Tipo de falta <span className="text-red-500">*</span></FormLabel><FormControl><Combobox options={TIPOS_FALTA} value={field.value} onChange={field.onChange} placeholder="Selecciona el tipo de falta" disabled={loading} searchPlaceholder="Buscar tipo de falta..." /></FormControl><FormDescription>Seleccionar el (los) tipo (s) de falta (s) cometida (s) por el servidor publico sancionado</FormDescription><FormMessage /></FormItem>
              )} />

              {claveValue === "OTRO" && (
                <FormField control={form.control} name={`faltaCometida.${index}.valor`} render={({ field }) => (
                  <FormItem><FormLabel>Especifique el tipo de falta <span className="text-red-500">*</span></FormLabel><FormControl><Input disabled={loading} placeholder="Ej: Falta administrativa especial" {...field} value={field.value || ""} /></FormControl><FormDescription>En caso de seleccionar la opcion "OTRO", se debera especificar el tipo de falta cometida.</FormDescription><FormMessage /></FormItem>
                )} />
              )}

              <div className="border-t border-b py-6">
                <div className="mb-4"><h5 className="font-semibold text-base text-primary mb-1">Normatividad(es) Infringida(s)</h5><p className="text-xs text-muted-foreground">Agregue una o mas normatividades que fueron infringidas por esta falta.</p></div>
                <NormatividadNoGravesFields form={form} loading={loading} faltaIndex={index} />
              </div>

              <FormField control={form.control} name={`faltaCometida.${index}.descripcionHechos`} render={({ field }) => (
                <FormItem><FormLabel>Descripcion breve de los hechos <span className="text-red-500">*</span></FormLabel><FormControl><Textarea disabled={loading} placeholder="Redactar una descripcion breve de los hechos..." className="min-h-[120px]" {...field} value={field.value || ""} /></FormControl><FormDescription>Redactar una descripcion breve de los hechos, sin incluir informacion reservada o confidencial</FormDescription><FormMessage /></FormItem>
              )} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
