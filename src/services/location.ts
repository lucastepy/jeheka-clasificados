import { db } from "@/lib/db";

export interface Departamento {
  dep_cod: number;
  dep_dsc: string;
}

export interface Distrito {
  dis_cod: number;
  dis_dsc: string;
  dis_dep_cod: number;
}

export const locationService = {
  /**
   * Obtiene la lista completa de departamentos ordenados alfabéticamente.
   */
  async getDepartamentos(): Promise<Departamento[]> {
    const sql = `SELECT dep_cod, dep_dsc FROM departamentos ORDER BY dep_dsc ASC`;
    const result = await db.query(sql);
    return result.rows;
  },

  /**
   * Obtiene los distritos de un departamento específico.
   */
  async getDistritos(depCod: number): Promise<Distrito[]> {
    const sql = `SELECT dis_cod, dis_dsc, dis_dep_cod FROM distritos WHERE dis_dep_cod = $1 ORDER BY dis_dsc ASC`;
    const result = await db.query(sql, [depCod]);
    return result.rows;
  },
  /**
   * Obtiene las ciudades de un distrito específico.
   */
  async getCiudades(disCod: number): Promise<any[]> {
    const sql = `SELECT ciu_cod, ciu_dsc, ciu_dis_cod FROM ciudades WHERE ciu_dis_cod = $1 ORDER BY ciu_dsc ASC`;
    const result = await db.query(sql, [disCod]);
    return result.rows;
  }
};

export const rubroService = {
  async getRubros(): Promise<any[]> {
    const sql = `SELECT cat_id as rub_id, cat_nombre as rub_nombre FROM categorias ORDER BY cat_nombre ASC`;
    const result = await db.query(sql);
    return result.rows;
  },

  async getSubRubros(rubId: number): Promise<any[]> {
    // Actualmente las categorías del portal son nivel 1, pero si hubiera sub-categorías:
    const sql = `SELECT cat_id as sub_id, cat_nombre as sub_nombre FROM categorias WHERE cat_parent_id = $1 ORDER BY cat_nombre ASC`;
    // Nota: Si no hay tabla de sub-rubros vinculada a categorias, esto puede devolver vacío.
    const result = await db.query(sql, [rubId]);
    return result.rows;
  }
};
