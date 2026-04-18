"use server";

import { db } from "@/lib/db";
import { getSession } from "@/app/login/actions";
import { revalidatePath } from "next/cache";

export async function getMisAvisos() {
  const session = await getSession();
  if (!session) return [];

  const res = await db.query(
    `SELECT a.*, r.nombre as rubro_nombre, s.nombre as sub_rubro_nombre,
            a.avi_es_suscripcion, a.avi_fec_vto, a.avi_cancelado
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
      
      // 1. Buscar el ID de vigencia indefinida (0 meses)
      const vigenciaRes = await db.query(
        "SELECT vig_planes_id FROM public.vigencia_planes WHERE vig_planes_tiempo = 0 LIMIT 1"
      );
      const vigenciaId = vigenciaRes.rows[0]?.vig_planes_id || 1; // Fallback a 1 si no encuentra nada

      // 2. Crear el cliente con el plan seleccionado y la vigencia correcta
      const clientInsertRes = await db.query(
        `INSERT INTO public.clientes (
          nombre_empresa, razon_social, email_facturacion, 
          telefono_facturacion, rubro_id, sub_rubro_id, 
          fecha_alta, plan_id, vigencia_plan_id
        ) VALUES ($1, $1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7)
        RETURNING id`,
        [
          userData.usu_nombre, 
          userData.usu_email, 
          userData.usu_whatsapp,
          userData.usu_rubro_id,
          userData.usu_sub_rubro_id,
          formData.planId,
          vigenciaId
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

    // 1. Crear el aviso en estado Activo ('AC') directamente
    const res = await db.query(
      `INSERT INTO avisos (
        usu_id, cli_id, avi_titulo, avi_descripcion, avi_precio, 
        avi_rubro_id, avi_sub_rubro_id, avi_departamento_id, 
        avi_distrito_id, avi_ciudad_id, avi_whatsapp, avi_imagenes, 
        avi_estado, avi_plan_id, avi_moneda, avi_fec_alta, avi_fec_vto
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'AC', $13, 'PY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 month')
      RETURNING avi_id`,
      [
        session.id, cliId, titulo, descripcion, precio, 
        rubroId, subRubroId, departamentoId, 
        distritoId, ciudadId, whatsapp, JSON.stringify(imagenes || []),
        formData.planId
      ]
    );

    const aviId = res.rows[0].avi_id;

    revalidatePath("/mis-avisos");
    return { 
      success: true, 
      message: "¡Tu aviso ha sido publicado exitosamente y ya es visible en el portal!", 
      id: aviId
    };
  } catch (error) {
    console.error("Create Aviso Error:", error);
    return { success: false, message: "Error al crear el aviso." };
  }
}

export async function updateAviso(avisoId: string, formData: {
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
}) {
  const session = await getSession();
  if (!session) return { success: false, message: "No hay sesión activa" };

  try {
    await db.query(
      `UPDATE avisos SET 
        avi_titulo = $1, avi_descripcion = $2, avi_precio = $3, 
        avi_rubro_id = $4, avi_sub_rubro_id = $5, avi_departamento_id = $6, 
        avi_distrito_id = $7, avi_ciudad_id = $8, avi_whatsapp = $9, avi_imagenes = $10
       WHERE avi_id = $11 AND usu_id = $12`,
      [
        formData.titulo, formData.descripcion, formData.precio, 
        formData.rubroId, formData.subRubroId, formData.departamentoId, 
        formData.distritoId, formData.ciudadId, formData.whatsapp, 
        JSON.stringify(formData.imagenes || []),
        avisoId, session.id
      ]
    );

    revalidatePath("/mis-avisos");
    revalidatePath(`/avisos/${avisoId}`);
    return { success: true, message: "Aviso actualizado correctamente" };
  } catch (error) {
    console.error("Update Aviso Error:", error);
    return { success: false, message: "Error al actualizar el aviso" };
  }
}

export async function getPlanesPortal() {
  const res = await db.query(
    `SELECT p.id, p.nombre, p.precio_mensual,
      (SELECT COALESCE(SUM(com_porcentaje), 0) FROM plan_comisiones pc JOIN comisiones com ON pc.com_id = com.com_id WHERE pc.plan_id = p.id) as plan_sum_porc,
      (SELECT COALESCE(SUM(com_fijo), 0) FROM plan_comisiones pc JOIN comisiones com ON pc.com_id = com.com_id WHERE pc.plan_id = p.id) as plan_sum_fijo
     FROM public.planes p 
     WHERE plan_mostrar_portal = TRUE 
     ORDER BY precio_mensual ASC`
  );
  return res.rows;
}

export async function deleteAviso(avisoId: string) {
  const session = await getSession();
  if (!session) return { success: false, message: "No hay sesión activa" };

  try {
    // 1. Verificar si tiene una suscripción activa para darla de baja antes de borrar
    const res = await db.query(
      "SELECT dlocal_id, avi_es_suscripcion, avi_cancelado FROM public.avisos WHERE avi_id = $1 AND usu_id = $2",
      [avisoId, session.id]
    );
    const aviso = res.rows[0];

    if (aviso && aviso.avi_es_suscripcion && aviso.dlocal_id && !aviso.avi_cancelado) {
      console.log(`Eliminando aviso con suscripción activa. Cancelando en dLocal: ${aviso.dlocal_id}`);
      const { cancelDLocalSubscription } = await import("@/lib/dlocal");
      await cancelDLocalSubscription(aviso.dlocal_id);
    }

    // 2. Eliminar el registro del aviso
    await db.query("DELETE FROM public.avisos WHERE avi_id = $1 AND usu_id = $2", [avisoId, session.id]);
    
    revalidatePath("/mis-avisos");
    return { success: true, message: "Aviso eliminado y débito automático cancelado exitosamente." };
  } catch (error) {
    console.error("Error al eliminar aviso:", error);
    return { success: false, message: "Error al eliminar el aviso." };
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
       WHERE a.avi_id = $1 
       AND (a.avi_estado = 'AC' OR a.avi_estado = 'activo')
       AND (a.avi_fec_vto IS NULL OR a.avi_fec_vto > CURRENT_TIMESTAMP)`,
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
    console.log(`Intentando activar aviso: ${avisoId}`);
    
    let pagoMarca = null;
    let pagoUltimos4 = null;
    let pagoTipo = null;
    let montoNeto = null;

    // 1. Si viene el ID de dLocal, verificamos en su API y extraemos detalles
    if (dlocalPaymentId) {
      const { retrieveDLocalPayment } = await import("@/lib/dlocal");
      const dlocal = await retrieveDLocalPayment(dlocalPaymentId);
      
      if (dlocal.success && dlocal.payment) {
        const p = dlocal.payment;
        pagoMarca = p.card?.brand || p.payment_method_id;
        pagoUltimos4 = p.card?.last_four;
        pagoTipo = p.card?.card_type || (dlocalPaymentId.startsWith('sub_') ? 'subscription' : 'payment');

        // 2. Calcular montos netos basados en la tabla de comisiones
        const montoBruto = p.amount || 0;
        const commRes = await db.query(
          "SELECT com_porcentaje, com_fijo FROM public.comisiones WHERE com_activo = TRUE ORDER BY com_id DESC LIMIT 1"
        );
        
        if (commRes.rows[0]) {
          const { com_porcentaje, com_fijo } = commRes.rows[0];
          const feePorc = montoBruto * (Number(com_porcentaje) / 100);
          const feeFijo = Number(com_fijo);
          montoNeto = montoBruto - feePorc - feeFijo;
        }
      }
    }

    // 3. Activar el aviso en la DB y guardar Info de Pago
    const res = await db.query(
      `UPDATE public.avisos 
       SET avi_estado = 'AC', 
           avi_fec_alta = CURRENT_TIMESTAMP,
           avi_fec_vto = CURRENT_TIMESTAMP + INTERVAL '1 month',
           avi_pago_marca = $2,
           avi_pago_ultimos4 = $3,
           avi_pago_tipo = $4,
           avi_pago_monto_neto = $5
       WHERE avi_id = $1 RETURNING cli_id`,
      [avisoId, pagoMarca, pagoUltimos4, pagoTipo, montoNeto]
    );

    const cliId = res.rows[0]?.cli_id;
    console.log(`Aviso activado. Resultado update: ${res.rowCount} filas afectadas. CliId: ${cliId}`);

    // 3. Generar registro en la tabla plan_pago
    if (cliId) {
       console.log("Generando registro en plan_pago...");
       await db.query(
         `INSERT INTO public.plan_pago (
            plan_pago_cli, plan_pago_fec, plan_pago_nro, 
            plan_pago_estado, plan_pago_fec_pago, plan_pago_vto
          ) VALUES ($1, CURRENT_DATE, 1, 'AC', CURRENT_DATE, CURRENT_DATE)`,
         [cliId]
       );
       console.log("Registro en plan_pago creado exitosamente");
    }

    revalidatePath("/mis-avisos");
    return { success: true };
  } catch (error) {
    console.error("Error crítico al activar aviso:", error);
    return { success: false, error: String(error) };
  }
}

