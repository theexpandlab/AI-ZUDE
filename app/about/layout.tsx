import type { Metadata, Viewport } from "next";
import { SalesFonts } from "@/components/expandlab/SalesFonts";
import { JsonLd, SCHEMA_IDS, breadcrumb } from "@/components/JsonLd";
import { baseOpenGraph } from "@/content/og";
import { FACTS } from "@/content/facts";

export const metadata: Metadata = {
  title: { absolute: "About Hannah Andersen & The Expand Lab · Austin, TX" },
  description:
    "The Expand Lab is a done-for-you online course creation agency in Austin, Texas, founded in 2022 by Hannah Andersen. Meet the founder and the team behind the 100-Day Build.",
  alternates: { canonical: "/about" },
  openGraph: {
    ...baseOpenGraph,
    title: "About Hannah Andersen & The Expand Lab",
    description:
      "The founder and team behind the 100-Day Build, a done-for-you online course creation agency in Austin, Texas.",
    url: "/about",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080F26",
};

const aboutPage = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${FACTS.buildSite}/about#page`,
  url: `${FACTS.buildSite}/about`,
  name: "About The Expand Lab",
  about: { "@id": SCHEMA_IDS.organization },
  mainEntity: { "@id": SCHEMA_IDS.hannah },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SalesFonts />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <JsonLd data={aboutPage} />
      {children}
    </>
  );
}
