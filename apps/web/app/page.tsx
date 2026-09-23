"use client";

import Link from "next/link";
import { useLanguage } from "./language-provider";

function Logo() {
  return (
    <Link href="/" aria-label="Mangalamm home" className="group flex items-center gap-3">
      <span className="h-11 w-11 overflow-hidden rounded-[14px] shadow-[0_10px_28px_rgba(166,83,94,.18)]">
        <img src="/icons/icon.svg" alt="" className="h-full w-full" />
      </span>
      <span className="leading-none">
        <span className="block text-[22px] font-semibold tracking-[-.04em]">mangalamm<span className="text-[#a6535e]">.</span></span>
        <span className="mt-1 block text-[11px] tracking-[.16em] text-[#756b69]">මංගලම්</span>
      </span>
    </Link>
  );
}

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const si = language === "si";
  const features = si
    ? [["01","ඔබේ කතාව කියන්න","ඔබේ වටිනාකම්, පවුල, ජීවන රටාව සහ අනාගත බලාපොරොත්තු මත profile එක ගොඩනගන්න."],["02","අර්ථවත් ලෙස හමුවෙන්න","ඔබට ගැළපෙන අදහස්, සීමා සහ privacy සමඟ සාමාජිකයන් සොයන්න."],["03","සම්බන්ධතාවය ස්වභාවිකව ඉදිරියට ගෙනයන්න","Private interest එකක් යවන්න. දෙපාර්ශ්වයම කැමති නම් පමණක් ඉදිරියට යන්න."]]
    : [["01","Tell us your story","A profile built around your values, family, lifestyle and the future you want."],["02","Meet with intention","Discover people with meaningful preferences, clear boundaries and privacy at the centre."],["03","Let connection unfold","Show interest privately. Continue only when the feeling is mutual."]];

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf7f2] text-[#231f20]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <Logo />
        <div className="hidden items-center gap-3 font-sans text-sm md:flex">
          <a href="#how" className="px-3 transition-opacity hover:opacity-60">{si ? "කොහොමද වැඩ කරන්නේ" : "How it works"}</a>
          <a href="#promise" className="px-3 transition-opacity hover:opacity-60">{si ? "අපේ පොරොන්දුව" : "Our promise"}</a>
          <button onClick={() => setLanguage(si ? "en" : "si")} className="rounded-full border border-[#d2c1b8] bg-white/65 px-4 py-2.5 font-semibold">{si ? "EN" : "සිං"}</button>
          <Link href="/login" className="rounded-full border border-[#d2c1b8] px-5 py-2.5 transition hover:bg-white">{si ? "Sign in" : "Sign in"}</Link>
        </div>
        <Link href="/register" className="rounded-full bg-[#231f20] px-5 py-2.5 font-sans text-sm text-white md:hidden">{si ? "Join" : "Join"}</Link>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-8 md:min-h-[720px] md:grid-cols-[1.02fr_.98fr] md:px-10 md:pb-28 md:pt-4">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#ddcbc1] bg-white/55 px-4 py-2 font-sans text-[10px] font-semibold uppercase tracking-[.2em] text-[#a6535e]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#a6535e]" /> {si ? "නවීන ශ්‍රී ලාංකික විවාහ වේදිකාව" : "A modern Sri Lankan matrimonial experience"}
          </div>
          <h1 className="max-w-4xl text-[3.45rem] leading-[.91] tracking-[-.055em] sm:text-6xl md:text-[6.9rem]">
            {si ? <>ජීවිතය <em className="font-normal text-[#a6535e]">එකට</em> ගොඩනගන්න පුළුවන් කෙනෙක් සොයන්න.</> : <>Find someone to <em className="font-normal text-[#a6535e]">build</em> a life with.</>}
          </h1>
          <p className="mt-8 max-w-xl font-sans text-[15px] leading-7 text-[#756b69] md:text-lg">
            {si ? "Mangalamm ඔබේ වටිනාකම්, කැමැත්ත, privacy සහ meaningful connections එකම සන්සුන් තැනකට ගෙන එනවා." : "Mangalamm brings thoughtful introductions, meaningful preferences and privacy into one calm, private space."}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/register" className="rounded-full bg-[#a6535e] px-7 py-4 font-sans text-sm font-semibold text-white shadow-[0_12px_35px_rgba(166,83,94,.22)] transition hover:-translate-y-0.5">
              {si ? "Profile එක හදන්න" : "Create your profile"} <span className="ml-2">↗</span>
            </Link>
            <Link href="/discover" className="rounded-full border border-[#d2c1b8] bg-white/70 px-7 py-4 font-sans text-sm font-semibold transition hover:bg-white">
              {si ? "Matches බලන්න" : "Explore matches"}
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 font-sans text-xs text-[#756b69]">
            <span>✓ {si ? "Privacy first" : "Privacy first"}</span><span>✓ {si ? "Verified members" : "Verified members"}</span><span>✓ {si ? "Mutual connection" : "Mutual connection"}</span>
          </div>
        </div>

        <div className="relative mx-auto h-[470px] w-full max-w-[560px] md:h-[620px]">
          <div className="absolute right-3 top-4 h-[86%] w-[72%] rotate-[8deg] rounded-[48%] bg-[#ead9ce]" />
          <div className="absolute left-[10%] top-[5%] h-[88%] w-[76%] rotate-[-6deg] rounded-[46%] border border-white/60 bg-[#c47b7c] shadow-[0_35px_80px_rgba(92,52,48,.16)]" />
          <div className="absolute inset-[13%] overflow-hidden rounded-[44%] bg-[#9d555e]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,237,224,.85),transparent_20%),linear-gradient(145deg,#6f3843,#b8676d_55%,#e2b9aa)]" />
            <div className="absolute -bottom-12 left-[-10%] h-48 w-[120%] rounded-[50%] bg-[#f1d9ca]/45 blur-sm" />
            <div className="absolute left-[18%] top-[25%] h-36 w-36 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm" />
            <div className="absolute right-[17%] top-[39%] h-24 w-24 rounded-full border border-white/25 bg-white/10" />
            <div className="absolute inset-0 flex items-center justify-center"><div className="mt-20 text-center text-white"><div className="text-5xl font-light">♡</div><div className="mt-2 font-sans text-[10px] uppercase tracking-[.28em]">meaningful beginnings</div></div></div>
          </div>
          <div className="absolute bottom-5 left-0 rounded-[22px] border border-white/70 bg-white/90 px-5 py-4 shadow-[0_20px_50px_rgba(70,40,35,.14)] backdrop-blur">
            <div className="font-sans text-[9px] uppercase tracking-[.2em] text-[#a6535e]">Mangalamm · මංගලම්</div>
            <div className="mt-1 text-sm">{si ? "අර්ථවත් ආරම්භයක් සඳහා." : "For something that lasts."}</div>
          </div>
        </div>
      </section>

      <section id="how" className="border-y border-[#e5d7cf] bg-[#fffdfa]">
        <div className="mx-auto grid max-w-7xl md:grid-cols-3">
          {features.map(([number, title, body]) => <div key={number} className="border-b border-[#e5d7cf] p-8 md:border-b-0 md:border-r md:p-12 last:border-0"><span className="font-sans text-xs text-[#a6535e]">{number}</span><h2 className="mt-8 text-3xl tracking-[-.025em]">{title}</h2><p className="mt-4 font-sans text-sm leading-6 text-[#756b69]">{body}</p></div>)}
        </div>
      </section>

      <section id="promise" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-[.9fr_1.1fr] md:items-end">
          <div><p className="font-sans text-xs font-semibold uppercase tracking-[.24em] text-[#a6535e]">{si ? "Mangalamm පොරොන්දුව" : "The Mangalamm promise"}</p><h2 className="mt-5 text-5xl leading-[.98] tracking-[-.04em] md:text-6xl">{si ? "විවාහය ගැන serious. ගමන ගැන gentle." : "Serious about marriage. Gentle about the journey."}</h2></div>
          <div><p className="max-w-2xl font-sans text-base leading-7 text-[#756b69] md:text-lg">{si ? "Profile, preferences, discovery සහ mutual connections වලින් සරලව පටන් ගන්න. ඔබේ private information එක consent එක මත පාලනය වෙයි." : "Start simply with profiles, preferences, discovery and mutual connections. Your private information stays under your control, with consent at the centre."}</p><div className="mt-8 flex flex-wrap gap-2 font-sans text-xs">{[si?"Privacy by design":"Private by design",si?"Consent-based AI":"Consent-based AI",si?"Verified identity":"Verified identity",si?"සැබෑ සම්බන්ධතා සඳහා":"Built for real relationships"].map((item)=><span key={item} className="rounded-full bg-[#efe3d7] px-4 py-2.5">{item}</span>)}</div></div>
        </div>
      </section>

      <footer className="border-t border-[#e5d7cf] px-5 py-8 font-sans text-xs text-[#756b69] md:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="font-medium text-[#231f20]">mangalamm<span className="text-[#a6535e]">.</span> · මංගලම්</div><div>© 2026 Mangalamm · {si ? "අර්ථවත් ආරම්භයක් සඳහා." : "Made for meaningful beginnings."}</div></div></footer>
    </main>
  );
}
