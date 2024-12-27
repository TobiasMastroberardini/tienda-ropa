import OrderModel from "../models/orderModel.js";

class OrderController {
  static async getAll(req, res) {
    try {
      const orders = await OrderModel.getAll();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  }

  static async getById(req, res) {
    try {
      const order = await OrderModel.getById(req.params.id);
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ error: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  }

  static async create(req, res) {
    try {
      const order = await OrderModel.create(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  }

  static async update(req, res) {
    try {
      const order = await OrderModel.update(req.params.id, req.body);
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ error: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  }

  static async delete(req, res) {
    try {
      const order = await OrderModel.delete(req.params.id);
      if (order) {
        res.json({ message: "Order deleted successfully" });
      } else {
        res.status(404).json({ error: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete order" });
    }
  }
}

export default OrderController;
