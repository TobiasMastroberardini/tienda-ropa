import express from "express";
import CategoryController from "../controllers/categoryController.js";
import UploadMiddleware from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Obtener todas las categorías
router.get("/", CategoryController.getCategories);

router.get("/filter", CategoryController.getByFilter);

// Obtener una categoría por id
router.get("/:id", CategoryController.getCategory);

// Crear una nueva categoría
router.post(
  "/",
  UploadMiddleware.array("images", 1), // Permitir hasta 5 imágenes por producto
  CategoryController.createCategory
);

// Actualizar una categoría existente
router.put(
  "/:id",
  UploadMiddleware.array("images", 1),
  CategoryController.updateCategory
);

// Eliminar una categoría
router.delete("/:id", CategoryController.deleteCategory);

export default router;
