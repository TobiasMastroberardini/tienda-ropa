// models/CartModel.js
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

  static async create({ user_id }) {
    const query = `
      INSERT INTO cart (user_id)
      VALUES ($1)
      RETURNING *;
    `;
    try {
      const { rows } = await pool.query(query, [user_id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
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
