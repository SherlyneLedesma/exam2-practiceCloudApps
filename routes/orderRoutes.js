const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");

// 1. GET /api/orders - Find all orders
router.get("/", async function (req, res) {
  try {
    const orders = await Order.getOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. GET /api/orders/:id - Find single order
router.get("/:id", async function (req, res) {
  try {
    const order = await Order.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. POST /api/orders - Add new order
router.post("/", async function (req, res) {
  try {
    const insertId = await Order.addOrder(req.body);
    const newOrder = await Order.getOrderById(insertId);
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. PUT /api/orders/:id - Update order details
router.put("/:id", async function (req, res) {
  try {
    const updated = await Order.updateOrder(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Order not found to update" });
    }
    const updatedOrder = await Order.getOrderById(req.params.id);
    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. DELETE /api/orders/:id - Remove order from schema records
router.delete("/:id", async function (req, res) {
  try {
    const deleted = await Order.deleteOrder(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Order not found to delete" });
    }
    res.status(200).json({ success: true, message: "Order removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// MAKE SURE THIS LINE IS AT THE VERY BOTTOM
module.exports = router;
