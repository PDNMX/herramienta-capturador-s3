#!/bin/sh

echo "⏳ Esperando que la base de datos esté disponible..."

# Espera hasta que el puerto 5432 esté abierto en el servicio "db"
until nc -z db 5432; do
  sleep 1
done

echo "✅ Base de datos disponible. Ejecutando configuración..."

# Ejecuta las modificaciones usando la contraseña de la base de datos
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

    -- Definir el código de validación para usuarios
    RAISE NOTICE '🔒 Configurando código de validación para usuarios...';
    validation_code := 'module.exports=async function(data){const{first_name,last_name,location,title}=data.$trigger.payload;const nameRegex=/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s''-]+$/;const validateNameField=(fieldName,value)=>{if(!value)return true;if(!nameRegex.test(value)){const invalidChars=[...new Set(value.match(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s''-]/g))];throw{message:`El campo ${fieldName.toUpperCase()} contiene caracteres no permitidos (${invalidChars.join(", ")}). Solo se aceptan letras del alfabeto latino (con o sin acento), Ñ/ñ, Ü/ü, espacios, apóstrofes (''-'') y guiones (-).`,extensions:{code:"FAILED_VALIDATION",field:fieldName,type:"regex",invalid:value}};}return true;};try{validateNameField("Nombre",first_name);validateNameField("Apellido",last_name);validateNameField("Ubicación",location);validateNameField("Título",title);return data;}catch(error){throw error;}};';
    RAISE NOTICE '✅ Código de validación para usuarios configurado';

    -- Insertar el flow de validación para usuarios
    RAISE NOTICE '🔄 Insertando flow de validación para usuarios...';
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
    RAISE NOTICE '✅ Flow de validación para usuarios insertado/actualizado';

    -- Insertar la operación de validación para usuarios
    RAISE NOTICE '🔄 Insertando operación de validación para usuarios...';
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
    RAISE NOTICE '✅ Operación de validación para usuarios insertada/actualizada';

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

-- FLOWS PARA VALIDACIÓN DE NOMBRES EN LAS TRES COLECCIONES

-- FLOW PARA datos_generales_graves
\echo '🔄 Configurando flow para datos_generales_graves...'
DO $$
DECLARE
    admin_id uuid;
    validation_code_graves text;
    flow_id_graves uuid := '11111111-1111-1111-1111-111111111111';
    operation_id_graves uuid := '22222222-2222-2222-2222-222222222222';
BEGIN
    -- Obtener ID del administrador
    SELECT u.id INTO admin_id 
    FROM directus_users u
    JOIN directus_roles r ON u.role = r.id
    WHERE r.name = 'Administrator'
    LIMIT 1;

    -- Código de validación para datos_generales_graves
    validation_code_graves := 'module.exports=async function(data){const payload=data.$trigger?.payload||data;const nombres=payload.nombres;const nameRegex=/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s''-]+$/;if(!nombres)return data;if(!nameRegex.test(nombres)){const invalidChars=[...new Set(nombres.match(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s''-]/g))];throw new Error(`El campo NOMBRES contiene caracteres no permitidos (${invalidChars.join(", ")}). Solo se aceptan letras del alfabeto latino, Ñ/ñ, Ü/ü, espacios, apóstrofes y guiones.`);}return data;};';

    -- Insertar flow para datos_generales_graves
    INSERT INTO directus_flows (
        id, name, icon, color, description, status, trigger, 
        accountability, options, operation, date_created, user_created
    ) VALUES (
        flow_id_graves,
        'valida-nombres-graves',
        'bolt',
        '#FF6B6B',
        'Validar campo nombres en datos_generales_graves',
        'active',
        'event',
        NULL,
        '{"type":"filter","scope":["items.create","items.update"],"collections":["datos_generales_graves"]}',
        operation_id_graves,
        CURRENT_TIMESTAMP,
        admin_id
    ) ON CONFLICT (id) DO UPDATE SET
        options = EXCLUDED.options,
        status = EXCLUDED.status,
        name = EXCLUDED.name,
        icon = EXCLUDED.icon,
        color = EXCLUDED.color,
        description = EXCLUDED.description;

    -- Insertar operación para datos_generales_graves
    INSERT INTO directus_operations (
        id, name, key, type, position_x, position_y, options,
        resolve, reject, flow, date_created, user_created
    ) VALUES (
        operation_id_graves,
        'validar-nombres-graves',
        'validar_nombres_graves',
        'exec',
        19,
        1,
        json_build_object('code', validation_code_graves),
        NULL,
        NULL,
        flow_id_graves,
        CURRENT_TIMESTAMP,
        admin_id
    ) ON CONFLICT (id) DO UPDATE SET
        options = EXCLUDED.options,
        name = EXCLUDED.name,
        key = EXCLUDED.key;

    RAISE NOTICE '✅ Flow para datos_generales_graves configurado';
END $$;

-- FLOW PARA datos_generales_no_graves
\echo '🔄 Configurando flow para datos_generales_no_graves...'
DO $$
DECLARE
    admin_id uuid;
    validation_code_no_graves text;
    flow_id_no_graves uuid := '33333333-3333-3333-3333-333333333333';
    operation_id_no_graves uuid := '44444444-4444-4444-4444-444444444444';
