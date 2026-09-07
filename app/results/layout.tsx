import type { Metadata, Viewport } from "next";
import { SalesFonts } from "@/components/expandlab/SalesFonts";
import { JsonLd, breadcrumb } from "@/components/JsonLd";
import { baseOpenGraph } from "@/content/og";

export const metadata: Metadata = {
  title: { absolute: "Results · The 100-Day Build · The Expand Lab" },
  description:
    "What we've actually built: a $150K launch, $30K → $86K on the same offer, six figures a year on repeat, $54,850 in 90 days, and full ecosystems built from zero. The numbers are real.",
  alternates: { canonical: "/results" },
  openGraph: {
    ...baseOpenGraph,
    title: "Results · The 100-Day Build · The Expand Lab",
    description:
      "Real case studies from The Expand Lab — descriptors only, names kept private, numbers real.",
    url: "/results",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080F26",
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SalesFonts />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Results", path: "/results" },
        ])}
      />
      {children}
    </>
  );
}
