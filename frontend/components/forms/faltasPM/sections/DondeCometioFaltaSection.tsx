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

interface DondeCometioFaltaSectionProps {
  form: any;
  loading: boolean;
}

export const DondeCometioFaltaSection: React.FC<
  DondeCometioFaltaSectionProps
> = ({ form, loading }) => {
  const [nivelOrdenGobierno, setNivelOrdenGobierno] = useState(
    form.watch("dondeCometio_nivelOrdenGobierno") ?? null
  );
  const [ambitoPublico, setAmbitoPublico] = useState(
    form.watch("dondeCometio_ambitoPublico") ?? null
  );

  const handleNivelClick = (value: string) => {
    if (nivelOrdenGobierno === value) {
      setNivelOrdenGobierno(null);
      form.setValue("dondeCometio_nivelOrdenGobierno", null);
    } else {
      setNivelOrdenGobierno(value);
      form.setValue("dondeCometio_nivelOrdenGobierno", value);
    }
  };

  const handleAmbitoClick = (value: string) => {
    if (ambitoPublico === value) {
      setAmbitoPublico(null);
      form.setValue("dondeCometio_ambitoPublico", null);
    } else {
      setAmbitoPublico(value);
      form.setValue("dondeCometio_ambitoPublico", value);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        En el presente apartado se establecen (si aplica) los datos del Ente
        público donde se cometió la falta administrativa
      </p>

      <FormField
        control={form.control}
        name="dondeCometio_entidadFederativa"
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
              Seleccionar la entidad federativa donde se ubique el Ente
              público donde se cometió la falta administrativa
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dondeCometio_nivelOrdenGobierno"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>
              Nivel / Orden de gobierno <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => !loading && handleNivelClick("FEDERAL")}
                  className={`relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors ${nivelOrdenGobierno === "FEDERAL" ? "border-primary bg-accent" : "border-muted"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${nivelOrdenGobierno === "FEDERAL" ? "border-primary" : "border-muted-foreground"}`}>
                      {nivelOrdenGobierno === "FEDERAL" && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">Federal</Label>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => !loading && handleNivelClick("ESTATAL")}
                  className={`relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors ${nivelOrdenGobierno === "ESTATAL" ? "border-primary bg-accent" : "border-muted"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${nivelOrdenGobierno === "ESTATAL" ? "border-primary" : "border-muted-foreground"}`}>
                      {nivelOrdenGobierno === "ESTATAL" && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">Estatal</Label>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => !loading && handleNivelClick("MUNICIPAL_ALCALDIA")}
                  className={`relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors ${nivelOrdenGobierno === "MUNICIPAL_ALCALDIA" ? "border-primary bg-accent" : "border-muted"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${nivelOrdenGobierno === "MUNICIPAL_ALCALDIA" ? "border-primary" : "border-muted-foreground"}`}>
                      {nivelOrdenGobierno === "MUNICIPAL_ALCALDIA" && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">Municipal / Alcaldía</Label>
                    </div>
                  </div>
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Seleccionar el nivel u orden de gobierno al que pertenece el
              Ente público donde se cometió la falta administrativa
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dondeCometio_ambitoPublico"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Ámbito público</FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  onClick={() => !loading && handleAmbitoClick("EJECUTIVO")}
                  className={`relative flex cursor-pointer rounded-xl border-2 p-3 hover:bg-accent transition-colors ${ambitoPublico === "EJECUTIVO" ? "border-primary bg-accent" : "border-muted"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center space-x-2 w-full justify-center">
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${ambitoPublico === "EJECUTIVO" ? "border-primary" : "border-muted-foreground"}`}>
                      {ambitoPublico === "EJECUTIVO" && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <Label className="font-medium cursor-pointer text-center">Ejecutivo</Label>
                  </div>
                </div>

                <div
                  onClick={() => !loading && handleAmbitoClick("LEGISLATIVO")}
                  className={`relative flex cursor-pointer rounded-xl border-2 p-3 hover:bg-accent transition-colors ${ambitoPublico === "LEGISLATIVO" ? "border-primary bg-accent" : "border-muted"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center space-x-2 w-full justify-center">
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${ambitoPublico === "LEGISLATIVO" ? "border-primary" : "border-muted-foreground"}`}>
                      {ambitoPublico === "LEGISLATIVO" && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <Label className="font-medium cursor-pointer text-center">Legislativo</Label>
                  </div>
                </div>

                <div
                  onClick={() => !loading && handleAmbitoClick("JUDICIAL")}
                  className={`relative flex cursor-pointer rounded-xl border-2 p-3 hover:bg-accent transition-colors ${ambitoPublico === "JUDICIAL" ? "border-primary bg-accent" : "border-muted"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center space-x-2 w-full justify-center">
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${ambitoPublico === "JUDICIAL" ? "border-primary" : "border-muted-foreground"}`}>
                      {ambitoPublico === "JUDICIAL" && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <Label className="font-medium cursor-pointer text-center">Judicial</Label>
                  </div>
                </div>

                <div
                  onClick={() => !loading && handleAmbitoClick("ORGANO_AUTONOMO")}
                  className={`relative flex cursor-pointer rounded-xl border-2 p-3 hover:bg-accent transition-colors ${ambitoPublico === "ORGANO_AUTONOMO" ? "border-primary bg-accent" : "border-muted"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center space-x-2 w-full justify-center">
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${ambitoPublico === "ORGANO_AUTONOMO" ? "border-primary" : "border-muted-foreground"}`}>
                      {ambitoPublico === "ORGANO_AUTONOMO" && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <Label className="font-medium cursor-pointer text-center">Órgano autónomo</Label>
                  </div>
                </div>
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
          name="dondeCometio_nombreEntePublico"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del ente público</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Ej: Secretaría de Hacienda y Crédito Público"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Indicar el nombre completo del Ente público sin abreviaturas,
                sin acentos, ni signos especiales
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dondeCometio_siglasEntePublico"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Siglas del ente público</FormLabel>
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
    </div>
  );
};