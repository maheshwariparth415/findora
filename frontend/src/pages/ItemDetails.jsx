import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  ShieldAlert,
  MessageSquare,
  Flag,
  X,
  Send
} from "lucide-react";

import CategoryIcon from "../components/CategoryIcon.jsx";
import { api } from "../services/api.js";

export default function ItemDetails() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  // Contact modal states
  const [showContact, setShowContact] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/items/${id}`);

        setItem(data.item);

        if (
          localStorage.getItem("findora_token") !== "mock-jwt-token"
        ) {
          const m = await api
            .get(`/matches/item/${id}`)
            .catch(() => null);

          setMatch(m?.data?.matches?.[0] || null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-40 text-center text-muted min-h-screen">
        Loading report...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="pt-40 text-center min-h-screen">
        <h1 className="font-display text-2xl font-bold text-ink mb-2">
          Report not found
        </h1>

        <Link
          to="/explore"
          className="text-cyan"
        >
          Back to Explore →
        </Link>
      </div>
    );
  }

  const isLost = item.type === "lost";

  // Open contact modal
  const handleContactOwner = () => {
    setShowContact(true);
    setSent(false);
    setMessage("");
  };

  // Send message
const handleSendMessage = async () => {
  if (!message.trim()) return;

  try {
    setSending(true);

    await api.post("/notifications/contact", {
      itemId: id,
      message: message.trim(),
    });

    setSent(true);
    setMessage("");
  } catch (error) {
    console.error("Contact error:", error);

    alert(
      error?.response?.data?.message ||
        "Unable to send message. Please try again."
    );
  } finally {
    setSending(false);
  }
};

  return (
    <>
      <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto min-h-screen">

        <div className="grid md:grid-cols-2 gap-10">

          {/* IMAGE */}
          <div className="glass rounded-3xl aspect-square flex items-center justify-center overflow-hidden bg-gradient-to-br from-elevated to-surface">

            {item.images?.[0] ? (
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <CategoryIcon
                category={item.category}
                size={90}
                className="text-cyan/70"
              />
            )}

          </div>

          {/* DETAILS */}
          <div>

            <span
              className={`inline-block text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-4 ${
                isLost
                  ? "bg-violet/20 text-violet"
                  : "bg-cyan/20 text-cyan"
              }`}
            >
              {isLost ? "Lost" : "Found"}
            </span>

            <h1 className="font-display text-3xl font-bold text-ink mb-4">
              {item.name}
            </h1>

            <div className="flex items-center gap-2 text-muted mb-2">
              <MapPin
                size={15}
                className="text-cyan"
              />

              {item.location?.address}
            </div>

            <div className="flex items-center gap-2 text-muted mb-6">
              <Calendar
                size={15}
                className="text-cyan"
              />

              {new Date(item.occurredAt).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                }
              )}
            </div>

            <p className="text-ink/90 leading-relaxed mb-6">
              {item.description}
            </p>

            {/* MATCH */}
            {match && (
              <div className="glass rounded-2xl p-4 mb-6 flex items-center justify-between">

                <span className="text-sm text-muted">
                  Potential Match
                </span>

                <span className="font-mono text-2xl font-bold text-gradient">
                  {match.scores.overall}%
                </span>

              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3">

              {!isLost && match ? (
                <Link
                  to={`/claim/${match._id}`}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue to-cyan text-void font-semibold text-sm"
                >
                  Claim This Item
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue to-cyan text-void font-semibold text-sm"
                >
                  View Dashboard
                </Link>
              )}

              {/* CONTACT OWNER */}
              <button
                onClick={handleContactOwner}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-line text-ink text-sm hover:border-cyan hover:text-cyan transition-all"
              >
                <MessageSquare size={14} />

                Contact {isLost ? "Owner" : "Finder"}
              </button>

              {/* REPORT */}
              <button
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-line text-muted text-sm hover:border-red-400 hover:text-red-400 transition-all"
              >
                <Flag size={14} />

                Report
              </button>

            </div>

            <div className="flex items-center gap-2 mt-8 text-xs text-muted">

              <ShieldAlert
                size={14}
                className="text-violet"
              />

              Private ownership details are never shown publicly.

            </div>

          </div>
        </div>
      </div>

      {/* ================= CONTACT MODAL ================= */}

      {showContact && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">

          {/* Background */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowContact(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg glass rounded-3xl border border-line p-6 shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="font-display text-xl font-bold text-ink">
                  Contact {isLost ? "Owner" : "Finder"}
                </h2>

                <p className="text-sm text-muted mt-1">
                  About: {item.name}
                </p>
              </div>

              <button
                onClick={() => setShowContact(false)}
                className="p-2 rounded-full hover:bg-white/10 text-muted hover:text-ink transition"
              >
                <X size={20} />
              </button>

            </div>

            {/* SUCCESS */}
            {sent ? (
              <div className="text-center py-8">

                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan/10 flex items-center justify-center">

                  <Send
                    size={28}
                    className="text-cyan"
                  />

                </div>

                <h3 className="text-lg font-semibold text-ink mb-2">
                  Message Sent
                </h3>

                <p className="text-sm text-muted mb-6">
                  Your message has been submitted successfully.
                </p>

                <button
                  onClick={() => setShowContact(false)}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue to-cyan text-void font-semibold text-sm"
                >
                  Done
                </button>

              </div>
            ) : (
              <>
                {/* Message */}
                <label className="block text-sm font-medium text-ink mb-2">
                  Your Message
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isLost
                      ? "Hi, I believe this may be my lost item. Could you please help me verify it?"
                      : "Hi, I think this item may belong to me. Could you please help me verify it?"
                  }
                  rows={5}
                  className="w-full rounded-2xl bg-surface border border-line text-ink placeholder:text-muted/60 px-4 py-3 outline-none focus:border-cyan resize-none"
                />

                {/* Privacy */}
                <p className="text-xs text-muted mt-3">
                  For your safety, Findora does not reveal private
                  contact information directly.
                </p>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">

                  <button
                    onClick={() => setShowContact(false)}
                    className="px-5 py-2.5 rounded-full border border-line text-muted text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSendMessage}
                    disabled={
                      !message.trim() || sending
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue to-cyan text-void font-semibold text-sm disabled:opacity-50"
                  >

                    <Send size={14} />

                    {sending
                      ? "Sending..."
                      : "Send Message"}

                  </button>

                </div>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}