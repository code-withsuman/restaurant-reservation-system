import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const INITIAL_OFFERS = [
  { id: 1, code: "WELCOME20", title: "20% Off Welcome Offer", discount: "20%", type: "Percentage", minOrder: "₹500", status: "Active", usedCount: 142 },
  { id: 2, code: "ROYAL500", title: "₹500 Off Royal Buffet", discount: "₹500", type: "Fixed Amount", minOrder: "₹2500", status: "Active", usedCount: 89 },
  { id: 3, code: "WEEKEND15", title: "15% Weekend Special", discount: "15%", type: "Percentage", minOrder: "₹1000", status: "Active", usedCount: 204 },
  { id: 4, code: "FESTIVE300", title: "Festive Season Discount", discount: "₹300", type: "Fixed Amount", minOrder: "₹1500", status: "Expired", usedCount: 65 },
];

export default function OffersManagement() {
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [showModal, setShowModal] = useState(false);
  const [newOffer, setNewOffer] = useState({ code: "", title: "", discount: "", type: "Percentage", minOrder: "₹500" });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [deletingOffer, setDeletingOffer] = useState(null);

  function handleCreateOffer(e) {
    e.preventDefault();
    if (!newOffer.code || !newOffer.discount) {
      setMsg({ text: "Promo code and discount value are required.", type: "danger" });
      return;
    }
    const created = {
      id: Date.now(),
      code: newOffer.code.toUpperCase(),
      title: newOffer.title || `${newOffer.discount} Discount`,
      discount: newOffer.discount,
      type: newOffer.type,
      minOrder: newOffer.minOrder || "₹0",
      status: "Active",
      usedCount: 0,
    };
    setOffers([created, ...offers]);
    setMsg({ text: `Created new promo code ${created.code}!`, type: "success" });
    setShowModal(false);
    setNewOffer({ code: "", title: "", discount: "", type: "Percentage", minOrder: "₹500" });
  }

  function toggleStatus(id) {
    setOffers(
      offers.map((o) =>
        o.id === id ? { ...o, status: o.status === "Active" ? "Disabled" : "Active" } : o
      )
    );
  }

  function handleConfirmDeleteOffer() {
    if (!deletingOffer) return;
    setOffers(offers.filter((o) => o.id !== deletingOffer.id));
    setDeletingOffer(null);
  }

  return (
    <DashboardLayout title="Offers & Coupons Management">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="font-heading fw-bold mb-1">Promotions &amp; Voucher Coupons</h3>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
            Create, edit, and monitor discount coupons and promotional campaigns.
          </p>
        </div>
        <button className="btn btn-primary-custom px-4 py-2 fw-semibold" onClick={() => setShowModal(true)}>
          ➕ Create New Coupon
        </button>
      </div>

      {msg.text && (
        <div className={`alert alert-${msg.type} alert-dismissible fade show rounded-3 mb-4`} role="alert">
          {msg.text}
          <button type="button" className="btn-close" onClick={() => setMsg({ text: "", type: "" })}></button>
        </div>
      )}

      {/* Offers Cards Grid */}
      <div className="row g-4 mb-4">
        {offers.map((offer) => (
          <div className="col-12 col-md-6 col-xl-3" key={offer.id}>
            <div className="card-plain p-4 rounded-4 shadow-sm border h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge bg-warning text-dark px-3 py-1 rounded-pill font-mono fw-bold" style={{ fontSize: "0.9rem" }}>
                    🏷️ {offer.code}
                  </span>
                  <span
                    className={`badge px-2.5 py-1 rounded-pill ${
                      offer.status === "Active" ? "bg-success text-white" : "bg-secondary text-white"
                    }`}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {offer.status}
                  </span>
                </div>

                <h5 className="font-heading fw-bold mb-1">{offer.title}</h5>
                <div className="display-6 font-heading fw-bold text-danger mb-2">{offer.discount}</div>
                <div className="text-muted mb-3" style={{ fontSize: "0.85rem" }}>
                  Minimum Spend: <strong>{offer.minOrder}</strong>
                </div>
              </div>

              <div className="pt-3 border-top d-flex align-items-center justify-content-between">
                <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Used: <strong>{offer.usedCount} times</strong>
                </span>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleStatus(offer.id)}>
                    {offer.status === "Active" ? "Disable" : "Enable"}
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => setDeletingOffer(offer)}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="cancel-modal-overlay">
          <div className="cancel-modal-card text-start">
            <h4 className="font-heading fw-bold mb-1">Create Discount Coupon</h4>
            <p className="text-muted mb-4" style={{ fontSize: "0.88rem" }}>
              Configure a promotional promo code for dining vouchers.
            </p>

            <form onSubmit={handleCreateOffer}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Coupon Code</label>
                <input
                  type="text"
                  className="form-control font-mono text-uppercase"
                  placeholder="e.g. FESTIVE20"
                  value={newOffer.code}
                  onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Offer Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 20% Off Festive Feast"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold">Discount Type</label>
                  <select
                    className="form-select"
                    value={newOffer.type}
                    onChange={(e) => setNewOffer({ ...newOffer, type: e.target.value })}
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed Amount">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold">Discount Value</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 20% or ₹300"
                    value={newOffer.discount}
                    onChange={(e) => setNewOffer({ ...newOffer, discount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Minimum Order Amount</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. ₹1000"
                  value={newOffer.minOrder}
                  onChange={(e) => setNewOffer({ ...newOffer, minOrder: e.target.value })}
                />
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light flex-fill" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary-custom flex-fill">
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Offer Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingOffer}
        title={`Delete Coupon "${deletingOffer?.code}"?`}
        message={
          <>
            Are you sure you want to delete coupon <strong className="text-dark">{deletingOffer?.code}</strong> ({deletingOffer?.title})? This promo code will no longer be usable by customers.
          </>
        }
        onConfirm={handleConfirmDeleteOffer}
        onClose={() => setDeletingOffer(null)}
      />
    </DashboardLayout>
  );
}
