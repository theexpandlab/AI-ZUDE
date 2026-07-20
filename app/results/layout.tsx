import type { Metadata, Viewport } from "next";
import { SalesFonts } from "@/components/expandlab/SalesFonts";

export const metadata: Metadata = {
  title: "Results · The 100-Day Build · The Expand Lab",
  description:
    "What we've actually built: a $150K launch, $30K → $86K on the same offer, six figures a year on repeat, $54,850 in 90 days, and full ecosystems built from zero. The numbers are real.",
  openGraph: {
    title: "Results · The 100-Day Build · The Expand Lab",
    description:
      "Real case studies from The Expand Lab — descriptors only, names kept private, numbers real.",
    type: "website",
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
      {children}
    </>
  );
}
