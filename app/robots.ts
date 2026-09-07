import type { MetadataRoute } from "next";
import { FACTS } from "@/content/facts";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
      // Explicitly welcome AI crawlers. Default is allow, but naming them
      // removes doubt (AI Search plan §1.4).
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "Claude-User",
          "Claude-SearchBot",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Bingbot",
          "Applebot-Extended",
          "CCBot",
        ],
        allow: "/",
      },
    ],
    sitemap: `${FACTS.buildSite}/sitemap.xml`,
    host: FACTS.buildSite,
  };
}
