import type { Metadata, Viewport } from "next";
import { SalesFonts } from "@/components/expandlab/SalesFonts";
import { JsonLd, breadcrumb, faqPage } from "@/components/JsonLd";
import { SITE_FAQ } from "@/content/site-faq";
import { baseOpenGraph } from "@/content/og";

export const metadata: Metadata = {
  title: { absolute: "Course Creation Agency FAQ: Cost, Timeline, Platforms, Ownership · The Expand Lab" },
  description:
    "Answers to the questions people ask before hiring an agency to build their online course: who can build it, what it costs, how long it takes, what platforms, ownership, fit, and what happens after launch.",
  alternates: { canonical: "/faq" },
  openGraph: {
    ...baseOpenGraph,
    title: "Course Creation Agency FAQ · The Expand Lab",
    description:
      "Cost, timeline, platforms, ownership, fit: the questions people ask before hiring us to build their online course.",
    url: "/faq",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080F26",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SalesFonts />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <JsonLd data={faqPage(SITE_FAQ)} />
      {children}
    </>
  );
}
