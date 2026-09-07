import type { Metadata, Viewport } from "next";
import "./globals.css";
import { JsonLd, SITE_GRAPH } from "@/components/JsonLd";
import { FACTS } from "@/content/facts";

export const metadata: Metadata = {
  metadataBase: new URL(FACTS.buildSite),
  title: {
    default: "The 100-Day Build · Done-For-You Online Course Creation · The Expand Lab",
    template: "%s · The Expand Lab",
  },
  description:
    "The Expand Lab designs, builds and launches your online course, cohort or membership on Kajabi, Skool or GoHighLevel in 100 days. Done for you, from offer to launch.",
  openGraph: {
    siteName: "The Expand Lab",
    type: "website",
    locale: "en_US",
    images: ["/og-default.png"],
  },
  twitter: { card: "summary_large_image" },
  // Google Search Console ownership verification for build.theexpandlab.com.
  verification: { google: "6rEWD0B4wpzUNA-eNkgVRJo1zKYATN0p3-uA463iXfU" },
  // No robots directive at the root: every real page/layout declares its own
  // index/follow, so the default (inherited by the 404, which also returns a
  // 404 status) carries no conflicting directive.
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4EFE4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        {children}
        <JsonLd data={SITE_GRAPH} />
      </body>
    </html>
  );
}
