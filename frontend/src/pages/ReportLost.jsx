import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, MapPin, Check, ArrowRight, ArrowLeft, LocateFixed } from "lucide-react";
import SectionTag from "../components/SectionTag.jsx";
import { CATEGORIES } from "../services/mockData.js";
import { api, getErrorMessage } from "../services/api.js";

const STEPS = ["Basics", "Photo", "Location", "Date & Time", "Verification"];

export default function ReportLost() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", category: CATEGORIES[0], description: "", file: null, imageUrl: "",
    locationMode: "manual", address: "", area: "", city: "", state: "", lat: 20.5937, lng: 78.9629,
    date: "", time: "", verifyQuestion: "Unique mark or scratch", verifyAnswer: "",
  });

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return setError("Geolocation is not supported by this browser.");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => update({ lat: coords.latitude, lng: coords.longitude, locationMode: "current" }),
      () => setError("Could not access your location. Please enter the address manually.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      let imageUrl = form.imageUrl;
      if (form.file) {
        const fd = new FormData();
        fd.append("image", form.file);
        const { data } = await api.post("/uploads/image", fd, { headers: { "Content-Type": "multipart/form-data" } });
        imageUrl = data.url;
      }
      const occurredAt = new Date(`${form.date}T${form.time || "12:00"}`).toISOString();
      await api.post("/items", {
        type: "lost",
        name: form.name,
        category: form.category,
        description: form.description,
        images: imageUrl ? [imageUrl] : [],
        city: form.city,
        state: form.state,
        location: { address: form.address, area: form.area, lat: Number(form.lat), lng: Number(form.lng) },
        occurredAt,
        verification: { question: form.verifyQuestion, answer: form.verifyAnswer },
      });
      setSubmitted(true);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to submit the report. Make sure the backend is running and try again."));
    } finally {
      setSaving(false);
    }
  };

  if (submitted) return <ConfirmationScreen />;

  return (
    <div className="pt-32 pb-24 px-6 max-w-2xl mx-auto min-h-screen">
      <SectionTag>Report Lost Item</SectionTag>
      <h1 className="font-display text-3xl font-bold text-ink mb-2">Tell us what you lost.</h1>
      <p className="text-muted mb-8">The more specific you are, the sharper the AI match.</p>
      <StepIndicator steps={STEPS} current={step} />
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 mt-8">
        {error && <div className="mb-5 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">{error}</div>}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            {step === 0 && <div className="space-y-5">
              <Field label="Item name"><input required value={form.name} onChange={(e) => update({ name: e.target.value })} placeholder="e.g. AirPods Pro Case" className="input" /></Field>
              <Field label="Category"><select value={form.category} onChange={(e) => update({ category: e.target.value })} className="input">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
              <Field label="Description"><textarea required rows={4} value={form.description} onChange={(e) => update({ description: e.target.value })} placeholder="Color, brand, distinguishing details..." className="input resize-none" /></Field>
            </div>}
            {step === 1 && <div>
              <p className="text-sm text-muted mb-3">Upload a photo (recommended for better matching).</p>
              <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-line rounded-2xl h-48 cursor-pointer hover:border-cyan/50 transition">
                <UploadCloud size={28} className="text-cyan" />
                <span className="text-sm text-muted">{form.file?.name || "Click to browse"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => update({ file: e.target.files?.[0] || null })} />
              </label>
              <p className="text-xs text-muted mt-3">Images are stored in Cloudinary when configured.</p>
            </div>}
            {step === 2 && <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={useCurrentLocation} className="px-3 py-2 rounded-lg text-sm border border-cyan text-cyan bg-cyan/10 flex items-center gap-2"><LocateFixed size={14}/> Use current location</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="State"><input required value={form.state} onChange={(e) => update({ state: e.target.value })} placeholder="e.g. Maharashtra, Punjab, Delhi" className="input" /></Field>
                <Field label="City"><input required value={form.city} onChange={(e) => update({ city: e.target.value })} placeholder="e.g. Mumbai, Mohali, New Delhi" className="input" /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Address / Landmark"><div className="flex items-center gap-2"><MapPin size={16} className="text-cyan" /><input required value={form.address} onChange={(e) => update({ address: e.target.value })} placeholder="e.g. Metro Station, Terminal 3" className="input" /></div></Field>
                <Field label="Area / Locality"><input value={form.area} onChange={(e) => update({ area: e.target.value })} placeholder="e.g. Andheri East, Sector 17" className="input" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4"><Field label="Latitude"><input required type="number" step="any" value={form.lat} onChange={(e) => update({ lat: e.target.value })} className="input" /></Field><Field label="Longitude"><input required type="number" step="any" value={form.lng} onChange={(e) => update({ lng: e.target.value })} className="input" /></Field></div>
              <p className="text-xs text-muted">GPS: {Number(form.lat).toFixed(5)}, {Number(form.lng).toFixed(5)}</p>
            </div>}
            {step === 3 && <div className="grid grid-cols-2 gap-5"><Field label="Date lost"><input required type="date" value={form.date} onChange={(e) => update({ date: e.target.value })} className="input" /></Field><Field label="Approx. time"><input type="time" value={form.time} onChange={(e) => update({ time: e.target.value })} className="input" /></Field></div>}
            {step === 4 && <div className="space-y-5">
              <div className="rounded-xl bg-violet/10 border border-violet/30 p-4 text-sm text-violet">This information stays private and is used only for ownership verification.</div>
              <Field label="Verification type"><select value={form.verifyQuestion} onChange={(e) => update({ verifyQuestion: e.target.value })} className="input">{["Unique mark or scratch","Specific contents inside","Serial number","Hidden personal identifier"].map((q) => <option key={q}>{q}</option>)}</select></Field>
              <Field label="Answer / detail"><input required value={form.verifyAnswer} onChange={(e) => update({ verifyAnswer: e.target.value })} placeholder="Describe it precisely." className="input" /></Field>
            </div>}
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between mt-8">
          <button type="button" onClick={back} disabled={step === 0} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted disabled:opacity-30"><ArrowLeft size={15}/> Back</button>
          {step < STEPS.length - 1 ? <button type="button" onClick={next} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue to-cyan text-void font-semibold text-sm">Continue <ArrowRight size={15}/></button> :
          <button disabled={saving} type="submit" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue to-cyan text-void font-semibold text-sm disabled:opacity-60">{saving ? "Submitting..." : "Find My Item"} <ArrowRight size={15}/></button>}
        </div>
      </form>
    </div>
  );
}

