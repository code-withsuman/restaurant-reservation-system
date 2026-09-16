const { Customer } = require("../models/misc");
const { asyncHandler } = require("../middleware/errorHandler");

const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find().sort({ visits: -1 });
  res.json(customers);
});

const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!customer) return res.status(404).json({ message: "Customer not found." });
  res.json(customer);
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).json({ message: "Customer not found." });
  res.json({ deleted: true });
});

module.exports = { getCustomers, updateCustomer, deleteCustomer };
