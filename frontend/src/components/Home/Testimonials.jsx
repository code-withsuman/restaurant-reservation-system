import React from "react";

const TESTIMONIALS = [
  {
    name: "Saurabh Verma",
    role: "Food Critic & Blogger",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Desi Delight Hotels & Restaurant offers the finest Mughlai Biryani I've tasted in years! The hospitality and candle-lit ambiance made our anniversary unforgettable."
  },
  {
    name: "Priya Sundaram",
    role: "Regular Guest",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "The online table reservation system is super easy! Our table for 8 was ready as soon as we arrived. Staff service is top-notch and the Butter Chicken is divine!"
  },
  {
    name: "Rohan Kapoor",
    role: "Corporate Executive",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "We hosted our company dinner at Desi Delight VIP Lounge. Seamless booking, exquisite mocktails, and incredible dessert platters. Highly recommended!"
  },
  {
    name: "Anjali Mehta",
    role: "Wedding Planner",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Organized a pre-wedding dinner here. The private banquet hall, live music, and gourmet thali experience were absolutely breathtaking. My clients loved it!"
  },
  {
    name: "Vikram Singh",
    role: "Hotel Reviewer",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    rating: 4,
    comment: "The rooftop dining with city lights view is a must-try! The Tandoori platter was perfectly spiced. Only wish the dessert menu had a few more options."
  },
  {
    name: "Neha Sharma",
    role: "Family Diner",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Perfect family outing spot! Kids loved the special children's menu and the live cooking station. We visit every weekend now — it feels like home!"
  },
  {
    name: "Arjun Patel",
    role: "Startup Founder",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Had an investor dinner meeting here. The VIP private dining room, impeccable service and curated multi-course meal sealed the deal. A power-dinner destination!"
  },
  {
    name: "Kavita Rao",
    role: "Travel Vlogger",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Featured Desi Delight in my 'Best Restaurants' series. The Hyderabadi Dum Biryani and Gulab Jamun are a foodie's dream. Pure culinary art!"
  },
  {
    name: "Manish Gupta",
    role: "Birthday Celebration",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Celebrated my 50th birthday here. The team arranged a surprise cake, live music, and a personalised menu. Such warmth and professionalism — truly memorable!"
  },
  {
    name: "Deepika Joshi",
    role: "Nutritionist",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    rating: 4,
    comment: "Love that they offer healthy options alongside traditional dishes. The Quinoa Tandoori Bowl and fresh cold-pressed juices are fantastic. Great for health-conscious foodies!"
  }
];

function StarRating({ count }) {
  return (
    <div className="testimonial-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "star filled" : "star"}>★</span>
      ))}
    </div>
  );
}

function TestimonialCard({ t }) {
  return (
    <div className="testimonial-slide">
      <div className="testimonial-card h-100 d-flex flex-column justify-content-between">
        <div>
          <StarRating count={t.rating} />
          <p className="testimonial-comment">"{t.comment}"</p>
        </div>
        <div className="d-flex align-items-center gap-3 pt-3 border-top border-light">
          <img src={t.photo} alt={t.name} className="testimonial-avatar" />
          <div>
            <h6 className="font-heading mb-0 fw-bold">{t.name}</h6>
            <small className="text-muted">{t.role}</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="testimonials-section py-5" style={{ backgroundColor: "var(--bg-subtle)" }}>
      <div className="container py-4">
        <div className="section-title">
          <span className="eyebrow">Guest Experiences</span>
          <h2>What Our <span>Customers Say</span></h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 580 }}>
            Hear real reviews from food lovers, families, and corporate guests who dined at Desi Delight.
          </p>
        </div>
      </div>

      {/* Marquee Scroll Container */}
      <div className="testimonial-marquee-wrapper">
        <div className="testimonial-marquee-track">
          {/* Original set */}
          {TESTIMONIALS.map((t, index) => (
            <TestimonialCard key={`a-${index}`} t={t} />
          ))}
          {/* Duplicate set for seamless loop */}
          {TESTIMONIALS.map((t, index) => (
            <TestimonialCard key={`b-${index}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
