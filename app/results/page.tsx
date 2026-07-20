"use client";

import {
  Eyebrow,
  h2Style,
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
 * Results — deep page. An at-a-glance stat strip, five case-study cards
 * (Challenge / What we built / The outcome + verified pull-quote), a
 * "more in numbers" grid, a video-testimonial gallery, CTA and cross-links.
 * Client names are never used — descriptors only.
 */

const GLANCE = [
  { figure: "$1.5M+", label: "Generated for clients", blue: true },
  { figure: "80+", label: "Experts & CEOs built for" },
  { figure: "7 of 8", label: "Recent clients continued into ongoing work" },
  { figure: "100", label: "Days from kickoff to live" },
];

type CaseStudy = {
  descriptor: string;
  metric: string;
  metricSize: string;
  metricLh?: number;
  pill: string;
  challenge: string;
  built: string;
  outcome: string;
  quote?: string;
  quoteTag?: string;
  callout?: string;
};

const CASES: CaseStudy[] = [
  {
    descriptor: "Youth mentorship organization",
    metric: "$150K launch",
    metricSize: "clamp(34px,4.6vw,60px)",
    pill: "Ready 11 days early",
    challenge:
      "A year of DIY’ing their summer camp launch. Fragmented tools that didn’t talk to each other, a landing page that didn’t reflect the caliber of their work, and a small team carrying all of it — heading into a second round with the same dread.",
    built:
      "A rebuilt ecosystem from the ground up: converting landing pages, automated waiver and enrollment flows, parent communication sequences, and a fully mapped buildout so nothing slipped.",
    outcome: "Launch-ready 11 days ahead of their opening date, and a $150K launch.",
    quote: "It has more than paid for itself, and we haven’t even launched yet.",
  },
  {
    descriptor: "Personal development coach",
    metric: "$30K → $86K",
    metricSize: "clamp(34px,4.6vw,60px)",
    pill: "Same offer · $250K+ total",
    challenge:
      "Warm audience, strong personal brand, an offer she believed in — and no system to scale it.",
    built:
      "Launched the first cohort, then rebuilt the infrastructure underneath before relaunching. Additional courses, group programs, and a retreat followed. We grew her email list from 1,000 to 10,000 and rebuilt her personal brand to match the caliber of her work.",
    outcome:
      "First launch grossed $30K. Six months later the exact same offer grossed $86K — nearly triple. Total revenue past $250K.",
    callout: "Same offer. Different infrastructure.",
  },
  {
    descriptor: "Specialized trainer for licensed therapists",
    metric: "Multiple six figures a year",
    metricSize: "clamp(28px,3.6vw,48px)",
    metricLh: 1.02,
    pill: "Two years running",
    challenge:
      "A five-day, $1,997 in-depth training — niche, high-trust work that doesn’t fit inside launch culture. The need wasn’t one tentpole moment; it was filling seats every month, twelve months a year.",
    built:
      "A five-channel acquisition stack: email nurture between trainings, organic presence inside the relevant professional communities, a referral system from past attendees, an affiliate program across her peer network, and a B2B layer selling the training into practices with training budgets.",
    outcome:
      "Multiple six figures every year, for two years. No big launches, no scramble — the same offer running on repeat.",
  },
  {
    descriptor: "Live event business",
    metric: "$54,850 in 90 days",
    metricSize: "clamp(32px,4.4vw,56px)",
    pill: "6× ROI on $9K · 129 purchases",
    challenge:
      "A revenue ceiling that had nothing to do with the offer or the audience. Compressed enrollment window, duct-taped automations, and every launch cycle a white-knuckle exercise.",
    built:
      "A four-tier offer ladder from entry through high-ticket, high-converting offer pages, and the automation backbone connecting enrollment, onboarding, and post-purchase upsell flows.",
    outcome:
      "$54,850 across 129 purchases and 8 offers in 90 days — 6x ROI before the live event even ran.",
    quote: "Infrastructure is the ceiling.",
    quoteTag: "— the takeaway clients repeat back",
  },
  {
    descriptor: "Investment educator",
    metric: "A full ecosystem in 100 days",
    metricSize: "clamp(28px,3.6vw,48px)",
    metricLh: 1.02,
    pill: "Three tiers, built from zero",
    challenge:
      "Real expertise, real frameworks, high standards from a film background — and a perfectionism problem keeping all of it stuck. No container to deliver any of it in.",
    built:
      "The full product ecosystem mapped and built: a free community as the front door, a $750 signature course in the middle, and a $2K+ mastermind at the top, with curriculum architecture, content strategy, and tech stack supporting all three.",
    outcome: "A live three-tier ecosystem where there had been nothing.",
    quote: "I didn’t know someone like you existed.",
    quoteTag: "— week three",
  },
];

const MORE = [
  { metric: "6.5% conversion", body: "on a cold list of 1,315 at a $799 price point" },
  { metric: "$30K in 90 days", body: "new revenue in a client’s first 90 days — full investment returned" },
  { metric: "$40K in 4 weeks", body: "launch across 80+ offers sold" },
  { metric: "$200K+ / year", body: "a monthly training program grossing over $200K a year" },
  { metric: "2,000%+ list growth", body: "a client email list grown over 2,000% in a year" },
  { metric: "5 → 150+", body: "from 5 clients to 150+ people inside her programs" },
  { metric: "Top 100 podcast", body: "a client podcast in the top 100 within a year of launching" },
  { metric: "3× following", body: "a client Instagram nearly tripled in under 3 months" },
];

const csLabel = (color: string): React.CSSProperties => ({
  fontFamily: MONO,
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color,
  marginBottom: 12,
});
const csBody = (color: string): React.CSSProperties => ({
  fontFamily: SERIF,
  fontSize: 16.5,
  lineHeight: 1.55,
  color,
  margin: 0,
});

function CaseCard({ c }: { c: CaseStudy }) {
  return (
    <div
      className="el-phase"
      data-reveal
      style={{
        border: "1px solid rgba(124,150,232,0.2)",
        borderRadius: 14,
        background: "rgba(11,20,48,0.55)",
        padding: "clamp(26px,4vw,48px)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 14,
          marginBottom: "clamp(24px,3vw,36px)",
        }}
      >
        <div>
          <div style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8B97BC", marginBottom: 14 }}>
            {c.descriptor}
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: c.metricSize,
              lineHeight: c.metricLh ?? 1,
              letterSpacing: "-0.02em",
              color: "#7FA0FF",
              textShadow: "0 0 34px rgba(59,107,255,0.5)",
            }}
          >
            {c.metric}
          </div>
        </div>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11.5,
            color: "#F2C39C",
            border: "1px solid rgba(232,168,124,0.4)",
            borderRadius: 20,
            padding: "5px 14px",
          }}
        >
          {c.pill}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "clamp(22px,3vw,44px)" }}>
        <div>
          <div style={csLabel("#8EA6FF")}>The challenge</div>
          <p style={csBody("#B7C0DD")}>{c.challenge}</p>
        </div>
        <div>
          <div style={csLabel("#8EA6FF")}>What we built</div>
          <p style={csBody("#B7C0DD")}>{c.built}</p>
        </div>
        <div>
          <div style={csLabel("#F2C39C")}>The outcome</div>
          <p style={csBody("#EAEEFB")}>{c.outcome}</p>
        </div>
      </div>

      {c.quote && (
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: "clamp(19px,2vw,24px)",
            lineHeight: 1.45,
            color: "#F3F6FF",
            margin: "clamp(24px,3vw,34px) 0 0",
            paddingLeft: 20,
            borderLeft: "2px solid #5B84FF",
          }}
        >
          “{c.quote}”
          {c.quoteTag && (
            <span style={{ fontStyle: "normal", fontFamily: MONO, fontSize: 12, color: "#7C89AE" }}> {c.quoteTag}</span>
          )}
        </p>
      )}

      {c.callout && (
        <div
          style={{
            margin: "clamp(24px,3vw,34px) 0 0",
            padding: "16px 20px",
            border: "1px solid rgba(124,150,232,0.24)",
            borderRadius: 10,
            background: "rgba(59,107,255,0.06)",
            display: "inline-block",
          }}
        >
          <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.04em", color: "#B9CBFF" }}>{c.callout}</span>
        </div>
      )}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function ResultsPage() {
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
            Results
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
            What we’ve actually built.
          </h1>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(18px,2vw,23px)",
              lineHeight: 1.58,
              color: "#AEB8D6",
              maxWidth: "60ch",
              margin: "30px 0 0",
            }}
          >
            Client names stay private unless they’ve asked to be named. The numbers are real.
          </p>
        </div>
      </section>

      {/* AT A GLANCE */}
      <section style={{ padding: "0 24px clamp(48px,6vw,72px)" }}>
        <div
          style={{
            ...wrap,
            border: "1px solid rgba(124,150,232,0.22)",
            borderRadius: 12,
            background: "rgba(11,20,48,0.5)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          }}
        >
          {GLANCE.map((g, i) => (
            <div
              key={g.label}
              style={{
                padding: "clamp(24px,3vw,36px)",
                borderRight: i < GLANCE.length - 1 ? "1px solid rgba(124,150,232,0.14)" : undefined,
              }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(30px,3.6vw,44px)",
                  lineHeight: 1,
                  color: g.blue ? "#7FA0FF" : "#F3F6FF",
                  textShadow: g.blue ? "0 0 30px rgba(59,107,255,0.45)" : undefined,
                }}
              >
                {g.figure}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8B97BC", marginTop: 12 }}>
                {g.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CASE STUDIES */}
      <section style={{ padding: "0 24px clamp(56px,7vw,88px)" }}>
        <div style={{ ...wrap, display: "flex", flexDirection: "column", gap: "clamp(20px,3vw,28px)" }}>
          {CASES.map((c) => (
            <CaseCard key={c.descriptor} c={c} />
          ))}
        </div>
      </section>

      {/* ADDITIONAL RESULTS */}
      <section
        style={{
          padding: "clamp(56px,7vw,100px) 24px",
          borderTop: "1px solid rgba(124,150,232,0.16)",
          background: "rgba(6,11,30,0.72)",
        }}
      >
        <div style={wrap}>
          <Eyebrow>More of what we’ve done</Eyebrow>
          <h2 style={{ ...h2Style, fontSize: "clamp(26px,3.6vw,44px)", lineHeight: 1.08, margin: "0 0 clamp(32px,4vw,48px)", maxWidth: "22ch" }}>
            A few more, in numbers.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: 1,
              background: "rgba(124,150,232,0.16)",
              border: "1px solid rgba(124,150,232,0.16)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {MORE.map((m) => (
              <div key={m.metric} style={{ background: "rgba(12,20,46,0.72)", padding: "clamp(22px,2.6vw,32px)" }}>
                <div style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.4vw,30px)", lineHeight: 1.05, color: "#7FA0FF" }}>{m.metric}</div>
                <div style={{ fontFamily: SERIF, fontSize: 16, lineHeight: 1.45, color: "#B7C0DD", marginTop: 8 }}>{m.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO TESTIMONIALS */}
      <section style={{ padding: "clamp(56px,7vw,100px) 24px" }}>
        <div style={wrap}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
            <h2 style={{ ...h2Style, fontSize: "clamp(26px,3.6vw,44px)", lineHeight: 1.08, margin: 0 }}>In their own words.</h2>
            <span style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#F2C39C" }}>
              Coming soon · in production
            </span>
          </div>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(16px,1.6vw,19px)",
              lineHeight: 1.55,
              color: "#AEB8D6",
              maxWidth: "60ch",
              margin: "0 0 clamp(28px,3vw,40px)",
            }}
          >
            Video testimonials from these clients are being recorded now. The layout’s ready — they
            drop straight in.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                style={{
                  position: "relative",
                  aspectRatio: "9 / 12",
                  border: "1px dashed rgba(124,150,232,0.4)",
                  borderRadius: 8,
                  background: "rgba(59,107,255,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  textAlign: "center",
                  padding: 16,
                }}
              >
                <span
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    border: "1.5px solid #5B84FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#7FA0FF",
                    fontSize: 16,
                    boxShadow: "0 0 20px -4px rgba(59,107,255,0.6)",
                  }}
                >
                  ▶
                </span>
                <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.06em", color: "#8B97BC", lineHeight: 1.5 }}>
                  40-sec video
                  <br />
                  testimonial {String(n).padStart(2, "0")}
                </span>
              </div>
            ))}
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
            Your result belongs on this page next.
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
            Book a call and we’ll map out what your build would be worth once it exists.
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
              href={ROUTES.included}
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
              See what’s included →
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
