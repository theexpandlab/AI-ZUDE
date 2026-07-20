"use client";

import {
  Eyebrow,
  MONO,
  PageShell,
  PrimaryCTA,
  ROUTES,
  SERIF,
  SiteFooter,
  SiteNav,
  wrap,
} from "@/components/expandlab/chrome";

/**
 * What's Included — deep page. Six deliverable blocks (title + lead + a
 * sub-deliverable grid), then a two-column band pairing "What's not included"
 * with the investment panel, CTA and cross-links.
 */

type Component = { n: string; title: string; lead: string; items: string[] };

const COMPONENTS: Component[] = [
  {
    n: "01",
    title: "Product Strategy",
    lead: "The strategic layer that determines whether any of the rest of it works. This is the part almost nobody does — and it’s why so many courses launch and go nowhere.",
    items: [
      "Product Thesis document",
      "ICP definition and segmentation",
      "Transformation promise",
      "Full offer ladder — free front door through high-ticket",
      "Pricing strategy based on transformation value",
      "Buyer journey map, first touch through retention",
      "Success metrics",
    ],
  },
  {
    n: "02",
    title: "Curriculum Architecture",
    lead: "Your knowledge structured into something learnable, with a transformation arc rather than a content dump.",
    items: [
      "Module and lesson structure",
      "Sequencing and pacing",
      "Quick-win module for the first 15 minutes",
      "Worksheets and implementation guides",
      "Assessments",
      "Progress trackers",
      "Student experience flow — onboarding, milestones, completion, support",
      "Structured recording plan so you’re not deciding what to say on camera",
    ],
  },
  {
    n: "03",
    title: "Platform Build",
    lead: "Full setup in Kajabi, Skool, or GoHighLevel — whichever fits the architecture. No preferred platform we push you into.",
    items: [
      "Complete platform configuration",
      "Course, community, or membership build",
      "Student-facing experience and navigation",
      "Checkout and payment setup (Stripe)",
      "Integrations between platform, email, and checkout",
      "QA testing across the full stack",
      "Design aligned to your brand rather than platform defaults",
    ],
  },
  {
    n: "04",
    title: "Funnel & Copy",
    lead: "Written to sound like you, not like a template.",
    items: [
      "Sales page",
      "Offer pages",
      "Opt-in / lead capture pages",
      "Checkout flow",
      "Email sequence copy",
      "Messaging matched to each stage of the buyer’s decision process",
    ],
  },
  {
    n: "05",
    title: "Automation",
    lead: "Wired and tested before a single person buys.",
    items: [
      "Enrollment flows",
      "Onboarding sequences",
      "Nurture sequences",
      "Abandoned cart recovery",
      "Post-purchase and upsell flows",
      "Intake / waiver automation where the business needs it",
      "End-to-end testing",
    ],
  },
  {
    n: "06",
    title: "Launch & Optimization",
    lead: "Launch day is not the finish line.",
    items: [
      "Launch plan built around your enrollment window",
      "Launch, nurture, and cart-close campaigns",
      "Organic content to feed the launch",
      "Post-launch performance review",
      "Optimization recommendations",
      "Version 2.0 roadmap",
    ],
  },
];

const NOT_INCLUDED = [
  "Professional video production, filming, and editing — you record; we structure and support.",
  "Audience building. We don’t manufacture demand out of nothing.",
  "Ongoing content production after launch — that’s the Content & Marketing Retainer at $2,000–$3,000/month.",
  "Paid ad management and spend.",
  "Ongoing platform maintenance after handoff.",
];

const INVESTMENT_POINTS = [
  "Project-based, never hourly — cost ties to outcomes, not clocked time",
  "Typically 50% upfront",
  "Payment plans available for qualified clients",
  "We don’t discount. We add bonuses.",
];

