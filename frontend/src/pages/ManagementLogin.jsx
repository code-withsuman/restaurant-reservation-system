import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ManagementLogin() {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== "admin" && user.role !== "staff") {
        setError(`Access denied. This portal is for Management (Admin/Staff) only.`);
        setLoading(false);
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function prefillAdmin() {
    setRole("admin");
    setEmail("admin@desidelighthotels.com");
    setPassword("admin123");
  }

  function prefillStaff() {
    setRole("staff");
    setEmail("staff@desidelighthotels.com");
    setPassword("staff123");
  }

  return (
    <div className="auth-page">
      {/* Left decorative management panel */}
      <div className="auth-hero" style={{ background: "linear-gradient(135deg, #100605 0%, #2A0907 40%, #1A1210 100%)" }}>
        <div className="auth-hero-overlay"></div>
        <div className="auth-hero-content">
          <img
            src="/logo.png"
            onError={(e) => { e.target.onerror = null; e.target.src = "/logo.svg"; }}
            alt="Desi Delight"
            className="auth-hero-logo"
          />
          <h1 style={{ color: "var(--secondary)" }}>Management Portal</h1>
          <p>Restricted Operations & Administrative Control Panel for Desi Delight Hotels & Restaurant.</p>
          <div className="auth-hero-features">
            <div className="auth-hero-feature">
              <span className="auth-feature-icon">📊</span>
              <span>Live Reservation Monitoring</span>
            </div>
            <div className="auth-hero-feature">
              <span className="auth-feature-icon">🍽️</span>
              <span>Table & Floor Plan Control</span>
            </div>
            <div className="auth-hero-feature">
              <span className="auth-feature-icon">📈</span>
              <span>Revenue Reports & Billing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card-header text-center">
            <span className="badge bg-warning text-dark px-3 py-1.5 rounded-pill mb-2 fw-semibold">
              🔒 Executive Sign In
            </span>
            <h2 className="font-heading">Management Sign In</h2>
            <p className="text-muted">Select your role and enter authorized credentials</p>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role Dropdown Selector */}
            <div className="auth-field">
              <label>Select Management Role</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">👔</span>
                <select
                  className="form-select border-0 shadow-none bg-transparent py-2.5 px-3 font-medium"
                  style={{ fontSize: "0.92rem", cursor: "pointer" }}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="admin">Admin (System Administrator)</option>
                  <option value="staff">Staff Member (Floor Manager / Server)</option>
                </select>
              </div>
            </div>

            {/* Email / Contact Number Field */}
            <div className="auth-field">
              <label>Email Address or Contact Number</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉</span>
                <input
                  type="text"
                  placeholder="admin@desidelighthotels.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button className="auth-submit-btn mt-3" disabled={loading}>
              {loading ? (
                <span className="auth-spinner"></span>
              ) : (
                `Sign In as ${role === "admin" ? "Admin" : "Staff Member"}`
              )}
            </button>
          </form>

          {/* Quick Prefill Buttons */}
          <div className="auth-divider">
            <span>Quick Demo Credentials</span>
          </div>

          <div className="d-flex gap-2 mb-3">
            <button
              type="button"
              className="btn btn-outline-warning btn-sm flex-fill rounded-pill fw-semibold"
              onClick={prefillAdmin}
            >
              👑 Fill Admin Demo
            </button>
            <button
              type="button"
              className="btn btn-outline-info btn-sm flex-fill rounded-pill fw-semibold"
              onClick={prefillStaff}
            >
              💼 Fill Staff Demo
            </button>
          </div>

          <p className="auth-switch text-center mb-0">
            <Link to="/login" className="text-decoration-none">
              ← Back to Customer Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
