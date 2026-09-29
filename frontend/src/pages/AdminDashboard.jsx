import React, { useEffect, useState } from "react";
import { LayoutGrid, Users, PackageSearch, PackageCheck, Sparkles, FileCheck, ShieldAlert, Bell, BarChart3, Settings } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { adminOverview as mockOverview, lostVsFoundByMonth, itemsByCategory, claimsQueue as mockClaims } from "../services/mockData.js";
import { api, getErrorMessage } from "../services/api.js";

const NAV = [
  ["overview", "Overview", LayoutGrid],
  ["users", "Users", Users],
  ["lost", "Lost Items", PackageSearch],
  ["found", "Found Items", PackageCheck],
  ["matches", "AI Matches", Sparkles],
  ["claims", "Claims", FileCheck],
  ["disputes", "Disputes", ShieldAlert],
  ["notifications", "Notifications", Bell],
  ["reports", "Reports", BarChart3],
  ["settings", "Settings", Settings],
];
const PIE = ["#3E7BFA", "#22D3EE", "#8B5CF6", "#3E7BFA99", "#22D3EE99", "#8B5CF699"];

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [overview, setOverview] = useState(mockOverview);
  const [claims, setClaims] = useState(mockClaims);
  const [error, setError] = useState("");

  useEffect(() => {
    if (import.meta.env.VITE_USE_MOCK !== "true") {
      (async () => {
        try {
          const [o, c] = await Promise.all([api.get("/admin/overview"), api.get("/admin/claims")]);
          setOverview(o.data);
          setClaims(c.data.claims);
        } catch (e) {
          setError(getErrorMessage(e, "Could not load admin data."));
        }
      })();
    }
  }, []);

  const resolve = async (id, result) => {
    try {
      await api.patch(`/admin/claims/${id}`, { result });
      setClaims((c) => c.map((x) => ((x._id || x.id) === id ? { ...x, result } : x)));
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const stats = ["totalUsers", "lostItems", "foundItems", "recoveries", "pendingClaims", "disputedCases"];
  const labels = ["Total Users", "Lost Items", "Found Items", "Successful Recoveries", "Pending Claims", "Disputed Cases"];

  return (
    <div className="pt-20 min-h-screen flex">
      <aside className="hidden md:flex w-60 shrink-0 border-r border-line flex-col py-8 px-4 sticky top-20 h-[calc(100vh-80px)]">
        <p className="text-xs uppercase tracking-widest text-muted px-3 mb-4">Admin</p>
        <nav className="space-y-1">
          {NAV.map(([k, l, Icon]) => (
            <button
              key={k}
              onClick={() => setActive(k)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                active === k ? "bg-cyan/10 text-cyan" : "text-muted hover:text-ink hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {l}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 px-6 md:px-10 py-8 max-w-6xl">
        <h1 className="font-display text-2xl font-bold text-ink mb-1 capitalize">{active}</h1>
        <p className="text-muted mb-8">Findora control room — National overview.</p>
        {error && <p className="mb-5 text-sm text-red-300">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {stats.map((k, i) => (
            <div key={k} className="glass rounded-2xl p-4">
              <p className="font-mono text-2xl font-bold text-ink">{(overview[k] || 0).toLocaleString("en-IN")}</p>
              <p className="text-xs text-muted mt-1">{labels[i]}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <div className="glass rounded-2xl p-5">
            <p className="text-sm font-semibold text-ink mb-4">Lost vs Found — monthly activity</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={lostVsFoundByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232B3E" />
                <XAxis dataKey="month" stroke="#8B95A7" fontSize={12} />
                <YAxis stroke="#8B95A7" fontSize={12} />
                <Tooltip />
                <Bar dataKey="lost" fill="#8B5CF6" />
                <Bar dataKey="found" fill="#22D3EE" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-5">
            <p className="text-sm font-semibold text-ink mb-4">Items by category</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={itemsByCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                  {itemsByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE[i % PIE.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <p className="text-sm font-semibold text-ink p-5 pb-0 mb-4">Claim verification queue</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted border-y border-line">
                  <th className="px-5 py-3">Item</th>
                  <th className="px-5 py-3">Claimant</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((c) => {
                  const id = c._id || c.id;
                  const item = c.match?.foundItem?.name || c.item || "Item";
                  const claimant = c.claimant?.name || c.claimant || "User";
                  const status = c.result || c.status;
                  return (
                    <tr key={id} className="border-b border-line">
                      <td className="px-5 py-3.5 text-ink">{item}</td>
                      <td className="px-5 py-3.5 text-muted">{claimant}</td>
                      <td className="px-5 py-3.5">
                        <StatusPill status={status} />
                      </td>
                      <td className="px-5 py-3.5 flex gap-3">
                        {status === "pending" || status === "escalated" ? (
                          <>
                            <button onClick={() => resolve(id, "verified")} className="text-xs font-semibold text-cyan">
                              Approve
                            </button>
                            <button onClick={() => resolve(id, "failed")} className="text-xs font-semibold text-red-300">
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-muted">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusPill({ status }) {
  const s = {
    pending: "bg-blue/15 text-blue",
    verified: "bg-cyan/15 text-cyan",
    escalated: "bg-violet/15 text-violet",
    failed: "bg-red-400/15 text-red-400",
  };
  return <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${s[status] || "bg-line text-muted"}`}>{status || "unknown"}</span>;
}