// @ts-nocheck
"use client";

import { useEffect, useState, useCallback } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { signOut } from "next-auth/react";
import directus from "@/lib/directus";
import { readItems, createItem, updateItem, withToken } from "@directus/sdk";
import BreadCrumb from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Building2, Plus, Pencil, Loader2, Search, FileText } from "lucide-react";

const breadcrumbItems = [
  { title: "Administración", link: "/inicio/administracion/usuarios" },
  { title: "Entes Públicos", link: "/inicio/administracion/entes" },
];

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

export default function Page() {
  const { session, status } = useCurrentSession();
  const { toast } = useToast();
  const [entes, setEntes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ── Dialog de alta ────────────────────────────────────────────────────────
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addNombre, setAddNombre] = useState("");
  const [addPermisos, setAddPermisos] = useState({ ...DEFAULT_PERMISOS });
  const [adding, setAdding] = useState(false);

  // ── Dialog de edición ─────────────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEnte, setEditingEnte] = useState<any>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editPermisos, setEditPermisos] = useState({ ...DEFAULT_PERMISOS });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const result = await directus.request(
        withToken(session.access_token, readItems("ente_publico" as any, {
          fields: ["id", "nombre", "faltasGraves", "faltasNoGraves", "faltasMorales", "faltasFisicas"] as any,
          sort: ["nombre"] as any,
          limit: -1,
        }))
      );
      setEntes(result as any[]);
    } catch {
      toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los entes." });
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (session?.forceLogout) signOut({ callbackUrl: "/" });
    else if (status === "authenticated") fetchData();
  }, [session, status, fetchData]);

  const filtered = entes.filter((e) =>
    e.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Agregar ───────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    const nombre = addNombre.trim();
    if (!nombre) return;
    setAdding(true);
    try {
      await directus.request(
        withToken(session.access_token, createItem("ente_publico" as any, {
          nombre,
          ...addPermisos,
        } as any))
      );
      setAddNombre("");
      setAddPermisos({ ...DEFAULT_PERMISOS });
      setAddDialogOpen(false);
      toast({ title: "Ente agregado", description: `"${nombre}" fue registrado.` });
      await fetchData();
    } catch {
      toast({ variant: "destructive", title: "Error", description: "No se pudo agregar el ente." });
    } finally {
      setAdding(false);
    }
  };

  // ── Abrir dialog de edición ────────────────────────────────────────────────
  const openEdit = (ente: any) => {
    setEditingEnte(ente);
    setEditNombre(ente.nombre ?? "");
    setEditPermisos({
      faltasGraves:   ente.faltasGraves   ?? true,
      faltasNoGraves: ente.faltasNoGraves ?? true,
      faltasMorales:  ente.faltasMorales  ?? true,
      faltasFisicas:  ente.faltasFisicas  ?? true,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const nombre = editNombre.trim();
    if (!nombre || !editingEnte) return;
    setSaving(true);
    try {
      await directus.request(
        withToken(session.access_token, updateItem("ente_publico" as any, editingEnte.id, {
          nombre,
          ...editPermisos,
        } as any))
      );
      toast({ title: "Ente actualizado" });
      setDialogOpen(false);
      await fetchData();
    } catch {
      toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar el ente." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 md:p-8 pt-6 h-full">
      <BreadCrumb items={breadcrumbItems} />

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/50 shrink-0">
            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight leading-none mb-0.5">Entes Públicos</h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} de {entes.length} {entes.length !== 1 ? "registros" : "registro"}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => setAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Nuevo ente público
        </Button>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Buscar ente público..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Lista */}
      <div className="flex-1 border rounded-lg overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="grid grid-cols-[3rem_1fr_auto_5rem] items-center gap-4 px-5 py-3 bg-muted/60 border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>#</span>
          <span>Nombre</span>
          <span>Formularios habilitados</span>
          <span className="text-center">Editar</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && entes.length === 0 && (
            <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Cargando entes...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
              <Building2 className="h-10 w-10 opacity-20" />
              <p className="text-sm font-medium">
                {search ? "Sin resultados para tu búsqueda." : "Aún no hay entes registrados."}
              </p>
              {search && (
                <button onClick={() => setSearch("")} className="text-xs text-primary underline-offset-2 hover:underline">
                  Limpiar búsqueda
                </button>
              )}
            </div>
          )}

          {filtered.map((ente, idx) => {
            const activos = FORMULARIOS.filter((f) => ente[f.key] !== false);
            return (
              <div
                key={ente.id}
                className={[
                  "grid grid-cols-[3rem_1fr_auto_5rem] items-center gap-4 px-5 py-3.5 border-b last:border-b-0 transition-colors group",
                  idx % 2 === 0
                    ? "bg-background hover:bg-blue-50/50 dark:hover:bg-blue-950/10"
                    : "bg-muted/30 hover:bg-blue-50/50 dark:hover:bg-blue-950/10",
                ].join(" ")}
              >
                <span className="text-xs text-muted-foreground font-mono tabular-nums bg-muted rounded px-1.5 py-0.5 w-fit">
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <span className="text-sm font-medium truncate">{ente.nombre}</span>

                {/* Indicadores de formularios */}
                <div className="flex flex-wrap gap-1.5">
                  {activos.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">Ninguno</span>
                  ) : activos.length === 4 ? (
                    <span className="text-xs bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 rounded-full px-2 py-0.5 font-medium">
                      Todos
                    </span>
                  ) : (
                    activos.map((f) => (
                      <span key={f.key} className={`text-xs rounded-full px-2 py-0.5 font-medium bg-muted ${f.color}`}>
                        {f.key === "faltasGraves"   ? "Graves"    :
                         f.key === "faltasNoGraves" ? "No Graves" :
                         f.key === "faltasMorales"  ? "PM"        : "PF"}
                      </span>
                    ))
                  )}
                </div>

                {/* Botón editar */}
                <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon" variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                    onClick={() => openEdit(ente)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {entes.length > 0 && (
          <div className="border-t px-5 py-2 bg-muted/30 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {filtered.length} {filtered.length !== 1 ? "entes" : "ente"} mostrados
            </span>
            {search && (
              <button onClick={() => setSearch("")} className="text-xs text-primary hover:underline underline-offset-2">
                Limpiar filtro
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dialog de alta */}
      <Dialog open={addDialogOpen} onOpenChange={(open) => {
        if (!adding) {
          setAddDialogOpen(open);
          if (!open) { setAddNombre(""); setAddPermisos({ ...DEFAULT_PERMISOS }); }
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
                    {addNombre.trim() || "Sin nombre aún"}
                  </h2>
                </div>
              </div>
              <span className="shrink-0 rounded-full border bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground tabular-nums whitespace-nowrap">
                {Object.values(addPermisos).filter(Boolean).length} / 4 activos
              </span>
            </div>
          </div>

          {/* Cuerpo */}
          <div className="px-6 py-5 space-y-5">

            {/* Nombre */}
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="addNombre" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Pencil className="h-3 w-3" />
                  Nombre del ente
                </Label>
                <span className="text-xs text-muted-foreground/70 italic">Requerido</span>
              </div>
              <Input
                id="addNombre"
                value={addNombre}
                onChange={(e) => setAddNombre(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
                disabled={adding}
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
                <span className="text-xs text-muted-foreground">Solo los activos serán visibles para capturistas</span>
              </div>
              <div className="rounded-lg border overflow-hidden divide-y">
                {FORMULARIOS.map((f) => {
                  const isActive = addPermisos[f.key];
                  return (
                    <div
                      key={f.key}
                      className={["flex items-center gap-4 px-4 py-3.5 transition-colors", isActive ? f.bg : "bg-muted/20 dark:bg-muted/10"].join(" ")}
                    >
                      <div className={`h-2 w-2 rounded-full shrink-0 transition-colors ${isActive ? f.dot : "bg-muted-foreground/25"}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium leading-none transition-colors ${isActive ? f.color : "text-muted-foreground"}`}>{f.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{f.description}</p>
                      </div>
                      <span className={["text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 transition-colors", isActive ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" : "bg-muted text-muted-foreground"].join(" ")}>
                        {isActive ? "Activo" : "Inactivo"}
                      </span>
                      <Switch
                        checked={isActive}
                        onCheckedChange={(val) => setAddPermisos((prev) => ({ ...prev, [f.key]: val }))}
                        disabled={adding}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-muted/30">
            <Button variant="outline" onClick={() => { setAddDialogOpen(false); setAddNombre(""); setAddPermisos({ ...DEFAULT_PERMISOS }); }} disabled={adding}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={adding || !addNombre.trim()}>
              {adding ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Plus className="h-4 w-4 mr-1.5" />}
              Crear ente
            </Button>
          </div>

        </DialogContent>
      </Dialog>

      {/* Dialog de edición */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!saving) setDialogOpen(open); }}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0">
          {/* Cabecera neutral */}
          <div className="px-6 pt-6 pb-5 border-b bg-card">
            <DialogTitle className="sr-only">Editar Ente Público</DialogTitle>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 dark:bg-blue-950/60 p-2.5 shrink-0">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest leading-none mb-1.5">
                    Editando ente público
                  </p>
                  <h2 className="text-base font-semibold text-foreground leading-tight max-w-[260px] truncate">
                    {editNombre || editingEnte?.nombre || "—"}
                  </h2>
                </div>
              </div>
              <span className="shrink-0 rounded-full border bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground tabular-nums whitespace-nowrap">
                {Object.values(editPermisos).filter(Boolean).length} / 4 activos
              </span>
            </div>
          </div>

          {/* Cuerpo */}
          <div className="px-6 py-5 space-y-5">
            {/* Nombre */}
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="editNombre" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Pencil className="h-3 w-3" />
                  Nombre del ente
                </Label>
                <span className="text-xs text-muted-foreground/70 italic">Campo editable</span>
              </div>
              <Input
                id="editNombre"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                disabled={saving}
                autoFocus
                className="font-medium bg-background"
                placeholder="Nombre del ente público"
              />
              <p className="text-xs text-muted-foreground">
                Este nombre es visible para todos los usuarios asignados a este ente.
              </p>
            </div>

            {/* Formularios habilitados */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Formularios habilitados
                </Label>
                <span className="text-xs text-muted-foreground">
                  Solo los activos son visibles para capturistas
                </span>
              </div>

              <div className="rounded-lg border overflow-hidden divide-y">
                {FORMULARIOS.map((f) => {
                  const isActive = editPermisos[f.key];
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
                        onCheckedChange={(val) => setEditPermisos((prev) => ({ ...prev, [f.key]: val }))}
                        disabled={saving}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-muted/30">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving || !editNombre.trim()}>
              {saving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              Guardar cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
