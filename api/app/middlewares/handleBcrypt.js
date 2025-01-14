import bcrypt from "bcryptjs";
class HandleBcrypt {
  // Método para encriptar un texto plano
  static async encrypt(textPlain) {
    const hash = await bcrypt.hash(textPlain, 10);
    return hash;
  }

  // Método para comparar texto plano con un hash
  static async compare(passwordPlain, hashPassword) {
    return await bcrypt.compare(passwordPlain, hashPassword);
  }
}

export default HandleBcrypt;
