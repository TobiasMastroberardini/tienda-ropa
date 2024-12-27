import pool from "../../database/db.js";

class ProductModel {
  static async getAll() {
    const { rows } = await pool.query("SELECT * FROM product");
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query("SELECT * FROM product WHERE id = $1", [
      id,
    ]);
    return rows[0];
  }

  static async createProduct(data) {
    const { images, ...productData } = data; // Excluye las imágenes del producto
    const columns = Object.keys(productData).join(", ");
    const values = Object.values(productData);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const query = `INSERT INTO product (${columns}) VALUES (${placeholders}) RETURNING id`;

    try {
      const { rows } = await pool.query(query, values);
      return rows[0].id; // Devuelve el ID del producto insertado
    } catch (error) {
      console.error("Error al insertar producto:", error);
      throw new Error("Failed to insert product into database");
    }
  }

  static async updateProduct(id, data) {
    const columns = Object.keys(data);
    const setClause = columns
      .map((col, index) => `${col} = $${index + 1}`)
      .join(", ");
    const values = [...Object.values(data), id];

    const query = `UPDATE product SET ${setClause} WHERE id = $${
      columns.length + 1
    } RETURNING *`;

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async available(id) {
    const query = `
      UPDATE product
      SET available = NOT available
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

  static async delete(id) {
    const { rows } = await pool.query(
      "DELETE FROM product WHERE id = $1 RETURNING *",
      [id]
    );
    return rows[0];
  }
}

export default ProductModel;
