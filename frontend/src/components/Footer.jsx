import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  function handleLogoClick(e) {
    e.preventDefault();
    if (window.location.pathname === "/") {
      window.location.reload();
    } else {
      window.location.href = "/";
    }
  }

  return (
    <footer className="footer-section pt-5 pb-4 px-4 mt-auto">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Col 1: Brand & Bio */}
          <div className="col-12 col-md-4">
            <a href="/" onClick={handleLogoClick} className="d-inline-block text-decoration-none">
              <img
                src="/logo.png"
                onError={(e) => { e.target.onerror = null; e.target.src = "/logo.svg"; }}
                alt="Desi Delight Hotels & Restaurant"
                className="footer-logo mb-3"
              />
            </a>
            <p style={{ fontSize: "0.9rem", color: "#B8ACA0" }}>
              Experience fine dining, authentic spices, and handcrafted culinary masterpieces at Desi Delight Hotels &amp; Restaurant. Where tradition meets luxury.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="social-circle-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.298.04 1.05.22 1.63.42 2.138.2.52.464.96.923 1.417.457.458.897.722 1.417.922.508.2 1.087.336 2.138.375.853.039 1.126.048 3.299.048 2.171 0 2.445-.01 3.298-.048 1.05-.04 1.63-.2 2.138-.42.52-.2.96-.464 1.417-.923.458-.457.722-.897.923-1.417.2-.507.336-1.087.375-2.138.039-.853.048-1.126.048-3.299 0-2.172-.01-2.445-.048-3.298-.04-1.05-.22-1.63-.42-2.138a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-2.14-.373C10.247.01 9.974 0 7.999 0zm.045 1.44c2.134 0 2.387.007 3.231.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.844.047 1.097.047 3.331s-.008 2.488-.047 3.332c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.331.047s-2.488-.008-3.332-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.331 0-2.234.008-2.486.046-3.331.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.844-.038 1.096-.047 3.332-.047zM8 3.892a4.108 4.108 0 1 0 0 8.216 4.108 4.108 0 0 0 0-8.216zm0 6.775a2.667 2.667 0 1 1 0-5.334 2.667 2.667 0 0 1 0 5.334zm5.23-6.937a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="social-circle-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="social-circle-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.6 1h2.454l-5.36 6.126L16 15h-4.937l-3.867-5.07-4.425 5.07H0.316l5.733-6.554L0 1h5.063l3.495 4.62L12.6 1zm-.86 12.57h1.36L4.323 2.37H2.863l8.877 11.201z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="social-circle-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022 1.077.001.213v1.39l-.001.213-.022 1.077-.01.104c-.048.519-.119 1.023-.22 1.402a2.007 2.007 0 0 1-1.415 1.42c-1.123.302-5.288.332-6.11.335h-.089c-.822-.003-4.987-.033-6.11-.335a2.01 2.01 0 0 1-1.415-1.42c-.101-.38-.172-.883-.22-1.402l-.01-.104-.022-1.077-.001-.213v-1.39l.001-.213.022-1.077.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c1.123-.302 5.288-.332 6.11-.335zM6.237 5.5v5l4.33-2.5-4.33-2.5z"/>
                </svg>
              </a>
            </div>
          </div>

            {/* Col 2: Quick Links */}
            <div className="col-6 col-md-2">
              <h6 className="eyebrow text-warning mb-3">Quick Links</h6>
              <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: "0.9rem" }}>
                <li><Link to="/" className="text-decoration-none">Home</Link></li>
                <li><Link to="/about" className="text-decoration-none">About Us</Link></li>
                <li><Link to="/our-menu" className="text-decoration-none">Our Menu</Link></li>
                <li><Link to="/offers" className="text-decoration-none">Special Offers</Link></li>
                <li><Link to="/book-table" className="text-decoration-none">Book Table</Link></li>
              </ul>
            </div>

          {/* Col 3: Working Hours */}
          <div className="col-6 col-md-3">
            <h6 className="eyebrow text-warning mb-3">Opening Hours</h6>
            <ul className="list-unstyled style-none" style={{ fontSize: "0.88rem", color: "#B8ACA0" }}>
              <li className="mb-2"><strong className="text-white">Mon – Fri:</strong> 11:00 AM – 11:00 PM</li>
              <li className="mb-2"><strong className="text-white">Sat – Sun:</strong> 10:00 AM – 11:30 PM</li>
              <li><strong className="text-white">Buffet Hours:</strong> 12:30 PM – 4:00 PM</li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="col-12 col-md-3">
            <h6 className="eyebrow text-warning mb-3">Newsletter</h6>
            <p style={{ fontSize: "0.85rem", color: "#B8ACA0" }}>
              Subscribe for exclusive chef specials and weekend discount vouchers!
            </p>
            <div className="input-group">
              <input
                type="email"
                className="form-control form-control-sm bg-dark text-white border-secondary"
                placeholder="Your email address"
              />
              <button className="btn btn-sm btn-primary-custom" type="button">
                Join
              </button>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

        {/* Bottom Bar */}
        <div className="text-center pt-2" style={{ fontSize: "0.85rem", color: "#A09488" }}>
          © {new Date().getFullYear()} Desi Delight Hotels &amp; Restaurant. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
