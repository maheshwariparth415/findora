import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * Polished stand-in for a real Google Maps embed. Renders lost/found/match
 * markers on a stylized grid map across regions in India, with click
 * interactions identical to what the real Maps integration will need
 * (marker click -> preview card). To go live:
 *
 *   1. npm install @react-google-maps/api
 *   2. Replace the <div className="map-canvas"> below with <GoogleMap>,
 *      keeping `markers` and `onMarkerClick` as-is.
 */
const MARKER_STYLES = {
  lost: { color: "bg-violet", ring: "ring-violet/40", label: "Lost" },
  found: { color: "bg-cyan", ring: "ring-cyan/40", label: "Found" },
  match: { color: "bg-blue", ring: "ring-blue/40", label: "Potential Match" },
};

export default function MapPlaceholder({ markers }) {
  const [active, setActive] = useState(null);
  const positioned = useMemo(
    () =>
      markers.map((m) => ({
        ...m,
        // Normalize lat/lng into a 0-100 percentage box for the mock canvas.
        x: 10 + (((m.lng + 76.83) / 0.1) * 80),
        y: 90 - (((m.lat - 30.70) / 0.08) * 80),
      })),
    [markers]
  );

  return (
    <div className="relative w-full h-[440px] rounded-3xl overflow-hidden glass">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(62,123,250,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(62,123,250,0.15) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="absolute inset-0 bg-grid-fade" />

      {positioned.map((m) => {
        const style = MARKER_STYLES[m.kind];
        return (
          <button
            key={m.id}
            onClick={() => setActive(m)}
            style={{ left: `${Math.min(96, Math.max(2, m.x))}%`, top: `${Math.min(94, Math.max(4, m.y))}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            aria-label={`${style.label} item: ${m.name}`}
          >
            <span className={`block w-3.5 h-3.5 rounded-full ${style.color} ring-4 ${style.ring} group-hover:scale-125 transition-transform`} />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full animate-ping opacity-30" style={{ background: "currentColor" }} />
          </button>
        );
      })}

      <div className="absolute bottom-4 left-4 glass rounded-xl px-4 py-3 flex gap-4 text-xs">
        {Object.entries(MARKER_STYLES).map(([key, s]) => (
          <span key={key} className="flex items-center gap-1.5 text-muted">
            <span className={`w-2 h-2 rounded-full ${s.color}`} /> {s.label}
          </span>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="absolute bottom-4 right-4 w-64 glass rounded-2xl p-4"
          >
            <p className="font-display font-semibold text-ink text-sm">{active.name}</p>
            <p className="text-xs text-muted mt-1">{active.address}</p>
            {active.matchPct && (
              <p className="text-xs font-mono text-cyan mt-2">{active.matchPct}% Match</p>
            )}
            <Link
              to={active.itemId ? `/items/${active.itemId}` : "/explore"}
              className="inline-block mt-3 text-xs font-semibold text-cyan"
            >
              View Details →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}