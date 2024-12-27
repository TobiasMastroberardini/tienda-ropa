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

  static async create(req, res) {
    try {
      console.log("Inicio del método create");

      const productData = req.body;
      console.log("Datos del producto recibidos:", productData);

      // Crear el producto principal
      const productId = await ProductModel.createProduct(productData);
      console.log("Producto creado con ID:", productId);

      // Si hay imágenes, agregarlas a la tabla product_images
      if (req.files && req.files.length > 0) {
        const images = req.files.map((file) => ({
          product_id: productId,
          image_url: file.path, // La ruta del archivo guardado
        }));

        console.log("Imágenes para insertar:", images);

        await ProductImageModel.addImagesToProduct(images);
        console.log("Imágenes insertadas correctamente");
      }

      res.status(201).json({ id: productId, ...productData });
    } catch (error) {
      console.error("Error en el método create:", error);
      res.status(500).json({ error: "Failed to create product" });
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