BEGIN
    -- Obtener ID del administrador
    SELECT u.id INTO admin_id 
    FROM directus_users u
    JOIN directus_roles r ON u.role = r.id
    WHERE r.name = 'Administrator'
    LIMIT 1;

    -- Código de validación para datos_generales_no_graves
    validation_code_no_graves := 'module.exports=async function(data){const payload=data.$trigger?.payload||data;const nombres=payload.nombres;const nameRegex=/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s''-]+$/;if(!nombres)return data;if(!nameRegex.test(nombres)){const invalidChars=[...new Set(nombres.match(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s''-]/g))];throw new Error(`El campo NOMBRES contiene caracteres no permitidos (${invalidChars.join(", ")}). Solo se aceptan letras del alfabeto latino, Ñ/ñ, Ü/ü, espacios, apóstrofes y guiones.`);}return data;};';

    -- Insertar flow para datos_generales_no_graves
    INSERT INTO directus_flows (
        id, name, icon, color, description, status, trigger, 
        accountability, options, operation, date_created, user_created
    ) VALUES (
        flow_id_no_graves,
        'valida-nombres-no-graves',
        'bolt',
        '#4ECDC4',
        'Validar campo nombres en datos_generales_no_graves',
        'active',
        'event',
        NULL,
        '{"type":"filter","scope":["items.create","items.update"],"collections":["datos_generales_no_graves"]}',
        operation_id_no_graves,
        CURRENT_TIMESTAMP,
        admin_id
    ) ON CONFLICT (id) DO UPDATE SET
        options = EXCLUDED.options,
        status = EXCLUDED.status,
        name = EXCLUDED.name,
        icon = EXCLUDED.icon,
        color = EXCLUDED.color,
        description = EXCLUDED.description;

    -- Insertar operación para datos_generales_no_graves
    INSERT INTO directus_operations (
        id, name, key, type, position_x, position_y, options,
        resolve, reject, flow, date_created, user_created
    ) VALUES (
        operation_id_no_graves,
        'validar-nombres-no-graves',
        'validar_nombres_no_graves',
        'exec',
        19,
        1,
        json_build_object('code', validation_code_no_graves),
        NULL,
        NULL,
        flow_id_no_graves,
        CURRENT_TIMESTAMP,
        admin_id
    ) ON CONFLICT (id) DO UPDATE SET
        options = EXCLUDED.options,
        name = EXCLUDED.name,
        key = EXCLUDED.key;

    RAISE NOTICE '✅ Flow para datos_generales_no_graves configurado';
END $$;

-- FLOW PARA datos_generales_personas_fisicas
\echo '🔄 Configurando flow para datos_generales_personas_fisicas...'
DO $$
DECLARE
    admin_id uuid;
    validation_code_fisicas text;
    flow_id_fisicas uuid := '55555555-5555-5555-5555-555555555555';
    operation_id_fisicas uuid := '66666666-6666-6666-6666-666666666666';
BEGIN
    -- Obtener ID del administrador
    SELECT u.id INTO admin_id 
    FROM directus_users u
    JOIN directus_roles r ON u.role = r.id
    WHERE r.name = 'Administrator'
    LIMIT 1;

    -- Código de validación para datos_generales_personas_fisicas
    validation_code_fisicas := 'module.exports=async function(data){const payload=data.$trigger?.payload||data;const nombres=payload.nombres;const nameRegex=/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s''-]+$/;if(!nombres)return data;if(!nameRegex.test(nombres)){const invalidChars=[...new Set(nombres.match(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s''-]/g))];throw new Error(`El campo NOMBRES contiene caracteres no permitidos (${invalidChars.join(", ")}). Solo se aceptan letras del alfabeto latino, Ñ/ñ, Ü/ü, espacios, apóstrofes y guiones.`);}return data;};';

    -- Insertar flow para datos_generales_personas_fisicas
    INSERT INTO directus_flows (
        id, name, icon, color, description, status, trigger, 
        accountability, options, operation, date_created, user_created
    ) VALUES (
        flow_id_fisicas,
        'valida-nombres-personas-fisicas',
        'bolt',
        '#45B7D1',
        'Validar campo nombres en datos_generales_personas_fisicas',
        'active',
        'event',
        NULL,
        '{"type":"filter","scope":["items.create","items.update"],"collections":["datos_generales_personas_fisicas"]}',
        operation_id_fisicas,
        CURRENT_TIMESTAMP,
        admin_id
    ) ON CONFLICT (id) DO UPDATE SET
        options = EXCLUDED.options,
        status = EXCLUDED.status,
        name = EXCLUDED.name,
        icon = EXCLUDED.icon,
        color = EXCLUDED.color,
        description = EXCLUDED.description;

    -- Insertar operación para datos_generales_personas_fisicas
    INSERT INTO directus_operations (
        id, name, key, type, position_x, position_y, options,
        resolve, reject, flow, date_created, user_created
    ) VALUES (
        operation_id_fisicas,
        'validar-nombres-fisicas',
        'validar_nombres_fisicas',
        'exec',
        19,
        1,
        json_build_object('code', validation_code_fisicas),
        NULL,
        NULL,
        flow_id_fisicas,
        CURRENT_TIMESTAMP,
        admin_id
    ) ON CONFLICT (id) DO UPDATE SET
        options = EXCLUDED.options,
        name = EXCLUDED.name,
        key = EXCLUDED.key;

    RAISE NOTICE '✅ Flow para datos_generales_personas_fisicas configurado';
END $$;

-- FLOWS PARA VALIDACIÓN DE DUPLICADOS EN LAS CUATRO COLECCIONES

