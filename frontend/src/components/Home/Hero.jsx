import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-overlay" />
      <div className="container">
        <div className="hero-content">
          <div className="eyebrow mb-3 text-warning">
            ✨ Welcome to Desi Delight Hotels &amp; Restaurant
          </div>
          <h1 className="hero-title">
            Experience <span>Fine Dining</span> Like Never Before
          </h1>
          <p className="hero-subtitle">
            Fresh ingredients, authentic royal spices, unforgettable flavors, and an elegant ambiance tailored for luxury dining and grand celebrations.
          </p>
          <div className="d-flex flex-wrap gap-3 mt-4">
            <Link to="/book-table" className="btn btn-primary-custom btn-lg fs-6">
              Reserve Table
            </Link>
            <Link to="/our-menu" className="btn btn-outline-custom btn-lg fs-6">
              View Menu
            </Link>
          </div>

          <div className="row g-4 mt-5 pt-3 border-top border-secondary border-opacity-25" style={{ maxWidth: 540 }}>
            <div className="col-4">
              <div className="fs-3 fw-bold text-warning font-heading" style={{ fontFamily: "Playfair Display" }}>
                15+
              </div>
              <div className="text-light opacity-75" style={{ fontSize: "0.8rem" }}>Years Excellence</div>
            </div>
            <div className="col-4">
              <div className="fs-3 fw-bold text-warning font-heading" style={{ fontFamily: "Playfair Display" }}>
                50+
              </div>
              <div className="text-light opacity-75" style={{ fontSize: "0.8rem" }}>Master Chefs</div>
            </div>
            <div className="col-4">
              <div className="fs-3 fw-bold text-warning font-heading" style={{ fontFamily: "Playfair Display" }}>
                4.9 ★
              </div>
              <div className="text-light opacity-75" style={{ fontSize: "0.8rem" }}>Guest Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
