import React from "react";

const STATUS_CLASS = {
  Available: "status-available",
  Reserved: "status-reserved",
  Occupied: "status-occupied",
  Cleaning: "status-cleaning",
};

export default function TableCard({ table, onStatusChange, onEdit, onDelete, actionable = true }) {
  const cls = STATUS_CLASS[table.status] || "status-available";

  return (
    <div className={`seat-card ${cls}`}>
      {/* Top Section: Avatar Circle + Table Title & Status Pill */}
      <div className="d-flex align-items-center gap-3">
        <div className="seat-dot flex-shrink-0">T{table.number}</div>
        <div className="flex-grow-1" style={{ minWidth: 0 }}>
          <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
            <span className="fw-bold text-dark text-nowrap" style={{ fontSize: "1.05rem" }}>
              Table {table.number}
            </span>
            <span className="status-pill">{table.status}</span>
          </div>
          <div className="text-secondary" style={{ fontSize: "0.84rem" }}>
            Seats {table.capacity} · {table.location}
          </div>
        </div>
      </div>

      {/* Bottom Section: Action Controls (Status Dropdown + Edit/Delete Buttons) */}
      {actionable && (
        <div className="d-flex align-items-center gap-2 mt-1">
          {onStatusChange && (
            <select
              className="form-select form-select-sm font-mono flex-grow-1"
              value={table.status}
              onChange={(e) => onStatusChange(table.id, e.target.value)}
              style={{ fontSize: "0.82rem", cursor: "pointer" }}
            >
              {Object.keys(STATUS_CLASS).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}

          <div className="d-flex gap-1.5 flex-shrink-0">
            {onEdit && (
              <button
                className="btn tbl-edit-btn d-flex align-items-center gap-1"
                onClick={() => onEdit(table)}
                title="Edit Table Details"
              >
                <span>✏️</span> Edit
              </button>
            )}
            {onDelete && (
              <button
                className="btn tbl-delete-btn d-flex align-items-center gap-1"
                onClick={() => onDelete(table.id)}
                title="Delete Table"
              >
                <span>🗑️</span> Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
