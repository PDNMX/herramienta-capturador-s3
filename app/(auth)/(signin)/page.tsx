//ts-nocheck
"use client"
import { Card } from "@/components/ui/card"
import { Shield, FileText, Database, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              Sistema Oficial
            </div>

            <h1 className="mb-6 text-balance font-sans text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Sistema Nacional de Servidores Públicos y Particulares Sancionados
            </h1>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
            Características del Sistema
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border bg-card p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">Captura de Datos</h3>
              <p className="text-pretty text-muted-foreground">
                Registre información de manera estructurada y segura siguiendo los estándares oficiales establecidos.
              </p>
            </Card>

            <Card className="border-border bg-card p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">Gestión Documental</h3>
              <p className="text-pretty text-muted-foreground">
                Administre expedientes y documentación relacionada con sanciones de forma organizada y accesible.
              </p>
            </Card>

            <Card className="border-border bg-card p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">Cumplimiento Normativo</h3>
              <p className="text-pretty text-muted-foreground">
                Sistema diseñado conforme a la normatividad vigente en materia de responsabilidades administrativas.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="border-t border-border bg-secondary/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">Comience a Utilizar el Sistema</h2>
            <p className="mb-8 text-pretty text-lg text-muted-foreground">
              Esta herramienta ha sido instalada localmente en su equipo. Para acceder a las funcionalidades del
              sistema, inicie sesión utilizando sus credenciales oficiales proporcionadas por su institución.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>Conexión segura y cifrada</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Cumplimiento normativo garantizado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            Sistema Nacional de Servidores Públicos y Particulares Sancionados
            <span className="mx-2">•</span>
            Herramienta Oficial de Captura
          </p>
        </div>
      </footer>
    </div>
  )
}
