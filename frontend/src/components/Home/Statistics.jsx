import React from "react";

export default function Statistics() {
  return (
    <section className="py-5 bg-dark text-white border-top border-bottom border-warning">
      <div className="container py-3">
        <div className="row g-4">
          <div className="col-6 col-md-3">
            <div className="stat-box">
              <div className="stat-number">15+</div>
              <div className="stat-label text-warning">Years Experience</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-box">
              <div className="stat-number">5000+</div>
              <div className="stat-label text-warning">Happy Customers</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-box">
              <div className="stat-number">100+</div>
              <div className="stat-label text-warning">Signature Dishes</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-box">
              <div className="stat-number">25+</div>
              <div className="stat-label text-warning">Professional Chefs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
