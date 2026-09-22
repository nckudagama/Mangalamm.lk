"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import AppShell from "../app-shell";

type P = { id: string; display_name: string; age?: number; gender?: string; location?: string; education?: string; profession?: string; bio?: string; profile_complete_pct?: number };

export default function Discover() {
  const [people, setPeople] = useState<P[]>([]);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sent, setSent] = useState<Record<string, string>>({});

  async function load() {
    setLoading(true); setError("");
    try {
      const query = location ? `?location=${encodeURIComponent(location)}` : "";
      setPeople(await api<P[]>(`/api/v1/discover${query}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please sign in first");
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function interest(profileId: string) {
    try {
      const result = await api<{ status: string; matched: boolean }>("/api/v1/interests", { method: "POST", body: JSON.stringify({ profile_id: profileId }) });
      setSent((s) => ({ ...s, [profileId]: result.matched ? "It's a mutual match ♥" : "Interest sent ✓" }));
    } catch (e) { setError(e instanceof Error ? e.message : "Could not send interest"); }
  }

  return <AppShell><main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-10">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="font-sans text-xs uppercase tracking-[.2em] text-[#a6535e]">Discover</p><h1 className="mt-2 text-4xl sm:text-5xl">People looking for something real.</h1></div>
      <div className="flex gap-2"><input className="field max-w-xs" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Filter by city" /><button onClick={load} className="rounded-2xl bg-[#231f20] px-5 font-sans text-sm text-white">Filter</button></div>
    </div>
    {error && <p className="mt-6 font-sans text-sm text-[#a6535e]">{error}</p>}
    {loading ? <p className="mt-10 font-sans text-sm text-[#756b69]">Loading profiles…</p> : <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((p) => <article key={p.id} className="rounded-[28px] border border-[#e6d8d0] bg-white p-6 shadow-sm">
        <div className="flex h-44 items-center justify-center rounded-[22px] bg-[#efe3d7] text-5xl">{p.display_name?.charAt(0) || "M"}</div>
        <div className="mt-5"><div className="flex items-center justify-between"><h2 className="text-2xl">{p.display_name}{p.age ? `, ${p.age}` : ""}</h2><span className="font-sans rounded-full bg-[#efe3d7] px-2.5 py-1 text-[10px]">Member</span></div>
        <p className="font-sans mt-2 text-sm text-[#756b69]">{[p.location, p.profession].filter(Boolean).join(" · ")}</p>
        <p className="font-sans mt-4 line-clamp-3 text-sm leading-6 text-[#756b69]">{p.bio || "A new Mangalamm member."}</p>
        {sent[p.id] ? <div className="mt-5 rounded-2xl bg-[#efe3d7] py-3 text-center font-sans text-sm text-[#6e4a4e]">{sent[p.id]}</div> : <button onClick={() => interest(p.id)} className="font-sans mt-5 w-full rounded-2xl bg-[#231f20] py-3 text-sm text-white">I'm interested</button>}
        </div>
      </article>)}
    </div>}
  </main></AppShell>;
}
