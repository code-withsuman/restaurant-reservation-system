import React from "react";

const FEATURES = [
  {
    icon: "🌱",
    title: "Fresh Ingredients",
    desc: "Farm-to-table organic vegetables, prime meats, and zero artificial preservatives."
  },
  {
    icon: "👨‍🍳",
    title: "Experienced Chefs",
    desc: "Culinary artists trained in royal Indian thalis, tandoor secrets & global fusion."
  },
  {
    icon: "⚡",
    title: "Fast Service",
    desc: "Quick table seating, prompt order delivery, and seamless digital service."
  },
  {
    icon: "✨",
    title: "Hygienic Kitchen",
    desc: "Strict WHO safety standards, sanitizing stations, and open-view glass kitchens."
  },
  {
    icon: "👑",
    title: "Premium Quality",
    desc: "5-star luxury ambiance, royal seating, private dining booths & VIP suites."
  },
  {
    icon: "📅",
    title: "Online Reservation",
    desc: "Real-time table floor map, instant booking confirmation & special seating requests."
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-5 bg-white">
      <div className="container py-4">
        <div className="section-title">
          <span className="eyebrow">Our Distinctive Promise</span>
          <h2>Why Choose <span>Desi Delight</span></h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 580 }}>
            We combine authentic culinary heritage with 5-star hospitality standards to deliver an unforgettable dining experience.
          </p>
        </div>

        <div className="row g-4">
          {FEATURES.map((item, index) => (
            <div className="col-12 col-md-6 col-lg-4" key={index}>
              <div className="feature-box h-100">
                <div className="feature-icon">{item.icon}</div>
                <h5 className="font-heading mb-2 fw-bold">{item.title}</h5>
                <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
