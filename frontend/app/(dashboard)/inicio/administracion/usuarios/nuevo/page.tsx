// @ts-nocheck
"use client";

import BreadCrumb from "@/components/breadcrumb";
import { UsuarioForm } from "@/components/forms/usuarios/usuario-form";
import { ShieldCheck } from "lucide-react";

const breadcrumbItems = [
  { title: "Administración", link: "/inicio/administracion/usuarios" },
  { title: "Usuarios", link: "/inicio/administracion/usuarios" },
  { title: "Nuevo", link: "/inicio/administracion/usuarios/nuevo" },
];

export default function Page() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-950/50 shrink-0">
          <ShieldCheck className="h-5 w-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground leading-none mb-1">
            Nuevo Usuario
          </h2>
          <p className="text-sm text-muted-foreground">
            Administración · Crear cuenta de acceso
          </p>
        </div>
      </div>
      <UsuarioForm />
    </div>
  );
}
