"use client";

import { DashboardNav } from "@/components/dashboard-nav";
import { navItems, adminNavItems } from "@/constants/data";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon, LogOut, Database } from "lucide-react";
import { useState } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { ROLES } from "@/types/next-auth";
import { signOut } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const roleLabels: Record<string, string> = {
  [ROLES.ADMINISTRADOR]: "Administrador",
  [ROLES.CAPTURADOR]: "Capturista",
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <MenuIcon className="cursor-pointer" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 flex flex-col">

        {/* Branding */}
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

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 mb-1.5">
              Navegación
            </p>
            <DashboardNav items={navItems} setOpen={setOpen} />
          </div>

          {isAdmin && (
            <>
              <Separator />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 mb-1.5">
                  Administración
                </p>
                <DashboardNav items={adminNavItems} setOpen={setOpen} />
              </div>
            </>
          )}
        </div>

        {/* Bottom: user + logout */}
        <div className="shrink-0 border-t bg-muted/20">
          <Link href="/inicio/perfil" onClick={() => setOpen(false)}>
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
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors">
              <LogOut className="h-3.5 w-3.5" />
            </div>
            Cerrar sesión
          </button>
        </div>

      </SheetContent>
    </Sheet>
  );
}
