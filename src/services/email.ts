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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a Jeheka Clasificados</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; }
        .content { padding: 40px; line-height: 1.6; }
        .welcome-text { font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #020617; }
        .password-box { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .password-label { font-size: 12px; font-weight: 800; color: #64748b; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
        .password-value { font-family: monospace; font-size: 24px; color: #10b981; font-weight: bold; }
        .notice { font-size: 13px; color: #64748b; font-style: italic; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
        .btn { display: inline-block; background: #10b981; color: white !important; text-decoration: none; padding: 14px 28px; border-radius: 9999px; font-weight: bold; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div className="container">
        <div className="header">
          <h1>JEHEKA CLASIFICADOS</h1>
        </div>
        <div className="content">
          <p className="welcome-text">¡Hola ${name}!</p>
          <p>Tu cuenta ha sido creada exitosamente en el portal de clasificados más importante de Paraguay.</p>
          <p>Para ingresar por primera vez, utiliza la siguiente <strong>contraseña temporal</strong> generada por el sistema:</p>
          
          <div className="password-box">
            <div className="password-label">Contraseña Temporal</div>
            <div className="password-value">${tempPassword}</div>
          </div>
          
          <center>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" className="btn">INGRESAR AHORA</a>
          </center>

          <p className="notice">
            * Por razones de seguridad, se te pedirá cambiar esta contraseña inmediatamente después de tu primer ingreso.
          </p>
        </div>
        <div className="header" style="height: 4px; padding: 0;"></div>
        <div className="footer">
          &copy; 2026 Jeheka Clasificados. Todos los derechos reservados.
        </div>
      </div>
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
