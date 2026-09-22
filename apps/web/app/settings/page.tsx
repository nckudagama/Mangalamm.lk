"use client";

import { useEffect, useState } from "react";
import AppShell from "../app-shell";
import { api } from "../../lib/api";

type Consent = { consent_type: string; granted: boolean };

export default function Settings() {
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState("");
  useEffect(() => { api<Consent[]>("/api/v1/consent").then((rows) => setConsents(Object.fromEntries(rows.map((r) => [r.consent_type, r.granted])))).catch(() => undefined); }, []);

  async function toggle(type: string) {
    const next = !consents[type];
    setSaving(type);
    try {
      await api("/api/v1/consent", { method: "POST", body: JSON.stringify({ consent_type: type, granted: next, version: "1.0" }) });
      setConsents((c) => ({ ...c, [type]: next }));
    } finally { setSaving(""); }
  }

  const items = [
    ["AI_ANALYSIS", "AI compatibility", "Allow Mangalamm AI to analyze authorized profile information."],
    ["RESEARCH", "Research", "Allow anonymized, consented data to support research."],
    ["ASTROLOGY_ANALYSIS", "Astrology analysis", "Allow the separate astrology engine to process the horoscope data you choose to provide."],
  ];

  return <AppShell><main className="mx-auto max-w-3xl px-5 py-12 md:py-20"><p className="font-sans text-xs uppercase tracking-[.2em] text-[#a6535e]">Privacy</p><h1 className="mt-3 text-5xl">Your controls.</h1><p className="mt-4 font-sans text-sm leading-6 text-[#756b69]">Consent is separate from profile visibility. You can change these choices later.</p><div className="mt-8 space-y-3">{items.map(([type,title,description]) => <div key={type} className="flex items-center justify-between gap-5 rounded-[24px] border border-[#e3d5cd] bg-white/65 p-5"><div><h2 className="text-xl">{title}</h2><p className="mt-1 font-sans text-xs leading-5 text-[#756b69]">{description}</p></div><button disabled={saving === type} onClick={() => toggle(type)} className={`h-7 w-12 rounded-full p-1 ${consents[type] ? "bg-[#a6535e]" : "bg-[#d8ccc5]"} disabled:opacity-50`}><span className={`block h-5 w-5 rounded-full bg-white transition ${consents[type] ? "translate-x-5" : ""}`}/></button></div>)}</div></main></AppShell>;
}
