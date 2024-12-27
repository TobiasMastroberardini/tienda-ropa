import express from "express";
import CartItemController from "../controllers/cartItemController.js";

const router = express.Router();

router.get("/", CartItemController.getAll);
router.get("/:id", CartItemController.getById);
router.get("/cart/:cartId", CartItemController.getByCartId);
router.post("/", CartItemController.create);
router.put("/:id", CartItemController.update);
router.delete("/:id", CartItemController.delete);

export default router;
