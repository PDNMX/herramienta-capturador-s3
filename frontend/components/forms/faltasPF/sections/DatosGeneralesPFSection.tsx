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

const TIPOS_VIALIDAD = [
  { value: "AVENIDA", label: "Avenida" },
  { value: "CALLE", label: "Calle" },
  { value: "BOULEVARD", label: "Boulevard" },
  { value: "VIADUCTO", label: "Viaducto" },
  { value: "PASEO", label: "Paseo" },
  { value: "CALZADA", label: "Calzada" },
  { value: "CERRADA", label: "Cerrada" },
  { value: "PRIVADA", label: "Privada" },
  { value: "PERIFERICO", label: "Periférico" },
  { value: "ANDADOR", label: "Andador" },
  { value: "CIRCUITO", label: "Circuito" },
  { value: "CORREDOR", label: "Corredor" },
  { value: "DIAGONAL", label: "Diagonal" },
  { value: "CONTINUACION", label: "Continuación" },
  { value: "CAMINO", label: "Camino" },
  { value: "CARRETERA", label: "Carretera" },
  { value: "EJE_VIAL", label: "Eje vial" },
  { value: "RETORNO", label: "Retorno" },
  { value: "PROLONGACION", label: "Prolongación" },
  { value: "CIRCUNVALACION", label: "Circunvalación" },
  { value: "BRECHA", label: "Brecha" },
];

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

interface DatosGeneralesPFSectionProps {
  form: any;
  loading: boolean;
}

export const DatosGeneralesPFSection: React.FC<
  DatosGeneralesPFSectionProps
