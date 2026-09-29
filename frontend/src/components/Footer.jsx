import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Linkedin, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface/60 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-2xl font-bold text-ink mb-2">Findora</div>
          <p className="text-sm text-muted flex items-center gap-1.5">
            <MapPin size={14} className="text-cyan" /> Across India
          </p>
          <p className="mt-4 text-sm text-muted max-w-xs">
            Helping lost things find their way home.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-ink/80 hover:text-cyan">Home</Link></li>
            <li><Link to="/explore" className="text-ink/80 hover:text-cyan">Explore</Link></li>
            <li><Link to="/report-lost" className="text-ink/80 hover:text-cyan">Report Lost</Link></li>
            <li><Link to="/report-found" className="text-ink/80 hover:text-cyan">Report Found</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/how-it-works" className="text-ink/80 hover:text-cyan">How It Works</Link></li>
            <li><Link to="/about" className="text-ink/80 hover:text-cyan">About</Link></li>
            <li><Link to="/privacy" className="text-ink/80 hover:text-cyan">Privacy</Link></li>
            <li><Link to="/terms" className="text-ink/80 hover:text-cyan">Terms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted mb-4">Follow</h4>
          <div className="flex gap-3">
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-muted hover:text-cyan hover:border-cyan/50 transition"
                aria-label="Social link"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Findora. Helping lost things find their way home.
      </div>
    </footer>
  );
}