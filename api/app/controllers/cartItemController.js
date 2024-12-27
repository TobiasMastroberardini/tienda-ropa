// controllers/CartItemController.js
import CartItemModel from "../models/cartItemModel.js";

class CartItemController {
  static async getAll(req, res) {
    try {
      const cartItems = await CartItemModel.getAll();
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  }

  static async getById(req, res) {
    try {
      const cartItem = await CartItemModel.getById();
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart item" });
    }
  }

  static async getByCartId(req, res) {
    try {
      const cartItems = await CartItemModel.getByCartId(req.params.cartId);
      if (cartItems.length > 0) {
        res.json(cartItems);
      } else {
        res.status(404).json({ error: "No items found for this cart" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  }

  static async create(req, res) {
    try {
      const cartItem = await CartItemModel.create(req.body);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to create cart item" });
    }
  }

  static async update(req, res) {
    try {
      const cartItem = await CartItemModel.update(req.params.id, req.body);
      if (cartItem) {
        res.json(cartItem);
      } else {
        res.status(404).json({ error: "Cart item not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart item" });
    }
  }

  static async delete(req, res) {
    try {
      const cartItem = await CartItemModel.delete(req.params.id);
      if (cartItem) {
        res.json({ message: "Cart item deleted successfully" });
      } else {
        res.status(404).json({ error: "Cart item not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete cart item" });
    }
  }
}

export default CartItemController;
