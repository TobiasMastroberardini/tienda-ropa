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

  // Crear una nueva categoría
  static async createCategory(req, res) {
    const { name, image_url } = req.body;
    const data = { name, image_url };

    try {
      const id = await CategoryModel.createCategory(data);
      res.status(201).json({ id });
    } catch (err) {
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
