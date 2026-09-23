"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "../app-shell";
import { api } from "../../lib/api";

type Profile = { display_name?: string; profile_complete_pct?: number };
type Summary = { profile_complete_pct: number; received_interests: number; active_matches: number; sent_interests: number };

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile>({});
  const [summary, setSummary] = useState<Summary>({ profile_complete_pct: 0, received_interests: 0, active_matches: 0, sent_interests: 0 });
  useEffect(() => {
    Promise.all([
      api<Profile>("/api/v1/profiles/me"),
      api<Summary>("/api/v1/dashboard/summary"),
    ]).then(([profileData, summaryData]) => { setProfile(profileData); setSummary(summaryData); }).catch(() => undefined);
  }, []);
  const pct = profile.profile_complete_pct || 0;
  return <AppShell><main className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12">
    <section className="relative overflow-hidden rounded-[34px] bg-[#231f20] px-7 py-9 text-white shadow-[0_30px_80px_rgba(55,34,30,.16)] md:px-12 md:py-12">
      <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#a6535e]/35 blur-3xl" />
      <div className="absolute bottom-[-100px] right-[20%] h-64 w-64 rounded-full bg-[#ead0c5]/10 blur-3xl" />
      <div className="relative max-w-3xl">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[.25em] text-[#e5aaa5]">Your Mangalamm space</p>
        <h1 className="mt-4 text-5xl leading-[.98] tracking-[-.04em] md:text-7xl">{profile.display_name ? <>Welcome, <em className="font-normal text-[#e8b2ad]">{profile.display_name}.</em></> : "Welcome."}</h1>
        <p className="mt-5 max-w-xl font-sans text-sm leading-7 text-white/65 md:text-base">A calmer way to discover people who are looking for the same kind of future.</p>
        <Link href="/discover" className="mt-8 inline-flex rounded-full bg-white px-6 py-3.5 font-sans text-sm font-semibold text-[#231f20] transition hover:-translate-y-0.5">Explore people <span className="ml-2">↗</span></Link>
      </div>
    </section>

    <div className="mt-6 grid gap-5 md:grid-cols-3">
      <div className="rounded-[28px] border border-[var(--line)] bg-white p-6 shadow-soft md:col-span-2">
        <div className="flex items-start justify-between gap-5"><div><p className="font-sans text-[10px] uppercase tracking-[.22em] text-[var(--rose)]">Profile strength</p><h2 className="mt-2 text-3xl">Make your introduction count.</h2></div><span className="rounded-full bg-[var(--cream)] px-3 py-1.5 font-sans text-xs">{pct}%</span></div>
        <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-[#eee3dc]"><div className="h-full rounded-full bg-[var(--rose)] transition-all" style={{width:`${pct}%`}} /></div>
        <p className="mt-3 font-sans text-xs text-[var(--muted)]">{pct < 100 ? "A few more details can help people understand you better." : "Your profile is complete."}</p>
        {pct < 100 && <Link href="/onboarding" className="mt-5 inline-block font-sans text-xs font-semibold underline underline-offset-4">Continue your profile →</Link>}
      </div>
      <div className="rounded-[28px] border border-[var(--line)] bg-[#efe3d7] p-6">
        <p className="font-sans text-[10px] uppercase tracking-[.22em] text-[var(--rose)]">Privacy</p>
        <h2 className="mt-3 text-2xl">You stay in control.</h2>
        <p className="mt-2 font-sans text-sm leading-6 text-[var(--muted)]">Visibility and AI consent are separate choices.</p>
        <Link href="/settings" className="mt-5 inline-block font-sans text-xs font-semibold underline underline-offset-4">Manage controls →</Link>
      </div>
    </div>

    <div className="mt-6 rounded-[28px] border border-[var(--line)] bg-white p-6 shadow-soft"><div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><p className="font-sans text-[10px] uppercase tracking-[.22em] text-[var(--rose)]">Mangalamm Brain</p><h2 className="mt-2 text-3xl">Explore your compatibility signals.</h2><p className="mt-2 max-w-2xl font-sans text-sm leading-6 text-[var(--muted)]">See the 10 AI dimensions and adjust the AI ↔ Astrology balance from the default 60/40.</p></div><Link href="/matching" className="rounded-full bg-[var(--ink)] px-6 py-3 font-sans text-sm text-white">Open AI Matching →</Link></div></div>\n\n<div className="mt-6 grid grid-cols-3 gap-3 md:gap-5">
      {[["Matches", summary.active_matches], ["Interests received", summary.received_interests], ["Interests sent", summary.sent_interests]].map(([label, value]) => (
        <div key={label} className="rounded-[24px] border border-[var(--line)] bg-white p-5 shadow-soft md:p-6">
          <p className="font-sans text-[10px] uppercase tracking-[.18em] text-[var(--rose)]">{label}</p>
          <p className="mt-2 text-3xl md:text-4xl">{value}</p>
        </div>
      ))}
    </div>

    <div className="mt-10 flex items-end justify-between"><div><p className="font-sans text-[10px] uppercase tracking-[.22em] text-[var(--rose)]">Your next step</p><h2 className="mt-2 text-3xl">When you’re ready, discover.</h2></div><Link href="/discover" className="hidden rounded-full border border-[var(--line)] bg-white px-5 py-2.5 font-sans text-xs md:block">View discovery</Link></div>
  </main></AppShell>;
}