-- ***** BLOQUE CORREGIDO *****
-- FLOW PARA validar-duplicados (Personas Morales)
\echo '🔄 Configurando flow de validación de duplicados para faltas_graves_personas_morales...'
DO $$
DECLARE
    admin_id uuid;
    flow_id_morales uuid := '77777777-7777-7777-7777-777777777777';
    
    -- IDs de todas las operaciones en la cadena
    op_id_start_log uuid := '2bffe828-4212-4607-a256-006b66630292';
    op_id_read_current uuid := 'b7e8dc0e-a475-4338-a7ba-4ad090ddc4e8';
    op_id_transform_data uuid := '4930d1a0-69e4-4ec7-85fc-365b7a08ee80';
    op_id_log_debug uuid := '7c5b55f8-b679-43e9-88e3-a4286d59dcd5';
    op_id_read_duplicate uuid := '75761f42-2f0c-4043-86ed-b238ffa6e81e';
    op_id_condition uuid := '7e4efa96-f659-49c3-ae4c-471ab839bdfb';
    op_id_exec_error uuid := 'f6c1e71c-fca8-4270-ac87-3fd01bb2bd31';
    
    -- Código para la operación 'exec'
    code_exec_error text;
BEGIN
    -- Obtener ID del administrador
    SELECT u.id INTO admin_id 
    FROM directus_users u
    JOIN directus_roles r ON u.role = r.id
    WHERE r.name = 'Administrator'
    LIMIT 1;

    -- Código de la operación de error
    code_exec_error := 'module.exports = async function(data) {
	console.log("Ya existe una sanción registrada con la misma persona (CURP/RFC) y expediente")
	return {};
}';

    -- Insertar flow
    INSERT INTO directus_flows (
        id, name, icon, color, description, status, trigger, 
        accountability, options, operation, date_created, user_created
    ) VALUES (
        flow_id_morales,
        'validar-duplicados', -- Nombre corregido
        'content_copy',
        '#FF9800',
        'Validar duplicados en faltas_graves_personas_morales por expediente y RFC',
        'active',
        'event',
        NULL,
        '{"type":"filter","scope":["items.create","items.update"],"collections":["faltas_graves_personas_morales"]}',
        op_id_start_log, -- Operación inicial
        CURRENT_TIMESTAMP,
        admin_id
    ) ON CONFLICT (id) DO UPDATE SET
        options = EXCLUDED.options,
        status = EXCLUDED.status,
        name = EXCLUDED.name,
        icon = EXCLUDED.icon,
        color = EXCLUDED.color,
        description = EXCLUDED.description,
        operation = EXCLUDED.operation;

    -- Insertar TODAS las operaciones de la cadena
    -- Operación 1: log (Inicio)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_start_log, 'Imprimir todo', 'imprimir_todo', 'log', 6, 21, '{"message":"{{ $trigger }}"}', op_id_read_current, NULL, flow_id_morales, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve;

    -- Operación 2: item-read (Leer registro actual)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_read_current, 'Ejecutar script', 'registroActual', 'item-read', 22, 19, '{"collection":"{{$trigger.collection}}","query":{"filter":{"id":{"_eq":"{{ $trigger.keys[0] }}"}}}}', op_id_transform_data, NULL, flow_id_morales, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve;
    
    -- Operación 3: transform (Unificar datos)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_transform_data, 'leer', 'datosUnificados', 'transform', 40, 19, '{"json":{"expediente":"{{ $trigger.payload.datosGenerales?.expediente || registroActual[0].expediente }}","curp":"{{ $trigger.payload.datosGenerales?.curp || registroActual[0].datosGenerales.curp }}","rfc":"{{ $trigger.payload.datosGenerales?.rfc || registroActual[0].datosGenerales.rfc }}"}}', op_id_log_debug, NULL, flow_id_morales, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve;

    -- Operación 4: log (Debug)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_log_debug, 'Registrar en la consola', 'log_luqzadfsdfsdf', 'log', 49, 38, '{"message":"👌👌👌👌{{datosUnificados}},{{$registroActual}},{{registroActual}}"}', NULL, NULL, flow_id_morales, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve;

    -- Operación 5: item-read (Buscar duplicado)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_read_duplicate, 'Registrar en la consola', 'duplicado', 'item-read', 60, 19, '{"collection":"{{ $trigger.collection }}","query":{"filter":{"_and":[{"expediente":{"_eq":"{{ $datosUnificados.expediente }}"}},{"datosGenerales.curp":{"_eq":"{{ $datosUnificados.curp }}"}},{"datosGenerales.rfc":{"_eq":"{{ $datosUnificados.rfc }}"}},{"id":{"_neq":"{{ $trigger.keys[0] }}"}}]}}}', op_id_condition, NULL, flow_id_morales, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve;

    -- Operación 6: condition (¿Existe duplicado?)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_condition, 'Condición', 'condition_3rmye', 'condition', 75, 19, '{"filter":"{{ $duplicado.length > 0 }}\n"}', op_id_exec_error, NULL, flow_id_morales, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve;

    -- Operación 7: exec (Lanzar error)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_exec_error, 'Ejecutar script', 'exec_0jaml', 'exec', 95, 22, json_build_object('code', code_exec_error), NULL, NULL, flow_id_morales, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve;

    RAISE NOTICE '✅ Flow de validación de duplicados (7777...) corregido y configurado';
END $$;
-- ***** FIN BLOQUE CORREGIDO *****


