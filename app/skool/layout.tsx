import type { Metadata, Viewport } from "next";
import { SalesFonts } from "@/components/expandlab/SalesFonts";
import { JsonLd, SCHEMA_IDS, breadcrumb, faqPage } from "@/components/JsonLd";
import { SKOOL_FAQ } from "@/content/skool-faq";
import { baseOpenGraph } from "@/content/og";
import { FACTS } from "@/content/facts";

export const metadata: Metadata = {
  title: { absolute: "Done-For-You Skool Community & Course Build · The Expand Lab" },
  description:
    "The Expand Lab builds done-for-you Skool communities and courses for coaches, authors and experts: classroom, gamification, offers, automations and launch, in 100 days. $7,000 to $9,500.",
  alternates: { canonical: "/skool" },
  openGraph: {
    ...baseOpenGraph,
    title: "Done-For-You Skool Community & Course Build · The Expand Lab",
    description: "We build your Skool community, course and launch, done for you, in 100 days.",
    url: "/skool",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080F26",
};

const skoolService = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${FACTS.buildSite}/skool#service`,
  name: "Done-for-you Skool community and course build",
  serviceType: "Done-for-you Skool community and course build",
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

export default function SkoolLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SalesFonts />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Skool", path: "/skool" },
        ])}
      />
      <JsonLd data={skoolService} />
      <JsonLd data={faqPage(SKOOL_FAQ)} />
      {children}
    </>
  );
}
