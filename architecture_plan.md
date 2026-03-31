# Arquitectura del Ecosistema Jeheka

Este documento detalla la estructura técnica para el desacoplamiento total entre `jeheka-admin` y `jeheka-clasificados`, garantizando seguridad y eficiencia en el consumo de datos compartidos.

## 1. Estrategia de Aislamiento (Database Schemas)

Para lograr que ambos proyectos sean "estancos", utilizaremos **PostgreSQL Schemas**.

| Proyecto | Esfuerzo | Schema Principal | Acceso a Datos |
| :--- | :--- | :--- | :--- |
| **jeheka-admin** | Gestión Interna | `public` | Full Read/Write en todas las tablas. |
| **jeheka-clasificados** | Portal Público | `web` | Solo lectura en tablas compartidas; Full en tablas de avisos. |

### Configuración de Roles en Neon (Postgres)
Se deben crear dos usuarios de base de datos diferentes en el Dashboard de Neon para evitar que la plataforma pública posea credenciales con permisos administrativos:

1.  `service_admin`: Dueño de todos los esquemas (usado en `jeheka-admin`).
2.  `service_public`: (usado en `jeheka-clasificados`)
    - No tiene permiso de `USAGE` sobre el esquema `admin` (donde están las configuraciones críticas).
    - Solo tiene permiso de `SELECT` sobre vistas específicas en el esquema `public`.
    - Tiene permisos `CRUD` sobre el nuevo esquema `web`.

---

## 2. Definición del Esquema de Datos (`web`)

Diseñado para optimizar el **Buscador** y la **Escalabilidad**.

```sql
CREATE SCHEMA IF NOT EXISTS web;

-- Tabla de Avisos: Optimizada para Full Text Search
CREATE TABLE IF NOT EXISTS web.avisos (
    avi_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cli_id INTEGER NOT NULL, -- ID del Cliente en el esquema admin (fk lógica)
    avi_titulo VARCHAR(255) NOT NULL,
    avi_descripcion TEXT NOT NULL,
    avi_precio DECIMAL(15,2),
    avi_categoria_id INTEGER,
    avi_ciudad_id INTEGER,
    avi_imagenes JSONB, -- Array de URLs de imágenes
    avi_vistas_count INTEGER DEFAULT 0,
    avi_estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, activo, pausado, expirado
    avi_search_vector tsvector, -- Para búsqueda rápida
    avi_fec_alta TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    avi_fec_expiracion TIMESTAMP WITH TIME ZONE
);

-- Índices para Eficiencia del Buscador
CREATE INDEX IF NOT EXISTS idx_avisos_search ON web.avisos USING GIN(avi_search_vector);
CREATE INDEX IF NOT EXISTS idx_avisos_categoria ON web.avisos(avi_categoria_id);
CREATE INDEX IF NOT EXISTS idx_avisos_ciudad ON web.avisos(avi_ciudad_id);
```

---

## 3. Capa de Composición "Stitch" (Vistas Seguras)

Para que `jeheka-clasificados` "vea" a los clientes sin entrar al esquema administrativo, crearemos vistas en el esquema `web` que expongan solo lo necesario.

```sql
-- Vista para el sitio público: No expone email, password ni datos de pago del cliente.
CREATE OR REPLACE VIEW web.v_clientes_publico AS
SELECT 
    id AS cli_id,
    cli_nombre_comercial,
    cli_logo,
    cli_telefono_contacto,
    cli_verificado
FROM public.clientes;

-- Vista de Avisos Activos (Filtrando por suscripción vigente en admin)
CREATE OR REPLACE VIEW web.v_avisos_activos AS
SELECT a.*, c.cli_nombre_comercial
FROM web.avisos a
JOIN web.v_clientes_publico c ON a.cli_id = c.cli_id
JOIN public.cliente_suscripciones s ON a.cli_id = s.cli_id
WHERE a.avi_estado = 'activo' 
  AND s.cli_sus_estado = true 
  AND a.avi_fec_expiracion > NOW();
```

---

## 4. Arquitectura de Servicios en `jeheka-clasificados`

El proyecto Next.js se enfocará en:

1.  **Capa de Datos (Data Access Layer):** 
    - Utilizar `@neondatabase/serverless`.
    - Consultar solo las vistas de `web.*`. Jamás tablas de `public.*` directamente.
2.  **API Independiente:**
    - `/api/buscar`: Utiliza Postgres Full Text Search para devolver resultados en <100ms.
    - `/api/publicar`: Permite la creación de avisos vinculados a un `cli_id` (pre-validado).
3.  **Seguridad de Autenticación:**
    - El JWT de `jeheka-admin` NO es compatible con `jeheka-clasificados`. 
    - Se manejan sesiones independientes.

---

## 5. Próximos Pasos de Implementación

1.  **Aplicar SQL**: Ejecutar los scripts de creación de esquema `web` y vistas en Neon.
2.  **Configurar Variables**: Crear el archivo `.env` en `jeheka-clasificados` apuntando al usuario `service_public`.
3.  **Bootstrap UI**: Iniciar la estructura de `jeheka-clasificados` con enfoque en Premium UX.
