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

    // Obtener el cli_id del usuario para vincularlo al aviso
    const userRes = await db.query(
      "SELECT usu_cliente_id, usu_nombre, usu_email, usu_whatsapp, usu_rubro_id, usu_sub_rubro_id FROM usuarios_portal WHERE usu_id = $1", 
      [session.id]
    );
    
    let cliId = userRes.rows[0]?.usu_cliente_id;

    // Si no tiene cli_id, creamos el cliente automáticamente en la tabla administrativa
    if (!cliId) {
      console.log("Detectado usuario sin ID de cliente. Creando registro en tabla clientes...");
      const userData = userRes.rows[0];
      
      const clientInsertRes = await db.query(
        `INSERT INTO clientes (
          nombre_empresa, razon_social, email_facturacion, 
          telefono_facturacion, rubro_id, sub_rubro_id, 
          fecha_alta, plan_id
        ) VALUES ($1, $1, $2, $3, $4, $5, CURRENT_TIMESTAMP, 1)
        RETURNING id`,
        [
          userData.usu_nombre, 
          userData.usu_email, 
          userData.usu_whatsapp,
          userData.usu_rubro_id,
          userData.usu_sub_rubro_id
        ]
      );
      
      cliId = clientInsertRes.rows[0].id;
      
      // Actualizamos el usuario del portal con su nuevo ID de cliente vinculado
      await db.query(
        "UPDATE usuarios_portal SET usu_cliente_id = $1 WHERE usu_id = $2",
        [cliId, session.id]
      );
      
      console.log("Cliente creado y vinculado exitosamente con ID:", cliId);
    }

    const res = await db.query(
      `INSERT INTO avisos (
        usu_id, cli_id, avi_titulo, avi_descripcion, avi_precio, 
        avi_rubro_id, avi_sub_rubro_id, avi_departamento_id, 
        avi_distrito_id, avi_ciudad_id, avi_whatsapp, avi_imagenes, 
        avi_estado, avi_plan_id, avi_moneda
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'AC', $13, 'PY')
      RETURNING avi_id`,
      [
        session.id, cliId, titulo, descripcion, precio, 
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
      `SELECT a.*, u.usu_nombre, u.usu_whatsapp as usu_tel, u.usu_biografia, u.usu_foto_url, u.usu_email, u.usu_direccion, r.nombre as rubro_nombre
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
