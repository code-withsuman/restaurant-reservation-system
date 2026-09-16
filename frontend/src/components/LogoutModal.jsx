import React from "react";

export default function LogoutModal({ isOpen, onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="cancel-modal-overlay" onClick={onClose}>
      <div className="cancel-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="cancel-modal-icon" style={{ background: "#fff1f2", color: "#dc2626", borderColor: "#fecdd3" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>
        <h4 className="font-heading fw-bold mt-3 mb-2 text-dark">Log Out of Your Account?</h4>
        <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
          Are you sure you want to sign out? You will need to log in again to manage your bookings and account settings.
        </p>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary flex-fill py-2 fw-semibold rounded-3"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger flex-fill py-2 fw-semibold rounded-3"
            onClick={onConfirm}
          >
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
