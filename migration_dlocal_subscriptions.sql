-- MIGRACIÓN PARA SOPORTE DE SUBSCRIPCIONES DLOCAL
-- 1. Agregar columna para guardar el ID del plan en dLocal
ALTER TABLE public.planes ADD COLUMN IF NOT EXISTS dlocal_plan_id VARCHAR(100);

-- 2. Asegurar que los avisos tengan una referencia al pago o suscripción
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS dlocal_id VARCHAR(100);
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_es_suscripcion BOOLEAN DEFAULT FALSE;
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_fec_vto TIMESTAMP WITH TIME ZONE;
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_cancelado BOOLEAN DEFAULT FALSE;
