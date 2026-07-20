/** @type {import('next').NextConfig} */

// Host that serves the 100-Day Build sales page at its ROOT ("/").
// Set SALES_PAGE_HOST in Vercel to the subdomain you connect for it
// (e.g. build.theexpandlab.com). The Offer Blueprint tool keeps its own
// root untouched on every other host — this rewrite is scoped to this host.
const SALES_PAGE_HOST = process.env.SALES_PAGE_HOST || "build.theexpandlab.com";

const nextConfig = {
  reactStrictMode: true,
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
