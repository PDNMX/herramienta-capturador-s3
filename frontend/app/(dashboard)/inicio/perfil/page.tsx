// @ts-nocheck
"use client";

import { useCurrentSession } from "@/hooks/useCurrentSession";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import directus from "@/lib/directus";
import { updateUser, readItems, withToken } from "@directus/sdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Mail, Building2, ShieldCheck, KeyRound, User } from "lucide-react";
import BreadCrumb from "@/components/breadcrumb";
import { ROLES } from "@/types/next-auth";

const breadcrumbItems = [
  { title: "Mi Perfil", link: "/inicio/perfil" },
];

const passwordSchema = z.object({
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

const roleConfig: Record<string, { label: string; color: string; bg: string }> = {
  [ROLES.ADMINISTRADOR]: {
    label: "Administrador",
    color: "text-violet-700 dark:text-violet-300",
    bg: "bg-violet-100 dark:bg-violet-950/40",
  },
  [ROLES.CAPTURADOR]: {
    label: "Capturista",
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-100 dark:bg-blue-950/40",
  },
};

export default function Page() {
  const { session } = useCurrentSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [enteNombre, setEnteNombre] = useState("");

  useEffect(() => {
    if (!session?.access_token || !session?.user?.entePublico) return;
    directus.request(
      withToken(session.access_token, readItems("ente_publico" as any, {
        filter: { id: { _eq: session.user.entePublico } } as any,
        fields: ["id", "nombre"] as any,
        limit: 1,
      }))
    )
      .then((res: any) => setEnteNombre(res?.[0]?.nombre ?? session.user?.entePublico ?? ""))
      .catch(() => setEnteNombre(session?.user?.entePublico ?? ""));
  }, [session?.access_token, session?.user?.entePublico]);

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const roleName = session?.user?.roleName ?? "";
  const role = roleConfig[roleName] ?? {
    label: roleName || "Sin rol",
    color: "text-muted-foreground",
    bg: "bg-muted",
  };

  const initials = session?.user?.name
    ?.split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() ?? "?";

  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      await directus.request(
        withToken(
          session.access_token,
          updateUser(session.user.id as string, { password: values.password })
        )
      );
      toast({ title: "Contraseña actualizada", description: "Tu contraseña ha sido cambiada exitosamente." });
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo actualizar la contraseña.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />

      {/* ── Hero card ── */}
      <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/[0.07] to-transparent overflow-hidden relative">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none" />

        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar grande */}
            <div className="relative shrink-0">
              <div className="h-24 w-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center">
                <span className="text-3xl font-black text-primary">{initials}</span>
              </div>
              <span className={`absolute -bottom-1 -right-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${role.bg} ${role.color} border border-primary/10`}>
                {role.label}
              </span>
            </div>

            {/* Info principal */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-foreground leading-none mb-2">
                {session?.user?.name || "Usuario"}
              </h1>
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>{session?.user?.email || "—"}</span>
                </div>
                {(enteNombre || session?.user?.entePublico) && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 shrink-0" />
                    <span>{enteNombre || session?.user?.entePublico}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>{role.label}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Body: 2 columnas ── */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* Columna izquierda — Información de cuenta */}
        <Card className="md:col-span-1">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Información de cuenta
              </p>
            </div>
            <Separator />

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Nombre completo</p>
                <p className="text-sm font-medium">{session?.user?.name || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Correo electrónico</p>
                <p className="text-sm font-medium break-all">{session?.user?.email || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Ente Público</p>
                <p className="text-sm font-medium">
                  {enteNombre || session?.user?.entePublico || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Rol asignado</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.bg} ${role.color}`}>
                  {role.label}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Columna derecha — Cambiar contraseña */}
        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Cambiar contraseña
              </p>
            </div>
            <Separator />

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="password">Nueva contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repetir contraseña"
                    {...form.register("confirmPassword")}
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 border border-border p-4 text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground text-xs">Requisitos de contraseña</p>
                <ul className="text-xs space-y-0.5 list-disc list-inside">
                  <li>Mínimo 8 caracteres</li>
                  <li>Se recomienda combinar letras, números y símbolos</li>
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-1.5" />
                  )}
                  Actualizar contraseña
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
