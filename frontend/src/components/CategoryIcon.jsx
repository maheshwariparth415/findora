import React from "react";
import {
  Smartphone, Briefcase, FileText, Gem, KeyRound, Wallet, Shirt, Package,
} from "lucide-react";

const ICONS = {
  Electronics: Smartphone,
  Bags: Briefcase,
  Documents: FileText,
  Jewelry: Gem,
  Keys: KeyRound,
  Wallets: Wallet,
  Apparel: Shirt,
  Other: Package,
};

// Findora deliberately uses category iconography instead of stock photos —
// every "found" report starts without a guaranteed image, so the visual
// language leans on clean glyphs rather than fake product photography.
export default function CategoryIcon({ category, size = 22, className = "" }) {
  const Icon = ICONS[category] || Package;
  return <Icon size={size} className={className} strokeWidth={1.75} />;
}
