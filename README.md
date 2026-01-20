# Sistema Nacional de Servidores Públicos y Particulares Sancionados (S3)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Directus](https://img.shields.io/badge/Directus-10-6644FF?style=flat&logo=directus)](https://directus.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat&logo=docker)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)

Sistema de gestión y registro de sanciones administrativas para la Plataforma Digital Nacional (PDN). Permite capturar, consultar y administrar faltas graves cometidas por servidores públicos, personas morales y personas físicas.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API y Backend](#-api-y-backend)
- [Desarrollo](#-desarrollo)
- [Soporte](#-soporte)

## ✨ Características

### Dashboard Interactivo
- Visualización de estadísticas en tiempo real
- Cards con métricas de 4 categorías de sanciones:
  - Faltas Administrativas Graves de Servidores Públicos
  - Faltas Administrativas No Graves de Servidores Públicos
  - Faltas Graves de Personas Morales
  - Faltas Graves de Personas Físicas
- Gráficos de progreso y totales
- Fecha de última actualización

### Gestión de Faltas Graves
- Formulario completo para registro de faltas de personas morales
- Validación de datos en tiempo real
- Campos condicionales según contexto
- Secciones modulares

### Sistema de Administración
- Tabla de datos con búsqueda y filtros
- Edición de registros existentes
- Exportación de datos
- Sistema de autenticación robusto
- Control de accesos y roles

### Interfaz de Usuario
- Diseño responsive
- Tema claro y oscuro
- Componentes accesibles
- Navegación intuitiva con breadcrumbs
- Sidebar colapsable

## 🏗 Arquitectura

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Frontend      │◄────►│   API Backend    │◄────►│   PostgreSQL    │
│   (Next.js)     │      │   (Directus)     │      │   Database      │
│   Port: 3060    │      │   Port: 8055     │      │   Port: 5432    │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

### Stack Tecnológico

**Frontend:**
- **Framework:** Next.js 14.2 (App Router, SSR)
- **UI Library:** React 18.3
- **Lenguaje:** TypeScript 5.5
- **Estilos:** TailwindCSS 3.4
- **Componentes:** Radix UI (Accesibles)
- **Formularios:** React Hook Form + Zod
- **Autenticación:** NextAuth 4.24
- **Tablas:** TanStack React Table
- **Gráficos:** Recharts
- **Iconos:** Lucide React

**Backend:**
- **CMS/API:** Directus 10
- **Base de Datos:** PostgreSQL 14
- **Gestor de Procesos:** PM2
- **Migraciones:** Directus Schema Management

**DevOps:**
- **Containerización:** Docker + Docker Compose
- **Reverse Proxy:** Listo para Nginx/Traefik
- **Build:** Multi-stage Docker builds

## 📦 Requisitos Previos

Asegúrate de tener instalado:

- **Docker** (v20.10 o superior)
- **Docker Compose** (v2.0 o superior)
- **Git**

**O para desarrollo local sin Docker:**
- Node.js 18+ o 22+
- PostgreSQL 14+
- npm o pnpm

## 🚀 Instalación

### Opción 1: Instalación con Docker (Recomendada)

1. **Clonar el repositorio**

```bash
git clone https://github.com/PDNMX/herramienta-capturador-s3/tree/frontend s3_frontend
cd s3_frontend
```

2. **Crear archivo de configuración**

```bash
cp .env-EXAMPLE .env
```

3. **Editar variables de entorno** (ver sección [Configuración](#-configuración))

```bash
nano .env  # o usa tu editor preferido
```

4. **Generar secretos seguros**

```bash
# Generar DIRECTUS_SECRET
openssl rand -base64 32

# Generar NEXTAUTH_SECRET
openssl rand -base64 32
```

5. **Iniciar los servicios**

```bash
docker-compose up -d
```

6. **Verificar que los contenedores estén corriendo**

```bash
docker-compose ps
```

7. **Acceder a la aplicación**

- **Frontend:** http://localhost:3060
- **API Backend (Directus):** http://localhost:8055

### Opción 2: Instalación Local (Desarrollo)

#### Backend (Directus)

```bash
cd backend

#### Frontend (Next.js)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

## ⚙️ Configuración

### Variables de Entorno

Edita el archivo `.env` con tus configuraciones:

#### Configuración del Backend (Directus)

```env
# Usuario administrador inicial
DIRECTUS_ADMIN_EMAIL=admin@example.com
DIRECTUS_ADMIN_PASSWORD=TuPasswordSegura123!

# URL pública del backend
NEXT_PUBLIC_BACKEND_URL=http://localhost:8055

# Configuración de base de datos
DATABASE_NAME=directus
DATABASE_USERNAME=directus
DATABASE_PASSWORD=TuPasswordDBSegura123!

# Secreto de Directus (genera uno con: openssl rand -base64 32)
DIRECTUS_SECRET=tu-secret-key-aqui-generado-con-openssl

# Configuración de Email (SMTP) - Opcional
EMAIL_FROM=noreply@example.com
EMAIL_TRANSPORT=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
SMTP_SECURE=false
SMTP_IGNORE_TLS=false

# CORS (ajusta según tu dominio en producción)
CORS_ORIGIN=http://localhost:3060
```

#### Configuración del Frontend (Next.js)

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3060
NEXTAUTH_SECRET=tu-nextauth-secret-aqui-generado-con-openssl

# URL del Backend
NEXT_PUBLIC_BACKEND_URL=http://localhost:8055
```

### Configuración de Producción

Para despliegue en producción, ajusta:

1. **URLs públicas:**
```env
NEXT_PUBLIC_BACKEND_URL=https://api.tudominio.com
NEXTAUTH_URL=https://tudominio.com
CORS_ORIGIN=https://tudominio.com
```

2. **Passwords seguros:**
   - Usa contraseñas fuertes y únicas
   - Considera usar un gestor de secretos (AWS Secrets Manager, Vault, etc.)

3. **Email SMTP:**
   - Configura un servidor SMTP real para notificaciones

4. **SSL/TLS:**
   - Usa un reverse proxy (Nginx, Traefik) con certificados SSL
   - Redirige todo el tráfico HTTP a HTTPS

## 📖 Uso

### Primer Acceso

1. Accede a http://localhost:3060
2. Inicia sesión con las credenciales configuradas en `.env`:
   - Email: `DIRECTUS_ADMIN_EMAIL`
   - Password: `DIRECTUS_ADMIN_PASSWORD`

### Flujo de Trabajo

#### 1. Dashboard
- Visualiza estadísticas generales
- Revisa las 4 categorías de sanciones
- Consulta la fecha de última actualización

#### 2. Registrar Nueva Falta
- Navega a "Faltas Graves - Personas Morales"
- Haz clic en "Nueva Falta"
- Completa el formulario en secciones
- Guarda el registro

#### 3. Consultar y Editar
- Busca registros en la tabla
- Filtra por expediente
- Haz clic en "Editar" para modificar un registro

#### 4. Exportar Datos
- Usa las opciones de exportación (Excel, CSV)

### Administración de Directus

Accede al panel de administración de Directus en http://localhost:8055:
- Gestiona colecciones y campos
- Configura roles y permisos
- Administra usuarios
- Revisa logs y actividad

## 📁 Estructura del Proyecto

```
s3_frontend/
├── frontend/                    # Aplicación Next.js
│   ├── app/                     # App Router (Next.js 14)
│   │   ├── api/                 # API Routes (NextAuth)
│   │   ├── inicio/              # Páginas principales
│   │   │   ├── faltas-graves-pm/  # Gestión de faltas
│   │   │   └── page.tsx         # Dashboard
│   │   ├── layout.tsx           # Layout principal
│   │   └── page.tsx             # Página de login
│   ├── components/              # Componentes React
│   │   ├── ui/                  # Componentes base (Radix UI)
│   │   ├── inicio/              # Componentes del dashboard
│   │   ├── faltas-graves-pm/    # Componentes de formularios
│   │   ├── header.tsx           # Header de navegación
│   │   └── sidebar.tsx          # Sidebar de menú
│   ├── lib/                     # Utilidades y configuración
│   │   ├── auth.ts              # Configuración NextAuth
│   │   └── directus.ts          # Cliente Directus SDK
│   ├── services/                # Servicios de API
│   ├── types/                   # Tipos TypeScript
│   ├── hooks/                   # Custom React Hooks
│   ├── constants/               # Constantes de la app
│   ├── Dockerfile               # Dockerfile del frontend
│   ├── package.json             # Dependencias
│   └── tailwind.config.js       # Configuración Tailwind
│
├── backend/                     # Backend Directus
│   ├── extensions/              # Extensiones de Directus
│   ├── migrations/              # Migraciones de esquema
│   │   ├── colecciones.yaml     # Esquema de colecciones
│   │   ├── rol-ANA.json         # Rol de analista
│   │   └── roles.json           # Roles del sistema
│   ├── templates/               # Plantillas de email
│   ├── init-modificaciones-db.sh # Script de inicialización
│   └── Dockerfile               # Dockerfile del backend
│
├── docker-compose.yml           # Orquestación de servicios
├── .env-EXAMPLE                 # Ejemplo de variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── LICENSE                      # Licencia del proyecto
└── README.md                    # Este archivo
```

## 🔌 API y Backend

### Endpoints Principales

El backend Directus expone una API REST completa:

```
Base URL: http://localhost:8055
```

#### Autenticación

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}
```

**Respuesta:**
```json
{
  "data": {
    "access_token": "token_jwt",
    "refresh_token": "refresh_token",
    "expires": 900000
  }
}
```

#### Faltas Graves - Personas Morales

```http
# Listar faltas
GET /items/faltas_graves_personas_morales

# Obtener una falta específica
GET /items/faltas_graves_personas_morales/{id}

# Crear nueva falta
POST /items/faltas_graves_personas_morales

# Actualizar falta
PATCH /items/faltas_graves_personas_morales/{id}

# Eliminar falta
DELETE /items/faltas_graves_personas_morales/{id}
```

### Colecciones de Base de Datos

Las principales colecciones en Directus:

- `faltas_graves_personas_morales` - Registro principal de faltas
- `datos_generales_graves` - Datos generales de personas morales
- `datos_dg_rp` - Director General y Representante Legal
- `amonestacion_sancion` - Tipos de sanciones
- `clasificacion_falta` - Clasificación de faltas
- `tipo_falta` - Tipos de falta
- `causas_expediente` - Causas del expediente

### SDK de Directus

El frontend utiliza el SDK oficial de Directus:

```typescript
import { createDirectus, rest, authentication } from '@directus/sdk';

const client = createDirectus(process.env.NEXT_PUBLIC_BACKEND_URL)
  .with(rest())
  .with(authentication());

// Ejemplo de uso
const faltas = await client.request(
  readItems('faltas_graves_personas_morales', {
    fields: ['*'],
    limit: 10
  })
);
```

## 🛠 Desarrollo

### Comandos Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f frontend
docker-compose logs -f api

# Reiniciar un servicio
docker-compose restart frontend

# Reconstruir contenedores
docker-compose up -d --build

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡cuidado! elimina la BD)
docker-compose down -v

# Ejecutar comandos dentro de un contenedor
docker-compose exec api npx directus --help
docker-compose exec frontend npm run build
```

### Desarrollo Local del Frontend

```bash
cd frontend

# Modo desarrollo con hot-reload
npm run dev

# Build de producción
npm run build

# Iniciar build de producción
npm start
```

---
## 📞 Soporte

Para preguntas y soporte:
- pdn@sesna.gob.mx

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Directus](https://directus.io/) - Headless CMS
- [Radix UI](https://www.radix-ui.com/) - Componentes accesibles
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS
- [Plataforma Digital Nacional](https://www.plataformadigitalnacional.org/) - Proyecto PDN

---

**Desarrollado para la Plataforma Digital Nacional (PDN)**