function BlueBullet() {
  return <span style={{ width: 6, height: 6, background: "#3B6BFF", marginTop: 8, flexShrink: 0, boxShadow: "0 0 8px rgba(59,107,255,0.8)" }} />;
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function WhatsIncludedPage() {
  return (
    <PageShell>
      <SiteNav />

      {/* HERO */}
      <section
        style={{
          padding: "clamp(72px,10vw,130px) 24px clamp(48px,6vw,80px)",
          backgroundImage:
            "linear-gradient(rgba(124,150,232,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(124,150,232,0.09) 1px,transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      >
        <div style={wrap}>
          <Eyebrow size={13} tracking="0.22em" mb={26}>
            What’s included
          </Eyebrow>
          <h1
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: "clamp(40px,6.4vw,84px)",
              lineHeight: 1.02,
              letterSpacing: "-0.022em",
              margin: 0,
              maxWidth: "16ch",
              textWrap: "balance",
              color: "#F3F6FF",
              textShadow: "0 0 60px rgba(59,107,255,0.28)",
            } as React.CSSProperties}
          >
            Everything. That’s kind of the point.
          </h1>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(18px,2vw,23px)",
              lineHeight: 1.58,
              color: "#AEB8D6",
              maxWidth: "62ch",
              margin: "30px 0 0",
            }}
          >
            Six components. All of them handled by us. The only things we need from you are your
            expertise, your feedback, and your voice on the recordings.
          </p>
        </div>
      </section>

      {/* COMPONENTS */}
      <section style={{ padding: "clamp(24px,4vw,48px) 24px clamp(56px,7vw,88px)" }}>
        <div style={{ ...wrap, display: "flex", flexDirection: "column", gap: "clamp(20px,3vw,28px)" }}>
          {COMPONENTS.map((c) => (
            <div
              key={c.n}
              className="el-phase"
              data-reveal
              style={{
                border: "1px solid rgba(124,150,232,0.2)",
                borderRadius: 14,
                background: "rgba(11,20,48,0.55)",
                padding: "clamp(26px,4vw,48px)",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "clamp(20px,3vw,48px)" }}>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: "0.12em", color: "#7FA0FF", marginBottom: 12 }}>
                    {c.n}
                  </div>
                  <h2
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 400,
                      fontSize: "clamp(26px,3vw,38px)",
                      lineHeight: 1.06,
                      letterSpacing: "-0.015em",
                      margin: "0 0 14px",
                      color: "#F3F6FF",
                    }}
                  >
                    {c.title}
                  </h2>
                  <p style={{ fontFamily: SERIF, fontSize: "clamp(16px,1.6vw,19px)", lineHeight: 1.55, color: "#B7C0DD", margin: 0 }}>
                    {c.lead}
                  </p>
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
                    gap: "12px 24px",
                    alignSelf: "center",
                  }}
                >
                  {c.items.map((it, i) => (
                    <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 11, alignItems: "start" }}>
                      <BlueBullet />
                      <span style={{ fontFamily: SERIF, fontSize: 16, lineHeight: 1.45, color: "#B7C0DD" }}>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OUT OF SCOPE + PRICING */}
      <section
        style={{
          padding: "clamp(56px,7vw,104px) 24px",
          borderTop: "1px solid rgba(124,150,232,0.16)",
          background: "rgba(6,11,30,0.72)",
        }}
      >
        <div style={{ ...wrap, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "clamp(28px,4vw,56px)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <span style={{ width: 34, height: 1, background: "#E8A87C" }} />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 12.5,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#E8A87C",
                }}
              >
                What’s not included
              </span>
            </div>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: "clamp(24px,3vw,36px)",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                margin: "0 0 24px",
                color: "#F3F6FF",
                textWrap: "balance",
              } as React.CSSProperties}
            >
              Where the line is, plainly.
            </h2>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
              {NOT_INCLUDED.map((it, i) => (
                <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "start" }}>
                  <span style={{ width: 10, height: 10, border: "1.5px solid #E8A87C", marginTop: 7, flexShrink: 0 }} />
                  <span style={{ fontFamily: SERIF, fontSize: "clamp(16px,1.55vw,19px)", lineHeight: 1.5, color: "#B7C0DD" }}>{it}</span>
                </li>
              ))}
            </ul>
            <p style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em", color: "#7C89AE", margin: "22px 0 0" }}>
              Out-of-scope list is a draft — pending Hannah’s confirmation.
            </p>
          </div>

          <div
            style={{
              border: "1px solid rgba(124,150,232,0.4)",
              borderRadius: 14,
              background: "linear-gradient(160deg,rgba(59,107,255,0.14),rgba(11,20,48,0.85))",
              padding: "clamp(28px,4vw,44px)",
              boxShadow: "0 0 60px -20px rgba(59,107,255,0.55)",
              alignSelf: "start",
            }}
          >
            <Eyebrow color="#9DB0FF" starFill="#7FA0FF" size={12} tracking="0.18em" mb={20}>
              The investment
            </Eyebrow>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(38px,5vw,58px)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "#F3F6FF",
                textShadow: "0 0 34px rgba(59,107,255,0.5)",
              }}
            >
              $7,000–$9,500
            </div>
            <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.06em", color: "#AEB8D6", marginTop: 12 }}>
              Full build, project-based
            </div>
            <ul style={{ listStyle: "none", margin: "26px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {INVESTMENT_POINTS.map((it, i) => (
                <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "start" }}>
                  <span style={{ width: 7, height: 7, background: "#3B6BFF", marginTop: 8, flexShrink: 0, boxShadow: "0 0 8px rgba(59,107,255,0.8)" }} />
                  <span style={{ fontFamily: SERIF, fontSize: "clamp(16px,1.55vw,18px)", lineHeight: 1.5, color: "#B7C0DD" }}>{it}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(124,150,232,0.24)" }}>
              <span style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: "0.04em", color: "#7C89AE" }}>
                Guarantee — pending decision. Recommended: everything specified in your proposal ships
                by day 100, or we keep working at no additional cost until it does.
              </span>
            </div>
          </div>
        </div>
      </section>

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
            One scope. Everything in it.
          </h2>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(17px,1.8vw,21px)",
              lineHeight: 1.55,
              color: "#AEB8D6",
              margin: "24px auto 0",
              maxWidth: "52ch",
            }}
          >
            Book a call and we’ll scope exactly what your build includes — and what it costs.
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
          <p
            style={{
              fontFamily: MONO,
              fontSize: 12.5,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#7C89AE",
              margin: "20px 0 0",
            }}
          >
            Free · 30 minutes · No pitch
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginTop: 44 }}>
            <a
              className="el-ghostlink"
              href={ROUTES.method}
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
              See the method →
            </a>
            <a
              className="el-ghostlink"
              href={ROUTES.results}
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
              See the results →
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
