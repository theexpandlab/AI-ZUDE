"use client";

import {
  bodyText,
  Eyebrow,
  FaqSection,
  LastUpdated,
  MONO,
  PageShell,
  PrimaryCTA,
  ROUTES,
  SERIF,
  SiteFooter,
  SiteNav,
  wrap,
} from "@/components/expandlab/chrome";
import { AGENCIES, BEST_FAQ } from "@/content/best-agencies";
import { FACTS } from "@/content/facts";

/**
 * /best-course-creation-agencies — a comparison listicle (AI Search plan §2.7).
 * Fair framing, competitor facts attributed and sourced, no invented prices, a
 * visible "how this list was made" note, and a "Last updated" date to refresh
 * quarterly.
 */

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: SERIF,
        fontWeight: 400,
        fontSize: "clamp(24px,3.2vw,40px)",
        lineHeight: 1.08,
        letterSpacing: "-0.015em",
        margin: "0 0 22px",
        color: "#F3F6FF",
        textWrap: "balance",
      } as React.CSSProperties}
    >
      {children}
    </h2>
  );
}

const cellBase: React.CSSProperties = { padding: "14px 16px", borderBottom: "1px solid rgba(124,150,232,0.14)", verticalAlign: "top" };

export default function BestAgenciesPage() {
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
            Compare
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
            The 7 best done-for-you course creation agencies in 2026.
          </h1>
          <p style={{ ...bodyText("66ch"), fontSize: "clamp(17px,1.8vw,21px)", color: "#AEB8D6", margin: "30px 0 0" }}>
            If you want someone to build your online course for you, these are the done-for-you options
            worth knowing, from full-build agencies to a one-day intensive to doing it yourself with a
            platform expert. Each one suits a different budget and stage, so this compares them on cost,
            platforms, strengths and limitations.
          </p>
          <div style={{ marginTop: 28 }}>
            <LastUpdated date={FACTS.updated} />
          </div>
        </div>
      </section>

      {/* QUICK COMPARISON TABLE */}
      <section style={{ padding: "clamp(40px,5vw,72px) 24px" }}>
        <div style={wrap}>
          <Heading>At a glance</Heading>
          <div style={{ overflowX: "auto", border: "1px solid rgba(124,150,232,0.2)", borderRadius: 14 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720, fontFamily: SERIF }}>
              <thead>
                <tr>
                  {["Agency", "Best for", "Platforms", "Price"].map((h) => (
                    <th
                      key={h}
                      style={{
                        ...cellBase,
                        textAlign: "left",
                        color: "#F3F6FF",
                        fontFamily: MONO,
                        fontSize: 11,
                        fontWeight: 400,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        borderBottom: "1px solid rgba(124,150,232,0.35)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AGENCIES.map((a) => (
                  <tr key={a.name}>
                    <th scope="row" style={{ ...cellBase, textAlign: "left", color: "#F3F6FF", fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(15px,1.5vw,18px)", whiteSpace: "nowrap" }}>
                      {a.name}
                    </th>
                    <td style={{ ...cellBase, color: "#B7C0DD", fontSize: 14.5, lineHeight: 1.45 }}>{a.bestFor}</td>
                    <td style={{ ...cellBase, color: "#B7C0DD", fontSize: 14.5, lineHeight: 1.45 }}>{a.platforms}</td>
                    <td style={{ ...cellBase, color: "#EAEEFB", fontSize: 14.5, lineHeight: 1.45 }}>{a.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ENTRIES */}
      <section style={{ padding: "clamp(16px,3vw,40px) 24px clamp(56px,7vw,88px)" }}>
        <div style={{ ...wrap, display: "flex", flexDirection: "column", gap: "clamp(20px,3vw,28px)" }}>
          {AGENCIES.map((a) => (
            <div
              key={a.name}
              style={{
                border: "1px solid rgba(124,150,232,0.2)",
                borderRadius: 14,
                background: "rgba(11,20,48,0.55)",
                padding: "clamp(26px,4vw,44px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                <span style={{ fontFamily: MONO, fontSize: 13, color: "#7FA0FF" }}>
                  {String(a.rank).padStart(2, "0")}
                </span>
                <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(24px,3vw,36px)", margin: 0, color: "#F3F6FF" }}>
                  {a.name}
                </h2>
              </div>
              <p style={{ ...bodyText("64ch"), marginTop: 14 }}>
                <strong style={{ color: "#EAEEFB", fontWeight: 600 }}>Best for:</strong> {a.bestFor}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 28px", margin: "16px 0 20px" }}>
                <span style={{ fontFamily: MONO, fontSize: 12, color: "#8B97BC" }}>
                  <span style={{ color: "#7FA0FF" }}>Platforms:</span> {a.platforms}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 12, color: "#8B97BC" }}>
                  <span style={{ color: "#7FA0FF" }}>Price:</span> {a.price}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "clamp(18px,3vw,40px)" }}>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8EA6FF", marginBottom: 12 }}>
                    Strengths
                  </div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {a.strengths.map((s, i) => (
                      <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, alignItems: "start" }}>
                        <span style={{ width: 6, height: 6, background: "#3B6BFF", marginTop: 8, flexShrink: 0, boxShadow: "0 0 8px rgba(59,107,255,0.8)" }} />
                        <span style={{ fontFamily: SERIF, fontSize: 16, lineHeight: 1.45, color: "#B7C0DD" }}>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#E8A87C", marginBottom: 12 }}>
                    Keep in mind
                  </div>
                  <p style={{ fontFamily: SERIF, fontSize: 16, lineHeight: 1.5, color: "#B7C0DD", margin: 0 }}>{a.limitations}</p>
                  {a.source && (
                    <a
                      href={a.source}
                      target="_blank"
                      rel="noopener nofollow"
                      style={{ display: "inline-block", marginTop: 14, fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em", color: "#8EA6FF", borderBottom: "1px solid rgba(124,150,232,0.4)" }}
                    >
                      Source: {a.name} website
                    </a>
                  )}
                  {!a.source && a.url && (
                    <a
                      href={a.url}
                      style={{ display: "inline-block", marginTop: 14, fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em", color: "#8EA6FF", borderBottom: "1px solid rgba(124,150,232,0.4)" }}
                    >
                      Visit {a.name} →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW TO CHOOSE */}
      <section
        style={{
          padding: "clamp(56px,7vw,100px) 24px",
          borderTop: "1px solid rgba(124,150,232,0.16)",
          background: "rgba(6,11,30,0.72)",
        }}
      >
        <div style={{ ...wrap, maxWidth: 820 }}>
          <Heading>How to choose</Heading>
          <p style={{ ...bodyText("68ch"), marginBottom: 16 }}>
            Start with your stage. If you are still testing whether an offer sells, DIY with a platform
            expert or a one-day intensive keeps your risk low. If you have a proven offer and an audience
            and your calendar is the ceiling, a full-build agency will save you months and usually pays
            for itself at launch.
          </p>
          <p style={{ ...bodyText("68ch"), marginBottom: 16 }}>
            Then look at scope. Some providers build one piece; others build the whole system, from offer
            and curriculum to platform, funnel and launch. Ask who runs strategy, who owns the finished
            product, and which platforms they build on.
          </p>
          <p style={bodyText("68ch")}>
            For a deeper split, see{" "}
            <a href={ROUTES.compareAgencyFreelancer} style={{ color: "#8EA6FF", borderBottom: "1px solid rgba(124,150,232,0.5)" }}>
              agency vs freelancer
            </a>{" "}
            and{" "}
            <a href={ROUTES.compareDfyDiy} style={{ color: "#8EA6FF", borderBottom: "1px solid rgba(124,150,232,0.5)" }}>
              done-for-you vs DIY
            </a>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection heading="Common questions" eyebrow="FAQ" items={BEST_FAQ} />

      {/* CTA */}
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
            Think the 100-Day Build is your fit?
          </h2>
          <p style={{ ...bodyText("52ch"), margin: "24px auto 0", color: "#AEB8D6" }}>
            Book a call and we&rsquo;ll tell you honestly whether we&rsquo;re the right agency for your
            build, or point you to who is.
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
              { href: ROUTES.pricing, label: "See our pricing →" },
              { href: ROUTES.method, label: "See the method →" },
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
