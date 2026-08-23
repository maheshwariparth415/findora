import React from "react";

export default function SectionTag({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-cyan mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulseGlow" />
      {children}
    </span>
  );
}
