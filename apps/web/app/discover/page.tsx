"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Link from "next/link";
import AppShell from "../app-shell";

type P = { id: string; display_name: string; age?: number; gender?: string; location?: string; education?: string; profession?: string; bio?: string; profile_complete_pct?: number };

export default function Discover() {
  const [people,setPeople]=useState<P[]>([]),[location,setLocation]=useState(""),[loading,setLoading]=useState(true),[error,setError]=useState(""),[sent,setSent]=useState<Record<string,string>>({});
  async function load(){setLoading(true);setError("");try{const q=location?`?location=${encodeURIComponent(location)}`:"";setPeople(await api<P[]>(`/api/v1/discover${q}`));}catch(e){setError(e instanceof Error?e.message:"Please sign in first")}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);
  async function interest(id:string){try{const r=await api<{status:string;matched:boolean}>("/api/v1/interests",{method:"POST",body:JSON.stringify({profile_id:id})});setSent(s=>({...s,[id]:r.matched?"It’s a mutual match ♥":"Interest sent ✓"}))}catch(e){setError(e instanceof Error?e.message:"Could not send interest")}}
  return <AppShell><main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-10">
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div><p className="font-sans text-[10px] font-semibold uppercase tracking-[.25em] text-[var(--rose)]">Discover</p><h1 className="mt-3 max-w-2xl text-5xl leading-[.98] tracking-[-.04em] md:text-6xl">People looking for something <em className="font-normal text-[var(--rose)]">real.</em></h1><p className="mt-4 max-w-xl font-sans text-sm leading-6 text-[var(--muted)]">Take your time. Read a story, notice what matters, and connect only when it feels right.</p></div>
      <div className="flex w-full gap-2 md:w-auto"><input className="field max-w-xs" value={location} onChange={e=>setLocation(e.target.value)} placeholder="Filter by city" /><button onClick={load} className="rounded-2xl bg-[var(--ink)] px-5 font-sans text-sm text-white">Filter</button></div>
    </div>
    {error&&<p className="mt-6 rounded-2xl bg-[#f4e4e2] px-4 py-3 font-sans text-sm text-[var(--rose)]">{error}</p>}
    {loading?<p className="mt-12 font-sans text-sm text-[var(--muted)]">Finding people…</p>:people.length===0?<div className="mt-10 rounded-[30px] border border-[var(--line)] bg-white p-10 text-center shadow-soft"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cream)] text-2xl text-[var(--rose)]">♡</div><h2 className="mt-5 text-3xl">No profiles here yet.</h2><p className="mx-auto mt-3 max-w-md font-sans text-sm leading-6 text-[var(--muted)]">Try another city, or come back soon as more Mangalamm members join.</p><button onClick={()=>{setLocation("");load()}} className="mt-6 rounded-full bg-[var(--ink)] px-6 py-3 font-sans text-sm text-white">Show everyone</button></div>:<div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {people.map(p=><article key={p.id} className="group overflow-hidden rounded-[30px] border border-[var(--line)] bg-white shadow-soft transition duration-300 hover:-translate-y-1">
        <div className="relative flex h-56 items-end overflow-hidden bg-[#eadbd2]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,#f8e8dc,transparent_28%),linear-gradient(145deg,#d6b4aa,#b66c71_55%,#7c424b)] opacity-90"/><div className="relative m-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-white/20 text-2xl text-white backdrop-blur">{p.display_name?.charAt(0)||"M"}</div><span className="absolute right-5 top-5 rounded-full bg-white/85 px-3 py-1.5 font-sans text-[9px] uppercase tracking-[.14em] text-[var(--rose)]">Member profile</span></div>
        <div className="p-6"><div className="flex items-start justify-between gap-3"><h2 className="text-2xl tracking-[-.02em]">{p.display_name}{p.age?`, ${p.age}`:""}</h2></div><p className="mt-2 font-sans text-xs text-[var(--muted)]">{[p.location,p.profession].filter(Boolean).join(" · ")||"Sri Lanka"}</p><p className="mt-4 line-clamp-3 font-sans text-sm leading-6 text-[var(--muted)]">{p.bio||"A new Mangalamm member."}</p><Link href={"/profile/"+p.id} className="mt-4 inline-block font-sans text-xs font-semibold uppercase tracking-[.14em] text-[var(--rose)]">View profile →</Link>{sent[p.id]?<div className="mt-5 rounded-2xl bg-[var(--cream)] py-3 text-center font-sans text-sm text-[#6e4a4e]">{sent[p.id]}</div>:<button onClick={()=>interest(p.id)} className="mt-5 w-full rounded-2xl bg-[var(--ink)] py-3.5 font-sans text-sm text-white transition hover:bg-[#3a3435]">I’m interested <span className="ml-1 text-[#e8b2ad]">♡</span></button>}</div>
      </article>)}
    </div>}
  </main></AppShell>;
}