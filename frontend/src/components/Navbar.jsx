import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Bell, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/report-lost", label: "Report Lost" },
  { to: "/report-found", label: "Report Found" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-baseline gap-2 group">
          <span className="font-display text-2xl font-bold tracking-tight text-ink">
            Findora
          </span>
          <span className="hidden sm:inline text-[11px] uppercase tracking-[0.18em] text-muted">
            Smart Lost &amp; Found
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {publicLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-cyan" : "text-muted hover:text-ink"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login" className="text-sm font-medium text-muted hover:text-ink">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-blue to-cyan text-void shadow-glow hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link to="/notifications" className="text-muted hover:text-cyan transition" aria-label="Notifications">
                <Bell size={19} />
              </Link>
              <Link to="/dashboard" className="text-muted hover:text-cyan transition" aria-label="Dashboard">
                <LayoutDashboard size={19} />
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-ink">
                <span className="w-8 h-8 rounded-full bg-elevated border border-line flex items-center justify-center">
                  <UserIcon size={15} className="text-cyan" />
                </span>
                {user.name}
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-muted hover:text-ink transition"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>

        <button className="lg:hidden text-ink" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden glass border-t border-line px-6 py-4 flex flex-col gap-4">
          {publicLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-ink text-sm font-medium">
              {l.label}
            </Link>
          ))}
          <div className="h-px bg-line my-1" />
          {!user ? (
            <div className="flex gap-3">
              <Link to="/login" onClick={() => setOpen(false)} className="text-sm text-muted">
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-blue to-cyan text-void"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/dashboard" onClick={() => setOpen(false)} className="text-sm text-ink">Dashboard</Link>
              <Link to="/notifications" onClick={() => setOpen(false)} className="text-sm text-ink">Notifications</Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                  navigate("/");
                }}
                className="text-sm text-left text-muted"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
