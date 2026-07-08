"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { signOut, getSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn, AlertTriangle } from "lucide-react";

const SESSION_CHECK_INTERVAL = 60_000; // cada 60 segundos

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const [expired, setExpired] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const pathname = usePathname();
  const isRedirecting = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSessionExpired = useCallback(() => {
    if (isRedirecting.current) return;
    isRedirecting.current = true;
    setExpired(true);
  }, []);

  const handleGoToLogin = useCallback(async () => {
    setSigningOut(true);
    await signOut({ callbackUrl: "/", redirect: true });
  }, []);

  const checkSession = useCallback(async () => {
    if (isRedirecting.current) return;
    try {
      const session = await getSession();
      if (!session || session.forceLogout) {
        handleSessionExpired();
      }
    } catch {
      handleSessionExpired();
    }
  }, [handleSessionExpired]);

  // Revisión periódica
  useEffect(() => {
    checkSession();
    intervalRef.current = setInterval(checkSession, SESSION_CHECK_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [checkSession]);

  // Revisar al cambiar de ruta
  useEffect(() => { checkSession(); }, [pathname, checkSession]);

  // Revisar al volver a la pestaña
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") checkSession(); };
    const onFocus = () => checkSession();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
    };
  }, [checkSession]);

  return (
    <>
      {children}

      <Dialog open={expired}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="sm:max-w-md [&>button]:hidden"
        >
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/40 shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <DialogTitle className="text-lg">Sesión expirada</DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground">
              Tu sesión ha caducado por inactividad o el token de acceso ya no es válido.
              Por favor inicia sesión nuevamente para continuar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <Button
              onClick={handleGoToLogin}
              disabled={signingOut}
              className="w-full gap-2"
            >
              <LogIn className="h-4 w-4" />
              {signingOut ? "Redirigiendo..." : "Iniciar sesión"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
