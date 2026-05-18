import { NavItem } from "@/types";

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
    title: "Faltas No Graves",
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
