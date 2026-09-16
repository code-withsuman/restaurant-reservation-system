const Table = require("../models/Table");
const { asyncHandler } = require("../middleware/errorHandler");

const getTables = asyncHandler(async (req, res) => {
  const tables = await Table.find().sort({ number: 1 });
  res.json(tables);
});

const createTable = asyncHandler(async (req, res) => {
  const { number, capacity, location, status } = req.body;
  const table = await Table.create({ number, capacity, location, status });
  res.status(201).json(table);
});

const updateTable = asyncHandler(async (req, res) => {
  const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!table) return res.status(404).json({ message: "Table not found." });
  res.json(table);
});

const setTableStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const table = await Table.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!table) return res.status(404).json({ message: "Table not found." });
  res.json(table);
});

const deleteTable = asyncHandler(async (req, res) => {
  const table = await Table.findByIdAndDelete(req.params.id);
  if (!table) return res.status(404).json({ message: "Table not found." });
  res.json({ deleted: true });
});

module.exports = { getTables, createTable, updateTable, setTableStatus, deleteTable };
