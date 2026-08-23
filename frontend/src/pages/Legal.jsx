import React from "react";

export function Privacy() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-2xl mx-auto min-h-screen">
      <h1 className="font-display text-3xl font-bold text-ink mb-6">Privacy Policy</h1>
      <p className="text-muted leading-relaxed mb-4">
        Findora collects only what's needed to match and verify lost and found reports: item details,
        approximate location, and — for lost items — a private verification detail that is never shown
        publicly and is only checked at the moment of a claim.
      </p>
      <p className="text-muted leading-relaxed">
        This page is a placeholder for the full policy in a production deployment, covering data
        retention, third-party processors (image storage, maps), and account deletion.
      </p>
    </div>
  );
}

export function Terms() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-2xl mx-auto min-h-screen">
      <h1 className="font-display text-3xl font-bold text-ink mb-6">Terms of Service</h1>
      <p className="text-muted leading-relaxed mb-4">
        By using Findora, you agree to report items honestly, avoid fraudulent claims, and use the
        platform only for its intended lost-and-found purpose. Misuse — including fake reports or
        false ownership claims — may result in account suspension.
      </p>
      <p className="text-muted leading-relaxed">
        This page is a placeholder for full terms in a production deployment.
      </p>
    </div>
  );
}
