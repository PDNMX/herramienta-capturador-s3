// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import directus from "@/lib/directus";
import { createItem, updateItem, readItems, withToken } from "@directus/sdk";
import { Combobox } from "@/components/ui/combobox";
import { MultiSelect } from "@/components/ui/multi-select";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  oic: z
    .number()
    .nullable()
    .refine((value) => value !== null, {
      message: "Debe seleccionar una Autoridad Resolutora",
    }),
  sujetosObligados: z
    .array(z.number())
    .min(1, "Debe seleccionar al menos un Sujeto Obligado"),
  puesto: z.string().min(3, {
    message: "El puesto debe tener al menos 3 caracteres.",
  }),
  nombre: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  correoElectronico: z.string().email({
    message: "Debe ser un correo electrónico válido.",
  }),
  telefono: z
    .string()
    .regex(
      /^\d{10}$/,
      "El teléfono debe contener exactamente 10 dígitos numéricos"
    )
    .optional()
    .or(z.literal("")),
  direccion: z
    .string()
    .nullish()
    .transform((value) => value || ""),
  entidad: z.string(),
});

type DirectorioFormValues = z.infer<typeof formSchema>;

interface DirectorioFormProps {
  initialData: any | null;
}

export const DirectorioForm: React.FC<DirectorioFormProps> = ({
  initialData,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [oicOptions, setOicOptions] = useState([]);
  const [existingOicIds, setExistingOicIds] = useState(new Set());
  const [sujetosObligadosOptions, setSujetosObligadosOptions] = useState([]);
  const [existingSujetosObligadosIds, setExistingSujetosObligadosIds] =
    useState(new Set());
  const { session } = useCurrentSession();

  const title = initialData ? "Actualizar Directorio" : "Crear Directorio";
  const description = initialData
    ? "Edita la información del directorio"
    : "Agrega un nuevo registro al directorio";
  const toastMessage = initialData
    ? "Registro del directorio actualizado"
    : "Nuevo registro del directorio creado.";
  const action = initialData ? "Actualizar" : "Crear";

  const defaultValues = {
    oic: initialData?.oic ?? null,
    sujetosObligados: initialData?.sujetosObligados ?? [],
    puesto: initialData?.puesto ?? "",
    nombre: initialData?.nombre ?? "",
    correoElectronico: initialData?.correoElectronico ?? "",
    telefono: initialData?.telefono ?? "",
    direccion: initialData?.direccion ?? "",
    entidad: session?.user?.entidad || "",
  };

  const form = useForm<DirectorioFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    const fetchOicOptions = async () => {
      if (!session?.access_token) return;

      try {
        const response = await directus.request(
          withToken(
            session.access_token,
            readItems("entes", {
              filter: {
                _or: [
                  { controlOIC: { _eq: true } },
                  { controlTribunal: { _eq: true } },
                ],
              },
              fields: ["id", "nombre"],
              limit: -1,
            })
          )
        );

        setOicOptions(
          response.map((ente) => ({
            value: ente.id,
            label: ente.nombre,
          }))
        );
      } catch (error) {
        console.error("Error al cargar las opciones de OIC", error);
      }
    };

    const fetchExistingIds = async () => {
      if (!session?.access_token) return;

      try {
        const response = await directus.request(
          withToken(
            session.access_token,
            readItems("directorio", {
              fields: ["oic", "sujetosObligados"],
              limit: -1,
            })
          )
        );

        const oicIds = new Set(
          response.map((item) => item.oic).filter(Boolean)
        );
        setExistingOicIds(oicIds);

        const sujetosObligadosIds = new Set(
          response
            .flatMap((item) => item.sujetosObligados || [])
            .filter(Boolean)
        );
        setExistingSujetosObligadosIds(sujetosObligadosIds);
      } catch (error) {
        console.error("Error al obtener IDs existentes", error);
      }
    };

    const fetchSujetosObligadosOptions = async () => {
      if (!session?.access_token) return;

      try {
        const response = await directus.request(
          withToken(
            session.access_token,
            readItems("entes", {
              filter: { controlOIC: { _eq: false } },
              fields: ["id", "nombre"],
              limit: -1,
            })
          )
        );
        setSujetosObligadosOptions(
          response.map((ente) => ({
            value: Number(ente.id),
            label: ente.nombre,
          }))
        );
      } catch (error) {
        console.error(
          "Error al cargar las opciones de Sujetos Obligados",
          error
        );
      }
    };

    fetchOicOptions();
    fetchExistingIds();
    fetchSujetosObligadosOptions();

    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        if (key in defaultValues) {
          form.setValue(key as keyof DirectorioFormValues, initialData[key]);
        }
      });
    } else if (session?.user?.entidad) {
      form.setValue("entidad", session.user.entidad);
    }
  }, [session, initialData, form]);

  const onSubmit = async (data: DirectorioFormValues) => {
    try {
      setLoading(true);
      const formattedData = {
        ...data,
        telefono: data.telefono || null,
        direccion: data.direccion || null,
      };

      if (initialData) {
        await directus.request(
          withToken(
            session?.access_token,
            updateItem("directorio", initialData.id, formattedData)
          )
        );
      } else {
        await directus.request(
          withToken(
            session?.access_token,
            createItem("directorio", formattedData)
          )
        );
      }
      router.refresh();
      router.push(`/dashboard/directorio`);
      toast({
        variant: "default",
        className: "bg-green-600",
        title: "",
        description: toastMessage,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al intentar guardar",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10); // Limitamos a 10 dígitos
    onChange(value);
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
          className="space-y-8 w-full"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="md:grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="oic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Órgano Interno de Control{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          options={oicOptions.filter(
                            (option) =>
                              !existingOicIds.has(option.value) ||
                              option.value === field.value
                          )}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          placeholder="Buscar y seleccionar OIC"
                        />
                      </FormControl>
                      <FormDescription>
                        Seleccione el Órgano Interno de Control correspondiente.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sujetosObligados"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Ente(s) Público(s){" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={sujetosObligadosOptions.filter(
                            (option) =>
                              !existingSujetosObligadosIds.has(option.value) ||
                              (initialData?.sujetosObligados &&
                                initialData.sujetosObligados.includes(
                                  option.value
                                ))
                          )}
                          value={field.value}
                          onChange={(values) => field.onChange(values)}
                          placeholder="Buscar y seleccionar Entes Públicos"
                        />
                      </FormControl>
                      <FormDescription>
                        Seleccione uno o más Entes Públicos asociados.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="md:grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="puesto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Puesto <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Puesto"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Ingrese el puesto o cargo que ocupa.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nombre <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Nombre"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Ingrese su nombre completo.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="correoElectronico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Correo Electrónico{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Correo Electrónico"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Ingrese una dirección de correo electrónico válida.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Teléfono (10 dígitos)"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => handlePhoneChange(e, field.onChange)}
                        />
                      </FormControl>
                      <FormDescription>
                        Ingrese un número de teléfono de 10 dígitos (opcional).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="direccion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Dirección"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Ingrese su dirección completa.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <FormField
            control={form.control}
            name="entidad"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>Entidad</FormLabel>
                <FormControl>
                  <Input disabled readOnly value={field.value} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </FormProvider>
    </>
  );
};
