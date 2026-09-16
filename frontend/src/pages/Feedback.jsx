import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";

export default function Feedback() {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState("Overall Experience");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, name: "Rahul Sharma", rating: 5, category: "Food Quality", comment: "The Butter Chicken and Naan were absolutely divine! Royal flavor.", date: "Today" },
    { id: 2, name: "Ananya Roy", rating: 5, category: "Service", comment: "Wonderful hospitality and quick service. Table reservation was seamless.", date: "Yesterday" }
  ]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) return;

    const newFeedback = {
      id: Date.now(),
      name: user?.name || "Valued Guest",
      rating,
      category,
      comment,
      date: "Just now"
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setSubmitted(true);
    setComment("");
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <DashboardLayout title="Give Feedback">
      <div className="row g-4 justify-content-center">
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="rounded-circle bg-warning bg-opacity-25 text-warning p-3 d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", fontSize: "1.5rem" }}>
                💬
              </div>
              <div>
                <h4 className="font-heading fw-bold mb-1">Share Your Experience</h4>
                <p className="text-muted mb-0" style={{ fontSize: "0.88rem" }}>We value your opinion to serve you royal culinary excellence.</p>
              </div>
            </div>

            {submitted && (
              <div className="alert alert-success border-0 rounded-3 d-flex align-items-center gap-2 py-3 mb-4">
                <span style={{ fontSize: "1.2rem" }}>🎉</span>
                <div>
                  <strong>Thank You!</strong> Your feedback has been submitted successfully.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="fw-semibold text-dark mb-2" style={{ fontSize: "0.9rem" }}>Rating</label>
                <div className="d-flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="btn p-0 border-0"
                      onClick={() => setRating(star)}
                      style={{ fontSize: "1.8rem", cursor: "pointer", transition: "transform 0.15s ease" }}
                    >
                      {star <= rating ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="fw-semibold text-dark mb-2" style={{ fontSize: "0.9rem" }}>Category</label>
                <select
                  className="form-select rounded-3 py-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Overall Experience">Overall Experience</option>
                  <option value="Food Quality">Food Quality & Flavor</option>
                  <option value="Service">Staff Service & Hospitality</option>
                  <option value="Ambiance">Ambiance & Seating</option>
                  <option value="Reservation">Table Booking Process</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="fw-semibold text-dark mb-2" style={{ fontSize: "0.9rem" }}>Your Comments & Suggestions</label>
                <textarea
                  rows={4}
                  className="form-control rounded-3 p-3"
                  placeholder="Tell us what you loved or how we can improve..."
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary-custom w-100 py-2.5 fw-semibold rounded-3">
                Submit Feedback 🚀
              </button>
            </form>
          </div>
        </div>

        {/* Recent Feedback Feed */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="font-heading fw-bold mb-3">Recent Guest Feedback</h5>
            <div className="d-flex flex-column gap-3">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="p-3 rounded-3 bg-light border border-opacity-50">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <strong className="text-dark" style={{ fontSize: "0.9rem" }}>{fb.name}</strong>
                    <span className="text-warning">{Array(fb.rating).fill("⭐").join("")}</span>
                  </div>
                  <div className="badge bg-secondary bg-opacity-10 text-secondary mb-2" style={{ fontSize: "0.72rem" }}>
                    {fb.category}
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: "0.85rem", fontStyle: "italic" }}>
                    "{fb.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
