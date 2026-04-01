-- MIGRACIÓN PARA CAMPOS COMPLEMENTARIOS Y CURRICULUM AUTOMÁTICO

-- 1. Actualizar tabla de usuarios con campos obligatorios para posteos
ALTER TABLE usuarios_portal 
ADD COLUMN IF NOT EXISTS usu_whatsapp VARCHAR(20),
ADD COLUMN IF NOT EXISTS usu_direccion TEXT,
ADD COLUMN IF NOT EXISTS usu_departamento_id INTEGER,
ADD COLUMN IF NOT EXISTS usu_distrito_id INTEGER,
ADD COLUMN IF NOT EXISTS usu_ciudad_id INTEGER,
ADD COLUMN IF NOT EXISTS usu_rubro_id INTEGER,
ADD COLUMN IF NOT EXISTS usu_sub_rubro_id INTEGER,
ADD COLUMN IF NOT EXISTS usu_es_empresa BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS usu_biografia TEXT; -- Para el "Resumen" del CV

-- 2. Tablas Maestras para Rubros y Sub-rubros (si no existen)
CREATE TABLE IF NOT EXISTS rubros (
    rub_id SERIAL PRIMARY KEY,
    rub_nombre VARCHAR(100) NOT NULL,
    rub_icono VARCHAR(50),
    rub_fec_alta TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sub_rubros (
    sub_id SERIAL PRIMARY KEY,
    sub_rubro_id INTEGER REFERENCES rubros(rub_id),
    sub_nombre VARCHAR(100) NOT NULL,
    sub_fec_alta TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla para el Curriculum / Hoja de Oficio (Estructura tipo LinkedIn)
CREATE TABLE IF NOT EXISTS usuarios_portal_cv (
    cv_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usu_id UUID REFERENCES usuarios_portal(usu_id) ON DELETE CASCADE,
    cv_experiencia JSONB DEFAULT '[]', -- [{empresa, cargo, inicio, fin, descripcion}]
    cv_educacion JSONB DEFAULT '[]',   -- [{institucion, titulo, inicio, fin}]
    cv_habilidades JSONB DEFAULT '[]',  -- ["Soldura", "Plomería", "Gestión de Equipos"]
    cv_certificaciones JSONB DEFAULT '[]',
    cv_fec_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar la búsqueda por ubicación y rubro
CREATE INDEX IF NOT EXISTS idx_usu_portal_ubicacion ON usuarios_portal(usu_departamento_id, usu_distrito_id, usu_ciudad_id);
CREATE INDEX IF NOT EXISTS idx_usu_portal_rubro ON usuarios_portal(usu_rubro_id, usu_sub_rubro_id);
