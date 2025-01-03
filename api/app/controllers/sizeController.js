// controllers/SizeController.js
import SizeModel from "../models/sizeModel.js";

class SizeController {
  static async getAll(req, res) {
    try {
      const sizes = await SizeModel.getAll();
      res.json(sizes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sizes" });
    }
  }

  static async getById(req, res) {
    try {
      const size = await SizeModel.getById(req.params.id);
      if (size) {
        res.json(size);
      } else {
        res.status(404).json({ error: "Size not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch size" });
    }
  }

  static async getByProduct(req, res) {
    try {
      const sizes = await SizeModel.getByProduct(req.params.id);
      if (sizes.length > 0) {
        res.json(sizes);
      } else {
        res.status(404).json({ error: "No sizes found for this product" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sizes for this product" });
    }
  }

  static async create(req, res) {
    try {
      const size = await SizeModel.create(req.body);
      res.status(201).json(size);
    } catch (error) {
      res.status(500).json({ error: "Failed to create size" });
    }
  }

  static async update(req, res) {
    try {
      const size = await SizeModel.update(req.params.id, req.body);
      if (size) {
        res.json(size);
      } else {
        res.status(404).json({ error: "Size not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update size" });
    }
  }

  static async delete(req, res) {
    try {
      const size = await SizeModel.delete(req.params.id);
      if (size) {
        res.json({ message: "Size deleted successfully" });
      } else {
        res.status(404).json({ error: "Size not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete size" });
    }
  }
}

export default SizeController;
