// controllers/ProductController.js
import pool from "../../database/db.js";
import ProductImageModel from "../models/productImageModel.js";
import ProductModel from "../models/productModel.js";

class ProductController {
  static async getAll(req, res) {
    try {
      const products = await ProductModel.getAll();

      // Por cada producto, obtener las imágenes asociadas
      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          const images = await ProductImageModel.getByProductId(product.id);
          return {
            ...product,
            images: images,
          };
        })
      );

      res.json(productsWithImages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  // Obtener un producto por ID con sus imágenes asociadas
  static async getById(req, res) {
    try {
      const product = await ProductModel.getById(req.params.id);
      if (product) {
        // Obtener las imágenes asociadas al producto
        const images = await ProductImageModel.getByProductId(req.params.id);
        product.images = images;
        res.json(product);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  }

  static async search(req, res) {
    const { query, minPrice, maxPrice } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ error: "El parámetro 'query' es obligatorio" });
    }

    try {
      const filters = {
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
      };

      // Dividir la consulta en palabras clave
      const queryWords = query.trim().split(/\s+/); // Divide por espacios

      // Buscar productos con los filtros
      const products = await ProductModel.searchProducts(queryWords, filters);

      // Obtener las imágenes asociadas a cada producto
      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          const images = await ProductImageModel.getByProductId(product.id);
          return {
            ...product,
            images: images, // Agregar las imágenes al producto
          };
        })
      );

      // Devolver los productos con las imágenes asociadas
      return res.status(200).json(productsWithImages);
    } catch (error) {
      console.error("Error en el controlador de búsqueda:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async create(req, res) {
    const newProduct = req.body;
    const images = req.files; // Archivos subidos

    try {
      // Crear el producto
      const productId = await ProductModel.createProduct(newProduct);

      // Guardar las imágenes si existen
      if (images && images.length > 0) {
        const imageUrls = images.map((file) => `/uploads/${file.filename}`);
        await ProductImageModel.addProductImages(productId, imageUrls);
      }

      res.status(201).json({ id: productId, ...newProduct });
    } catch (error) {
      console.error("Error al crear el producto:", error);
      res.status(500).json({ message: "Error al crear el producto" });
    }
  }

  static async update(req, res) {
    const client = await pool.connect(); // Iniciar una transacción
    const { id } = req.params;
    console.log("Body: ", req.body);
    const { name, description, price, category_id, available } = req.body;
    const images = req.files; // Archivos de imágenes subidos

    try {
      await client.query("BEGIN"); // Iniciar la transacción

      // Paso 1: Actualizar el producto
      const updatedProduct = await ProductModel.updateProduct(
        id,
        { name, description, price, category_id, available },
        client
      );
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Paso 2: Eliminar las imágenes existentes
      await ProductImageModel.deleteImagesByProductId(id, client);

      // Paso 3: Agregar las nuevas imágenes
      if (images && images.length > 0) {
        const imageUrls = images.map(
          (file) => `/uploads/images/${file.filename}`
        );
        await ProductImageModel.addImagesToProduct(id, imageUrls, client);
      }

      await client.query("COMMIT"); // Confirmar la transacción

      // Responder con el producto actualizado
      res.json(updatedProduct);
    } catch (error) {
      await client.query("ROLLBACK"); // Revertir la transacción en caso de error
      console.error("Error al actualizar el producto:", error);
      res.status(500).json({ error: "Failed to update product" });
    } finally {
      client.release(); // Liberar el cliente de la conexión
    }
  }

  static async delete(req, res) {
    try {
      const product = await ProductModel.delete(req.params.id);
      if (product) {
        // Eliminar las imágenes asociadas al producto
        await ProductImageModel.deleteImagesByProductId(req.params.id);
        res.json({ message: "Product deleted successfully" });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  }

  static async available(req, res) {
    try {
      const product = await ProductModel.available(req.params.id);
      if (product) {
        // Eliminar las imágenes asociadas al producto
        await ProductImageModel.deleteImagesByProductId(req.params.id);
        res.json({ message: "Product inavailable successfully" });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to inavailable product" });
    }
  }
}

export default ProductController;
