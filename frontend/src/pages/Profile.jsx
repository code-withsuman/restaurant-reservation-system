import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      setSaved(true);
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout title="Account Settings">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5">
            {/* Header Avatar Card */}
            <div className="d-flex align-items-center gap-3 pb-4 mb-4 border-bottom">
              <div
                className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold text-uppercase shadow-sm flex-shrink-0"
                style={{ width: "64px", height: "64px", fontSize: "1.8rem" }}
              >
                {user?.name ? user.name.charAt(0) : "U"}
              </div>
              <div style={{ minWidth: 0 }}>
                <h4 className="font-heading fw-bold mb-1 text-dark text-truncate">{user?.name || "Guest User"}</h4>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-1 rounded-pill text-capitalize fw-semibold" style={{ fontSize: "0.78rem" }}>
                    ● {user?.role || "Customer"} Account
                  </span>
                </div>
              </div>
            </div>

            {saved && (
              <div className="alert alert-success border-0 rounded-3 d-flex align-items-center gap-2 py-3 mb-4">
                <span>✅</span> Profile changes saved successfully!
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="fw-semibold text-muted mb-1" style={{ fontSize: "0.82rem" }}>Full Name</label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-3 fs-6"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="fw-semibold text-muted mb-1" style={{ fontSize: "0.82rem" }}>Phone Number</label>
                <input
                  type="tel"
                  className="form-control form-control-lg rounded-3 fs-6"
                  required
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="fw-semibold text-muted mb-1" style={{ fontSize: "0.82rem" }}>Email Address (Read-only)</label>
                <input
                  type="email"
                  className="form-control form-control-lg rounded-3 fs-6 bg-light text-muted"
                  value={user?.email || ""}
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="fw-semibold text-muted mb-1" style={{ fontSize: "0.82rem" }}>Role Access</label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-3 fs-6 bg-light text-muted text-capitalize"
                  value={user?.role || "customer"}
                  disabled
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary-custom w-100 py-3 fw-semibold rounded-3 shadow-sm"
                disabled={loading}
              >
                {loading ? "Saving Changes..." : "Save Profile Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
