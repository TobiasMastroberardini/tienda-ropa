// models/SizeModel.js
import pool from "../../database/db.js";

class SizeModel {
  static async getAll() {
    const { rows } = await pool.query("SELECT * FROM size");
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query("SELECT * FROM size WHERE id = $1", [id]);
    return rows[0];
  }

  static async getByProduct(productId) {
    const { rows } = await pool.query(
      `SELECT s.id, s.name 
       FROM size s
       JOIN product_size ps ON s.id = ps.size_id
       WHERE ps.product_id = $1`,
      [productId]
    );
    return rows;
  }

  static async create(data) {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
    const query = `INSERT INTO size (${columns}) VALUES (${placeholders}) RETURNING *`;

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    const columns = Object.keys(data);
    const setClause = columns
      .map((col, index) => `${col} = $${index + 1}`)
      .join(", ");
    const values = [...Object.values(data), id];
    const query = `UPDATE size SET ${setClause} WHERE id = $${
      columns.length + 1
    } RETURNING *`;

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const { rows } = await pool.query(
      "DELETE FROM size WHERE id = $1 RETURNING *",
      [id]
    );
    return rows[0];
  }
}

export default SizeModel;
