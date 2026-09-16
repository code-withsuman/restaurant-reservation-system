import React from "react";

const STATUS_BADGES = {
  Confirmed: { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0", icon: "📌" },
  Seated:    { bg: "#fef3c7", color: "#b45309", border: "#fde68a", icon: "🍽️" },
  Completed: { bg: "#e0f2fe", color: "#0369a1", border: "#bae6fd", icon: "✅" },
  Cancelled: { bg: "#fee2e2", color: "#b91c1c", border: "#fecaca", icon: "❌" },
};

export default function ReservationCard({ reservation, actions }) {
  const badge = STATUS_BADGES[reservation.status] || {
    bg: "#f3f4f6",
    color: "#4b5563",
    border: "#e5e7eb",
    icon: "📋",
  };

  return (
    <div className="card-plain h-100 p-4 shadow-sm border rounded-4 d-flex flex-column justify-content-between bg-white">
      <div>
        {/* Top Header: Customer Name & Status Badge */}
        <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
          <div style={{ minWidth: 0 }}>
            <h5 className="font-heading fw-bold mb-0 text-dark text-truncate" style={{ fontSize: "1.15rem" }}>
              {reservation.customerName}
            </h5>
          </div>
          <span
            className="status-pill px-3 py-1 rounded-pill font-mono fw-semibold flex-shrink-0"
            style={{
              backgroundColor: badge.bg,
              color: badge.color,
              border: `1px solid ${badge.border}`,
              fontSize: "0.78rem",
              whiteSpace: "nowrap",
            }}
          >
            {badge.icon} {reservation.status}
          </span>
        </div>

        {/* Contact */}
        <div className="text-muted mb-3" style={{ fontSize: "0.85rem" }}>
          📞 {reservation.phone}
        </div>

        {/* Details Box */}
        <div className="reservation-details-box p-3 rounded-3 mb-2">
          <div className="row g-2 align-items-center" style={{ fontSize: "0.85rem" }}>
            <div className="col-6">
              <span className="text-muted d-block fw-semibold mb-1" style={{ fontSize: "0.68rem", letterSpacing: "0.5px" }}>DATE & TIME</span>
              <div className="fw-bold date-val" style={{ whiteSpace: "nowrap" }}>📅 {reservation.date}</div>
              <div className="text-muted" style={{ fontSize: "0.82rem" }}>⏰ {reservation.time}</div>
            </div>
            <div className="col-6 text-end">
              <span className="text-muted d-block fw-semibold mb-1" style={{ fontSize: "0.68rem", letterSpacing: "0.5px" }}>TABLE & GUESTS</span>
              <div className="fw-bold table-val" style={{ color: "var(--primary)", whiteSpace: "nowrap" }}>🪑 Table {reservation.tableNumber}</div>
              <div className="text-muted" style={{ fontSize: "0.82rem" }}>👥 {reservation.guests} Guests</div>
            </div>
          </div>
        </div>
      </div>

      {actions && <div className="pt-3 border-top border-light d-flex gap-2">{actions}</div>}
    </div>
  );
}
