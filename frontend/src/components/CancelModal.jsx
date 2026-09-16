import React from "react";

export default function CancelModal({ reservation, onConfirm, onClose, loading }) {
  if (!reservation) return null;

  return (
    <div className="cancel-modal-overlay" onClick={onClose}>
      <div className="cancel-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="cancel-modal-icon">⚠️</div>
        <h4 className="font-heading fw-bold mt-3 mb-2 text-dark">Cancel Reservation?</h4>
        <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
          Are you sure you want to cancel the reservation for{" "}
          <strong className="text-dark">{reservation.customerName || "this booking"}</strong> on{" "}
          <strong className="text-dark">{reservation.date} at {reservation.time}</strong>?
        </p>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary flex-fill py-2 fw-semibold rounded-3"
            onClick={onClose}
            disabled={loading}
          >
            No, Keep Booking
          </button>
          <button
            className="btn btn-danger flex-fill py-2 fw-semibold rounded-3"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Cancelling..." : "Yes, Cancel Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
