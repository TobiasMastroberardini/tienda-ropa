import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./app/routes/authRoutes.js";
import cartItemRoutes from "./app/routes/cartItemRoutes.js";
import cartRoutes from "./app/routes/cartRoutes.js";
import categoryRoutes from "./app/routes/categoryRoutes.js";
import orderItemRoutes from "./app/routes/orderItemRoutes.js";
import orderRoutes from "./app/routes/orderRoutes.js";
import paymentRoutes from "./app/routes/paymentRoutes.js";
import productRoutes from "./app/routes/productRoute.js";
import sizeRoutes from "./app/routes/sizeRoutes.js";
import userRoutes from "./app/routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Añade métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Añade headers permitidos
  })
);

// Obtener el nombre del archivo actual
const __filename = fileURLToPath(import.meta.url);

// Obtener el directorio del archivo actual
const __dirname = dirname(__filename);

app.get("/", (req, res) => {
  res.send("Hola, el servidor está funcionando!");
});

app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/cart_items", cartItemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sizes", sizeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order_items", orderItemRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

// Serve static files from uploads
app.use("/api/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
