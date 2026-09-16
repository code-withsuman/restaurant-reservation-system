const { Order, MenuItem } = require("../models/misc");
const { asyncHandler } = require("../middleware/errorHandler");

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("items.menuItem").sort({ createdAt: -1 });
  res.json(orders);
});

const createOrder = asyncHandler(async (req, res) => {
  const { reservationId, items } = req.body;
  if (!reservationId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "A reservation and at least one item are required." });
  }

  let total = 0;
  for (const line of items) {
    const menuItem = await MenuItem.findById(line.menuId);
    if (!menuItem) return res.status(404).json({ message: "One of the menu items no longer exists." });
    total += menuItem.price * Number(line.qty);
  }

  const order = await Order.create({
    reservation: reservationId,
    items: items.map((l) => ({ menuItem: l.menuId, qty: l.qty })),
    total,
    status: "Placed",
  });

  res.status(201).json(order);
});

const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!order) return res.status(404).json({ message: "Order not found." });
  res.json(order);
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found." });
  res.json({ deleted: true });
});

module.exports = { getOrders, createOrder, updateOrder, deleteOrder };
