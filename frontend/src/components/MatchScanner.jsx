import React from "react";
import { motion } from "framer-motion";
import { ImageIcon, FileText, MapPin } from "lucide-react";
import CategoryIcon from "./CategoryIcon.jsx";

const subScores = [
  { key: "imageSimilarity", label: "Image similarity", icon: ImageIcon },
  { key: "descriptionSimilarity", label: "Description similarity", icon: FileText },
  { key: "locationProximity", label: "Location proximity", icon: MapPin },
];

// The signature element of Findora's UI: a live "scan" between a lost and a
// found report, resolving into a composite match score. This is the moment
// the product is meant to be remembered by.
export default function MatchScanner({ lostItem, foundItem, scores }) {
  return (
    <div className="relative glass rounded-3xl p-6 md:p-10 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 right-0 h-24 bg-gradient-to-b from-cyan/10 to-transparent animate-scan" />
      </div>

      <div className="relative grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
        <ItemPanel item={lostItem} label="Lost Item" accent="violet" />

        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full border border-cyan/30 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-cyan/40 animate-pulseGlow" />
            <div className="text-center">
              <div className="font-mono font-bold text-3xl md:text-4xl text-gradient">{scores.overall}%</div>
              <div className="text-[10px] uppercase tracking-widest text-muted mt-1">Match</div>
            </div>
          </div>
          <svg className="hidden md:block absolute" width="1" height="1" />
        </div>

        <ItemPanel item={foundItem} label="Found Item" accent="cyan" align="right" />
      </div>

      <div className="relative mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {subScores.map(({ key, label, icon: Icon }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="rounded-xl border border-line bg-surface/60 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-xs text-muted">
                <Icon size={14} className="text-cyan" /> {label}
              </span>
              <span className="font-mono text-sm font-semibold text-ink">{scores[key]}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-line overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${scores[key]}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.12 }}
                className="h-full rounded-full bg-gradient-to-r from-blue to-cyan"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ItemPanel({ item, label, accent, align = "left" }) {
  const isRight = align === "right";
  const accentText = accent === "violet" ? "text-violet" : "text-cyan";

  return (
    <div className={isRight ? "text-center md:text-right" : "text-center md:text-left"}>
      <p className={`text-xs font-mono uppercase tracking-widest mb-3 ${accentText}`}>{label}</p>
      <div className={`inline-flex w-full md:w-auto flex-col items-center ${isRight ? "md:items-end" : "md:items-start"} gap-3`}>
        <div className="w-16 h-16 rounded-2xl bg-elevated border border-line flex items-center justify-center">
          <CategoryIcon category={item.category} size={28} className={accentText} />
        </div>
        <div>
          <p className="font-display font-semibold text-ink">{item.name}</p>
          <p className="text-xs text-muted mt-1 max-w-[220px]">{item.description}</p>
          <p className="text-xs text-muted mt-1">📍 {item.location.area}</p>
        </div>
      </div>
    </div>
  );
}
