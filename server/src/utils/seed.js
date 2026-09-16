require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Table = require("../models/Table");
const Reservation = require("../models/Reservation");
const { Customer, MenuItem, Order, Payment } = require("../models/misc");

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Table.deleteMany({}),
    Reservation.deleteMany({}),
    Customer.deleteMany({}),
    MenuItem.deleteMany({}),
    Order.deleteMany({}),
    Payment.deleteMany({}),
  ]);

  const [admin, staff, ashaUser] = await User.create([
    { name: "Admin User", email: "admin@tabletwelve.com", password: "admin123", phone: "9000000001", role: "admin" },
    { name: "Staff Member", email: "staff@tabletwelve.com", password: "staff123", phone: "9000000002", role: "staff" },
    { name: "Asha Rao", email: "asha@example.com", password: "customer123", phone: "9000000003", role: "customer" },
  ]);

  const tables = await Table.create([
    { number: 1, capacity: 2, status: "Available", location: "Window" },
    { number: 2, capacity: 2, status: "Available", location: "Window" },
    { number: 3, capacity: 4, status: "Available", location: "Main Hall" },
    { number: 4, capacity: 4, status: "Available", location: "Main Hall" },
    { number: 5, capacity: 4, status: "Available", location: "Main Hall" },
    { number: 6, capacity: 6, status: "Available", location: "Main Hall" },
    { number: 7, capacity: 6, status: "Available", location: "Patio" },
    { number: 8, capacity: 8, status: "Available", location: "Private Room" },
    { number: 9, capacity: 8, status: "Available", location: "Private Room" },
    { number: 10, capacity: 12, status: "Available", location: "VIP Lounge" },
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const byNumber = (n) => tables.find((t) => t.number === n);

  await Reservation.create([
    {
      customerName: "Asha Rao", phone: "9000000003", customer: ashaUser._id,
      table: byNumber(3)._id, tableNumber: 3, date: today, time: "19:30", guests: 4, status: "Confirmed",
    },
    {
      customerName: "Rohan Mehta", phone: "9123456780", customer: null,
      table: byNumber(2)._id, tableNumber: 2, date: today, time: "13:00", guests: 2, status: "Seated",
    },
    {
      customerName: "Priya Nair", phone: "9988776655", customer: null,
      table: byNumber(8)._id, tableNumber: 8, date: today, time: "12:30", guests: 3, status: "Seated",
    },
  ]);

  await Customer.create([
    { name: "Asha Rao", phone: "9000000003", email: "asha@example.com", address: "Haldia, WB", visits: 5, user: ashaUser._id },
    { name: "Rohan Mehta", phone: "9123456780", email: "rohan@example.com", address: "Kolkata, WB", visits: 2 },
    { name: "Priya Nair", phone: "9988776655", email: "priya@example.com", address: "Digha, WB", visits: 8 },
  ]);

  await MenuItem.create([
    { name: "Kosha Mangsho", category: "Main Course", price: 320, description: "Slow-cooked Bengali mutton curry." },
    { name: "Steamed Bhetki Paturi", category: "Main Course", price: 380, description: "Fish steamed in banana leaf with mustard." },
    { name: "Mochar Chop", category: "Starters", price: 140, description: "Banana flower croquettes." },
    { name: "Mishti Doi", category: "Desserts", price: 90, description: "Sweetened caramelised yoghurt." },
    { name: "Lemon Iced Tea", category: "Beverages", price: 110, description: "House-brewed, served cold." },
  ]);

  console.log("Seed complete. Demo accounts:");
  console.log("  admin@tabletwelve.com / admin123");
  console.log("  staff@tabletwelve.com / staff123");
  console.log("  asha@example.com / customer123");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
