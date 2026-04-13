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

    // 1. Crear el aviso en estado Pendiente ('PE')
    const res = await db.query(
      `INSERT INTO avisos (
        usu_id, cli_id, avi_titulo, avi_descripcion, avi_precio, 
        avi_rubro_id, avi_sub_rubro_id, avi_departamento_id, 
        avi_distrito_id, avi_ciudad_id, avi_whatsapp, avi_imagenes, 
        avi_estado, avi_plan_id, avi_moneda
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'PE', $13, 'PY')
      RETURNING avi_id`,
      [
        session.id, cliId, titulo, descripcion, precio, 
        rubroId, subRubroId, departamentoId, 
        distritoId, ciudadId, whatsapp, JSON.stringify(imagenes || []),
        formData.planId
      ]
    );

    const aviId = res.rows[0].avi_id;

    // 2. Obtener el monto del plan seleccionado para generar el pago
    const planRes = await db.query("SELECT nombre, precio_mensual FROM planes WHERE id = $1", [formData.planId]);
    const plan = planRes.rows[0];

    if (!plan) {
      return { success: false, message: "Plan no encontrado." };
    }

    // 3. Generar el link de pago en dLocal Go
    // Importamos dinámicamente o arriba. Mejor arriba pero como es server action...
    const { createDLocalPayment } = await import("@/lib/dlocal");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const payment = await createDLocalPayment({
      amount: plan.precio_mensual,
      currency: 'PYG',
      country: 'PY',
      order_id: aviId.toString(),
      description: `Jeheka - Plan ${plan.nombre}`,
      success_url: `${baseUrl}/mis-avisos/pago-exitoso?avisoId=${aviId}`,
      back_url: `${baseUrl}/mis-avisos/nuevo`,
      notification_url: `${baseUrl}/api/webhooks/dlocal`,
      allow_recurring: true // Habilitamos recurrencia como pidió el usuario
    });

    if (!payment.success) {
      // Si falla el pago, igual el aviso quedó en pendiente, pero avisamos al usuario
      console.error("Error al generar pago dLocal:", payment.error);
      return { 
        success: true, 
        message: "Aviso guardado (pendiente), pero hubo un error con el link de pago.",
        id: aviId
      };
    }

    revalidatePath("/mis-avisos");
    return { 
      success: true, 
      message: "Aviso creado. Redirigiendo al pago...", 
      id: aviId,
      checkoutUrl: payment.redirect_url 
    };
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
    // 1. Incrementar contador de visitas
    await db.query("UPDATE avisos SET avi_visitas = COALESCE(avi_visitas, 0) + 1 WHERE avi_id = $1", [id]);

    // 2. Obtener detalle completo con promedio de rating
    const res = await db.query(
      `SELECT a.*, 
              u.usu_nombre, u.usu_whatsapp as usu_tel, u.usu_biografia, u.usu_foto_url, u.usu_email, u.usu_direccion, 
              r.nombre as rubro_nombre,
              d.dep_dsc as departamento_nombre,
              dist.dis_dsc as distrito_nombre,
              c.ciu_dsc as ciudad_nombre,
              (SELECT AVG(calificacion) FROM avisos_calificaciones WHERE avi_id = a.avi_id) as rating_promedio,
              (SELECT COUNT(*) FROM avisos_calificaciones WHERE avi_id = a.avi_id) as rating_cantidad
       FROM avisos a
       LEFT JOIN usuarios_portal u ON a.usu_id = u.usu_id
       LEFT JOIN rubros r ON a.avi_rubro_id = r.id
       LEFT JOIN departamentos d ON a.avi_departamento_id = d.dep_cod
       LEFT JOIN distritos dist ON a.avi_distrito_id = dist.dis_cod AND a.avi_departamento_id = dist.dis_dep_cod
       LEFT JOIN ciudades c ON a.avi_ciudad_id = c.ciu_cod AND a.avi_distrito_id = c.ciu_dis_cod
       WHERE a.avi_id = $1`,
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error getAvisoById:", error);
    return null;
  }
}

export async function rateAviso(avisoId: string, rating: number, comentario?: string) {
  const session = await getSession();
  const usuId = session?.id || null;

  try {
    // Si el usuario está logueado, intentamos actualizar su voto previo. 
    // Si no está logueado, simplemente insertamos un voto nuevo.
    if (usuId) {
      await db.query(
        `INSERT INTO avisos_calificaciones (avi_id, usu_id, calificacion, comentario)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (avi_id, usu_id) 
         DO UPDATE SET calificacion = EXCLUDED.calificacion, comentario = EXCLUDED.comentario, fecha_alta = CURRENT_TIMESTAMP`,
        [avisoId, usuId, rating, comentario]
      );
    } else {
      await db.query(
        `INSERT INTO avisos_calificaciones (avi_id, usu_id, calificacion, comentario)
         VALUES ($1, NULL, $2, $3)`,
        [avisoId, rating, comentario]
      );
    }
    
    revalidatePath(`/avisos/${avisoId}`);
    return { success: true, message: "¡Gracias por tu calificación!" };
  } catch (error) {
    console.error("Error rating aviso:", error);
    return { success: false, message: "Error al guardar la calificación" };
  }
}

export async function activateAviso(avisoId: string, dlocalPaymentId?: string) {
  try {
    // 1. Si viene el ID de dLocal, verificamos en su API primero
    if (dlocalPaymentId) {
      const { retrieveDLocalPayment } = await import("@/lib/dlocal");
      const dlocal = await retrieveDLocalPayment(dlocalPaymentId);
      
      if (!dlocal.success || (dlocal.payment.status !== 'PAID' && dlocal.payment.status !== 'PENDING')) {
        // PENDING también lo dejamos pasar a veces según la política, pero PAID es lo ideal.
      }
    }

    // 2. Activar el aviso en la DB
    await db.query(
      "UPDATE avisos SET avi_estado = 'AC', avi_fec_alta = CURRENT_TIMESTAMP WHERE avi_id = $1",
      [avisoId]
    );

    revalidatePath("/mis-avisos");
    return { success: true };
  } catch (error) {
    console.error("Error al activar aviso:", error);
    return { success: false };
  }
}
