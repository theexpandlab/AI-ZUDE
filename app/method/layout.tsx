import type { Metadata, Viewport } from "next";
import { SalesFonts } from "@/components/expandlab/SalesFonts";

export const metadata: Metadata = {
  title: "The Method · The 100-Day Build · The Expand Lab",
  description:
    "Five phases. A hundred days. Exactly what happens in each — what we build, what you do, and what you're holding at the end. The Expand Lab's Product Ecosystem Method.",
  openGraph: {
    title: "The Method · The 100-Day Build · The Expand Lab",
    description:
      "The whole process, phase by phase: Discovery, Architecture, Build, Launch, Optimize.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080F26",
};

export default function MethodLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SalesFonts />
      {children}
    </>
  );
}
