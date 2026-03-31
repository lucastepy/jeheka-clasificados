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
  }
};
