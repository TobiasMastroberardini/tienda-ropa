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

  static async addImagesToProduct(images) {
    const query = `INSERT INTO product_images (product_id, image_url) VALUES ($1, $2) RETURNING *`;

    try {
      for (const image of images) {
        await pool.query(query, [image.product_id, image.image_url]);
        console.log("Imagen insertada:", image);
      }
    } catch (error) {
      console.error("Error al insertar imágenes:", error);
      throw new Error("Failed to insert images into database");
    }
  }

  static async delete(id) {
    const { rows } = await pool.query(
      "DELETE FROM product_images WHERE id = $1 RETURNING *",
      [id]
    );
    return rows[0];
  }
}

export default ProductImageModel;
