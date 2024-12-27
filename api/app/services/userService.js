import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

class UserService {
  // Generar una contraseña aleatoria
  static async generateRandomPassword() {
    return Math.random().toString(36).slice(-8); // Genera una contraseña aleatoria
  }

  // Encriptar la contraseña
  static async encryptPassword(password) {
    return await bcrypt.hash(password, 10); // Encripta la contraseña con bcrypt
  }

  // Configurar el transporte de correo
  static getTransporter() {
    return nodemailer.createTransport({
      host: "smtp.gmail.com", // Cambia esto según tu proveedor SMTP
      port: 587, // Cambia si usas otro puerto
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.EMAIL_USER, // Credenciales
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Enviar un correo
  static async sendEmail(email, subject, message) {
    try {
      const transporter = this.getTransporter();

      const mailOptions = {
        from: `"Soporte" <${process.env.EMAIL_USER}>`, // Opcional: personaliza el nombre del remitente
        to: email,
        subject: subject,
        text: message, // Mensaje en texto plano
        html: `<p>${message}</p>`, // Opcional: si quieres un mensaje con formato HTML
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Correo enviado:", info.messageId);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      throw new Error("No se pudo enviar el correo."); // Lanza el error para manejo posterior
    }
  }

  static async comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = UserService;
