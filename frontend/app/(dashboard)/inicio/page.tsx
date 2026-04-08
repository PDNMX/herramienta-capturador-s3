// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import directus from "@/lib/directus";
import { aggregate, withToken } from "@directus/sdk";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  Users,
  Building2,
  User,
  TrendingUp,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardData {
  faltasGravesServidores: number;
  faltasNoGravesServidores: number;
  faltasGravesPersonasMorales: number;
  faltasGravesPersonasFisicas: number;
  totalFaltas: number;
  ultimaActualizacion: string;
}

export default function Page() {
  const { session, status } = useCurrentSession();
  const [data, setData] = useState<DashboardData>({
    faltasGravesServidores: 0,
    faltasNoGravesServidores: 0,
    faltasGravesPersonasMorales: 0,
    faltasGravesPersonasFisicas: 0,
    totalFaltas: 0,
    ultimaActualizacion: "—",
  });

  const [isLoaded, setIsLoaded] = useState(false);

  const fetchData = async () => {
    if (!session?.access_token) return;
    try {
      const [gravesServidores, noGravesServidores, gravesMorales, gravesFisicas] =
        await Promise.all([
          directus.request(
            withToken(
              session.access_token,
              aggregate("faltas_administrativas_graves", { aggregate: { count: "*" } })
            )
          ),
          directus.request(
            withToken(
              session.access_token,
              aggregate("faltas_administrativas_no_graves", { aggregate: { count: "*" } })
            )
          ),
          directus.request(
            withToken(
              session.access_token,
              aggregate("faltas_graves_personas_morales", { aggregate: { count: "*" } })
            )
          ),
          directus.request(
            withToken(
              session.access_token,
              aggregate("faltas_graves_personas_fisicas", { aggregate: { count: "*" } })
            )
          ),
        ]);

      const counts = {
        faltasGravesServidores: parseInt(gravesServidores[0]?.count ?? "0"),
        faltasNoGravesServidores: parseInt(noGravesServidores[0]?.count ?? "0"),
        faltasGravesPersonasMorales: parseInt(gravesMorales[0]?.count ?? "0"),
        faltasGravesPersonasFisicas: parseInt(gravesFisicas[0]?.count ?? "0"),
      };

      const total = Object.values(counts).reduce((acc, val) => acc + val, 0);

      setData({
        ...counts,
        totalFaltas: total,
        ultimaActualizacion: new Date().toLocaleString("es-MX", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      });

      setTimeout(() => setIsLoaded(true), 100);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && !session?.forceLogout) {
      fetchData();
    }
  }, [session, status]);

  const categoryCards = [
    {
      title: "Faltas Administrativas Graves",
      subtitle: "Servidores Públicos",
      value: data.faltasGravesServidores,
      icon: AlertCircle,
      color: "from-red-500 to-rose-600",
      textColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      borderColor: "border-red-200 dark:border-red-800",
      progressColor: "bg-gradient-to-r from-red-500 to-rose-600",
      href: "/inicio/faltas-administrativas-graves",
    },
    {
      title: "Faltas Administrativas No Graves",
      subtitle: "Servidores Públicos",
      value: data.faltasNoGravesServidores,
      icon: Users,
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      borderColor: "border-amber-200 dark:border-amber-800",
      progressColor: "bg-gradient-to-r from-amber-500 to-orange-500",
      href: "/inicio/faltas-administrativas-no-graves",
    },
    {
      title: "Faltas Graves",
      subtitle: "Personas Morales",
      value: data.faltasGravesPersonasMorales,
      icon: Building2,
      color: "from-violet-500 to-purple-600",
      textColor: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-50 dark:bg-violet-950/30",
      borderColor: "border-violet-200 dark:border-violet-800",
      progressColor: "bg-gradient-to-r from-violet-500 to-purple-600",
      href: "/inicio/faltas-graves-pm",
    },
    {
      title: "Faltas Graves",
      subtitle: "Personas Físicas",
      value: data.faltasGravesPersonasFisicas,
      icon: User,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-800",
      progressColor: "bg-gradient-to-r from-blue-500 to-indigo-600",
      href: "/inicio/faltas-graves-pf",
    },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">

        {/* Header Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Sistema 3
            </h1>
          </div>
          <p className="text-muted-foreground pl-14">
            Sistema Nacional de Servidores Públicos y Particulares Sancionados
          </p>
        </div>

        {/* Welcome + Total — Hero Row */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Welcome Card */}
          <Card className="md:col-span-2 border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/8 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                Bienvenido,{" "}
                <span className="text-primary">
                  {session?.user?.name || "Usuario"}
                </span>
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Herramienta de captura y gestión de sanciones administrativas. 
                Aquí puedes consultar, registrar y administrar los expedientes de faltas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categoryCards.map((c, i) => (
                  <Link
                    key={i}
                    href={c.href}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all",
                      c.bgColor,
                      c.textColor,
                      "hover:opacity-80 hover:scale-105"
                    )}
                  >
                    <c.icon className="h-3 w-3" />
                    {c.subtitle === "Servidores Públicos"
                      ? c.title.replace("Faltas Administrativas ", "")
                      : `${c.title} · ${c.subtitle}`}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Total Counter Card */}
          <Card className="border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Total Registros
                </p>
                <div className="p-2 bg-slate-800 dark:bg-slate-600 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <div
                  className={cn(
                    "text-6xl font-black tabular-nums transition-all duration-700",
                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  )}
                >
                  {data.totalFaltas.toLocaleString("es-MX")}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Actualizado: {data.ultimaActualizacion}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Cards Grid */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Desglose por categoría
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((category, index) => {
              const percentage =
                data.totalFaltas > 0
                  ? ((category.value / data.totalFaltas) * 100).toFixed(1)
                  : "0.0";

              return (
                <Link key={index} href={category.href} className="h-full">
                  <Card
                    className={cn(
                      "group relative overflow-hidden border-2 cursor-pointer h-full flex flex-col",
                      "hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
                      category.borderColor,
                      "animate-in fade-in slide-in-from-bottom-4"
                    )}
                    style={{
                      animationDelay: `${index * 120}ms`,
                      animationDuration: "500ms",
                      animationFillMode: "backwards",
                    }}
                  >
                    {/* Hover gradient overlay */}
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300",
                        category.color
                      )}
                    />

                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div
                            className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2",
                              category.bgColor,
                              category.textColor
                            )}
                          >
                            {category.subtitle}
                          </div>
                          <CardTitle className="text-sm leading-snug">
                            {category.title}
                          </CardTitle>
                        </div>
                        <div
                          className={cn(
                            "p-2.5 rounded-xl bg-gradient-to-br shadow-md",
                            "group-hover:scale-110 transition-transform duration-300",
                            category.color
                          )}
                        >
                          <category.icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
                      {/* Count */}
                      <div
                        className={cn(
                          "text-5xl font-black tabular-nums transition-all duration-700",
                          category.textColor,
                          isLoaded ? "opacity-100" : "opacity-0"
                        )}
                      >
                        {category.value.toLocaleString("es-MX")}
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Del total
                          </span>
                          <span className={cn("text-xs font-bold", category.textColor)}>
                            {percentage}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all duration-1000 ease-out", category.progressColor)}
                            style={{
                              width: isLoaded ? `${percentage}%` : "0%",
                              transitionDelay: `${index * 120 + 300}ms`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Footer */}
                      <div
                        className={cn(
                          "pt-2 border-t flex items-center justify-between",
                          category.borderColor
                        )}
                      >
                        <span className="text-xs text-muted-foreground">
                          {index < 2 ? "Servidores Públicos" : "Particulares"}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-semibold flex items-center gap-1",
                            category.textColor,
                            "group-hover:gap-2 transition-all"
                          )}
                        >
                          Ver registros
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </CardContent>

                    {/* Corner decoration */}
                    <div
                      className={cn(
                        "absolute top-0 right-0 w-16 h-16 bg-gradient-to-br opacity-10 rounded-bl-full",
                        category.color
                      )}
                    />
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
