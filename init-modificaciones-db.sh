#!/bin/sh
set -e

echo "⏳ Esperando que la base de datos esté disponible..."
# Espera hasta que el servicio "db" esté disponible en el puerto 5432
until nc -z db 5432; do
  sleep 1
done
echo "✅ Base de datos disponible. Ejecutando configuración..."

echo "🔎 Verificando si existen flujos en la base de datos..."
FLOW_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h db -U "$DB_USER" -d "$DB_DATABASE" -t -c "SELECT COUNT(*) FROM directus_flows;" | tr -d '[:space:]')

if [ "$FLOW_COUNT" -eq 0 ]; then
  echo "📥 No existen flujos, importando desde flows.sql..."
  
  if [ -f /directus/flows.sql ]; then
    PGPASSWORD="$DB_PASSWORD" psql -h db -U "$DB_USER" -d "$DB_DATABASE" -f /directus/flows.sql
    echo "✅ Flujos importados correctamente."

    # quitamos el archivo flows.sql para evitar sobreescribir al reinciar el contenedor
    rm -f /directus/flows.sql
    echo "🧹 Archivo flows.sql eliminado del contenedor."
  else
    echo "⚠️ No se encontró el archivo flows.sql. No se realizó la importación."
  fi
else
  echo "✅ Ya existen flujos en la base de datos. Se omite la importación."
fi

echo "🔧 Ejecutando modificaciones estructurales y de configuración..."

PGPASSWORD="$DB_PASSWORD" psql -h db -U "$DB_USER" -d "$DB_DATABASE" <<'EOF'

\echo '🔒 Agregando restricciones NOT NULL a los campos de usuarios...'
ALTER TABLE directus_users ALTER COLUMN first_name SET NOT NULL;
\echo '✅ Campo first_name configurado como NOT NULL'
ALTER TABLE directus_users ALTER COLUMN last_name SET NOT NULL;
\echo '✅ Campo last_name configurado como NOT NULL'
ALTER TABLE directus_users ALTER COLUMN email SET NOT NULL;
\echo '✅ Campo email configurado como NOT NULL'

\echo '🔄 Iniciando configuración del flow y operaciones...'
DO $$
DECLARE
    admin_id uuid;
    validation_code text;
BEGIN
    -- Obtener el ID del administrador
    RAISE NOTICE '👤 Obteniendo ID del usuario administrador...';
    SELECT u.id INTO admin_id 
    FROM directus_users u
    JOIN directus_roles r ON u.role = r.id
    WHERE r.name = 'Administrator'
    LIMIT 1;
    RAISE NOTICE '✅ ID del administrador obtenido';

    -- Insertar el archivo del logo
    RAISE NOTICE '🖼️ Insertando archivo del logo...';
    INSERT INTO directus_files (
        id, storage, filename_disk, filename_download, title, type, 
        uploaded_by, created_on, modified_on, filesize
    ) VALUES (
        '21cc850a-1c0c-4d15-aeeb-2ec0a8e98c26',
        'local',
        '21cc850a-1c0c-4d15-aeeb-2ec0a8e98c26.svg',
        'logo-pdn-white.svg',
        'Logo Pdn White',
        'image/svg+xml',
        admin_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        2334
    ) ON CONFLICT (id) DO NOTHING;
    RAISE NOTICE '✅ Archivo del logo insertado/actualizado';
    
    -- Insertar o actualizar la configuración de Directus
    RAISE NOTICE '⚙️ Configurando ajustes de Directus...';
    INSERT INTO directus_settings (
        id, project_name, project_url, project_color, project_logo,
        auth_login_attempts, storage_asset_transform, custom_css,
        module_bar, default_language, default_appearance,
        default_theme_light, public_registration, public_registration_verify_email
    ) VALUES (
        1,
        'Herramienta de Captura del S3',
        'https://www.plataformadigitalnacional.org',
        '#9085DA',
        '21cc850a-1c0c-4d15-aeeb-2ec0a8e98c26',
        25,
        'all',
        '.forgot-password {margin-left: 2rem;}',
        '[{"type":"module","id":"content","enabled":true},{"type":"module","id":"users","enabled":true},{"type":"module","id":"files","enabled":false},{"type":"module","id":"insights","enabled":false},{"type":"module","id":"settings","enabled":true,"locked":true},{"type":"module","id":"schema-management-module","enabled":true}]',
        'es-MX',
        'auto',
        'Directus Color Match',
        false,
        true
    ) ON CONFLICT (id) DO UPDATE SET
        project_name = EXCLUDED.project_name,
        project_url = EXCLUDED.project_url,
        project_color = EXCLUDED.project_color,
        project_logo = EXCLUDED.project_logo,
        auth_login_attempts = EXCLUDED.auth_login_attempts,
        storage_asset_transform = EXCLUDED.storage_asset_transform,
        custom_css = EXCLUDED.custom_css,
        module_bar = EXCLUDED.module_bar,
        default_language = EXCLUDED.default_language,
        default_appearance = EXCLUDED.default_appearance,
        default_theme_light = EXCLUDED.default_theme_light,
        public_registration = EXCLUDED.public_registration,
        public_registration_verify_email = EXCLUDED.public_registration_verify_email;
    RAISE NOTICE '✅ Ajustes de Directus configurados';
END $$;
EOF

echo "✅ Script de inicialización completado correctamente."
