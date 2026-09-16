import React, { useState } from "react";
import TableCard from "../TableCard";

export default function ReservationSection({ tables, onBookClick, onQuickReserve }) {
  const [formData, setFormData] = useState({
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    date: new Date().toISOString().split("T")[0],
    time: "19:30",
    guests: "2",
    specialRequest: ""
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.guestName || !formData.guestPhone) {
      alert("Please fill in your name and phone number.");
      return;
    }
    setSubmitted(true);
  }

  const availableTables = tables.filter((t) => t.status === "Available");

  return (
    <section id="reservation" className="py-5 bg-white">
      <div className="container py-4">
        <div className="section-title">
          <span className="eyebrow">Instant Table Booking</span>
          <h2>Reserve Your <span>Dining Table</span></h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 580 }}>
            Check real-time floor availability or reserve a table instantly for family dinners, dates, or celebrations.
          </p>
        </div>

        <div className="row g-4 align-items-start">
          {/* Reservation Form */}
          <div className="col-12 col-lg-6">
            <div className="card-custom p-4 shadow-sm border border-secondary border-opacity-25">
              <h4 className="font-heading fw-bold mb-3 text-danger">Book a Table Online</h4>
              
              {submitted ? (
                <div className="text-center py-4">
                  <div className="fs-1 text-success mb-2">🎉</div>
                  <h4 className="font-heading fw-bold">Reservation Request Sent!</h4>
                  <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                    Thank you <strong>{formData.guestName}</strong>. We have received your booking request for <strong>{formData.guests} guests</strong> on <strong>{formData.date} at {formData.time}</strong>.
                  </p>
                  <button className="btn btn-sm btn-outline-dark mt-2" onClick={() => setSubmitted(false)}>
                    Book Another Table
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-dark">Full Name *</label>
                      <input
                        type="text"
                        name="guestName"
                        className="form-control"
                        placeholder="John Doe"
                        value={formData.guestName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-semibold text-dark">Phone Number *</label>
                      <input
                        type="tel"
                        name="guestPhone"
                        className="form-control"
                        placeholder="+91 98765 43210"
                        value={formData.guestPhone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold text-dark">Email Address</label>
                      <input
                        type="email"
                        name="guestEmail"
                        className="form-control"
                        placeholder="john@example.com"
                        value={formData.guestEmail}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-4">
                      <label className="form-label small fw-semibold text-dark">Date</label>
                      <input
                        type="date"
                        name="date"
                        className="form-control"
                        value={formData.date}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-4">
                      <label className="form-label small fw-semibold text-dark">Time</label>
                      <input
                        type="time"
                        name="time"
                        className="form-control"
                        value={formData.time}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-4">
                      <label className="form-label small fw-semibold text-dark">Guests</label>
                      <select
                        name="guests"
                        className="form-select"
                        value={formData.guests}
                        onChange={handleChange}
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Guests</option>
                        <option value="4">4 Guests</option>
                        <option value="6">6 Guests</option>
                        <option value="8">8+ Party</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold text-dark">Special Request</label>
                      <textarea
                        name="specialRequest"
                        className="form-control"
                        rows="2"
                        placeholder="Window seat, anniversary cake, high chair, etc."
                        value={formData.specialRequest}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div className="col-12 mt-3">
                      <button type="submit" className="btn btn-primary-custom w-100 fs-6">
                        Confirm Reservation
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Real-time Table Floor Overview */}
          <div className="col-12 col-lg-6">
            <div className="card-custom p-4 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h4 className="font-heading fw-bold mb-0">Live Floor Overview</h4>
                  <small className="text-muted">Select an available table to book directly</small>
                </div>
                <span className="badge bg-success px-3 py-2">
                  {availableTables.length} Tables Available
                </span>
              </div>

              <div className="row g-2" style={{ maxHeight: 420, overflowY: "auto" }}>
                {tables.map((table) => (
                  <div className="col-12 col-sm-6" key={table.id || table._id}>
                    <TableCard table={table} actionable={false} />
                    {table.status === "Available" && (
                      <button
                        className="btn btn-sm btn-outline-danger w-100 mt-1"
                        style={{ fontSize: "0.78rem" }}
                        onClick={onBookClick}
                      >
                        Reserve Table #{table.number}
                      </button>
                    )}
                  </div>
                ))}

                {tables.length === 0 && (
                  <p className="text-muted p-3">Loading real-time table floor layout...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
