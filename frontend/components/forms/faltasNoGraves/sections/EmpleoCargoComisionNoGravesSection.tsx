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
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const ENTIDADES_FEDERATIVAS = [
  { value: "01", label: "Aguascalientes" },
  { value: "02", label: "Baja California" },
  { value: "03", label: "Baja California Sur" },
  { value: "04", label: "Campeche" },
  { value: "05", label: "Coahuila de Zaragoza" },
  { value: "06", label: "Colima" },
  { value: "07", label: "Chiapas" },
  { value: "08", label: "Chihuahua" },
  { value: "09", label: "Ciudad de México" },
  { value: "10", label: "Durango" },
  { value: "11", label: "Guanajuato" },
  { value: "12", label: "Guerrero" },
  { value: "13", label: "Hidalgo" },
  { value: "14", label: "Jalisco" },
  { value: "15", label: "Estado de México" },
  { value: "16", label: "Michoacán de Ocampo" },
  { value: "17", label: "Morelos" },
  { value: "18", label: "Nayarit" },
  { value: "19", label: "Nuevo León" },
  { value: "20", label: "Oaxaca" },
  { value: "21", label: "Puebla" },
  { value: "22", label: "Querétaro" },
  { value: "23", label: "Quintana Roo" },
  { value: "24", label: "San Luis Potosí" },
  { value: "25", label: "Sinaloa" },
  { value: "26", label: "Sonora" },
  { value: "27", label: "Tabasco" },
  { value: "28", label: "Tamaulipas" },
  { value: "29", label: "Tlaxcala" },
  { value: "30", label: "Veracruz de Ignacio de la Llave" },
  { value: "31", label: "Yucatán" },
  { value: "32", label: "Zacatecas" },
];

const NIVELES_JERARQUICO = [
  { value: "OPERATIVO_HOMOLOGO", label: "Operativo u homólogo" },
  { value: "ENLACE_HOMOLOGO", label: "Enlace u homólogo" },
  {
    value: "JEFATURA_DEPTO_HOMOLOGO",
    label: "Jefatura de departamento u homólogo",
  },
  { value: "SUBDIRECCION_HOMOLOGO", label: "Subdirección de área u homólogo" },
  { value: "DIRECCION_HOMOLOGO", label: "Dirección de área u homólogo" },
  { value: "DG_HOMOLOGO", label: "Dirección general u homólogo" },
  { value: "JEFATURA_UNIDAD_HOMOLOGO", label: "Jefatura de unidad u homólogo" },
  {
    value: "SUBSECRETARIA_HOMOLOGO",
    label: "Subsecretaría de estado oficialía mayor u homólogo",
  },
  { value: "SECRETARIA_HOMOLOGO", label: "Secretaría de estado u homólogo" },
  { value: "OTRO", label: "Otro (especifique):" },
];

interface EmpleoCargoComisionNoGravesSectionProps {
  form: any;
  loading: boolean;
}

export const EmpleoCargoComisionNoGravesSection: React.FC<
  EmpleoCargoComisionNoGravesSectionProps
