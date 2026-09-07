import type { Metadata, Viewport } from "next";
import { SalesFonts } from "@/components/expandlab/SalesFonts";
import { JsonLd, breadcrumb, faqPage } from "@/components/JsonLd";
import { PRICING_FAQ } from "@/content/pricing-faq";
import { baseOpenGraph } from "@/content/og";

export const metadata: Metadata = {
  title: { absolute: "100-Day Build Pricing: What It Costs to Have Your Course Built · The Expand Lab" },
  description:
    "The 100-Day Build is $7,000 to $9,500, project-based, for the full design, build and launch of your course or program on Kajabi, Skool or GoHighLevel. Payment plans for qualified clients; retainer $2,000 to $3,000 a month after launch.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    ...baseOpenGraph,
    title: "100-Day Build Pricing · The Expand Lab",
    description:
      "What it costs to have your online course built for you: $7,000 to $9,500, project-based, on Kajabi, Skool or GoHighLevel.",
    url: "/pricing",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080F26",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SalesFonts />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <JsonLd data={faqPage(PRICING_FAQ)} />
      {children}
    </>
  );
}
