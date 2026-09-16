import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Header/Navbar";
import Footer from "../components/Footer";
import tableService from "../services/tableService";
import reservationService from "../services/reservationService";
import db from "../services/db";
import { useAuth } from "../context/AuthContext";

const STATUS_CONFIG = {
  Available: { color: "#22c55e", bg: "#f0fdf4", icon: "✅", label: "Available" },
  Occupied:  { color: "#ef4444", bg: "#fef2f2", icon: "🔴", label: "Occupied" },
  Reserved:  { color: "#f59e0b", bg: "#fffbeb", icon: "📌", label: "Reserved" },
  Cleaning:  { color: "#8b5cf6", bg: "#f5f3ff", icon: "🧹", label: "Cleaning" },
};

const LOCATION_ICONS = {
  "Window": "🪟",
  "Main Hall": "🏛️",
  "Patio": "🌿",
  "Private Room": "🚪",
};

export default function BookTable() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    date: db.todayStr(),
    time: "19:00",
    guests: 2,
  });
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    tableService.getAll().then((data) => {
      if (Array.isArray(data)) setTables(data);
    });
  }, []);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        customerName: user.name || f.customerName,
        phone: user.phone || f.phone,
      }));
    }
  }, [user]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSelectTable(table) {
    if (table.status !== "Available") return;
    setSelectedTable(table);
    setForm((f) => ({ ...f, guests: Math.min(f.guests, table.capacity) || 2 }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedTable) return;
    setLoading(true);
    try {
      await reservationService.create({
        customerName: form.customerName,
        phone: form.phone,
        tableId: selectedTable.id,
        tableNumber: selectedTable.number,
        date: form.date,
        time: form.time,
        guests: Number(form.guests),
        customerId: user?.id || null,
      });
      setSuccessData({
        tableNumber: selectedTable.number,
        location: selectedTable.location,
        capacity: selectedTable.capacity,
        date: form.date,
        time: form.time,
        guests: form.guests,
        name: form.customerName,
      });
    } catch (err) {
      alert("Booking failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCloseSuccess() {
    setSuccessData(null);
    navigate("/");
  }

  // Stats
  const stats = useMemo(() => {
    const total = tables.length;
    const available = tables.filter((t) => t.status === "Available").length;
    const occupied = tables.filter((t) => t.status === "Occupied").length;
    const reserved = tables.filter((t) => t.status === "Reserved").length;
    const cleaning = tables.filter((t) => t.status === "Cleaning").length;
    return { total, available, occupied, reserved, cleaning };
  }, [tables]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      {/* Page Header */}
      <section className="book-table-header">
        <div className="container">
          <div className="book-table-header-content">
            <span className="eyebrow text-warning">🍽️ Table Reservation</span>
            <h1 className="font-heading">Reserve Your <span style={{ color: "var(--secondary)" }}>Perfect Table</span></h1>
            <p className="text-white opacity-90">Select an available table, pick your date & time, and confirm your reservation in seconds.</p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="book-table-stats">
        <div className="container">
          <div className="stats-bar">
            <div className="stat-pill">
              <span className="stat-pill-count">{stats.total}</span>
              <span className="stat-pill-label">Total Tables</span>
            </div>
            <div className="stat-pill stat-available">
              <span className="stat-pill-dot" style={{ background: "#22c55e" }}></span>
              <span className="stat-pill-count">{stats.available}</span>
              <span className="stat-pill-label">Available</span>
            </div>
            <div className="stat-pill stat-occupied">
              <span className="stat-pill-dot" style={{ background: "#ef4444" }}></span>
              <span className="stat-pill-count">{stats.occupied}</span>
              <span className="stat-pill-label">Occupied</span>
            </div>
            <div className="stat-pill stat-reserved">
              <span className="stat-pill-dot" style={{ background: "#f59e0b" }}></span>
              <span className="stat-pill-count">{stats.reserved}</span>
              <span className="stat-pill-label">Reserved</span>
            </div>
            <div className="stat-pill stat-cleaning">
              <span className="stat-pill-dot" style={{ background: "#8b5cf6" }}></span>
              <span className="stat-pill-count">{stats.cleaning}</span>
              <span className="stat-pill-label">Cleaning</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="book-table-main py-5">
        <div className="container">
          <div className="row g-4">
            {/* Left: Table Grid */}
            <div className="col-12 col-lg-7">
              <h3 className="font-heading mb-1" style={{ fontSize: "1.3rem" }}>Select a Table</h3>
              <p className="text-muted mb-4" style={{ fontSize: "0.85rem" }}>Click on an available table to select it</p>

              <div className="table-floor-grid">
                {tables.map((table) => {
                  const cfg = STATUS_CONFIG[table.status] || STATUS_CONFIG.Available;
                  const isSelected = selectedTable?.id === table.id;
                  const isAvailable = table.status === "Available";
                  return (
                    <div
                      key={table.id}
                      className={`table-floor-card ${isSelected ? "selected" : ""} ${isAvailable ? "clickable" : "disabled"}`}
                      onClick={() => handleSelectTable(table)}
                    >
                      <div className="table-floor-status" style={{ background: cfg.color }}></div>
                      <div className="table-floor-number">T{table.number}</div>
                      <div className="table-floor-icon">{LOCATION_ICONS[table.location] || "🪑"}</div>
                      <div className="table-floor-capacity">
                        {"🪑".repeat(Math.min(table.capacity, 6))}
                        {table.capacity > 6 && <span>+{table.capacity - 6}</span>}
                      </div>
                      <div className="table-floor-seats">{table.capacity} Seats</div>
                      <div className="table-floor-location">{table.location}</div>
                      <div className="table-floor-badge" style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.icon} {cfg.label}
                      </div>
                      {isSelected && <div className="table-floor-check">✓</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Booking Form */}
            <div className="col-12 col-lg-5">
              <div className="booking-form-card">
                <h3 className="font-heading mb-1" style={{ fontSize: "1.3rem" }}>Booking Details</h3>
                <p className="text-muted mb-4" style={{ fontSize: "0.85rem" }}>
                  {selectedTable
                    ? `Table ${selectedTable.number} · ${selectedTable.capacity} Seats · ${selectedTable.location}`
                    : "Please select an available table first"}
                </p>

                {selectedTable && (
                  <div className="selected-table-preview mb-4">
                    <div className="stp-icon">{LOCATION_ICONS[selectedTable.location] || "🪑"}</div>
                    <div>
                      <div className="fw-bold font-heading" style={{ fontSize: "1.1rem" }}>Table {selectedTable.number}</div>
                      <div className="text-muted" style={{ fontSize: "0.82rem" }}>{selectedTable.location} · {selectedTable.capacity} Seats</div>
                    </div>
                    <button className="btn btn-sm btn-outline-danger ms-auto" onClick={() => setSelectedTable(null)}>✕</button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="booking-field">
                    <label>👤 Full Name</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      required
                      value={form.customerName}
                      onChange={(e) => update("customerName", e.target.value)}
                    />
                  </div>
                  <div className="booking-field">
                    <label>📞 Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </div>
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="booking-field">
                        <label>📅 Date</label>
                        <input
                          type="date"
                          required
                          min={db.todayStr()}
                          value={form.date}
                          onChange={(e) => update("date", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="booking-field">
                        <label>⏰ Time</label>
                        <input
                          type="time"
                          required
                          value={form.time}
                          onChange={(e) => update("time", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="booking-field">
                    <label>👥 Number of Guests</label>
                    <input
                      type="number"
                      min={1}
                      max={Math.min(selectedTable?.capacity || 12, 12)}
                      required
                      value={form.guests}
                      onChange={(e) => update("guests", e.target.value)}
                    />
                    {selectedTable && (
                      <small className="text-muted">Max {selectedTable.capacity} guests for this table</small>
                    )}
                  </div>

                  <button
                    className="book-table-submit-btn"
                    disabled={!selectedTable || loading}
                    type="submit"
                  >
                    {loading ? (
                      <span className="auth-spinner"></span>
                    ) : (
                      <>🍽️ Confirm Reservation</>
                    )}
                  </button>

                  {!user ? (
                    <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: "0.82rem" }}>
                      💡 To track your booking history, keep <Link to="/login" style={{ color: "var(--primary)", fontWeight: "600", textDecoration: "none" }}>Signed In</Link> or <Link to="/register" style={{ color: "var(--primary)", fontWeight: "600", textDecoration: "none" }}>Sign Up</Link>
                    </p>
                  ) : (
                    <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: "0.82rem" }}>
                      ✅ Logged in as <strong className="text-dark">{user.name}</strong>. Your booking will be saved to your history.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Success Popup */}
      {successData && (
        <div className="booking-success-overlay" onClick={handleCloseSuccess}>
          <div className="booking-success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-animation">
              <div className="success-checkmark">
                <div className="check-icon">
                  <span className="icon-line line-tip"></span>
                  <span className="icon-line line-long"></span>
                  <div className="icon-circle"></div>
                  <div className="icon-fix"></div>
                </div>
              </div>
            </div>
            <h2 className="font-heading mt-3" style={{ color: "var(--primary)" }}>Table Booked Successfully!</h2>
            <p className="text-muted mb-4">Your reservation has been confirmed. We look forward to serving you!</p>

            <div className="success-details">
              <div className="success-detail-row">
                <span className="sd-icon">🪑</span>
                <span className="sd-label">Table Number</span>
                <span className="sd-value">Table {successData.tableNumber}</span>
              </div>
              <div className="success-detail-row">
                <span className="sd-icon">📍</span>
                <span className="sd-label">Location</span>
                <span className="sd-value">{successData.location}</span>
              </div>
              <div className="success-detail-row">
                <span className="sd-icon">📅</span>
                <span className="sd-label">Date</span>
                <span className="sd-value">{new Date(successData.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
              <div className="success-detail-row">
                <span className="sd-icon">⏰</span>
                <span className="sd-label">Time</span>
                <span className="sd-value">{successData.time}</span>
              </div>
              <div className="success-detail-row">
                <span className="sd-icon">👥</span>
                <span className="sd-label">Guests</span>
                <span className="sd-value">{successData.guests} {Number(successData.guests) === 1 ? "Person" : "People"}</span>
              </div>
              <div className="success-detail-row">
                <span className="sd-icon">👤</span>
                <span className="sd-label">Booked By</span>
                <span className="sd-value">{successData.name}</span>
              </div>
            </div>

            <button className="btn btn-primary-custom w-100 mt-4 py-2 fw-semibold" onClick={handleCloseSuccess}>
              🏠 Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
