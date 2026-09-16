const express = require("express");
const { getTables, createTable, updateTable, setTableStatus, deleteTable } = require("../controllers/tableController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", getTables); // public: anyone can browse the floor
router.post("/", requireAuth, requireRole("admin", "staff"), createTable);
router.put("/:id", requireAuth, requireRole("admin", "staff"), updateTable);
router.patch("/:id/status", requireAuth, requireRole("admin", "staff"), setTableStatus);
router.delete("/:id", requireAuth, requireRole("admin", "staff"), deleteTable);

module.exports = router;
