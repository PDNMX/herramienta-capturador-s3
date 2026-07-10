import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

// This hook doesn't rely on the session provider
export const useCurrentSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<string>("loading");
  const pathName = usePathname();

  const retrieveSession = useCallback(async () => {
    try {
      const sessionData = await getSession();
      if (sessionData) {
        // Only update state if access_token changed to avoid unnecessary re-renders
        setSession((prev) => {
          if ((prev as any)?.access_token === (sessionData as any)?.access_token) return prev;
          return sessionData;
        });
        setStatus("authenticated");
        return;
      }
      setStatus("unauthenticated");
    } catch {
      setStatus("unauthenticated");
      setSession(null);
    }
  }, []);

  // Fetch on mount and route change
  useEffect(() => {
    retrieveSession();
  }, [retrieveSession, pathName]);

  // Refresh when the user comes back to the tab (machine unlock, tab switch, etc.)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") retrieveSession();
    };
    const onFocus = () => retrieveSession();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
    };
  }, [retrieveSession]);

  return { session, status };
};
