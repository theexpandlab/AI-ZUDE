import type { MetadataRoute } from "next";
import { FACTS } from "@/content/facts";

const base = FACTS.buildSite;

export default function sitemap(): MetadataRoute.Sitemap {
  // Only routes that exist at deploy time. Extend as Phase 2 pages ship
  // (/pricing, /faq, /kajabi, /skool, /gohighlevel, /about, /compare/*,
  // /best-course-creation-agencies). "/build" is intentionally absent — it
  // 308-redirects to "/".
  const routes = ["", "/method", "/whats-included", "/results"];
  const lastModified = new Date();
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.8,
  }));
}
