import { db } from "@/lib/db";

export interface SearchFilters {
  query?: string;
  categoria?: number;
  ciudad?: number;
  min_precio?: number;
  max_precio?: number;
  limit?: number;
  offset?: number;
}

/**
 * Servicio de búsqueda de Jeheka-Clasificados.
 * Utiliza Postgres Full Text Search (GIN indexing) para resultados óptimos.
 * Todas las tablas e índices se encuentran en el esquema 'public'.
 */
export const searchService = {
  async buscarAvisos(filters: SearchFilters) {
    const { query, categoria, ciudad, min_precio, max_precio, limit = 20, offset = 0 } = filters;
    const params: any[] = [];
    
    // Base query using public schema
    /** 
     * Base query: 
     * - LEFT JOIN con usuarios_portal (para anuncios del portal)
     * - LEFT JOIN con v_clientes (para anuncios profesionales legacy)
     * - Soporta estados 'AC' (nuevo estándar) y 'activo' (legacy)
     */
    let sql = `
      SELECT 
        a.avi_id, a.avi_titulo, a.avi_descripcion, a.avi_precio, a.avi_imagenes, a.avi_visitas,
        u.usu_nombre as vendedor_nombre, 
        u.usu_foto_url as vendedor_foto,
        c.ciu_dsc as ciudad_nombre,
        d.dep_dsc as departamento_nombre,
        (SELECT AVG(calificacion) FROM avisos_calificaciones WHERE avi_id = a.avi_id) as rating_promedio
      FROM avisos a
      LEFT JOIN usuarios_portal u ON a.usu_id = u.usu_id
      LEFT JOIN departamentos d ON a.avi_departamento_id = d.dep_cod
      LEFT JOIN ciudades c ON a.avi_ciudad_id = c.ciu_cod AND a.avi_distrito_id = c.ciu_dis_cod
      WHERE (a.avi_estado = 'AC' OR a.avi_estado = 'activo')
    `;

    // Filtro de texto (optimizado con tsquery)
    if (query && query.trim() !== "") {
      params.push(query);
      sql += ` AND a.avi_search_vector @@ plainto_tsquery('spanish', $${params.length}::text)`;
    } 

    if (categoria) {
      params.push(categoria);
      sql += ` AND a.avi_rubro_id = $${params.length}`;
    }
    if (ciudad) {
      params.push(ciudad);
      sql += ` AND a.avi_ciudad_id = $${params.length}`;
    }

    if (min_precio) {
      params.push(min_precio);
      sql += ` AND a.avi_precio >= $${params.length}`;
    }

    if (max_precio) {
      params.push(max_precio);
      sql += ` AND a.avi_precio <= $${params.length}`;
    }

    // Ordenamiento Premium: 1. Rating, 2. Visitas, 3. Fecha
    sql += ` ORDER BY rating_promedio DESC NULLS LAST, a.avi_visitas DESC NULLS LAST, a.avi_fec_alta DESC`;
    
    sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(sql, params);
    return result.rows;
  },

  async obtenerCategorias() {
    const sql = `SELECT cat_id, cat_nombre, cat_slug, cat_icono FROM categorias ORDER BY cat_nombre ASC`;
    const result = await db.query(sql);
    return result.rows;
  }
};
