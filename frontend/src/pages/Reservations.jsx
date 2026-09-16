import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import ReservationCard from "../components/ReservationCard";
import reservationService from "../services/reservationService";
import tableService from "../services/tableService";
import db from "../services/db";
import { useAuth } from "../context/AuthContext";

import CancelModal from "../components/CancelModal";

const BLANK = { customerName: "", phone: "", tableId: "", date: db.todayStr(), time: "19:00", guests: 2 };

export default function Reservations() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [cancellingTarget, setCancellingTarget] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  function refresh() {
    reservationService.getAll().then(setReservations);
    tableService.getAll().then(setTables);
  }

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener("db_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    return () => {
      window.removeEventListener("db_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, []);

  useEffect(() => {
    const presetTableId = location.state?.presetTableId;
    if (presetTableId) {
      setForm((f) => ({ ...f, tableId: presetTableId }));
      setShowForm(true);
    }
  }, [location.state]);

  useEffect(() => {
    if (user?.role === "customer") {
      setForm((f) => ({ ...f, customerName: user.name, phone: user.phone || "" }));
    }
  }, [user]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const table = tables.find((t) => t.id === form.tableId);
    await reservationService.create({
      ...form,
      guests: Number(form.guests),
      tableNumber: table?.number,
      customerId: user?.role === "customer" ? user.id : null,
    });
    setForm({ ...BLANK, customerName: user?.role === "customer" ? user.name : "", phone: user?.role === "customer" ? user.phone : "" });
    setShowForm(false);
    refresh();
  }

  async function confirmCancel() {
    if (!cancellingTarget) return;
    setCancelLoading(true);
    try {
      await reservationService.cancel(cancellingTarget.id);
      refresh();
    } catch (err) {
      alert("Cancellation failed: " + err.message);
    } finally {
      setCancelLoading(false);
      setCancellingTarget(null);
    }
  }

  async function handleCheckIn(id) {
    await reservationService.checkIn(id);
    refresh();
  }

  async function handleCheckOut(id) {
    await reservationService.checkOut(id);
    refresh();
  }

  const availableTables = tables.filter((t) => t.status === "Available" || t.id === form.tableId);

  const visible = useMemo(() => {
    let list = reservations;
    if (user?.role === "customer") {
      list = list.filter((r) => r.customerId === user.id || (user.phone && r.phone === user.phone));
    }
    if (filter !== "All") list = list.filter((r) => r.status === filter);
    return [...list].sort((a, b) => (a.date + a.time > b.date + b.time ? -1 : 1));
  }, [reservations, filter, user]);

  const isStaffOrAdmin = user?.role === "admin" || user?.role === "staff";

  function handleBookButtonClick() {
    if (isStaffOrAdmin) {
      setShowForm((v) => !v);
    } else {
      navigate("/book-table");
    }
  }

  return (
    <DashboardLayout title="Reservations">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div className="d-flex align-items-center gap-2">
          <label className="fw-semibold text-muted" style={{ fontSize: "0.85rem" }}>Filter Status:</label>
          <select
            className="form-select form-select-sm rounded-pill px-3"
            style={{ width: 180, borderColor: "var(--line)" }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {["All", "Confirmed", "Seated", "Completed", "Cancelled"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary-custom btn-sm px-4 fw-semibold" onClick={handleBookButtonClick}>
          {showForm ? "Close Form" : isStaffOrAdmin ? "+ New / Walk-in Booking" : "🍽️ + Book a Table"}
        </button>
      </div>

      {showForm && isStaffOrAdmin && (
        <form onSubmit={handleSubmit} className="card-plain p-4 mb-4 shadow-sm border rounded-4 bg-white">
          <h5 className="font-heading mb-3">Create Walk-in / New Reservation</h5>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="fw-semibold text-muted" style={{ fontSize: "0.78rem" }}>Customer Name</label>
              <input className="form-control" required value={form.customerName} onChange={(e) => update("customerName", e.target.value)} />
            </div>
            <div className="col-12 col-md-4">
              <label className="fw-semibold text-muted" style={{ fontSize: "0.78rem" }}>Phone</label>
              <input className="form-control" required value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div className="col-6 col-md-4">
              <label className="fw-semibold text-muted" style={{ fontSize: "0.78rem" }}>Table</label>
              <select className="form-select" required value={form.tableId} onChange={(e) => update("tableId", e.target.value)}>
                <option value="">Select a table</option>
                {availableTables.map((t) => (
                  <option key={t.id} value={t.id}>Table {t.number} · seats {t.capacity} · {t.location}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-3">
              <label className="fw-semibold text-muted" style={{ fontSize: "0.78rem" }}>Date</label>
              <input type="date" className="form-control" required value={form.date} onChange={(e) => update("date", e.target.value)} />
            </div>
            <div className="col-6 col-md-3">
              <label className="fw-semibold text-muted" style={{ fontSize: "0.78rem" }}>Time</label>
              <input type="time" className="form-control" required value={form.time} onChange={(e) => update("time", e.target.value)} />
            </div>
            <div className="col-6 col-md-3">
              <label className="fw-semibold text-muted" style={{ fontSize: "0.78rem" }}>Guests</label>
              <input type="number" min={1} className="form-control" required value={form.guests} onChange={(e) => update("guests", e.target.value)} />
            </div>
          </div>
          <button className="btn btn-primary-custom mt-3" style={{ width: 220 }}>Confirm Reservation</button>
        </form>
      )}

      <div className="row g-4">
        {visible.length === 0 && (
          <div className="col-12">
            <div className="text-center py-5 bg-white border rounded-4">
              <span style={{ fontSize: "2.5rem" }}>📋</span>
              <h5 className="mt-2 font-heading">No reservations found</h5>
              <p className="text-muted" style={{ fontSize: "0.85rem" }}>There are no reservations matching the selected filter.</p>
              {!isStaffOrAdmin && (
                <Link to="/book-table" className="btn btn-primary-custom btn-sm">
                  Book a Table Now
                </Link>
              )}
            </div>
          </div>
        )}

        {visible.map((r) => (
          <div className="col-12 col-md-6 col-xl-4" key={r.id}>
            <ReservationCard
              reservation={r}
              actions={
                <>
                  {r.status === "Confirmed" && isStaffOrAdmin && (
                    <button className="btn btn-sm btn-primary-custom flex-fill fw-semibold py-2" onClick={() => handleCheckIn(r.id)}>
                      Check In
                    </button>
                  )}
                  {r.status === "Seated" && isStaffOrAdmin && (
                    <button className="btn btn-sm btn-primary-custom flex-fill fw-semibold py-2" onClick={() => handleCheckOut(r.id)}>
                      Check Out
                    </button>
                  )}
                  {r.status === "Confirmed" && (
                    <button className="btn btn-sm btn-danger flex-fill fw-semibold py-2" onClick={() => setCancellingTarget(r)}>
                      ✖ Cancel Reservation
                    </button>
                  )}
                </>
              }
            />
          </div>
        ))}
      </div>

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
