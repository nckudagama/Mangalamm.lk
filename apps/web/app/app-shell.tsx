"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./language-provider";

const items = [
  { href: "/dashboard", si: "මුල් පිටුව", en: "Home", icon: "⌂" },
  { href: "/discover", si: "සොයන්න", en: "Discover", icon: "♡" },
  { href: "/matching", si: "ගැළපීම", en: "AI Match", icon: "✦" },
  { href: "/messages", si: "පණිවිඩ", en: "Messages", icon: "◌" },
  { href: "/profile", si: "මගේ Profile", en: "Profile", icon: "○" },
];

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Mangalamm home">
      <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[13px] shadow-[0_8px_24px_rgba(166,83,94,.22)]">
        <img src="/branding/mangalamm-logo.png" alt="" className="h-full w-full" />
      </span>
    </Link>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--paper)] pb-[calc(78px+env(safe-area-inset-bottom))] md:pb-0">
      <header className="safe-top sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--paper)]/88 backdrop-blur-2xl">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[78px] lg:px-10">
          <Brand />
          <nav className="hidden items-center gap-1 font-sans text-[13px] md:flex">
            {items.map((item) => (
              <Link key={item.href} href={item.href} className={`rounded-full px-4 py-2.5 transition ${pathname===item.href?"bg-white text-[var(--ink)] shadow-sm":"text-[var(--muted)] hover:bg-white/60"}`}>
                {language === "si" ? item.si : item.en}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === "si" ? "en" : "si")}
              className="rounded-full border border-[var(--line)] bg-white/65 px-3.5 py-2 font-sans text-[11px] font-semibold shadow-sm transition hover:bg-white"
              aria-label="Change language"
            >
              {language === "si" ? "EN" : "සිං"}
            </button>
            <Link href="/settings" className="hidden rounded-full border border-[var(--line)] bg-white/55 px-4 py-2 font-sans text-xs text-[var(--muted)] transition hover:bg-white sm:block">
              {language === "si" ? "සැකසුම්" : "Settings"}
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--line)] bg-[var(--paper)]/96 px-1.5 pt-2 backdrop-blur-2xl md:hidden">
        <div className="mx-auto flex max-w-md justify-around">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className={`flex min-w-[61px] flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 font-sans text-[10px] ${pathname===item.href?"font-semibold text-[var(--rose)]":"text-[var(--muted)]"}`}>
              <span className="text-lg leading-5">{item.icon}</span>{language === "si" ? item.si : item.en}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
