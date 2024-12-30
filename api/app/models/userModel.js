import pool from "../../database/db.js";

class UserModel {
  static async getAll() {
    const { rows } = await pool.query("SELECT * FROM users");
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return rows[0];
  }

  static async getByEmail(email) {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return rows[0];
  }

  static async create(data, client = pool) {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
    const query = `INSERT INTO users (${columns}) VALUES (${placeholders}) RETURNING *`;

    const { rows } = await client.query(query, values);
    return rows[0];
  }

  static async update(id, data) {
    const columns = Object.keys(data);
    const setClause = columns
      .map((col, index) => `${col} = $${index + 1}`)
      .join(", ");
    const values = [...Object.values(data), id];
    const query = `UPDATE users SET ${setClause} WHERE id = $${
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
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );
    return rows[0];
  }
}

export default UserModel;
