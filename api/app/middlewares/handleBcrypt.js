import bcrypt from "bcryptjs";
class HandleBcrypt {
  // Método para encriptar un texto plano
  static async encrypt(textPlain) {
    const hash = await bcrypt.hash(textPlain, 10); // Salto de 10 rondas
    return hash;
  }

  // Método para comparar texto plano con un hash
  static async compare(passwordPlain, hashPassword) {
    return await bcrypt.compare(passwordPlain, hashPassword);
  }
}

module.exports = HandleBcrypt;
