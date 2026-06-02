"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { UserCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { ROLES } from "@/types/next-auth";

const roleLabels: Record<string, string> = {
  [ROLES.ADMINISTRADOR]: "Administrador",
  [ROLES.CAPTURADOR]: "Capturista",
  [ROLES.API]: "API",
};

export function UserNav() {
  const { session } = useCurrentSession();
  if (!session) return null;

  const roleName = session.user?.roleName ?? "";
  const roleLabel = roleLabels[roleName] ?? roleName;
  const initials = session.user?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/20 dark:hover:bg-white/20">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user?.image ?? ""} alt={session.user?.name ?? ""} />
            <AvatarFallback className="bg-white text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
            {roleLabel && (
              <p className="text-xs leading-none text-primary font-medium mt-1">{roleLabel}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/inicio/perfil">
          <DropdownMenuItem className="cursor-pointer">
            <UserCircle className="mr-2 h-4 w-4" />
            Mi perfil
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
