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
import { DatosGeneralesPMSection } from "@/components/forms/sections/DatosGeneralesPMSection";

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

  // Datos Generales de la Persona Moral
  nombreRazonSocial: z.string().min(3, {
    message: "La denominación o razón social debe tener al menos 3 caracteres.",
  }),
  rfc: z
    .string()
    .min(12, {
      message: "El RFC debe tener al menos 12 caracteres (con homoclave).",
    })
    .max(13),
  objetoSocial: z.string().optional(),
  tipoDomicilio: z
    .enum(["DOMICILIO_MEXICO", "DOMICILIO_EXTRANJERO"])
    .nullable()
    .optional(),

  // Campos de Domicilio México (todos opcionales)
  tipoVialidad: z.string().nullable().optional(),
  nombreVialidad: z.string().nullable().optional(),
  numeroExterior: z.string().nullable().optional(),
  numeroInterior: z.string().nullable().optional(),
  coloniaLocalidad: z.string().nullable().optional(),
  municipioAlcaldia: z.string().nullable().optional(),
  codigoPostal: z.string().nullable().optional(),
  entidadFederativa: z.string().nullable().optional(),

  // Campos de Domicilio Extranjero (todos opcionales)
  ciudad: z.string().nullable().optional(),
  provincia: z.string().nullable().optional(),
  calle: z.string().nullable().optional(),
  numeroExteriorExtranjero: z.string().nullable().optional(),
  numeroInteriorExtranjero: z.string().nullable().optional(),
  codigoPostalExtranjero: z.string().nullable().optional(),
  pais: z.string().nullable().optional(),
});

type FaltasGravesPMFormValues = z.infer<typeof formSchema>;

interface FaltasGravesPMFormProps {
  initialData: any | null;
}

