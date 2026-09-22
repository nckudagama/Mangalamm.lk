"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Home", icon: "⌂" },
  { href: "/discover", label: "Discover", icon: "♡" },
  { href: "/messages", label: "Messages", icon: "◌" },
  { href: "/profile", label: "Profile", icon: "○" },
];

function Brand() {
  return <Link href="/" className="flex items-center gap-2.5" aria-label="Mangalamm home">
    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d6b8ae] bg-white text-lg text-[#a6535e]">♡</span>
    <span><span className="block text-[19px] font-semibold leading-none tracking-[-.04em]">mangalamm<span className="text-[var(--rose)]">.</span></span><span className="mt-1 block font-sans text-[8px] tracking-[.2em] text-[var(--muted)]">මංගලම්</span></span>
  </Link>;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div className="min-h-screen bg-[var(--paper)] pb-[calc(76px+env(safe-area-inset-bottom))] md:pb-0">
    <header className="safe-top sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--paper)]/88 backdrop-blur-2xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[76px] lg:px-10">
        <Brand />
        <nav className="hidden items-center gap-1 font-sans text-[13px] md:flex">
          {items.map((item) => <Link key={item.href} href={item.href} className={`rounded-full px-4 py-2.5 transition ${pathname===item.href?"bg-white text-[var(--ink)] shadow-sm":"text-[var(--muted)] hover:bg-white/60"}`}>{item.label}</Link>)}
        </nav>
        <Link href="/settings" className="rounded-full border border-[var(--line)] bg-white/55 px-4 py-2 font-sans text-xs text-[var(--muted)] transition hover:bg-white">Settings</Link>
      </div>
    </header>
    <main>{children}</main>
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--line)] bg-[var(--paper)]/96 px-2 pt-2 backdrop-blur-2xl md:hidden">
      <div className="mx-auto flex max-w-md justify-around">
        {items.map((item) => <Link key={item.href} href={item.href} className={`flex min-w-[64px] flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 font-sans text-[10px] ${pathname===item.href?"font-semibold text-[var(--rose)]":"text-[var(--muted)]"}`}><span className="text-lg leading-5">{item.icon}</span>{item.label}</Link>)}
      </div>
    </nav>
  </div>;
}