-- FLOW PARA faltas_graves_personas_fisicas
\echo '🔄 Configurando flow de validación de duplicados para faltas_graves_personas_fisicas...'
DO $$
DECLARE
    admin_id uuid;
    validation_code_fisicas_graves text;
    flow_id_fisicas_graves uuid := '99999999-9999-9999-9999-999999999999';
    operation_id_fisicas_graves uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
BEGIN
    -- Obtener ID del administrador
    SELECT u.id INTO admin_id 
    FROM directus_users u
    JOIN directus_roles r ON u.role = r.id
    WHERE r.name = 'Administrator'
    LIMIT 1;

    -- Código de validación para faltas_graves_personas_fisicas
    validation_code_fisicas_graves := 'module.exports=async function(data,{services,database,getSchema}){const{ItemsService}=services;const payload=data.$trigger?.payload||data;const expediente=payload.expediente;const datosGeneralesId=payload.datosGenerales;if(!expediente||!datosGeneralesId)return data;const schema=await getSchema();const datosGeneralesService=new ItemsService("datos_generales_personas_fisicas",{schema,accountability:data.$accountability});let datosGenerales;try{datosGenerales=await datosGeneralesService.readOne(datosGeneralesId);}catch(e){return data;}const rfc=datosGenerales?.rfc;const curp=datosGenerales?.curp;if(!rfc&&!curp)return data;const faltasService=new ItemsService("faltas_graves_personas_fisicas",{schema,accountability:data.$accountability});const orConditions=[];if(rfc)orConditions.push({datosGenerales:{rfc:{_eq:rfc}}});if(curp)orConditions.push({datosGenerales:{curp:{_eq:curp}}});const filtros={_and:[{expediente:{_eq:expediente}},{_or:orConditions}]};if(payload.id){filtros._and.push({id:{_neq:payload.id}});}const duplicados=await faltasService.readByQuery({filter:filtros,limit:1});if(duplicados.length>0){const identificador=rfc||curp;throw new Error(`Ya existe un registro de sanción para este ${rfc?"RFC":"CURP"} (${identificador}) y expediente (${expediente})`);}return data;};';

    -- Insertar flow para faltas_graves_personas_fisicas
    INSERT INTO directus_flows (
        id, name, icon, color, description, status, trigger, 
        accountability, options, operation, date_created, user_created
    ) VALUES (
        flow_id_fisicas_graves,
        'validar-duplicados-fisicas-graves',
        'content_copy',
        '#E91E63',
        'Validar duplicados en faltas_graves_personas_fisicas por expediente, RFC y CURP',
        'active',
        'event',
        NULL,
        '{"type":"filter","scope":["items.create","items.update"],"collections":["faltas_graves_personas_fisicas"]}',
        operation_id_fisicas_graves,
        CURRENT_TIMESTAMP,
        admin_id
    ) ON CONFLICT (id) DO UPDATE SET
        options = EXCLUDED.options,
        status = EXCLUDED.status,
        name = EXCLUDED.name,
        icon = EXCLUDED.icon,
        color = EXCLUDED.color,
        description = EXCLUDED.description;

    -- Insertar operación para faltas_graves_personas_fisicas
    INSERT INTO directus_operations (
        id, name, key, type, position_x, position_y, options,
        resolve, reject, flow, date_created, user_created
    ) VALUES (
        operation_id_fisicas_graves,
        'validar-duplicados-fisicas-graves-op',
        'validar_duplicados_fisicas_graves',
        'exec',
        19,
        1,
        json_build_object('code', validation_code_fisicas_graves),
        NULL,
        NULL,
        flow_id_fisicas_graves,
        CURRENT_TIMESTAMP,
        admin_id
    ) ON CONFLICT (id) DO UPDATE SET
        options = EXCLUDED.options,
        name = EXCLUDED.name,
        key = EXCLUDED.key;

    RAISE NOTICE '✅ Flow de validación de duplicados para faltas_graves_personas_fisicas configurado';
END $$;

-- FLOW PARA faltas_administrativas_graves
\echo '🔄 Configurando flow de validación de duplicados para faltas_administrativas_graves...'
DO $$
DECLARE
    admin_id uuid;
    validation_code_admin_graves text;
    flow_id_admin_graves uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
    operation_id_admin_graves uuid := 'cccccccc-cccc-cccc-cccc-cccccccccccc';
