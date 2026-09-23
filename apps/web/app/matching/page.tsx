"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import AppShell from "../app-shell";

type Candidate = { id: string; display_name?: string; age?: number; location?: string; profession?: string };
type Matching = {
  overall_score: number;
  weights: { ai: number; astrology: number };
  ai: { score: number; dimensions: Record<string, number> };
  astrology: { score: number | null; available?: boolean; explanation: string };
  disclaimer: string;
};

const labels: Record<string, string> = {
  values: "Values",
  personality: "Personality",
  communication: "Communication",
  emotional_compatibility: "Emotional compatibility",
  lifestyle: "Lifestyle",
  relationship_goals: "Relationship goals",
  family_orientation: "Family orientation",
  interests: "Interests",
  intellectual_compatibility: "Intellectual compatibility",
  life_plans: "Life plans",
};

export default function Matching() {
  const [people, setPeople] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState("");
  const [ai, setAi] = useState(60);
  const [result, setResult] = useState<Matching | null>(null);

  useEffect(() => {
    api<Candidate[]>("/api/v1/discover").then(list => {
      setPeople(list);
      if (list[0]) setSelected(list[0].id);
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!selected) return;
    const astrology = 100 - ai;
    api<Matching>("/api/v1/matching/preview/" + selected + "?ai_weight=" + ai + "&astrology_weight=" + astrology)
      .then(setResult)
      .catch(() => setResult(null));
  }, [selected, ai]);

  return <AppShell><main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12 lg:px-10">
    <p className="font-sans text-[10px] font-semibold uppercase tracking-[.25em] text-[var(--rose)]">AI Matching</p>
    <h1 className="mt-3 max-w-3xl text-5xl leading-[.98] tracking-[-.04em] md:text-6xl">Two signals. <em className="font-normal text-[var(--rose)]">One compatibility view.</em></h1>
    <p className="mt-4 max-w-2xl font-sans text-sm leading-6 text-[var(--muted)]">Mangalamm keeps AI compatibility and astrology separate, then combines their signals. The default balance is AI 60% and Astrology 40%.</p>

    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <section className="rounded-[30px] border border-[var(--line)] bg-white p-6 shadow-soft">
        <label className="font-sans text-xs font-semibold uppercase tracking-[.16em] text-[var(--muted)]">Profile</label>
        <select className="field mt-3 w-full" value={selected} onChange={e => setSelected(e.target.value)}>
          {people.map(p => <option key={p.id} value={p.id}>{p.display_name || "Member"}{p.age ? ", " + p.age : ""}</option>)}
        </select>

        <div className="mt-9">
          <div className="flex justify-between font-sans text-sm"><span>AI matching</span><strong>{ai}%</strong></div>
          <input className="mt-4 w-full accent-[var(--rose)]" type="range" min="0" max="100" value={ai} onChange={e => setAi(Number(e.target.value))} />
          <div className="mt-2 flex justify-between font-sans text-xs text-[var(--muted)]"><span>Astrology 100%</span><span>AI 100%</span></div>
        </div>

        <div className="mt-7 overflow-hidden rounded-full bg-[#eee3dc]">
          <div className="flex h-3">
            <div className="bg-[var(--rose)] transition-all" style={{ width: ai + "%" }} />
            <div className="bg-[#9b8174] transition-all" style={{ width: (100 - ai) + "%" }} />
          </div>
        </div>
        <div className="mt-3 flex justify-between font-sans text-xs text-[var(--muted)]"><span>AI {ai}%</span><span>Astrology {100 - ai}%</span></div>

        <p className="mt-7 rounded-2xl bg-[var(--cream)] p-4 font-sans text-xs leading-5 text-[var(--muted)]">
          This control changes the <strong className="text-[var(--ink)]">weight</strong> of each signal. It does not claim that a score is a prediction or guarantee.
        </p>
      </section>

      <section className="rounded-[30px] border border-[var(--line)] bg-white p-6 shadow-soft">
        {result ? <>
          <div className="flex items-end justify-between gap-4">
            <div><p className="font-sans text-xs uppercase tracking-[.16em] text-[var(--muted)]">Overall compatibility</p><div className="mt-2 text-7xl tracking-[-.05em]">{result.overall_score}<span className="text-3xl text-[var(--rose)]">%</span></div></div>
            <div className="text-right font-sans text-xs text-[var(--muted)]">AI {result.weights.ai}%<br />Astrology {result.weights.astrology}%</div>
          </div>
          <div className="mt-7 h-3 overflow-hidden rounded-full bg-[#eee3dc]"><div className="h-full bg-[var(--rose)] transition-all" style={{ width: result.overall_score + "%" }} /></div>

          <h2 className="mt-8 text-2xl">AI — 10 dimensions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.entries(result.ai.dimensions).map(([key, value]) =>
              <div key={key} className="rounded-2xl border border-[var(--line)] p-3">
                <div className="flex justify-between font-sans text-xs"><span>{labels[key] || key}</span><strong>{value}%</strong></div>
                <div className="mt-2 h-1.5 rounded-full bg-[#eee3dc]"><div className="h-full rounded-full bg-[var(--rose)]" style={{ width: value + "%" }} /></div>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--line)] p-4 font-sans text-sm">
            <div className="flex justify-between"><span>Astrology signal</span><strong>{result.astrology.available ? (result.astrology.score + "%") : "Plugin pending"}</strong></div>
            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{result.astrology.explanation}</p>
          </div>
          <p className="mt-5 font-sans text-[11px] leading-5 text-[var(--muted)]">{result.disclaimer}</p>
        </> : <p className="font-sans text-sm text-[var(--muted)]">Select a profile to calculate compatibility.</p>}
      </section>
    </div>
  </main></AppShell>;
}
