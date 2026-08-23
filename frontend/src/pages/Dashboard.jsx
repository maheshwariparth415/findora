import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch, PackageCheck, Sparkles, ShieldCheck, Clock } from "lucide-react";
import ItemCard from "../components/ItemCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { lostItems, foundItems, matches, notifications as mockNotifications } from "../services/mockData.js";
import { api } from "../services/api.js";
const USE_MOCK=import.meta.env.VITE_USE_MOCK==="true";

export default function Dashboard(){
 const {user}=useAuth(); const [items,setItems]=useState(USE_MOCK?[...lostItems,...foundItems]:[]); const [myMatches,setMyMatches]=useState(USE_MOCK?matches:[]); const [notes,setNotes]=useState(USE_MOCK?mockNotifications:[]); const [loading,setLoading]=useState(!USE_MOCK);
 useEffect(()=>{if(!USE_MOCK)(async()=>{const [i,m,n]=await Promise.all([api.get("/items/mine"),api.get("/matches/mine"),api.get("/notifications")]);setItems(i.data.items);setMyMatches(m.data.matches);setNotes(n.data.notifications);setLoading(false);})().catch(()=>setLoading(false));},[]);
 const myLost=items.filter(i=>i.type==="lost"), myFound=items.filter(i=>i.type==="found");
 const cards=[{icon:PackageSearch,label:"Items Lost",value:USE_MOCK?2:myLost.length},{icon:PackageCheck,label:"Items Found",value:USE_MOCK?1:myFound.length},{icon:Sparkles,label:"Potential Matches",value:myMatches.length},{icon:ShieldCheck,label:"Successful Recoveries",value:user?.stats?.recoveries||0}];
 return <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen"><h1 className="font-display text-3xl font-bold text-ink mb-1">Welcome back, {user?.name}.</h1><p className="text-muted mb-10">Here's what's happening with your reports.</p>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">{cards.map(({icon:Icon,label,value})=><div key={label} className="glass rounded-2xl p-5"><Icon size={20} className="text-cyan"/><p className="font-mono text-3xl font-bold text-ink mt-3">{value}</p><p className="text-xs text-muted mt-1">{label}</p></div>)}</div>
 {loading?<p className="text-muted">Loading your reports...</p>:<><Section title="My Lost Items" cta="/report-lost" ctaLabel="Report another"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{myLost.map(i=><ItemCard key={i._id||i.id} item={i}/>)}</div></Section><Section title="My Found Items" cta="/report-found" ctaLabel="Report another"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{myFound.map(i=><ItemCard key={i._id||i.id} item={i}/>)}</div></Section><Section title="Potential Matches" cta="/explore" ctaLabel="Explore all"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{myMatches.slice(0,3).map(m=><Link key={m._id||m.id} to={`/items/${m.foundItem?._id||m.foundItem?.id}`} className="glass rounded-2xl p-5 block hover:-translate-y-1 transition-transform"><div className="flex justify-between items-start mb-3"><p className="font-display font-semibold text-ink">{m.foundItem?.name}</p><span className="font-mono text-sm font-bold text-gradient">{m.scores?.overall}%</span></div><p className="text-xs text-muted">Matched against "{m.lostItem?.name}"</p></Link>)}</div></Section><Section title="Recent Notifications" cta="/notifications" ctaLabel="View all"><div className="glass rounded-2xl divide-y divide-line">{notes.slice(0,2).map(n=><div key={n._id||n.id} className="p-4 flex items-start gap-3"><span className={`w-2 h-2 rounded-full mt-1.5 ${n.read?"bg-line":"bg-cyan"}`}/><div><p className="text-sm font-medium text-ink">{n.title}</p><p className="text-xs text-muted mt-0.5">{n.message}</p></div></div>)}</div></Section></>}
 </div>;
}
function Section({title,cta,ctaLabel,children}){return <div className="mb-14"><div className="flex items-center justify-between mb-5"><h2 className="font-display text-xl font-semibold text-ink">{title}</h2>{cta&&<Link to={cta} className="text-sm font-semibold text-cyan">{ctaLabel} →</Link>}</div>{children}</div>;}
