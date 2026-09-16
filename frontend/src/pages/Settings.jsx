import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function Settings() {
  const [settings, setSettings] = useState({
    name: "Desi Delight Hotels & Restaurant",
    tagline: "Where Tradition Meets Luxury Dining",
    phone: "+91 98765 43210",
    email: "info@desidelighthotels.com",
    address: "Grand Luxury Boulevard, Sector 18, City Center",
    openHours: "11:00 AM – 11:30 PM",
    currency: "₹",
    gstPercent: 5,
    serviceCharge: 10,
    maxTableCapacity: 12,
  });

  const [saved, setSaved] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <DashboardLayout title="Restaurant Settings">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="font-heading fw-bold mb-1">Restaurant Profile &amp; Operating Settings</h3>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
            Configure global restaurant details, opening hours, taxation, and billing settings.
          </p>
        </div>
      </div>

      {saved && (
        <div className="alert alert-success alert-dismissible fade show rounded-3 mb-4" role="alert">
          ✅ Restaurant settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4 mb-4">
          {/* General Information */}
          <div className="col-12 col-lg-6">
            <div className="card-plain p-4 rounded-4 shadow-sm border h-100">
              <h5 className="font-heading fw-bold mb-3 text-warning">🏛️ General Information</h5>

              <div className="mb-3">
                <label className="form-label fw-semibold">Restaurant Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Tagline &amp; Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Contact Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Official Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-0">
                <label className="form-label fw-semibold">Physical Address</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Billing & Operations */}
          <div className="col-12 col-lg-6">
            <div className="card-plain p-4 rounded-4 shadow-sm border h-100">
              <h5 className="font-heading fw-bold mb-3 text-warning">⚙️ Billing &amp; Operating Parameters</h5>

              <div className="mb-3">
                <label className="form-label fw-semibold">Opening Hours</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.openHours}
                  onChange={(e) => setSettings({ ...settings, openHours: e.target.value })}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold">Currency Symbol</label>
                  <input
                    type="text"
                    className="form-control font-mono fw-bold"
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold">GST Rate (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={settings.gstPercent}
                    onChange={(e) => setSettings({ ...settings, gstPercent: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold">Service Charge (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={settings.serviceCharge}
                    onChange={(e) => setSettings({ ...settings, serviceCharge: Number(e.target.value) })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold">Max Table Capacity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={settings.maxTableCapacity}
                    onChange={(e) => setSettings({ ...settings, maxTableCapacity: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-primary-custom px-5 py-2.5 fw-bold fs-6">
            💾 Save Restaurant Settings
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
