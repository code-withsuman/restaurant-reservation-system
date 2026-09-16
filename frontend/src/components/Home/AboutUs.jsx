import React from "react";

export default function AboutUs() {
  return (
    <section id="about" className="py-5" style={{ backgroundColor: "var(--bg-subtle)" }}>
      <div className="container py-4">
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-6">
            <div className="position-relative">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                alt="Desi Delight Restaurant Interior"
                className="img-fluid rounded-4 shadow-lg"
              />
              <div
                className="position-absolute bottom-0 start-0 m-4 p-3 bg-white rounded-3 shadow border-start border-4 border-danger d-none d-sm-block"
                style={{ maxWidth: 240 }}
              >
                <div className="fw-bold text-dark fs-5 font-heading">15+ Years</div>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Serving authentic royal dining experiences across India.
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <span className="eyebrow">Our Heritage &amp; Passion</span>
            <h2 className="font-heading display-6 mb-3 mt-1 fw-bold">
              The Story of <span className="text-danger">Desi Delight</span>
            </h2>
            <p className="text-secondary" style={{ fontSize: "0.95rem" }}>
              Founded in 2011, Desi Delight Hotels &amp; Restaurant was born out of a deep reverence for authentic Indian gastronomy. From hand-crushed spices to royal clay tandoors, we preserve century-old culinary secrets while curating modern, luxury hospitality.
            </p>

            <div className="row g-3 my-4">
              <div className="col-6">
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-3 text-warning">👨‍🍳</span>
                  <div>
                    <h6 className="mb-0 fw-bold">Master Chefs</h6>
                    <small className="text-muted">Handcrafted Recipes</small>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-3 text-warning">🌿</span>
                  <div>
                    <h6 className="mb-0 fw-bold">100% Organic Spices</h6>
                    <small className="text-muted">Pure &amp; Farm Fresh</small>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-muted fst-italic border-start border-3 border-warning ps-3 my-3">
              "Cooking is an act of love. At Desi Delight, every dish is an invitation to celebrate life's finest moments."
            </p>
            <div className="fw-bold text-dark font-heading">— Chef Rajesh Sharma, Executive Head Chef</div>
          </div>
        </div>
      </div>
    </section>
  );
}
