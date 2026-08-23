import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldX, Send } from "lucide-react";
import SectionTag from "../components/SectionTag.jsx";
import { api, getErrorMessage } from "../services/api.js";

export default function ClaimVerification() {
  const {id}=useParams(); const [match,setMatch]=useState(null); const [answers,setAnswers]=useState(["","",""]); const [result,setResult]=useState(null); const [error,setError]=useState(""); const [loading,setLoading]=useState(true);
  useEffect(()=>{api.get(`/matches/${id}`).then(({data})=>setMatch(data.match)).catch(e=>setError(getErrorMessage(e,"Match not found."))).finally(()=>setLoading(false));},[id]);
  const progress=answers.filter(Boolean).length/answers.length*100;
  const submit=async(e)=>{e.preventDefault();setError("");try{const {data}=await api.post("/claims",{matchId:id,answers:answers.map((answer,i)=>({question:`Verification answer ${i+1}`,answer}))});setResult(data.claim.result);}catch(e){setError(getErrorMessage(e,"Could not submit claim."));}};
  if(loading)return <div className="pt-40 text-center text-muted min-h-screen">Loading verification...</div>;
  return <div className="pt-32 pb-24 px-6 max-w-xl mx-auto min-h-screen"><SectionTag>Claim Verification</SectionTag><h1 className="font-display text-3xl font-bold text-ink mb-2">Prove it's yours.</h1><p className="text-muted mb-8">Answer the private verification questions associated with {match?`"${match.lostItem.name}"`:"this match"}.</p>
    {error&&<div className="mb-5 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">{error}</div>}
    {result?<ResultScreen result={result}/>:<form onSubmit={submit} className="glass rounded-2xl p-6 md:p-8"><div className="h-1.5 rounded-full bg-line overflow-hidden mb-8"><motion.div animate={{width:`${progress}%`}} className="h-full bg-gradient-to-r from-blue to-cyan"/></div><div className="space-y-6">{["What unique mark or scratch does the item have?","What was inside it, if anything?","What distinguishing feature would only the owner know?"].map((q,i)=><label key={q} className="block"><span className="block text-sm text-ink mb-2">{q}</span><input value={answers[i]} onChange={e=>setAnswers(a=>a.map((v,j)=>j===i?e.target.value:v))} className="input" placeholder="Your answer"/></label>)}</div><button type="submit" className="mt-8 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue to-cyan text-void font-semibold text-sm"><Send size={15}/> Submit Verification</button></form>}
  </div>;
}
function ResultScreen({result}){const verified=result==="verified";return <div className="glass rounded-2xl p-10 text-center"><div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5 ${verified?"bg-cyan/15":"bg-red-400/15"}`}>{verified?<ShieldCheck size={28} className="text-cyan"/>:<ShieldX size={28} className="text-red-400"/>}</div><h2 className="font-display text-xl font-bold text-ink mb-2">{verified?"Verified":"Verification Failed"}</h2><p className="text-muted">{verified?"Ownership verified successfully. The finder has been notified.":"We couldn't verify ownership from those answers. Escalate the claim to an administrator if needed."}</p></div>;}
