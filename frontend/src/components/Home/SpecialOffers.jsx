import React from "react";
import { Link } from "react-router-dom";

export default function SpecialOffers({ onBookClick }) {
  return (
    <section id="offers" className="py-5 text-white" style={{ background: "linear-gradient(135deg, #1E0A08 0%, #3D100C 100%)" }}>
      <div className="container py-4">
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-7">
            <span className="eyebrow text-warning">Limited Time Offer</span>
            <h2 className="display-5 font-heading fw-bold mb-3 text-white">
              Get <span className="text-warning">20% Off</span> Your Royal Dining Experience
            </h2>
            <p className="lead text-light opacity-75 mb-4" style={{ fontSize: "1.05rem" }}>
              Book your table online today for parties of 4+ guests and enjoy complimentary welcome mocktails, live tandoor stations, and unlimited dessert platters.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/book-table" className="btn btn-secondary-custom btn-lg fs-6">
                Claim Discount &amp; Reserve Table
              </Link>
              <Link to="/our-menu" className="btn btn-outline-custom btn-lg fs-6">
                Explore Combos
              </Link>
            </div>
          </div>
          <div className="col-12 col-lg-5 text-center">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80"
              alt="Royal Feast Combo"
              className="img-fluid rounded-4 shadow-lg border border-warning border-opacity-25"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
