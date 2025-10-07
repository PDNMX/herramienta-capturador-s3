// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { signOut } from "next-auth/react";
import directus from "@/lib/directus";
import { readItems, withToken } from "@directus/sdk";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Users, Building2, User, TrendingUp } from "lucide-react";

export default function Page() {
  const { session, status } = useCurrentSession();
  const [data, setData] = useState({
    faltasGravesServidores: 0,
    faltasNoGravesServidores: 0,
    faltasGravesPersonasMorales: 0,
    faltasGravesPersonasFisicas: 0,
    totalFaltas: 0,
    ultimaActualizacion: new Date().toLocaleDateString('es-MX'),
  });

  useEffect(() => {
    if (session?.forceLogout) {
      signOut({ callbackUrl: "/" });
    } else if (status === "authenticated") {
      async function fetchData() {
        try {
          // Aquí conectarías con tu colección de Directus para el S3
          // Por ahora uso datos de ejemplo
          const mockData = {
            faltasGravesServidores: 45,
            faltasNoGravesServidores: 128,
            faltasGravesPersonasMorales: 23,
            faltasGravesPersonasFisicas: 67,
          };

          const total = Object.values(mockData).reduce((acc, val) => acc + val, 0);

          setData({
            ...mockData,
            totalFaltas: total,
            ultimaActualizacion: new Date().toLocaleDateString('es-MX'),
          });
        } catch (error) {
          console.error("Error al cargar los datos:", error);
        }
      }

      fetchData();
    }
  }, [session, status]);

  const categoryCards = [
    {
      title: "Faltas Administrativas Graves",
      subtitle: "Servidores Públicos",
      value: data.faltasGravesServidores,
      icon: AlertCircle,
      color: "from-red-500 to-red-600",
      textColor: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      title: "Faltas Administrativas No Graves",
      subtitle: "Servidores Públicos",
      value: data.faltasNoGravesServidores,
      icon: Users,
      color: "from-amber-500 to-amber-600",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      title: "Faltas Graves",
      subtitle: "Personas Morales",
      value: data.faltasGravesPersonasMorales,
      icon: Building2,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Faltas Graves",
      subtitle: "Personas Físicas",
      value: data.faltasGravesPersonasFisicas,
      icon: User,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Sistema 3
          </h1>
          <p className="text-lg text-muted-foreground">
            Sistema Nacional de Servidores Públicos y Particulares Sancionados
          </p>
        </div>

        {/* Welcome Card */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <span>👋</span> Bienvenido, {session?.user?.name || 'Usuario'}
            </CardTitle>
            <CardDescription className="text-base">
              Herramienta de captura y gestión de sanciones administrativas
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Total Counter - Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl"></div>
          <Card className="relative border-2 border-slate-200 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-center md:justify-start gap-6">
                <div className="p-6 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-2xl shadow-lg">
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Total de Sanciones Registradas
                  </p>
                  <div className="text-6xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                    {data.totalFaltas}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sanctions Grid - Creative Layout */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categoryCards.map((category, index) => {
            const percentage = data.totalFaltas > 0 
              ? ((category.value / data.totalFaltas) * 100).toFixed(1)
              : 0;
            
            return (
              <Card 
                key={index} 
                className={`group relative overflow-hidden border-2 ${category.borderColor} hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer`}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${category.bgColor} ${category.textColor}`}>
                        {category.subtitle}
                      </div>
                      <CardTitle className="text-base leading-tight">
                        {category.title}
                      </CardTitle>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Main number */}
                  <div className={`text-5xl font-black ${category.textColor}`}>
                    {category.value}
                  </div>

                  {/* Percentage bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        Del total
                      </span>
                      <span className={`text-sm font-bold ${category.textColor}`}>
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Additional info */}
                  <div className={`pt-3 border-t ${category.borderColor}`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Categoría</span>
                      <span className={`font-semibold ${category.textColor}`}>
                        {index < 2 ? 'Servidores Públicos' : 'Particulares'}
                      </span>
                    </div>
                  </div>
                </CardContent>

                {/* Corner decoration */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${category.color} opacity-10 rounded-bl-full`}></div>
              </Card>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}