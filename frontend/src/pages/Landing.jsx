import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, ScanSearch, MapPinned, ShieldCheck, Sparkles,
  Smartphone, Wallet, KeyRound, Briefcase, FileText, Gem,
  Lock, Users, Radar,
} from "lucide-react";
import SectionTag from "../components/SectionTag.jsx";
import StatCounter from "../components/StatCounter.jsx";
import MatchScanner from "../components/MatchScanner.jsx";
import MapPlaceholder from "../components/MapPlaceholder.jsx";
import { lostItems, foundItems, matches } from "../services/mockData.js";

const steps = [
  { title: "Report", desc: "Describe what you lost or found, in under two minutes.", icon: FileText },
  { title: "Locate", desc: "GPS captures exactly where the item was lost or found.", icon: MapPinned },
  { title: "Match", desc: "AI compares image, description, date, and location.", icon: ScanSearch },
  { title: "Recover", desc: "Ownership gets verified and the item is returned.", icon: ShieldCheck },
];

const problemItems = [
  { icon: Smartphone, label: "Phones" },
  { icon: Wallet, label: "Wallets" },
  { icon: KeyRound, label: "Keys" },
  { icon: Briefcase, label: "Bags" },
  { icon: FileText, label: "ID Cards" },
  { icon: Gem, label: "Jewelry" },
];

const trustFeatures = [
  { icon: Lock, title: "Secure Authentication", desc: "JWT-based sessions keep every account protected end to end." },
  { icon: ShieldCheck, title: "Private Verification", desc: "Ownership details stay hidden until a claim needs to be checked." },
  { icon: Sparkles, title: "AI Assistance", desc: "Findora's matching engine surfaces likely pairs the moment a report is filed." },
  { icon: Users, title: "Human Oversight", desc: "Administrators step in for disputes and high-value items." },
];

const demoMatch = matches[0];

