"use client";

import { useEffect, useRef, useCallback } from "react";
import { signOut, getSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const SESSION_CHECK_INTERVAL = 60_000; // Check every 60 seconds

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const isRedirecting = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSessionExpired = useCallback(async () => {
    if (isRedirecting.current) return;
    isRedirecting.current = true;

    toast({
      variant: "destructive",
      title: "Sesión expirada",
      description:
        "Tu sesión ha caducado. Serás redirigido a la página de inicio de sesión.",
      duration: 5000,
    });

    // Small delay so the user can see the toast
    setTimeout(async () => {
      await signOut({ callbackUrl: "/", redirect: true });
    }, 1500);
  }, [toast]);

  const checkSession = useCallback(async () => {
    if (isRedirecting.current) return;

    try {
      const session = await getSession();

      if (!session) {
        // Session is gone entirely
        handleSessionExpired();
        return;
      }

      if (session.forceLogout) {
        // Backend flagged this session for forced logout (token refresh failed)
        handleSessionExpired();
        return;
      }
    } catch (error) {
      console.error("Error al verificar la sesión:", error);
      // If we can't even check, the session is likely invalid
      handleSessionExpired();
    }
  }, [handleSessionExpired]);

  // Check session on mount and periodically
  useEffect(() => {
    // Initial check
    checkSession();

    // Periodic checks
    intervalRef.current = setInterval(checkSession, SESSION_CHECK_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkSession]);

  // Re-check session on route changes
  useEffect(() => {
    checkSession();
  }, [pathname, checkSession]);

  // Check session when the tab becomes visible again (user returns from another tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkSession]);

  // Check session when the window regains focus
  useEffect(() => {
    const handleFocus = () => {
      checkSession();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkSession]);

  return <>{children}</>;
}
