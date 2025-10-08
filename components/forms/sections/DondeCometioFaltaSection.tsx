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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DondeCometioFaltaSectionProps {
  form: any;
  loading: boolean;
}

export const DondeCometioFaltaSection: React.FC<
  DondeCometioFaltaSectionProps
> = ({ form, loading }) => {
  return (
    <div className="space-y-6">
      {/* Descripción de la sección */}
      <p className="text-sm text-muted-foreground">
        En el presente apartado se establecen (si aplica) los datos del Ente
        público donde se cometió la falta administrativa
      </p>

      <div className="md:grid md:grid-cols-2 gap-6">
        {/* Entidad federativa */}
        <FormField
          control={form.control}
          name="dondeCometio_entidadFederativa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Entidad federativa <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                disabled={loading}
                onValueChange={field.onChange}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la entidad federativa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="01">Aguascalientes</SelectItem>
                  <SelectItem value="02">Baja California</SelectItem>
                  <SelectItem value="03">Baja California Sur</SelectItem>
                  <SelectItem value="04">Campeche</SelectItem>
                  <SelectItem value="05">Coahuila de Zaragoza</SelectItem>
                  <SelectItem value="06">Colima</SelectItem>
                  <SelectItem value="07">Chiapas</SelectItem>
                  <SelectItem value="08">Chihuahua</SelectItem>
                  <SelectItem value="09">Ciudad de México</SelectItem>
                  <SelectItem value="10">Durango</SelectItem>
                  <SelectItem value="11">Guanajuato</SelectItem>
                  <SelectItem value="12">Guerrero</SelectItem>
                  <SelectItem value="13">Hidalgo</SelectItem>
                  <SelectItem value="14">Jalisco</SelectItem>
                  <SelectItem value="15">Estado de México</SelectItem>
                  <SelectItem value="16">Michoacán de Ocampo</SelectItem>
                  <SelectItem value="17">Morelos</SelectItem>
                  <SelectItem value="18">Nayarit</SelectItem>
                  <SelectItem value="19">Nuevo León</SelectItem>
                  <SelectItem value="20">Oaxaca</SelectItem>
                  <SelectItem value="21">Puebla</SelectItem>
                  <SelectItem value="22">Querétaro</SelectItem>
                  <SelectItem value="23">Quintana Roo</SelectItem>
                  <SelectItem value="24">San Luis Potosí</SelectItem>
                  <SelectItem value="25">Sinaloa</SelectItem>
                  <SelectItem value="26">Sonora</SelectItem>
                  <SelectItem value="27">Tabasco</SelectItem>
                  <SelectItem value="28">Tamaulipas</SelectItem>
                  <SelectItem value="29">Tlaxcala</SelectItem>
                  <SelectItem value="30">
                    Veracruz de Ignacio de la Llave
                  </SelectItem>
                  <SelectItem value="31">Yucatán</SelectItem>
                  <SelectItem value="32">Zacatecas</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Seleccionar la entidad federativa donde se ubique el Ente
                público donde se cometió la falta administrativa
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nivel / Orden de gobierno */}
        <FormField
          control={form.control}
          name="dondeCometio_nivelOrdenGobierno"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nivel / Orden de gobierno <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                disabled={loading}
                onValueChange={field.onChange}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el nivel de gobierno" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="FEDERAL">Federal</SelectItem>
                  <SelectItem value="ESTATAL">Estatal</SelectItem>
                  <SelectItem value="MUNICIPAL_ALCALDIA">
                    Municipal / Alcaldía
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Seleccionar el nivel u orden de gobierno al que pertenece el
                Ente público donde se cometió la falta administrativa
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ámbito público */}
        <FormField
          control={form.control}
          name="dondeCometio_ambitoPublico"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ámbito público</FormLabel>
              <Select
                disabled={loading}
                onValueChange={field.onChange}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el ámbito público" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EJECUTIVO">Ejecutivo</SelectItem>
                  <SelectItem value="LEGISLATIVO">Legislativo</SelectItem>
                  <SelectItem value="JUDICIAL">Judicial</SelectItem>
                  <SelectItem value="ORGANO_AUTONOMO">
                    Órgano autónomo
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Seleccionar el ámbito público</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nombre del ente público */}
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

        {/* Siglas del ente público */}
        <FormField
          control={form.control}
          name="dondeCometio_siglasEntePublico"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>
                Siglas del ente público <span className="text-red-500">*</span>
              </FormLabel>
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