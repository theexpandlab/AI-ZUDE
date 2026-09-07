import { FACTS } from "@/content/facts";

/**
 * Renders a JSON-LD <script> block (AI Search Implementation Plan §1.5).
 *
 * A plain server component — no client JS — so the structured data is present
 * in the server-rendered HTML that crawlers and AI engines read. Pass any
 * schema.org object (or an object with an @graph array). Use <SiteJsonLd /> for
 * the sitewide organization graph and pass page-specific nodes (FAQPage,
 * BreadcrumbList, Service, …) via <JsonLd data={...} /> from each layout.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is static and author-controlled; no user input flows in.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const ORG_ID = `${FACTS.mainSite}/#organization`;
const HANNAH_ID = `${FACTS.mainSite}/#hannah`;

/**
 * Stable schema.org @id values. These intentionally live on the ROOT domain so
 * the same ids can be reused in the Wix site's schema (Phase 3): every crawler
 * then resolves one organization described from two hosts. Keep identical in
 * both places.
 */
export const SCHEMA_IDS = {
  organization: ORG_ID,
  hannah: HANNAH_ID,
  website: `${FACTS.buildSite}/#website`,
  service: `${FACTS.buildSite}/#service`,
} as const;

/** The sitewide Organization + Person + WebSite + Service graph. */
export const SITE_GRAPH: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": ORG_ID,
      name: FACTS.name,
      alternateName: ["Expand Lab"],
      url: FACTS.mainSite,
      logo: `${FACTS.buildSite}/expand-lab-logo.avif`,
      description: `A ${FACTS.categoryPlain} (${FACTS.category}) that designs, builds and launches online courses, cohorts and memberships for coaches, authors and experts through the ${FACTS.offer}.`,
      foundingDate: String(FACTS.founded),
      founder: { "@id": HANNAH_ID },
      email: FACTS.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: FACTS.addressLocality,
        addressRegion: FACTS.addressRegion,
        addressCountry: FACTS.addressCountry,
      },
      areaServed: "US",
      knowsAbout: [
        "online course creation",
        "course launch strategy",
        "Kajabi",
        "Skool",
        "GoHighLevel",
        "cohort-based courses",
        "membership sites",
        "curriculum design",
        "sales funnels for courses",
      ],
      sameAs: [
        "https://www.linkedin.com/company/the-expand-lab",
        "https://www.youtube.com/@theexpandlab",
        FACTS.instagram,
        FACTS.buildSite,
      ],
    },
    {
      "@type": "Person",
      "@id": HANNAH_ID,
      name: FACTS.founder,
      jobTitle: "Founder & CEO",
      worksFor: { "@id": ORG_ID },
      url: `${FACTS.buildSite}/about`,
      image: `${FACTS.buildSite}/hannah-andersen.jpg`,
      sameAs: ["https://www.linkedin.com/in/hannah-andersen-00b81681/"],
    },
    {
      "@type": "WebSite",
      "@id": SCHEMA_IDS.website,
      url: FACTS.buildSite,
      name: `${FACTS.offer} by ${FACTS.name}`,
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "Service",
      "@id": SCHEMA_IDS.service,
      name: FACTS.offer,
      serviceType: "Done-for-you online course creation",
      provider: { "@id": ORG_ID },
      areaServed: "US",
      audience: {
        "@type": "Audience",
        audienceType: "Coaches, authors, consultants and subject-matter experts",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: FACTS.priceCurrency,
        price: String(FACTS.priceMin),
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: FACTS.priceMin,
          maxPrice: FACTS.priceMax,
          priceCurrency: FACTS.priceCurrency,
        },
        url: `${FACTS.buildSite}/pricing`,
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "100-Day Build components",
        itemListElement: [
          "Product strategy and offer design",
          "Curriculum architecture",
          "Platform build on Kajabi, Skool or GoHighLevel",
          "Sales funnel and copy",
          "Email and enrollment automation",
          "Launch and post-launch optimization",
        ].map((n) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: n },
        })),
      },
    },
  ],
};

/** Build a BreadcrumbList node. Pass [{name, path}] from home outward. */
export function breadcrumb(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${FACTS.buildSite}${it.path}`,
    })),
  };
}

/** Build an FAQPage node from question/answer pairs. */
export function faqPage(qa: { q: string; a: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };
}
