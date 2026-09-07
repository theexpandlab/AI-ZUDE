"use client";

import {
  bodyText,
  LastUpdated,
  MONO,
  PageShell,
  PrimaryCTA,
  ROUTES,
  SERIF,
  SiteFooter,
  SiteNav,
  Eyebrow,
  wrap,
} from "@/components/expandlab/chrome";
import { FACTS } from "@/content/facts";
import { SITE_FAQ } from "@/content/site-faq";

/**
 * /faq — one long buyer FAQ. AI engines quote this page type because the
 * question text matches the prompt text. Each question is an H2, and the first
 * sentence of each answer is the answer.
 */
export default function FaqPage() {
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
            FAQ
          </Eyebrow>
          <h1
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: "clamp(38px,6vw,78px)",
              lineHeight: 1.03,
              letterSpacing: "-0.022em",
              margin: 0,
              maxWidth: "20ch",
              textWrap: "balance",
              color: "#F3F6FF",
              textShadow: "0 0 60px rgba(59,107,255,0.28)",
            } as React.CSSProperties}
          >
            Questions people ask before hiring us to build their course.
          </h1>
          <p style={{ ...bodyText("62ch"), fontSize: "clamp(18px,2vw,23px)", color: "#AEB8D6", margin: "30px 0 0" }}>
            The Expand Lab is a done-for-you online course creation agency in {FACTS.city}. Here are the
            questions we hear most, answered plainly.
          </p>
          <div style={{ marginTop: 28 }}>
            <LastUpdated date={FACTS.updated} />
          </div>
        </div>
      </section>

      {/* QUESTIONS */}
      <section style={{ padding: "clamp(24px,4vw,56px) 24px clamp(64px,8vw,96px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column" }}>
          {SITE_FAQ.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "clamp(24px,3vw,32px) 0",
                borderTop: "1px solid rgba(124,150,232,0.18)",
                borderBottom: i === SITE_FAQ.length - 1 ? "1px solid rgba(124,150,232,0.18)" : undefined,
              }}
            >
              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 500,
                  fontSize: "clamp(20px,2.2vw,27px)",
                  lineHeight: 1.2,
                  margin: "0 0 10px",
                  color: "#F3F6FF",
                }}
              >
                {f.q}
              </h2>
              <p style={{ fontFamily: SERIF, fontSize: "clamp(16px,1.6vw,19px)", lineHeight: 1.6, color: "#B7C0DD", margin: 0, maxWidth: "72ch" }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA + CROSS-LINKS */}
      <section
        style={{
          padding: "clamp(72px,9vw,130px) 24px",
          textAlign: "center",
          borderTop: "1px solid rgba(124,150,232,0.16)",
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
            Still have a question?
          </h2>
          <p style={{ ...bodyText("52ch"), margin: "24px auto 0", color: "#AEB8D6" }}>
            Book a call and ask it directly. Thirty minutes, no pitch, and I&rsquo;ll tell you honestly
            if this isn&rsquo;t a fit.
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
            {[
              { href: ROUTES.method, label: "See the method →" },
              { href: ROUTES.pricing, label: "See pricing →" },
              { href: ROUTES.results, label: "See the results →" },
            ].map((l) => (
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
