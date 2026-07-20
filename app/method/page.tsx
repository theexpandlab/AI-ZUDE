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
 * The Method — deep page. Same chrome as the one-pager: hero, an at-a-glance
 * overlapping timeline, one detailed card per phase (What we do / What you do /
 * What you have at the end + tools), a process FAQ, CTA and cross-links.
 */

type Deliverable = string | { pre: string; strong: string; post: string };

type MethodPhase = {
  n: string;
  name: string;
  days: string;
  purpose: string;
  weDo: string[];
  youDo: string[];
  youHave: Deliverable[];
  tools?: string;
  stat?: { big: string; rest: string };
  accent?: boolean;
  delay: number;
};

const OVERVIEW = [
  { label: "01 Discovery", left: "0%", width: "18.3%", gradient: "linear-gradient(90deg,#3B6BFF,#5B84FF)", glow: "0 0 18px -4px rgba(59,107,255,0.8)", apricot: false },
  { label: "02 Architecture", left: "13.5%", width: "24%", gradient: "linear-gradient(90deg,#2E5AE0,#6C8FFF)", glow: "0 0 18px -4px rgba(59,107,255,0.7)", apricot: false },
  { label: "03 Build", left: "32.7%", width: "38.5%", gradient: "linear-gradient(90deg,#3B6BFF,#5B84FF)", glow: "0 0 20px -4px rgba(59,107,255,0.85)", apricot: false },
  { label: "04 Launch", left: "66.3%", width: "19.2%", gradient: "linear-gradient(90deg,#2E5AE0,#6C8FFF)", glow: "0 0 18px -4px rgba(59,107,255,0.7)", apricot: false },
  { label: "05 Optimize", left: "85.6%", right: "0", gradient: "linear-gradient(90deg,#E8A87C,#F2C39C)", glow: "0 0 18px -4px rgba(232,168,124,0.7)", apricot: true },
];

const AXIS_TICKS = [
  { label: "Day 1", left: "0%" },
  { label: "20", left: "18.3%" },
  { label: "40", left: "37.5%" },
  { label: "60", left: "56.7%" },
  { label: "80", left: "76%" },
  { label: "100+", right: "0" },
];

