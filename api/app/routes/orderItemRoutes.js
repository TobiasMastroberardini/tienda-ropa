// routes/orderItemRoutes.js
import express from "express";
import OrderItemController from "../controllers/orderItemController.js";

const router = express.Router();

router.get("/", OrderItemController.getAll);
router.get("/:id", OrderItemController.getById);
router.post("/", OrderItemController.create);
router.put("/:id", OrderItemController.update);
router.delete("/:id", OrderItemController.delete);

export default router;
