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
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface OrigenProcedimientoPFSectionProps {
  form: any;
  loading: boolean;
}

export const OrigenProcedimientoPFSection: React.FC<
  OrigenProcedimientoPFSectionProps
> = ({ form, loading }) => {
  const [claveOrigen, setClaveOrigen] = useState(
    form.watch("origenProcedimiento_clave") || ""
  );

  const handleClaveChange = (value: string) => {
    if (claveOrigen === value) {
      setClaveOrigen("");
      form.setValue("origenProcedimiento_clave", "");
      form.setValue("origenProcedimiento_valor", null);
    } else {
      setClaveOrigen(value);
      form.setValue("origenProcedimiento_clave", value);

      // Si no es OTRO, limpiar el campo valor
      if (value !== "OTRO") {
        form.setValue("origenProcedimiento_valor", null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Descripción de la sección */}
      <p className="text-sm text-muted-foreground">
        En el presente apartado se deberá señalar el motivo que dio origen a la
        investigación por actos vinculados con faltas administrativas graves
        por parte de la persona física
      </p>

      {/* Origen del procedimiento - Boxes */}
      <FormField
        control={form.control}
        name="origenProcedimiento_clave"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>
              Origen del procedimiento <span className="text-red-500">*</span>
            </FormLabel>
            <FormDescription>
              Seleccionar conforme al catálogo el origen de la falta
              administrativa
            </FormDescription>
            <FormControl>
              <div className="space-y-3">
                {/* Box ASF/Entidades */}
                <div
                  onClick={() => !loading && handleClaveChange("ASF_ENTIDADES_FISCALIZACION")}
                  className={`
                    relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors
                    ${claveOrigen === "ASF_ENTIDADES_FISCALIZACION"
                      ? "border-primary bg-accent"
                      : "border-muted"
                    }
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`
                      mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center
                      ${claveOrigen === "ASF_ENTIDADES_FISCALIZACION"
                        ? "border-primary"
                        : "border-muted-foreground"
                      }
                    `}>
                      {claveOrigen === "ASF_ENTIDADES_FISCALIZACION" && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">
                        Auditoría superior de la federación o entidades de
                        fiscalización superior de las entidades federativas
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Box Auditoría OIC */}
                <div
                  onClick={() => !loading && handleClaveChange("AUDITORIA_OIC")}
                  className={`
                    relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors
                    ${claveOrigen === "AUDITORIA_OIC"
                      ? "border-primary bg-accent"
                      : "border-muted"
                    }
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`
                      mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center
                      ${claveOrigen === "AUDITORIA_OIC"
                        ? "border-primary"
                        : "border-muted-foreground"
                      }
                    `}>
                      {claveOrigen === "AUDITORIA_OIC" && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">
                        Auditoría del órgano interno de control del ente público
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Box Denuncia */}
                <div
                  onClick={() => !loading && handleClaveChange("DENUNCIA")}
                  className={`
                    relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors
                    ${claveOrigen === "DENUNCIA"
                      ? "border-primary bg-accent"
                      : "border-muted"
                    }
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`
                      mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center
                      ${claveOrigen === "DENUNCIA"
                        ? "border-primary"
                        : "border-muted-foreground"
                      }
                    `}>
                      {claveOrigen === "DENUNCIA" && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">
                        Denuncia
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Box De oficio */}
                <div
                  onClick={() => !loading && handleClaveChange("DE_OFICIO")}
                  className={`
                    relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors
                    ${claveOrigen === "DE_OFICIO"
                      ? "border-primary bg-accent"
                      : "border-muted"
                    }
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`
                      mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center
                      ${claveOrigen === "DE_OFICIO"
                        ? "border-primary"
                        : "border-muted-foreground"
                      }
                    `}>
                      {claveOrigen === "DE_OFICIO" && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">
                        De oficio
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Box Otro */}
                <div
                  onClick={() => !loading && handleClaveChange("OTRO")}
                  className={`
                    relative flex cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-colors
                    ${claveOrigen === "OTRO"
                      ? "border-primary bg-accent"
                      : "border-muted"
                    }
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`
                      mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center
                      ${claveOrigen === "OTRO"
                        ? "border-primary"
                        : "border-muted-foreground"
                      }
                    `}>
                      {claveOrigen === "OTRO" && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">
                        Otro (especifique)
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Campo de especificación cuando se selecciona OTRO */}
      {claveOrigen === "OTRO" && (
        <FormField
          control={form.control}
          name="origenProcedimiento_valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Especifique el origen <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Especifique el motivo que dio origen a la investigación"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                En caso de seleccionar la opción "OTRO", se deberá especificar
                el motivo que dio origen a la investigación
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
