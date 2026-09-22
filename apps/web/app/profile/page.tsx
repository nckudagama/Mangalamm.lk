"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "../app-shell";
import { api } from "../../lib/api";

type P = {
  display_name?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  location?: string;
  education?: string;
  profession?: string;
  bio?: string;
  interests?: string[];
  lifestyle?: string[];
  values?: string[];
  profile_complete_pct?: number;
};

export default function Profile() {
  const [p, setP] = useState<P>({});
  useEffect(() => {
    api<P>("/api/v1/profiles/me").then(setP).catch(() => undefined);
  }, []);

  const details: Array<[string, string | undefined]> = [
    ["Location", p.location],
    ["Education", p.education],
    ["Profession", p.profession],
    ["Marital status", p.marital_status],
    ["Gender", p.gender],
  ];

  const signals: Array<[string, string[] | undefined]> = [
    ["Interests", p.interests],
    ["Lifestyle", p.lifestyle],
    ["Values", p.values],
  ];

  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <aside className="rounded-[28px] bg-white p-6 shadow-soft">
            <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[#efe3d7] text-5xl text-[#a6535e]">
              {p.display_name?.[0] || "M"}
            </div>
            <h1 className="mt-5 text-center text-2xl">{p.display_name || "Your profile"}</h1>
            <div className="mt-5 h-2 rounded-full bg-[#efe3d7]">
              <div
                className="h-2 rounded-full bg-[#a6535e]"
                style={{ width: `${p.profile_complete_pct || 0}%` }}
              />
            </div>
            <p className="font-sans mt-2 text-center text-xs text-[#756b69]">
              {p.profile_complete_pct || 0}% complete
            </p>
            <Link href="/onboarding" className="font-sans mt-5 block text-center text-xs underline">
              Edit profile →
            </Link>
          </aside>

          <section className="space-y-5">
            <div className="rounded-[28px] bg-white p-7 shadow-soft">
              <p className="font-sans text-xs uppercase tracking-[.2em] text-[#a6535e]">About you</p>
              <h2 className="mt-3 text-3xl">The person behind the profile.</h2>

              <div className="font-sans mt-6 grid gap-3 sm:grid-cols-2">
                {details.map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-[#fbf7f2] p-4">
                    <span className="text-xs text-[#756b69]">{label}</span>
                    <p className="mt-1">{value || "Not added yet"}</p>
                  </div>
                ))}
              </div>

              {p.bio && (
                <p className="font-sans mt-5 text-sm leading-7 text-[#756b69]">{p.bio}</p>
              )}
            </div>

            <div className="rounded-[28px] border border-[#dbc8bd] bg-[#efe3d7] p-7">
              <p className="font-sans text-xs uppercase tracking-[.2em] text-[#a6535e]">Your signals</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {signals.map(([label, items]) => (
                  <div key={label}>
                    <p className="font-sans text-xs text-[#756b69]">{label}</p>
                    <p className="mt-2 text-sm">{items?.join(" · ") || "Not added yet"}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
