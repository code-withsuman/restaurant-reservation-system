import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ title, onMenuClick, onRequestLogout }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogoutClick() {
    setDropdownOpen(false);
    if (onRequestLogout) {
      onRequestLogout();
    } else {
      logout();
    }
  }

  return (
    <header className="topbar d-flex align-items-center justify-content-between px-4 py-3 bg-white border-bottom shadow-sm position-relative">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-sm btn-outline-dark d-lg-none"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <h4 className="mb-0 font-heading fw-bold">{title}</h4>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* Dark / Light Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0"
          style={{ width: "36px", height: "36px", fontSize: "1.1rem" }}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* Transparent Profile Card Container Without Outline */}
        <div className="position-relative" ref={dropdownRef}>
          <div
            className="user-profile-trigger d-flex align-items-center gap-3 px-2 py-1 rounded-3 user-select-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ cursor: "pointer" }}
            title="Click for Profile Options"
          >
            {/* Avatar Circle */}
            <div
              className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0 shadow-sm"
              style={{ width: "36px", height: "36px", fontSize: "0.9rem" }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            {/* Name & Role Pill Badge Below Name */}
            <div className="d-none d-sm-flex flex-column text-start ms-1" style={{ minWidth: 0 }}>
              <div className="fw-bold text-dark text-truncate" style={{ fontSize: "0.86rem", lineHeight: 1.2 }}>
                {user?.name || "Guest"}
              </div>
              <span
                className={`badge text-capitalize rounded-pill align-self-start mt-1 ${
                  user?.role === "admin"
                    ? "role-badge-admin"
                    : user?.role === "staff"
                    ? "role-badge-staff"
                    : "role-badge-customer"
                }`}
                style={{
                  fontSize: "0.64rem",
                  fontWeight: 600,
                  padding: "0.15rem 0.55rem",
                  letterSpacing: "0.3px",
                  lineHeight: 1,
                }}
              >
                ● {user?.role || "customer"}
              </span>
            </div>
          </div>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div
              className="topbar-dropdown-menu position-absolute end-0 mt-2 py-2 shadow-lg border rounded-3 bg-white"
              style={{ width: "210px", zIndex: 1050 }}
            >
              <div className="px-3 py-2 border-bottom mb-1">
                <div className="fw-bold text-dark text-truncate" style={{ fontSize: "0.9rem" }}>
                  {user?.name}
                </div>
                <div className="text-muted text-truncate" style={{ fontSize: "0.78rem" }}>
                  {user?.email || user?.phone}
                </div>
              </div>

              <Link
                to="/profile"
                className="dropdown-item px-3 py-2 d-flex align-items-center gap-2 text-decoration-none text-dark"
                onClick={() => setDropdownOpen(false)}
              >
                <span style={{ fontSize: "1.05rem" }}>👤</span>
                <span className="fw-medium" style={{ fontSize: "0.88rem" }}>My Profile</span>
              </Link>

              <div className="dropdown-divider my-1"></div>

              <button
                className="dropdown-item px-3 py-2 d-flex align-items-center gap-2 text-danger w-100 text-start border-0 bg-transparent cursor-pointer"
                onClick={handleLogoutClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  className="flex-shrink-0"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span className="fw-semibold" style={{ fontSize: "0.88rem" }}>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
