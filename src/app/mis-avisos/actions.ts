"use server";

import { db } from "@/lib/db";
import { getSession } from "@/app/login/actions";
import { revalidatePath } from "next/cache";

export async function getMisAvisos() {
  const session = await getSession();
  if (!session) return [];

  const res = await db.query(
    `SELECT a.*, r.nombre as rubro_nombre, s.nombre as sub_rubro_nombre
     FROM avisos a
     LEFT JOIN rubros r ON a.avi_rubro_id = r.id
     LEFT JOIN sub_rubros s ON a.avi_sub_rubro_id = s.id
     WHERE a.usu_id = $1
     ORDER BY a.avi_fec_alta DESC`,
    [session.id]
  );
  return res.rows;
}

export async function createAviso(formData: {
  titulo: string;
  descripcion: string;
  precio?: number;
  rubroId: number;
  subRubroId?: number;
  departamentoId?: number;
  distritoId?: number;
  ciudadId?: number;
  whatsapp?: string;
  imagenes?: string[];
  planId: number;
}) {
  const session = await getSession();
  if (!session) return { success: false, message: "No hay sesión activa" };

  try {
    const { 
      titulo, descripcion, precio, rubroId, 
      subRubroId, departamentoId, distritoId, 
      ciudadId, whatsapp, imagenes 
    } = formData;

    const res = await db.query(
      `INSERT INTO avisos (
        usu_id, avi_titulo, avi_descripcion, avi_precio, 
        avi_rubro_id, avi_sub_rubro_id, avi_dep_cod, 
        avi_dis_cod, avi_ciu_cod, avi_whatsapp, avi_imagenes, 
        avi_estado, avi_plan_id, avi_moneda
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'AC', $12, 'PY')
      RETURNING avi_id`,
      [
        session.id, titulo, descripcion, precio, 
        rubroId, subRubroId, departamentoId, 
        distritoId, ciudadId, whatsapp, JSON.stringify(imagenes || []),
        formData.planId
      ]
    );

    revalidatePath("/mis-avisos");
    return { success: true, message: "Aviso creado exitosamente.", id: res.rows[0].avi_id };
  } catch (error) {
    console.error("Create Aviso Error:", error);
    return { success: false, message: "Error al crear el aviso." };
  }
}

export async function getPlanesPortal() {
  const res = await db.query(
    "SELECT id, nombre, precio_mensual FROM public.planes WHERE plan_mostrar_portal = TRUE ORDER BY precio_mensual ASC"
  );
  return res.rows;
}

export async function deleteAviso(avisoId: string) {
  const session = await getSession();
  if (!session) return { success: false, message: "No hay sesión activa" };

  try {
    await db.query("DELETE FROM avisos WHERE avi_id = $1 AND usu_id = $2", [avisoId, session.id]);
    revalidatePath("/mis-avisos");
    return { success: true, message: "Aviso eliminado." };
  } catch (error) {
    return { success: false, message: "Error al eliminar." };
  }
}

export async function getUserDefaultData() {
  const session = await getSession();
  if (!session) return null;

  const res = await db.query(
    `SELECT usu_whatsapp, usu_departamento_id, usu_distrito_id, usu_ciudad_id, usu_rubro_id, usu_sub_rubro_id 
     FROM usuarios_portal WHERE usu_id = $1`,
    [session.id]
  );
  return res.rows[0];
}

export async function getAvisoById(id: string) {
  try {
    const res = await db.query(
      `SELECT a.*, u.usu_nombre, u.usu_whatsapp as usu_tel, r.nombre as rubro_nombre
       FROM avisos a
       LEFT JOIN usuarios_portal u ON a.usu_id = u.usu_id
       LEFT JOIN rubros r ON a.avi_rubro_id = r.id
       WHERE a.avi_id = $1`,
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error getAvisoById:", error);
    return null;
  }
}
