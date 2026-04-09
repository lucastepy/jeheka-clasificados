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
    let sql = `
      SELECT 
        a.avi_id, a.avi_titulo, a.avi_descripcion, a.avi_precio, a.avi_imagenes,
        u.usu_nombre as vendedor_nombre, 
        u.usu_foto_url as vendedor_foto,
        ts_rank(a.avi_search_vector, web_search_to_tsquery('spanish', $1)) as rank
      FROM avisos a
      JOIN usuarios_portal u ON a.usu_id = u.usu_id
      WHERE a.avi_estado = 'AC'
    `;

    // Filtro de texto (optimizado con tsquery)
    if (query) {
      params.push(query);
      sql += ` AND a.avi_search_vector @@ web_search_to_tsquery('spanish', $${params.length})`;
    } else {
      params.push(''); // queries sin texto
      sql = sql.replace("ts_rank(a.avi_search_vector, web_search_to_tsquery('spanish', $1))", "0");
    }

    if (categoria) {
      params.push(categoria);
      sql += ` AND a.avi_rubro_id = $${params.length}`;
    }
    if (ciudad) {
      params.push(ciudad);
      sql += ` AND a.avi_ciu_cod = $${params.length}`;
    }

    if (min_precio) {
      params.push(min_precio);
      sql += ` AND a.avi_precio >= $${params.length}`;
    }

    if (max_precio) {
      params.push(max_precio);
      sql += ` AND a.avi_precio <= $${params.length}`;
    }

    sql += ` ORDER BY rank DESC, a.avi_fec_alta DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
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
