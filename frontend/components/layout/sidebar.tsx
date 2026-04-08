import { DashboardNav } from "@/components/dashboard-nav";
import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { Database } from "lucide-react";

export default function Sidebar() {
  return (
    <nav
      className={cn(
        "relative hidden h-screen border-r lg:flex lg:flex-col w-72 bg-background"
      )}
    >
      {/* Spacer for fixed header */}
      <div className="h-14 shrink-0" />

      {/* System branding strip */}
      <div className="px-4 py-3 border-b bg-muted/30">
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

      {/* Nav section label */}
      <div className="px-4 pt-4 pb-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          Navegación
        </p>
      </div>

      {/* Nav items — flex-1 to push logout to bottom */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <DashboardNav items={navItems} />
      </div>
    </nav>
  );
}
