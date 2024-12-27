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
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const query = `INSERT INTO product (${columns}) VALUES (${placeholders}) RETURNING id`;

    try {
      const { rows } = await pool.query(query, values);
      return rows[0].id;
    } catch (error) {
      throw error;
    }
  }

  static async addProductImages(productId, imageUrls) {
    const values = imageUrls
      .map((url, index) => `($1, $${index + 2})`)
      .join(", ");
    const query = `INSERT INTO product_images (product_id, image_url) VALUES ${values}`;

    try {
      await pool.query(query, [productId, ...imageUrls]);
    } catch (error) {
      throw error;
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
