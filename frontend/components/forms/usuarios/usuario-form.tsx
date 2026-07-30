// @ts-nocheck
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import directus from "@/lib/directus";
import { createUser, updateUser, readRoles, readItems, createItem, withToken } from "@directus/sdk";
import { Switch } from "@/components/ui/switch";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Loader2, Save, ArrowLeft, User, Mail, Lock, Building2,
  ShieldCheck, Eye, EyeOff, Plus, FileText,
} from "lucide-react";

// ── Constantes ────────────────────────────────────────────────────────────────

const FORMULARIOS = [
  {
    key: "faltasGraves",
    label: "Faltas Administrativas Graves",
    description: "Servidores públicos · infracciones graves",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50/70 dark:bg-red-950/20",
    dot: "bg-red-500",
  },
  {
    key: "faltasNoGraves",
    label: "Faltas Administrativas No Graves",
    description: "Servidores públicos · infracciones menores",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50/70 dark:bg-amber-950/20",
    dot: "bg-amber-500",
  },
  {
    key: "faltasMorales",
    label: "Faltas Graves — Personas Morales",
    description: "Particulares · personas morales",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50/70 dark:bg-violet-950/20",
    dot: "bg-violet-500",
  },
  {
    key: "faltasFisicas",
    label: "Faltas Graves — Personas Físicas",
    description: "Particulares · personas físicas",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50/70 dark:bg-blue-950/20",
    dot: "bg-blue-500",
  },
] as const;

const DEFAULT_PERMISOS = { faltasGraves: true, faltasNoGraves: true, faltasMorales: true, faltasFisicas: true };

// ── Schemas ───────────────────────────────────────────────────────────────────

const createSchema = z.object({
  first_name: z.string().min(1, "El nombre es requerido"),
  last_name: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  entePublico: z.string().min(1, "El ente público es requerido"),
  role: z.string().min(1, "El rol es requerido"),
});

