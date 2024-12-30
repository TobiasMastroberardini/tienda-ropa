import jwt from "jsonwebtoken";
class authMiddleware {
  static async verifyToken(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(403).json({ message: "Token no proporcionado" });
    }

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token inválido" });
      }

      req.userId = decoded.id; // Almacena el id del usuario
      req.rol = decoded.rol; // Almacena el rol del usuario
      next(); // Pasa el control a la siguiente función
    });
  }

  static async isAdmin(req, res, next) {
    if (req.rol !== "admin") {
      return res
        .status(403)
        .json({ message: "Acceso denegado: No eres administrador" });
    }
    next(); // Continúa si el usuario es administrador
  }

  static async validateEmail(req, res, next) {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Correo electrónico inválido" });
    }

    next();
  }
}
export default authMiddleware;
