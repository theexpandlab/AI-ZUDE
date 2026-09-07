import type { MetadataRoute } from "next";
import { FACTS } from "@/content/facts";

const base = FACTS.buildSite;

export default function sitemap(): MetadataRoute.Sitemap {
  // Only routes that exist at deploy time. Extend as remaining Phase 2 pages
  // ship (/about, /best-course-creation-agencies). "/build" is intentionally
  // absent — it 308-redirects to "/".
  const routes = [
    "",
    "/method",
    "/whats-included",
    "/pricing",
    "/results",
    "/faq",
    "/about",
    "/kajabi",
    "/skool",
    "/gohighlevel",
    "/compare/course-agency-vs-freelancer",
    "/compare/done-for-you-vs-diy-course-platform",
    "/compare/kajabi-vs-skool-vs-gohighlevel",
  ];
  const lastModified = new Date();
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.8,
  }));
}
