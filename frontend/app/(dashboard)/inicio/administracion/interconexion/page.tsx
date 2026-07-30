// @ts-nocheck
"use client";

import { useEffect, useState, useCallback } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import directus from "@/lib/directus";
import { readUsers, updateUser, withToken } from "@directus/sdk";
import BreadCrumb from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Plug, Plus, Loader2, KeyRound, Pencil,
  Eye, EyeOff, AlertTriangle, RefreshCw,
  Copy, Check, ShieldAlert,
} from "lucide-react";

const API_ROLE_ID = "80ba6d0a-3025-4bc5-9966-2acefa91d7c2";

const breadcrumbItems = [
  { title: "Administración", link: "/inicio/administracion/usuarios" },
  { title: "Interconexión", link: "/inicio/administracion/interconexion" },
];

function generateToken(): string {
  const array = new Uint8Array(48);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

function downloadCredentials(info: { nombre: string; email: string; token: string }) {
  const content = JSON.stringify(
    {
      nombre: info.nombre,
      email: info.email,
      token: info.token,
      backend_url: process.env.NEXT_PUBLIC_BACKEND_URL ?? "",
      generado: new Date().toISOString(),
      uso: "Authorization: Bearer <token>",
      nota: "Guarda este archivo en un lugar seguro. El token no puede recuperarse desde el sistema.",
    },
    null,
    2
  );
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `token-interconexion-${info.nombre.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function initials(firstName: string, lastName: string) {
  return [firstName, lastName]
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Page() {
  const { session, status } = useCurrentSession();
  const { toast } = useToast();
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Edit modal
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);

  // Confirmaciones
  const [pendingStatusUser, setPendingStatusUser] = useState<any | null>(null);
  const [pendingRegen, setPendingRegen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const result = await directus.request(
        withToken(
          session.access_token,
          readUsers({
            fields: ["id", "first_name", "last_name", "email", "status", "entePublico.id", "entePublico.nombre", "role.id", "role.name"],
            sort: ["first_name"],
            limit: -1,
          })
        )
      ) as any[];

      setUsuarios(result.filter((u: any) => u.role?.id === API_ROLE_ID));
    } catch {
      toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar las interconexiones." });
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (session?.forceLogout) signOut({ callbackUrl: "/" });
    else if (status === "authenticated") fetchData();
  }, [session, status, fetchData]);

  const toggleStatus = async (user: any) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    try {
      await directus.request(
        withToken(session?.access_token, updateUser(user.id, { status: newStatus } as any))
      );
      toast({ title: newStatus === "active" ? "Acceso activado" : "Acceso suspendido" });
      await fetchData();
    } catch {
      toast({ variant: "destructive", title: "Error", description: "No se pudo cambiar el estado." });
    }
  };

  const openEdit = (user: any) => {
    setEditUser(user);
    setEditFirstName(user.first_name ?? "");
    setEditLastName(user.last_name ?? "");
    setEditEmail(user.email ?? "");
    setEditPassword("");
    setShowPassword(false);
    setNewToken(null);
    setTokenCopied(false);
  };

  const closeEdit = () => {
    setEditUser(null);
    setNewToken(null);
  };

  const handleRegenToken = () => {
    setRegenLoading(true);
    setTimeout(() => {
      setNewToken(generateToken());
      setTokenCopied(false);
      setRegenLoading(false);
    }, 400);
  };

  const copyToken = async () => {
    if (!newToken) return;
    await navigator.clipboard.writeText(newToken);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!editUser) return;
    setEditSaving(true);
    try {
      const payload: any = {
        first_name: editFirstName.trim(),
        last_name: editLastName.trim(),
        email: editEmail.trim(),
      };
      if (editPassword.length >= 8) payload.password = editPassword;
      if (newToken) payload.token = newToken;

      await directus.request(
        withToken(session?.access_token, updateUser(editUser.id, payload))
      );

      if (newToken) {
        downloadCredentials({
          nombre: `${editFirstName.trim()} ${editLastName.trim()}`.trim(),
          email: editEmail.trim(),
          token: newToken,
        });
      }

      toast({ title: "Cambios guardados", description: "La interconexión fue actualizada correctamente." });
      closeEdit();
      await fetchData();
    } catch {
      toast({ variant: "destructive", title: "Error", description: "No se pudieron guardar los cambios." });
    } finally {
      setEditSaving(false);
    }
  };

  const canSave =
    editFirstName.trim().length > 0 &&
    editEmail.trim().length > 0 &&
    (editPassword.length === 0 || editPassword.length >= 8);

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 md:p-8 pt-6 h-full">
      <BreadCrumb items={breadcrumbItems} />

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 shrink-0">
            <Plug className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight leading-none mb-0.5">Interconexión PDN</h2>
            <p className="text-sm text-muted-foreground">
              {usuarios.length} {usuarios.length !== 1 ? "conexiones registradas" : "conexión registrada"}
            </p>
          </div>
        </div>
        <Button size="sm" className="gap-1.5 shrink-0" onClick={() => router.push("/inicio/administracion/interconexion/nuevo")}>
          <Plus className="h-4 w-4" />
          Nueva interconexión
        </Button>
      </div>

      {/* Aviso */}
      <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 px-5 py-4 flex items-start gap-3">
        <KeyRound className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Tokens de acceso estático</p>
          <p className="text-xs text-amber-800 dark:text-amber-400">
            Cada token se genera una sola vez y no puede recuperarse desde el sistema.
            Descarga el archivo de credenciales al momento de la creación. Para emitir uno nuevo, usa{" "}
            <strong>Editar → Generar nuevo token</strong> e invalida el anterior.
          </p>
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 border rounded-lg overflow-hidden flex flex-col">
        <div className="grid grid-cols-[1fr_1fr_10rem_3rem] items-center gap-4 px-5 py-3 bg-muted/60 border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Nombre</span>
          <span>Correo</span>
          <span className="text-center">Estado</span>
          <span />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && usuarios.length === 0 && (
            <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Cargando interconexiones...
            </div>
          )}

          {!loading && usuarios.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <Plug className="h-10 w-10 opacity-20" />
              <div className="text-center">
                <p className="text-sm font-medium">Sin interconexiones registradas</p>
                <p className="text-xs mt-0.5">Crea la primera conexión con la PDN.</p>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5 mt-1" onClick={() => router.push("/inicio/administracion/interconexion/nuevo")}>
                <Plus className="h-3.5 w-3.5" />
                Nueva interconexión
              </Button>
            </div>
          )}

          {usuarios.map((u, idx) => {
            const isActive = u.status === "active";
            const nombre = [u.first_name, u.last_name].filter(Boolean).join(" ");
            return (
              <div
                key={u.id}
                className={[
                  "grid grid-cols-[1fr_1fr_10rem_3rem] items-center gap-4 px-5 py-3.5 border-b last:border-b-0 transition-colors",
                  idx % 2 === 0 ? "bg-background hover:bg-muted/30" : "bg-muted/20 hover:bg-muted/40",
                ].join(" ")}
              >
                {/* Nombre con avatar */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shrink-0 text-emerald-700 dark:text-emerald-400 text-xs font-bold select-none">
                    {initials(u.first_name, u.last_name)}
                  </div>
                  <p className="text-sm font-medium truncate">{nombre}</p>
                </div>

                {/* Correo */}
                <p className="text-sm text-muted-foreground truncate">{u.email}</p>

                {/* Toggle de estado */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setPendingStatusUser(u)}
                    title={isActive ? "Clic para suspender acceso" : "Clic para activar acceso"}
                    className={[
                      "group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ring-1 ring-inset",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800 hover:bg-red-50 hover:text-red-600 hover:ring-red-200 dark:hover:bg-red-950/30 dark:hover:text-red-400 dark:hover:ring-red-900"
                        : "bg-zinc-100 text-zinc-500 ring-zinc-200 dark:bg-zinc-800/60 dark:text-zinc-400 dark:ring-zinc-700 hover:bg-emerald-50 hover:text-emerald-700 hover:ring-emerald-200 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 dark:hover:ring-emerald-800",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full transition-colors shrink-0",
                        isActive
                          ? "bg-emerald-500 animate-pulse group-hover:bg-red-500 group-hover:animate-none"
                          : "bg-zinc-400 group-hover:bg-emerald-500",
                      ].join(" ")}
                    />
                    <span className="group-hover:hidden">{isActive ? "Activo" : "Suspendido"}</span>
                    <span className="hidden group-hover:inline">{isActive ? "Suspender" : "Activar"}</span>
                  </button>
                </div>

                {/* Editar */}
                <div className="flex justify-end">
                  <button
                    onClick={() => openEdit(u)}
                    title="Editar interconexión"
                    className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {usuarios.length > 0 && (
          <div className="border-t px-5 py-2 bg-muted/30 flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {usuarios.filter((u) => u.status === "active").length} activas
              </span>
              {" · "}
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                {usuarios.filter((u) => u.status !== "active").length} suspendidas
              </span>
            </span>
          </div>
        )}
      </div>

      {/* ── Modal de edición ── */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">

          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b bg-card flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shrink-0 text-emerald-700 dark:text-emerald-400 font-bold">
              {editUser && initials(editUser.first_name, editUser.last_name)}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base font-semibold leading-tight">
                Editar interconexión
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {editUser && [editUser.first_name, editUser.last_name].filter(Boolean).join(" ")}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-6 max-h-[65vh] overflow-y-auto">

            {/* Información */}
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Información
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-fn" className="text-sm">Nombre(s)</Label>
                  <Input
                    id="edit-fn"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    disabled={editSaving}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-ln" className="text-sm">Apellidos</Label>
                  <Input
                    id="edit-ln"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    disabled={editSaving}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-email" className="text-sm">Correo electrónico</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  disabled={editSaving}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Contraseña
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="edit-pw" className="text-sm">Nueva contraseña</Label>
                <div className="relative">
                  <Input
                    id="edit-pw"
                    type={showPassword ? "text" : "password"}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Dejar en blanco para no cambiar"
                    className="pr-9"
                    disabled={editSaving}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {editPassword.length > 0 && editPassword.length < 8 && (
                  <p className="text-xs text-destructive">Mínimo 8 caracteres</p>
                )}
              </div>
            </div>

            {/* Token */}
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Token de acceso
              </p>

              {/* Advertencia */}
              <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50/60 dark:bg-red-950/20 px-4 py-3 flex items-start gap-3">
                <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-red-800 dark:text-red-300">
                    Advertencia importante
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed">
                    Si generas un nuevo token,{" "}
                    <strong>todas las conexiones activas que usen el token actual dejarán de funcionar</strong>{" "}
                    de inmediato. Tendrás que distribuir el nuevo token a todos los sistemas integrados.
                  </p>
                </div>
              </div>

              {!newToken ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-dashed border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 hover:border-red-400"
                  onClick={() => setPendingRegen(true)}
                  disabled={regenLoading || editSaving}
                >
                  {regenLoading
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <RefreshCw className="h-3.5 w-3.5" />
                  }
                  Generar nuevo token
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Token generado — se aplicará al guardar
                    </p>
                    <Button
                      type="button" size="sm" variant="ghost"
                      className="h-7 gap-1 text-xs"
                      onClick={copyToken}
                    >
                      {tokenCopied
                        ? <><Check className="h-3 w-3 text-green-600" /> Copiado</>
                        : <><Copy className="h-3 w-3" /> Copiar</>
                      }
                    </Button>
                  </div>
                  <div className="rounded-lg border bg-muted/50 p-3 font-mono text-xs text-muted-foreground break-all leading-relaxed select-all">
                    {newToken}
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    Al guardar, las credenciales se descargarán automáticamente.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-muted/20 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={closeEdit} disabled={editSaving}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={editSaving || !canSave}
              className="gap-1.5"
            >
              {editSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* ── Confirmación: cambio de estado ── */}
      <AlertDialog open={!!pendingStatusUser} onOpenChange={(o) => !o && setPendingStatusUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingStatusUser?.status === "active" ? "¿Suspender acceso?" : "¿Activar acceso?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStatusUser?.status === "active"
                ? <>
                    El usuario <strong>{[pendingStatusUser?.first_name, pendingStatusUser?.last_name].filter(Boolean).join(" ")}</strong> perderá acceso inmediatamente a la API. Podrás reactivarlo en cualquier momento.
                  </>
                : <>
                    El usuario <strong>{[pendingStatusUser?.first_name, pendingStatusUser?.last_name].filter(Boolean).join(" ")}</strong> recuperará acceso a la API con su token actual.
                  </>
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingStatusUser(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toggleStatus(pendingStatusUser);
                setPendingStatusUser(null);
              }}
              className={pendingStatusUser?.status === "active"
                ? "bg-destructive hover:bg-destructive/90"
                : "bg-emerald-600 hover:bg-emerald-700"
              }
            >
              {pendingStatusUser?.status === "active" ? "Sí, suspender" : "Sí, activar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Confirmación: regenerar token ── */}
      <AlertDialog open={pendingRegen} onOpenChange={(o) => !o && setPendingRegen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              ¿Generar nuevo token?
            </AlertDialogTitle>
            <AlertDialogDescription className="leading-relaxed">
              El token actual quedará <strong>invalidado de inmediato</strong>. Cualquier sistema que lo esté usando dejará de conectarse hasta que reciba el nuevo token. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingRegen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setPendingRegen(false);
                handleRegenToken();
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Sí, generar nuevo token
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
