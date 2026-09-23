"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../app-shell";
import { api } from "../../lib/api";

type Form = {
  display_name: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  location: string;
  education: string;
  profession: string;
  bio: string;
  wants_children: boolean | null;
  children_count: string;
  interests: string[];
  lifestyle: string[];
  values: string[];
  preferred_age_min: string;
  preferred_age_max: string;
  preferred_gender: string;
  preferred_location: string;
};

const initial: Form = {
  display_name: "",
  date_of_birth: "",
  gender: "",
  marital_status: "",
  location: "",
  education: "",
  profession: "",
  bio: "",
  wants_children: null,
  children_count: "",
  interests: [],
  lifestyle: [],
  values: [],
  preferred_age_min: "25",
  preferred_age_max: "35",
  preferred_gender: "",
  preferred_location: "",
};

const groups = {
  interests: ["Family", "Travel", "Arts", "Food", "Nature", "Fitness", "Reading", "Music"],
  lifestyle: ["Active", "Quiet", "Social", "Homebody", "Career-focused", "Entrepreneur", "Traditional", "Modern"],
  values: ["Family", "Faith", "Honesty", "Kindness", "Growth", "Stability", "Independence", "Community"],
};

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Partial<Form>>("/api/v1/profiles/me")
      .then((p) => setForm((current) => ({
        ...current,
        ...p,
        children_count: p.children_count?.toString() || "",
        preferred_age_min: p.preferred_age_min?.toString() || current.preferred_age_min,
        preferred_age_max: p.preferred_age_max?.toString() || current.preferred_age_max,
        preferred_gender: p.preferred_gender || current.preferred_gender,
        preferred_location: p.preferred_location || current.preferred_location,
        interests: p.interests || [],
        lifestyle: p.lifestyle || [],
        values: p.values || [],
      })))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof Form, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const toggle = (key: "interests" | "lifestyle" | "values", value: string) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((x) => x !== value) : [...f[key], value],
    }));
  };

  async function save() {
    setSaving(true);
    setError("");
    try {
      await api("/api/v1/profiles/me", {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          children_count: form.children_count ? Number(form.children_count) : null,
          preferred_age_min: form.preferred_age_min ? Number(form.preferred_age_min) : null,
          preferred_age_max: form.preferred_age_max ? Number(form.preferred_age_max) : null,
        }),
      });
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AppShell><main className="mx-auto max-w-3xl px-5 py-20 font-sans text-sm text-[#756b69]">Loading your profile…</main></AppShell>;

  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-5 py-10 md:py-16">
        <div className="mb-8 flex gap-2">{[1, 2, 3].map((n) => <div key={n} className={`h-1.5 flex-1 rounded-full ${n <= step ? "bg-[#a6535e]" : "bg-[#e2d6cf]"}`} />)}</div>
        <p className="font-sans text-xs uppercase tracking-[.2em] text-[#a6535e]">Profile builder</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{step === 1 ? "Tell us about you." : step === 2 ? "What matters to you?" : "Who are you hoping to meet?"}</h1>

        <div className="mt-8 space-y-5 rounded-[30px] border border-[#e3d5cd] bg-white/70 p-6 md:p-8">
          {step === 1 && <>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="field" value={form.display_name} onChange={(e) => set("display_name", e.target.value)} placeholder="Display name" />
              <input className="field" type="date" value={form.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} />
              <select className="field" value={form.gender} onChange={(e) => set("gender", e.target.value)}><option value="">Gender</option><option>Woman</option><option>Man</option><option>Other</option></select>
              <select className="field" value={form.marital_status} onChange={(e) => set("marital_status", e.target.value)}><option value="">Marital status</option><option>Never married</option><option>Divorced</option><option>Widowed</option></select>
              <input className="field" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="City / district" />
              <input className="field" value={form.education} onChange={(e) => set("education", e.target.value)} placeholder="Education" />
              <input className="field" value={form.profession} onChange={(e) => set("profession", e.target.value)} placeholder="Profession" />
              <select className="field" value={form.wants_children === null ? "" : String(form.wants_children)} onChange={(e) => set("wants_children", e.target.value === "" ? null : e.target.value === "true")}><option value="">Children preference</option><option value="true">Would like children</option><option value="false">Doesn't want children</option></select>
            </div>
            <textarea className="field min-h-32" value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="A little about yourself" />
          </>}

          {step === 2 && (Object.entries(groups) as [keyof typeof groups, string[]][]).map(([key, items]) => (
            <div key={key}>
              <p className="mb-3 font-sans text-xs uppercase tracking-[.16em] text-[#756b69]">{key}</p>
              <div className="flex flex-wrap gap-2">{items.map((x) => <button type="button" key={x} onClick={() => toggle(key, x)} className={`rounded-full border px-4 py-2 font-sans text-xs ${form[key].includes(x) ? "border-[#a6535e] bg-[#a6535e] text-white" : "border-[#d8c8c0]"}`}>{x}</button>)}</div>
            </div>
          ))}

          {step === 3 && <>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="field" type="number" min="18" max="100" value={form.preferred_age_min} onChange={(e) => set("preferred_age_min", e.target.value)} placeholder="Minimum age" />
              <input className="field" type="number" min="18" max="100" value={form.preferred_age_max} onChange={(e) => set("preferred_age_max", e.target.value)} placeholder="Maximum age" />
              <select className="field" value={form.preferred_gender} onChange={(e) => set("preferred_gender", e.target.value)}><option value="">Preferred gender (optional)</option><option>Woman</option><option>Man</option><option>Other</option></select>
            </div>
            <input className="field" value={form.preferred_location} onChange={(e) => set("preferred_location", e.target.value)} placeholder="Preferred location (optional)" />
            <textarea className="field min-h-28" placeholder="Important preferences / deal-breakers (kept as private profile notes for now)" />
          </>}
        </div>

        {error && <p className="mt-4 font-sans text-sm text-[#a6535e]">{error}</p>}
        <div className="mt-6 flex justify-between">
          <button disabled={step === 1 || saving} onClick={() => setStep(step - 1)} className="rounded-full border border-[#d8c8c0] px-6 py-3 font-sans text-sm disabled:opacity-30">Back</button>
          <button disabled={saving} onClick={() => step === 3 ? save() : setStep(step + 1)} className="rounded-full bg-[#231f20] px-7 py-3 font-sans text-sm text-white disabled:opacity-60">{saving ? "Saving…" : step === 3 ? "Save profile" : "Continue"}</button>
        </div>
      </main>
    </AppShell>
  );
}