BEGIN
    -- Obtener ID del administrador
    SELECT u.id INTO admin_id 
    FROM directus_users u
    JOIN directus_roles r ON u.role = r.id
    WHERE r.name = 'Administrator'
    LIMIT 1;

    -- Código de validación para faltas_administrativas_graves
    validation_code_admin_graves := 'module.exports=async function(data,{services,database,getSchema}){const{ItemsService}=services;const payload=data.$trigger?.payload||data;const expediente=payload.expediente;const datosGeneralesId=payload.datosGenerales;if(!expediente||!datosGeneralesId)return data;const schema=await getSchema();const datosGeneralesService=new ItemsService("datos_generales_graves",{schema,accountability:data.$accountability});let datosGenerales;try{datosGenerales=await datosGeneralesService.readOne(datosGeneralesId);}catch(e){return data;}const rfc=datosGenerales?.rfc;const curp=datosGenerales?.curp;if(!rfc&&!curp)return data;const faltasService=new ItemsService("faltas_administrativas_graves",{schema,accountability:data.$accountability});const orConditions=[];if(rfc)orConditions.push({datosGenerales:{rfc:{_eq:rfc}}});if(curp)orConditions.push({datosGenerales:{curp:{_eq:curp}}});const filtros={_and:[{expediente:{_eq:expediente}},{_or:orConditions}]};if(payload.id){filtros._and.push({id:{_neq:payload.id}});}const duplicados=await faltasService.readByQuery({filter:filtros,limit:1});if(duplicados.length>0){const identificador=rfc||curp;throw new Error(`Ya existe un registro de sanción para este ${rfc?"RFC":"CURP"} (${identificador}) y expediente (${expediente})`);}return data;};';

    -- Insertar flow para faltas_administrativas_graves
    INSERT INTO directus_flows (
        id, name, icon, color, description, status, trigger, 
        accountability, options, operation, date_created, user_created
    ) VALUES (
        flow_id_admin_graves,
        'validar-duplicados-admin-graves',
        'content_copy',
        '#9C27B0',
        'Validar duplicados en faltas_administrativas_graves por expediente, RFC y CURP',
        'active',
        'event',
        NULL,
        '{"type":"filter","scope":["items.create","items.update"],"collections":["faltas_administrativas_graves"]}',
        operation_id_admin_graves,
        CURRENT_TIMESTAMP,
        admin_id
    ) ON CONFLICT (id) DO UPDATE SET
        options = EXCLUDED.options,
        status = EXCLUDED.status,
        name = EXCLUDED.name,
        icon = EXCLUDED.icon,
        color = EXCLUDED.color,
        description = EXCLUDED.description;

    -- Insertar operación para faltas_administrativas_graves
    INSERT INTO directus_operations (
        id, name, key, type, position_x, position_y, options,
        resolve, reject, flow, date_created, user_created
    ) VALUES (
        operation_id_admin_graves,
        'validar-duplicados-admin-graves-op',
        'validar_duplicados_admin_graves',
        'exec',
        19,
        1,
        json_build_object('code', validation_code_admin_graves),
        NULL,
        NULL,
        flow_id_admin_graves,
        CURRENT_TIMESTAMP,
        admin_id
    ) ON CONFLICT (id) DO UPDATE SET
        options = EXCLUDED.options,
        name = EXCLUDED.name,
        key = EXCLUDED.key;

    RAISE NOTICE '✅ Flow de validación de duplicados para faltas_administrativas_graves configurado';
END $$;

-- FLOW PARA faltas_administrativas_no_graves
\echo '🔄 Configurando flow de validación de duplicados para faltas_administrativas_no_graves...'
DO $$
DECLARE
    admin_id uuid;
    validation_code_admin_no_graves text;
    flow_id_admin_no_graves uuid := 'dddddddd-dddd-dddd-dddd-dddddddddddd';
    operation_id_admin_no_graves uuid := 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
BEGIN
    -- Obtener ID del administrador
    SELECT u.id INTO admin_id 
    FROM directus_users u
    JOIN directus_roles r ON u.role = r.id
    WHERE r.name = 'Administrator'
    LIMIT 1;

    -- Código de validación para faltas_administrativas_no_graves
    validation_code_admin_no_graves := 'module.exports=async function(data,{services,database,getSchema}){const{ItemsService}=services;const payload=data.$trigger?.payload||data;const expediente=payload.expediente;const datosGeneralesId=payload.datosGenerales;if(!expediente||!datosGeneralesId)return data;const schema=await getSchema();const datosGeneralesService=new ItemsService("datos_generales_no_graves",{schema,accountability:data.$accountability});let datosGenerales;try{datosGenerales=await datosGeneralesService.readOne(datosGeneralesId);}catch(e){return data;}const rfc=datosGenerales?.rfc;const curp=datosGenerales?.curp;if(!rfc&&!curp)return data;const faltasService=new ItemsService("faltas_administrativas_no_graves",{schema,accountability:data.$accountability});const orConditions=[];if(rfc)orConditions.push({datosGenerales:{rfc:{_eq:rfc}}});if(curp)orConditions.push({datosGenerales:{curp:{_eq:curp}}});const filtros={_and:[{expediente:{_eq:expediente}},{_or:orConditions}]};if(payload.id){filtros._and.push({id:{_neq:payload.id}});}const duplicados=await faltasService.readByQuery({filter:filtros,limit:1});if(duplicados.length>0){const identificador=rfc||curp;throw new Error(`Ya existe un registro de sanción para este ${rfc?"RFC":"CURP"} (${identificador}) y expediente (${expediente})`);}return data;};';

    -- Insertar flow para faltas_administrativas_no_graves
    INSERT INTO directus_flows (
        id, name, icon, color, description, status, trigger, 
        accountability, options, operation, date_created, user_created
    ) VALUES (
        flow_id_admin_no_graves,
        'validar-duplicados-admin-no-graves',
        'content_copy',
        '#00BCD4',
        'Validar duplicados en faltas_administrativas_no_graves por expediente, RFC y CURP',
        'active',
        'event',
        NULL,
        '{"type":"filter","scope":["items.create","items.update"],"collections":["faltas_administrativas_no_graves"]}',
        operation_id_admin_no_graves,
        CURRENT_TIMESTAMP,
        admin_id
    ) ON CONFLICT (id) DO UPDATE SET
        options = EXCLUDED.options,
        status = EXCLUDED.status,
        name = EXCLUDED.name,
        icon = EXCLUDED.icon,
        color = EXCLUDED.color,
        description = EXCLUDED.description;

    -- Insertar operación para faltas_administrativas_no_graves
    INSERT INTO directus_operations (
        id, name, key, type, position_x, position_y, options,
        resolve, reject, flow, date_created, user_created
    ) VALUES (
        operation_id_admin_no_graves,
        'validar-duplicados-admin-no-graves-op',
        'validar_duplicados_admin_no_graves',
        'exec',
        19,
        1,
        json_build_object('code', validation_code_admin_no_graves),
        NULL,
        NULL,
        flow_id_admin_no_graves,
        CURRENT_TIMESTAMP,
        admin_id
    ) ON CONFLICT (id) DO UPDATE SET
        options = EXCLUDED.options,
        name = EXCLUDED.name,
        key = EXCLUDED.key;

    RAISE NOTICE '✅ Flow de validación de duplicados para faltas_administrativas_no_graves configurado';
