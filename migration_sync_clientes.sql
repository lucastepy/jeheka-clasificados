-- VINCULAR USUARIOS DEL PORTAL CON LA TABLA DE CLIENTES MAESTRA
ALTER TABLE usuarios_portal ADD COLUMN IF NOT EXISTS usu_cliente_id INTEGER;

-- FK a la tabla de clientes
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_usu_cliente') THEN
        ALTER TABLE usuarios_portal 
        ADD CONSTRAINT fk_usu_cliente FOREIGN KEY (usu_cliente_id) 
        REFERENCES clientes(id);
    END IF;
END $$;

-- Índice para búsquedas rápidas de vinculación
CREATE INDEX IF NOT EXISTS idx_usu_portal_cliente ON usuarios_portal(usu_cliente_id);
