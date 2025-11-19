#!/bin/bash

# 🔄 Script de Migración Automática V1 → V2 - PDN
# Script personalizado para Alan Rojas

set -e  # Detener en caso de error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🔄 Script de Migración V1 → V2 - PDN (Alan Rojas)    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Rutas configuradas
V1_PATH="/Users/alanrojas/PDN/herramienta-capturador-s3"
V2_PATH="/Users/alanrojas/PDN/s3_frontend"

print_info "Rutas configuradas:"
echo "  V1: $V1_PATH"
echo "  V2: $V2_PATH"
echo ""

# Verificar que las rutas existen
if [ ! -d "$V1_PATH" ]; then
    print_error "No se encontró el proyecto V1 en: $V1_PATH"
    exit 1
fi

if [ ! -d "$V2_PATH" ]; then
    print_error "No se encontró el proyecto V2 en: $V2_PATH"
    exit 1
fi

print_success "Ambos proyectos encontrados"
echo ""

# Cambiar al directorio V2
cd "$V2_PATH"
print_info "Trabajando en: $(pwd)"
echo ""

# Crear backup del V2 actual
print_info "Creando backup del proyecto V2 actual..."
BACKUP_DIR="${V2_PATH}_backup_$(date +%Y%m%d_%H%M%S)"
cp -r "$V2_PATH" "$BACKUP_DIR" 2>/dev/null || true
print_success "Backup creado en: $BACKUP_DIR"
echo ""

# Crear estructura de carpetas
print_info "Creando estructura de carpetas..."
mkdir -p backend/extensions
mkdir -p backend/migrations
mkdir -p backend/templates
mkdir -p frontend
print_success "Estructura de carpetas creada"
echo ""

# Mover archivos del frontend actual a carpeta frontend/
print_info "Moviendo archivos de Next.js a carpeta frontend/..."

# Lista de carpetas a mover
FOLDERS_TO_MOVE="app components lib hooks constants services types public"
for folder in $FOLDERS_TO_MOVE; do
    if [ -d "$folder" ]; then
        mv "$folder" frontend/ 2>/dev/null && print_success "$folder/ movido" || print_warning "$folder/ ya existe o no se pudo mover"
    fi
done

# Lista de archivos a mover
FILES_TO_MOVE="package.json package-lock.json next.config.js tsconfig.json tailwind.config.js postcss.config.js components.json middleware.ts next-env.d.ts"
for file in $FILES_TO_MOVE; do
    if [ -f "$file" ]; then
        mv "$file" frontend/ 2>/dev/null && print_success "$file movido" || print_warning "$file ya existe o no se pudo mover"
    fi
done

# Mover Dockerfile si existe
if [ -f "Dockerfile" ]; then
    print_warning "Dockerfile encontrado, moviéndolo a frontend/"
    mv Dockerfile frontend/
fi

# Mover .eslintrc.json si existe
if [ -f ".eslintrc.json" ]; then
    mv .eslintrc.json frontend/ 2>/dev/null && print_success ".eslintrc.json movido" || true
fi

echo ""

# Copiar archivos desde V1
print_info "Copiando configuraciones desde V1..."

# Extensions
if [ -d "$V1_PATH/extensions" ]; then
    if [ "$(ls -A $V1_PATH/extensions 2>/dev/null)" ]; then
        cp -r "$V1_PATH/extensions/"* backend/extensions/ 2>/dev/null || true
        print_success "Extensions copiadas"
    else
        print_warning "Carpeta extensions/ en V1 está vacía"
    fi
else
    print_warning "No se encontró carpeta extensions/ en V1"
fi

# Migrations
if [ -d "$V1_PATH/migrations" ]; then
    cp -r "$V1_PATH/migrations/"* backend/migrations/ 2>/dev/null || true
    print_success "Migrations copiadas"
else
    print_error "No se encontró carpeta migrations/ en V1 (REQUERIDA)"
    exit 1
fi

# Templates
if [ -d "$V1_PATH/templates" ]; then
    cp -r "$V1_PATH/templates/"* backend/templates/ 2>/dev/null || true
    print_success "Templates copiadas"
else
    print_warning "No se encontró carpeta templates/ en V1"
fi

# Init script
if [ -f "$V1_PATH/init-modificaciones-db.sh" ]; then
    cp "$V1_PATH/init-modificaciones-db.sh" backend/
    chmod +x backend/init-modificaciones-db.sh
    print_success "init-modificaciones-db.sh copiado"
else
    print_error "No se encontró init-modificaciones-db.sh en V1 (REQUERIDO)"
    exit 1
fi

# Logo
if [ -f "$V1_PATH/logo-pdn-white.svg" ]; then
    cp "$V1_PATH/logo-pdn-white.svg" backend/
    print_success "logo-pdn-white.svg copiado"
else
    print_warning "No se encontró logo-pdn-white.svg en V1"
fi

echo ""

# Verificar estructura final
print_info "Verificando estructura final..."
echo ""
echo "📁 Estructura del proyecto V2:"
if command -v tree &> /dev/null; then
    tree -L 2 -I 'node_modules' . || ls -la
else
    ls -la
    echo ""
    echo "📂 backend/:"
    ls -la backend/
    echo ""
    echo "📂 frontend/:"
    ls -la frontend/ | head -20
fi

echo ""
print_success "✨ Migración de archivos completada exitosamente"
echo ""
print_info "═════════════════════════════════════════════════════════"
print_info "📋 PRÓXIMOS PASOS:"
print_info "═════════════════════════════════════════════════════════"
echo ""
echo "  1️⃣  Copiar archivos de configuración descargados:"
echo "     cd $V2_PATH"
echo "     cp ~/Downloads/docker-compose.yml ."
echo "     cp ~/Downloads/Dockerfile.directus backend/Dockerfile"
echo "     cp ~/Downloads/Dockerfile.frontend frontend/Dockerfile  # Si no tienes uno"
echo ""
echo "  2️⃣  Crear y configurar .env:"
echo "     cp ~/Downloads/env.example .env"
echo "     nano .env  # Edita con tus valores"
echo ""
echo "     ⚠️  IMPORTANTE: Genera secrets con:"
echo "     openssl rand -base64 32"
echo ""
echo "  3️⃣  Verificar frontend/next.config.js:"
echo "     Asegúrate de tener: output: 'standalone'"
echo ""
echo "  4️⃣  Construir y levantar los servicios:"
echo "     docker-compose build"
echo "     docker-compose up -d"
echo ""
echo "  5️⃣  Verificar los logs:"
echo "     docker-compose logs -f"
echo ""
echo "  6️⃣  Verificar acceso:"
echo "     Frontend:  http://localhost:3060"
echo "     Backend:   http://localhost:8055"
echo ""
print_info "═════════════════════════════════════════════════════════"
echo ""
print_success "🎉 ¡Tu backup está en: $BACKUP_DIR"
print_success "📚 Lee la GUIA-MIGRACION.md para más detalles!"
echo ""
