import React from "react";

export default function DeleteTableModal({ table, onConfirm, onClose, loading }) {
  if (!table) return null;

  return (
    <div className="cancel-modal-overlay" onClick={onClose}>
      <div className="cancel-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="cancel-modal-icon">🗑️</div>
        <h4 className="font-heading fw-bold mt-3 mb-2 text-dark">Delete Table {table.number}?</h4>
        <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
          Are you sure you want to permanently remove <strong className="text-dark">Table {table.number}</strong> ({table.capacity} Seats, {table.location})? This action cannot be undone.
        </p>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary flex-fill py-2 fw-semibold rounded-3"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger flex-fill py-2 fw-semibold rounded-3"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete Table"}
          </button>
        </div>
      </div>
    </div>
  );
}
