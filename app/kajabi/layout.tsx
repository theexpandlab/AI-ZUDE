import type { Metadata, Viewport } from "next";
import { SalesFonts } from "@/components/expandlab/SalesFonts";
import { JsonLd, SCHEMA_IDS, breadcrumb, faqPage } from "@/components/JsonLd";
import { KAJABI_FAQ } from "@/content/kajabi-faq";
import { baseOpenGraph } from "@/content/og";
import { FACTS } from "@/content/facts";

export const metadata: Metadata = {
  title: { absolute: "Done-For-You Kajabi Course Build by a Kajabi Expert · The Expand Lab" },
  description:
    "The Expand Lab builds done-for-you Kajabi courses, memberships and coaching programs for coaches, authors and consultants: curriculum, products, funnel, pipelines, email and launch, in 100 days. $7,000 to $9,500.",
  alternates: { canonical: "/kajabi" },
  openGraph: {
    ...baseOpenGraph,
    title: "Done-For-You Kajabi Course Build · The Expand Lab",
    description:
      "We build your Kajabi course, funnel and launch, done for you, in 100 days.",
    url: "/kajabi",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080F26",
};

const kajabiService = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${FACTS.buildSite}/kajabi#service`,
  name: "Done-for-you Kajabi course build",
  serviceType: "Done-for-you Kajabi course build",
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

export default function KajabiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SalesFonts />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Kajabi", path: "/kajabi" },
        ])}
      />
      <JsonLd data={kajabiService} />
      <JsonLd data={faqPage(KAJABI_FAQ)} />
      {children}
    </>
  );
}
