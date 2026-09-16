import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import tableService from "../services/tableService";
import reservationService from "../services/reservationService";
import db from "../services/db";

const BLANK = { name: "", phone: "", date: db.todayStr(), time: "19:00", guests: 2 };

export default function BookTableModal({ onClose }) {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null); // holds the confirmed reservation once done

  useEffect(() => {
    tableService.getAll().then(setTables);
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function pickBestTable(guests) {
    const fits = tables
      .filter((t) => t.status === "Available" && t.capacity >= Number(guests))
      .sort((a, b) => a.capacity - b.capacity);
    return fits[0] || null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const table = pickBestTable(form.guests);
    if (!table) {
      setError("No table is free for that party size right now — try a smaller party or a different time.");
      return;
    }
    setLoading(true);
    try {
      const created = await reservationService.create({
        customerName: form.name,
        phone: form.phone,
        tableId: table.id,
        tableNumber: table.number,
        date: form.date,
        time: form.time,
        guests: Number(form.guests),
        customerId: null,
      });
      setBooking(created);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-card-custom" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>

        {!booking ? (
          <>
            <div className="eyebrow mb-1">Reserve in under a minute</div>
            <h3 className="mb-3">Book a table</h3>
            <p className="text-secondary" style={{ fontSize: "0.88rem" }}>
              No account needed — we'll seat you by name and phone number.
            </p>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="mono" style={{ fontSize: "0.75rem" }}>Your name</label>
                <input className="form-control" required value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="mono" style={{ fontSize: "0.75rem" }}>Phone number</label>
                <input className="form-control" required value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="mono" style={{ fontSize: "0.75rem" }}>Date</label>
                  <input type="date" className="form-control" required min={db.todayStr()} value={form.date} onChange={(e) => update("date", e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="mono" style={{ fontSize: "0.75rem" }}>Time</label>
                  <input type="time" className="form-control" required value={form.time} onChange={(e) => update("time", e.target.value)} />
                </div>
              </div>
              <div className="mb-4">
                <label className="mono" style={{ fontSize: "0.75rem" }}>Party size</label>
                <select className="form-select" value={form.guests} onChange={(e) => update("guests", e.target.value)}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}
                </select>
              </div>
              <button className="btn btn-brass w-100" disabled={loading}>
                {loading ? "Booking…" : "Confirm booking"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="success-seal" aria-hidden="true">✓</div>
            <h3 className="mb-1">Your Booking is Successful!</h3>
            <p className="text-secondary mb-3" style={{ fontSize: "0.9rem" }}>
              We've reserved your table. See you soon.
            </p>

            <div className="text-start">
              <div className="success-detail-row"><span className="text-secondary">Name</span><strong>{booking.customerName}</strong></div>
              <div className="success-detail-row"><span className="text-secondary">Table no.</span><strong className="mono">Table {booking.tableNumber}</strong></div>
              <div className="success-detail-row"><span className="text-secondary">Date</span><strong className="mono">{booking.date}</strong></div>
              <div className="success-detail-row"><span className="text-secondary">Time</span><strong className="mono">{booking.time}</strong></div>
            </div>

            <div className="card-plain p-3 mt-4" style={{ background: "var(--parchment-dim)", border: "none" }}>
              <p className="mb-2" style={{ fontSize: "0.85rem" }}>
                If you'd like to access this and past bookings anytime, log in or sign up with this same phone number.
              </p>
              <div className="d-flex gap-2 justify-content-center">
                <Link to="/login" className="btn btn-sm btn-outline-ink" onClick={onClose}>Log in</Link>
                <Link to="/register" className="btn btn-sm btn-brass" onClick={onClose}>Sign up</Link>
              </div>
            </div>

            <button className="btn btn-sm btn-outline-ink mt-3" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
