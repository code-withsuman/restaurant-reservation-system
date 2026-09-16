import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: "▣", roles: ["admin", "staff", "customer"] },
  { to: "/tables", label: "Tables", icon: "◎", roles: ["admin", "staff"] },
  { to: "/reservations", label: "Reservations", icon: "▤", roles: ["admin", "staff", "customer"] },
  { to: "/customers", label: "Customers", icon: "☺", roles: ["admin", "staff"] },
  { to: "/staff-management", label: "Staff", icon: "👥", roles: ["admin"] },
  { to: "/menu", label: "Menu", icon: "❧", roles: ["admin", "staff"] },
  { to: "/orders", label: "Orders", icon: "▦", roles: ["admin", "staff"] },
  { to: "/payments", label: "Payments", icon: "¤", roles: ["admin", "staff"] },
  { to: "/offers-management", label: "Offers & Coupons", icon: "🏷️", roles: ["admin"] },
  { to: "/reports", label: "Reports", icon: "▧", roles: ["admin"] },
  { to: "/feedback", label: "Feedback", icon: "💬", roles: ["admin", "staff", "customer"] },
  { to: "/settings", label: "Settings", icon: "⚙️", roles: ["admin"] },
];

export default function Sidebar({ open, onNavigate, onClose, onRequestLogout }) {
  const { user, logout } = useAuth();
  const role = user?.role || "customer";
  const visible = LINKS.filter((l) => l.roles.includes(role));

  function handleLogout(e) {
    e.preventDefault();
    e.stopPropagation();
    if (onClose) onClose();
    if (onRequestLogout) {
      onRequestLogout();
    } else {
      logout();
    }
  }

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      {/* Mobile Close Button */}
      <button
        className="sidebar-close-btn d-lg-none"
        onClick={onClose || onNavigate}
        aria-label="Close sidebar"
      >
        ✕
      </button>

      {/* Transparent Brand Logo */}
      <div className="text-center py-2 mb-3">
        <img
          src="/logo.png"
          onError={(e) => { e.target.onerror = null; e.target.src = "/logo.svg"; }}
          alt="Desi Delight Hotels & Restaurant"
          style={{ height: "54px", maxWidth: "100%", objectFit: "contain" }}
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow-1">
        {visible.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <span aria-hidden="true" style={{ fontSize: "1.1rem" }}>{link.icon}</span> {link.label}
          </NavLink>
        ))}
      </nav>

      {/* User Profile Card & Logout Icon at Bottom */}
      <div className="sidebar-user-card mt-auto pt-3 border-top border-secondary border-opacity-25">
        <div className="d-flex align-items-center justify-content-between p-2 rounded-3 hover-user-card" style={{ transition: "background 0.2s" }}>
          <NavLink
            to="/profile"
            onClick={onNavigate}
            className="d-flex align-items-center gap-2 text-decoration-none flex-grow-1"
            style={{ minWidth: 0 }}
            title="View & Edit Profile"
          >
            <div
              className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
              style={{ width: "34px", height: "34px", fontSize: "0.85rem" }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="text-white text-truncate fw-semibold" style={{ fontSize: "0.83rem" }}>
                {user?.name || "Guest"}
              </div>
              <div className="text-warning text-capitalize" style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}>
                ● {role}
              </div>
            </div>
          </NavLink>

          {/* Logout Icon Button (Lucide LogOut) */}
          <button
            onClick={handleLogout}
            className="btn btn-sm text-white-50 p-1.5 border-0 rounded-2 sidebar-logout-btn flex-shrink-0 d-flex align-items-center justify-content-center"
            title="Sign Out / Logout"
            aria-label="Sign Out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
          </button>
        </div>
      </div>
    </aside>
  );
}
