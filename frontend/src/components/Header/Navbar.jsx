import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleNavClick() {
    setMobileMenuOpen(false);
  }

  function handleLogoClick(e) {
    e.preventDefault();
    if (window.location.pathname === "/") {
      window.location.reload();
    } else {
      window.location.href = "/";
    }
  }

  return (
    <header className="main-header">
      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand Logo */}
        <a href="/" onClick={handleLogoClick} className="brand-logo text-decoration-none">
          <img
            src="/logo.png"
            onError={(e) => { e.target.onerror = null; e.target.src = "/logo.svg"; }}
            alt="Desi Delight Hotels & Restaurant"
            className="header-logo"
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="d-none d-xl-flex align-items-center gap-2">
          <Link to="/" className="nav-link-custom">Home</Link>
          <Link to="/about" className="nav-link-custom">About</Link>
          <Link to="/dishes" className="nav-link-custom">Dishes</Link>
          <Link to="/our-menu" className="nav-link-custom">Menu</Link>
          <Link to="/offers" className="nav-link-custom">Offers</Link>
          <Link to="/gallery" className="nav-link-custom">Gallery</Link>
          <Link to="/contact" className="nav-link-custom">Contact</Link>
        </nav>

        {/* Header Right Actions */}
        <div className="d-flex align-items-center gap-2">
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

          {isAuthenticated ? (
            <div className="d-none d-sm-flex align-items-center gap-2">
              <Link to="/dashboard" className="btn btn-sm nav-dashboard-btn rounded-pill px-3 fw-medium">
                Dashboard ({user?.name?.split(" ")[0] || "User"})
              </Link>
              <button onClick={handleLogout} className="btn btn-sm btn-link text-muted text-decoration-none">
                Logout
              </button>
            </div>
          ) : (
            <div className="d-none d-sm-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-secondary-custom btn-sm px-3 py-2 fw-semibold text-nowrap">
                Login/SignUp
              </Link>
            </div>
          )}

          <Link to="/book-table" className="btn btn-primary-custom btn-sm px-3 py-2 fw-semibold text-nowrap">
            Book a Table
          </Link>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            className="btn btn-sm btn-outline-dark d-xl-none ms-1 px-2 py-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            <i className={mobileMenuOpen ? "bi bi-x-lg fs-5" : "bi bi-list fs-5"}></i>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer d-xl-none mt-2">
          <div className="container">
            <nav className="d-flex flex-column gap-2 mb-3">
              <Link to="/" className="nav-link-custom py-2" onClick={handleNavClick}>Home</Link>
              <Link to="/about" className="nav-link-custom py-2" onClick={handleNavClick}>About Us</Link>
              <Link to="/dishes" className="nav-link-custom py-2" onClick={handleNavClick}>Featured Dishes</Link>
              <Link to="/menu-page" className="nav-link-custom py-2" onClick={handleNavClick}>Our Menu</Link>
              <Link to="/offers" className="nav-link-custom py-2" onClick={handleNavClick}>Special Offers</Link>
              <Link to="/gallery" className="nav-link-custom py-2" onClick={handleNavClick}>Gallery</Link>
              <Link to="/contact" className="nav-link-custom py-2" onClick={handleNavClick}>Contact Us</Link>
            </nav>

            <div className="pt-2 border-top border-light d-flex flex-column gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="btn nav-dashboard-btn w-100 rounded-pill fw-medium" onClick={handleNavClick}>
                    Dashboard ({user?.name || "User"})
                  </Link>
                  <button onClick={() => { handleLogout(); handleNavClick(); }} className="btn btn-link text-danger text-decoration-none">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-outline-dark w-100 fw-semibold" onClick={handleNavClick}>
                  Login/SignUp
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
