import pool from "../../database/db.js";

class CartModel {
  static async getAll() {
    const query = "SELECT * FROM cart";
    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    const query = "SELECT * FROM cart WHERE id = $1";
    try {
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByUserId(id) {
    const query = "SELECT * FROM cart WHERE user_id = $1";
    try {
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getCartIdByuserId(user_id) {
    try {
      const result = await pool.query(
        "SELECT id FROM cart WHERE user_id = $1 LIMIT 1",
        [user_id]
      );
      return result.rows[0]; // Retorna el primer resultado (el ID del carrito)
    } catch (error) {
      throw error;
    }
  }

  static async create(user_id, client = pool) {
    if (!user_id || typeof user_id !== "number") {
      throw new Error("El ID del usuario debe ser un número válido.");
    }

    const query = `
    INSERT INTO cart (user_id)
    VALUES ($1)
    RETURNING *;
  `;

    const { rows } = await client.query(query, [user_id]);
    return rows[0];
  }

  static async delete(id) {
    const query = `
      DELETE FROM cart
      WHERE id = $1
      RETURNING *;
    `;
    try {
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

export default CartModel;
