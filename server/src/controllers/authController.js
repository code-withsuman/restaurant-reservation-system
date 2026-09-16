const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { Customer } = require("../models/misc");
const Reservation = require("../models/Reservation");
const { asyncHandler } = require("../middleware/errorHandler");

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// Any guest reservation made with this phone number, not yet tied to an
// account, becomes this user's booking history.
async function claimReservationsByPhone(phone, userId) {
  await Reservation.updateMany({ phone, customer: null }, { $set: { customer: userId } });
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: "Name, email, phone and password are all required." });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ message: "An account with this email already exists." });

  const user = await User.create({ name, email, password, phone, role: "customer" });

  await Customer.findOneAndUpdate(
    { phone },
    { $setOnInsert: { name, phone, email }, $set: { user: user._id } },
    { upsert: true, new: true }
  );
  await claimReservationsByPhone(phone, user._id);

  const token = signToken(user);
  res.status(201).json({ user: user.toSafeObject(), token });
});

const login = asyncHandler(async (req, res) => {
  const { email, phone, loginInput, password } = req.body;
  const identifier = (loginInput || email || phone || "").trim().toLowerCase();

  const user = await User.findOne({
    $or: [
      { email: identifier },
      { phone: identifier }
    ]
  }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid contact number/email or password." });
  }

  await claimReservationsByPhone(user.phone, user._id);

  const token = signToken(user);
  res.json({ user: user.toSafeObject(), token });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: (email || "").toLowerCase() });
  if (!user) return res.status(404).json({ message: "No account found with that email." });

  // Plug in a real email/SMS provider here. For now this confirms the
  // account exists so the frontend can show a consistent message.
  res.json({ message: "Password reset instructions sent." });
});

const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  if (name) req.user.name = name;
  if (phone) req.user.phone = phone;
  await req.user.save();
  res.json({ user: req.user.toSafeObject() });
});

module.exports = { register, login, forgotPassword, getProfile, updateProfile };
