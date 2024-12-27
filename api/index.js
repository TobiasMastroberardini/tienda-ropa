import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath to get the current filename

import cartItemRoutes from "./app/routes/cartItemRoutes.js";
import cartRoutes from "./app/routes/cartRoutes.js";
import orderItemRoutes from "./app/routes/orderItemRoutes.js";
import orderRoutes from "./app/routes/orderRoutes.js";
// import productImageRoutes from "./app/routes/productImageRoutes.js";
import productRoutes from "./app/routes/productRoute.js";
import userRoutes from "./app/routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:4200", // Permite solicitudes solo desde tu frontend
  })
);
// Define __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Get directory name from the filename

app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/cart_items", cartItemRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/sizes", sizeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order_items", orderItemRoutes);

// Serve static files from uploads/images
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);

// app.use("/api/product_images", productImageRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
