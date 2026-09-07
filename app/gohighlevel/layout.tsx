import type { Metadata, Viewport } from "next";
import { SalesFonts } from "@/components/expandlab/SalesFonts";
import { JsonLd, SCHEMA_IDS, breadcrumb, faqPage } from "@/components/JsonLd";
import { GHL_FAQ } from "@/content/gohighlevel-faq";
import { baseOpenGraph } from "@/content/og";
import { FACTS } from "@/content/facts";

export const metadata: Metadata = {
  title: { absolute: "Done-For-You GoHighLevel Course & Membership Build · The Expand Lab" },
  description:
    "The Expand Lab builds done-for-you courses and memberships inside GoHighLevel for coaches and experts: memberships, funnels, pipelines, email and SMS automations, and launch, in 100 days. $7,000 to $9,500.",
  alternates: { canonical: "/gohighlevel" },
  openGraph: {
    ...baseOpenGraph,
    title: "Done-For-You GoHighLevel Course Build · The Expand Lab",
    description:
      "We build your course and membership inside GoHighLevel, done for you, in 100 days.",
    url: "/gohighlevel",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080F26",
};

const ghlService = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${FACTS.buildSite}/gohighlevel#service`,
  name: "Done-for-you GoHighLevel course and membership build",
  serviceType: "Done-for-you GoHighLevel course and membership build",
  provider: { "@id": SCHEMA_IDS.organization },
  areaServed: "US",
  offers: {
    "@type": "Offer",
    priceCurrency: FACTS.priceCurrency,
    price: String(FACTS.priceMin),
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: FACTS.priceMin,
      maxPrice: FACTS.priceMax,
      priceCurrency: FACTS.priceCurrency,
    },
    url: `${FACTS.buildSite}/pricing`,
  },
};

export default function GoHighLevelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SalesFonts />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "GoHighLevel", path: "/gohighlevel" },
        ])}
      />
      <JsonLd data={ghlService} />
      <JsonLd data={faqPage(GHL_FAQ)} />
      {children}
    </>
  );
}
