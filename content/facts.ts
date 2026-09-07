/**
 * Single source of truth for the entity-level facts about The Expand Lab and
 * the 100-Day Build (AI Search Implementation Plan §1.8).
 *
 * Anything that describes the *business* — not a specific client result — lives
 * here and is imported by the footer, JSON-LD schema, llms.txt and metadata so
 * the numbers and wording cannot drift between pages. Client-specific result
 * figures deliberately stay on their own pages (they are per-case, not entity
 * facts) and are reviewed by Hannah before publish.
 */

export const FACTS = {
  /** Legal / display name of the business. */
  name: "The Expand Lab",
  /** Branded category (decision 2026-09-07). */
  category: "Full Course Launch Agency",
  /** Buyer-facing category phrase used in prose and titles. */
  categoryPlain: "done-for-you online course creation agency",
  /** Flagship offer. */
  offer: "The 100-Day Build",

  /** Aggregate proof points. */
  generated: "$1.5M+",
  experts: "80+",
  days: 100,

  /** Commercials. */
  price: "$7,000 to $9,500",
  priceMin: 7000,
  priceMax: 9500,
  priceCurrency: "USD",
  retainer: "$2,000 to $3,000/month",

  /** Identity / contact. */
  founded: 2022,
  founder: "Hannah Andersen",
  city: "Austin, Texas",
  addressLocality: "Austin",
  addressRegion: "TX",
  addressCountry: "US",
  email: "hannah@theexpandlab.com",

  /** Platforms we build on. */
  platforms: ["Kajabi", "Skool", "GoHighLevel"],

  /** Canonical hosts. */
  buildSite: "https://build.theexpandlab.com",
  mainSite: "https://www.theexpandlab.com",
  mainSiteLabel: "theexpandlab.com",

  /** Social. */
  instagram: "https://www.instagram.com/theexpandlab",
  instagramHandle: "@theexpandlab",

  /** Freshness: bump when pages get a substantive refresh (AI Search plan §2.9). */
  updated: "September 2026",
} as const;

export type Facts = typeof FACTS;
