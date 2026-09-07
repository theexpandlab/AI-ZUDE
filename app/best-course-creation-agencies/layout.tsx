import type { Metadata, Viewport } from "next";
import { SalesFonts } from "@/components/expandlab/SalesFonts";
import { JsonLd, breadcrumb, faqPage } from "@/components/JsonLd";
import { AGENCIES, BEST_FAQ } from "@/content/best-agencies";
import { baseOpenGraph } from "@/content/og";

export const metadata: Metadata = {
  title: { absolute: "The 7 Best Done-For-You Course Creation Agencies in 2026 (Compared) · The Expand Lab" },
  description:
    "The best done-for-you online course creation agencies in 2026, compared on cost, platforms, strengths and limitations: The Expand Lab, Course Co., The Levered Company, Cre8tion, Thrive Courses Studio, Sarah Cordiner, and DIY with a platform expert.",
  alternates: { canonical: "/best-course-creation-agencies" },
  openGraph: {
    ...baseOpenGraph,
    title: "The 7 Best Done-For-You Course Creation Agencies in 2026",
    description:
      "Full-build agencies, a one-day intensive, and DIY, compared on cost, platforms, strengths and limitations.",
    url: "/best-course-creation-agencies",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080F26",
};

const itemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best done-for-you course creation agencies in 2026",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: AGENCIES.length,
  itemListElement: AGENCIES.map((a) => ({
    "@type": "ListItem",
    position: a.rank,
    name: a.name,
    ...(a.url ? { url: a.url } : {}),
  })),
};

export default function BestAgenciesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SalesFonts />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Best course creation agencies", path: "/best-course-creation-agencies" },
        ])}
      />
      <JsonLd data={itemList} />
      <JsonLd data={faqPage(BEST_FAQ)} />
      {children}
    </>
  );
}