export default function Landing() {
  return (
    <div>
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <AIMatchingSection />
      <MapSection />
      <TrustSection />
      <AboutSection />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-40 pb-24 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-1/4 w-72 h-72 bg-blue/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-1/5 w-72 h-72 bg-violet/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <SectionTag>Live in Chandigarh</SectionTag>
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-[1.08] text-ink">
            Lost Something?
            <br />
            <span className="text-gradient">Let AI Find It.</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-lg">
            Findora connects lost belongings with their rightful owners using AI-powered matching, GPS intelligence, and secure verification.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/report-lost"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-blue to-cyan text-void font-semibold shadow-glow hover:opacity-90 transition"
            >
              Report Lost Item <ArrowRight size={16} />
            </Link>
            <Link
              to="/report-found"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-line text-ink font-semibold hover:border-cyan/50 hover:text-cyan transition"
            >
              Report Found Item
            </Link>
          </div>
          <div className="mt-10 flex gap-8 text-sm text-muted">
            <div><span className="text-ink font-mono font-semibold">2,318</span> recoveries</div>
            <div><span className="text-ink font-mono font-semibold">94%</span> avg. match accuracy</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="relative glass rounded-3xl p-6 aspect-square max-w-md mx-auto">
            <div
              className="absolute inset-6 rounded-2xl opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(62,123,250,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(62,123,250,0.18) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="absolute top-8 left-10 w-3 h-3 rounded-full bg-violet ring-4 ring-violet/30" />
            <div className="absolute bottom-16 right-14 w-3 h-3 rounded-full bg-cyan ring-4 ring-cyan/30" />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
              <motion.line
                x1="86" y1="90" x2="300" y2="290"
                stroke="#3E7BFA" strokeWidth="1.5" strokeDasharray="6 6"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, delay: 0.6 }}
              />
            </svg>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass rounded-xl px-4 py-2.5 text-center"
            >
              <p className="font-mono text-xl font-bold text-gradient">92%</p>
              <p className="text-[10px] uppercase tracking-widest text-muted">Match Found</p>
            </motion.div>
            <div className="absolute top-4 right-6 text-[10px] font-mono uppercase tracking-widest text-cyan/70">
              Chandigarh · Live Scan
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <SectionTag>The Problem</SectionTag>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Losing something shouldn&apos;t mean losing hope.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
          <StatCounter value={1032} label="Items lost every week in Chandigarh" />
          <StatCounter value={41} suffix="%" label="Unclaimed belongings after 30 days" />
          <StatCounter value={6} suffix=" days" label="Average time to recover manually" />
          <StatCounter value={612} label="Successful Findora recoveries" />
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {problemItems.map(({ icon: Icon, label }) => (
            <motion.div
              key={label}
              whileHover={{ y: -4, scale: 1.03 }}
              className="glass rounded-xl px-6 py-5 flex flex-col items-center gap-2 w-28"
            >
              <Icon size={22} className="text-cyan" strokeWidth={1.75} />
              <span className="text-xs text-muted">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-surface/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionTag>How Findora Works</SectionTag>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">Four steps back to yours.</h2>
        </div>

        <div className="relative grid md:grid-cols-4 gap-8">
          <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px bg-gradient-to-r from-violet via-blue to-cyan" />
          {steps.map(({ title, desc, icon: Icon }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl glass flex items-center justify-center mb-5 relative z-10">
                <Icon size={26} className="text-cyan" strokeWidth={1.75} />
              </div>
              <h3 className="font-display font-semibold text-ink mb-2">{title}</h3>
              <p className="text-sm text-muted">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AIMatchingSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <SectionTag>AI Matching</SectionTag>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Your lost item. Our AI. One possible match.
          </h2>
        </div>

        <MatchScanner lostItem={demoMatch.lostItem} foundItem={demoMatch.foundItem} scores={demoMatch.scores} />

        <div className="text-center mt-8">
          <Link
            to={`/items/${demoMatch.foundItem.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue to-cyan text-void font-semibold shadow-glow hover:opacity-90 transition"
          >
            View Match <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function MapSection() {
  const markers = [
    ...lostItems.map((i) => ({ id: i.id, kind: "lost", name: i.name, address: i.location.address, lat: i.location.lat, lng: i.location.lng, itemId: i.id })),
    ...foundItems.map((i) => ({ id: i.id, kind: "found", name: i.name, address: i.location.address, lat: i.location.lat, lng: i.location.lng, itemId: i.id })),
    ...matches.slice(0, 2).map((m) => ({
      id: `map-${m.id}`, kind: "match", name: m.foundItem.name, address: m.foundItem.location.address,
      lat: (m.lostItem.location.lat + m.foundItem.location.lat) / 2,
      lng: (m.lostItem.location.lng + m.foundItem.location.lng) / 2,
      matchPct: m.scores.overall, itemId: m.foundItem.id,
    })),
  ];

  return (
    <section className="py-24 px-6 bg-surface/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <SectionTag>Interactive Map</SectionTag>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">Lost &amp; Found, mapped.</h2>
          </div>
          <Link to="/explore" className="text-sm font-semibold text-cyan flex items-center gap-1">
            Open full map <ArrowRight size={14} />
          </Link>
        </div>
        <MapPlaceholder markers={markers} />
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <SectionTag>Trust &amp; Safety</SectionTag>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">Built to be hard to fool.</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {trustFeatures.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass rounded-2xl p-6">
              <div className="w-11 h-11 rounded-xl bg-blue/10 flex items-center justify-center mb-4">
                <Icon size={20} className="text-cyan" />
              </div>
              <h3 className="font-display font-semibold text-ink mb-2">{title}</h3>
              <p className="text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 bg-surface/40">
      <div className="max-w-4xl mx-auto text-center">
        <SectionTag>About Findora</SectionTag>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-6">
          Built to make lost-and-found smarter.
        </h2>
        <p className="text-muted text-lg leading-relaxed">
          Findora is designed to transform the traditional lost-and-found process into a centralized,
          intelligent digital platform — combining AI matching, GPS intelligence, secure verification,
          and cloud infrastructure on architecture built to scale beyond a single city.
        </p>
        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          {["AI Matching", "GPS Intelligence", "Secure Verification", "Cloud Native", "Scalable Architecture"].map((t) => (
            <span key={t} className="text-xs font-mono uppercase tracking-wide px-3 py-1.5 rounded-full border border-line text-muted">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