END $$;


-- ***** BLOQUE NUEVO *****
-- FLOW PARA validar-curp-rfc (Flow encadenado)
\echo '🔄 Configurando flow para validar-curp-rfc...'
DO $$
DECLARE
    admin_id uuid;
    flow_id_curp uuid := '21ae8c9b-681f-48bc-8227-6cab1c098c31';

    -- IDs de todas las operaciones en la cadena
    op_id_log_start uuid := '09ed12df-5114-488b-adac-a298ad976581';
    op_id_exec_init_c uuid := '2675613c-a1d5-4d55-b463-37f3a520d533';
    op_id_log_init_c uuid := '48883a6c-0a01-410d-86e3-108ef9932d14';
    op_id_exec_bool_c uuid := '8d844947-59a8-4c70-9090-332ea8addd6f';
    op_id_exec_final_c uuid := 'c819fcd7-40dd-49b0-90ae-16cba0ed7c28';
    op_id_read_update uuid := 'aa93ab3e-e5a9-4a20-8fba-4aa09a8428b4';
    op_id_log_update uuid := 'c4b16bd4-1dc0-4eeb-a41c-f80383afd519';
    op_id_exec_init_u uuid := 'c16e2797-1e93-4f3f-9b1c-b32a84752dfc';
    op_id_log_init_u uuid := 'fa7103dc-a66f-48d9-a453-0cff58b06681';
    op_id_exec_bool_u uuid := 'e62e97b6-719b-4839-a3f0-65b84a32b00b';
    op_id_exec_final_u uuid := 'ef574dda-140b-4fc9-9bf8-25db2eb5a46e';

    -- Variables para el código de las operaciones 'exec'
    code_exec_init_c text;
    code_exec_bool_c text;
    code_exec_final_c text;
    code_exec_init_u text;
    code_exec_bool_u text;
    code_exec_final_u text;

