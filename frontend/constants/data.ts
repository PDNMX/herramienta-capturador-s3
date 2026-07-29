import { NavItem } from "@/types";

export const adminNavItems: NavItem[] = [
  {
    title: "Usuarios",
    href: "/inicio/administracion/usuarios",
    icon: "usersAdmin",
    label: "usuarios",
    description: "Gestión de usuarios del sistema",
  },
  {
    title: "Entes Públicos",
    href: "/inicio/administracion/entes",
    icon: "building",
    label: "entes",
    description: "Gestión de entes públicos",
  },
  {
    title: "Bitácora",
    href: "/inicio/administracion/actividad",
    icon: "activity",
    label: "actividad",
    description: "Registro de actividad del sistema",
  },
];

export const navItems: NavItem[] = [
  {
    title: "Inicio",
    href: "/inicio",
    icon: "dashboard",
    label: "Inicio",
    description: "Panel de resumen general",
  },
  {
    title: "Faltas Administrativas Graves",
    href: "/inicio/faltas-administrativas-graves",
    icon: "alertCircle",
    label: "servidores",
    description: "Servidores públicos · graves",
  },
  {
    title: "Faltas Administrativas No Graves",
    href: "/inicio/faltas-administrativas-no-graves",
    icon: "users",
    label: "no graves",
    description: "Servidores públicos · no graves",
  },
  {
    title: "Faltas Graves Personas Morales",
    href: "/inicio/faltas-graves-pm",
    icon: "building",
    label: "entes",
    description: "Personas morales sancionadas",
  },
  {
    title: "Faltas Graves Personas Físicas",
    href: "/inicio/faltas-graves-pf",
    icon: "user",
    label: "personas",
    description: "Personas físicas sancionadas",
  },
];
