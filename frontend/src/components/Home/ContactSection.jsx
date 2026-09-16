import React from "react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-5" style={{ backgroundColor: "var(--bg-subtle)" }}>
      <div className="container py-4">
        <div className="section-title">
          <span className="eyebrow">Get In Touch</span>
          <h2>Visit <span>Desi Delight Hotels &amp; Restaurant</span></h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 580 }}>
            We'd love to welcome you! Drop by for dining, contact us for event inquiries, or send us a message.
          </p>
        </div>

        <div className="row g-4 align-items-stretch">
          <div className="col-12 col-lg-5">
            <div className="card-custom p-4 h-100 bg-white shadow-sm d-flex flex-column justify-content-between">
              <div>
                <h4 className="font-heading fw-bold mb-4 text-danger">Contact Information</h4>
                
                <div className="d-flex align-items-start gap-3 mb-4">
                  <div className="fs-4 text-warning">📍</div>
                  <div>
                    <h6 className="fw-bold mb-1">Our Location</h6>
                    <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                      Desi Delight Hotels &amp; Restaurant, Kolkata, Barasat, Near Brainware University, Pin 700125
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3 mb-4">
                  <div className="fs-4 text-warning">📞</div>
                  <div>
                    <h6 className="fw-bold mb-1">Phone &amp; Reservations</h6>
                    <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                      +91 98765 43210 / +91 33 2542 6789
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3 mb-4">
                  <div className="fs-4 text-warning">✉️</div>
                  <div>
                    <h6 className="fw-bold mb-1">Email Inquiry</h6>
                    <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                      reservations@desidelighthotels.com
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="fs-4 text-warning">🕒</div>
                  <div>
                    <h6 className="fw-bold mb-1">Working Hours</h6>
                    <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                      Open 7 Days a Week: 11:00 AM – 11:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="card-custom h-100 p-2 shadow-sm bg-white overflow-hidden">
              <iframe
                title="Desi Delight Location Map"
                src="https://maps.google.com/maps?q=Brainware%20University%2C%20Barasat%2C%20Kolkata%2C%20West%20Bengal%20700125&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 340, borderRadius: "10px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
