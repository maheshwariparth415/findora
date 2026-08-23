import React from "react";
import { FileText, MapPinned, ScanSearch, ShieldCheck } from "lucide-react";
import SectionTag from "../components/SectionTag.jsx";

const steps = [
  { title: "Report", desc: "Describe the item — name, category, description — and, for lost items, a private detail only the owner would know.", icon: FileText },
  { title: "Locate", desc: "GPS or manual entry captures exactly where the item was lost or found, down to the sector.", icon: MapPinned },
  { title: "Match", desc: "Findora's engine compares images, descriptions, categories, dates, and proximity across every open report.", icon: ScanSearch },
  { title: "Recover", desc: "The claimant answers private verification questions. If it checks out, the finder is notified to arrange handover.", icon: ShieldCheck },
];

export default function HowItWorks() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
      <SectionTag>How It Works</SectionTag>
      <h1 className="font-display text-4xl font-bold text-ink mb-4">From lost to recovered, in four steps.</h1>
      <p className="text-muted mb-14 max-w-xl">
        Findora replaces the guesswork of noticeboards and word-of-mouth with a matching system that
        actively looks for your item the moment it's reported.
      </p>

      <div className="space-y-6">
        {steps.map(({ title, desc, icon: Icon }, i) => (
          <div key={title} className="glass rounded-2xl p-6 flex gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-blue/10 flex items-center justify-center shrink-0">
              <Icon size={22} className="text-cyan" />
            </div>
            <div>
              <p className="text-xs font-mono text-muted mb-1">Step {i + 1}</p>
              <h3 className="font-display font-semibold text-ink text-lg mb-1">{title}</h3>
              <p className="text-sm text-muted">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
