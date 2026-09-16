import React from "react";
import { Link } from "react-router-dom";

const FEATURED_DISHES = [
  {
    id: 1,
    name: "Royal Mughlai Biryani",
    price: "₹450",
    rating: "4.9 ★",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    desc: "Fragrant basmati rice layered with succulent spiced chicken, saffron, and slow-cooked caramelized onions."
  },
  {
    id: 2,
    name: "Butter Chicken Special",
    price: "₹390",
    rating: "4.8 ★",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80",
    desc: "Tender tandoori chicken simmered in a velvet tomato, cashew nut, and butter gravy with fresh cream."
  },
  {
    id: 3,
    name: "Dal Makhani Deluxe",
    price: "₹310",
    rating: "4.9 ★",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
    desc: "Black lentils slow-cooked overnight with aromatic spices, white butter, and smoke infusion."
  },
  {
    id: 4,
    name: "Paneer Tikka Lababdar",
    price: "₹340",
    rating: "4.7 ★",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
    desc: "Char-grilled cottage cheese cubes tossed in onion tomato masala gravy with kasuri methi."
  }
];

export default function FeaturedDishes() {
  return (
    <section id="featured" className="py-5 bg-white">
      <div className="container py-4">
        <div className="section-title">
          <span className="eyebrow">Chef's Recommendations</span>
          <h2>Our Featured <span>Signature Dishes</span></h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 600 }}>
            Handpicked specialties crafted by our executive chefs, combining heritage recipes with modern culinary art.
          </p>
        </div>

        <div className="row g-4">
          {FEATURED_DISHES.map((dish) => (
            <div className="col-12 col-md-6 col-lg-3" key={dish.id}>
              <div className="card-custom dish-card">
                <div className="dish-img-wrap">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <div className="dish-price-badge">{dish.price}</div>
                  <div className="dish-rating">{dish.rating}</div>
                </div>
                <div className="p-3 d-flex flex-column flex-grow-1">
                  <h5 className="mb-2 font-heading" style={{ fontSize: "1.15rem" }}>{dish.name}</h5>
                  <p className="text-muted flex-grow-1" style={{ fontSize: "0.85rem" }}>
                    {dish.desc}
                  </p>
                  <Link to="/book-table" className="btn btn-sm btn-primary-custom w-100 mt-2">
                    Order / Reserve Table
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
