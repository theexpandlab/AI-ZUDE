import type { Metadata, Viewport } from "next";
import { SalesFonts } from "@/components/expandlab/SalesFonts";

export const metadata: Metadata = {
  title: "What's Included · The 100-Day Build · The Expand Lab",
  description:
    "Six components, all handled by us: product strategy, curriculum architecture, platform build, funnel & copy, automation, and launch & optimization. $7,000–$9,500, project-based.",
  openGraph: {
    title: "What's Included · The 100-Day Build · The Expand Lab",
    description:
      "Everything in one scope — the six deliverables of the 100-Day Product Ecosystem Build, and the investment.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080F26",
};

export default function IncludedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SalesFonts />
      {children}
    </>
  );
}
