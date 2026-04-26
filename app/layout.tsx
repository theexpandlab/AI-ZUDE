import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Starfield from "@/components/Starfield";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
    "A quiet, dreamy system for designing the life you actually want — across health, business, relationships, energy, and fun.",
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
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 pb-32 pt-6 sm:pt-10 relative">
          <header className="mb-8 sm:mb-10">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center gap-2.5 group">
                <span className="relative inline-flex items-center justify-center">
                  <span className="absolute h-3 w-3 rounded-full bg-expand opacity-60 blur-[6px] group-hover:opacity-90 transition" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-expandSoft" />
                </span>
                <span className="font-serif text-base tracking-tight text-ink/90 group-hover:text-ink transition">
                  The Dream Life Dashboard
                </span>
              </a>
              <span className="text-xs text-muted hidden sm:inline">
                A quiet system for an expansive life
              </span>
            </div>
          </header>
          <main>{children}</main>
        </div>
        <Nav />
      </body>
    </html>
  );
}
