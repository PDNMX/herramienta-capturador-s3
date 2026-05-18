import Image from 'next/image'
import logoS3 from './ico_s3.svg'


export default function Landing() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Grid de fondo mejorado */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      {/* Efectos de luz de fondo mejorados */}
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-primary/30 blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-0 left-1/4 -z-10 h-[350px] w-[350px] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/4 right-1/4 -z-10 h-[250px] w-[250px] rounded-full bg-primary/15 blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="mx-auto max-w-5xl text-center">
        {/* Logo mejorado con animación */}
        <div className="mb-12 inline-flex items-center justify-center animate-float">
          <div className="relative">
            {/* Anillos de pulso múltiples */}
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 blur-xl" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 animate-pulse rounded-full bg-primary/30 blur-2xl" style={{ animationDuration: '4s' }} />

            {/* Círculo exterior giratorio */}
            <div className="absolute -inset-4 rounded-full border-2 border-dashed border-primary/30 animate-spin" style={{ animationDuration: '20s' }} />

            {/* Escudo principal */}
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-4 border-primary/40 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent shadow-2xl shadow-primary/40">
              {/* Efecto de brillo interno */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent" />

              <Image
                src={logoS3}
                alt="Sistema Nacional"
                width={80}
                height={80}
                className="drop-shadow-2xl"
                priority
              />

              {/* Destellos */}
              <div className="absolute top-1/4 right-1/4 h-2 w-2 rounded-full bg-white/80 blur-sm animate-pulse" />
              <div className="absolute bottom-1/3 left-1/3 h-1.5 w-1.5 rounded-full bg-white/60 blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>

        {/* Título mejorado */}
        <h1 className="text-balance font-sans text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
              Sistema Nacional
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </span>
          <br />
          <span className="relative inline-block text-4xl md:text-5xl lg:text-6xl mt-2">
            <span className="bg-gradient-to-r from-foreground/90 via-primary/90 to-foreground/90 bg-clip-text text-transparent">
              de Servidores Públicos
            </span>
          </span>
          <br />
          <span className="relative inline-block text-4xl md:text-5xl lg:text-6xl mt-2">
            <span className="bg-gradient-to-r from-foreground/90 via-primary/90 to-foreground/90 bg-clip-text text-transparent">
              y Particulares Sancionados
            </span>
          </span>
        </h1>

        {/* Línea decorativa mejorada */}
        <div className="relative mx-auto mt-12 h-1 w-32 overflow-hidden rounded-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer bg-[length:200%_auto]" />
        </div>

        {/* Partículas decorativas sutiles */}
        <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-primary/30 blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/3 right-1/3 h-1.5 w-1.5 rounded-full bg-primary/25 blur-sm animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/4 right-1/4 h-2 w-2 rounded-full bg-primary/30 blur-sm animate-pulse" style={{ animationDelay: '2.5s' }} />
        <div className="absolute bottom-1/3 left-1/3 h-1.5 w-1.5 rounded-full bg-primary/25 blur-sm animate-pulse" style={{ animationDelay: '3.5s' }} />
      </div>
    </div>
  )
}
