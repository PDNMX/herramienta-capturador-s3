// @ts-nocheck
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { signOut } from "next-auth/react";
import directus from "@/lib/directus";
import { readItems, createItem, updateItem, withToken } from "@directus/sdk";
import BreadCrumb from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  { key: "faltasGraves",   label: "Faltas Administrativas Graves",    color: "text-red-600 dark:text-red-400" },
  { key: "faltasNoGraves", label: "Faltas Administrativas No Graves",  color: "text-amber-600 dark:text-amber-400" },
  { key: "faltasMorales",  label: "Faltas Graves — Personas Morales",  color: "text-violet-600 dark:text-violet-400" },
  { key: "faltasFisicas",  label: "Faltas Graves — Personas Físicas",  color: "text-blue-600 dark:text-blue-400" },
] as const;

const DEFAULT_PERMISOS = { faltasGraves: true, faltasNoGraves: true, faltasMorales: true, faltasFisicas: true };

export default function Page() {
  const { session, status } = useCurrentSession();
  const { toast } = useToast();
  const [entes, setEntes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const newInputRef = useRef<HTMLInputElement>(null);

  // ── Agregar nuevo ente ─────────────────────────────────────────────────────
  const [newNombre, setNewNombre] = useState("");
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
    const nombre = newNombre.trim();
    if (!nombre) return;
    setAdding(true);
    try {
      await directus.request(
        withToken(session.access_token, createItem("ente_publico" as any, {
          nombre,
          ...DEFAULT_PERMISOS,
        } as any))
      );
      setNewNombre("");
      toast({ title: "Ente agregado", description: `"${nombre}" fue registrado.` });
      await fetchData();
      newInputRef.current?.focus();
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
      </div>

      {/* Agregar nuevo ente */}
      <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2.5 flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Agregar nuevo ente público
        </p>
        <div className="flex gap-2">
          <Input
            ref={newInputRef}
            placeholder="Escribe el nombre del ente público..."
            value={newNombre}
            onChange={(e) => setNewNombre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            disabled={adding}
            className="flex-1 bg-white dark:bg-background"
          />
          <Button
            onClick={handleAdd}
            disabled={adding || !newNombre.trim()}
            className="gap-1.5 shrink-0"
          >
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Agregar
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Los formularios disponibles se configuran editando el ente después de crearlo.
        </p>
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

      {/* Dialog de edición */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!saving) setDialogOpen(open); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Editar Ente Público
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Nombre */}
            <div className="space-y-1.5">
              <Label htmlFor="editNombre" className="text-sm font-medium">Nombre</Label>
              <Input
                id="editNombre"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                disabled={saving}
                autoFocus
              />
            </div>

            <Separator />

            {/* Formularios */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Formularios habilitados</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Los capturistas de este ente solo verán los formularios que estén activos.
              </p>
              <div className="space-y-0 divide-y rounded-lg border overflow-hidden">
                {FORMULARIOS.map((f) => (
                  <div key={f.key} className="flex items-center justify-between px-4 py-3 bg-background">
                    <span className={`text-sm font-medium ${f.color}`}>{f.label}</span>
                    <Switch
                      checked={editPermisos[f.key]}
                      onCheckedChange={(val) => setEditPermisos((prev) => ({ ...prev, [f.key]: val }))}
                      disabled={saving}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving || !editNombre.trim()}>
              {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : null}
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
