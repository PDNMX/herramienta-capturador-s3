#!/bin/sh

echo "⏳ Esperando que la base de datos esté disponible..."

# Espera hasta que el puerto 5432 esté abierto en el servicio "db"
until nc -z db 5432; do
  sleep 1
done

echo "✅ Base de datos disponible. Ejecutando configuración..."

# Ejecuta las modificaciones usando la contraseña de la base de datos
PGPASSWORD="$DB_PASSWORD" psql -h db -U "$DB_USER" -d "$DB_DATABASE" <<'EOF'

\echo '📝 Agregando restricciones NOT NULL a los campos de usuarios...'
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

    -- Definir el código de validación
    RAISE NOTICE '📝 Configurando código de validación...';
    validation_code := 'module.exports=async function(data){const{first_name,last_name}=data.$trigger.payload;const nameRegex=/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\\s''-]+$/;const validateNameField=(fieldName,value)=>{if(!value)return true;if(!nameRegex.test(value)){const invalidChars=[...new Set(value.match(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\\s''-]/g))];throw{message:`El campo ${fieldName.toUpperCase()} contiene caracteres no permitidos (${invalidChars.join(", ")}). Solo se aceptan letras del alfabeto latino (con o sin acento), Ñ/ñ, Ü/ü, espacios, apóstrofes ('') y guiones (-).`,extensions:{code:"FAILED_VALIDATION",field:fieldName,type:"regex",invalid:value}};}return true;};try{validateNameField("Nombre",first_name);validateNameField("Apellido",last_name);return data;}catch(error){throw error;}};';
    RAISE NOTICE '✅ Código de validación configurado';

    -- Insertar el flow de validación
    RAISE NOTICE '🔄 Insertando flow de validación...';
    INSERT INTO directus_flows (
        id, name, icon, color, description, status, trigger, 
        accountability, options, operation, date_created, user_created
    ) VALUES (
        '53a5b81e-ace6-41b7-b0cb-dfc9938e3b72',
        'valida-campos-usuario',
        'bolt',
        '#F8E45C',
        'Validar los campos first_name y last_name para que solo acepten valores en español, permitiendo letras del alfabeto español, vocales acentuadas, la letra eñe (ñ), la letra "ü" y espacios.',
        'active',
        'event',
        NULL,
        '{"type":"filter","scope":["items.create","items.update"],"collections":["directus_users"]}',
        '785dac40-bf87-4da9-9a2d-bd6f87b49a4a',
        CURRENT_TIMESTAMP,
        admin_id
    ) ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        icon = EXCLUDED.icon,
        color = EXCLUDED.color,
        description = EXCLUDED.description,
        status = EXCLUDED.status,
        trigger = EXCLUDED.trigger,
        accountability = EXCLUDED.accountability,
        options = EXCLUDED.options,
        operation = EXCLUDED.operation,
        date_created = EXCLUDED.date_created,
        user_created = EXCLUDED.user_created;
    RAISE NOTICE '✅ Flow de validación insertado/actualizado';

    -- Insertar la operación de validación
    RAISE NOTICE '🔄 Insertando operación de validación...';
    INSERT INTO directus_operations (
        id, name, key, type, position_x, position_y, options,
        resolve, reject, flow, date_created, user_created
    ) VALUES (
        '785dac40-bf87-4da9-9a2d-bd6f87b49a4a',
        'valida-regex',
        'valida_regex',
        'exec',
        19,
        1,
        json_build_object('code', validation_code),
        NULL,
        NULL,
        '53a5b81e-ace6-41b7-b0cb-dfc9938e3b72',
        CURRENT_TIMESTAMP,
        admin_id
    ) ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        key = EXCLUDED.key,
        type = EXCLUDED.type,
        position_x = EXCLUDED.position_x,
        position_y = EXCLUDED.position_y,
        options = EXCLUDED.options,
        resolve = EXCLUDED.resolve,
        reject = EXCLUDED.reject,
        flow = EXCLUDED.flow,
        date_created = EXCLUDED.date_created,
        user_created = EXCLUDED.user_created;
    RAISE NOTICE '✅ Operación de validación insertada/actualizada';

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

# Verifica éxito del comando anterior
if [ $? -eq 0 ]; then
  echo "✅ Configuración aplicada exitosamente."
else
  echo "❌ Error al aplicar la configuración." >&2
  exit 1
fi
