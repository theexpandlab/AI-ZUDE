import type { Metadata, Viewport } from "next";

/**
 * The 100-Day Product Ecosystem Build — sales page.
 *
 * A self-contained dark "blueprints among the stars" marketing route,
 * intentionally distinct from the warm-paper Offer Blueprint app. This nested
 * layout loads the two brand typefaces (Newsreader + IBM Plex Mono) and sets
 * page-specific metadata; the page component overrides the global paper theme.
 */

export const metadata: Metadata = {
  title: "The 100-Day Product Ecosystem Build · The Expand Lab",
  description:
    "You already know the thing. We build the whole product ecosystem around it — offer, pricing, course, funnel, tech, and launch — in a hundred days. Book a 30-minute strategy call.",
  openGraph: {
    title: "The 100-Day Product Ecosystem Build · The Expand Lab",
    description:
      "A done-for-you digital product studio for established experts. We build the offer, the curriculum, the platform, the funnel, and the launch — in 100 days.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080F26",
};

export default function BuildLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Brand typefaces — loaded here so the paper-themed routes stay on system fonts. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font -- app-router route-scoped fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
