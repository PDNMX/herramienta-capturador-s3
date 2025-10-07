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
    message: "Debes seleccionar un ente público.",
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
  const [entesPublicos, setEntesPublicos] = useState([]);
  const { session } = useCurrentSession();

  const title = initialData 
    ? "Actualizar falta grave" 
    : "Registrar falta grave";
  const description = initialData
    ? "Edita la información de la falta administrativa grave"
    : "Registra una nueva falta administrativa grave de persona moral";
  const toastMessage = initialData
    ? "Falta grave actualizada"
    : "Nueva falta grave registrada.";
  const action = initialData ? "Actualizar" : "Guardar";

  const defaultValues = useMemo(
    () => ({
      entePublico: initialData?.entePublico ?? "",
      status: initialData?.status ?? "NO_FIRME",
      fecha: initialData?.fecha ?? new Date().toISOString().split('T')[0],
      expediente: initialData?.expediente ?? "",
      observaciones: initialData?.observaciones ?? "",
    }),
    [initialData],
  );

  const form = useForm<FaltasGravesPMFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Cargar entes públicos disponibles según el usuario
  useEffect(() => {
    if (session) {
      const fetchEntesPublicos = async () => {
        try {
          // Aquí cargarás los entes públicos del usuario
          // Por ahora un ejemplo básico
          const mockEntes = [
            { id: 1, nombre: "Ente Público 1" },
            { id: 2, nombre: "Ente Público 2" },
          ];
          setEntesPublicos(mockEntes);
          
          // Si es nuevo registro, pre-seleccionar el ente del usuario
          if (!initialData && mockEntes.length > 0) {
            form.setValue("entePublico", mockEntes[0].id.toString());
          }
        } catch (error) {
          console.error("Error al cargar entes públicos:", error);
        }
      };
      fetchEntesPublicos();
    }
  }, [session, initialData, form]);

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
      router.push(`/inicio/faltas-graves-pm`);
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
          
          {/* Sección 1: Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            
            <div className="md:grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="entePublico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ente Público <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un ente público" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {entesPublicos.map((ente) => (
                          <SelectItem key={ente.id} value={ente.id.toString()}>
                            {ente.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <SelectItem value="EN_PROCESO">En Proceso</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Fecha <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expediente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Número de Expediente <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Ej: EXP-2025-001"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Observaciones adicionales..."
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Información adicional relevante sobre el caso
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