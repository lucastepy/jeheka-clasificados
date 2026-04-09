"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/services/email";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const key = new TextEncoder().encode("jeheka_secret_2026_premium_portal");

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function getSession() {
  try {
    const sessionToken = (await cookies()).get("jk_auth_session")?.value;
    if (!sessionToken) return null;
    return await decrypt(sessionToken);
  } catch (err) {
    console.error("Session Decrypt Error:", err);
    return null;
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("jk_auth_session");
  revalidatePath("/");
}

// Generar clave temporal
const generateTempPassword = () => crypto.randomBytes(4).toString("hex").toUpperCase();

export async function registerUser(formData: { 
  name: string; 
  email: string;
  whatsapp?: string;
  direccion?: string;
  departamentoId?: number;
  distritoId?: number;
  ciudadId?: number;
  rubroId?: number;
  subRubroId?: number;
  esEmpresa?: boolean;
}) {
  try {
    const { 
      name, email, whatsapp, direccion, 
      departamentoId, distritoId, ciudadId, 
      rubroId, subRubroId, esEmpresa 
    } = formData;

    const userCheck = await db.query("SELECT usu_id FROM usuarios_portal WHERE usu_email = $1", [email]);
    if (userCheck.rows.length > 0) return { success: false, message: "Este correo ya existe." };

    const tempPassword = generateTempPassword();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempPassword, salt);

    const res = await db.query(
      `INSERT INTO usuarios_portal (
        usu_nombre, usu_email, usu_password_hash, usu_primer_ingreso,
        usu_whatsapp, usu_direccion, usu_departamento_id, usu_distrito_id, 
        usu_ciudad_id, usu_rubro_id, usu_sub_rubro_id, usu_es_empresa
      ) VALUES ($1, $2, $3, TRUE, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING usu_id`, 
      [name, email, passwordHash, whatsapp, direccion, departamentoId, distritoId, ciudadId, rubroId, subRubroId, esEmpresa]
    );

    const userId = res.rows[0].usu_id;

    // Si no es empresa, generar registro de CV inicial (LinkedIn-like)
    if (!esEmpresa) {
      await db.query(`INSERT INTO usuarios_portal_cv (usu_id) VALUES ($1)`, [userId]);
    }

    await sendWelcomeEmail(email, name, tempPassword);

    return { success: true, message: "Revisa tu correo para tu clave temporal." };
  } catch (error) {
    console.error("Error en registro:", error);
    return { success: false, message: "Error en el servidor." };
  }
}

export async function loginUser(formData: { email: string; password: string }) {
  try {
    const { email, password } = formData;
    const res = await db.query("SELECT usu_id, usu_nombre, usu_password_hash, usu_primer_ingreso FROM usuarios_portal WHERE usu_email = $1", [email]);
    if (res.rows.length === 0) return { success: false, message: "Credenciales inválidas." };

    const user = res.rows[0];
    const isMatch = await bcrypt.compare(password, user.usu_password_hash);
    if (!isMatch) return { success: false, message: "Credenciales inválidas." };

    if (user.usu_primer_ingreso) {
      return { success: true, forcePasswordChange: true, message: "Casi listo. Cambia tu clave.", userId: user.usu_id };
    }

    // Crear Sesión
    const userDetails = await db.query("SELECT usu_foto_url FROM usuarios_portal WHERE usu_id = $1", [user.usu_id]);
    const sessionToken = await encrypt({ id: user.usu_id, name: user.usu_nombre, fotoUrl: userDetails.rows[0]?.usu_foto_url });
    const cookieStore = await cookies();
    cookieStore.set("jk_auth_session", sessionToken, { httpOnly: true, secure: false, maxAge: 60 * 60 * 24, path: "/", sameSite: "lax" });
    
    return { success: true, message: "¡Bienvenido!" };
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, message: "Error interno del servidor" };
  }
}

export async function finalizePasswordChange(formData: { userId: string; newPassword: string }) {
  try {
    const { userId, newPassword } = formData;
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    const res = await db.query(
      `UPDATE usuarios_portal SET usu_password_hash = $1, usu_primer_ingreso = FALSE WHERE usu_id = $2 RETURNING usu_nombre`, 
      [newHash, userId]
    );

    const sessionToken = await encrypt({ id: userId, name: res.rows[0].usu_nombre });
    const cookieStore = await cookies();
    cookieStore.set("jk_auth_session", sessionToken, { httpOnly: true, secure: false, maxAge: 60 * 60 * 24, path: "/", sameSite: "lax" });
    
    return { success: true, message: "Contraseña actualizada" };
  } catch (error) {
    return { success: false, message: "Error de servidor" };
  }
}

