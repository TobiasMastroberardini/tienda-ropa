// models/ProductImageModel.js
import pool from "../../database/db.js";

class ProductImageModel {
  static async getAll() {
    const { rows } = await pool.query("SELECT * FROM product_images");
    return rows;
  }

  static async getByProductId(productId) {
    const { rows } = await pool.query(
      "SELECT * FROM product_images WHERE product_id = $1",
      [productId]
    );
    return rows;
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

  static async delete(id) {
    const { rows } = await pool.query(
      "DELETE FROM product_images WHERE id = $1 RETURNING *",
      [id]
    );
    return rows[0];
  }

  static async deleteImagesByProductId(id) {
    const { rows } = await pool.query(
      "DELETE FROM product_images WHERE product_id = $1 RETURNING *",
      [id]
    );
    return rows[0];
  }
}

export default ProductImageModel;
