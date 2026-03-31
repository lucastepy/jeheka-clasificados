import { Pool } from '@neondatabase/serverless';

// PRECAUCIÓN: Para jeheka-clasificados se debe usar un usuario de Neon con permisos restringidos 'web'
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = {
  /**
   * Ejecuta una consulta segura utilizando el pool de Neon.
   * Optimizado para lectura en el portal público.
   */
  query: async (text: string, params?: any[]) => {
    const client = await pool.connect();
    try {
      // Forzar el search_path al esquema 'web' para aislamiento absoluto
      await client.query("SET search_path TO web, public");
      return await client.query(text, params);
    } finally {
      client.release();
    }
  },
};
