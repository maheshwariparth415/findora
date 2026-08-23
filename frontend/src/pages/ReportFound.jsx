import React, { useState } from "react";
import { UploadCloud, MapPin, Check, LocateFixed } from "lucide-react";
import SectionTag from "../components/SectionTag.jsx";
import { CATEGORIES } from "../services/mockData.js";
import { api, getErrorMessage } from "../services/api.js";

export default function ReportFound() {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name:"", category:CATEGORIES[0], description:"", file:null, address:"", area:"", lat:30.7333, lng:76.7794, date:"", time:"" });
  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const locate = () => navigator.geolocation?.getCurrentPosition(
    ({coords}) => update({lat:coords.latitude,lng:coords.longitude}),
    () => setError("Location permission was denied. Enter the location manually.")
  );

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      let imageUrl = "";
      if (form.file) {
        const fd = new FormData(); fd.append("image", form.file);
        const {data} = await api.post("/uploads/image", fd, {headers:{"Content-Type":"multipart/form-data"}});
        imageUrl = data.url;
      }
      await api.post("/items", {
        type:"found", name:form.name, category:form.category, description:form.description,
        images:imageUrl?[imageUrl]:[], location:{address:form.address,area:form.area,lat:Number(form.lat),lng:Number(form.lng)},
        occurredAt:new Date(`${form.date}T${form.time||"12:00"}`).toISOString()
      });
      setSubmitted(true);
    } catch(err) { setError(getErrorMessage(err,"Unable to submit the report.")); }
    finally { setSaving(false); }
  };

  if (submitted) return <div className="pt-40 pb-24 px-6 max-w-lg mx-auto text-center min-h-screen"><div className="w-16 h-16 mx-auto rounded-full bg-violet/15 flex items-center justify-center mb-6"><Check size={28} className="text-violet"/></div><h1 className="font-display text-2xl font-bold text-ink mb-3">Thank you.</h1><p className="text-muted">You're helping return something to its owner.</p></div>;

  return <div className="pt-32 pb-24 px-6 max-w-2xl mx-auto min-h-screen">
    <SectionTag>Report Found Item</SectionTag><h1 className="font-display text-3xl font-bold text-ink mb-2">Found something? Log it here.</h1><p className="text-muted mb-8">Findora will match it against active lost reports.</p>
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-5">
      {error && <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">{error}</div>}
      <Field label="Item name"><input required value={form.name} onChange={e=>update({name:e.target.value})} placeholder="e.g. Black Wallet" className="input"/></Field>
      <Field label="Category"><select value={form.category} onChange={e=>update({category:e.target.value})} className="input">{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></Field>
      <Field label="Description"><textarea required rows={4} value={form.description} onChange={e=>update({description:e.target.value})} placeholder="What it looks like, notable features..." className="input resize-none"/></Field>
      <Field label="Photo"><label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-line rounded-2xl h-32 cursor-pointer hover:border-cyan/50 transition"><UploadCloud size={22} className="text-cyan"/><span className="text-sm text-muted">{form.file?.name||"Click to browse"}</span><input type="file" accept="image/*" className="hidden" onChange={e=>update({file:e.target.files?.[0]||null})}/></label></Field>
      <div className="grid sm:grid-cols-2 gap-5"><Field label="Where found"><div className="flex items-center gap-2"><MapPin size={16} className="text-cyan"/><input required value={form.address} onChange={e=>update({address:e.target.value})} placeholder="Sector 43 ISBT" className="input"/></div></Field><Field label="Area / Sector"><input value={form.area} onChange={e=>update({area:e.target.value})} placeholder="Sector 43" className="input"/></Field></div>
      <button type="button" onClick={locate} className="text-sm text-cyan flex items-center gap-2"><LocateFixed size={15}/> Use my current GPS location</button>
      <div className="grid grid-cols-2 gap-5"><Field label="Date found"><input required type="date" value={form.date} onChange={e=>update({date:e.target.value})} className="input"/></Field><Field label="Approx. time"><input type="time" value={form.time} onChange={e=>update({time:e.target.value})} className="input"/></Field></div>
      <div className="grid grid-cols-2 gap-5"><Field label="Latitude"><input required type="number" step="any" value={form.lat} onChange={e=>update({lat:e.target.value})} className="input"/></Field><Field label="Longitude"><input required type="number" step="any" value={form.lng} onChange={e=>update({lng:e.target.value})} className="input"/></Field></div>
      <button disabled={saving} type="submit" className="w-full px-5 py-3 rounded-full bg-gradient-to-r from-blue to-cyan text-void font-semibold text-sm disabled:opacity-60">{saving?"Submitting...":"Report Found Item"}</button>
    </form>
  </div>;
}
function Field({label,children}){return <label className="block"><span className="block text-xs uppercase tracking-wide text-muted mb-2">{label}</span>{children}</label>;}
