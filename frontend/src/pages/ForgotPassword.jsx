import React, { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
          <h1>Reset Password</h1>
          <p>Don't worry! It happens. We'll help you get back into your account.</p>
          <div className="auth-hero-features">
            <div className="auth-hero-feature">
              <span className="auth-feature-icon">🔐</span>
              <span>Secure Reset Process</span>
            </div>
            <div className="auth-hero-feature">
              <span className="auth-feature-icon">📧</span>
              <span>Email Verification</span>
            </div>
            <div className="auth-hero-feature">
              <span className="auth-feature-icon">⚡</span>
              <span>Instant Recovery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Forgot Password?</h2>
            <p className="text-muted">Enter your email and we'll send you reset instructions</p>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <span>⚠️</span> {error}
            </div>
          )}
          {message && (
            <div className="auth-alert auth-alert-success">
              <span>✅</span> {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Account Email</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <span className="auth-spinner"></span>
              ) : (
                "Send Reset Instructions"
              )}
            </button>
          </form>

          <p className="auth-switch">
            Remember your password? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
