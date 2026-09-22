import "./globals.css";
import type { Metadata, Viewport } from "next";
import PwaRegister from "./pwa-register";

export const metadata: Metadata = {
  title: "Mangalamm — Meaningful connections, made for marriage",
  description: "A private, verified matrimonial experience for people ready for a meaningful future.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Mangalamm", statusBarStyle: "default" },
  icons: { icon: "/icons/icon.svg", apple: "/icons/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#a6535e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><PwaRegister />{children}</body></html>;
}
