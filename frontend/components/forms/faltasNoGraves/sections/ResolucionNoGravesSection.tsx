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

interface ResolucionNoGravesSectionProps {
  form: any;
  loading: boolean;
}

export const ResolucionNoGravesSection: React.FC<ResolucionNoGravesSectionProps> = ({
  form,
  loading,
}) => {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">En el presente apartado se establecen los datos concernientes a la resolucion firme</p>

      <FormField control={form.control} name="resolucion_tituloResolucion" render={({ field }) => (
        <FormItem><FormLabel>Titulo del documento <span className="text-red-500">*</span></FormLabel><FormControl><Input disabled={loading} placeholder="Ej: Resolucion Administrativa RA-001/2025" {...field} /></FormControl><FormDescription>Escribir el nombre del documento que resuelve el procedimiento de responsabilidad administrativa</FormDescription><FormMessage /></FormItem>
      )} />

      <div className="md:grid md:grid-cols-2 gap-6">
        <FormField control={form.control} name="resolucion_fechaResolucion" render={({ field }) => (
          <FormItem><FormLabel>Fecha de la resolucion (DD-MM-AAAA) <span className="text-red-500">*</span></FormLabel><FormControl><Input type="date" disabled={loading} {...field} className="h-10" /></FormControl><FormDescription>Colocar la fecha en la que se emite la resolucion sancionatoria</FormDescription><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="resolucion_fechaNotificacion" render={({ field }) => (
          <FormItem><FormLabel>Fecha de notificacion (DD-MM-AAAA) <span className="text-red-500">*</span></FormLabel><FormControl><Input type="date" disabled={loading} {...field} className="h-10" /></FormControl><FormDescription>Indicar la fecha en que se notifica la resolucion al servidor publico</FormDescription><FormMessage /></FormItem>
        )} />
      </div>

      <div className="md:grid md:grid-cols-2 gap-6">
        <FormField control={form.control} name="resolucion_fechaResolucionFirme" render={({ field }) => (
          <FormItem><FormLabel>Fecha en que adquirio firmeza (DD-MM-AAAA) <span className="text-red-500">*</span></FormLabel><FormControl><Input type="date" disabled={loading} {...field} className="h-10" /></FormControl><FormDescription>Colocar la fecha en que adquirio firmeza la resolucion</FormDescription><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="resolucion_fechaNotificacionFirme" render={({ field }) => (
          <FormItem><FormLabel>Fecha de notificacion de la resolucion firme (DD-MM-AAAA) <span className="text-red-500">*</span></FormLabel><FormControl><Input type="date" disabled={loading} {...field} className="h-10" /></FormControl><FormDescription>Indicar la fecha en que se notifica que la resolucion ha quedado firme</FormDescription><FormMessage /></FormItem>
        )} />
      </div>

      <FormField control={form.control} name="resolucion_fechaEjecucion" render={({ field }) => (
        <FormItem><FormLabel>Fecha de ejecucion de la sancion (DD-MM-AAAA)</FormLabel><FormControl><Input type="date" disabled={loading} {...field} className="h-10" /></FormControl><FormDescription>Anotar la fecha en la que se ejecuto la sancion. Si al momento de registrar la informacion no se cuenta con el dato, este podra registrarse posteriormente</FormDescription><FormMessage /></FormItem>
      )} />

      <FormField control={form.control} name="resolucion_autoridadResolutora" render={({ field }) => (
        <FormItem><FormLabel>Autoridad resolutora <span className="text-red-500">*</span></FormLabel><FormControl><Input disabled={loading} placeholder="Ej: Tribunal de Justicia Administrativa" {...field} /></FormControl><FormDescription>Indicar el nombre de la autoridad facultada para dictar la sancion</FormDescription><FormMessage /></FormItem>
      )} />

      <FormField control={form.control} name="resolucion_autoridadInvestigadora" render={({ field }) => (
        <FormItem><FormLabel>Autoridad investigadora <span className="text-red-500">*</span></FormLabel><FormControl><Input disabled={loading} placeholder="Ej: Organo Interno de Control" {...field} /></FormControl><FormDescription>Especificar el nombre de la autoridad encargada de la investigacion</FormDescription><FormMessage /></FormItem>
      )} />

      <FormField control={form.control} name="resolucion_autoridadSubstanciadora" render={({ field }) => (
        <FormItem><FormLabel>Autoridad substanciadora <span className="text-red-500">*</span></FormLabel><FormControl><Input disabled={loading} placeholder="Ej: Autoridad Substanciadora del OIC" {...field} /></FormControl><FormDescription>Señalar el nombre de la autoridad substanciadora del procedimiento</FormDescription><FormMessage /></FormItem>
      )} />
    </div>
  );
};
