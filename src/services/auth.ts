import { db } from "@/lib/db";
import bcrypt from "bcryptjs"; // Needs to be added to package.json later or use native crypto

export const publicAuthService = {
  /**
   * Registro de un usuario en la plataforma Jeheka-Clasificados.
   * ESTANCO: No tiene acceso a la tabla usuarios de Jeheka-Admin.
   */
  async registrarPublico(email: string, pass: string, nombre: string) {
    const hash = await bcrypt.hash(pass, 10);
    const sql = `
      INSERT INTO web.usuarios_portal (usu_email, usu_password_hash, usu_nombre)
      VALUES ($1, $2, $3) RETURNING usu_id, usu_email, usu_nombre
    `;
    const result = await db.query(sql, [email, hash, nombre]);
    return result.rows[0];
  },

  async loginPublico(email: string, pass: string) {
    const sql = `SELECT * FROM web.usuarios_portal WHERE usu_email = $1`;
    const result = await db.query(sql, [email]);
    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    const match = await bcrypt.compare(pass, user.usu_password_hash);
    if (!match) return null;

    return {
      id: user.usu_id,
      email: user.usu_email,
      nombre: user.usu_nombre
    };
  }
};
