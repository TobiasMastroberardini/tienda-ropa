import CategoryModel from "../models/categoryModel.js";

class CategoryController {
  // Obtener todas las categorías
  static async getCategories(req, res) {
    try {
      const categories = await CategoryModel.getAll();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Obtener una categoría por id
  static async getCategory(req, res) {
    const { id } = req.params;
    try {
      const category = await CategoryModel.getById(id);
      if (!category) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
      res.json(category);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async createCategory(req, res) {
    try {
      console.log("Body:", req.body);
      console.log("Files:", req.files);

      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const images = req.files;
      const imageUrls = images
        ? images.map((file) => `/uploads/${file.filename}`)
        : [];

      const data = {
        name,
        image_url: imageUrls[0] || null,
      };

      const id = await CategoryModel.createCategory(data);
      res.status(201).json({ id, imageUrls });
    } catch (err) {
      console.error("Error:", err);
      res.status(400).json({ message: err.message });
    }
  }

  // Actualizar una categoría existente
  static async updateCategory(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    const data = { name };

    try {
      const updatedCategory = await CategoryModel.updateCategory(id, data);
      if (!updatedCategory) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
      res.json(updatedCategory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Eliminar una categoría
  static async deleteCategory(req, res) {
    const { id } = req.params;
    try {
      const deletedCategory = await CategoryModel.delete(id);
      if (!deletedCategory) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
      res.status(204).end(); // 204 No Content
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default CategoryController;
