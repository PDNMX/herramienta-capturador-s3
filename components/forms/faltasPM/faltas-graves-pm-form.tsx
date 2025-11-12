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
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, useMemo } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertCircle,
  FileText,
  Calendar,
  Clipboard,
  Users,
  MapPin,
  Search,
} from "lucide-react";

// Imports de archivos separados
import { faltasGravesPMSchema, type FaltasGravesPMFormValues } from "./schema";
import { getFaltasGravesPMDefaults } from "./defaults";
import { saveFaltaGravePM } from "./handler";

// Imports de secciones
import { DatosGeneralesPMSection } from "./sections/DatosGeneralesPMSection";
import { DatosDirGeneralPMSection } from "./sections/DatosDirGeneralPMSection";
import { DondeCometioFaltaSection } from "./sections/DondeCometioFaltaSection";
import { OrigenProcedimientoSection } from "./sections/OrigenProcedimientoSection";
import { FaltaCometidaSection } from "./sections/FaltaCometidaSection";
import { ResolucionSection } from "./sections/ResolucionSection";
import { TipoSancionSection } from "./sections/TipoSancionSection";

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

  // Valores por defecto usando la función separada
  const defaultValues = useMemo(
    () => getFaltasGravesPMDefaults(initialData, session?.user?.entePublico),
    [initialData, session?.user?.entePublico]
  );

  const form = useForm<FaltasGravesPMFormValues>({
    resolver: zodResolver(faltasGravesPMSchema),
    defaultValues,
  });

  // Establecer los datos cuando carga el componente
  useEffect(() => {
    if (initialData) {
      // Cargar campos principales
      for (const key in initialData) {
        if (faltasGravesPMSchema.shape.hasOwnProperty(key)) {
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
          form.setValue(
            "representanteLegal.segundoApellido",
            rl.segundoApellido
          );
          form.setValue("representanteLegal.rfc", rl.rfc);
          form.setValue("representanteLegal.curp", rl.curp);
        }
      }

      // Cargar datos de donde cometió la falta
      if (initialData.dondeCometioLaFalta) {
        const dcf = initialData.dondeCometioLaFalta;
        form.setValue("dondeCometio_entidadFederativa", dcf.entidadFederativa);
        form.setValue(
          "dondeCometio_nivelOrdenGobierno",
          dcf.nivelOrdenGobierno
        );
        form.setValue("dondeCometio_ambitoPublico", dcf.ambitoPublico);
        form.setValue("dondeCometio_nombreEntePublico", dcf.nombreEntePublico);
        form.setValue("dondeCometio_siglasEntePublico", dcf.siglasEntePublico);
      }

      // Cargar datos del origen del procedimiento
      if (initialData.origenProcedimiento) {
        const op = initialData.origenProcedimiento;
        form.setValue("origenProcedimiento_clave", op.clave);
        form.setValue("origenProcedimiento_valor", op.valor);
      }

      // Cargar datos de falta cometida (O2M con normatividades anidadas)
      if (initialData.faltaCometida && initialData.faltaCometida.length > 0) {
        const faltasFormateadas = initialData.faltaCometida.map(
          (falta: any) => ({
            clave: falta.clave,
            valor: falta.valor,
            descripcionHechos: falta.descripcionHechos,
            normatividadInfringida:
              falta.normatividadInfringida?.map((norm: any) => ({
                nombreNormatividad: norm.nombreNormatividad,
                articulo: norm.articulo,
                fraccion: norm.fraccion,
              })) || [],
          })
        );
        form.setValue("faltaCometida", faltasFormateadas);
      }

      // Cargar datos de resolución
      if (initialData.resolucion) {
        const res = initialData.resolucion;
        form.setValue("resolucion_tituloResolucion", res.tituloResolucion);
        form.setValue("resolucion_fechaResolucion", res.fechaResolucion);
        form.setValue("resolucion_fechaNotificacion", res.fechaNotificacion);
        form.setValue("resolucion_urlResolucion", res.urlResolucion);
        form.setValue(
          "resolucion_fechaResolucionFirme",
          res.fechaResolucionFirme
        );
        form.setValue(
          "resolucion_fechaNotificacionFirme",
          res.fechaNotificacionFirme
        );
        form.setValue("resolucion_urlResolucionFirme", res.urlResolucionFirme);
        form.setValue("resolucion_fechaEjecucion", res.fechaEjecucion);
        form.setValue(
          "resolucion_ordenJurisdiccional",
          res.ordenJurisdiccional
        );
        form.setValue(
          "resolucion_autoridadResolutora",
          res.autoridadResolutora
        );
        form.setValue(
          "resolucion_autoridadInvestigadora",
          res.autoridadInvestigadora
        );
        form.setValue(
          "resolucion_autoridadSustanciadora",
          res.autoridadSustanciadora
        );
      }

      // Cargar datos de tipo de sanción (O2M complejo)
      if (initialData.tipoSancion && initialData.tipoSancion.length > 0) {
        const sancionesFormateadas = initialData.tipoSancion.map(
          (sancion: any) => ({
            clave: sancion.clave,
            inhabilitacion: sancion.inhabilitacion
              ? {
                  plazoAnios: sancion.inhabilitacion.plazoAnios,
                  plazoMeses: sancion.inhabilitacion.plazoMeses,
                  plazoDias: sancion.inhabilitacion.plazoDias,
                  fechaInicial: sancion.inhabilitacion.fechaInicial,
                  fechaFinal: sancion.inhabilitacion.fechaFinal,
                }
              : null,
            indemnizacion: sancion.indemnizacion
              ? {
                  monto: sancion.indemnizacion.monto,
                  moneda: sancion.indemnizacion.moneda,
                  fechaPagoTotal: sancion.indemnizacion.fechaPagoTotal,
                  plazoPago: sancion.indemnizacion.plazoPago
                    ? {
                        anios: sancion.indemnizacion.plazoPago.anios,
                        meses: sancion.indemnizacion.plazoPago.meses,
                        dias: sancion.indemnizacion.plazoPago.dias,
                      }
                    : null,
                  efectivamenteCobrado: sancion.indemnizacion
                    .efectivamenteCobrado
                    ? {
                        monto: sancion.indemnizacion.efectivamenteCobrado.monto,
                        moneda:
                          sancion.indemnizacion.efectivamenteCobrado.moneda,
                        fechaCobro:
                          sancion.indemnizacion.efectivamenteCobrado.fechaCobro,
                      }
                    : null,
                }
              : null,
            sancionEconomica: sancion.sancionEconomica
              ? {
                  monto: sancion.sancionEconomica.monto,
                  moneda: sancion.sancionEconomica.moneda,
                  fechaPagoTotal: sancion.sancionEconomica.fechaPagoTotal,
                  plazoPago: sancion.sancionEconomica.plazoPago
                    ? {
                        anios: sancion.sancionEconomica.plazoPago.anios,
                        meses: sancion.sancionEconomica.plazoPago.meses,
                        dias: sancion.sancionEconomica.plazoPago.dias,
                      }
                    : null,
                  efectivamenteCobrado: sancion.sancionEconomica
                    .efectivamenteCobrado
                    ? {
                        monto:
                          sancion.sancionEconomica.efectivamenteCobrado.monto,
                        moneda:
                          sancion.sancionEconomica.efectivamenteCobrado.moneda,
                        fechaCobro:
                          sancion.sancionEconomica.efectivamenteCobrado
                            .fechaCobro,
                      }
                    : null,
                }
              : null,
            suspensionActividades: sancion.suspensionActividades
              ? {
                  plazoSuspensionAnios:
                    sancion.suspensionActividades.plazoSuspensionAnios,
                  plazoSuspensionMeses:
                    sancion.suspensionActividades.plazoSuspensionMeses,
                  plazoSuspensionDias:
                    sancion.suspensionActividades.plazoSuspensionDias,
                  fechaInicial: sancion.suspensionActividades.fechaInicial,
                  fechaFinal: sancion.suspensionActividades.fechaFinal,
                }
              : null,
            disolucionSociedad: sancion.disolucionSociedad
              ? {
                  fechaDisolucion: sancion.disolucionSociedad.fechaDisolucion,
                }
              : null,
            otro: sancion.otro
              ? {
                  denominacionSancion: sancion.otro.denominacionSancion,
                }
              : null,
          })
        );
        form.setValue("tipoSancion", sancionesFormateadas);
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

      await saveFaltaGravePM(data, initialData, session?.access_token);

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
          <div className="flex items-center gap-3 p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/30 shadow-sm">
            <div className="bg-amber-100 dark:bg-amber-800/30 rounded-lg p-2">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
              Los campos marcados con un asterisco (
              <span className="text-red-500">*</span>) son de carácter
              obligatorio.
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
                      <FormLabel className="text-left text-lg font-semibold text-primary">
                        1. Fecha (DD-MM-AAAA){" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          disabled={loading}
                          {...field}
                          className="h-12"
                        />
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
                      <FormLabel className="text-left text-lg font-semibold text-primary">
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
                        Registrar el número de expediente en el que recae la
                        resolución
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* ACCORDION - Secciones 3 a 6 */}
          <Accordion type="multiple" className="w-full space-y-4">
            {/* Sección 3: Datos Generales de la Persona Moral */}
            <AccordionItem
              value="datos-generales"
              className="rounded-xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur shadow-lg"
            >
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
            <AccordionItem
              value="datos-dir-general"
              className="rounded-xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur shadow-lg"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className="bg-primary/10 rounded-lg p-2 mr-4">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-left text-lg font-semibold text-primary">
                    4. Datos generales del director general y del representante
                    legal de la persona moral sancionada
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <DatosDirGeneralPMSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Sección 5: Datos del Ente público donde se cometió la falta */}
            <AccordionItem
              value="donde-cometio-falta"
              className="rounded-xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur shadow-lg"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className="bg-primary/10 rounded-lg p-2 mr-4">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-left text-lg font-semibold text-primary">
                    5. Datos del Ente público donde se cometió la falta
                    administrativa
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <DondeCometioFaltaSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Sección 6: Origen del procedimiento */}
            <AccordionItem
              value="origen-procedimiento"
              className="rounded-xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur shadow-lg"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className="bg-primary/10 rounded-lg p-2 mr-4">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-left text-lg font-semibold text-primary">
                    6. Origen del procedimiento
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <OrigenProcedimientoSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Sección 7: Tipo de falta cometida */}
            <AccordionItem
              value="falta-cometida"
              className="rounded-xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur shadow-lg"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className="bg-primary/10 rounded-lg p-2 mr-4">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-left text-lg font-semibold text-primary">
                    7. Tipo de falta cometida por la persona moral sancionada
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <FaltaCometidaSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Sección 8: Resolución sancionatoria */}
            <AccordionItem
              value="resolucion"
              className="rounded-xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur shadow-lg"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className="bg-primary/10 rounded-lg p-2 mr-4">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-left text-lg font-semibold text-primary">
                    8. Resolución sancionatoria de la falta cometida por la
                    persona moral
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <ResolucionSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>

            {/* Sección 9: Tipo de sanción */}
            <AccordionItem
              value="tipo-sancion"
              className="rounded-xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur shadow-lg"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center w-full">
                  <div className="bg-primary/10 rounded-lg p-2 mr-4">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-left text-lg font-semibold text-primary">
                    9. Tipo de sanción impuesta a la persona moral
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <TipoSancionSection form={form} loading={loading} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Campo 10: Observaciones */}
          <div className="rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg">
            <div className="flex items-center mb-6">
              <div className="bg-primary/10 rounded-lg p-2 mr-4">
                <Clipboard className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-primary">
                10. Observaciones
              </h3>
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
                    En este espacio podrá realizar las aclaraciones u
                    observaciones que considere pertinentes respecto de alguno o
                    algunos de los apartados del documento.
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
