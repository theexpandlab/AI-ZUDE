import type { Metadata, Viewport } from "next";
import { SalesFonts } from "@/components/expandlab/SalesFonts";

// Post-booking thank-you page. Cal.com redirects here after a strategy call is
// booked; the page fires the Meta "Schedule" conversion. Kept out of search
// results and out of the sitemap.
export const metadata: Metadata = {
  title: { absolute: "You're booked · The Expand Lab" },
  description: "Your strategy call with The Expand Lab is booked.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080F26",
};

export default function CallBookedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SalesFonts />
      {children}
    </>
  );
}
