const Reservation = require("../models/Reservation");
const Table = require("../models/Table");
const { Customer } = require("../models/misc");
const { asyncHandler } = require("../middleware/errorHandler");

async function upsertCustomer({ name, phone, email, userId }) {
  await Customer.findOneAndUpdate(
    { phone },
    {
      $setOnInsert: { name, phone, email: email || "" },
      ...(userId ? { $set: { user: userId } } : {}),
    },
    { upsert: true }
  );
}

// Public: anyone can book a table, logged in or not (guest checkout style).
const createReservation = asyncHandler(async (req, res) => {
  const { customerName, phone, tableId, date, time, guests } = req.body;
  if (!customerName || !phone || !tableId || !date || !time || !guests) {
    return res.status(400).json({ message: "Name, phone, table, date, time and guest count are required." });
  }

  const table = await Table.findById(tableId);
  if (!table) return res.status(404).json({ message: "That table doesn't exist." });
  if (table.status !== "Available") {
    return res.status(409).json({ message: "That table is no longer available — please pick another." });
  }

  // If the request carries a valid logged-in user, attach the reservation
  // to their account directly; otherwise it's a guest booking keyed by phone,
  // which gets claimed automatically the next time this phone logs in.
  const customerId = req.user ? req.user._id : null;

  const reservation = await Reservation.create({
    customerName,
    phone,
    customer: customerId,
    table: table._id,
    tableNumber: table.number,
    date,
    time,
    guests,
    status: "Confirmed",
  });

  table.status = "Reserved";
  await table.save();

  await upsertCustomer({ name: customerName, phone, userId: customerId });

  res.status(201).json(reservation);
});

// Scoped: admins/staff see everything; customers see only their own
// (matched by account id, falling back to phone for pre-account bookings).
const getReservations = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.user && req.user.role === "customer") {
    filter = { $or: [{ customer: req.user._id }, { phone: req.user.phone }] };
  }
  const reservations = await Reservation.find(filter).sort({ date: -1, time: -1 });
  res.json(reservations);
});

const updateReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!reservation) return res.status(404).json({ message: "Reservation not found." });
  res.json(reservation);
});

const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) return res.status(404).json({ message: "Reservation not found." });

  reservation.status = "Cancelled";
  await reservation.save();
  await Table.findByIdAndUpdate(reservation.table, { status: "Available" });

  res.json(reservation);
});

const checkIn = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) return res.status(404).json({ message: "Reservation not found." });

  reservation.status = "Seated";
  await reservation.save();
  await Table.findByIdAndUpdate(reservation.table, { status: "Occupied" });

  res.json(reservation);
});

const checkOut = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) return res.status(404).json({ message: "Reservation not found." });

  reservation.status = "Completed";
  await reservation.save();
  await Table.findByIdAndUpdate(reservation.table, { status: "Cleaning" });
  await Customer.findOneAndUpdate({ phone: reservation.phone }, { $inc: { visits: 1 } });

  res.json(reservation);
});

const deleteReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByIdAndDelete(req.params.id);
  if (!reservation) return res.status(404).json({ message: "Reservation not found." });
  res.json({ deleted: true });
});

module.exports = {
  createReservation,
  getReservations,
  updateReservation,
  cancelReservation,
  checkIn,
  checkOut,
  deleteReservation,
};
