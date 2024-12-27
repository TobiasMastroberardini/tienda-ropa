// controllers/OrderItemController.js
import OrderItemModel from "../models/orderItemModel.js";

class OrderItemController {
  static async getAll(req, res) {
    try {
      const orderItems = await OrderItemModel.getAll();
      res.json(orderItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order items" });
    }
  }

  static async getById(req, res) {
    try {
      const orderItem = await OrderItemModel.getById(req.params.id);
      if (orderItem) {
        res.json(orderItem);
      } else {
        res.status(404).json({ error: "Order item not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order item" });
    }
  }

  static async create(req, res) {
    try {
      const orderItem = await OrderItemModel.create(req.body);
      res.status(201).json(orderItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to create order item" });
    }
  }

  static async update(req, res) {
    try {
      const orderItem = await OrderItemModel.update(req.params.id, req.body);
      if (orderItem) {
        res.json(orderItem);
      } else {
        res.status(404).json({ error: "Order item not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update order item" });
    }
  }

  static async delete(req, res) {
    try {
      const orderItem = await OrderItemModel.delete(req.params.id);
      if (orderItem) {
        res.json({ message: "Order item deleted successfully" });
      } else {
        res.status(404).json({ error: "Order item not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete order item" });
    }
  }
}

export default OrderItemController;
