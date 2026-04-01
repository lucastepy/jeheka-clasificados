-- SCRIPT DE INICIALIZACIÓN DE DATOS (ESQUEMA PUBLIC)

-- 1. Tabla de Usuarios del Portal (Separados de Admin)
CREATE TABLE IF NOT EXISTS usuarios_portal (
    usu_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usu_email VARCHAR(255) UNIQUE NOT NULL,
    usu_password_hash TEXT NOT NULL,
    usu_nombre VARCHAR(100),
    usu_primer_ingreso BOOLEAN DEFAULT TRUE,
    usu_fec_alta TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Categorías (Schema public)
CREATE TABLE IF NOT EXISTS categorias (
    cat_id SERIAL PRIMARY KEY,
    cat_nombre VARCHAR(100) NOT NULL,
    cat_slug VARCHAR(100) UNIQUE NOT NULL,
    cat_icono VARCHAR(50),
    cat_descripcion TEXT
);

-- 3. Tabla de Avisos (Optimización 100% buscador)
CREATE TABLE IF NOT EXISTS avisos (
    avi_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cli_id INTEGER NOT NULL, -- FK lógica a public.clientes
    avi_titulo VARCHAR(255) NOT NULL,
    avi_descripcion TEXT NOT NULL,
    avi_precio DECIMAL(15,2),
    avi_moneda VARCHAR(5) DEFAULT 'PYG',
    avi_categoria_id INTEGER REFERENCES categorias(cat_id),
    avi_ciudad_id INTEGER, -- FK lógica a public.ciudades
    avi_imagenes JSONB DEFAULT '[]',
    avi_whatsapp VARCHAR(20),
    avi_vistas_count INTEGER DEFAULT 0,
    avi_estado VARCHAR(20) DEFAULT 'activo',
    avi_search_vector tsvector,
    avi_fec_alta TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    avi_fec_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para actualizar el vector de búsqueda automáticamente
CREATE OR REPLACE FUNCTION update_avi_search_vector() RETURNS trigger AS $$
BEGIN
  new.avi_search_vector :=
    setweight(to_tsvector('spanish', coalesce(new.avi_titulo,'')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(new.avi_descripcion,'')), 'B');
  RETURN new;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_avi_search_update ON avisos;
CREATE TRIGGER trg_avi_search_update BEFORE INSERT OR UPDATE
ON avisos FOR EACH ROW EXECUTE FUNCTION update_avi_search_vector();

-- 4. Vistas de Seguridad (Capa "Stitch" de Datos)
CREATE OR REPLACE VIEW v_clientes_info AS
SELECT 
    id AS cli_id,
    cli_nombre_comercial,
    cli_logo,
    cli_telefono_contacto,
    cli_verificado
FROM clientes;

-- 5. Índices Pro-Max para el buscador
CREATE INDEX IF NOT EXISTS idx_avisos_search_gin ON avisos USING GIN(avi_search_vector);
CREATE INDEX IF NOT EXISTS idx_avisos_cat_ciudad ON avisos(avi_categoria_id, avi_ciudad_id);
CREATE INDEX IF NOT EXISTS idx_avisos_fec_alta ON avisos(avi_fec_alta DESC);
