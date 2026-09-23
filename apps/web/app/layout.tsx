import "./globals.css";
import type { Metadata, Viewport } from "next";
import PwaRegister from "./pwa-register";
import { LanguageProvider } from "./language-provider";

export const metadata: Metadata = {
  title: "Mangalamm — මංගලම්",
  description: "A private, thoughtful matrimonial experience built for meaningful relationships.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Mangalamm",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#a6535e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="si">
      <body>
        <LanguageProvider>
          <PwaRegister />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
