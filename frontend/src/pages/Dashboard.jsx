import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import ReservationCard from "../components/ReservationCard";
import tableService from "../services/tableService";
import reservationService from "../services/reservationService";
import { menuService, orderService } from "../services/menuService";
import db from "../services/db";
import { useAuth } from "../context/AuthContext";

import CancelModal from "../components/CancelModal";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("upcoming");
  const [cancellingTarget, setCancellingTarget] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  function loadData() {
    Promise.all([
      tableService.getAll(),
      reservationService.getAll(),
      menuService.getAll(),
      orderService.getAll(),
    ]).then(([t, r, m, o]) => {
      setTables(t);
      setReservations(r);
      setMenu(m);
      setOrders(o);
    });
  }

  useEffect(() => {
    loadData();
    if (user?.role === "customer" && user?.phone) {
      reservationService.claimByPhone(user.phone, user.id).then((claimed) => {
        if (claimed > 0) loadData();
      });
    }

    const handleUpdate = () => loadData();
    window.addEventListener("db_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    return () => {
      window.removeEventListener("db_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, [user]);

  async function confirmCancel() {
    if (!cancellingTarget) return;
    setCancelLoading(true);
    try {
      await reservationService.cancel(cancellingTarget.id);
      loadData();
    } catch (err) {
      alert("Cancellation failed: " + err.message);
    } finally {
      setCancelLoading(false);
      setCancellingTarget(null);
    }
  }

  const isCustomer = user?.role === "customer";
  const today = db.todayStr();

  // Admin/Staff Data
  const todaysReservations = reservations.filter((r) => r.date === today && r.status !== "Cancelled");
  const available = tables.filter((t) => t.status === "Available").length;
  const occupied = tables.filter((t) => t.status === "Occupied").length;
  const reserved = tables.filter((t) => t.status === "Reserved").length;
  const cleaning = tables.filter((t) => t.status === "Cleaning").length;
  const revenueToday = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Customer Data
  const myReservations = reservations.filter(
    (r) => r.customerId === user?.id || (user?.phone && r.phone === user.phone)
  );

  const upcomingReservations = myReservations.filter(
    (r) => r.status === "Confirmed" || r.status === "Seated"
  );
  const pastReservations = myReservations.filter(
    (r) => r.status === "Completed" || r.status === "Cancelled"
  );

  return (
    <DashboardLayout title={isCustomer ? "My Account Dashboard" : "Operations Dashboard"}>
      {isCustomer ? (
        <>
          {/* Welcome Banner for Customer */}
          <div className="card-plain p-4 mb-4" style={{ background: "linear-gradient(135deg, #1e1e1e 0%, #2d0e0e 100%)", color: "#fff", borderRadius: 16 }}>
            <div className="row align-items-center g-3">
              <div className="col-12 col-md-8">
                <span className="badge bg-warning text-dark px-3 py-1 rounded-pill mb-2 fw-semibold">
                  👋 Guest Portal
                </span>
                <h2 className="font-heading mb-1" style={{ fontSize: "1.75rem", color: "#fff" }}>
                  Welcome back, {user?.name || "Guest"}!
                </h2>
                <p className="text-light opacity-75 mb-0" style={{ fontSize: "0.9rem" }}>
                  Manage your table reservations, view dining history, or reserve a table for your next special occasion.
                </p>
              </div>
              <div className="col-12 col-md-4 text-md-end">
                <Link to="/book-table" className="btn btn-secondary-custom px-4 py-2.5 fw-bold text-nowrap">
                  🍽️ Book a Table
                </Link>
              </div>
            </div>
          </div>

          {/* Customer Stat Cards */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-lg-3">
              <StatCard
                label="Total Bookings"
                value={myReservations.length}
                icon="📑"
                iconBg="#2563eb"
              />
            </div>
            <div className="col-6 col-lg-3">
              <StatCard
                label="Upcoming Bookings"
                value={upcomingReservations.length}
                icon="📌"
                iconBg="#10b981"
              />
            </div>
            <div className="col-6 col-lg-3">
              <StatCard
                label="Completed Visits"
                value={pastReservations.filter((r) => r.status === "Completed").length}
                icon="✅"
                iconBg="#8b5cf6"
              />
            </div>
            <div className="col-6 col-lg-3">
              <StatCard
                label="Cancelled Bookings"
                value={myReservations.filter((r) => r.status === "Cancelled").length}
                icon="❌"
                iconBg="#f43f5e"
              />
            </div>
          </div>

          {/* Reservation Tabs & List */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="btn-group" role="group">
              <button
                className={`btn btn-sm ${tab === "upcoming" ? "btn-ink" : "btn-outline-ink"}`}
                onClick={() => setTab("upcoming")}
              >
                Upcoming Bookings ({upcomingReservations.length})
              </button>
              <button
                className={`btn btn-sm ${tab === "past" ? "btn-ink" : "btn-outline-ink"}`}
                onClick={() => setTab("past")}
              >
                Booking History ({pastReservations.length})
              </button>
            </div>
            <Link to="/book-table" className="btn btn-sm btn-primary-custom px-3.5 py-1.5 fw-semibold text-nowrap">
              🍽️ + Reserve Another Table
            </Link>
          </div>

          <div className="row g-3 mb-4">
            {(tab === "upcoming" ? upcomingReservations : pastReservations).length === 0 && (
              <div className="col-12">
                <div className="text-center py-5 card-plain" style={{ background: "#fff" }}>
                  <span style={{ fontSize: "2.5rem" }}>🍽️</span>
                  <h5 className="mt-2 font-heading">No {tab} reservations found</h5>
                  <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                    {tab === "upcoming"
                      ? "You have no upcoming table bookings right now."
                      : "You haven't completed any reservations yet."}
                  </p>
                  <Link to="/book-table" className="btn btn-brass btn-sm">
                    Book a Table Now
                  </Link>
                </div>
              </div>
            )}

            {(tab === "upcoming" ? upcomingReservations : pastReservations).map((r) => (
              <div className="col-12 col-md-6 col-xl-4" key={r.id}>
                <ReservationCard
                  reservation={r}
                  actions={
                    r.status === "Confirmed" ? (
                      <button
                        className="btn btn-sm btn-danger w-100 py-2 fw-semibold"
                        onClick={() => setCancellingTarget(r)}
                      >
                        ✖ Cancel Reservation
                      </button>
                    ) : null
                  }
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Admin / Staff View */
        <>
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-4 col-xl-2">
              <StatCard label="Total tables" value={tables.length} icon="🪑" iconBg="#d97706" />
            </div>
            <div className="col-6 col-md-4 col-xl-2">
              <StatCard label="Available now" value={available} icon="✅" iconBg="#10b981" />
            </div>
            <div className="col-6 col-md-4 col-xl-2">
              <StatCard label="Occupied now" value={occupied} icon="🔴" iconBg="#dc2626" />
            </div>
            <div className="col-6 col-md-4 col-xl-2">
              <StatCard label="Reserved tables" value={reserved} icon="📅" iconBg="#8b5cf6" />
            </div>
            <div className="col-6 col-md-4 col-xl-2">
              <StatCard label="Cleaning tables" value={cleaning} icon="🧹" iconBg="#6b7280" />
            </div>
            <div className="col-6 col-md-4 col-xl-2">
              <StatCard label="Today's bookings" value={todaysReservations.length} icon="📌" iconBg="#2563eb" />
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <StatCard label="Today's revenue (orders)" value={`₹${revenueToday.toFixed(0)}`} icon="💰" iconBg="#059669" />
            </div>
            <div className="col-md-6">
              <StatCard label="Popular menu items" value={menu.length ? menu[0].name : "—"} icon="⭐" iconBg="#d97706" />
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-end mb-2">
            <h5 className="mb-0">Today's bookings</h5>
          </div>
          <div className="row g-3">
            {todaysReservations.length === 0 && (
              <p className="text-secondary">Nothing here yet.</p>
            )}
            {todaysReservations.map((r) => (
              <div className="col-12 col-md-6 col-xl-4" key={r.id}>
                <ReservationCard reservation={r} />
              </div>
            ))}
          </div>
        </>
      )}

      {cancellingTarget && (
        <CancelModal
          reservation={cancellingTarget}
          onConfirm={confirmCancel}
          onClose={() => setCancellingTarget(null)}
          loading={cancelLoading}
        />
      )}
    </DashboardLayout>
  );
}
