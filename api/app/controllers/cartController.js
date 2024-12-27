// controllers/CartController.js
import CartModel from "../models/cartModel.js";

class CartController {
  static async getAll(req, res) {
    try {
      const carts = await CartModel.getAll();
      res.json(carts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch carts" });
    }
  }

  static async getById(req, res) {
    try {
      const cart = await CartModel.getById(req.params.id);
      if (cart) {
        res.json(cart);
      } else {
        res.status(404).json({ error: "Cart not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  }

  static async getByUserId(req, res) {
    try {
      const cart = await CartModel.getUserById(req.params.id);
      if (cart) {
        res.json(cart);
      } else {
        res.status(404).json({ error: "Cart not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  }

  static async create(req, res) {
    try {
      const cart = await CartModel.create(req.body);
      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ error: "Failed to create cart" });
    }
  }

  static async delete(req, res) {
    try {
      const cart = await CartModel.delete(req.params.id);
      if (cart) {
        res.json({ message: "Cart deleted successfully" });
      } else {
        res.status(404).json({ error: "Cart not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete cart" });
    }
  }
}

export default CartController;
