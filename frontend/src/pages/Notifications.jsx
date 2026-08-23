import React, { useEffect, useState } from "react";
import { Sparkles, FileCheck, ShieldCheck, Info } from "lucide-react";
import { notifications as mock } from "../services/mockData.js";
import { api } from "../services/api.js";
const USE_MOCK=import.meta.env.VITE_USE_MOCK==="true";
const ICONS={match_found:Sparkles,claim_submitted:FileCheck,claim_verified:ShieldCheck,claim_failed:Info,system:Info};

export default function Notifications(){
 const [items,setItems]=useState(USE_MOCK?mock:[]); const [loading,setLoading]=useState(!USE_MOCK);
 useEffect(()=>{if(!USE_MOCK)api.get("/notifications").then(({data})=>setItems(data.notifications)).finally(()=>setLoading(false));},[]);
 const markRead=async(id)=>{setItems(p=>p.map(n=>(n._id||n.id)===id?{...n,read:true}:n));if(!USE_MOCK)await api.patch(`/notifications/${id}/read`).catch(()=>{});};
 return <div className="pt-32 pb-24 px-6 max-w-2xl mx-auto min-h-screen"><h1 className="font-display text-3xl font-bold text-ink mb-2">Notifications</h1><p className="text-muted mb-8">Matches, claims, and verifications, as they happen.</p>
 {loading?<p className="text-muted">Loading...</p>:<div className="glass rounded-2xl divide-y divide-line">{items.map(n=>{const Icon=ICONS[n.type]||Info;const id=n._id||n.id;return <button key={id} onClick={()=>markRead(id)} className="w-full text-left p-5 flex gap-4 hover:bg-white/[0.02] transition"><div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.read?"bg-elevated":"bg-cyan/15"}`}><Icon size={17} className={n.read?"text-muted":"text-cyan"}/></div><div className="flex-1"><div className="flex items-center justify-between"><p className={`text-sm font-semibold ${n.read?"text-muted":"text-ink"}`}>{n.title}</p>{!n.read&&<span className="w-2 h-2 rounded-full bg-cyan"/>}</div><p className="text-sm text-muted mt-1">{n.message}</p><p className="text-xs text-muted/70 mt-2">{new Date(n.createdAt).toLocaleString("en-IN")}</p></div></button>})}</div>}
 </div>;
}
