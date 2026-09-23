"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api";
import AppShell from "../../app-shell";

type Data = {
  profile: {
    display_name?: string; age?: number; gender?: string; marital_status?: string;
    location?: string; education?: string; profession?: string; bio?: string; profile_complete_pct?: number;
  };
  matching: {
    overall_score: number;
    weights: { ai: number; astrology: number };
    ai: { score: number };
    astrology: { score: number | null; available?: boolean };
  };
};

export default function ProfileView() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    if (params.id) api<Data>("/api/v1/matching/profiles/" + params.id).then(setData).catch(() => setData(null));
  }, [params.id]);

  if (!data) return <AppShell><main className="mx-auto max-w-4xl px-4 py-16 font-sans text-sm text-[var(--muted)]">Loading profile…</main></AppShell>;

  const p = data.profile;
  return <AppShell><main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:py-12">
    <Link href="/discover" className="font-sans text-xs uppercase tracking-[.15em] text-[var(--rose)]">← Back to discover</Link>
    <section className="mt-6 overflow-hidden rounded-[34px] border border-[var(--line)] bg-white shadow-soft">
      <div className="flex h-64 items-end bg-[radial-gradient(circle_at_70%_25%,#f8e8dc,transparent_28%),linear-gradient(145deg,#d6b4aa,#b66c71_55%,#7c424b)] p-7">
        <div><div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl text-white backdrop-blur">{p.display_name?.charAt(0) || "M"}</div><h1 className="text-5xl text-white">{p.display_name}{p.age ? ", " + p.age : ""}</h1></div>
      </div>
      <div className="p-7">
        <p className="font-sans text-sm text-[var(--muted)]">{[p.location, p.profession].filter(Boolean).join(" · ")}</p>
        <p className="mt-5 max-w-2xl font-sans text-sm leading-7 text-[var(--muted)]">{p.bio || "This member has not added a bio yet."}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {[["Gender", p.gender],["Marital status",p.marital_status],["Education",p.education],["Profile completeness",p.profile_complete_pct ? p.profile_complete_pct + "%" : undefined]].map(([k,v]) => <div key={k} className="rounded-2xl bg-[var(--cream)] p-4"><p className="font-sans text-[10px] uppercase tracking-[.15em] text-[var(--muted)]">{k}</p><p className="mt-1 font-sans text-sm">{v || "Not provided"}</p></div>)}
        </div>
        <div className="mt-7 rounded-2xl border border-[var(--line)] p-5">
          <p className="font-sans text-[10px] uppercase tracking-[.15em] text-[var(--muted)]">Compatibility preview</p>
          <div className="mt-2 flex items-end justify-between"><strong className="text-5xl">{data.matching.overall_score}%</strong><span className="font-sans text-xs text-[var(--muted)]">AI {data.matching.weights.ai}% · Astrology {data.matching.weights.astrology}%</span></div>
          <p className="mt-3 font-sans text-xs leading-5 text-[var(--muted)]">Compatibility is a data-based signal, not a guarantee. Photos and private contact details are not exposed on this view.</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={"/matching?profile=" + p} className="rounded-2xl bg-[var(--ink)] px-5 py-3 font-sans text-sm text-white">Explore matching</Link>
        </div>
      </div>
    </section>
  </main></AppShell>;
}
