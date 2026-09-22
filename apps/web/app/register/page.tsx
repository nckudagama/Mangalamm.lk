"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, saveSession } from "../../lib/api";

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitAccount(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api<{ access_token: string; refresh_token: string }>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, phone: phone || undefined }),
      });
      saveSession(data);
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create your account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grain min-h-screen px-5 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-2xl">mangalamm<span className="text-[#a6535e]">.</span></Link>
        <div className="mx-auto mt-12 max-w-2xl rounded-[32px] bg-white p-7 shadow-soft md:p-10">
          <div className="sans mb-8 flex gap-2">
            {[1, 2, 3].map((x) => (
              <div key={x} className={`h-1.5 flex-1 rounded-full ${x <= step ? "bg-[#a6535e]" : "bg-[#e6d8d0]"}`} />
            ))}
          </div>

          {step === 1 && (
            <form onSubmit={submitAccount}>
              <p className="sans text-xs uppercase tracking-[.2em] text-[#a6535e]">Step 1 · Account</p>
              <h1 className="mt-3 text-4xl">Let’s get started.</h1>
              <div className="sans mt-7 space-y-4">
                <input className="field w-full" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Full name" required minLength={2} />
                <input className="field w-full" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" required />
                <input className="field w-full" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone / WhatsApp number (optional)" />
                <input className="field w-full" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Create password (8+ characters)" required minLength={8} />
                {error && <p className="text-sm text-[#a6535e]">{error}</p>}
                <button disabled={loading} className="w-full rounded-2xl bg-[#a6535e] py-3.5 font-semibold text-white">
                  {loading ? "Creating your account…" : "Create account"}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <>
              <p className="sans text-xs uppercase tracking-[.2em] text-[#a6535e]">Step 2 · Account ready</p>
              <h1 className="mt-3 text-4xl">Welcome to Mangalamm, {displayName.split(" ")[0] || "there"}.</h1>
              <p className="sans mt-3 text-sm leading-6 text-[#756b69]">
                Your account is created securely. Next, we’ll build your matrimonial profile. Contact verification can be completed when the OTP provider is connected.
              </p>
              <button onClick={() => setStep(3)} className="sans mt-8 w-full rounded-2xl bg-[#a6535e] py-3.5 font-semibold text-white">
                Continue to profile
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <p className="sans text-xs uppercase tracking-[.2em] text-[#a6535e]">Step 3 · Your journey</p>
              <h1 className="mt-3 text-4xl">Build a profile that feels like you.</h1>
              <p className="sans mt-3 leading-6 text-[#756b69]">
                Add your story, preferences and what you’re looking for. You control what is visible.
              </p>
              <button onClick={() => router.push("/onboarding")} className="sans mt-8 block w-full rounded-2xl bg-[#a6535e] py-3.5 text-center font-semibold text-white">
                Start my profile
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
