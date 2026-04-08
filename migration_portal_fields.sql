-- MIGRACIÓN PARA CAMPOS COMPLEMENTARIOS (Limpia y ajustada al esquema existente)

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
ADD COLUMN IF NOT EXISTS usu_biografia TEXT;

-- 2. Añadir restricciones de FK según el esquema maestro de Paraguay proporcionado
DO $$ 
BEGIN
    -- FK Departamentos
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_usu_departamento') THEN
        ALTER TABLE usuarios_portal 
        ADD CONSTRAINT fk_usu_departamento FOREIGN KEY (usu_departamento_id) 
        REFERENCES departamentos(dep_cod);
    END IF;

    -- FK Distritos (Estructura de clave compuesta dep_cod + dis_cod)
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_usu_distrito') THEN
        ALTER TABLE usuarios_portal 
        ADD CONSTRAINT fk_usu_distrito FOREIGN KEY (usu_departamento_id, usu_distrito_id) 
        REFERENCES distritos(dis_dep_cod, dis_cod);
    END IF;

    -- FK Ciudades (Estructura de clave compuesta dep + dis + ciu)
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_usu_ciudad') THEN
        ALTER TABLE usuarios_portal 
        ADD CONSTRAINT fk_usu_ciudad FOREIGN KEY (usu_departamento_id, usu_distrito_id, usu_ciudad_id) 
        REFERENCES ciudades(ciu_dep_cod, ciu_dis_cod, ciu_cod);
    END IF;

    -- FK Rubros (Referencia a 'id' serial)
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_usu_rubro') THEN
        ALTER TABLE usuarios_portal 
        ADD CONSTRAINT fk_usu_rubro FOREIGN KEY (usu_rubro_id) 
        REFERENCES rubros(id);
    END IF;

    -- FK Sub-rubros (Referencia a 'id' serial)
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_usu_sub_rubro') THEN
        ALTER TABLE usuarios_portal 
        ADD CONSTRAINT fk_usu_sub_rubro FOREIGN KEY (usu_sub_rubro_id) 
        REFERENCES sub_rubros(id);
    END IF;
END $$;


-- 3. Tabla para el Curriculum / Hoja de Oficio (LinkedIn-like)
CREATE TABLE IF NOT EXISTS usuarios_portal_cv (
    cv_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usu_id UUID REFERENCES usuarios_portal(usu_id) ON DELETE CASCADE,
    cv_experiencia JSONB DEFAULT '[]',
    cv_educacion JSONB DEFAULT '[]',
    cv_habilidades JSONB DEFAULT '[]',
    cv_certificaciones JSONB DEFAULT '[]',
    cv_fec_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices optimizados
CREATE INDEX IF NOT EXISTS idx_usu_portal_ubicacion ON usuarios_portal(usu_departamento_id, usu_distrito_id, usu_ciudad_id);
CREATE INDEX IF NOT EXISTS idx_usu_portal_rubro ON usuarios_portal(usu_rubro_id, usu_sub_rubro_id);

-- 4. Foto de Perfil
ALTER TABLE usuarios_portal ADD COLUMN IF NOT EXISTS usu_foto_url TEXT;
