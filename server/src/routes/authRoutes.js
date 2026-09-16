const express = require("express");
const { register, login, forgotPassword, getProfile, updateProfile } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/me", requireAuth, getProfile);
router.put("/me", requireAuth, updateProfile);

module.exports = router;
