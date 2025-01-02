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
    const { query } = req.query;
    const filters = {
      categoryName: req.query.categoryName || null,
      minPrice: req.query.minPrice || null,
      maxPrice: req.query.maxPrice || null,
    };

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
      const products = await ProductModel.searchProducts(query, filters);
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error in search controller:", error);
      return res.status(500).json({ error: "Internal server error" });
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
    try {
      const product = await ProductModel.update(req.params.id, req.body);

      if (product) {
        // Actualizar las imágenes si se envían nuevas
        if (req.files && req.files.length > 0) {
          // Eliminar las imágenes existentes
          await ProductImageModel.deleteImagesByProductId(req.params.id);

          // Agregar las nuevas imágenes
          const images = req.files.map((file) => {
            return {
              productId: product.id,
              imageUrl: `uploads/images/${file.filename}`,
            };
          });
          await ProductImageModel.addImagesToProduct(images);
        }

        res.json(product);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
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
