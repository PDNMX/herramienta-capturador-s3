"use client";

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { signOut } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";

// Color accent per route — matches dashboard + table headers
const routeColors: Record<string, { bg: string; text: string; activeBg: string; activeText: string }> = {
  "/inicio/faltas-administrativas-graves": {
    bg: "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400",
    text: "",
    activeBg: "bg-red-600 dark:bg-red-500",
    activeText: "text-white",
  },
  "/inicio/faltas-administrativas-no-graves": {
    bg: "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
    text: "",
    activeBg: "bg-amber-500 dark:bg-amber-500",
    activeText: "text-white",
  },
  "/inicio/faltas-graves-pm": {
    bg: "bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400",
    text: "",
    activeBg: "bg-violet-600 dark:bg-violet-500",
    activeText: "text-white",
  },
  "/inicio/faltas-graves-pf": {
    bg: "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    text: "",
    activeBg: "bg-blue-600 dark:bg-blue-500",
    activeText: "text-white",
  },
};

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="flex flex-col h-full gap-1">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        const isActive = item.href ? (item.href === "/inicio" ? path === item.href : path.startsWith(item.href)) : false;
        const color = item.href ? routeColors[item.href] : undefined;

        return (
          item.href && (
            <Link
              key={index}
              href={item.disabled ? "/" : item.href}
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
            >
              <span
                className={cn(
                  "group relative flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-foreground font-semibold"
                    : "text-muted-foreground font-medium hover:bg-accent hover:text-foreground",
                  item.disabled && "cursor-not-allowed opacity-50"
                )}
              >
                {/* Active left border */}
                {isActive && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-0.5 bg-primary rounded-r-full" />
                )}

                {/* Icon container */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 mt-0.5",
                    isActive && color
                      ? cn(color.activeBg, color.activeText, "shadow-sm")
                      : isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : color
                      ? cn(color.bg, "group-hover:opacity-90")
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="leading-snug truncate">{item.title}</div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground mt-0.5 font-normal leading-snug truncate">
                      {item.description}
                    </div>
                  )}
                </div>
              </span>
            </Link>
          )
        );
      })}

      {/* Logout */}
      <div className="mt-auto pt-2">
        <Separator className="mb-3" />
        <Link href="/" onClick={() => signOut()}>
          <span
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-destructive/10 group-hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" />
            </div>
            <span>Cerrar Sesión</span>
          </span>
        </Link>
      </div>
    </nav>
  );
}
