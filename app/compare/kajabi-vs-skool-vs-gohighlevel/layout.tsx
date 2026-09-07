import type { Metadata, Viewport } from "next";
import { SalesFonts } from "@/components/expandlab/SalesFonts";
import { JsonLd, breadcrumb, faqPage } from "@/components/JsonLd";
import { CMP_PLATFORMS } from "@/content/compare";
import { baseOpenGraph } from "@/content/og";

export const metadata: Metadata = {
  title: { absolute: "Kajabi vs Skool vs GoHighLevel: Which Platform for Your Course? · The Expand Lab" },
  description:
    "Kajabi vs Skool vs GoHighLevel for online courses: how the three platforms compare on courses, community, automation and pricing, and how to choose for coaches and experts.",
  alternates: { canonical: "/compare/kajabi-vs-skool-vs-gohighlevel" },
  openGraph: {
    ...baseOpenGraph,
    title: "Kajabi vs Skool vs GoHighLevel · The Expand Lab",
    description:
      "How Kajabi, Skool and GoHighLevel compare for online courses on community, automation and pricing.",
    url: "/compare/kajabi-vs-skool-vs-gohighlevel",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080F26",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SalesFonts />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Kajabi vs Skool vs GoHighLevel", path: "/compare/kajabi-vs-skool-vs-gohighlevel" },
        ])}
      />
      <JsonLd data={faqPage(CMP_PLATFORMS.faq)} />
      {children}
    </>
  );
}
