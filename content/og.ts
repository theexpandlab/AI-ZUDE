import type { Metadata } from "next";

/**
 * Shared Open Graph defaults. Next.js merges `openGraph` shallowly across
 * layout segments, so a child that sets its own `openGraph` (for a page-
 * specific title/description/url) drops any parent fields it doesn't repeat.
 * Each page-level `openGraph` therefore spreads this base so siteName, locale,
 * type and the default share image are always present.
 */
export const baseOpenGraph: NonNullable<Metadata["openGraph"]> = {
  siteName: "The Expand Lab",
  type: "website",
  locale: "en_US",
  images: ["/og-default.png"],
};
