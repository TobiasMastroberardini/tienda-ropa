// routes/productRoutes.js
import express from "express";
import ProductController from "../controllers/productController.js";
import UploadMiddleware from "../middlewares/uploadMiddleware.js";
import ProductImageController from "../models/productImageModel.js";

const router = express.Router();

router.get("/", ProductController.getAll); // Obtener todos los productos
router.get("/search", ProductController.search);

router.get("/:id", ProductController.getById); // Obtener producto por ID

router.post(
  "/",
  UploadMiddleware.array("images", 5), // Permitir hasta 5 imágenes por producto
  ProductController.create
); // Crear nuevo producto

router.put(
  "/:id",
  UploadMiddleware.array("images", 5),
  ProductController.update
); // Actualizar producto
router.delete("/:id", ProductController.delete); // Eliminar producto
router.patch("/:id/available", ProductController.available); // Cambiar disponibilidad

router.get("/images/:productId", ProductImageController.getByProductId);

export default router;
