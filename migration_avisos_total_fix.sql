-- SOLUCIÓN INTEGRAL PARA LA TABLA DE AVISOS
-- Este script asegura que todas las columnas necesarias existan para el portal.

-- 1. Vincular con el usuario del portal (USU_ID)
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS usu_id UUID;

-- 2. Clasificación por Rubros y Sub-Rubros
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_rubro_id INTEGER;
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_sub_rubro_id INTEGER;

-- 3. Ubicación Geográfica Completa
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_departamento_id INTEGER;
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_distrito_id INTEGER;
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_ciudad_id INTEGER;

-- 4. Otros campos necesarios
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_whatsapp VARCHAR(20);

-- 5. Ajustar cli_id para ser opcional
ALTER TABLE avisos ALTER COLUMN cli_id DROP NOT NULL;

-- 6. Restricciones de Integridad (FKs)
DO $$ 
BEGIN
    -- FK Usuarios
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_avisos_usuario') THEN
        ALTER TABLE avisos ADD CONSTRAINT fk_avisos_usuario FOREIGN KEY (usu_id) REFERENCES usuarios_portal(usu_id);
    END IF;

    -- FK Rubros
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_avisos_rubro') THEN
        ALTER TABLE avisos ADD CONSTRAINT fk_avisos_rubro FOREIGN KEY (avi_rubro_id) REFERENCES rubros(id);
    END IF;
END $$;

-- 7. Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_avisos_usu_id ON avisos(usu_id);
CREATE INDEX IF NOT EXISTS idx_avisos_rubro_id ON avisos(avi_rubro_id);
CREATE INDEX IF NOT EXISTS idx_avisos_ubicacion_full ON avisos(avi_departamento_id, avi_distrito_id, avi_ciudad_id);
