// controllers/ProductController.js
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
    const { id } = req.params;
    const updatedData = req.body; // Datos enviados en la solicitud
    const images = req.files; // Imágenes cargadas (si las hay)
    console.log(updatedData);
    try {
      // Validar ID del producto
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID del producto no válido" });
      }

      // Actualizar los datos del producto
      const affectedRows = await ProductModel.updateProduct(id, updatedData);

      if (affectedRows === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      // Manejar imágenes si se han enviado
      if (images && Array.isArray(images) && images.length > 0) {
        // Obtener las rutas de las nuevas imágenes
        const imageUrls = images.map((file) => `/uploads/${file.filename}`);

        // Eliminar imágenes existentes del producto
        await ProductImageModel.deleteProductImages(id);

        // Insertar nuevas imágenes
        await ProductImageModel.addProductImages(id, imageUrls);
      }

      res.status(200).json({ message: "Producto actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar el producto:", error);

      res.status(500).json({
        message: "Error al actualizar el producto",
        error: error.message,
      });
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
