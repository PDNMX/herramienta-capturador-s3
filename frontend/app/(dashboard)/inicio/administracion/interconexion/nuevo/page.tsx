// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import directus from "@/lib/directus";
import { createUser, withToken } from "@directus/sdk";
import BreadCrumb from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Plug, ArrowLeft, Download, Loader2, RefreshCw,
  Copy, Check, KeyRound, AlertTriangle, Eye, EyeOff, User, Lock,
} from "lucide-react";

const API_ROLE_ID = "80ba6d0a-3025-4bc5-9966-2acefa91d7c2";

const breadcrumbItems = [
  { title: "Administración", link: "/inicio/administracion/usuarios" },
  { title: "Interconexión", link: "/inicio/administracion/interconexion" },
  { title: "Nueva interconexión", link: "/inicio/administracion/interconexion/nuevo" },
];

function generateToken(): string {
  const array = new Uint8Array(48);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

function downloadCredentials(info: {
  nombre: string; apellido: string; email: string; token: string;
}) {
  const payload = {
    nombre: `${info.nombre} ${info.apellido}`.trim(),
    email: info.email,
    token: info.token,
    backend_url: process.env.NEXT_PUBLIC_BACKEND_URL ?? "",
    generado: new Date().toISOString(),
    uso: "Authorization: Bearer <token>",
    nota: "Guarda este archivo en un lugar seguro. El token no puede recuperarse desde el sistema una vez cerrada esta pantalla.",
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `token-interconexion-${info.nombre.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function SectionCard({ icon: Icon, iconBg, iconColor, title, description, children }: {
  icon?: any; iconBg?: string; iconColor?: string;
  title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/30">
          {Icon && (
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
              <Icon className={`h-4 w-4 ${iconColor}`} />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-foreground leading-none">{title}</p>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
        </div>
        <div className="px-6 py-5">{children}</div>
      </CardContent>
    </Card>
  );
}

export default function NuevoPage() {
  const router = useRouter();
  const { session } = useCurrentSession();
  const { toast } = useToast();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(() => generateToken());
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshToken = () => { setToken(generateToken()); setCopied(false); };

  const copyToken = async () => {
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValid =
    nombre.trim().length > 0 &&
    apellido.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.length >= 8;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      await directus.request(
        withToken(
          session?.access_token,
          createUser({
            first_name: nombre.trim(),
            last_name: apellido.trim(),
            email: email.trim(),
            password,
            role: API_ROLE_ID,
            token,
            status: "active",
          } as any)
        )
      );
      downloadCredentials({ nombre: nombre.trim(), apellido: apellido.trim(), email: email.trim(), token });
      toast({ title: "Interconexión creada", description: "Las credenciales se descargaron automáticamente." });
      router.push("/inicio/administracion/interconexion");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al crear",
        description: error?.errors?.[0]?.message ?? "No se pudo registrar la interconexión.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-5 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />

      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 shrink-0">
          <Plug className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight leading-none mb-0.5">Nueva interconexión</h2>
          <p className="text-sm text-muted-foreground">
            Registra una conexión con la PDN y genera su token de acceso estático
          </p>
        </div>
      </div>

      {/* ── Sección 1: Datos del usuario ── */}
      <SectionCard
        icon={User}
        iconBg="bg-primary/10"
        iconColor="text-primary"
        title="Datos del usuario"
        description="Información del usuario de interconexión en el sistema"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="nombre" className="text-sm font-medium">
              Nombre(s) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loading}
              placeholder="Ej. Servicio"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="apellido" className="text-sm font-medium">
              Apellidos <span className="text-destructive">*</span>
            </Label>
            <Input
              id="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              disabled={loading}
              placeholder="Ej. PDN Interconexión"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">
              Correo electrónico <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="api@ejemplo.gob.mx"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium">
              Contraseña <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="Mínimo 8 caracteres"
                className="pr-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password.length > 0 && password.length < 8 && (
              <p className="text-xs text-destructive">Mínimo 8 caracteres</p>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ── Sección 2: Token ── */}
      <SectionCard
        icon={KeyRound}
        iconBg="bg-violet-100 dark:bg-violet-950/60"
        iconColor="text-violet-600 dark:text-violet-400"
        title="Token de acceso estático"
        description="Token criptográfico de 96 caracteres generado automáticamente"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Token generado
            </Label>
            <div className="flex gap-1.5">
              <Button
                type="button" size="sm" variant="outline"
                className="gap-1.5 h-7 text-xs"
                onClick={refreshToken} disabled={loading}
              >
                <RefreshCw className="h-3 w-3" />
                Regenerar
              </Button>
              <Button
                type="button" size="sm" variant="outline"
                className="gap-1.5 h-7 text-xs"
                onClick={copyToken} disabled={loading}
              >
                {copied
                  ? <><Check className="h-3 w-3 text-green-600" />Copiado</>
                  : <><Copy className="h-3 w-3" />Copiar</>
                }
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 font-mono text-xs text-muted-foreground break-all leading-relaxed select-all">
            {token}
          </div>

          <p className="text-xs text-muted-foreground">
            Este token se usará como credencial de acceso estático a la API de Directus.
            Se guardará en el archivo descargado al crear la interconexión.
          </p>
        </div>
      </SectionCard>

      {/* ── Sección 3: Credenciales ── */}
      <SectionCard
        icon={Lock}
        iconBg="bg-emerald-100 dark:bg-emerald-950/60"
        iconColor="text-emerald-600 dark:text-emerald-400"
        title="Credenciales de acceso"
        description="Resumen de lo que se guardará en el archivo descargado"
      >
        <div className="rounded-lg border bg-muted/50 p-4 font-mono text-xs text-muted-foreground space-y-0.5 leading-relaxed">
          <p>{"{"}</p>
          <p className="pl-4">
            <span className="text-blue-500 dark:text-blue-400">"nombre"</span>:{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              "{[nombre.trim(), apellido.trim()].filter(Boolean).join(" ") || "…"}"
            </span>,
          </p>
          <p className="pl-4">
            <span className="text-blue-500 dark:text-blue-400">"email"</span>:{" "}
            <span className="text-emerald-600 dark:text-emerald-400">"{email.trim() || "…"}"</span>,
          </p>
          <p className="pl-4">
            <span className="text-blue-500 dark:text-blue-400">"token"</span>:{" "}
            <span className="text-amber-600 dark:text-amber-400">"{token.slice(0, 24)}…"</span>,
          </p>
          <p className="pl-4">
            <span className="text-blue-500 dark:text-blue-400">"backend_url"</span>:{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              "{process.env.NEXT_PUBLIC_BACKEND_URL ?? "…"}"
            </span>
          </p>
          <p>{"}"}</p>
        </div>
      </SectionCard>

      {/* ── Advertencia ── */}
      <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/20 px-5 py-4 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            El token no puede recuperarse después de esta pantalla
          </p>
          <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
            Al hacer clic en <strong>Crear y descargar</strong>, se registrará el usuario en Directus y se descargará
            automáticamente un archivo <code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 rounded">.json</code> con
            las credenciales. Si el token se pierde, deberás regenerarlo desde la pantalla de administración.
          </p>
        </div>
      </div>

      {/* ── Acciones ── */}
      <div className="flex items-center justify-end gap-3 pt-2 pb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/inicio/administracion/interconexion")}
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading || !isValid} className="gap-1.5">
          {loading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Download className="h-4 w-4" />
          }
          Crear y descargar
        </Button>
      </div>
    </div>
  );
}
