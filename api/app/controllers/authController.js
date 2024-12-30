import jwt from "jsonwebtoken";
import pool from "../../database/db.js";
import HandleBcrypt from "../middlewares/handleBcrypt.js";
import CartModel from "../models/cartModel.js";
import UserModel from "../models/userModel.js";
import UserService from "../services/userService.js";

class Auth {
  // Método para registrar un usuario
  static async register(req, res) {
    const client = await pool.connect();

    try {
      const { first_name, last_name, email, password, city, address, phone } =
        req.body;

      // Validar los datos del cuerpo de la solicitud
      if (!first_name || !last_name || !email || !password) {
        return res
          .status(400)
          .send({ error: "Todos los campos son obligatorios" });
      }

      // Encriptar la contraseña
      const passwordHash = await HandleBcrypt.encrypt(password);

      await client.query("BEGIN"); // Iniciar transacción

      // Crear el usuario en la base de datos
      const user = await UserModel.create(
        {
          first_name,
          last_name,
          email,
          password: passwordHash,
          city,
          address,
          phone,
        },
        client
      );

      // Crear el carrito asociado al usuario
      const cart = await CartModel.create(user.id, client);

      await client.query("COMMIT"); // Confirmar transacción

      // Enviar respuesta con los datos del usuario y el carrito
      res.status(201).send({
        user,
        cart,
      });
    } catch (error) {
      await client.query("ROLLBACK"); // Revertir transacción en caso de error

      console.error("Error al registrar el usuario:", error);

      // Manejo de errores para correo duplicado en PostgreSQL
      if (error.code === "23505") {
        return res
          .status(409)
          .send({ error: "El correo electrónico ya está registrado." });
      }

      res.status(500).send({ error: "Error al registrar el usuario" });
    } finally {
      client.release(); // Liberar el cliente
    }
  }

  // Método para iniciar sesión
  static async login(req, res) {
    const { email, password } = req.body;

    try {
      // Buscar el usuario por el email
      const user = await UserModel.getByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Verificar la contraseña
      const isPasswordValid = await HandleBcrypt.compare(
        password,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }

      // Verificar que JWT_SECRET esté definido
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET no está definido");
        return res.status(500).json({ message: "Error interno del servidor" });
      }

      // Generar el token con id y rol
      const token = jwt.sign(
        { id: user.id, rol: user.rol }, // Incluye el rol
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Responder con éxito y los datos necesarios
      return res.status(200).json({
        message: "Login exitoso",
        token,
        user: {
          id: user.id,
          email: user.email,
          rol: user.rol, // Incluye el rol en la respuesta
        },
      });
    } catch (error) {
      console.error("Error en login:", error); // Log del error
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // Método para cerrar sesión
  static async logout(req, res) {
    // Aquí no es necesario hacer nada en el servidor, solo devolvemos un mensaje
    return res.status(200).json({ message: "Logout exitoso" });
  }

  // Método para una ruta protegida
  static async protected(req, res) {
    return res.status(200).json({
      message: "Ruta protegida, usuario autorizado",
      userId: req.userId,
    });
  }

  static async getUserLogged(req, res) {
    try {
      const userId = req.userId; // Se obtiene del middleware
      const user = await UserModel.getById(userId); // Busca el usuario por su ID

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json(user); // Devuelve el usuario
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el usuario" });
    }
  }

  static async recoverPassword(req, res) {
    try {
      const { email } = req.body;

      // Buscar usuario por email
      const user = await UserModel.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Generar nueva contraseña
      const newPassword = await UserService.generateRandomPassword();

      // Encriptar y actualizar contraseña
      const hashedPassword = await UserService.encryptPassword(newPassword);
      await UserModel.updatePassword(user.id, hashedPassword);

      // Enviar correo con la nueva contraseña
      const subject = "Recuperación de contraseña";
      const message = `Hola ${user.nombre}, tu nueva contraseña es: ${newPassword} , inicia sesion y cambiala.`;
      await UserService.sendEmail(email, subject, message);

      res
        .status(200)
        .json({ message: "Correo enviado con la nueva contraseña" });
    } catch (error) {
      console.error("Error en recuperación de contraseña:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  static async changePass(req, res) {
    try {
      const { newPassword, id } = req.body;

      // Validación básica de entrada
      if (!newPassword || !id) {
        return res.status(400).json({ message: "Datos incompletos" });
      }

      const user = await UserModel.getUserById(id);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Encriptar nueva contraseña
      const hashedPassword = await UserService.encryptPassword(newPassword);

      // Actualizar contraseña en la base de datos
      await UserModel.updatePassword(id, hashedPassword);

      return res
        .status(200)
        .json({ message: "Contraseña cambiada exitosamente" });
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

export default Auth;
