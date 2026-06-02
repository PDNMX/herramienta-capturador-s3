"use client";

import { DashboardNav } from "@/components/dashboard-nav";
import { navItems, adminNavItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { Database, LogOut } from "lucide-react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { ROLES } from "@/types/next-auth";
import { signOut } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const roleLabels: Record<string, string> = {
  [ROLES.ADMINISTRADOR]: "Administrador",
  [ROLES.CAPTURADOR]: "Capturista",
};

export default function Sidebar() {
  const { session } = useCurrentSession();
  const isAdmin = session?.user?.roleName === ROLES.ADMINISTRADOR;
  const roleName = session?.user?.roleName ?? "";
  const roleLabel = roleLabels[roleName] ?? roleName;

  const initials = session?.user?.name
    ?.split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() ?? "?";

  return (
    <nav className={cn(
      "relative hidden h-screen border-r lg:flex lg:flex-col w-72 bg-background"
    )}>
      {/* Spacer for fixed header */}
      <div className="h-14 shrink-0" />

      {/* System branding */}
      <div className="px-4 py-3 border-b bg-muted/30 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 shrink-0">
            <Database className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight truncate">
              Sistema S3
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Gestión de Sanciones · PDN
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">

        {/* Main nav */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 mb-1.5">
            Navegación
          </p>
          <DashboardNav items={navItems} />
        </div>

        {/* Admin nav */}
        {isAdmin && (
          <>
            <Separator />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 mb-1.5">
                Administración
              </p>
              <DashboardNav items={adminNavItems} />
            </div>
          </>
        )}

      </div>

      {/* Bottom: user info + logout — fixed at bottom */}
      <div className="shrink-0 border-t bg-muted/20">
        <Link href="/inicio/perfil">
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground leading-none truncate">
                {session?.user?.name ?? "Usuario"}
              </p>
              {roleLabel && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{roleLabel}</p>
              )}
            </div>
          </div>
        </Link>
        <Separator />
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted group-hover:bg-destructive/10 transition-colors">
            <LogOut className="h-3.5 w-3.5" />
          </div>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
