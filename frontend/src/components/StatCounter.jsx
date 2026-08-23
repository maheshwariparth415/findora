import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// Animated counter used across the Problem and Trust sections. Counts up
// once, the moment it scrolls into view.
export default function StatCounter({ value, label, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 text-center"
    >
      <div className="font-display text-4xl font-bold text-gradient font-mono">
        {display.toLocaleString("en-IN")}
        {suffix}
      </div>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </motion.div>
  );
}
