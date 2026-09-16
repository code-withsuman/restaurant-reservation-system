import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
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
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleManagementPortal() {
    setEmail("admin@desidelighthotels.com");
    setPassword("admin123");
  }

  return (
    <div className="auth-page">
      {/* Left decorative panel */}
      <div className="auth-hero">
        <div className="auth-hero-overlay"></div>
        <div className="auth-hero-content">
          <img
            src="/logo.png"
            onError={(e) => { e.target.onerror = null; e.target.src = "/logo.svg"; }}
            alt="Desi Delight"
            className="auth-hero-logo"
          />
          <h1>Welcome Back</h1>
          <p>Experience fine dining, authentic spices, and handcrafted culinary masterpieces.</p>
          <div className="auth-hero-features">
            <div className="auth-hero-feature">
              <span className="auth-feature-icon">🍽️</span>
              <span>Reserve Tables Online</span>
            </div>
            <div className="auth-hero-feature">
              <span className="auth-feature-icon">⭐</span>
              <span>Premium Dining Experience</span>
            </div>
            <div className="auth-hero-feature">
              <span className="auth-feature-icon">🎉</span>
              <span>Exclusive Member Offers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Sign In</h2>
            <p className="text-muted">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Email Address or Contact Number</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">📱</span>
                <input
                  type="text"
                  placeholder="Email address or contact number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
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

            <div className="auth-options">
              <label className="auth-checkbox">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="auth-forgot-link">
                Forgot password?
              </Link>
            </div>

            <button className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <span className="auth-spinner"></span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <Link
            to="/management-login"
            className="auth-management-btn text-decoration-none"
          >
            🏢 Login to Management Portal
          </Link>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
