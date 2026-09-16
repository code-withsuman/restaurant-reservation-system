const { Payment, Order } = require("../models/misc");
const { asyncHandler } = require("../middleware/errorHandler");

const getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find().sort({ createdAt: -1 });
  res.json(payments);
});

const createPayment = asyncHandler(async (req, res) => {
  const { orderId, method } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found." });

  const payment = await Payment.create({ order: order._id, amount: order.total, method, status: "Paid" });
  res.status(201).json(payment);
});

module.exports = { getPayments, createPayment };
