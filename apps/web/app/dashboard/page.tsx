"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "../app-shell";
import { api } from "../../lib/api";

type Profile = { display_name?: string; profile_complete_pct?: number };

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile>({});
  useEffect(() => { api<Profile>("/api/v1/profiles/me").then(setProfile).catch(() => undefined); }, []);
  const pct = profile.profile_complete_pct || 0;
  return <AppShell><main className="mx-auto max-w-7xl px-5 py-10 md:px-10"><div className="grid gap-8 lg:grid-cols-[1.4fr_.6fr]"><section><p className="font-sans text-xs uppercase tracking-[.2em] text-[#a6535e]">Your space</p><h1 className="mt-3 text-5xl tracking-tight">{profile.display_name ? `Welcome, ${profile.display_name}.` : "Welcome."}</h1><p className="mt-3 max-w-xl font-sans text-sm leading-6 text-[#756b69]">A calm place to discover people who are looking for the same kind of future.</p><Link href="/discover" className="mt-7 inline-block rounded-full bg-[#231f20] px-6 py-3 font-sans text-sm text-white">Explore people</Link></section><aside className="space-y-4"><div className="rounded-[28px] bg-[#efe3d7] p-6"><p className="font-sans text-xs uppercase tracking-widest text-[#a6535e]">Profile</p><h2 className="mt-3 text-3xl">{pct}% complete</h2><div className="mt-5 h-2 rounded-full bg-white/70"><div className="h-2 rounded-full bg-[#a6535e]" style={{ width: `${pct}%` }} /></div><Link href="/onboarding" className="mt-5 inline-block font-sans text-xs font-semibold underline">Finish your profile →</Link></div><div className="rounded-[28px] border border-[#e3d5cd] bg-white/60 p-6"><p className="font-sans text-xs uppercase tracking-widest text-[#a6535e]">Privacy</p><h2 className="mt-3 text-2xl">You stay in control.</h2><p className="mt-2 font-sans text-sm leading-6 text-[#756b69]">Your private information is only used where you authorize it.</p><Link href="/settings" className="mt-4 inline-block font-sans text-xs font-semibold">Manage consent →</Link></div></aside></div></main></AppShell>;
}
