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
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface OrigenProcedimientoNoGravesSectionProps {
  form: any;
  loading: boolean;
}

export const OrigenProcedimientoNoGravesSection: React.FC<OrigenProcedimientoNoGravesSectionProps> = ({ form, loading }) => {
  const [claveOrigen, setClaveOrigen] = useState(form.watch("origenProcedimiento_clave") || "");

  const handleClaveChange = (value: string) => {
    if (claveOrigen === value) { setClaveOrigen(""); form.setValue("origenProcedimiento_clave", ""); form.setValue("origenProcedimiento_valor", null); }
    else { setClaveOrigen(value); form.setValue("origenProcedimiento_clave", value); if (value !== "OTRO") { form.setValue("origenProcedimiento_valor", null); } }
  };

  const opciones = [
    { value: "ASF_ENTIDADES_FISCALIZACION", label: "Auditoría superior de la federación o entidades de fiscalización superior de las entidades federativas" },
    { value: "AUDITORIA_OIC", label: "Auditoría del órgano interno de control del ente público" },
    { value: "DENUNCIA", label: "Denuncia" },
    { value: "DE_OFICIO", label: "De oficio" },
    { value: "OTRO", label: "Otro (especifique)" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">En el presente apartado se debera señalar el motivo que dio origen a la investigacion por actos vinculados con faltas administrativas no graves por parte del servidor publico</p>

      <FormField control={form.control} name="origenProcedimiento_clave" render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Origen del procedimiento <span className="text-red-500">*</span></FormLabel>
          <FormDescription>Seleccionar conforme al catalogo el origen de la falta administrativa</FormDescription>
          <FormControl>
            <div className="space-y-3">
              {opciones.map((opcion) => (
                <div key={opcion.value} onClick={() => !loading && handleClaveChange(opcion.value)} className={`relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors ${claveOrigen === opcion.value ? "border-primary bg-accent" : "border-muted"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${claveOrigen === opcion.value ? "border-primary" : "border-muted-foreground"}`}>{claveOrigen === opcion.value && (<div className="h-2 w-2 rounded-full bg-primary" />)}</div>
                    <div className="flex-1"><Label className="font-medium cursor-pointer">{opcion.label}</Label></div>
                  </div>
                </div>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      {claveOrigen === "OTRO" && (
        <FormField control={form.control} name="origenProcedimiento_valor" render={({ field }) => (
          <FormItem>
            <FormLabel>Especifique el origen <span className="text-red-500">*</span></FormLabel>
            <FormControl><Input disabled={loading} placeholder="Especifique el motivo que dio origen a la investigación" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>En caso de seleccionar la opcion "OTRO", se debera especificar el motivo que dio origen a la investigacion</FormDescription>
            <FormMessage />
          </FormItem>
        )} />
      )}
    </div>
  );
};
