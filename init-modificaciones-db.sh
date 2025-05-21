#!/bin/sh

echo "⏳ Esperando que la base de datos esté disponible..."

# Espera hasta que el puerto 5432 esté abierto en el servicio "db"
until nc -z db 5432; do
  sleep 1
done

echo "✅ Base de datos disponible. Ejecutando configuración..."

# Ejecuta las modificaciones usando la contraseña de la base de datos
PGPASSWORD="$DB_PASSWORD" psql -h db -U "$DB_USER" -d "$DB_DATABASE" <<EOF

-- Agregar restricción NOT NULL a los campos de USUARIOS
ALTER TABLE directus_users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE directus_users ALTER COLUMN last_name SET NOT NULL;
ALTER TABLE directus_users ALTER COLUMN email SET NOT NULL;

-- Obtener el ID del usuario administrador
DO \$\$
DECLARE
    admin_id uuid;
BEGIN
    SELECT u.id INTO admin_id 
    FROM directus_users u
    JOIN directus_roles r ON u.role = r.id
    WHERE r.name = 'Administrator'
    LIMIT 1;

    -- Insertar el archivo del logo
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
        '2025-05-21 01:03:32.911+00',
        '2025-05-21 01:03:32.921+00',
        2334
    ) ON CONFLICT (id) DO NOTHING;
END \$\$;

-- Insertar o actualizar la configuración de Directus
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
EOF

# Verifica éxito del comando anterior
if [ $? -eq 0 ]; then
  echo "✅ Configuración aplicada exitosamente."
else
  echo "❌ Error al aplicar la configuración." >&2
  exit 1
fi
