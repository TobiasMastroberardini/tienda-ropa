import express from "express";
import CategoryController from "../controllers/categoryController.js";

const router = express.Router();

// Obtener todas las categorías
router.get("/", CategoryController.getCategories);

// Obtener una categoría por id
router.get("/:id", CategoryController.getCategory);

// Crear una nueva categoría
router.post("/", CategoryController.createCategory);

// Actualizar una categoría existente
router.put("/:id", CategoryController.updateCategory);

// Eliminar una categoría
router.delete("/:id", CategoryController.deleteCategory);

export default router;
