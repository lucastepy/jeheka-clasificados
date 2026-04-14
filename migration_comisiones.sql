-- MIGRACIÓN PARA REGISTRO DE PAGOS Y COMISIONES
-- 1. Agregar campos de detalle de pago a los avisos
ALTER TABLE public.avisos ADD COLUMN IF NOT EXISTS avi_pago_marca VARCHAR(50);
ALTER TABLE public.avisos ADD COLUMN IF NOT EXISTS avi_pago_ultimos4 VARCHAR(4);
ALTER TABLE public.avisos ADD COLUMN IF NOT EXISTS avi_pago_tipo VARCHAR(20); -- credit, debit, etc.
ALTER TABLE public.avisos ADD COLUMN IF NOT EXISTS avi_pago_monto_neto NUMERIC(15,2);

-- 2. Crear tabla de comisiones
CREATE TABLE IF NOT EXISTS public.comisiones (
    com_id SERIAL PRIMARY KEY,
    com_nombre VARCHAR(100) NOT NULL, -- Ej: 'dLocal Go Standard'
    com_porcentaje NUMERIC(5,2) DEFAULT 0.00,
    com_fijo NUMERIC(15,0) DEFAULT 0, -- Monto fijo en Gs.
    com_activo BOOLEAN DEFAULT TRUE,
    com_fec_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Insertar configuración inicial de dLocal Go
INSERT INTO public.comisiones (com_nombre, com_porcentaje, com_fijo)
VALUES ('dLocal Go Tarjeta', 3.99, 1800);