const PHASES: MethodPhase[] = [
  {
    n: "PHASE 01",
    name: "Discovery",
    days: "Days 1–20",
    purpose: "Figuring out what you’re actually selling. Not what you do — what someone will pay for.",
    weDo: [
      "Deep-dive into your existing IP — frameworks, worksheets, methodologies",
      "Full audit of content, audience, list, platforms, and past launches",
      "Problem/solution clarity — the exact transformation you deliver",
      "Success metrics defined up front",
      "Competitive and market scan in your category",
    ],
    youDo: [
      "Show up on calls and talk",
      "Hand over everything you already have — unorganized is fine",
      "Give feedback on the thesis draft",
    ],
    youHave: [
      { pre: "A ", strong: "Product Thesis", post: " — what you’re selling, who it’s for, why it wins, in one sentence" },
      "A complete asset inventory",
      "Defined success metrics for the build",
    ],
    tools: "Shared Google Drive workspace · Asana / ClickUp board · Zoom",
    delay: 0,
  },
  {
    n: "PHASE 02",
    name: "Architecture",
    days: "Days 15–40",
    purpose: "Who’s buying, what they’ll pay, and the path from “never heard of you” to “bought.”",
    weDo: [
      "Transformation promise and outcome definition",
      "ICP definition and segmentation",
      "Full buyer journey — first touch → purchase → delivery → retention → expansion",
      "Offer ladder design — free front door → entry → core → high-ticket",
      "Pricing based on transformation value, not content volume",
      "Platform selection driven by the architecture",
      "Messaging framework mapped to each decision stage",
    ],
    youDo: [
      "Pressure-test the offer ladder and pricing",
      "Approve the architecture before anything gets built",
      "Share existing audience data",
    ],
    youHave: [
      "A mapped user journey before a single pixel is designed",
      "A priced, structured offer ladder",
      "A messaging framework",
      "A documented platform decision, with the reasoning",
    ],
    tools: "Platform decision (Kajabi / Skool / GoHighLevel) · Figma / Canva for journey mapping",
    delay: 60,
  },
  {
    n: "PHASE 03",
    name: "Build",
    days: "Days 35–75",
    purpose: "The thing actually gets made — connected and tested end to end, so nothing leaks.",
    weDo: [
      "Curriculum architecture — modules, lessons, pacing, sequencing",
      "A quick-win module that delivers value in the first 15 minutes",
      "Worksheets, assessments, implementation guides, progress trackers",
      "Full platform build",
      "Student experience — onboarding, milestones, completion, support",
      "Sales and offer pages",
      "Automation backbone — enrollment, onboarding, intake, email, cart, upsells",
      "Internal QA across the full stack before anything reaches you",
    ],
    youDo: [
      "Record your content — we give you a structured recording plan",
      "Review and approve deliverables — 48–72 hour turnaround",
      "Supply brand assets if you have them",
    ],
    youHave: ["A built, tested, launch-ready product", "Every supporting asset a student touches"],
    tools: "Kajabi / Skool / GoHighLevel · Stripe · ConvertKit / ActiveCampaign · Canva & Figma · Asana / ClickUp",
    delay: 120,
  },
  {
    n: "PHASE 04",
    name: "Launch",
    days: "Days 70–90",
    purpose: "We take it to market — with you, warmest people first.",
    weDo: [
      "Launch plan built around your real enrollment window",
      "Launch, nurture, and cart-close email campaigns",
      "Organic content to feed top of funnel",
      "Warmest-contacts-first sequencing",
      "Paid amplification layered where it makes sense",
      "Everything tested end to end before anyone sees it",
    ],
    youDo: ["Promote to your network", "Show up for whatever live components the launch includes"],
    youHave: ["A live, selling product", "Real buyer data"],
    delay: 180,
  },
  {
    n: "PHASE 05",
    name: "Optimize",
    days: "Days 90–100+",
    purpose: "We look at what actually happened — and fix it. Your second launch should always beat your first.",
    weDo: [
      "Performance analysis across funnel, product, and messaging",
      "Iteration on conversion points and retention drop-off",
      "A Version 2.0 roadmap — built to be improved, not rebuilt",
      "Handoff documentation so your team can run it",
    ],
    youDo: ["Review the findings and set the direction for v2"],
    youHave: [
      "A documented picture of what worked and what didn’t",
      "A roadmap for the next version",
      "A product designed for iteration — the next one is meaningfully faster",
    ],
    stat: { big: "7 of the last 8 clients", rest: "continued into ongoing work after this phase." },
    accent: true,
    delay: 240,
  },
];

const FAQ = [
  {
    q: "How much of my time does this take?",
    a: "Weekly check-ins of 30–60 minutes, feedback on deliverables within 48–72 hours, and the time it takes to record your content. That’s the honest answer.",
  },
  { q: "How fast do you turn things around?", a: "A 48-hour turnaround on anything you send us." },
  {
    q: "How many rounds of revisions?",
    a: "Every deliverable goes through review cycles with you until it’s right. Nothing ships that you haven’t signed off on.",
  },
  { q: "Who owns the IP?", a: "You own what we build. The exact terms are spelled out in your agreement." },
  {
    q: "What if we fall behind?",
    a: "Timelines slip when feedback slows down — that’s the real bottleneck. We flag it early rather than quietly extending.",
  },
  { q: "What if I don’t have my content ready?", a: "Most people don’t. That’s what Phase 01 is for." },
  {
    q: "Do you build my audience?",
    a: "No. We build the product and the system that converts the audience you have. If you’re starting from zero, this isn’t the right time.",
  },
];

/* ── Sub-components ─────────────────────────────────────────────────────── */

const colHeader = (color: string, border: string): React.CSSProperties => ({
  fontFamily: MONO,
  fontSize: 11,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color,
  marginBottom: 16,
  paddingBottom: 10,
  borderBottom: `1px solid ${border}`,
});

