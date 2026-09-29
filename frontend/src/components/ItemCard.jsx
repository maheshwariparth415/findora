import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowUpRight } from "lucide-react";
import CategoryIcon from "./CategoryIcon.jsx";

export default function ItemCard({ item, matchPct }) {
  const isLost = item.type === "lost";

  // Build a robust location display: City, State or Area/Address fallback
  const locationLabel =
    [item.city, item.state].filter(Boolean).join(", ") ||
    item.location?.area ||
    item.location?.address ||
    "India";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="glass rounded-2xl overflow-hidden group"
    >
      <div className="h-36 relative flex items-center justify-center bg-gradient-to-br from-elevated to-surface">
        {item.images?.[0] ? (
          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <CategoryIcon category={item.category} size={42} className="text-cyan/80" />
        )}
        <span
          className={`absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
            isLost ? "bg-violet/20 text-violet" : "bg-cyan/20 text-cyan"
          }`}
        >
          {isLost ? "Lost" : "Found"}
        </span>
        {matchPct && (
          <span className="absolute top-3 right-3 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-blue/20 text-blue">
            {matchPct}% match
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display font-semibold text-ink text-base mb-1 truncate">{item.name}</h3>
        <p className="text-xs text-muted mb-3 uppercase tracking-wide">{item.category}</p>
        <div className="flex items-center gap-1.5 text-sm text-muted mb-1.5">
          <MapPin size={13} className="text-cyan/70 shrink-0" />
          <span className="truncate">{locationLabel}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted mb-4">
          <Calendar size={13} className="text-cyan/70 shrink-0" />
          <span>
            {item.occurredAt
              ? new Date(item.occurredAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Date unknown"}
          </span>
        </div>
        <Link
          to={`/items/${item._id || item.id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-cyan group-hover:gap-2 transition-all"
        >
          View Details <ArrowUpRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}