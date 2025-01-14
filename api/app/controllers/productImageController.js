import upload from "../../config/multer.js";
import ProductImageModel from "../models/productImageModel.js";

class ProductImageController {
  // Obtener todas las imágenes de un producto
  static async getByProductId(req, res) {
    try {
      const images = await ProductImageModel.getByProductId(
        req.params.productId
      );
      if (images.length > 0) {
        res.json(images);
      } else {
        res.status(404).json({ error: "No images found for this product" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch images" });
    }
  }

  // Subir una imagen a un producto
  static async uploadImage(req, res) {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      try {
        const productId = req.body.productId;
        const imageUrl = `uploads/images/${req.file.filename}`; // Ruta de la imagen guardada
        const image = await ProductImageModel.addImageToProduct(
          productId,
          imageUrl
        );
        res.status(201).json(image);
      } catch (error) {
        res.status(500).json({ error: "Failed to add image" });
      }
    });
  }

  // Eliminar todas las imágenes de un producto
  static async deleteImages(req, res) {
    try {
      const productId = req.params.productId;
      await ProductImageModel.deleteImagesByProductId(productId);
      res.json({ message: "Images deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete images" });
    }
  }
}

export default ProductImageController;
