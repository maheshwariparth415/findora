import React from "react";
import SectionTag from "../components/SectionTag.jsx";

export default function About() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-3xl mx-auto min-h-screen">
      <SectionTag>About Findora</SectionTag>
      <h1 className="font-display text-4xl font-bold text-ink mb-6">Built to make lost-and-found smarter.</h1>
      <p className="text-muted text-lg leading-relaxed mb-6">
        Findora started as a response to a very ordinary problem: in a city the size of Chandigarh,
        thousands of items are lost and found every month, and almost none of that information ever
        meets in the middle. Noticeboards fade. Social media posts get buried. Findora is designed to
        transform that scattered process into a centralized, intelligent digital platform.
      </p>
      <p className="text-muted text-lg leading-relaxed mb-10">
        Under the hood, it combines AI-assisted matching, GPS intelligence, and secure verification on
        infrastructure built to scale — starting in Chandigarh, with an architecture designed to extend
        to any city next.
      </p>
      <div className="flex flex-wrap gap-3">
        {["AI", "GPS", "Secure Verification", "Cloud Technology", "Scalable Architecture"].map((t) => (
          <span key={t} className="text-xs font-mono uppercase tracking-wide px-3 py-1.5 rounded-full border border-line text-muted">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