BEGIN
    -- Obtener ID del administrador
    SELECT u.id INTO admin_id 
    FROM directus_users u
    JOIN directus_roles r ON u.role = r.id
    WHERE r.name = 'Administrator'
    LIMIT 1;

    -- === Definir CÓDIGOS para la RAMA CREATE ===
    code_exec_init_c := 'module.exports = async function(data) {
 	const p = data.$trigger.payload.datosGenerales;
 	const { nombres, primerApellido, segundoApellido } = p;

 	const primeraVocal = (primerApellido.match(/[AEIOUaeiou]/g) || [])[1] || ''X'';
 	const iniciales = (
 	 	primerApellido[0] +
 	 	primeraVocal +
 	 	(segundoApellido ? segundoApellido[0] : ''X'') +
 	 	nombres[0]
 	).toUpperCase();

 	return { inicialesEsperadas: iniciales };
};';

    code_exec_bool_c := 'module.exports = async function(data) {
 	const p = data.$trigger.payload.datosGenerales;
 	const { curp, rfc, segundoApellido} = p;
 	const iniciales = data.inicialesEsperadas.inicialesEsperadas;
 	 	
 	const expectedPrefix = segundoApellido
 		? iniciales.slice(0,4).toUpperCase()
 		: (iniciales.slice(0,2) + ''X'' + iniciales.slice(3,4)).toUpperCase();

 	const curpPrefix = curp.slice(0, 4).toUpperCase();
 	const rfcPrefix = rfc.slice(0, 4).toUpperCase();

 	const curpCoincide = curpPrefix.startsWith(iniciales.slice(0, 3));
 	const rfcCoincide = rfcPrefix.startsWith(iniciales.slice(0, 3));
	console.log(curpCoincide,"es la curp", rfcCoincide,"es el rfc")
 	return { curpCoincide, rfcCoincide, curpPrefix, rfcPrefix };
};';

    code_exec_final_c := 'module.exports = async function (data) {
 	const iniciales = data.inicialesEsperadas?.inicialesEsperadas || ''N/A'';
 	const { curpPrefix, rfcPrefix, curpCoincide, rfcCoincide } = data.datosBooleanos || {};

 	-- 🧩 Caso 1: Ambos incorrectos
 	if (!curpCoincide && !rfcCoincide) {
 	 	throw new Error(
 	 	 	`❌ Inconsistencia detectada: 
 	 	 	Las iniciales esperadas (${iniciales}) no coinciden ni con la CURP (${curpPrefix}) ni con el RFC (${rfcPrefix}). 
 	 	 	Verifica que nombre, apellidos, CURP y RFC correspondan correctamente.`
 	 	);
 	}

 	-- 🧩 Caso 2: Solo CURP incorrecta
 	if (!curpCoincide && rfcCoincide) {
 	 	throw new Error(
 	 	 	`⚠️ Inconsistencia parcial:
 	 	 	Las iniciales esperadas (${iniciales}) coinciden con el RFC (${rfcPrefix}) pero no con la CURP (${curpPrefix}). 
 	 	 	Revisa la CURP, podría haberse capturado de forma incorrecta.`
 	 	);
 	}

 	-- 🧩 Caso 3: Solo RFC incorrecta
 	if (curpCoincide && !rfcCoincide) {
 	 	throw new Error(
 	 	 	`⚠️ Inconsistencia parcial:
 	 	 	Las iniciales esperadas (${iniciales}) coinciden con la CURP (${curpPrefix}) pero no con el RFC (${rfcPrefix}). 
 	 	 	Revisa el RFC, podría haberse capturado de forma incorrecta.`
 	 	);
 	}

 	-- ✅ Caso 4: Todo correcto
 	return {
 	 	message: `✅ Validación CURP/RFC exitosa: las iniciales (${iniciales}) coinciden correctamente con la CURP (${curpPrefix}) y el RFC (${rfcPrefix}).`
 	};
};
';

    -- === Definir CÓDIGOS para la RAMA UPDATE ===
    code_exec_init_u := 'module.exports = async function(data) {
 	const p = data.leer_datos[0].datosGenerales;
 	const d = data.$trigger.payload?.datosGenerales;
 	 	console.log(p,"❤️")
 	 	console.log(data,"🤣")
 
 	 	const nombres =
 	 	 	d?.nombres ||
 	 	 	p.nombres; 	 
 
 	 	
 	 const primerApellido =
 	 	 	d?.primerApellido ||
 	 	 	p.primerApellido;
 	 	
 const segundoApellido =
 	 	d && ''segundoApellido'' in d
 	 	 	? d.segundoApellido ?? ''''
 	 	 	: p.segundoApellido ?? ''''; 	 	
 	 

 	const primeraVocal = (primerApellido.match(/[AEIOUaeiou]/g) || [])[1] || ''X'';
 	const iniciales = (
 	 	primerApellido[0] +
 	 	primeraVocal +
 	 	(segundoApellido ? segundoApellido[0] : ''X'') +
 	 	nombres[0]
 	).toUpperCase();
	console.log("llego aqui 🤐")
 	return { inicialesEsperadas: iniciales };
};';

    code_exec_bool_u := 'module.exports = async function(data) {
 	const p = data.leer_datos[0].datosGenerales;
 	const d = data.$trigger.payload?.datosGenerales;
 	 	
 	const segundoApellido =
 	 	d && ''segundoApellido'' in d
 	 	 	? d.segundoApellido ?? ''''
 	 	 	: p.segundoApellido ?? '''';

 	-- curp y rfc seguros
 	const curp = d?.curp ?? p?.curp ?? '''';
 	const rfc = d?.rfc ?? p?.rfc ?? '''';
 	 	
 	const iniciales = data.inicialesEsperadasU.inicialesEsperadas;
 	 	
 	const expectedPrefix = segundoApellido
 		? iniciales.slice(0,4).toUpperCase()
 		: (iniciales.slice(0,2) + ''X'' + iniciales.slice(3,4)).toUpperCase();

 	const curpPrefix = curp.slice(0, 4).toUpperCase();
 	const rfcPrefix = rfc.slice(0, 4).toUpperCase();

 	const curpCoincide = curpPrefix.startsWith(iniciales.slice(0, 3));
 	const rfcCoincide = rfcPrefix.startsWith(iniciales.slice(0, 3));
	console.log(curpCoincide,"es la curp", rfcCoincide,"es el rfc")
 	return { curpCoincide, rfcCoincide, curpPrefix, rfcPrefix };
};';

    code_exec_final_u := '
