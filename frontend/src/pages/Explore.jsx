import React, { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import ItemCard from "../components/ItemCard.jsx";
import SectionTag from "../components/SectionTag.jsx";
import { CATEGORIES, AREAS, matches as mockMatches, lostItems, foundItems } from "../services/mockData.js";
import { api } from "../services/api.js";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export default function Explore() {
  const [items,setItems]=useState(USE_MOCK?[...lostItems,...foundItems]:[]);
  const [query,setQuery]=useState(""); const [typeFilter,setTypeFilter]=useState("all"); const [category,setCategory]=useState("all"); const [area,setArea]=useState("all"); const [sort,setSort]=useState("recent"); const [loading,setLoading]=useState(!USE_MOCK);

  useEffect(()=>{ if(!USE_MOCK) api.get("/items").then(({data})=>setItems(data.items)).finally(()=>setLoading(false)); },[]);
  const matchPctFor=(item)=>{const found=mockMatches.find(m=>m.lostItem.id===item.id||m.foundItem.id===item.id);return found?.scores?.overall||null;};
  const filtered=useMemo(()=>items.filter(item=>
    (typeFilter==="all"||item.type===typeFilter)&&(category==="all"||item.category===category)&&
    (area==="all"||item.location?.area===area)&&(!query||`${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase()))
  ).sort((a,b)=>sort==="recent"?new Date(b.occurredAt)-new Date(a.occurredAt):(matchPctFor(b)||0)-(matchPctFor(a)||0)),[items,query,typeFilter,category,area,sort]);

  return <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
    <div className="mb-10"><SectionTag>Explore</SectionTag><h1 className="font-display text-4xl font-bold text-ink">Every report, searchable.</h1><p className="text-muted mt-2">Browse lost and found items across Chandigarh.</p></div>
    <div className="glass rounded-2xl p-4 md:p-5 mb-10 grid md:grid-cols-[1fr_auto_auto_auto_auto] gap-3">
      <div className="flex items-center gap-2 bg-surface/60 rounded-xl px-3 border border-line"><Search size={16} className="text-muted"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search item name or description..." className="bg-transparent py-2.5 text-sm text-ink placeholder:text-muted outline-none w-full"/></div>
      <Select value={typeFilter} onChange={setTypeFilter} options={[["all","All"],["lost","Lost"],["found","Found"]]}/><Select value={category} onChange={setCategory} options={[["all","All categories"],...CATEGORIES.map(c=>[c,c])]}/><Select value={area} onChange={setArea} options={[["all","All areas"],...AREAS.map(a=>[a,a])]}/><Select value={sort} onChange={setSort} options={[["recent","Most recent"],["match","Best match"]]}/>
    </div>
    <div className="flex items-center justify-between mb-6 text-sm text-muted"><span className="flex items-center gap-2"><SlidersHorizontal size={14}/>{loading?"Loading...":`${filtered.length} results`}</span></div>
    {filtered.length===0&&!loading?<div className="glass rounded-2xl p-14 text-center text-muted">Nothing matches those filters yet.</div>:<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{filtered.map(item=><ItemCard key={item._id||item.id} item={item} matchPct={matchPctFor(item)}/>)}</div>}
  </div>;
}
function Select({value,onChange,options}){return <select value={value} onChange={e=>onChange(e.target.value)} className="bg-surface/60 border border-line rounded-xl px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-cyan">{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>;}
