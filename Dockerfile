####################################################################################################
## Build Packages / EXTENSIONS

# Para crear una nueva extensión:
# 1. Ejecutar: npx create-directus-extension en la carpeta extensions
# 2. Seleccionar tipo de extensión (endpoint, panel, etc)
# 3. Dar nombre a la extensión
# 4. La extensión se creará en extensions/[nombre-extension]/
# 5. Modificar el código en src/index.js
# 6. Reconstruir: docker-compose -p NOMBRE up -d --build
# Nota: El Dockerfile detectará automáticamente la extensión en la carpeta extensions/, la construirá y la copiará al contenedor

FROM node:18-alpine AS builder

WORKDIR /directus

COPY extensions/ extensions/

RUN for ext in $(ls extensions); do \
    echo "Building extension: $ext"; \
    cd extensions/$ext && \
    npm install && \
    npm run build || exit 1; \
    cd -; \
done

####################################################################################################
## Create Production Image
FROM directus/directus:10

USER root
RUN npm install -g corepack@latest
RUN corepack enable

# Copiar las extensiones construidas
COPY --from=builder --chown=node:node /directus/extensions /directus/extensions

# Instalar módulo de gestión de esquemas para importar ROLES
USER node
RUN pnpm install directus-extension-schema-management-module@1.5.0

