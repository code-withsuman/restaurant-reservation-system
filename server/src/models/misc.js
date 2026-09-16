const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
    visits: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ["Starters", "Main Course", "Desserts", "Beverages"] },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    reservation: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation", required: true },
    items: { type: [orderItemSchema], required: true },
    status: { type: String, enum: ["Placed", "Preparing", "Ready", "Served"], default: "Placed" },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ["Cash", "Card", "UPI"], required: true },
    status: { type: String, enum: ["Paid", "Refunded"], default: "Paid" },
  },
  { timestamps: true }
);

module.exports = {
  Customer: mongoose.model("Customer", customerSchema),
  MenuItem: mongoose.model("MenuItem", menuItemSchema),
  Order: mongoose.model("Order", orderSchema),
  Payment: mongoose.model("Payment", paymentSchema),
};
