####################################################################################################
## Build Packages / EXTENSIONS
####################################################################################################
FROM node:18-alpine AS builder

WORKDIR /directus

# Copiar todas las extensiones
COPY extensions/ extensions/

# Construir cada extensión
RUN for ext in $(ls extensions); do \
      if [ -f "extensions/$ext/package.json" ]; then \
          echo "Building extension: $ext"; \
          cd extensions/$ext && \
          npm install && \
          npm run build || exit 1; \
          echo "Contents of $ext/dist:"; ls -l dist || echo "No dist"; \
          cd -; \
      else \
          echo "Skipping extension $ext (no package.json found)"; \
      fi \
    done

####################################################################################################
## Create Production Image
####################################################################################################
FROM directus/directus:10

USER root

# Herramientas necesarias
RUN npm install -g corepack@latest && corepack enable
RUN apk add --no-cache postgresql-client dos2unix

# Directorio uploads
RUN mkdir -p /directus/uploads

# Copiar logo y script de inicialización
COPY logo-pdn-white.svg /directus/uploads/21cc850a-1c0c-4d15-aeeb-2ec0a8e98c26.svg
COPY init-modificaciones-db.sh /directus/init-modificaciones-db.sh
RUN dos2unix /directus/init-modificaciones-db.sh && chmod +x /directus/init-modificaciones-db.sh

# Copiar extensiones construidas desde el builder
COPY --from=builder --chown=node:node /directus/extensions /directus/extensions

# Usuario node y módulo de gestión de esquemas
USER node
RUN pnpm install directus-extension-schema-management-module@1.5.0