export async function getUserData() {
  const session = await getSession();
  if (!session) return null;

  const res = await db.query(
    `SELECT usu_id, usu_nombre, usu_email, usu_whatsapp, usu_direccion, 
            usu_departamento_id, usu_distrito_id, usu_ciudad_id, 
            usu_rubro_id, usu_sub_rubro_id, usu_es_empresa, usu_foto_url
     FROM usuarios_portal WHERE usu_id = $1`, 
    [session.id]
  );
  return res.rows[0] || null;
}

export async function updateUserData(formData: {
  name: string;
  whatsapp?: string;
  direccion?: string;
  departamentoId?: number;
  distritoId?: number;
  ciudadId?: number;
  rubroId?: number;
  subRubroId?: number;
  esEmpresa?: boolean;
  fotoUrl?: string;
}) {
  const session = await getSession();
  if (!session) return { success: false, message: "No hay sesión activa" };

  try {
    const { 
      name, whatsapp, direccion, 
      departamentoId, distritoId, ciudadId, 
      rubroId, subRubroId, esEmpresa, fotoUrl 
    } = formData;

    // Lógica de Sincronización con la Tabla de Clientes (public.clientes)
    const userRow = await db.query("SELECT usu_email, usu_cliente_id FROM usuarios_portal WHERE usu_id = $1", [session.id]);
    const { usu_email, usu_cliente_id } = userRow.rows[0];

    let clienteId = usu_cliente_id;

    if (!clienteId) {
      // Intentar vincular por email si ya existe en clientes pero no está vinculado
      const existingCliente = await db.query("SELECT id FROM clientes WHERE email_facturacion = $1 LIMIT 1", [usu_email]);
      if (existingCliente.rows.length > 0) {
        clienteId = existingCliente.rows[0].id;
      }
    }

    if (clienteId) {
      // Actualizar cliente existente
      await db.query(
        `UPDATE clientes SET 
          nombre_empresa = $1, razon_social = $1, rubro_id = $2, sub_rubro_id = $3, 
          telefono_facturacion = $4, direccion_fiscal = $5, fecha_modificacion = CURRENT_TIMESTAMP
         WHERE id = $6`,
        [name, rubroId, subRubroId, whatsapp, direccion, clienteId]
      );
    } else {
      // Crear nuevo cliente
      const newCliente = await db.query(
        `INSERT INTO clientes (
          nombre_empresa, razon_social, rubro_id, sub_rubro_id, 
          email_facturacion, telefono_facturacion, direccion_fiscal, estado
        ) VALUES ($1, $1, $2, $3, $4, $5, $6, 'pendiente_pago')
        RETURNING id`,
        [name, rubroId, subRubroId, usu_email, whatsapp, direccion]
      );
      clienteId = newCliente.rows[0].id;
    }

    // Asegurar que usuarios_portal tenga la referencia al cliente_id
    await db.query(
      `UPDATE usuarios_portal SET 
        usu_nombre = $1, usu_whatsapp = $2, usu_direccion = $3, 
        usu_departamento_id = $4, usu_distrito_id = $5, usu_ciudad_id = $6, 
        usu_rubro_id = $7, usu_sub_rubro_id = $8, usu_es_empresa = $9,
        usu_foto_url = $10, usu_cliente_id = $11
       WHERE usu_id = $12`,
      [name, whatsapp, direccion, departamentoId, distritoId, ciudadId, rubroId, subRubroId, esEmpresa, fotoUrl, clienteId, session.id]
    );

    // Si cambia a cuenta personal y no tiene CV, crearlo
    if (!esEmpresa) {
      const cvCheck = await db.query("SELECT cv_id FROM usuarios_portal_cv WHERE usu_id = $1", [session.id]);
      if (cvCheck.rows.length === 0) {
        await db.query(`INSERT INTO usuarios_portal_cv (usu_id) VALUES ($1)`, [session.id]);
      }
    }

    // Actualizar Cookie de Sesión con nuevos datos (nombre/foto)
    const sessionToken = await encrypt({ 
      id: session.id, 
      name: name,
      fotoUrl: fotoUrl 
    });
    const cookieStore = await cookies();
    cookieStore.set("jk_auth_session", sessionToken, { httpOnly: true, secure: false, maxAge: 60 * 60 * 24, path: "/", sameSite: "lax" });
    revalidatePath("/", "layout");

    revalidatePath("/mis-datos");
    revalidatePath("/");
    return { success: true, message: "¡Datos actualizados!" };
  } catch (error) {
    console.error("Error updating user data:", error);
    return { success: false, message: "Error al actualizar." };
  }
}
