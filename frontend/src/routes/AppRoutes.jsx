import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import ManagementLogin from "../pages/ManagementLogin";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import BookTable from "../pages/BookTable";
import Dashboard from "../pages/Dashboard";
import Tables from "../pages/Tables";
import Reservations from "../pages/Reservations";
import Customers from "../pages/Customers";
import StaffManagement from "../pages/StaffManagement";
import Menu from "../pages/Menu";
import Orders from "../pages/Orders";
import Payments from "../pages/Payments";
import OffersManagement from "../pages/OffersManagement";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import Feedback from "../pages/Feedback";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<Home section="about" />} />
      <Route path="/dishes" element={<Home section="dishes" />} />
      <Route path="/our-menu" element={<Home section="menu" />} />
      <Route path="/offers" element={<Home section="offers" />} />
      <Route path="/gallery" element={<Home section="gallery" />} />
      <Route path="/contact" element={<Home section="contact" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/management-login" element={<ManagementLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/book-table" element={<BookTable />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/tables" element={<ProtectedRoute roles={["admin", "staff"]}><Tables /></ProtectedRoute>} />
      <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute roles={["admin", "staff"]}><Customers /></ProtectedRoute>} />
      <Route path="/staff-management" element={<ProtectedRoute roles={["admin"]}><StaffManagement /></ProtectedRoute>} />
      <Route path="/menu" element={<ProtectedRoute roles={["admin", "staff"]}><Menu /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute roles={["admin", "staff"]}><Orders /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute roles={["admin", "staff"]}><Payments /></ProtectedRoute>} />
      <Route path="/offers-management" element={<ProtectedRoute roles={["admin"]}><OffersManagement /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute roles={["admin"]}><Reports /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute roles={["admin"]}><Settings /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
