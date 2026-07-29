"use client";

import { useState, useEffect } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { ROLES, FormPermisos } from "@/types/next-auth";
import { readMe, withToken } from "@directus/sdk";
import directus from "@/lib/directus";

const CACHE_KEY = "form-permisos-cache";

function readCache(): FormPermisos | undefined {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function writeCache(p: FormPermisos) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(p)); } catch {}
}

export function useFormPermisos(): FormPermisos | undefined {
  const { session, status } = useCurrentSession();
  const isAdmin = session?.user?.roleName === ROLES.ADMINISTRADOR;

  // Inicializa desde caché para renderizado inmediato sin flash
  const [permisos, setPermisos] = useState<FormPermisos | undefined>(() =>
    typeof window !== "undefined" ? readCache() : undefined
  );

  useEffect(() => {
    if (status !== "authenticated" || isAdmin || !session?.access_token) return;

    directus
      .request(
        withToken(session.access_token, readMe({
          fields: [
            "entePublico.faltasGraves",
            "entePublico.faltasNoGraves",
            "entePublico.faltasMorales",
            "entePublico.faltasFisicas",
          ] as any,
        }))
      )
      .then((me: any) => {
        const ente = me?.entePublico;
        if (!ente || typeof ente !== "object") return;
        const fresh: FormPermisos = {
          faltasGraves:   ente.faltasGraves   ?? true,
          faltasNoGraves: ente.faltasNoGraves ?? true,
          faltasMorales:  ente.faltasMorales  ?? true,
          faltasFisicas:  ente.faltasFisicas  ?? true,
        };
        writeCache(fresh);
        setPermisos(fresh);
      })
      .catch(() => {});
  }, [status, isAdmin, session?.access_token]);

  if (isAdmin) return undefined;

  return permisos;
}
