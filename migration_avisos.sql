-- VINCULAR AVISOS A USUARIOS DEL PORTAL
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS usu_id UUID;

-- Agregar FK si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_avisos_usuario') THEN
        ALTER TABLE avisos 
        ADD CONSTRAINT fk_avisos_usuario FOREIGN KEY (usu_id) 
        REFERENCES usuarios_portal(usu_id);
    END IF;
END $$;

-- Ajustar cli_id para ser opcional si el aviso es de un usuario del portal
ALTER TABLE avisos ALTER COLUMN cli_id DROP NOT NULL;

-- Campos adicionales para avisos detallados
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_departamento_id INTEGER;
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_distrito_id INTEGER;
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_sub_rubro_id INTEGER;

-- Índices adicionales
CREATE INDEX IF NOT EXISTS idx_avisos_usuario ON avisos(usu_id);
