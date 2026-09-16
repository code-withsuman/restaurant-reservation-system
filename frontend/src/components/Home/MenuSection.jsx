import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { menuService } from "../../services/menuService";
import { getMenuItemImage } from "../../utils/menuImages";

const MENU_CATEGORIES = [
  "All",
  "Starters",
  "Main Course",
  "Desserts",
  "Beverages",
];

export default function MenuSection({ onBookClick }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    menuService.getAll().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setMenuItems(data);
      }
    });

    const handleUpdate = () => {
      menuService.getAll().then((data) => {
        if (Array.isArray(data) && data.length > 0) setMenuItems(data);
      });
    };

    window.addEventListener("db_updated", handleUpdate);
    return () => window.removeEventListener("db_updated", handleUpdate);
  }, []);

  const filteredItems = activeCategory === "All"
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  return (
    <section id="menu" className="py-5" style={{ backgroundColor: "var(--bg)" }}>
      <div className="container py-4">
        <div className="section-title text-center mb-4">
          <span className="eyebrow d-block text-warning fw-bold text-uppercase mb-1" style={{ letterSpacing: "2px", fontSize: "0.85rem" }}>
            Heritage Culinary Art
          </span>
          <h2 className="font-heading fw-bold mb-2">
            Explore Our <span className="text-brass">Authentic Menu</span>
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 650 }}>
            Indulge in authentic royal Bengali cuisines, fragrant slow-cooked curries, handcrafted appetizers, and artisanal desserts.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4 pb-2">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`btn rounded-pill px-4 py-2 fw-semibold transition-all ${
                activeCategory === cat
                  ? "btn-brass text-white shadow-sm"
                  : "btn-outline-secondary border-secondary border-opacity-25"
              }`}
              style={{ fontSize: "0.9rem" }}
              onClick={() => setActiveCategory(cat)}
            >
              {cat} {cat === "All" ? `(${menuItems.length})` : `(${menuItems.filter(i => i.category === cat).length})`}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="row g-4">
          {filteredItems.map((item) => {
            const itemImg = getMenuItemImage(item);
            return (
              <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                <div className="card-custom h-100 p-3 d-flex flex-row align-items-center gap-3 shadow-sm bg-white rounded-4 border border-secondary border-opacity-10 transition-hover">
                  <img
                    src={itemImg}
                    alt={item.name}
                    className="rounded-3 shadow-sm flex-shrink-0"
                    style={{ width: 95, height: 95, objectFit: "cover" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/menu/basanti_pulao.jpg";
                    }}
                  />
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                      <h6 className="font-heading mb-0 fw-bold text-dark text-truncate" style={{ fontSize: "1rem" }} title={item.name}>
                        {item.name}
                      </h6>
                      <span className="badge bg-danger bg-gradient text-white flex-shrink-0 px-2 py-1">
                        ₹{item.price}
                      </span>
                    </div>
                    <div className="text-muted mb-2 text-truncate-2" style={{ fontSize: "0.78rem", lineHeight: "1.35", minHeight: "2.2em" }}>
                      {item.description}
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="badge bg-secondary bg-opacity-10 text-muted" style={{ fontSize: "0.7rem" }}>
                        {item.category}
                      </span>
                      <Link
                        to="/book-table"
                        className="btn btn-sm btn-brass rounded-pill py-1 px-3 fw-semibold text-decoration-none"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Reserve / Order
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
