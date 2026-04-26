import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Life Optimization Dashboard",
  description: "Intentionally design, track, and improve your life across the pillars that matter.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F4EE",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas text-ink">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 pb-24 pt-6 sm:pt-10">
          <header className="mb-8 sm:mb-10">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-ink" />
                <span className="font-serif text-lg tracking-tight">Life OS</span>
              </a>
              <span className="text-xs text-muted hidden sm:inline">
                A calm system for intentional living
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
