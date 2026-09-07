import type { Metadata, Viewport } from "next";
import { SalesFonts } from "@/components/expandlab/SalesFonts";
import { JsonLd, breadcrumb, faqPage } from "@/components/JsonLd";
import { baseOpenGraph } from "@/content/og";
import { HOME_FAQ } from "@/content/site-faq";

/**
 * The 100-Day Product Ecosystem Build — sales page.
 *
 * A self-contained dark "blueprints among the stars" marketing route,
 * intentionally distinct from the warm-paper Offer Blueprint app. This nested
 * layout loads the two brand typefaces (Newsreader + IBM Plex Mono) and sets
 * page-specific metadata; the page component overrides the global paper theme.
 *
 * This route renders at "/" on the sales host (via a host-scoped rewrite); the
 * literal "/build" path 308-redirects to "/", so the canonical is "/".
 */

export const metadata: Metadata = {
  title: {
    absolute: "The 100-Day Build · Done-For-You Online Course Creation for Coaches & Experts · The Expand Lab",
  },
  description:
    "The Expand Lab designs, builds and launches your online course, cohort or membership on Kajabi, Skool or GoHighLevel in 100 days. Done for you, from offer to launch. $7,000 to $9,500. Austin, TX.",
  alternates: { canonical: "/" },
  openGraph: {
    ...baseOpenGraph,
    title: "The 100-Day Build · Done-For-You Online Course Creation · The Expand Lab",
    description:
      "A done-for-you online course creation agency for established experts. We build the offer, curriculum, platform, funnel, and launch, in 100 days.",
    url: "/",
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
      <SalesFonts />
      <JsonLd data={breadcrumb([{ name: "Home", path: "/" }])} />
      <JsonLd data={faqPage(HOME_FAQ)} />
      {children}
    </>
  );
}
