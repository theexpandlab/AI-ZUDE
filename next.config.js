/** @type {import('next').NextConfig} */

// Host that serves the 100-Day Build sales page at its ROOT ("/").
// Set SALES_PAGE_HOST in Vercel to the subdomain you connect for it
// (e.g. build.theexpandlab.com). The Offer Blueprint tool keeps its own
// root untouched on every other host — this rewrite is scoped to this host.
const SALES_PAGE_HOST = process.env.SALES_PAGE_HOST || "build.theexpandlab.com";

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // Collapse the duplicate sales URL onto a single canonical ("/") on the
    // sales host (AI Search plan §1.2). "/" internally rewrites to the /build
    // content (below), so the sales page keeps rendering — but the literal
    // "/build" path 308s to "/", so only one indexable URL exists. Host-scoped
    // so the Offer Blueprint tool (which owns "/" on every other host) and its
    // routes are untouched. Redirects run before rewrites, and the rewrite's
    // internal "/build" destination is not re-evaluated here, so there is no
    // loop.
    return [
      {
        source: "/build",
        has: [{ type: "host", value: SALES_PAGE_HOST }],
        destination: "/",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // beforeFiles runs before filesystem routes, so it can override "/" (which
    // otherwise serves the Offer Blueprint page) on the sales host only.
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: SALES_PAGE_HOST }],
          destination: "/build",
        },
      ],
    };
  },
};

module.exports = nextConfig;
