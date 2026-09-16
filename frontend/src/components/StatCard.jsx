import React from "react";

export default function StatCard({ label, value, icon, iconBg }) {
  return (
    <div
      className="stat-card-modern rounded-4 shadow-sm border h-100 d-flex flex-column justify-content-between p-3"
      style={{
        minHeight: "108px",
        transition: "all 0.25s ease",
      }}
    >
      <div className="d-flex align-items-center justify-content-between gap-2">
        <span
          className="stat-card-label text-uppercase fw-bold opacity-85"
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.5px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </span>
        {icon && (
          <div
            className="stat-icon-wrapper rounded-circle d-flex align-items-center justify-content-center shadow-sm"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: iconBg || "var(--primary)",
              color: "#ffffff",
              fontSize: "1.1rem",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
      </div>
      <div
        className="stat-card-value font-heading fw-bold mt-2"
        style={{ fontSize: "1.75rem", lineHeight: 1 }}
      >
        {value}
      </div>
    </div>
  );
}
