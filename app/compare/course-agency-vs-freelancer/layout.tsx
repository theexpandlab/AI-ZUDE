import type { Metadata, Viewport } from "next";
import { SalesFonts } from "@/components/expandlab/SalesFonts";
import { JsonLd, breadcrumb, faqPage } from "@/components/JsonLd";
import { CMP_AGENCY_VS_FREELANCER } from "@/content/compare";
import { baseOpenGraph } from "@/content/og";

export const metadata: Metadata = {
  title: { absolute: "Course Agency vs Freelancer: Who Should Build Your Course? · The Expand Lab" },
  description:
    "Course agency vs freelancer for building your online course: how they compare on cost, timeline, what you get, and who each suits, plus how to choose.",
  alternates: { canonical: "/compare/course-agency-vs-freelancer" },
  openGraph: {
    ...baseOpenGraph,
    title: "Course Agency vs Freelancer · The Expand Lab",
    description:
      "How a course agency and a freelancer compare on cost, timeline, what you get, and who each suits.",
    url: "/compare/course-agency-vs-freelancer",
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
          { name: "Course agency vs freelancer", path: "/compare/course-agency-vs-freelancer" },
        ])}
      />
      <JsonLd data={faqPage(CMP_AGENCY_VS_FREELANCER.faq)} />
      {children}
    </>
  );
}
