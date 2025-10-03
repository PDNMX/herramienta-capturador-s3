"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { signOut } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";
import { Separator } from "@/components/ui/separator";

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  const LogoutIcon = Icons["login"];

  return (
    <nav className="grid h-full items-start gap-3">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
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
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
      {/* Logout */}
      <Separator />
      <div className="mt-auto">
        <Link key={"logout-sidebar"} href={'/'} onClick={() => signOut()}>
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              "bg-transparent cursor-pointer"
            )}
          >
            <LogoutIcon className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </span>
        </Link>
      </div>
    </nav>
  );
}
