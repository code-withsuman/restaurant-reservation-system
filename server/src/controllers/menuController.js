const { MenuItem } = require("../models/misc");
const { asyncHandler } = require("../middleware/errorHandler");

const getMenu = asyncHandler(async (req, res) => {
  const items = await MenuItem.find().sort({ category: 1, name: 1 });
  res.json(items);
});

const createMenuItem = asyncHandler(async (req, res) => {
  const { name, category, price, description, image } = req.body;
  const item = await MenuItem.create({ name, category, price, description, image });
  res.status(201).json(item);
});

const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: "Menu item not found." });
  res.json(item);
});

const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Menu item not found." });
  res.json({ deleted: true });
});

module.exports = { getMenu, createMenuItem, updateMenuItem, deleteMenuItem };
