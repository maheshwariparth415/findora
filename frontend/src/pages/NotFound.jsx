import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="pt-40 pb-24 px-6 text-center min-h-screen">
      <h1 className="font-display text-5xl font-bold text-gradient mb-4">404</h1>
      <p className="text-muted mb-6">This page wandered off. Maybe someone will report it found.</p>
      <Link to="/" className="text-cyan font-semibold">Back to Findora →</Link>
    </div>
  );
}
