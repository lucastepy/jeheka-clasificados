-- VINCULAR AVISOS CON PLANES DE PAGO
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_plan_id INTEGER;

-- FK a la tabla de planes
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_avisos_plan') THEN
        ALTER TABLE avisos 
        ADD CONSTRAINT fk_avisos_plan FOREIGN KEY (avi_plan_id) 
        REFERENCES planes(id);
    END IF;
END $$;

-- Índice para reportes por plan
CREATE INDEX IF NOT EXISTS idx_avisos_plan ON avisos(avi_plan_id);
