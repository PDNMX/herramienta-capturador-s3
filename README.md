# Sistema Nacional de Servidores Públicos y Particulares Sancionados (S3)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Directus](https://img.shields.io/badge/Directus-10-6644FF?style=flat&logo=directus)](https://directus.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat&logo=docker)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)

Sistema de gestión y registro de sanciones administrativas para la Plataforma Digital Nacional (PDN). Permite capturar, consultar y administrar faltas graves cometidas por servidores públicos, personas morales y personas físicas.

---

## Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Desarrollo](#desarrollo)
- [Soporte](#soporte)

---

## Características

### Captura de Faltas
Registro completo para las 4 categorías del sistema:
- Faltas Administrativas Graves de Servidores Públicos
- Faltas Administrativas No Graves de Servidores Públicos
- Faltas Graves de Personas Morales
- Faltas Graves de Personas Físicas

Incluye formularios con validación en tiempo real, campos condicionales y secciones modulares.

### Dashboard
Visualización de estadísticas en tiempo real con métricas por categoría, gráficos de progreso y fecha de última actualización.

### Módulo de Administración
Accesible exclusivamente para el rol `Administrador-Frontend`:

- **Usuarios** — Alta, edición y activación/desactivación de usuarios del sistema. El usuario administrador de Directus se muestra como cuenta de sistema (bloqueada, sin acciones).
- **Entes Públicos** — Gestor inline para agregar y editar instituciones sin necesidad de páginas separadas.
- **Bitácora** — Registro de auditoría filtrado: muestra únicamente inicios de sesión y modificaciones en las colecciones de faltas. Excluye actividad del usuario administrador de Directus.

### Sesión y Seguridad
- JWT con duración de 24 horas y renovación automática del token de Directus.
- Detección de sesión expirada con modal bloqueante que redirige al login.
- Revalidación de sesión al cambiar de ruta, al volver al tab o al recuperar foco de ventana.
- Protección de rutas `/inicio/administracion/*` restringida al rol `Administrador-Frontend`.

### Interfaz
- Diseño responsive con tema claro/oscuro.
- Breadcrumbs, sidebar colapsable y componentes accesibles (Radix UI).

---

## Arquitectura

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Frontend      │◄────►│   API Backend    │◄────►│   PostgreSQL    │
│   (Next.js)     │      │   (Directus)     │      │   Database      │
│   Port: 3060    │      │   Port: 8055     │      │   Port: 5432    │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

### Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | TailwindCSS 3 + Radix UI |
| Autenticación | NextAuth v4 (JWT) |
| Tablas | TanStack React Table |
| Gráficos | Recharts |
| Backend/API | Directus 10 |
| Base de datos | PostgreSQL 14 |
| Contenedores | Docker + Docker Compose |

### Roles del Sistema

| Rol (interno) | Display | Permisos |
|---------------|---------|----------|
| `Administrador-Frontend` | Administrador | Acceso total al módulo de administración |
| `Usuario-Capturador` | Capturador | Captura y edición de faltas propias del ente |
| `Api-Interconexion` | — | Acceso programático vía API |

Los roles y permisos se importan desde `backend/migrations/roles.json` a través de la UI de Directus (Ajustes › Importar/Exportar).

---

## Requisitos Previos

- **Docker** v20.10+ y **Docker Compose** v2.0+
- **Git**

Para desarrollo local sin Docker: Node.js 18+ y PostgreSQL 14+.

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-repositorio> s3_frontend
cd s3_frontend

# 2. Configurar variables de entorno
cp .env-EXAMPLE .env
# Editar .env con tus valores

# 3. Generar secretos
openssl rand -base64 32   # Para DIRECTUS_SECRET
openssl rand -base64 32   # Para NEXTAUTH_SECRET

# 4. Levantar servicios
docker-compose up -d

# 5. Verificar
docker-compose ps
```

Accesos:
- **Frontend:** http://localhost:3060
- **Directus Admin:** http://localhost:8055

### Importar roles y permisos

Después del primer arranque, importar los permisos del sistema:

1. Iniciar sesión en Directus (http://localhost:8055)
2. Ir a **Ajustes › Importar/Exportar**
3. Importar el archivo `backend/migrations/roles.json`

---

## Configuración

### Variables de Entorno (`.env`)

```env
# Backend (Directus)
DIRECTUS_ADMIN_EMAIL=admin@example.com
DIRECTUS_ADMIN_PASSWORD=TuPasswordSegura123!
DIRECTUS_SECRET=<openssl rand -base64 32>
DATABASE_NAME=directus
DATABASE_USERNAME=directus
DATABASE_PASSWORD=TuPasswordDBSegura123!

# Frontend (Next.js)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8055
NEXTAUTH_URL=http://localhost:3060
NEXTAUTH_SECRET=<openssl rand -base64 32>

# CORS
CORS_ORIGIN=http://localhost:3060
```

En producción ajustar las URLs a los dominios públicos y agregar SSL mediante reverse proxy (Nginx/Traefik).

---

## Estructura del Proyecto

```
s3_frontend/
├── frontend/
│   ├── app/                        # App Router (Next.js)
│   │   ├── (dashboard)/inicio/
│   │   │   ├── administracion/     # Usuarios, Entes Públicos, Bitácora
│   │   │   ├── faltas-graves-*/    # Formularios de captura
│   │   │   └── page.tsx            # Dashboard principal
│   │   └── page.tsx                # Login
│   ├── components/
│   │   ├── layout/                 # SessionGuard, Sidebar, Header
│   │   ├── tables/                 # Tablas por módulo
│   │   ├── forms/                  # Formularios de captura
│   │   └── ui/                     # Componentes base (Radix UI / shadcn)
│   ├── hooks/
│   │   └── useCurrentSession.tsx   # Sesión con auto-refresh en focus/visibility
│   ├── lib/
│   │   └── auth-options.ts         # NextAuth: JWT, ROLE_ID_TO_NAME, token refresh
│   ├── types/
│   │   └── next-auth.ts            # Tipos de sesión y constante ROLES
│   └── proxy.ts                    # Middleware de protección de rutas
│
├── backend/
│   ├── migrations/
│   │   ├── roles.json              # Roles y permisos del sistema (importar en Directus)
│   │   └── colecciones.yaml        # Esquema de colecciones
│   ├── init-modificaciones-db.sh   # Script SQL: constraints, logo, flow, settings
│   └── Dockerfile
│
├── docker-compose.yml
├── .env-EXAMPLE
└── README.md
```

---

## Desarrollo

```bash
# Logs en tiempo real
docker-compose logs -f

# Reconstruir contenedores tras cambios de dependencias
docker-compose up -d --build

# Frontend en modo desarrollo local
cd frontend
npm install
npm run dev

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (elimina la BD)
docker-compose down -v
```

---

## Soporte

Para consultas técnicas o soporte: **pdn@sesna.gob.mx**

---

**Desarrollado para la Plataforma Digital Nacional (PDN)**