> = ({ form, loading }) => {
  const [tipoDomicilio, setTipoDomicilio] = useState(
    form.watch("tipoDomicilio") ?? null
  );

  const handleTipoDomicilioClick = (value: string) => {
    // Si se hace clic en la opción ya seleccionada, se deselecciona
    if (tipoDomicilio === value) {
      setTipoDomicilio(null);
      form.setValue("tipoDomicilio", null);

      // Limpiar todos los campos de domicilio
      form.setValue("tipoVialidad", null);
      form.setValue("nombreVialidad", null);
      form.setValue("numeroExterior", null);
      form.setValue("numeroInterior", null);
      form.setValue("coloniaLocalidad", null);
      form.setValue("municipioAlcaldia", null);
      form.setValue("codigoPostal", null);
      form.setValue("entidadFederativa", null);
      form.setValue("ciudad", null);
      form.setValue("provincia", null);
      form.setValue("calle", null);
      form.setValue("numeroExteriorExtranjero", null);
      form.setValue("numeroInteriorExtranjero", null);
      form.setValue("codigoPostalExtranjero", null);
      form.setValue("pais", null);
    } else {
      setTipoDomicilio(value);
      form.setValue("tipoDomicilio", value);

      // Limpiar campos según el tipo de domicilio seleccionado
      if (value === "DOMICILIO_MEXICO") {
        // Limpiar campos de extranjero
        form.setValue("ciudad", null);
        form.setValue("provincia", null);
        form.setValue("calle", null);
        form.setValue("numeroExteriorExtranjero", null);
        form.setValue("numeroInteriorExtranjero", null);
        form.setValue("codigoPostalExtranjero", null);
        form.setValue("pais", null);
      } else if (value === "DOMICILIO_EXTRANJERO") {
        // Limpiar campos de México
        form.setValue("tipoVialidad", null);
        form.setValue("nombreVialidad", null);
        form.setValue("numeroExterior", null);
        form.setValue("numeroInterior", null);
        form.setValue("coloniaLocalidad", null);
        form.setValue("municipioAlcaldia", null);
        form.setValue("codigoPostal", null);
        form.setValue("entidadFederativa", null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Descripción de la sección */}
      <p className="text-sm text-muted-foreground">
        En el presente apartado se establecen los datos concernientes a la
        persona física sancionada
      </p>

      <div className="md:grid md:grid-cols-2 gap-6">
        {/* Nombres */}
        <FormField
          control={form.control}
          name="nombres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nombre(s) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Ej: Juan Carlos"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Se deberá escribir el o los nombres, así como los apellidos, sin abreviaturas, sin acentos, ni signos especiales. En caso de tener sólo un apellido, deberá colocarse en el espacio del primer apellido y dejar el espacio del segundo apellido en blanco
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Primer apellido */}
        <FormField
          control={form.control}
          name="primerApellido"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Primer apellido <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Ej: García"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="md:grid md:grid-cols-3 gap-6">
        {/* Segundo apellido */}
        <FormField
          control={form.control}
          name="segundoApellido"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Segundo apellido</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Ej: López"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CURP */}
        <FormField
          control={form.control}
          name="curp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                CURP <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Ej: GARC850101HDFRRL09"
                  maxLength={18}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                  Escribir los dieciocho caracteres alfanuméricos como aparece
                  en el documento que emite la Secretaría de Gobernación. En
                  caso de no contar con ese dato, podrá consultarlo en:{" "}
                  <a
                    href="https://www.gob.mx/curp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://www.gob.mx/curp/
                  </a>
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
                  placeholder="Ej: GARC8501019A0"
                  maxLength={13}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Escribir los primeros diez caracteres básicos y los tres correspondientes a la homoclave
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Tipo de domicilio con boxes */}
      <FormField
        control={form.control}
        name="tipoDomicilio"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Tipo de domicilio</FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Box Domicilio México */}
                <div
                  onClick={() => !loading && handleTipoDomicilioClick("DOMICILIO_MEXICO")}
                  className={`
                    relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors
                    ${tipoDomicilio === "DOMICILIO_MEXICO"
                      ? "border-primary bg-accent"
                      : "border-muted"
                    }
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`
                      mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center
                      ${tipoDomicilio === "DOMICILIO_MEXICO"
                        ? "border-primary"
                        : "border-muted-foreground"
                      }
                    `}>
                      {tipoDomicilio === "DOMICILIO_MEXICO" && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">
                        Domicilio en la República Mexicana
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Selecciona si el domicilio está en México
                      </p>
                    </div>
                  </div>
                </div>

                {/* Box Domicilio Extranjero */}
                <div
                  onClick={() => !loading && handleTipoDomicilioClick("DOMICILIO_EXTRANJERO")}
                  className={`
                    relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors
                    ${tipoDomicilio === "DOMICILIO_EXTRANJERO"
                      ? "border-primary bg-accent"
                      : "border-muted"
                    }
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`
                      mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center
                      ${tipoDomicilio === "DOMICILIO_EXTRANJERO"
                        ? "border-primary"
                        : "border-muted-foreground"
                      }
                    `}>
                      {tipoDomicilio === "DOMICILIO_EXTRANJERO" && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">
                        Domicilio en el extranjero
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Selecciona si el domicilio está fuera de México
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Domicilio México - CON BOX mismo fondo */}
      {tipoDomicilio === "DOMICILIO_MEXICO" && (
        <div className="rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-base mb-1">
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
                    <FormControl>
                      <Combobox
                        options={TIPOS_VIALIDAD}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecciona el tipo de vialidad"
                        disabled={loading}
                        searchPlaceholder="Buscar tipo de vialidad..."
                      />
                    </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      )}

      {/* Domicilio Extranjero - CON BOX mismo fondo */}
      {tipoDomicilio === "DOMICILIO_EXTRANJERO" && (
        <div className="rounded-xl border-2 border-primary/20 p-6 bg-card/95 backdrop-blur shadow-lg">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-base mb-1">Domicilio en el extranjero</h4>
              <p className="text-sm text-muted-foreground">
                En su caso, indicar los siguientes datos: ciudad/localidad,
                estado/provincia, calle, número exterior, número interior (si
                aplica), código postal y país.
              </p>
            </div>

            <div className="md:grid md:grid-cols-2 gap-6">
              {/* Ciudad / Localidad */}
              <FormField
                control={form.control}
                name="ciudad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad / Localidad</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Ej: Nueva York"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Escribir el nombre de la ciudad o localidad del domicilio
                      extranjero
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Estado / Provincia */}
              <FormField
                control={form.control}
                name="provincia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado / Provincia</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Ej: Nueva York"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Escribir el nombre del estado/provincia del domicilio
                      extranjero
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Calle */}
              <FormField
                control={form.control}
                name="calle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calle</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Ej: Fifth Avenue"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Escribir el nombre de la calle del domicilio extranjero
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Número exterior */}
              <FormField
                control={form.control}
                name="numeroExteriorExtranjero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número exterior</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Ej: 350"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Escribir el número exterior del domicilio extranjero
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Número interior */}
              <FormField
                control={form.control}
                name="numeroInteriorExtranjero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número interior</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Ej: Apt 5B (si aplica)"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Escribir el número interior del domicilio extranjero
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Código postal */}
              <FormField
                control={form.control}
                name="codigoPostalExtranjero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código postal</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Ej: 10118"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Escribir el código postal del domicilio extranjero
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* País */}
              <FormField
                control={form.control}
                name="pais"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Ej: Estados Unidos"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Nombre del país especificado en estándar ISO3166
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