export async function cancelSubscription(avisoId: string) {
  const session = await getSession();
  if (!session) return { success: false, message: "No hay sesión activa" };

  try {
    // 1. Obtener la suscripción del aviso
    const res = await db.query(
      "SELECT dlocal_id, avi_es_suscripcion FROM public.avisos WHERE avi_id = $1 AND usu_id = $2",
      [avisoId, session.id]
    );

    const aviso = res.rows[0];
    if (!aviso || !aviso.avi_es_suscripcion || !aviso.dlocal_id) {
       return { success: false, message: "No se encontró una suscripción activa para este aviso" };
    }

    // 2. Cancelar en dLocal
    const { cancelDLocalSubscription } = await import("@/lib/dlocal");
    const dlocal = await cancelDLocalSubscription(aviso.dlocal_id);

    if (!dlocal.success) {
      console.error("Error al cancelar en dLocal:", dlocal.error);
      return { success: false, message: "Hubo un error al comunicar la cancelación con dLocal" };
    }

    // 3. Marcar como cancelado en la DB
    // El estado sigue siendo 'AC' (activo) pero avi_cancelado = true
    // El aviso se desactivará automáticamente cuando llegue su avi_fec_vto
    await db.query(
      "UPDATE public.avisos SET avi_cancelado = TRUE WHERE avi_id = $1",
      [avisoId]
    );

    revalidatePath("/mis-avisos");
    return { success: true, message: "Suscripción cancelada. El aviso seguirá activo hasta el final de tu ciclo de facturación." };
  } catch (error) {
    console.error("Error al cancelar suscripción:", error);
    return { success: false, message: "Error interno al procesar la cancelación" };
  }
}

export async function retryPayment(avisoId: string) {
  return { success: false, message: "Los pagos están temporalmente desactivados. Tu aviso ya debería estar activo." };
}
