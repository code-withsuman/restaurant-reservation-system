import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import LogoutModal from "./LogoutModal";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ title, children }) {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuth();

  function handleConfirmLogout() {
    setShowLogoutModal(false);
    logout();
  }

  return (
    <div className="app-shell">
      {/* Backdrop for mobile drawer */}
      {open && (
        <div
          className="sidebar-backdrop d-lg-none"
          onClick={() => setOpen(false)}
        />
      )}

      <Sidebar
        open={open}
        onNavigate={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onRequestLogout={() => setShowLogoutModal(true)}
      />

      <div className="main-content">
        <Navbar
          title={title}
          onMenuClick={() => setOpen((o) => !o)}
          onRequestLogout={() => setShowLogoutModal(true)}
        />
        <div className="page-wrap">{children}</div>
      </div>

      {/* Logout Confirmation Modal Popup */}
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleConfirmLogout}
        onClose={() => setShowLogoutModal(false)}
      />
    </div>
  );
}
