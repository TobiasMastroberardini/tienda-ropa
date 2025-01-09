import pool from "../../database/db.js";

class ProductModel {
  static async getAll() {
    const { rows } = await pool.query(`
    SELECT p.*, c.name AS category_name 
    FROM product p
    LEFT JOIN category c ON p.category_id = c.id
  `);
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
    SELECT p.*, c.name AS category_name 
    FROM product p
    LEFT JOIN category c ON p.category_id = c.id
    WHERE p.id = $1
  `,
      [id]
    );
    return rows[0];
  }

  static async searchProducts(queryWords, filters = {}) {
    const { minPrice, maxPrice } = filters;

    // Construir la cláusula WHERE dinámica para cada palabra clave
    let searchConditions = queryWords
      .map((word, index) => {
        return `
            (LOWER(p.name) LIKE LOWER($${index + 1}) 
            OR LOWER(p.description) LIKE LOWER($${index + 1}) 
            OR LOWER(c.name) ILIKE LOWER($${index + 1}))
        `;
      })
      .join(" AND ");

    const values = queryWords.map((word) => `%${word}%`); // Buscar cada palabra

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
        ${searchConditions}
        AND ($${values.length + 1}::numeric IS NULL OR p.price >= $${
      values.length + 1
    })
        AND ($${values.length + 2}::numeric IS NULL OR p.price <= $${
      values.length + 2
    })
    ORDER BY p.name ASC;
    `;

    // Agregar filtros de precio al final de los valores
    values.push(minPrice || null, maxPrice || null);

    try {
      const { rows } = await pool.query(sql, values);
      // Devuelve los productos con la imagen asociada
      return rows.map((product) => ({
        ...product,
        images: [{ image_url: product.product_image_url }], // Asegurarse de que 'images' es un array
      }));
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
    const updates = Object.entries(data)
      .map(([key, _], index) => `${key} = $${index + 1}`)
      .join(", ");
    const values = [...Object.values(data), id];

    const query = `UPDATE product SET ${updates} WHERE id = $${values.length}`;

    try {
      const { rowCount } = await pool.query(query, values);
      return rowCount;
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

  static async getPricesByIds(productIds) {
    try {
      // Convertir el array de IDs en una lista separada por comas para la consulta SQL
      const query = `
        SELECT id, price
        FROM product
        WHERE id = ANY($1::int[])
      `;
      const values = [productIds];

      const result = await pool.query(query, values);
      return result.rows; // Devuelve un array de objetos [{ id: 1, price: 100 }, ...]
    } catch (error) {
      console.error("Error al obtener precios de los productos:", error);
      throw new Error("Error al obtener precios de los productos");
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
