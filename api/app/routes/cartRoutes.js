import express from "express";
import CartController from "../controllers/cartController.js";

const router = express.Router();

router.get("/", CartController.getAll);
router.get("/:id", CartController.getById);
router.get("/user/:id", CartController.getByUserId);
router.post("/", CartController.create);
router.delete("/:id", CartController.delete);

export default router;
