import express from "express";
import {
  createPayment,
  paymentSuccess,
} from "../controllers/paymentController.js";

const router = express.Router();

// Ruta para crear una preferencia de pago
router.post("/new", createPayment);
router.get("/success", paymentSuccess);

export default router;
