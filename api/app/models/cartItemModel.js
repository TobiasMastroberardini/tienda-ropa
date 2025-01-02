import pool from "../../database/db.js";

class CartItemModel {
  static async getAll() {
    const query = `
    SELECT 
      cart_items.*,
      product.name AS product_name
    FROM cart_items
    INNER JOIN product ON cart_items.product_id = product.id
  `;
    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("Error fetching all cart items:", error);
      throw error;
    }
  }

  static async getByCartId(cartId) {
    const query = `
    SELECT 
      cart_items.*,
      product.name AS product_name
    FROM cart_items
    INNER JOIN product ON cart_items.product_id = product.id
    WHERE cart_items.cart_id = $1
  `;
    try {
      const { rows } = await pool.query(query, [cartId]);
      return rows;
    } catch (error) {
      console.error("Error fetching cart items by cart ID:", error);
      throw error;
    }
  }

  static async getById(id) {
    const query = `
    SELECT 
      cart_items.*,
      product.name AS product_name
    FROM cart_items
    INNER JOIN product ON cart_items.product_id = product.id
    WHERE cart_items.id = $1
  `;
    try {
      const { rows } = await pool.query(query, [id]);
      return rows[0]; // Devuelve solo el primer resultado
    } catch (error) {
      console.error("Error fetching cart item by ID:", error);
      throw error;
    }
  }

  static async create(data) {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
    const query = `INSERT INTO cart_items (${columns}) VALUES (${placeholders}) RETURNING *`;

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
    const query = `UPDATE cart_items SET ${setClause} WHERE id = $${
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
      "DELETE FROM cart_items WHERE id = $1 RETURNING *",
      [id]
    );
    return rows[0];
  }
}

export default CartItemModel;
