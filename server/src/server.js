require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const tableRoutes = require("./routes/tableRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const { customerRouter, menuRouter, orderRouter, paymentRouter, reportRouter } = require("./routes/miscRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/customers", customerRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/reports", reportRouter);

app.use(notFound);
app.use(errorHandler);

const seedDefaultAccounts = require("./config/seed");

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedDefaultAccounts();
  app.listen(PORT, () => console.log(`Desi Delight API listening on port ${PORT} ...🚀`));
});