module.exports = async function (data) {
 	const iniciales = data.inicialesEsperadasU?.inicialesEsperadas || ''N/A'';
 	const { curpPrefix, rfcPrefix, curpCoincide, rfcCoincide } = data.datosBooleanosU || {};

 	-- 🧩 Caso 1: Ambos incorrectos
 	if (!curpCoincide && !rfcCoincide) {
 	 	throw new Error(
 	 	 	`❌ Inconsistencia detectada: 
 	 	 	Las iniciales esperadas (${iniciales}) no coinciden ni con la CURP (${curpPrefix}) ni con el RFC (${rfcPrefix}). 
 	 	 Verifica que nombre, apellidos, CURP y RFC correspondan correctamente.`
 	 	);
 	}

 	-- 🧩 Caso 2: Solo CURP incorrecta
 	if (!curpCoincide && rfcCoincide) {
throw new Error(
 	 	`⚠️ Inconsistencia parcial:
 	 Las iniciales esperadas (${iniciales}) coinciden con el RFC (${rfcPrefix}) pero no con la CURP (${curpPrefix}). 
 	 	 	Revisa la CURP, podría haberse capturado de forma incorrecta.`
 	 	);
 	 	
 	}

 	-- 🧩 Caso 3: Solo RFC incorrecta
 	if (curpCoincide && !rfcCoincide) {
 	 	throw new Error(
 	 	 	`⚠️ Inconsistencia parcial:
 	 	 	Las iniciales esperadas (${iniciales}) coinciden con la CURP (${curpPrefix}) pero no con el RFC (${rfcPrefix}). 
 	 	 	Revisa el RFC, podría haberse capturado de forma incorrecta.`
 	 	);
 	}

 	-- ✅ Caso 4: Todo correcto
 	return {
 	 	message: `✅ Validación CURP/RFC exitosa: las iniciales (${iniciales}) coinciden correctamente con la CURP (${curpPrefix}) y el RFC (${rfcPrefix}).`
 	};
};
';

    -- Insertar el Flow principal
    INSERT INTO directus_flows (
        id, name, icon, color, description, status, trigger, 
        accountability, options, operation, date_created, user_created
    ) VALUES (
        flow_id_curp,
        'validar-curp-rfc',
        'nordic_walking',
        '#FF0000',
        'Validar coincidencia entre CURP, RFC y Nombre (s) y Apellidos',
        'active', -- Lo pongo en 'active' (en tu dump estaba 'inactive')
        'event',
        'all',
        '{"type":"filter","scope":["items.create","items.update"],"collections":["faltas_administrativas_graves","faltas_administrativas_no_graves","faltas_graves_personas_fisicas"]}',
        op_id_log_start, -- Esta es la operación inicial
        CURRENT_TIMESTAMP,
        admin_id
    ) ON CONFLICT (id) DO UPDATE SET
        options = EXCLUDED.options,
        status = EXCLUDED.status,
        name = EXCLUDED.name,
        icon = EXCLUDED.icon,
        color = EXCLUDED.color,
        description = EXCLUDED.description,
        operation = EXCLUDED.operation,
        accountability = EXCLUDED.accountability;

    -- Insertar TODAS las operaciones de la cadena
    
    -- Op 1: Log (Inicio)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_log_start, 'Registrar en la consola', 'log_iqqit', 'log', 19, 1, '{"message":"{{$trigger}},{{$accountability}}"}', op_id_exec_init_c, NULL, flow_id_curp, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve, reject = EXCLUDED.reject;

    -- Op 2: Exec (Rama Create: Iniciales)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_exec_init_c, 'Ejecutar script', 'inicialesEsperadas', 'exec', 36, 1, json_build_object('code', code_exec_init_c), op_id_log_init_c, op_id_read_update, flow_id_curp, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve, reject = EXCLUDED.reject;

    -- Op 3: Log (Rama Create: Log Iniciales)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_log_init_c, 'Registrar en la consola', 'log_9whah', 'log', 52, 1, '{"message":"{{inicialesEsperadas}}"}', op_id_exec_bool_c, NULL, flow_id_curp, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve, reject = EXCLUDED.reject;

    -- Op 4: Exec (Rama Create: Booleanos)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_exec_bool_c, 'Ejecutar script', 'datosBooleanos', 'exec', 69, 1, json_build_object('code', code_exec_bool_c), op_id_exec_final_c, NULL, flow_id_curp, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve, reject = EXCLUDED.reject;

    -- Op 5: Exec (Rama Create: Final)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_exec_final_c, 'Ejecutar script', 'exec_pj6o2', 'exec', 86, 1, json_build_object('code', code_exec_final_c), NULL, NULL, flow_id_curp, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve, reject = EXCLUDED.reject;

    -- Op 6: Read (Rama Update: Leer Datos)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_read_update, 'Leer Datos', 'leer_datos', 'item-read', 19, 17, '{"collection":"{{$trigger.collection}}","query":{"filter":{"id":{"_eq":"{{ $trigger.keys[0] }}"}},"fields":["*","datosGenerales.*"]}}', op_id_log_update, NULL, flow_id_curp, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve, reject = EXCLUDED.reject;

    -- Op 7: Log (Rama Update: Log Datos)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_log_update, 'Registrar en la consola', 'log_fkrsg', 'log', 36, 17, '{"message":"😊{{leer_datos}}"}', op_id_exec_init_u, NULL, flow_id_curp, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXcluded.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve, reject = EXCLUDED.reject;

    -- Op 8: Exec (Rama Update: Iniciales)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_exec_init_u, 'Ejecutar script', 'inicialesEsperadasU', 'exec', 54, 17, json_build_object('code', code_exec_init_u), op_id_log_init_u, NULL, flow_id_curp, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve, reject = EXCLUDED.reject;

    -- Op 9: Log (Rama Update: Log Iniciales)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_log_init_u, 'Registrar en la consola', 'log_pqe1y', 'log', 72, 17, '{"message":"{{inicialesEsperadasU}}"}', op_id_exec_bool_u, NULL, flow_id_curp, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve, reject = EXCLUDED.reject;

    -- Op 10: Exec (Rama Update: Booleanos)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_exec_bool_u, 'Ejecutar script', 'datosBooleanosU', 'exec', 89, 17, json_build_object('code', code_exec_bool_u), op_id_exec_final_u, NULL, flow_id_curp, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve, reject = EXCLUDED.reject;

    -- Op 11: Exec (Rama Update: Final)
    INSERT INTO directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created)
    VALUES (op_id_exec_final_u, 'Ejecutar script', 'exec_pj6o2_uvddk', 'exec', 105, 17, json_build_object('code', code_exec_final_u), NULL, NULL, flow_id_curp, CURRENT_TIMESTAMP, admin_id)
    ON CONFLICT (id) DO UPDATE SET options = EXCLUDED.options, name = EXCLUDED.name, key = EXCLUDED.key, resolve = EXCLUDED.resolve, reject = EXCLUDED.reject;

    RAISE NOTICE '✅ Flow para validar-curp-rfc (21ae...) configurado';
END $$;
-- ***** FIN BLOQUE NUEVO *****

EOF

# Verifica éxito del comando anterior
if [ $? -eq 0 ]; then
  echo "✅ Configuración aplicada exitosamente."
else
  echo "❌ Error al aplicar la configuración." >&2
  exit 1
fi