const itemText = (color: string): React.CSSProperties => ({
  fontFamily: SERIF,
  fontSize: 16,
  lineHeight: 1.5,
  color,
});

function DeliverableText({ item }: { item: Deliverable }) {
  if (typeof item === "string") return <>{item}</>;
  return (
    <>
      {item.pre}
      <strong style={{ color: "#F3F6FF", fontWeight: 600 }}>{item.strong}</strong>
      {item.post}
    </>
  );
}

function PhaseCard({ p }: { p: MethodPhase }) {
  return (
    <div
      className="el-phase"
      data-reveal
      data-delay={p.delay}
      style={{
        border: p.accent ? "1px solid rgba(232,168,124,0.3)" : "1px solid rgba(124,150,232,0.2)",
        borderRadius: 14,
        background: "rgba(11,20,48,0.55)",
        padding: "clamp(26px,4vw,48px)",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
        <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.12em", color: p.accent ? "#E8A87C" : "#7FA0FF" }}>
          {p.n}
        </span>
        <span style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.2vw,40px)", color: "#F3F6FF", lineHeight: 1 }}>
          {p.name}
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11.5,
            color: p.accent ? "#F2C39C" : "#7C89AE",
            border: `1px solid ${p.accent ? "rgba(232,168,124,0.4)" : "rgba(124,150,232,0.3)"}`,
            borderRadius: 20,
            padding: "4px 12px",
          }}
        >
          {p.days}
        </span>
      </div>
      <p
        style={{
          fontFamily: SERIF,
          fontSize: "clamp(18px,1.9vw,22px)",
          lineHeight: 1.5,
          color: "#B7C0DD",
          margin: "0 0 clamp(24px,3vw,36px)",
          maxWidth: "60ch",
        }}
      >
        {p.purpose}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "clamp(24px,3vw,44px)" }}>
        <div>
          <div style={colHeader("#7FA0FF", "rgba(124,150,232,0.2)")}>What we do</div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {p.weDo.map((t, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 11, alignItems: "start" }}>
                <span style={{ width: 6, height: 6, background: "#3B6BFF", marginTop: 8, flexShrink: 0, boxShadow: "0 0 8px rgba(59,107,255,0.8)" }} />
                <span style={itemText("#B7C0DD")}>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={colHeader("#AEB8D6", "rgba(124,150,232,0.2)")}>What you do</div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {p.youDo.map((t, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 11, alignItems: "start" }}>
                <span style={{ width: 6, height: 6, border: "1.5px solid #8EA6FF", marginTop: 8, flexShrink: 0 }} />
                <span style={itemText("#B7C0DD")}>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={colHeader("#F2C39C", "rgba(232,168,124,0.3)")}>What you have at the end</div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {p.youHave.map((t, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 11, alignItems: "start" }}>
                <span style={{ color: "#F2C39C", marginTop: 1, flexShrink: 0, fontFamily: MONO }}>→</span>
                <span style={itemText("#EAEEFB")}>
                  <DeliverableText item={t} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {p.tools && (
        <div
          style={{
            fontFamily: MONO,
            fontSize: 11.5,
            letterSpacing: "0.04em",
            color: "#7C89AE",
            marginTop: "clamp(22px,3vw,32px)",
            paddingTop: 18,
            borderTop: "1px solid rgba(124,150,232,0.14)",
          }}
        >
          Tools touched &nbsp;·&nbsp; {p.tools}
        </div>
      )}

      {p.stat && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 12,
            marginTop: "clamp(22px,3vw,32px)",
            paddingTop: 18,
            borderTop: "1px solid rgba(124,150,232,0.14)",
          }}
        >
          <span style={{ fontFamily: SERIF, fontSize: "clamp(20px,2.2vw,26px)", color: "#7FA0FF" }}>{p.stat.big}</span>
          <span style={{ fontFamily: MONO, fontSize: 12, color: "#AEB8D6", letterSpacing: "0.03em" }}>{p.stat.rest}</span>
        </div>
      )}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function MethodPage() {
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
            The Method
          </Eyebrow>
          <h1
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: "clamp(38px,6vw,78px)",
              lineHeight: 1.03,
              letterSpacing: "-0.022em",
              margin: 0,
              maxWidth: "18ch",
              textWrap: "balance",
              color: "#F3F6FF",
              textShadow: "0 0 60px rgba(59,107,255,0.28)",
            } as React.CSSProperties}
          >
            Five phases. A hundred days. Here’s exactly what happens.
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
            Most experts have been burned by someone who couldn’t tell them what came next. So here’s
            the whole thing, phase by phase — what gets built, who does what, and what you’re actually
            holding at the end of each one.
          </p>
        </div>
      </section>

      {/* TIMELINE OVERVIEW */}
      <section style={{ padding: "clamp(40px,5vw,64px) 24px clamp(56px,7vw,88px)" }}>
        <div style={wrap}>
          <div
            style={{
              border: "1px solid rgba(124,150,232,0.22)",
              borderRadius: 12,
              background: "rgba(11,20,48,0.5)",
              padding: "clamp(24px,4vw,44px)",
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#8EA6FF",
                marginBottom: 8,
              }}
            >
              The schedule at a glance
            </div>
            <p style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.04em", color: "#7C89AE", margin: "0 0 26px" }}>
              Phases overlap on purpose. This is the real timeline, not five tidy boxes.
            </p>
            <div style={{ position: "relative", height: 24, marginBottom: 4 }}>
              {AXIS_TICKS.map((t) => (
                <div key={t.label} style={{ position: "absolute", left: t.left, right: t.right, top: 0 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: "#7C89AE" }}>{t.label}</span>
                </div>
              ))}
            </div>
            <div style={{ position: "relative", height: 1, background: "rgba(124,150,232,0.35)", marginBottom: 18 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {OVERVIEW.map((b) => (
                <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 11,
                      color: b.apricot ? "#E8A87C" : "#7FA0FF",
                      width: 96,
                      flexShrink: 0,
                    }}
                  >
                    {b.label}
                  </span>
                  <div style={{ position: "relative", flex: 1, height: 22, borderRadius: 4, background: "rgba(255,255,255,0.03)" }}>
                    <div
                      style={{
                        position: "absolute",
                        top: 3,
                        bottom: 3,
                        left: b.left,
                        width: b.width,
                        right: b.right,
                        background: b.gradient,
                        borderRadius: 3,
                        boxShadow: b.glow,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PHASE DETAIL BLOCKS */}
      <section style={{ padding: "0 24px clamp(56px,7vw,96px)" }}>
        <div style={{ ...wrap, display: "flex", flexDirection: "column", gap: "clamp(20px,3vw,32px)" }}>
          {PHASES.map((p) => (
            <PhaseCard key={p.n} p={p} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{
          padding: "clamp(64px,8vw,110px) 24px",
          borderTop: "1px solid rgba(124,150,232,0.16)",
          background: "rgba(6,11,30,0.72)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Eyebrow>Process FAQ</Eyebrow>
          <h2 style={{ ...h2Style, fontSize: "clamp(28px,4.2vw,50px)", margin: "0 0 clamp(32px,4vw,52px)" }}>
            The questions everyone asks.
          </h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQ.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: "24px 0",
                  borderTop: "1px solid rgba(124,150,232,0.18)",
                  borderBottom: i === FAQ.length - 1 ? "1px solid rgba(124,150,232,0.18)" : undefined,
                }}
              >
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 500,
                    fontSize: "clamp(19px,2vw,24px)",
                    margin: "0 0 8px",
                    color: "#F3F6FF",
                  }}
                >
                  {f.q}
                </h3>
                <p
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(16px,1.5vw,19px)",
                    lineHeight: 1.55,
                    color: "#AEB8D6",
                    margin: 0,
                  }}
                >
                  {f.a}
                </p>
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
            This is the whole process. No surprises.
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
            Book a call and we’ll map which phases matter most for your build — and what it would
            actually cost.
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
