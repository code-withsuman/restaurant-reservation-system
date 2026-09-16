import React from "react";

const GALLERY_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    title: "Luxury Main Dining Hall",
    cat: "Interior"
  },
  {
    url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80",
    title: "Candlelight Dinner Setup",
    cat: "Ambiance"
  },
  {
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    title: "Master Chef Plating",
    cat: "Chefs"
  },
  {
    url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    title: "Private VIP Lounge",
    cat: "Interior"
  },
  {
    url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    title: "Royal Feast Spread",
    cat: "Food"
  },
  {
    url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
    title: "Rooftop Evening View",
    cat: "Ambiance"
  }
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-5" style={{ backgroundColor: "var(--bg-subtle)" }}>
      <div className="container py-4">
        <div className="section-title">
          <span className="eyebrow">Visual Moments</span>
          <h2>Our Ambiance &amp; <span>Culinary Gallery</span></h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 580 }}>
            Take a glance into our warm interiors, live kitchen moments, and elegant table arrangements.
          </p>
        </div>

        <div className="row g-4">
          {GALLERY_IMAGES.map((img, index) => (
            <div className="col-12 col-sm-6 col-lg-4" key={index}>
              <div className="gallery-item shadow-sm">
                <img src={img.url} alt={img.title} loading="lazy" />
                <div className="gallery-overlay">
                  <span className="badge bg-warning text-dark mb-2">{img.cat}</span>
                  <h5 className="font-heading text-white fw-bold mb-0">{img.title}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