const editSchema = z.object({
  first_name: z.string().min(1, "El nombre es requerido"),
  last_name: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().optional(),
  entePublico: z.string().min(1, "El ente público es requerido"),
  role: z.string().min(1, "El rol es requerido"),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function Field({ label, error, children }: {
  label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function SectionCard({ icon: Icon, title, description, children }: {
  icon: any; title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/30">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-none">{title}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>
        <div className="px-6 py-5">{children}</div>
      </CardContent>
    </Card>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface UsuarioFormProps {
  initialData?: any;
}

export function UsuarioForm({ initialData }: UsuarioFormProps) {
  const isEditing = !!initialData;
  const router = useRouter();
  const { toast } = useToast();
  const { session } = useCurrentSession();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [entes, setEntes] = useState<any[]>([]);

  // Dialog para nuevo ente público
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEnteName, setNewEnteName] = useState("");
  const [newEntePermisos, setNewEntePermisos] = useState({ ...DEFAULT_PERMISOS });
  const [savingEnte, setSavingEnte] = useState(false);

  const schema = isEditing ? editSchema : createSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: initialData?.first_name ?? "",
      last_name: initialData?.last_name ?? "",
      email: initialData?.email ?? "",
      password: "",
      entePublico: initialData?.entePublico?.id
        ? String(initialData.entePublico.id)
        : initialData?.entePublico
        ? String(initialData.entePublico)
        : "",
      role: initialData?.role?.id ?? initialData?.role ?? "",
    },
  });

  // Cargar roles y entes por separado para identificar cuál falla
  useEffect(() => {
    if (!session?.access_token) return;

    async function fetchRoles() {
      try {
        const result = await directus.request(
          withToken(session.access_token, readRoles({ fields: ["id", "name"] }))
        );
        const S3_ROLE_IDS = [
          "a5862643-ea54-43ac-af3d-0ff8809ff93f", // Usuario-Capturador
        ];
        const filtered = (result as any[]).filter((r) => S3_ROLE_IDS.includes(r.id));
        setRoles(filtered);
      } catch (error: any) {
        const msg = error?.errors?.[0]?.message ?? error?.message ?? JSON.stringify(error);
        console.error("Error al cargar roles:", msg);
      }
    }

    async function fetchEntes() {
      try {
        const result = await directus.request(
          withToken(session.access_token, readItems("ente_publico", {
            fields: ["id", "nombre", "faltasGraves", "faltasNoGraves", "faltasMorales", "faltasFisicas"],
            sort: ["nombre"],
            limit: -1,
          }))
        );
        setEntes(result as any[]);
      } catch (error: any) {
        const msg = error?.errors?.[0]?.message ?? error?.message ?? JSON.stringify(error);
        console.error("Error al cargar entes públicos:", msg);
      }
    }

    fetchRoles();
    fetchEntes();
  }, [session]);

  // Guardar nuevo ente público
  const handleCreateEnte = async () => {
    if (!newEnteName.trim()) return;
    try {
      setSavingEnte(true);
      const created = await directus.request(
        withToken(session?.access_token, createItem("ente_publico", {
          nombre: newEnteName.trim(),
          ...newEntePermisos,
        }))
      ) as any;
      const newEnte = {
        id: created.id,
        nombre: created.nombre,
        ...newEntePermisos,
      };
      setEntes((prev) => [...prev, newEnte].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      form.setValue("entePublico", String(created.id));
      setDialogOpen(false);
      setNewEnteName("");
      setNewEntePermisos({ ...DEFAULT_PERMISOS });
      toast({ title: "Ente público creado", description: `"${created.nombre}" ha sido registrado.` });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo crear el ente público.",
      });
    } finally {
      setSavingEnte(false);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const payload: any = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        entePublico: values.entePublico,
        role: values.role,
      };
      if (values.password) payload.password = values.password;

      if (isEditing) {
        await directus.request(withToken(session?.access_token, updateUser(initialData.id, payload)));
        toast({ title: "Usuario actualizado", description: "Los datos han sido guardados." });
      } else {
        payload.status = "active";
        await directus.request(withToken(session?.access_token, createUser(payload)));
        toast({ title: "Usuario creado", description: "El nuevo usuario ha sido registrado." });
      }
      router.push("/inicio/administracion/usuarios");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.errors?.[0]?.message || error.message || "Ocurrió un error.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

        {/* Datos personales */}
        <SectionCard icon={User} title="Datos personales" description="Nombre del usuario">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre(s)" error={form.formState.errors.first_name?.message}>
              <Input placeholder="Ej. María" {...form.register("first_name")} />
            </Field>
            <Field label="Apellidos" error={form.formState.errors.last_name?.message}>
              <Input placeholder="Ej. García López" {...form.register("last_name")} />
            </Field>
          </div>
        </SectionCard>

        {/* Credenciales */}
        <SectionCard icon={Lock} title="Credenciales de acceso" description="Correo y contraseña">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Correo electrónico" error={form.formState.errors.email?.message}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="email"
                  placeholder="correo@ejemplo.gob.mx"
                  className="pl-9"
                  {...form.register("email")}
                />
              </div>
            </Field>
            <Field
              label={isEditing ? "Nueva contraseña (opcional)" : "Contraseña"}
              error={form.formState.errors.password?.message}
            >
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={isEditing ? "Dejar vacío para no cambiar" : "Mínimo 8 caracteres"}
                  className="pr-9"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
          </div>
        </SectionCard>

        {/* Configuración */}
        <SectionCard icon={ShieldCheck} title="Configuración del sistema" description="Ente público y nivel de acceso">
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Ente público */}
            <Field label="Ente Público" error={form.formState.errors.entePublico?.message}>
              <div className="flex gap-2">
                <Select
                  value={form.watch("entePublico")}
                  onValueChange={(val) => form.setValue("entePublico", val, { shouldValidate: true })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccionar ente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {entes.length === 0 ? (
                      <div className="py-4 text-center text-xs text-muted-foreground">
                        No hay entes registrados
                      </div>
                    ) : (
                      entes.map((e) => (
                        <SelectItem key={e.id} value={String(e.id)}>
                          {e.nombre}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setDialogOpen(true)}
                  title="Agregar nuevo ente público"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </Field>

            {/* Rol */}
            <Field label="Rol" error={form.formState.errors.role?.message}>
              <Select
                value={form.watch("role")}
                onValueChange={(val) => form.setValue("role", val, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol..." />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => {
                    const label =
                      r.name === "Usuario-Capturador" ? "Capturador" : r.name;
                    return (
                      <SelectItem key={r.id} value={r.id}>
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </Field>

          </div>

          {/* Formularios disponibles del ente seleccionado */}
          {(() => {
            const enteId = form.watch("entePublico");
            const enteSeleccionado = entes.find((e) => String(e.id) === enteId);
            if (!enteSeleccionado) return null;

            const FORMULARIOS = [
              { key: "faltasGraves",   label: "Faltas Administrativas Graves",   color: "text-red-600 dark:text-red-400",    bg: "bg-red-50 dark:bg-red-950/30" },
              { key: "faltasNoGraves", label: "Faltas Administrativas No Graves", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30" },
              { key: "faltasMorales",  label: "Faltas Graves · Personas Morales", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30" },
              { key: "faltasFisicas",  label: "Faltas Graves · Personas Físicas", color: "text-blue-600 dark:text-blue-400",  bg: "bg-blue-50 dark:bg-blue-950/30" },
            ];

            return (
              <div className="mt-4 rounded-lg border bg-muted/30 p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Formularios disponibles para este ente
                </p>
                <div className="flex flex-wrap gap-2">
                  {FORMULARIOS.map((f) => {
                    const activo = enteSeleccionado[f.key] !== false;
                    return (
                      <span
                        key={f.key}
                        className={[
                          "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full",
                          activo
                            ? `${f.bg} ${f.color}`
                            : "bg-muted text-muted-foreground line-through opacity-50",
                        ].join(" ")}
                      >
                        {activo ? "✓" : "✗"} {f.label}
                      </span>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Para modificar los formularios habilitados, edita el ente en{" "}
                  <a href="/inicio/administracion/entes" className="text-primary underline underline-offset-2 hover:opacity-80">
                    Administración → Entes Públicos
                  </a>.
                </p>
              </div>
            );
          })()}
        </SectionCard>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/inicio/administracion/usuarios")}
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
            {isEditing ? "Guardar cambios" : "Crear usuario"}
          </Button>
        </div>

      </form>

      {/* Dialog: nuevo ente público */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!savingEnte) {
          setDialogOpen(open);
          if (!open) { setNewEnteName(""); setNewEntePermisos({ ...DEFAULT_PERMISOS }); }
        }
      }}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0">

          {/* Cabecera */}
          <div className="px-6 pt-6 pb-5 border-b bg-card">
            <DialogTitle className="sr-only">Nuevo Ente Público</DialogTitle>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 dark:bg-blue-950/60 p-2.5 shrink-0">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest leading-none mb-1.5">
                    Nuevo ente público
                  </p>
                  <h2 className="text-base font-semibold text-foreground leading-tight max-w-[260px] truncate">
                    {newEnteName.trim() || "Sin nombre aún"}
                  </h2>
                </div>
              </div>
              <span className="shrink-0 rounded-full border bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground tabular-nums whitespace-nowrap">
                {Object.values(newEntePermisos).filter(Boolean).length} / 4 activos
              </span>
            </div>
          </div>

          {/* Cuerpo */}
          <div className="px-6 py-5 space-y-5">

            {/* Nombre */}
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="newEnteName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3 w-3" />
                  Nombre del ente
                </Label>
                <span className="text-xs text-muted-foreground/70 italic">Requerido</span>
              </div>
              <Input
                id="newEnteName"
                value={newEnteName}
                onChange={(e) => setNewEnteName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleCreateEnte(); } }}
                disabled={savingEnte}
                autoFocus
                className="font-medium bg-background"
                placeholder="Ej. Secretaría de Gobernación"
              />
              <p className="text-xs text-muted-foreground">
                Este nombre es visible para todos los usuarios asignados a este ente.
              </p>
            </div>

            {/* Formularios */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Formularios habilitados
                </Label>
                <span className="text-xs text-muted-foreground">
                  Solo los activos serán visibles para capturistas
                </span>
              </div>
              <div className="rounded-lg border overflow-hidden divide-y">
                {FORMULARIOS.map((f) => {
                  const isActive = newEntePermisos[f.key];
                  return (
                    <div
                      key={f.key}
                      className={[
                        "flex items-center gap-4 px-4 py-3.5 transition-colors",
                        isActive ? f.bg : "bg-muted/20 dark:bg-muted/10",
                      ].join(" ")}
                    >
                      <div className={`h-2 w-2 rounded-full shrink-0 transition-colors ${isActive ? f.dot : "bg-muted-foreground/25"}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium leading-none transition-colors ${isActive ? f.color : "text-muted-foreground"}`}>
                          {f.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{f.description}</p>
                      </div>
                      <span className={[
                        "text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 transition-colors",
                        isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                          : "bg-muted text-muted-foreground",
                      ].join(" ")}>
                        {isActive ? "Activo" : "Inactivo"}
                      </span>
                      <Switch
                        checked={isActive}
                        onCheckedChange={(val) => setNewEntePermisos((prev) => ({ ...prev, [f.key]: val }))}
                        disabled={savingEnte}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-muted/30">
            <Button
              variant="outline"
              onClick={() => { setDialogOpen(false); setNewEnteName(""); setNewEntePermisos({ ...DEFAULT_PERMISOS }); }}
              disabled={savingEnte}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateEnte} disabled={savingEnte || !newEnteName.trim()}>
              {savingEnte
                ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                : <Plus className="h-4 w-4 mr-1.5" />
              }
              Crear ente
            </Button>
          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}
