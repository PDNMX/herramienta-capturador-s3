// @ts-nocheck
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import directus from "@/lib/directus";
import { createItem, updateItem, withToken } from "@directus/sdk";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, ArrowLeft, Building2, FileText } from "lucide-react";

const schema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  faltasGraves: z.boolean(),
  faltasNoGraves: z.boolean(),
  faltasMorales: z.boolean(),
  faltasFisicas: z.boolean(),
});

const FORMULARIOS = [
  {
    key: "faltasGraves" as const,
    label: "Faltas Administrativas Graves",
    description: "Servidores públicos · graves",
    color: "text-red-600 dark:text-red-400",
  },
  {
    key: "faltasNoGraves" as const,
    label: "Faltas Administrativas No Graves",
    description: "Servidores públicos · no graves",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    key: "faltasMorales" as const,
    label: "Faltas Graves — Personas Morales",
    description: "Particulares personas morales",
    color: "text-violet-600 dark:text-violet-400",
  },
  {
    key: "faltasFisicas" as const,
    label: "Faltas Graves — Personas Físicas",
    description: "Particulares personas físicas",
    color: "text-blue-600 dark:text-blue-400",
  },
];

interface EnteFormProps {
  initialData?: any;
}

export function EnteForm({ initialData }: EnteFormProps) {
  const isEditing = !!initialData;
  const router = useRouter();
  const { toast } = useToast();
  const { session } = useCurrentSession();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: initialData?.nombre ?? "",
      faltasGraves: initialData?.faltasGraves ?? true,
      faltasNoGraves: initialData?.faltasNoGraves ?? true,
      faltasMorales: initialData?.faltasMorales ?? true,
      faltasFisicas: initialData?.faltasFisicas ?? true,
    },
  });

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (isEditing) {
        await directus.request(
          withToken(session?.access_token, updateItem("ente_publico" as any, initialData.id, values))
        );
        toast({ title: "Ente actualizado", description: "Los cambios han sido guardados." });
      } else {
        await directus.request(
          withToken(session?.access_token, createItem("ente_publico" as any, values))
        );
        toast({ title: "Ente creado", description: `"${values.nombre}" ha sido registrado.` });
      }
      router.push("/inicio/administracion/entes");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.errors?.[0]?.message ?? error?.message ?? "Ocurrió un error.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/30">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-none">Datos del ente público</p>
              <p className="text-xs text-muted-foreground mt-0.5">Información básica del ente</p>
            </div>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nombre" className="text-sm font-medium">
                Nombre del ente público
              </Label>
              <Input
                id="nombre"
                placeholder="Ej. Secretaría de Gobernación"
                {...form.register("nombre")}
              />
              {form.formState.errors.nombre && (
                <p className="text-xs text-destructive">{form.formState.errors.nombre.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permisos de formularios */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/30">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-none">Formularios habilitados</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Activa los formularios a los que tendrán acceso los capturistas de este ente
              </p>
            </div>
          </div>
          <div className="px-6 py-5 space-y-0 divide-y">
            {FORMULARIOS.map((f) => (
              <div key={f.key} className="flex items-center justify-between py-4">
                <div>
                  <p className={`text-sm font-medium ${f.color}`}>{f.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.description}</p>
                </div>
                <Switch
                  checked={form.watch(f.key)}
                  onCheckedChange={(val) => form.setValue(f.key, val)}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/inicio/administracion/entes")}
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            : <Save className="h-4 w-4 mr-1.5" />
          }
          {isEditing ? "Guardar cambios" : "Crear ente"}
        </Button>
      </div>
    </form>
  );
}
