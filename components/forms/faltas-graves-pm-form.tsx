// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, useMemo } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import directus from "@/lib/directus";
import { createItem, updateItem, withToken } from "@directus/sdk";

const formSchema = z.object({
  entePublico: z.string().min(1, {
    message: "Ente público es requerido.",
  }),
  status: z.enum(["NO_FIRME", "FIRME", "EN_PROCESO"], {
    message: "Selecciona un estatus válido",
  }),
  fecha: z.string().min(1, {
    message: "La fecha es requerida.",
  }),
  expediente: z.string().min(3, {
    message: "El número de expediente debe tener al menos 3 caracteres.",
  }),
  observaciones: z.string().nullable().optional(),
  
  // Campos de relaciones - se agregarán después
  // datosGenerales: z.string().nullable().optional(),
  // datosDirGeneralReprLegal: z.string().nullable().optional(),
  // dondeCometioLaFalta: z.string().nullable().optional(),
  // origenProcedimiento: z.string().nullable().optional(),
  // faltaCometida: z.string().nullable().optional(),
  // resolucion: z.string().nullable().optional(),
  // tipoSancion: z.string().nullable().optional(),
});

type FaltasGravesPMFormValues = z.infer<typeof formSchema>;

interface FaltasGravesPMFormProps {
  initialData: any | null;
}

export const FaltasGravesPMForm: React.FC<FaltasGravesPMFormProps> = ({ 
  initialData 
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { session } = useCurrentSession();

  const title = initialData 
    ? "Actualizar falta grave personas morales" 
    : "Registrar una nueva falta grave personas morales";
  const description = initialData
    ? "Edita la información de la falta administrativa grave"
    : "Formato que indica los datos que se inscribirán en el Sistema Nacional de Servidores Públicos y Particulares Sancionados de la Plataforma Digital Nacional relacionados con las sanciones firmes impuestas a particulares (personas morales) vinculados con faltas administrativas graves en términos de la Ley General de Responsabilidades Administrativas.";
  const toastMessage = initialData
    ? "Falta grave actualizada"
    : "Nueva falta grave registrada.";
  const action = initialData ? "Actualizar" : "Guardar";

  const defaultValues = useMemo(
    () => ({
      entePublico: initialData?.entePublico ?? session?.user?.entePublico ?? "",
      status: initialData?.status ?? "NO_FIRME",
      fecha: initialData?.fecha ?? new Date().toISOString().split('T')[0],
      expediente: initialData?.expediente ?? "",
      observaciones: initialData?.observaciones ?? "",
    }),
    [initialData, session?.user?.entePublico],
  );

  const form = useForm<FaltasGravesPMFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Establecer el entePublico desde la sesión cuando carga el componente
  useEffect(() => {
    if (initialData) {
      // Si hay datos iniciales, cargar todos los campos
      for (const key in initialData) {
        if (formSchema.shape.hasOwnProperty(key)) {
          form.setValue(key, initialData[key]);
        }
      }
    } else {
      // Si es nuevo registro, establecer el entePublico del usuario
      if (session && session.user?.entePublico) {
        form.setValue("entePublico", session.user.entePublico);
      }
    }
  }, [initialData, form.setValue, session]);

  const onSubmit = async (data: FaltasGravesPMFormValues) => {
    try {
      setLoading(true);
      console.log(data);
      
      if (initialData) {
        await directus.request(
          withToken(
            session?.access_token,
            updateItem("faltas_graves_personas_morales", initialData.id, data),
          ),
        );
      } else {
        await directus.request(
          withToken(
            session?.access_token,
            createItem("faltas_graves_personas_morales", data),
          ),
        );
      }
      
      router.refresh();
      router.push(`/dashboard/faltas-graves-pm`);
      toast({
        variant: "default",
        className: "bg-green-600",
        title: "Éxito",
        description: toastMessage,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al intentar guardar el registro",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full">
          
          {/* Campo oculto para entePublico */}
          <FormField
            control={form.control}
            name="entePublico"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>Ente Público</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    readOnly
                    placeholder="Automático del usuario"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nota de campos obligatorios */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800 p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-semibold">Nota:</span> Todos los campos señalados con un asterisco (*) son de carácter obligatorio.
            </p>
          </div>

          <div className="space-y-6">
            {/* Estatus - Campo sin enumerar */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Estatus <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estatus" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NO_FIRME">No Firme</SelectItem>
                      <SelectItem value="FIRME">Firme</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:grid md:grid-cols-2 gap-6">
              {/* Campo 1: Fecha */}
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      1. Fecha (DD-MM-AAAA) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Indicar la fecha en la que se registra la información
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo 2: Expediente */}
              <FormField
                control={form.control}
                name="expediente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      2. Expediente <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Ej: EXP-2025-001"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Registrar el número de expediente en el que recae la resolución
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Campo 10: Observaciones */}
            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>10. Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Ej: Información adicional sobre el caso..."
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    En este espacio podrá realizar las aclaraciones u observaciones que considere pertinentes respecto de alguno o algunos de los apartados del documento.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Sección 2: Datos Generales (placeholder para después) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-muted-foreground">
              Datos Generales
            </h3>
            <p className="text-sm text-muted-foreground">
              Esta sección se configurará en el siguiente paso
            </p>
          </div>

          <Separator />

          {/* Sección 3: Director General / Representante Legal (placeholder) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-muted-foreground">
              Director General / Representante Legal
            </h3>
            <p className="text-sm text-muted-foreground">
              Esta sección se configurará en el siguiente paso
            </p>
          </div>

          <Separator />

          {/* Botones de acción */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}>
              Cancelar
            </Button>
            <Button disabled={loading} type="submit">
              {action}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};