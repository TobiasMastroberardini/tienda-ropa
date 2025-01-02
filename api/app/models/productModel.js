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

  static async searchProducts(query, filters = {}) {
    const { minPrice, maxPrice } = filters;

    const sql = `
    SELECT 
        p.id,
        p.name,
        p.price,
        p.description,
        p.available,
        p.category_id,
        c.name AS category_name,
        (
            SELECT image_url 
            FROM product_images 
            WHERE product_images.product_id = p.id 
            LIMIT 1
        ) AS product_image_url
    FROM product p
    LEFT JOIN category c ON p.category_id = c.id
    WHERE 
        (LOWER(p.name) LIKE LOWER($1) OR LOWER(p.description) LIKE LOWER($1) OR LOWER(c.name) ILIKE LOWER($1)) -- Busca en nombre, descripción y categoría
        AND ($2::numeric IS NULL OR p.price >= $2)
        AND ($3::numeric IS NULL OR p.price <= $3)
    ORDER BY p.name ASC;
  `;

    const values = [
      `%${query}%`, // Coincidencia parcial en nombre, descripción o categoría
      minPrice || null, // Filtro opcional por precio mínimo
      maxPrice || null, // Filtro opcional por precio máximo
    ];

    try {
      const { rows } = await pool.query(sql, values);
      return rows;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
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
