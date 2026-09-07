import type { Metadata } from "next";
import Link from "next/link";

/**
 * Custom 404. Replacing Next's built-in not-found stops it from injecting its
 * own <title> and noindex tag inside the root layout (which produced the
 * duplicate/contradictory head tags flagged in AI Search plan §1.3).
 *
 * Note: Next's App Router does not apply a `metadata` export from not-found.tsx
 * (it renders under the root layout's metadata). The export below is harmless
 * and future-proof; indexing is prevented in practice by the 404 HTTP status
 * this route returns.
 */
export const metadata: Metadata = {
  title: { absolute: "Page not found · The Expand Lab" },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 18,
        padding: "48px 24px",
      }}
    >
      <p
        style={{
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
          fontSize: 13,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#3B6BFF",
          margin: 0,
        }}
      >
        Error 404
      </p>
      <h1 style={{ fontSize: "clamp(28px,5vw,44px)", lineHeight: 1.1, margin: 0 }}>
        We couldn&rsquo;t find that page.
      </h1>
      <p style={{ maxWidth: "46ch", lineHeight: 1.6, color: "#4a4a45", margin: 0 }}>
        The page may have moved. Head back to the start, or see what the 100-Day Build looks like.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: 8 }}>
        <Link
          href="/"
          style={{
            background: "#3B6BFF",
            color: "#fff",
            padding: "12px 22px",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Back to home
        </Link>
        <Link
          href="/results"
          style={{
            border: "1px solid rgba(0,0,0,0.2)",
            color: "inherit",
            padding: "12px 22px",
            borderRadius: 6,
            textDecoration: "none",
          }}
        >
          See the results
        </Link>
      </div>
    </main>
  );
}
