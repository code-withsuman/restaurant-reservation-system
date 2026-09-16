import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="auth-wrap">
      <div className="auth-card text-center">
        <div className="eyebrow">404</div>
        <h2>Table not found</h2>
        <p className="text-secondary">That page isn't on the floor plan.</p>
        <Link to="/" className="btn btn-brass">Back to home</Link>
      </div>
    </div>
  );
}
