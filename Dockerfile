FROM directus/directus:10

USER root
RUN corepack enable
USER node

RUN pnpm install directus-extension-schema-management-module@1.5.0

