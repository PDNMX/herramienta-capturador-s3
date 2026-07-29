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

interface ResolucionNoGravesSectionProps {
  form: any;
  loading: boolean;
}

export const ResolucionNoGravesSection: React.FC<ResolucionNoGravesSectionProps> = ({
  form,
  loading,
}) => {
  const [ordenJurisdiccional, setOrdenJurisdiccional] = useState(
    form.watch("resolucion_ordenJurisdiccional") ?? null
  );

  const handleOrdenClick = (value: string) => {
    if (ordenJurisdiccional === value) {
      setOrdenJurisdiccional(null);
      form.setValue("resolucion_ordenJurisdiccional", null);
    } else {
      setOrdenJurisdiccional(value);
      form.setValue("resolucion_ordenJurisdiccional", value);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">En el presente apartado se establecen los datos concernientes a la resolución firme</p>

      <FormField control={form.control} name="resolucion_tituloResolucion" render={({ field }) => (
        <FormItem><FormLabel>Título del documento <span className="text-red-500">*</span></FormLabel><FormControl><Input disabled={loading} placeholder="Ej: Resolución Administrativa RA-001/2025" {...field} /></FormControl><FormDescription>Escribir el nombre del documento que resuelve el procedimiento de responsabilidad administrativa y que ha quedado firme, sin abreviaturas, sin acentos ni signos especiales</FormDescription><FormMessage /></FormItem>
      )} />

      <div className="md:grid md:grid-cols-2 gap-6">
        <FormField control={form.control} name="resolucion_fechaResolucion" render={({ field }) => (
          <FormItem><FormLabel>Fecha de la resolución (DD-MM-AAAA) <span className="text-red-500">*</span></FormLabel><FormControl><Input type="date" disabled={loading} {...field} className="h-10" /></FormControl><FormDescription>Colocar la fecha en la que se emite la resolución sancionatoria</FormDescription><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="resolucion_fechaNotificacion" render={({ field }) => (
          <FormItem><FormLabel>Fecha de notificación (DD-MM-AAAA) <span className="text-red-500">*</span></FormLabel><FormControl><Input type="date" disabled={loading} {...field} className="h-10" /></FormControl><FormDescription>Indicar la fecha en que se notifica la resolución definitiva a la persona servidora pública sancionada</FormDescription><FormMessage /></FormItem>
        )} />
      </div>

      <div className="md:grid md:grid-cols-2 gap-6">
        <FormField control={form.control} name="resolucion_fechaResolucionFirme" render={({ field }) => (
          <FormItem><FormLabel>Fecha en que adquirió firmeza la resolución (DD-MM-AAAA) <span className="text-red-500">*</span></FormLabel><FormControl><Input type="date" disabled={loading} {...field} className="h-10" /></FormControl><FormDescription>Colocar la fecha en que adquirió firmeza la resolución de la persona servidora pública</FormDescription><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="resolucion_fechaNotificacionFirme" render={({ field }) => (
          <FormItem><FormLabel>Fecha de notificación de la resolución firme (DD-MM-AAAA) <span className="text-red-500">*</span></FormLabel><FormControl><Input type="date" disabled={loading} {...field} className="h-10" /></FormControl><FormDescription>Indicar la fecha en que se notifica que la resolución ha quedado firme</FormDescription><FormMessage /></FormItem>
        )} />
      </div>

      <FormField control={form.control} name="resolucion_fechaEjecucion" render={({ field }) => (
        <FormItem><FormLabel>Fecha de ejecución de la sanción (DD-MM-AAAA)</FormLabel><FormControl><Input type="date" disabled={loading} {...field} className="h-10" /></FormControl><FormDescription>Anotar la fecha en la que se ejecutó la sanción a la persona servidora pública. <p> Si al momento de registrar la información la autoridad no cuenta con el dato señalado en el presente numeral, este podrá registrarse posteriormente mediante una actualización de su registro </p></FormDescription><FormMessage /></FormItem>
      )} />

      <FormField
        control={form.control}
        name="resolucion_ordenJurisdiccional"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Orden jurisdiccional <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: "FEDERAL", label: "Federal" },
                  { value: "ESTATAL", label: "Estatal" },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => !loading && handleOrdenClick(option.value)}
                    className={`relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors ${ordenJurisdiccional === option.value ? "border-primary bg-accent" : "border-muted"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${ordenJurisdiccional === option.value ? "border-primary" : "border-muted-foreground"}`}>
                        {ordenJurisdiccional === option.value && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <div className="flex-1">
                        <Label className="font-medium cursor-pointer">{option.label}</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormDescription>Seleccionar la opción correspondiente al orden jurisdiccional del Ente público que emitió la resolución</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField control={form.control} name="resolucion_autoridadResolutora" render={({ field }) => (
        <FormItem><FormLabel>Autoridad resolutora <span className="text-red-500">*</span></FormLabel><FormControl><Input disabled={loading} placeholder="Ej: Tribunal de Justicia Administrativa" {...field} /></FormControl><FormDescription>Indicar el nombre de la autoridad facultada para dictar la sanción</FormDescription><FormMessage /></FormItem>
      )} />

      <FormField control={form.control} name="resolucion_autoridadInvestigadora" render={({ field }) => (
        <FormItem><FormLabel>Autoridad investigadora <span className="text-red-500">*</span></FormLabel><FormControl><Input disabled={loading} placeholder="Ej: Órgano Interno de Control" {...field} /></FormControl><FormDescription>Especificar el nombre de la autoridad encargada de la investigación de la falta administrativa grave</FormDescription><FormMessage /></FormItem>
      )} />

      <FormField control={form.control} name="resolucion_autoridadSusbstanciadora" render={({ field }) => (
        <FormItem><FormLabel>Autoridad substanciadora <span className="text-red-500">*</span></FormLabel><FormControl><Input disabled={loading} placeholder="Ej: Autoridad Substanciadora del OIC" {...field} /></FormControl><FormDescription>Señalar el nombre de la autoridad substanciadora del procedimiento</FormDescription><FormMessage /></FormItem>
      )} />
    </div>
  );
};