function StepIndicator({ steps, current }) { return <div className="flex items-center">{steps.map((s,i)=><React.Fragment key={s}><div className="flex flex-col items-center gap-1.5"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono border ${i<current?"bg-cyan text-void border-cyan":i===current?"border-cyan text-cyan":"border-line text-muted"}`}>{i<current?<Check size={14}/>:i+1}</div><span className={`text-[11px] hidden sm:block ${i===current?"text-ink":"text-muted"}`}>{s}</span></div>{i<steps.length-1&&<div className={`flex-1 h-px mx-2 ${i<current?"bg-cyan":"bg-line"}`}/>}</React.Fragment>)}</div>; }
function Field({label,children}){return <label className="block"><span className="block text-xs uppercase tracking-wide text-muted mb-2">{label}</span>{children}</label>;}
function ConfirmationScreen(){return <div className="pt-40 pb-24 px-6 max-w-lg mx-auto text-center min-h-screen"><div className="w-16 h-16 mx-auto rounded-full bg-cyan/15 flex items-center justify-center mb-6"><Check size={28} className="text-cyan"/></div><h1 className="font-display text-2xl font-bold text-ink mb-3">We're on it.</h1><p className="text-muted">Your report is live and Findora's matching engine is scanning found items across India.</p></div>;}