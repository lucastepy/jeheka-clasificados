-- ACTUALIZACIÓN FINAL PARA PLANES EN EL PORTAL
-- 1. Asegurar que los avisos tengan una referencia al plan elegido
ALTER TABLE avisos ADD COLUMN IF NOT EXISTS avi_plan_id INTEGER;

-- 2. Agregar campo de control en la tabla de planes para filtrar visibilidad en el portal
ALTER TABLE public.planes ADD COLUMN IF NOT EXISTS plan_mostrar_portal BOOLEAN DEFAULT FALSE;

-- 3. Marcar el "Plan de Avisos" para que se vea en el portal (ejemplo)
UPDATE public.planes SET plan_mostrar_portal = TRUE WHERE nombre ILIKE '%avisos%';

-- 4. Restricción FK
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_avisos_plan') THEN
        ALTER TABLE avisos ADD CONSTRAINT fk_avisos_plan FOREIGN KEY (avi_plan_id) REFERENCES public.planes(id);
    END IF;
END $$;
