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
      res.json(cartItems);
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
    const { id } = req.params;
    const updatedData = req.body;

    // Validación del ID
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    if (typeof updatedData.quantity !== "number" || updatedData.quantity < 0) {
      return res
        .status(400)
        .json({ message: "Cantidad debe ser un número no negativo" });
    }

    try {
      const result = await CartItemModel.updateItemQuantity(
        id,
        updatedData.quantity
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Item no encontrado" });
      }

      return res.json({ message: "Item actualizado", data: updatedData });
    } catch (error) {
      console.error("Error al actualizar item:", error);
      return res.status(500).json({
        error: "Error interno del servidor. No se pudo actualizar el item.",
      });
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
