import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await register(form);
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-md mx-auto min-h-screen">
      <h1 className="font-display text-3xl font-bold text-ink mb-2">Join Findora.</h1>
      <p className="text-muted mb-8">Report items, track matches, and get things back.</p>

      <form onSubmit={submit} className="glass rounded-2xl p-6 md:p-8 space-y-5">
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-muted mb-2">Full name</span>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" className="input" />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-muted mb-2">Email</span>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="input" />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-muted mb-2">Password</span>
          <input required type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" className="input" />
        </label>
        <button disabled={loading} type="submit" className="w-full px-5 py-3 rounded-full bg-gradient-to-r from-blue to-cyan text-void font-semibold text-sm disabled:opacity-60">
          {loading ? "Creating account..." : "Get Started"}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Already have an account? <Link to="/login" className="text-cyan font-semibold">Log in</Link>
      </p>
    </div>
  );
}
