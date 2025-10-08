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
import { DatosDirGeneralPMSection } from "@/components/forms/sections/DatosDirGeneralPMSection";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { AlertCircle, FileText, Calendar, Clipboard, Users } from "lucide-react";

// Schema para representante
const datosRepresentanteSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  primerApellido: z.string().min(1, "El primer apellido es requerido"),
  segundoApellido: z.string().optional().nullable(),
  rfc: z.string().optional().nullable(),
  curp: z.string().optional().nullable(),
});

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

  // Datos del Director General y Representante Legal
  directorGeneral: datosRepresentanteSchema,
  representanteLegal: datosRepresentanteSchema,
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
      // Director General
      directorGeneral: {
        nombre: initialData?.datosDirGeneralReprLegal?.directorGeneral?.nombre ?? "",
        primerApellido: initialData?.datosDirGeneralReprLegal?.directorGeneral?.primerApellido ?? "",
        segundoApellido: initialData?.datosDirGeneralReprLegal?.directorGeneral?.segundoApellido ?? null,
        rfc: initialData?.datosDirGeneralReprLegal?.directorGeneral?.rfc ?? null,
        curp: initialData?.datosDirGeneralReprLegal?.directorGeneral?.curp ?? null,
      },
      // Representante Legal
      representanteLegal: {
        nombre: initialData?.datosDirGeneralReprLegal?.representanteLegal?.nombre ?? "",
        primerApellido: initialData?.datosDirGeneralReprLegal?.representanteLegal?.primerApellido ?? "",
        segundoApellido: initialData?.datosDirGeneralReprLegal?.representanteLegal?.segundoApellido ?? null,
        rfc: initialData?.datosDirGeneralReprLegal?.representanteLegal?.rfc ?? null,
        curp: initialData?.datosDirGeneralReprLegal?.representanteLegal?.curp ?? null,
      },
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

      // Cargar datos del Director General y Representante Legal
      if (initialData.datosDirGeneralReprLegal) {
        if (initialData.datosDirGeneralReprLegal.directorGeneral) {
          const dg = initialData.datosDirGeneralReprLegal.directorGeneral;
          form.setValue("directorGeneral.nombre", dg.nombre);
          form.setValue("directorGeneral.primerApellido", dg.primerApellido);
          form.setValue("directorGeneral.segundoApellido", dg.segundoApellido);
          form.setValue("directorGeneral.rfc", dg.rfc);
          form.setValue("directorGeneral.curp", dg.curp);
        }
        if (initialData.datosDirGeneralReprLegal.representanteLegal) {
          const rl = initialData.datosDirGeneralReprLegal.representanteLegal;
          form.setValue("representanteLegal.nombre", rl.nombre);
          form.setValue("representanteLegal.primerApellido", rl.primerApellido);
          form.setValue("representanteLegal.segundoApellido", rl.segundoApellido);
          form.setValue("representanteLegal.rfc", rl.rfc);
          form.setValue("representanteLegal.curp", rl.curp);
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

      // Crear/actualizar Director General
      const directorGeneralData = {
        nombre: data.directorGeneral.nombre,
        primerApellido: data.directorGeneral.primerApellido,
        segundoApellido: data.directorGeneral.segundoApellido,
        rfc: data.directorGeneral.rfc,
        curp: data.directorGeneral.curp,
        entePublico: data.entePublico,
      };

      let directorGeneralId;

      if (initialData?.datosDirGeneralReprLegal?.directorGeneral?.id) {
        await directus.request(
          withToken(
            session?.access_token,
            updateItem(
              "datos_representante",
              initialData.datosDirGeneralReprLegal.directorGeneral.id,
              directorGeneralData
            )
          )
        );
        directorGeneralId = initialData.datosDirGeneralReprLegal.directorGeneral.id;
      } else {
        const newDirectorGeneral = await directus.request(
          withToken(
            session?.access_token,
            createItem("datos_representante", directorGeneralData)
          )
        );
        directorGeneralId = newDirectorGeneral.id;
      }

      // Crear/actualizar Representante Legal
      const representanteLegalData = {
        nombre: data.representanteLegal.nombre,
        primerApellido: data.representanteLegal.primerApellido,
        segundoApellido: data.representanteLegal.segundoApellido,
        rfc: data.representanteLegal.rfc,
        curp: data.representanteLegal.curp,
        entePublico: data.entePublico,
      };

      let representanteLegalId;

      if (initialData?.datosDirGeneralReprLegal?.representanteLegal?.id) {
        await directus.request(
          withToken(
            session?.access_token,
            updateItem(
              "datos_representante",
              initialData.datosDirGeneralReprLegal.representanteLegal.id,
              representanteLegalData
            )
          )
        );
        representanteLegalId = initialData.datosDirGeneralReprLegal.representanteLegal.id;
      } else {
        const newRepresentanteLegal = await directus.request(
          withToken(
            session?.access_token,
            createItem("datos_representante", representanteLegalData)
          )
        );
        representanteLegalId = newRepresentanteLegal.id;
      }

      // Crear/actualizar datos_dg_rp (wrapper)
      const datosDgRpData = {
        directorGeneral: directorGeneralId,
        representanteLegal: representanteLegalId,
        entePublico: data.entePublico,
      };

      let datosDgRpId;

      if (initialData?.datosDirGeneralReprLegal?.id) {
        await directus.request(
          withToken(
            session?.access_token,
            updateItem(
              "datos_dg_rp",
              initialData.datosDirGeneralReprLegal.id,
              datosDgRpData
            )
          )
        );
        datosDgRpId = initialData.datosDirGeneralReprLegal.id;
      } else {
        const newDatosDgRp = await directus.request(
          withToken(
            session?.access_token,
            createItem("datos_dg_rp", datosDgRpData)
          )
        );
        datosDgRpId = newDatosDgRp.id;
      }

      // Preparar los datos del registro principal
      const mainData = {
        entePublico: data.entePublico,
        status: data.status,
        fecha: data.fecha,
        expediente: data.expediente,
        observaciones: data.observaciones,
        datosGenerales: datosGeneralesId,
        datosDirGeneralReprLegal: datosDgRpId,
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

          {/* Nota de campos obligatorios - Estilo mejorado */}
          <div className="flex items-center gap-3 p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/30 shadow-sm">
            <div className="bg-amber-100 dark:bg-amber-800/30 rounded-lg p-2">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
              Los campos marcados con un asterisco (<span className="text-red-500">*</span>) son de carácter obligatorio.
            </p>
          </div>

          {/* Box con los campos iniciales */}
          <div className="rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg">
            <div className="space-y-6">
              {/* Estatus */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Estatus <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campo 1: Fecha */}
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        1. Fecha (DD-MM-AAAA) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                          <Input type="date" disabled={loading} {...field} className="h-12 pl-10" />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
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
                      <FormLabel className="text-sm font-semibold">
                        2. Expediente <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clipboard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                          <Input
                            disabled={loading}
                            placeholder="Ej: EXP-2025-001"
                            {...field}
                            className="h-12 pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Registrar el número de expediente en el que recae la resolución
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* ACCORDION COMIENZA AQUÍ - desde la sección 3 en adelante */}
          <Accordion type="multiple" className="w-full space-y-4">
            
            {/* Sección 3: Datos Generales de la Persona Moral */}
            <AccordionItem value="datos-generales" className="rounded-xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur shadow-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className="bg-primary/10 rounded-lg p-2 mr-4">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-left text-lg font-semibold text-primary">
                    3. Datos generales de la persona moral sancionada
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <DatosGeneralesPMSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Sección 4: Datos Generales del Director General / Representante Legal */}
            <AccordionItem value="datos-dir-general" className="rounded-xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur shadow-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className="bg-primary/10 rounded-lg p-2 mr-4">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-left text-lg font-semibold text-primary">
                    4. Datos generales del director general y del representante legal de la persona moral sancionada
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <DatosDirGeneralPMSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          {/* Campo 10: Observaciones - AL FINAL DE TODO con diseño completo */}
          <div className="rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg">
            <div className="flex items-center mb-6">
              <div className="bg-primary/10 rounded-lg p-2 mr-4">
                <Clipboard className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-primary">10. Observaciones</h3>
            </div>
            
            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Ej: Información adicional sobre el caso..."
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    En este espacio podrá realizar las aclaraciones u observaciones que considere pertinentes respecto de alguno o algunos de los apartados del documento.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              className="h-12 px-6"
            >
              Cancelar
            </Button>
            <Button disabled={loading} type="submit" className="h-12 px-6">
              {action}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};