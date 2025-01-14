import pool from "../../database/db.js"; // Asumiendo que `pool` está configurado de esta forma

class CategoryModel {
  // Obtener todas las categorías
  static async getAll() {
    const { rows } = await pool.query("SELECT * FROM category");
    return rows;
  }

  // Obtener una categoría por id
  static async getById(id) {
    const { rows } = await pool.query("SELECT * FROM category WHERE id = $1", [
      id,
    ]);
    return rows[0];
  }

  static async getCategoryByCondition(conditions) {
    try {
      let query = "SELECT * FROM category";
      const values = [];

      if (Object.keys(conditions).length > 0) {
        const whereClauses = Object.entries(conditions).map(
          ([key, value], index) => {
            if (typeof value === "string" && key === "name") {
              values.push(value);
              return `${key} LIKE $${index + 1}`;
            }
            values.push(value);
            return `${key} = $${index + 1}`;
          }
        );
        query += " WHERE " + whereClauses.join(" AND ");
      }

      const { rows } = await pool.query(query, values);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Crear una nueva categoría
  static async createCategory(data) {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const query = `INSERT INTO category (${columns}) VALUES (${placeholders}) RETURNING id`;

    try {
      const { rows } = await pool.query(query, values);
      return rows[0].id;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar una categoría existente
  static async updateCategory(id, data) {
    const columns = Object.keys(data);
    const setClause = columns
      .map((col, index) => `${col} = $${index + 1}`)
      .join(", ");
    const values = [...Object.values(data), id];

    const query = `UPDATE category SET ${setClause} WHERE id = $${values.length} RETURNING *`;

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Eliminar una categoría
  static async delete(id) {
    const { rows } = await pool.query(
      "DELETE FROM category WHERE id = $1 RETURNING *",
      [id]
    );
    return rows[0];
  }

  static async deleteCategoryImage(id) {
    const query = "UPDATE category SET image_url = NULL WHERE id = $1";

    try {
      await pool.query(query, [id]);
    } catch (error) {
      throw error;
    }
  }
}

export default CategoryModel;
