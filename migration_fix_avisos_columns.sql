-- CORRECCIÓN DE COLUMNAS PARA RUBROS EN AVISOS
-- Si avi_categoria_id no existe, lo agregamos como avi_rubro_id para mayor claridad
-- ya que estamos usando la tabla de Rubros para categorizar los servicios.

ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_rubro_id INTEGER;

-- Intentar crear la FK a rubros
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_avisos_rubro') THEN
        ALTER TABLE avisos 
        ADD CONSTRAINT fk_avisos_rubro FOREIGN KEY (avi_rubro_id) 
        REFERENCES rubros(id);
    END IF;
END $$;

-- También nos aseguramos de que existan los otros campos de ubicación que agregamos antes
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_sub_rubro_id INTEGER;
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_departamento_id INTEGER;
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_distrito_id INTEGER;
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_ciudad_id INTEGER;

-- Índices para optimizar el buscador de servicios por rubro y ciudad
CREATE INDEX IF NOT EXISTS idx_avisos_rubro_sub ON avisos(avi_rubro_id, avi_sub_rubro_id);
CREATE INDEX IF NOT EXISTS idx_avisos_ubicacion ON avisos(avi_departamento_id, avi_distrito_id, avi_ciudad_id);
