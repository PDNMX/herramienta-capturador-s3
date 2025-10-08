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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface DatosGeneralesPMSectionProps {
  form: any;
  loading: boolean;
}

export const DatosGeneralesPMSection: React.FC<
  DatosGeneralesPMSectionProps
> = ({ form, loading }) => {
  const [tipoDomicilio, setTipoDomicilio] = useState(
    form.watch("tipoDomicilio") ?? null // Cambiar a null en lugar de "DOMICILIO_MEXICO"
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          3. Datos generales de la persona moral sancionada
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          En el presente apartado se establecen los datos concernientes a la
          persona moral sancionada
        </p>
      </div>

      <div className="md:grid md:grid-cols-2 gap-6">
        {/* Denominación o razón social */}
        <FormField
          control={form.control}
          name="nombreRazonSocial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Denominación o razón social{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Ej: Constructora ABC S.A. de C.V."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Se deberá proporcionar la denominación o razón social de la
                institución tal y como se encuentra registrada en la escritura
                pública
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* RFC con homoclave */}
        <FormField
          control={form.control}
          name="rfc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                RFC con homoclave <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Ej: ABC123456XYZ"
                  maxLength={13}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Escribir los primeros nueve caracteres básicos y los tres
                correspondientes a la homoclave
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Objeto social */}
      <FormField
        control={form.control}
        name="objetoSocial"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objeto social</FormLabel>
            <FormControl>
              <Textarea
                disabled={loading}
                placeholder="Ej: Construcción, diseño y desarrollo de obras civiles..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Referir la actividad o actividades que desarrolla la persona moral
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tipo de domicilio */}
      <FormField
        control={form.control}
        name="tipoDomicilio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Tipo de domicilio {/* Remover el asterisco */}
            </FormLabel>
            <Select
              disabled={loading}
              onValueChange={(value) => {
                setTipoDomicilio(value);
                field.onChange(value);
                // Limpiar campos según el tipo de domicilio seleccionado
                if (value === "DOMICILIO_MEXICO") {
                  form.setValue("domicilioExtranjero", null);
                } else if (value === "DOMICILIO_EXTRANJERO") {
                  // Limpiar todos los campos de domicilio México
                  form.setValue("tipoVialidad", null);
                  form.setValue("nombreVialidad", null);
                  form.setValue("numeroExterior", null);
                  form.setValue("numeroInterior", null);
                  form.setValue("coloniaLocalidad", null);
                  form.setValue("municipioAlcaldia", null);
                  form.setValue("codigoPostal", null);
                  form.setValue("entidadFederativa", null);
                }
              }}
              value={field.value || ""}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de domicilio" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="DOMICILIO_MEXICO">
                  Domicilio en la República Mexicana
                </SelectItem>
                <SelectItem value="DOMICILIO_EXTRANJERO">
                  Domicilio en el extranjero
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Domicilio México - Campos completos */}
      {tipoDomicilio === "DOMICILIO_MEXICO" && (
        <div className="space-y-6 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 p-6">
          <div>
            <h4 className="font-semibold mb-2">
              Domicilio en la República Mexicana
            </h4>
            <p className="text-sm text-muted-foreground">
              Indicar los siguientes datos: tipo de vialidad, nombre de la
              vialidad, número exterior, número interior (si aplica),
              colonia/localidad, municipio/alcaldía, código postal y entidad
              federativa.
            </p>
          </div>

          <div className="md:grid md:grid-cols-2 gap-6">
            {/* Tipo de vialidad */}
            <FormField
              control={form.control}
              name="tipoVialidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de vialidad</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de vialidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AVENIDA">Avenida</SelectItem>
                      <SelectItem value="CALLE">Calle</SelectItem>
                      <SelectItem value="BOULEVARD">Boulevard</SelectItem>
                      <SelectItem value="VIADUCTO">Viaducto</SelectItem>
                      <SelectItem value="CALZADA">Calzada</SelectItem>
                      <SelectItem value="PRIVADA">Privada</SelectItem>
                      <SelectItem value="CALLEJON">Callejón</SelectItem>
                      <SelectItem value="PROLONGACION">Prolongación</SelectItem>
                      <SelectItem value="CERRADA">Cerrada</SelectItem>
                      <SelectItem value="CIRCUNVALACION">
                        Circunvalación
                      </SelectItem>
                      <SelectItem value="CIRCUITO">Circuito</SelectItem>
                      <SelectItem value="CONTINUACION">Continuación</SelectItem>
                      <SelectItem value="CORREDOR">Corredor</SelectItem>
                      <SelectItem value="DIAGONAL">Diagonal</SelectItem>
                      <SelectItem value="AMPLIACION">Ampliación</SelectItem>
                      <SelectItem value="ANDADOR">Andador</SelectItem>
                      <SelectItem value="EJE_VIAL">Eje Vial</SelectItem>
                      <SelectItem value="PASAJE">Pasaje</SelectItem>
                      <SelectItem value="PEATONAL">Peatonal</SelectItem>
                      <SelectItem value="PERIFERICO">Periférico</SelectItem>
                      <SelectItem value="RETORNO">Retorno</SelectItem>
                      <SelectItem value="NINGUNO">Ninguno</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nombre de la vialidad */}
            <FormField
              control={form.control}
              name="nombreVialidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la vialidad</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ej: Insurgentes"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Número exterior */}
            <FormField
              control={form.control}
              name="numeroExterior"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número exterior</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ej: 123"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Número interior */}
            <FormField
              control={form.control}
              name="numeroInterior"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número interior</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ej: 4A (si aplica)"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Colonia / Localidad */}
            <FormField
              control={form.control}
              name="coloniaLocalidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colonia / Localidad</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ej: Roma Norte"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Municipio / Alcaldía */}
            <FormField
              control={form.control}
              name="municipioAlcaldia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Municipio / Alcaldía</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ej: Cuauhtémoc"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Código postal */}
            <FormField
              control={form.control}
              name="codigoPostal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código postal</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ej: 06700"
                      maxLength={5}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Entidad federativa */}
            <FormField
              control={form.control}
              name="entidadFederativa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entidad federativa</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}

      {/* Domicilio Extranjero - Placeholder */}
      {tipoDomicilio === "DOMICILIO_EXTRANJERO" && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 p-4">
          <h4 className="font-semibold mb-2">Domicilio en el extranjero</h4>
          <p className="text-sm text-muted-foreground">
            En su caso, indicar los siguientes datos: ciudad/localidad,
            estado/provincia, calle, número exterior, número interior (si
            aplica), código postal y país.
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
            Esta sección se configurará en el siguiente paso
          </p>
        </div>
      )}
    </div>
  );
};
