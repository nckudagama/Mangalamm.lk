"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Home", icon: "⌂" },
  { href: "/discover", label: "Discover", icon: "♡" },
  { href: "/messages", label: "Messages", icon: "◌" },
  { href: "/profile", label: "Profile", icon: "○" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[var(--paper)] pb-[calc(76px+env(safe-area-inset-bottom))] md:pb-0">
      <header className="safe-top sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-10">
          <Link href="/" className="text-[22px] font-semibold tracking-tight sm:text-2xl">mangalamm<span className="text-[var(--rose)]">.</span></Link>
          <nav className="hidden items-center gap-1 font-sans text-sm md:flex">
            {items.map((item) => <Link key={item.href} href={item.href} className={`rounded-full px-4 py-2 transition ${pathname===item.href?"bg-white text-[var(--ink)] shadow-sm":"text-[var(--muted)] hover:bg-white/60"}`}>{item.label}</Link>)}
          </nav>
          <Link href="/settings" className="rounded-full border border-[var(--line)] bg-white/50 px-3.5 py-2 font-sans text-xs sm:px-4">Settings</Link>
        </div>
      </header>
      <main>{children}</main>
      <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--line)] bg-[var(--paper)]/95 px-2 pt-2 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md justify-around">
          {items.map((item) => <Link key={item.href} href={item.href} className={`flex min-w-[64px] flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 font-sans text-[10px] ${pathname===item.href?"text-[var(--rose)]":"text-[var(--muted)]"}`}><span className="text-lg leading-5">{item.icon}</span>{item.label}</Link>)}
        </div>
      </nav>
    </div>
  );
}
