const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");

const { getCustomers, updateCustomer, deleteCustomer } = require("../controllers/customerController");
const { getMenu, createMenuItem, updateMenuItem, deleteMenuItem } = require("../controllers/menuController");
const { getOrders, createOrder, updateOrder, deleteOrder } = require("../controllers/orderController");
const { getPayments, createPayment } = require("../controllers/paymentController");
const { getOverview, getReports } = require("../controllers/reportController");

const customerRouter = express.Router();
customerRouter.get("/", requireAuth, requireRole("admin", "staff"), getCustomers);
customerRouter.put("/:id", requireAuth, requireRole("admin", "staff"), updateCustomer);
customerRouter.delete("/:id", requireAuth, requireRole("admin", "staff"), deleteCustomer);

const menuRouter = express.Router();
menuRouter.get("/", getMenu); // public: guests can browse the menu too
menuRouter.post("/", requireAuth, requireRole("admin", "staff"), createMenuItem);
menuRouter.put("/:id", requireAuth, requireRole("admin", "staff"), updateMenuItem);
menuRouter.delete("/:id", requireAuth, requireRole("admin", "staff"), deleteMenuItem);

const orderRouter = express.Router();
orderRouter.get("/", requireAuth, requireRole("admin", "staff"), getOrders);
orderRouter.post("/", requireAuth, requireRole("admin", "staff"), createOrder);
orderRouter.put("/:id", requireAuth, requireRole("admin", "staff"), updateOrder);
orderRouter.delete("/:id", requireAuth, requireRole("admin", "staff"), deleteOrder);

const paymentRouter = express.Router();
paymentRouter.get("/", requireAuth, requireRole("admin", "staff"), getPayments);
paymentRouter.post("/", requireAuth, requireRole("admin", "staff"), createPayment);

const reportRouter = express.Router();
reportRouter.get("/overview", requireAuth, getOverview);
reportRouter.get("/", requireAuth, requireRole("admin"), getReports);

module.exports = { customerRouter, menuRouter, orderRouter, paymentRouter, reportRouter };
