import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendWelcomeEmail = async (email: string, name: string, tempPassword: string) => {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Bienvenido a Jeheka Clasificados</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <!-- Contenedor Principal -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              
              <!-- Header con Gradiente Interesante -->
              <tr>
                <td align="center" style="padding: 50px 40px; background: #059669; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">JEHEKA</h1>
                  <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 10px; opacity: 0.8; font-weight: bold; letter-spacing: 3px;">CLASIFICADOS</p>
                </td>
              </tr>

              <!-- Cuerpo del mensaje -->
              <tr>
                <td style="padding: 40px 50px; color: #334155;">
                  <h2 style="margin: 0 0 20px 0; font-size: 22px; color: #0f172a; font-weight: 800;">¡Hola, ${name}!</h2>
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                    Te damos la bienvenida al portal de clasificados y servicios de Jeheka. Tu cuenta ha sido creada con éxito.
                  </p>
                  <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">
                    Contraseña Temporal de Acceso:
                  </p>
                  
                  <!-- Caja de la Contraseña -->
                  <div style="background-color: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 8px; padding: 25px; text-align: center; margin-bottom: 30px;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 2px;">
                      ${tempPassword}
                    </span>
                  </div>

                  <!-- Botón CTA -->
                  <div align="center" style="margin-bottom: 30px;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="background-color: #10b981; color: #ffffff; padding: 16px 35px; border-radius: 50px; text-decoration: none; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; display: inline-block;">
                      Ingresar al Portal
                    </a>
                  </div>

                  <p style="margin: 0; font-size: 13px; color: #94a3b8; font-style: italic; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                    * Por razones de seguridad, te pediremos cambiar esta clave temporal inmediatamente después de tu primer ingreso.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 30px; background-color: #fbfcfb; border-top: 1px solid #f1f5f9; color: #cbd5e1; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
                  JEHEKA CLASIFICADOS &copy; 2026
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Jeheka Clasificados" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "🔐 Tu clave de acceso a Jeheka Clasificados",
    html: html,
  });
};
