const Reservation = require("../models/Reservation");
const Table = require("../models/Table");
const { Customer, Payment } = require("../models/misc");
const { asyncHandler } = require("../middleware/errorHandler");

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const getOverview = asyncHandler(async (req, res) => {
  const [tables, todaysReservations, customers] = await Promise.all([
    Table.find(),
    Reservation.find({ date: todayStr(), status: { $ne: "Cancelled" } }),
    Customer.find(),
  ]);

  res.json({
    totalTables: tables.length,
    availableTables: tables.filter((t) => t.status === "Available").length,
    occupiedTables: tables.filter((t) => t.status === "Occupied").length,
    todaysReservations: todaysReservations.length,
    totalCustomers: customers.length,
  });
});

const getReports = asyncHandler(async (req, res) => {
  const [reservations, tables, customers, payments] = await Promise.all([
    Reservation.find(),
    Table.find(),
    Customer.find(),
    Payment.find(),
  ]);

  const now = new Date();
  const monthRevenue = payments
    .filter((p) => new Date(p.createdAt).getMonth() === now.getMonth())
    .reduce((sum, p) => sum + p.amount, 0);

  const tableCounts = {};
  reservations.forEach((r) => {
    tableCounts[r.tableNumber] = (tableCounts[r.tableNumber] || 0) + 1;
  });
  const popularTables = Object.entries(tableCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tableNumber, count]) => ({ tableNumber: Number(tableNumber), count }));

  const occupancyRate = tables.length
    ? Math.round((tables.filter((t) => t.status === "Occupied").length / tables.length) * 100)
    : 0;

  res.json({
    reservationsToday: reservations.filter((r) => r.date === todayStr()).length,
    monthRevenue,
    totalCustomers: customers.length,
    occupancyRate,
    popularTables,
    frequentCustomers: [...customers].sort((a, b) => (b.visits || 0) - (a.visits || 0)).slice(0, 5),
  });
});

module.exports = { getOverview, getReports };