export const FaltasGravesPMForm: React.FC<FaltasGravesPMFormProps> = ({
  initialData,
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
      fecha: initialData?.fecha ?? new Date().toISOString().split("T")[0],
      expediente: initialData?.expediente ?? "",
      observaciones: initialData?.observaciones ?? "",
      // Datos Generales
      nombreRazonSocial: initialData?.datosGenerales?.nombreRazonSocial ?? "",
      rfc: initialData?.datosGenerales?.rfc ?? "",
      objetoSocial: initialData?.datosGenerales?.objetoSocial ?? "",
      tipoDomicilio: initialData?.datosGenerales?.tipoDomicilio ?? null,
      // Domicilio México
      tipoVialidad:
        initialData?.datosGenerales?.domicilioMexico?.tipoVialidad ?? null,
      nombreVialidad:
        initialData?.datosGenerales?.domicilioMexico?.nombreVialidad ?? null,
      numeroExterior:
        initialData?.datosGenerales?.domicilioMexico?.numeroExterior ?? null,
      numeroInterior:
        initialData?.datosGenerales?.domicilioMexico?.numeroInterior ?? null,
      coloniaLocalidad:
        initialData?.datosGenerales?.domicilioMexico?.coloniaLocalidad ?? null,
      municipioAlcaldia:
        initialData?.datosGenerales?.domicilioMexico?.municipioAlcaldia ?? null,
      codigoPostal:
        initialData?.datosGenerales?.domicilioMexico?.codigoPostal ?? null,
      entidadFederativa:
        initialData?.datosGenerales?.domicilioMexico?.entidadFederativa ?? null,
      // Domicilio Extranjero
      ciudad: initialData?.datosGenerales?.domicilioExtranjero?.ciudad ?? null,
      provincia:
        initialData?.datosGenerales?.domicilioExtranjero?.provincia ?? null,
      calle: initialData?.datosGenerales?.domicilioExtranjero?.calle ?? null,
      numeroExteriorExtranjero:
        initialData?.datosGenerales?.domicilioExtranjero?.numeroExterior ??
        null,
      numeroInteriorExtranjero:
        initialData?.datosGenerales?.domicilioExtranjero?.numeroInterior ??
        null,
      codigoPostalExtranjero:
        initialData?.datosGenerales?.domicilioExtranjero?.codigoPostal ?? null,
      pais: initialData?.datosGenerales?.domicilioExtranjero?.pais ?? null,
    }),
    [initialData, session?.user?.entePublico]
  );

  const form = useForm<FaltasGravesPMFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Establecer los datos cuando carga el componente
  useEffect(() => {
    if (initialData) {
      // Cargar campos principales
      for (const key in initialData) {
        if (formSchema.shape.hasOwnProperty(key)) {
          form.setValue(key, initialData[key]);
        }
      }

      // Cargar datos generales si existen
      if (initialData.datosGenerales) {
        form.setValue(
          "nombreRazonSocial",
          initialData.datosGenerales.nombreRazonSocial
        );
        form.setValue("rfc", initialData.datosGenerales.rfc);
        form.setValue("objetoSocial", initialData.datosGenerales.objetoSocial);
        form.setValue(
          "tipoDomicilio",
          initialData.datosGenerales.tipoDomicilio
        );

        // Cargar domicilio México si existe
        if (initialData.datosGenerales.domicilioMexico) {
          const domMex = initialData.datosGenerales.domicilioMexico;
          form.setValue("tipoVialidad", domMex.tipoVialidad);
          form.setValue("nombreVialidad", domMex.nombreVialidad);
          form.setValue("numeroExterior", domMex.numeroExterior);
          form.setValue("numeroInterior", domMex.numeroInterior);
          form.setValue("coloniaLocalidad", domMex.coloniaLocalidad);
          form.setValue("municipioAlcaldia", domMex.municipioAlcaldia);
          form.setValue("codigoPostal", domMex.codigoPostal);
          form.setValue("entidadFederativa", domMex.entidadFederativa);
        }

        // Cargar domicilio Extranjero si existe
        if (initialData.datosGenerales.domicilioExtranjero) {
          const domExt = initialData.datosGenerales.domicilioExtranjero;
          form.setValue("ciudad", domExt.ciudad);
          form.setValue("provincia", domExt.provincia);
          form.setValue("calle", domExt.calle);
          form.setValue("numeroExteriorExtranjero", domExt.numeroExterior);
          form.setValue("numeroInteriorExtranjero", domExt.numeroInterior);
          form.setValue("codigoPostalExtranjero", domExt.codigoPostal);
          form.setValue("pais", domExt.pais);
        }
      }
    } else {
      // Si es nuevo registro, establecer el entePublico del usuario
      if (session && session.user?.entePublico) {
        form.setValue("entePublico", session.user.entePublico);
      }
    }
  }, [initialData, form, session]);

  const onSubmit = async (data: FaltasGravesPMFormValues) => {
    try {
      setLoading(true);
      console.log(data);

      let domicilioMexicoId = null;
      let domicilioExtranjeroId = null;

      // Crear/actualizar domicilio México si el tipo es DOMICILIO_MEXICO
      if (data.tipoDomicilio === "DOMICILIO_MEXICO") {
        const domicilioMexicoData = {
          tipoVialidad: data.tipoVialidad,
          nombreVialidad: data.nombreVialidad,
          numeroExterior: data.numeroExterior,
          numeroInterior: data.numeroInterior,
          coloniaLocalidad: data.coloniaLocalidad,
          municipioAlcaldia: data.municipioAlcaldia,
          codigoPostal: data.codigoPostal,
          entidadFederativa: data.entidadFederativa,
          entePublico: data.entePublico,
        };

        if (initialData?.datosGenerales?.domicilioMexico?.id) {
          await directus.request(
            withToken(
              session?.access_token,
              updateItem(
                "domicilio_mexico_morales",
                initialData.datosGenerales.domicilioMexico.id,
                domicilioMexicoData
              )
            )
          );
          domicilioMexicoId = initialData.datosGenerales.domicilioMexico.id;
        } else {
          const newDomicilioMexico = await directus.request(
            withToken(
              session?.access_token,
              createItem("domicilio_mexico_morales", domicilioMexicoData)
            )
          );
          domicilioMexicoId = newDomicilioMexico.id;
        }
      }

      // Crear/actualizar domicilio Extranjero si el tipo es DOMICILIO_EXTRANJERO
      if (data.tipoDomicilio === "DOMICILIO_EXTRANJERO") {
        const domicilioExtranjeroData = {
          ciudad: data.ciudad,
          provincia: data.provincia,
          calle: data.calle,
          numeroExterior: data.numeroExteriorExtranjero,
          numeroInterior: data.numeroInteriorExtranjero,
          codigoPostal: data.codigoPostalExtranjero,
          pais: data.pais,
          entePublico: data.entePublico,
        };

        if (initialData?.datosGenerales?.domicilioExtranjero?.id) {
          await directus.request(
            withToken(
              session?.access_token,
              updateItem(
                "domicilio_extranjero_morales",
                initialData.datosGenerales.domicilioExtranjero.id,
                domicilioExtranjeroData
              )
            )
          );
          domicilioExtranjeroId =
            initialData.datosGenerales.domicilioExtranjero.id;
        } else {
          const newDomicilioExtranjero = await directus.request(
            withToken(
              session?.access_token,
              createItem(
                "domicilio_extranjero_morales",
                domicilioExtranjeroData
              )
            )
          );
          domicilioExtranjeroId = newDomicilioExtranjero.id;
        }
      }

      // Crear/actualizar los datos generales
      const datosGeneralesData = {
        nombreRazonSocial: data.nombreRazonSocial,
        rfc: data.rfc,
        objetoSocial: data.objetoSocial,
        tipoDomicilio: data.tipoDomicilio,
        domicilioMexico: domicilioMexicoId,
        domicilioExtranjero: domicilioExtranjeroId,
        entePublico: data.entePublico,
      };

      let datosGeneralesId;

      if (initialData?.datosGenerales?.id) {
        await directus.request(
          withToken(
            session?.access_token,
            updateItem(
              "datos_generales_personas_morales",
              initialData.datosGenerales.id,
              datosGeneralesData
            )
          )
        );
        datosGeneralesId = initialData.datosGenerales.id;
      } else {
        const newDatosGenerales = await directus.request(
          withToken(
            session?.access_token,
            createItem("datos_generales_personas_morales", datosGeneralesData)
          )
        );
        datosGeneralesId = newDatosGenerales.id;
      }

      // Preparar los datos del registro principal
      const mainData = {
        entePublico: data.entePublico,
        status: data.status,
        fecha: data.fecha,
        expediente: data.expediente,
        observaciones: data.observaciones,
        datosGenerales: datosGeneralesId,
      };

      if (initialData) {
        await directus.request(
          withToken(
            session?.access_token,
            updateItem(
              "faltas_graves_personas_morales",
              initialData.id,
              mainData
            )
          )
        );
      } else {
        await directus.request(
          withToken(
            session?.access_token,
            createItem("faltas_graves_personas_morales", mainData)
          )
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
          className="space-y-8 w-full"
        >
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
              <span className="font-semibold">Nota:</span> Todos los campos
              señalados con un asterisco (*) son de carácter obligatorio.
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
                    value={field.value}
                  >
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

            <div className="md:grid md:grid-cols-2 gap-6">
              {/* Campo 1: Fecha */}
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      1. Fecha (DD-MM-AAAA){" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" disabled={loading} {...field} />
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
                      Registrar el número de expediente en el que recae la
                      resolución
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
                    En este espacio podrá realizar las aclaraciones u
                    observaciones que considere pertinentes respecto de alguno o
                    algunos de los apartados del documento.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Sección 2: Datos Generales de la Persona Moral */}
          <DatosGeneralesPMSection form={form} loading={loading} />

          <Separator />

          {/* Sección 3: Datos Generales del Director General / Representante Legal (placeholder para después) */}
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
              disabled={loading}
            >
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
