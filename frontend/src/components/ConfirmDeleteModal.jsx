import React from "react";

export default function ConfirmDeleteModal({
  isOpen,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  onConfirm,
  onClose,
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="cancel-modal-overlay" onClick={onClose}>
      <div className="cancel-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="cancel-modal-icon">🗑️</div>
        <h4 className="font-heading fw-bold mt-3 mb-2 text-dark">{title}</h4>
        <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
          {message}
        </p>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary flex-fill py-2 fw-semibold rounded-3"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="btn btn-danger flex-fill py-2 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
