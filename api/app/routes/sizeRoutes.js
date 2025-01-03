// routes/sizeRoutes.js
import express from "express";
import SizeController from "../controllers/sizeController.js";

const router = express.Router();

router.get("/", SizeController.getAll);
router.get("/product/:id", SizeController.getByProduct); // Obtiene los tamaños de un producto
router.get("/:id", SizeController.getById);
router.post("/", SizeController.create);
router.put("/:id", SizeController.update);
router.delete("/:id", SizeController.delete);

export default router;
