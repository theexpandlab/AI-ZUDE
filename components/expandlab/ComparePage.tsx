"use client";

import {
  bodyText,
  Eyebrow,
  FaqSection,
  LastUpdated,
  MONO,
  PageShell,
  PrimaryCTA,
  SERIF,
  SiteFooter,
  SiteNav,
  wrap,
} from "@/components/expandlab/chrome";
import { FACTS } from "@/content/facts";

/**
 * Shared renderer for the /compare/* pages (AI Search plan §2.6): a definition
 * of each option up front, an HTML comparison table, "choose X if" guidance, and
 * a short FAQ. Data is passed in from content/compare.ts so the page files stay
 * thin and each layout can build FAQPage schema from the same source.
 */
export type CompareData = {
  eyebrow: string;
  h1: string;
  intro: string[];
  columns: string[];
  rows: { label: string; cells: string[] }[];
  choices: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  crossLinks: { href: string; label: string }[];
};

export function ComparePage({ data }: { data: CompareData }) {
  return (
    <PageShell>
      <SiteNav />

      {/* HERO */}
      <section
        style={{
          padding: "clamp(72px,10vw,130px) 24px clamp(40px,5vw,64px)",
          backgroundImage:
            "linear-gradient(rgba(124,150,232,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(124,150,232,0.09) 1px,transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      >
        <div style={wrap}>
          <Eyebrow size={13} tracking="0.22em" mb={26}>
            {data.eyebrow}
          </Eyebrow>
          <h1
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: "clamp(34px,5.4vw,72px)",
              lineHeight: 1.04,
              letterSpacing: "-0.022em",
              margin: 0,
              maxWidth: "20ch",
              textWrap: "balance",
              color: "#F3F6FF",
              textShadow: "0 0 60px rgba(59,107,255,0.28)",
            } as React.CSSProperties}
          >
            {data.h1}
          </h1>
          <div style={{ margin: "30px 0 0", display: "flex", flexDirection: "column", gap: 16 }}>
            {data.intro.map((p, i) => (
              <p key={i} style={{ ...bodyText("66ch"), fontSize: "clamp(17px,1.8vw,21px)", color: "#AEB8D6" }}>
                {p}
              </p>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20, marginTop: 32 }}>
            <PrimaryCTA>Book a 30-minute strategy call</PrimaryCTA>
            <LastUpdated date={FACTS.updated} />
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section style={{ padding: "clamp(48px,6vw,88px) 24px" }}>
        <div style={wrap}>
          <div style={{ overflowX: "auto", border: "1px solid rgba(124,150,232,0.2)", borderRadius: 14 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 120 * (data.columns.length + 1) + 160,
                fontFamily: SERIF,
              }}
            >
              <thead>
                <tr>
                  <th style={{ ...cellBase, textAlign: "left", color: "#7C89AE", fontFamily: MONO, fontSize: 12, fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase" }} />
                  {data.columns.map((c) => (
                    <th
                      key={c}
                      style={{
                        ...cellBase,
                        textAlign: "left",
                        color: "#F3F6FF",
                        fontFamily: SERIF,
                        fontSize: "clamp(17px,1.8vw,22px)",
                        fontWeight: 400,
                        borderBottom: "1px solid rgba(124,150,232,0.35)",
                      }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r.label}>
                    <th
                      scope="row"
                      style={{
                        ...cellBase,
                        textAlign: "left",
                        color: "#8EA6FF",
                        fontFamily: MONO,
                        fontSize: 12,
                        fontWeight: 400,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        verticalAlign: "top",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.label}
                    </th>
                    {r.cells.map((cell, i) => (
                      <td
                        key={i}
                        style={{ ...cellBase, color: "#B7C0DD", fontSize: "clamp(14px,1.4vw,16.5px)", lineHeight: 1.5, verticalAlign: "top" }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CHOOSE X IF */}
      <section
        style={{
          padding: "clamp(56px,7vw,100px) 24px",
          borderTop: "1px solid rgba(124,150,232,0.16)",
          background: "rgba(6,11,30,0.72)",
        }}
      >
        <div style={wrap}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit,minmax(${data.choices.length > 2 ? 260 : 300}px,1fr))`,
              gap: "clamp(20px,3vw,28px)",
            }}
          >
            {data.choices.map((c) => (
              <div
                key={c.title}
                style={{
                  border: "1px solid rgba(124,150,232,0.2)",
                  borderRadius: 14,
                  background: "rgba(11,20,48,0.55)",
                  padding: "clamp(26px,3.4vw,40px)",
                }}
              >
                <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(20px,2.2vw,27px)", margin: "0 0 12px", color: "#F3F6FF" }}>
                  {c.title}
                </h2>
                <p style={bodyText("none")}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection heading="Common questions" eyebrow="FAQ" items={data.faq} />

      {/* CTA + CROSS-LINKS */}
      <section
        style={{
          padding: "clamp(72px,9vw,130px) 24px",
          textAlign: "center",
          background: "radial-gradient(900px 520px at 50% 40%,rgba(59,107,255,0.18),transparent 62%)",
        }}
      >
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: "clamp(30px,4.6vw,58px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "#F3F6FF",
              textWrap: "balance",
            } as React.CSSProperties}
          >
            Not sure which is right for you?
          </h2>
          <p style={{ ...bodyText("52ch"), margin: "24px auto 0", color: "#AEB8D6" }}>
            Book a call and we&rsquo;ll tell you honestly, based on your offer and audience, not on what
            we&rsquo;d rather sell.
          </p>
          <div style={{ marginTop: 36 }}>
            <PrimaryCTA
              fontSize={15}
              padding="20px 36px"
              arrow={17}
              shadow="0 0 0 1px rgba(91,132,255,0.5),0 18px 50px -14px rgba(59,107,255,0.9)"
            >
              Book a 30-minute strategy call
            </PrimaryCTA>
          </div>
          <p style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7C89AE", margin: "20px 0 0" }}>
            Free · 30 minutes · No pitch
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginTop: 44 }}>
            {data.crossLinks.map((l) => (
              <a
                key={l.href}
                className="el-ghostlink"
                href={l.href}
                style={{
                  fontFamily: MONO,
                  fontSize: 12.5,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#EAEEFB",
                  border: "1px solid rgba(124,150,232,0.4)",
                  borderRadius: 6,
                  padding: "14px 22px",
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}

const cellBase: React.CSSProperties = {
  padding: "16px 18px",
  borderBottom: "1px solid rgba(124,150,232,0.14)",
};
