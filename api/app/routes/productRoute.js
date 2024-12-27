// routes/productRoutes.js
import express from "express";
import ProductController from "../controllers/productController.js";
import UploadMiddleware from "../middlewares/uploadMiddleware.js";
import ProductImageController from "../models/productImageModel.js";

const router = express.Router();

router.get("/", ProductController.getAll); // Obtener todos los productos
router.get("/:id", ProductController.getById); // Obtener producto por ID
router.post("/", ProductController.create, UploadMiddleware.array("images", 5)); // Crear nuevo producto
router.put(
  "/:id",
  ProductController.update,
  UploadMiddleware.array("images", 5)
); // Actualizar producto
router.delete("/:id", ProductController.delete); // Eliminar producto
router.patch("/:id/available", ProductController.available); // Cambiar disponibilidad

router.get("/images/:productId", ProductImageController.getByProductId);

export default router;
