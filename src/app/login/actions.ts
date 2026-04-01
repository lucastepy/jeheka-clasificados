"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/services/email";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

// Función para generar una clave aleatoria segura
const generateTempPassword = () => crypto.randomBytes(4).toString("hex").toUpperCase(); // 8 caracteres

export async function registerUser(formData: { name: string; email: string }) {
  try {
    const { name, email } = formData;
    
    // 1. Verificar si el usuario ya existe
    const userCheck = await db.query(
      "SELECT usu_id FROM usuarios_portal WHERE usu_email = $1",
      [email]
    );

    if (userCheck.rows.length > 0) {
      return { success: false, message: "Este correo ya está registrado." };
    }

    // 2. Generar clave temporal y su hash
    const tempPassword = generateTempPassword();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempPassword, salt);

    // 3. Insertar en la base de datos (Esquema PUBLIC)
    await db.query(
      `INSERT INTO usuarios_portal (usu_nombre, usu_email, usu_password_hash, usu_primer_ingreso) 
       VALUES ($1, $2, $3, TRUE)`,
      [name, email, passwordHash]
    );

    // 4. Enviar Correo HTML de bienvenida
    try {
      await sendWelcomeEmail(email, name, tempPassword);
    } catch (emailError) {
      console.error("Error enviando email:", emailError);
    }

    return { 
      success: true, 
      message: "¡Registro exitoso! Revisa tu correo para obtener tu clave temporal." 
    };

  } catch (error: any) {
    console.error("Error en el registro:", error);
    return { success: false, message: "Error interno del servidor. Inténtalo más tarde." };
  }
}

export async function loginUser(formData: { email: string; password: string }) {
  try {
    const { email, password } = formData;

    const res = await db.query(
      "SELECT usu_id, usu_nombre, usu_password_hash, usu_primer_ingreso FROM usuarios_portal WHERE usu_email = $1",
      [email]
    );

    if (res.rows.length === 0) {
      return { success: false, message: "Credenciales inválidas." };
    }

    const user = res.rows[0];
    const isMatch = await bcrypt.compare(password, user.usu_password_hash);

    if (!isMatch) {
      return { success: false, message: "Credenciales inválidas." };
    }

    if (user.usu_primer_ingreso) {
      return { 
        success: true, 
        forcePasswordChange: true,
        message: "Bienvenido. Por favor, actualiza tu contraseña.",
        userId: user.usu_id
      };
    }

    return { 
      success: true, 
      message: "Ingreso exitoso. Generando sesión...",
      user: { id: user.usu_id, name: user.usu_nombre }
    };

  } catch (error) {
    console.error("Error en el login:", error);
    return { success: false, message: "Error al intentar ingresar." };
  }
}

export async function finalizePasswordChange(formData: { userId: string; newPassword: string }) {
  try {
    const { userId, newPassword } = formData;
    
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await db.query(
      `UPDATE usuarios_portal 
       SET usu_password_hash = $1, usu_primer_ingreso = FALSE 
       WHERE usu_id = $2`,
      [newHash, userId]
    );

    revalidatePath("/login");
    return { success: true, message: "Contraseña actualizada correctamente." };

  } catch (error) {
    console.error("Error actualizando contraseña:", error);
    return { success: false, message: "No se pudo actualizar la contraseña." };
  }
}
