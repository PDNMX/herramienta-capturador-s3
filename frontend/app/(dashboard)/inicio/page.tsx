// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import directus from "@/lib/directus";
import { aggregate, readUsers, readItems, withToken } from "@directus/sdk";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  Users,
  Building2,
  User,
  TrendingUp,
  ArrowRight,
  Database,
  RefreshCw,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { ROLES } from "@/types/next-auth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

interface DashboardData {
  faltasGravesServidores: number;
  faltasNoGravesServidores: number;
  faltasGravesPersonasMorales: number;
  faltasGravesPersonasFisicas: number;
  totalFaltas: number;
  ultimaActualizacion: string;
}

const categoryCards = [
  {
    title: "Faltas Administrativas Graves",
    subtitle: "Servidores Públicos",
    key: "faltasGravesServidores" as const,
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
    key: "faltasNoGravesServidores" as const,
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
    key: "faltasGravesPersonasMorales" as const,
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
    key: "faltasGravesPersonasFisicas" as const,
    icon: User,
    color: "from-blue-500 to-indigo-600",
    textColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    progressColor: "bg-gradient-to-r from-blue-500 to-indigo-600",
    href: "/inicio/faltas-graves-pf",
  },
];

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
  const [adminStats, setAdminStats] = useState({ totalUsuarios: 0, totalEntes: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const isAdmin = session?.user?.roleName === ROLES.ADMINISTRADOR;

  // Wrapper que devuelve 0 si no tiene permisos en lugar de explotar
  const safeAggregate = async (collection: string) => {
    try {
      const result = await directus.request(
        withToken(session!.access_token, aggregate(collection, { aggregate: { count: "*" } }))
      );
      return parseInt((result as any)[0]?.count ?? "0");
    } catch {
      return 0;
    }
  };

  const fetchData = async () => {
    if (!session?.access_token) return;
    setIsLoaded(false);

    const isAdminUser = session?.user?.roleName === ROLES.ADMINISTRADOR;

    const promises: Promise<any>[] = [
      safeAggregate("faltas_administrativas_graves"),
      safeAggregate("faltas_administrativas_no_graves"),
      safeAggregate("faltas_graves_personas_morales"),
      safeAggregate("faltas_graves_personas_fisicas"),
    ];

    if (isAdminUser) {
      promises.push(
        directus.request(withToken(session.access_token, readUsers({ aggregate: { count: "*" } } as any)))
          .then((r: any) => parseInt(r?.[0]?.count ?? "0")).catch(() => 0),
        directus.request(withToken(session.access_token, readItems("ente_publico" as any, { aggregate: { count: "*" } } as any)))
          .then((r: any) => parseInt(r?.[0]?.count ?? "0")).catch(() => 0)
      );
    }

    const results = await Promise.all(promises);
    const [
      faltasGravesServidores,
      faltasNoGravesServidores,
      faltasGravesPersonasMorales,
      faltasGravesPersonasFisicas,
    ] = results;

    if (isAdminUser && results.length >= 6) {
      setAdminStats({ totalUsuarios: results[4], totalEntes: results[5] });
    }

    const counts = {
      faltasGravesServidores,
      faltasNoGravesServidores,
      faltasGravesPersonasMorales,
      faltasGravesPersonasFisicas,
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
  };

  useEffect(() => {
    if (status === "authenticated" && !session?.forceLogout) {
      fetchData();
    }
    if (session?.forceLogout) {
      signOut({ callbackUrl: "/" });
    }
  }, [session, status]);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight leading-none mb-1">
                Panel de Control
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistema Nacional de Servidores Públicos y Particulares Sancionados
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Actualizar
          </button>
        </div>

        {/* ── Admin Stats Row ── */}
        {isAdmin && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/50 shrink-0">
                  <ShieldCheck className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Usuarios</p>
                  <p className="text-3xl font-black text-foreground tabular-nums">{adminStats.totalUsuarios}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 shrink-0">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Entes Públicos</p>
                  <p className="text-3xl font-black text-foreground tabular-nums">{adminStats.totalEntes}</p>
                </div>
              </CardContent>
            </Card>
            <Card
              className="border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => window.location.href = "/inicio/administracion/actividad"}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 shrink-0">
                  <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Bitácora</p>
                  <p className="text-sm font-semibold text-muted-foreground mt-0.5">Ver actividad →</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Capturista: ente info ── */}
        {!isAdmin && session?.user?.entePublico && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-3 flex items-center gap-3">
            <Building2 className="h-4 w-4 text-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              Capturando registros para:{" "}
              <span className="font-semibold text-foreground">{session.user.entePublicoNombre || session.user.entePublico}</span>
            </p>
          </div>
        )}

        {/* ── Hero Row: Welcome + Total ── */}
        <div className="grid gap-4 md:grid-cols-3">

          {/* Welcome card */}
          <Card className="md:col-span-2 border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/[0.07] to-transparent">
            <CardContent className="p-6 h-full flex flex-col">
              {/* Text block — top */}
              <div className="space-y-1.5">
                <p className="text-base font-semibold leading-snug">
                  Bienvenido,{" "}
                  <span className="text-primary">
                    {session?.user?.name || "Usuario"}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Herramienta de captura y gestión de sanciones administrativas.
                  Consulta, registra y administra expedientes de faltas.
                </p>
              </div>

              {/* Pills — pushed to bottom */}
              <div className="mt-auto pt-4 border-t border-primary/10 flex flex-wrap gap-2">
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
          <Card className="border border-border bg-card overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            <CardContent className="p-6 h-full flex flex-col gap-4 relative">
              {/* Label + icon */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Total Registros
                </p>
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
              </div>
              {/* Number */}
              <div
                className={cn(
                  "text-5xl font-black tabular-nums text-foreground transition-all duration-700 leading-none",
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                )}
              >
                {data.totalFaltas.toLocaleString("es-MX")}
              </div>
              {/* Mini bar chart */}
              <div className="flex gap-1.5 h-10 items-end mt-auto">
                {categoryCards.map((c, i) => {
                  const val = data[c.key] ?? 0;
                  const pct = data.totalFaltas > 0 ? (val / data.totalFaltas) * 100 : 0;
                  return (
                    <div key={i} title={`${c.subtitle}: ${val}`} className="flex-1 flex flex-col justify-end h-full">
                      <div
                        className={cn("w-full rounded-sm transition-all duration-700", c.progressColor)}
                        style={{
                          height: `${Math.max(pct, 8)}%`,
                          transitionDelay: `${i * 100 + 400}ms`,
                          opacity: isLoaded ? 1 : 0,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              {/* Timestamp */}
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                Actualizado: {data.ultimaActualizacion}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── Category Cards Grid ── */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Desglose por categoría
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((category, index) => {
              const value = data[category.key] ?? 0;
              const percentage =
                data.totalFaltas > 0
                  ? ((value / data.totalFaltas) * 100).toFixed(1)
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

                    <CardContent className="p-5 flex flex-col gap-4 flex-1">
                      {/* Header row: subtitle pill + icon */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                              category.bgColor,
                              category.textColor
                            )}
                          >
                            {category.subtitle}
                          </span>
                          <p className="text-sm font-semibold text-foreground mt-2 leading-snug">
                            {category.title}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "p-2.5 rounded-xl bg-gradient-to-br shadow-md shrink-0",
                            "group-hover:scale-110 transition-transform duration-300",
                            category.color
                          )}
                        >
                          <category.icon className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      {/* Count — pushed down with mt-auto so it's always at the same vertical position */}
                      <div className="mt-auto">
                        <div
                          className={cn(
                            "text-4xl font-black tabular-nums leading-none transition-all duration-700",
                            category.textColor,
                            isLoaded ? "opacity-100" : "opacity-0"
                          )}
                        >
                          {value.toLocaleString("es-MX")}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Del total</span>
                          <span className={cn("text-xs font-bold tabular-nums", category.textColor)}>
                            {percentage}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
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
                          "pt-3 border-t flex items-center justify-between",
                          category.borderColor
                        )}
                      >
                        <span className="text-xs text-muted-foreground">
                          {index < 2 ? "Servidores Públicos" : "Particulares"}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-semibold flex items-center gap-1 transition-all",
                            category.textColor,
                            "group-hover:gap-2"
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
