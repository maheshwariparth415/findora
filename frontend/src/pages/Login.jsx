import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError("Couldn't log in. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-md mx-auto min-h-screen">
      <h1 className="font-display text-3xl font-bold text-ink mb-2">Welcome back.</h1>
      <p className="text-muted mb-8">Log in to track your reports and matches.</p>

      <form onSubmit={submit} className="glass rounded-2xl p-6 md:p-8 space-y-5">
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-muted mb-2">Email</span>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com" className="input" />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-muted mb-2">Password</span>
          <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••" className="input" />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <p className="text-xs text-muted">Tip: use an email containing "admin" to preview the admin dashboard.</p>
        <button disabled={loading} type="submit" className="w-full px-5 py-3 rounded-full bg-gradient-to-r from-blue to-cyan text-void font-semibold text-sm disabled:opacity-60">
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        New to Findora? <Link to="/register" className="text-cyan font-semibold">Create an account</Link>
      </p>
    </div>
  );
}
