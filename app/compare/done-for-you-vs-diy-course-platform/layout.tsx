import type { Metadata, Viewport } from "next";
import { SalesFonts } from "@/components/expandlab/SalesFonts";
import { JsonLd, breadcrumb, faqPage } from "@/components/JsonLd";
import { CMP_DFY_VS_DIY } from "@/content/compare";
import { baseOpenGraph } from "@/content/og";

export const metadata: Metadata = {
  title: { absolute: "Done-For-You vs DIY: Should You Build Your Course Yourself? · The Expand Lab" },
  description:
    "Done-for-you vs DIY course creation: how paying a team to build your course compares with building it yourself on Kajabi, Skool or GoHighLevel, on cost, time and risk.",
  alternates: { canonical: "/compare/done-for-you-vs-diy-course-platform" },
  openGraph: {
    ...baseOpenGraph,
    title: "Done-For-You vs DIY Course Creation · The Expand Lab",
    description:
      "Paying a team to build your course vs building it yourself: cost, timeline, skills and risk compared.",
    url: "/compare/done-for-you-vs-diy-course-platform",
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
          { name: "Done-for-you vs DIY", path: "/compare/done-for-you-vs-diy-course-platform" },
        ])}
      />
      <JsonLd data={faqPage(CMP_DFY_VS_DIY.faq)} />
      {children}
    </>
  );
}
