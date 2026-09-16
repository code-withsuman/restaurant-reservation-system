import React from "react";

const CHEFS = [
  {
    name: "Rajesh Sharma",
    position: "Executive Head Chef",
    experience: "18+ Years Exp.",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=500&q=80",
    speciality: "Royal Mughlai & Tandoor Master"
  },
  {
    name: "Ananya Roy",
    position: "Pastry & Dessert Specialist",
    experience: "12+ Years Exp.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500&q=80",
    speciality: "Traditional Indian Sweets & Fusion Desserts"
  },
  {
    name: "Vikram Malhotra",
    position: "Sous Chef & Grill Master",
    experience: "10+ Years Exp.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80",
    speciality: "Kebabs, Sizzlers & Continental"
  }
];

export default function Chefs() {
  return (
    <section className="py-5 bg-white">
      <div className="container py-4">
        <div className="section-title">
          <span className="eyebrow">Culinary Masterminds</span>
          <h2>Meet Our <span>Expert Chefs</span></h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 580 }}>
            Passionate culinary masters dedicated to serving authentic flavors with artistic flair.
          </p>
        </div>

        <div className="row g-4">
          {CHEFS.map((chef, index) => (
            <div className="col-12 col-md-4" key={index}>
              <div className="card-custom text-center p-4 h-100">
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="rounded-circle mx-auto mb-3 shadow"
                  style={{ width: 130, height: 130, objectFit: "cover", border: "3px solid var(--secondary)" }}
                />
                <h5 className="font-heading fw-bold mb-1">{chef.name}</h5>
                <span className="text-danger fw-semibold" style={{ fontSize: "0.9rem" }}>{chef.position}</span>
                <div className="badge bg-light text-dark my-2 mx-auto" style={{ width: "fit-content" }}>{chef.experience}</div>
                <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                  {chef.speciality}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
