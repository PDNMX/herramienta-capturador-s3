import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: "Inicio",
    href: "/inicio",
    icon: "dashboard",
    label: "Inicio",
  },
  {
    title: "Faltas Graves Personas Morales",
    href: "/inicio/faltas-graves-pm",
    icon: "users",
    label: "entes",
  },
  {
    title: "Faltas Graves Personas Físicas",
    href: "/inicio/faltas-graves-pf",
    icon: "user",
    label: "personas",
  },
  {
    title: "Faltas Administrativas Graves",
    href: "/inicio/faltas-administrativas-graves",
    icon: "shield",
    label: "servidores",
  }];
