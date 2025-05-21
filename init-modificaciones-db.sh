#!/bin/sh

echo "⏳ Esperando que la base de datos esté disponible..."

# Espera hasta que el puerto 5432 esté abierto en el servicio "db"
until nc -z db 5432; do
  sleep 1
done

echo "✅ Base de datos disponible. Ejecutando modificaciones..."

# Ejecuta las modificaciones usando la contraseña de la base de datos
PGPASSWORD="$DB_PASSWORD" psql -h db -U "$DB_USER" -d "$DB_DATABASE" <<EOF
-- Agregar restricción NOT NULL a los campos
ALTER TABLE directus_users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE directus_users ALTER COLUMN last_name SET NOT NULL;
ALTER TABLE directus_users ALTER COLUMN email SET NOT NULL;
EOF

# Verifica éxito del comando anterior
if [ $? -eq 0 ]; then
  echo "✅ Modificaciones aplicadas exitosamente."
else
  echo "❌ Error al aplicar las modificaciones." >&2
  exit 1
fi
