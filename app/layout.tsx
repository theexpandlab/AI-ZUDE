import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Nav from "@/components/Nav";
import Starfield from "@/components/Starfield";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Dream Life Dashboard",
  description:
    "A quiet, dreamy system for designing the life you actually want — across health, business, relationships, energy, and fun. Powered by Expand Lab.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#03050E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-void text-ink font-sans antialiased relative">
        <Starfield />
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 pb-32 pt-8 sm:pt-12 relative">
          <header className="mb-10 sm:mb-14 text-center">
            <Link href="/" className="inline-block group">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="relative inline-flex items-center justify-center">
                  <span className="absolute h-3 w-3 rounded-full bg-expand opacity-70 blur-[6px] group-hover:opacity-100 transition" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-expandSoft" />
                </span>
                <span className="text-[10px] uppercase tracking-[0.42em] text-muted/90">
                  Powered by Expand Lab
                </span>
                <span className="relative inline-flex items-center justify-center">
                  <span className="absolute h-3 w-3 rounded-full bg-expand opacity-70 blur-[6px] group-hover:opacity-100 transition" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-expandSoft" />
                </span>
              </div>
              <h1 className="font-serif tracking-tight leading-[1.02] text-5xl sm:text-6xl md:text-7xl">
                <span className="glow-text">The Dream Life</span>
                <br />
                <span className="glow-text italic font-normal">Dashboard</span>
              </h1>
              <div className="text-xs text-muted/80 mt-3 italic max-w-md mx-auto">
                A quiet system for an expansive life
              </div>
            </Link>
          </header>
          <main>{children}</main>
        </div>
        <Nav />
      </body>
    </html>
  );
}
