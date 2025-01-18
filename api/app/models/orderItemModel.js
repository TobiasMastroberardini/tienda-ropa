import pool from "../../database/db.js";

class OrderItemModel {
  static async getAll() {
    const { rows } = await pool.query("SELECT * FROM order_items");
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM order_items WHERE id = $1",
      [id]
    );
    return rows[0];
  }

  static async create({ order_id, product_id, quantity, price }) {
    if (
      !order_id ||
      !product_id ||
      quantity === undefined ||
      price === undefined
    ) {
      throw new Error(
        `Parámetros inválidos: order_id=${order_id}, product_id=${product_id}, quantity=${quantity}, price=${price}`
      );
    }

    const query = `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ($1, $2, $3, $4)
    `;

    try {
      await pool.query(query, [order_id, product_id, quantity, price]);
    } catch (error) {
      console.error("Error al insertar en order_items:", error);
      throw error;
    }
  }

  static async update(id, data) {
    const columns = Object.keys(data);
    const setClause = columns
      .map((col, index) => `${col} = $${index + 1}`)
      .join(", ");
    const values = [...Object.values(data), id];
    const query = `UPDATE order_items SET ${setClause} WHERE id = $${
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
      "DELETE FROM order_items WHERE id = $1 RETURNING *",
      [id]
    );
    return rows[0];
  }
}

export default OrderItemModel;
