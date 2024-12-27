// routes/orderRoutes.js
import express from "express";
import OrderController from "../controllers/orderController.js";

const router = express.Router();

router.get("/", OrderController.getAll);
router.get("/:id", OrderController.getById);
router.post("/", OrderController.create);
router.put("/:id", OrderController.update);
router.delete("/:id", OrderController.delete);

export default router;
