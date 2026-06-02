"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { Dispatch, SetStateAction } from "react";

// Color accent per route
const routeColors: Record<string, { bg: string; activeBg: string; activeText: string }> = {
  "/inicio/faltas-administrativas-graves": {
    bg: "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400",
    activeBg: "bg-red-600 dark:bg-red-500",
    activeText: "text-white",
  },
  "/inicio/faltas-administrativas-no-graves": {
    bg: "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
    activeBg: "bg-amber-500 dark:bg-amber-500",
    activeText: "text-white",
  },
  "/inicio/faltas-graves-pm": {
    bg: "bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400",
    activeBg: "bg-violet-600 dark:bg-violet-500",
    activeText: "text-white",
  },
  "/inicio/faltas-graves-pf": {
    bg: "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    activeBg: "bg-blue-600 dark:bg-blue-500",
    activeText: "text-white",
  },
  "/inicio/administracion/usuarios": {
    bg: "bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400",
    activeBg: "bg-violet-600 dark:bg-violet-500",
    activeText: "text-white",
  },
};

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const path = usePathname();

  if (!items?.length) return null;

  return (
    <div className="flex flex-col gap-0.5">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        const isActive = item.href
          ? item.href === "/inicio"
            ? path === item.href
            : path.startsWith(item.href)
          : false;
        const color = item.href ? routeColors[item.href] : undefined;

        return (
          item.href && (
            <Link
              key={index}
              href={item.disabled ? "/" : item.href}
              onClick={() => { if (setOpen) setOpen(false); }}
            >
              <span
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-foreground font-semibold"
                    : "text-muted-foreground font-medium hover:bg-accent hover:text-foreground",
                  item.disabled && "cursor-not-allowed opacity-50"
                )}
              >
                {/* Active left border */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary rounded-r-full" />
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                    isActive && color
                      ? cn(color.activeBg, color.activeText, "shadow-sm")
                      : isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : color
                      ? cn(color.bg, "group-hover:opacity-90")
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="leading-snug truncate text-sm">{item.title}</div>
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
    </div>
  );
}
