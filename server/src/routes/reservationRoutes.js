const express = require("express");
const {
  createReservation,
  getReservations,
  updateReservation,
  cancelReservation,
  checkIn,
  checkOut,
  deleteReservation,
} = require("../controllers/reservationController");
const { requireAuth, requireRole, optionalAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/", optionalAuth, createReservation); // guests can book without logging in
router.get("/", requireAuth, getReservations); // scoped to the caller unless admin/staff
router.put("/:id", requireAuth, requireRole("admin", "staff"), updateReservation);
router.post("/:id/cancel", requireAuth, cancelReservation);
router.post("/:id/check-in", requireAuth, requireRole("admin", "staff"), checkIn);
router.post("/:id/check-out", requireAuth, requireRole("admin", "staff"), checkOut);
router.delete("/:id", requireAuth, requireRole("admin", "staff"), deleteReservation);

module.exports = router;
