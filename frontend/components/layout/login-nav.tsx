"use client";

import UserAuthForm from "@/components/forms/user-auth-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";

export function LoginNav() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full px-5 text-sm font-medium bg-white text-primary hover:bg-white/90 hover:text-primary dark:bg-white dark:text-primary dark:hover:bg-white/90"
          >
            Ingresar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-72 rounded-xl border border-border p-6 shadow-xl"
          align="end"
          forceMount
        >
          <p className="mb-1 text-sm font-semibold text-foreground">Iniciar sesión</p>
          <UserAuthForm />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