> = ({ form, loading }) => {
  const [nivelOrdenGobierno, setNivelOrdenGobierno] = useState(
    form.watch("empleo_nivelOrdenGobierno") ?? null,
  );
  const [ambitoPublico, setAmbitoPublico] = useState(
    form.watch("empleo_ambitoPublico") ?? null,
  );
  const nivelJerarquicoClave = form.watch("empleo_nivelJerarquico_clave");

  const handleNivelClick = (value: string) => {
    if (nivelOrdenGobierno === value) {
      setNivelOrdenGobierno(null);
      form.setValue("empleo_nivelOrdenGobierno", null);
    } else {
      setNivelOrdenGobierno(value);
      form.setValue("empleo_nivelOrdenGobierno", value);
    }
  };

  const handleAmbitoClick = (value: string) => {
    if (ambitoPublico === value) {
      setAmbitoPublico(null);
      form.setValue("empleo_ambitoPublico", null);
    } else {
      setAmbitoPublico(value);
      form.setValue("empleo_ambitoPublico", value);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        En el presente apartado se establecen los datos concernientes al empleo,
        cargo o comision que ostenta u ostentaba la persona servidora pública al
        momento de cometer la falta administrativa
      </p>

      <FormField
        control={form.control}
        name="empleo_entidadFederativa"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Entidad federativa <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Combobox
                options={ENTIDADES_FEDERATIVAS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecciona la entidad federativa"
                disabled={loading}
                searchPlaceholder="Buscar entidad federativa..."
              />
            </FormControl>
            <FormDescription>
              Seleccionar la entidad federativa donde se ubica el Ente público
              donde labora o laboraba la persona servidora pública sancionada,
              al momento de cometer la falta administrativa
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="empleo_nivelOrdenGobierno"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>
              Nivel / Orden de gobierno <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "FEDERAL", label: "Federal" },
                  { value: "ESTATAL", label: "Estatal" },
                  {
                    value: "MUNICIPAL_ALCALDIA",
                    label: "Municipal / Alcaldía",
                  },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => !loading && handleNivelClick(option.value)}
                    className={`relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors ${nivelOrdenGobierno === option.value ? "border-primary bg-accent" : "border-muted"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div
                        className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${nivelOrdenGobierno === option.value ? "border-primary" : "border-muted-foreground"}`}
                      >
                        {nivelOrdenGobierno === option.value && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Label className="font-medium cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormDescription>
              Seleccionar el nivel u orden de gobierno
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="empleo_ambitoPublico"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>
              Ambito público <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { value: "EJECUTIVO", label: "Ejecutivo" },
                  { value: "LEGISLATIVO", label: "Legislativo" },
                  { value: "JUDICIAL", label: "Judicial" },
                  { value: "ORGANO_AUTONOMO", label: "Órgano autónomo" },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => !loading && handleAmbitoClick(option.value)}
                    className={`relative flex cursor-pointer rounded-xl border-2 p-3 hover:bg-accent transition-colors ${ambitoPublico === option.value ? "border-primary bg-accent" : "border-muted"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center space-x-2 w-full justify-center">
                      <div
                        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${ambitoPublico === option.value ? "border-primary" : "border-muted-foreground"}`}
                      >
                        {ambitoPublico === option.value && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <Label className="font-medium cursor-pointer text-center">
                        {option.label}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormDescription>Seleccionar el ámbito público</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="md:grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="empleo_nombreEntePublico"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nombre del Ente público <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Ej: Secretaría de Hacienda y Crédito Público"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Indicar el nombre completo del Ente público, sin abreviaturas,
                sin acentos, ni signos especiales
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="empleo_siglasEntePublico"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Siglas del Ente público</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Ej: SHCP"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Indicar las siglas del Ente público
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="empleo_nivelJerarquico_clave"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nivel jerárquico del empleo, cargo o comisión{" "}
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Combobox
                options={NIVELES_JERARQUICO}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecciona el nivel jerárquico"
                disabled={loading}
                searchPlaceholder="Buscar nivel jerárquico..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {nivelJerarquicoClave === "OTRO" && (
        <FormField
          control={form.control}
          name="empleo_nivelJerarquico_valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Especifique el nivel jerárquico{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Especifique el nivel jerárquico"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                En caso de seleccionar la opción "OTRO", se deberá especificar
                el nivel jerárquico
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="empleo_denominacion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Denominación del empleo, cargo o comisión{" "}
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                disabled={loading}
                placeholder="Ej: Director General de Administración"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Escribir la denominación completa del empleo, cargo o comisión que
              aparece en el recibo de nómina, nombramiento, contrato u oficio de
              comisión, sin abreviaturas, sin acentos, ni signos especiales
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="empleo_areaAdscripcion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Área de adscripción <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                disabled={loading}
                placeholder="Ej: Dirección General de Recursos Humanos"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Especificar el nombre de la Unidad Administrativa del Ente público
              a la que está o estaba adscrita la persona servidora pública
              sancionada, sin abreviaturas, sin acentos, ni signos especiales
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
