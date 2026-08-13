// @ts-nocheck
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Download, Upload, ChevronDown, FileJson, Loader2, AlertCircle } from "lucide-react";
import directus from "@/lib/directus";
import { createItems, readItems, withToken } from "@directus/sdk";

interface ImportExportButtonsProps {
  data: any[];
  collection: string;
  exportFilename: string;
  accessToken?: string;
  onImportSuccess?: () => void;
  exportFields?: string[];
}

const EXPORT_EXCLUDE_FIELDS = ["date_created", "date_updated", "user_created", "user_updated", "ente_publico", "entePublico", "fk_id", "id", "fk_graves", "fk_personas_fisicas", "fk_no_graves", "fk_morales", "fk_particulares"];

function stripExcludedFields(value: any): any {
  if (Array.isArray(value)) {
    return value.map(stripExcludedFields);
  }
  if (value !== null && typeof value === "object") {
    const obj: any = {};
    for (const key of Object.keys(value)) {
      if (!EXPORT_EXCLUDE_FIELDS.includes(key)) {
        obj[key] = stripExcludedFields(value[key]);
      }
    }
    return obj;
  }
  return value;
}

export function ImportExportButtons({
  data,
  collection,
  exportFilename,
  accessToken,
  onImportSuccess,
  exportFields = ["*.*.*.*"],
}: ImportExportButtonsProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [parsedRecords, setParsedRecords] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [parseError, setParseError] = useState("");

  const handleExport = async () => {
    if (!accessToken) {
      toast({ variant: "destructive", title: "Error", description: "No hay sesión activa para exportar." });
      return;
    }
    try {
      setExporting(true);
      const fullData = await directus.request(
        withToken(accessToken, readItems(collection as any, {
          limit: -1,
          fields: exportFields,
        }))
      ) as any[];
      const cleanData = stripExcludedFields(fullData);
      const blob = new Blob([JSON.stringify(cleanData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${exportFilename}_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Exportación exitosa", description: `${cleanData.length} registros exportados con todos los campos.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error al exportar", description: error?.errors?.[0]?.message ?? error?.message ?? "No se pudo completar la exportación." });
    } finally {
      setExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError("");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const raw = JSON.parse(evt.target?.result as string);
        const records = Array.isArray(raw) ? raw : [raw];
        // Strip IDs and system fields so Directus assigns new ones
        const clean = records.map(({ id, ...rest }) => stripExcludedFields(rest));
        setParsedRecords(clean);
        setImportDialogOpen(true);
      } catch {
        setParseError("El archivo no es un JSON válido.");
        toast({ variant: "destructive", title: "Error al leer el archivo", description: "Asegúrate de que el archivo sea un JSON válido." });
      }
      // Reset input so same file can be re-selected
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!accessToken || parsedRecords.length === 0) return;
    try {
      setImporting(true);
      await directus.request(
        withToken(accessToken, createItems(collection as any, parsedRecords))
      );
      toast({ title: "Importación exitosa", description: `${parsedRecords.length} registros importados correctamente.` });
      setImportDialogOpen(false);
      setParsedRecords([]);
      onImportSuccess?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al importar",
        description: error?.errors?.[0]?.message ?? error?.message ?? "No se pudo completar la importación.",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs md:text-sm shrink-0">
            <FileJson className="h-4 w-4" />
            JSON
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={handleExport} disabled={exporting || !accessToken}>
            {exporting
              ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              : <Download className="h-4 w-4 mr-2 text-muted-foreground" />
            }
            {exporting ? "Exportando..." : "Exportar JSON"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2 text-muted-foreground" />
            Importar JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Confirmar importación
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <p className="text-sm text-muted-foreground">
              Se van a crear <span className="font-semibold text-foreground">{parsedRecords.length} registros nuevos</span> en el sistema. Los IDs originales serán ignorados y se asignarán nuevos IDs.
            </p>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 flex gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Esta acción no se puede deshacer. Verifica que el archivo corresponda a la colección correcta.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setImportDialogOpen(false); setParsedRecords([]); }}>
              Cancelar
            </Button>
            <Button onClick={handleImport} disabled={importing}>
              {importing ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Upload className="h-4 w-4 mr-1.5" />}
              Importar {parsedRecords.length} registros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
