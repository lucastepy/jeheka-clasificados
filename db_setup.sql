-- SCRIPT DE INICIALIZACIÓN DE DATOS (EJECUTAR EN NEON CONSOLE)

-- 1. Crear Esquema para la Web Pública
CREATE SCHEMA IF NOT EXISTS web;

-- 2. Tabla de Usuarios del Portal (Separados de Admin)
CREATE TABLE IF NOT EXISTS web.usuarios_portal (
    usu_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usu_email VARCHAR(255) UNIQUE NOT NULL,
    usu_password_hash TEXT NOT NULL,
    usu_nombre VARCHAR(100),
    usu_fec_alta TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Categorías (Cacheada en web para rapidez)
CREATE TABLE IF NOT EXISTS web.categorias (
    cat_id SERIAL PRIMARY KEY,
    cat_nombre VARCHAR(100) NOT NULL,
    cat_slug VARCHAR(100) UNIQUE NOT NULL,
    cat_icono VARCHAR(50),
    cat_descripcion TEXT
);

-- 4. Tabla de Avisos (Optimización 100% buscador)
CREATE TABLE IF NOT EXISTS web.avisos (
    avi_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cli_id INTEGER NOT NULL, -- FK lógica a public.clientes
    avi_titulo VARCHAR(255) NOT NULL,
    avi_descripcion TEXT NOT NULL,
    avi_precio DECIMAL(15,2),
    avi_moneda VARCHAR(5) DEFAULT 'PYG',
    avi_categoria_id INTEGER REFERENCES web.categorias(cat_id),
    avi_ciudad_id INTEGER, -- FK lógica a public.ciudades si existe
    avi_imagenes JSONB DEFAULT '[]',
    avi_whatsapp VARCHAR(20),
    avi_vistas_count INTEGER DEFAULT 0,
    avi_estado VARCHAR(20) DEFAULT 'activo',
    avi_search_vector tsvector,
    avi_fec_alta TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    avi_fec_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para actualizar el vector de búsqueda automáticamente
CREATE OR REPLACE FUNCTION web.update_avi_search_vector() RETURNS trigger AS $$
BEGIN
  new.avi_search_vector :=
    setweight(to_tsvector('spanish', coalesce(new.avi_titulo,'')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(new.avi_descripcion,'')), 'B');
  RETURN new;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_avi_search_update ON web.avisos;
CREATE TRIGGER trg_avi_search_update BEFORE INSERT OR UPDATE
ON web.avisos FOR EACH ROW EXECUTE FUNCTION web.update_avi_search_vector();

-- 5. Vistas de Seguridad (Capa "Stitch" de Datos)
CREATE OR REPLACE VIEW web.v_clientes_info AS
SELECT 
    id AS cli_id,
    cli_nombre_comercial,
    cli_logo,
    cli_telefono_contacto,
    cli_verificado
FROM public.clientes;

-- 6. Índices Pro-Max para el buscador
CREATE INDEX IF NOT EXISTS idx_avisos_search_gin ON web.avisos USING GIN(avi_search_vector);
CREATE INDEX IF NOT EXISTS idx_avisos_cat_ciudad ON web.avisos(avi_categoria_id, avi_ciudad_id);
CREATE INDEX IF NOT EXISTS idx_avisos_fec_alta ON web.avisos(avi_fec_alta DESC);

-- 7. IMPORTANTE: Permisos restringidos
-- (Se asume la creación de un usuario específico para el portal)
-- GRANT USAGE ON SCHEMA web TO jeheka_public_user;
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA web TO jeheka_public_user;
-- GRANT SELECT ON public.clientes TO jeheka_public_user; -- O solo a la vista
