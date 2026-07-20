"use client";

import {
  bodyText,
  Eyebrow,
  GhostLink,
  h2Style,
  MONO,
  PageShell,
  PrimaryCTA,
  ROUTES,
  sectionPad,
  SERIF,
  SiteFooter,
  SiteNav,
  StarSparkle,
  wrap,
} from "@/components/expandlab/chrome";

/**
 * The 100-Day Product Ecosystem Build — the one-pager / conversion page.
 *
 * Self-sufficient long-scroll page; the three deep pages (/method,
 * /whats-included, /results) are the "read more" destinations linked from the
 * nav and from read-more links under the matching sections here.
 */

/**
 * Founder photo. Drop the file into /public (e.g. public/hannah-andersen.jpg)
 * and set FOUNDER_PHOTO to its path — the placeholder frame swaps to a real
 * <img> automatically. Left null until the photo is provided.
 */
const FOUNDER_PHOTO: string | null = null;

/* ── Content data ───────────────────────────────────────────────────────── */

const STAT_CELLS = [
  { figure: "$1.5M+", label: "Generated for clients", blue: true },
  { figure: "80+", label: "Experts & CEOs built for" },
  { figure: "90%", label: "Make their investment back, then run $5K–$20K/mo" },
  { figure: "100", label: "Days from kickoff to live" },
];

const STUCK = [
  {
    n: "01",
    lead: "You’ve been “about to build it” for three years.",
    body: " Not because you’re lazy — because it’s genuinely five projects wearing a trench coat. Curriculum, platform, pricing, funnel, launch. Every one of them is its own thing, and none of them are your job.",
  },
  {
    n: "02",
    lead: "Every hour you spend building is an hour you’re not billing.",
    body: " This is the part nobody says out loud. You can’t step out of client work to build the thing that gets you out of client work. That’s the trap, and it’s a real one.",
  },
  {
    n: "03",
    lead: "Knowing your material and knowing how to package it are two different skills.",
    body: " You’re world-class at one of them. Nobody ever taught you the other, and there’s no reason you should have learned it.",
  },
  {
    n: "04",
    lead: "Your whole business still runs through your calendar.",
    body: " Every dollar needs you in a room. Which is fine, until you’re sick for two weeks, or you want a vacation, or you just get tired.",
  },
];

type Phase = {
  n: string;
  name: string;
  days: string;
  left: string;
  width?: string;
  right?: string;
  gradient: string;
  glow: string;
  minWidth: number;
  delay: number;
  labelColor: string;
  desc: string;
};

const PHASES: Phase[] = [
  {
    n: "PHASE 01",
    name: "Discovery",
    days: "Days 1–20",
    left: "0%",
    width: "18.3%",
    gradient: "linear-gradient(90deg,#3B6BFF,#5B84FF)",
    glow: "0 0 22px -4px rgba(59,107,255,0.8)",
    minWidth: 48,
    delay: 0,
    labelColor: "#7FA0FF",
    desc: "We figure out what you’re actually selling. Not what you do — what someone will pay for. We go through everything you’ve already got: frameworks, worksheets, the stuff in the Google Doc. By the end you have a product thesis that fits in one sentence.",
  },
  {
    n: "PHASE 02",
    name: "Architecture",
    days: "Days 15–40",
    left: "13.5%",
    width: "24%",
    gradient: "linear-gradient(90deg,#2E5AE0,#6C8FFF)",
    glow: "0 0 22px -4px rgba(59,107,255,0.7)",
    minWidth: 48,
    delay: 80,
    labelColor: "#7FA0FF",
    desc: "Who’s buying, what they’ll pay, and what the path looks like from “never heard of you” to “bought.” This is where the offer ladder gets built — the free thing, the entry thing, the main thing, the high-ticket thing. And this is the part almost nobody does, which is why so many courses launch and go nowhere.",
  },
  {
    n: "PHASE 03",
    name: "Build",
    days: "Days 35–75",
    left: "32.7%",
    width: "38.5%",
    gradient: "linear-gradient(90deg,#3B6BFF,#5B84FF)",
    glow: "0 0 26px -4px rgba(59,107,255,0.85)",
    minWidth: 48,
    delay: 160,
    labelColor: "#7FA0FF",
    desc: "The actual thing gets made. Curriculum, modules, worksheets, the platform build in Kajabi or Skool or GoHighLevel, sales pages, checkout, the email automations behind it. All of it connected and tested, so nothing leaks.",
  },
  {
    n: "PHASE 04",
    name: "Launch",
    days: "Days 70–90",
    left: "66.3%",
    width: "19.2%",
    gradient: "linear-gradient(90deg,#2E5AE0,#6C8FFF)",
    glow: "0 0 22px -4px rgba(59,107,255,0.7)",
    minWidth: 48,
    delay: 240,
    labelColor: "#7FA0FF",
    desc: "We launch it with you. Launch plan, emails, the content that feeds it. Warmest people first — they’re the ones who buy, and their results are what sell the next round.",
  },
  {
    n: "PHASE 05",
    name: "Optimize",
    days: "Days 90–100+",
    left: "85.6%",
    right: "0",
    gradient: "linear-gradient(90deg,#E8A87C,#F2C39C)",
    glow: "0 0 22px -4px rgba(232,168,124,0.7)",
    minWidth: 40,
    delay: 320,
    labelColor: "#E8A87C",
    desc: "Then we look at what actually happened and fix it. Where people dropped, what didn’t convert, what to change before the next run. Your second launch should always beat your first, because by then you’re not guessing.",
  },
];

const AXIS_TICKS = [
  { label: "Day 1", left: "0%" },
  { label: "20", left: "18.3%" },
  { label: "40", left: "37.5%" },
  { label: "60", left: "56.7%" },
  { label: "80", left: "76%" },
  { label: "100+", right: "0" },
];

const INCLUDED = [
  {
    label: "01 · Product Strategy",
    body: "Offer design, pricing, positioning, and the full offer ladder. The strategic layer that determines whether any of the rest of it works.",
  },
  {
    label: "02 · Curriculum Architecture",
    body: "Modules, lessons, sequencing, and the transformation arc. Plus worksheets, assessments, implementation guides, and a quick-win module that delivers something in the first fifteen minutes.",
  },
  {
    label: "03 · Platform Build",
    body: "Full setup in Kajabi, Skool, or GoHighLevel — whichever fits your architecture. We don’t have a preferred platform we push you into. The build decides the tool, not the other way around.",
  },
  {
    label: "04 · Funnel & Copy",
    body: "Sales page, offer pages, opt-ins, checkout. Written to sound like you, not like a template.",
  },
  {
    label: "05 · Automation",
    body: "Enrollment, onboarding, nurture, abandoned cart, post-purchase. Wired and tested before a single person buys.",
  },
  {
    label: "06 · Launch & Optimization",
    body: "The launch plan, the campaign, and the post-launch review that tells you what to change.",
  },
];

type Stage = "Pre-build" | "Build" | "Launch";
const STAGE_STYLE: Record<Stage, { color: string; border: string }> = {
  "Pre-build": { color: "#8B97BC", border: "rgba(124,150,232,0.3)" },
  Build: { color: "#B9CBFF", border: "rgba(124,150,232,0.5)" },
  Launch: { color: "#F2C39C", border: "rgba(232,168,124,0.6)" },
};

const STEPS: { n: string; stage: Stage; title: string; body: string }[] = [
  {
    n: "01",
    stage: "Pre-build",
    title: "Strategy call",
    body: "Thirty minutes. We figure out whether this makes sense. I’m honest if it doesn’t.",
  },
  {
    n: "02",
    stage: "Pre-build",
    title: "Proposal and agreement",
    body: "Exactly what gets built, by when, for how much. Your IP stays yours, in writing.",
  },
  {
    n: "03",
    stage: "Pre-build",
    title: "Kickoff",
    body: "Ninety minutes. You meet the team, we map what you already have, and we set the Phase 01 deadlines.",
  },
  {
    n: "04",
    stage: "Build",
    title: "Discovery and product thesis",
    body: "The strategic work. What you’re selling, who’s buying, what they’ll pay.",
  },
  {
    n: "05",
    stage: "Build",
    title: "Architecture and build",
    body: "Curriculum designed, platform configured, pages written, automations wired.",
  },
  {
    n: "06",
    stage: "Launch",
    title: "Launch prep",
    body: "Everything tested end to end before anybody sees it. Launch sequence loaded.",
  },
  {
    n: "07",
    stage: "Launch",
    title: "Launch and optimize",
    body: "We launch with you, then review the data and tell you what to fix.",
  },
];

type Result = {
  metric: string;
  metricSize: string;
  descriptor: string;
  body: string;
  quote?: string;
  quoteTag?: string;
};

const RESULTS: Result[] = [
  {
    metric: "$150K launch",
    metricSize: "clamp(30px,3.4vw,46px)",
    descriptor: "Youth mentorship organization",
    body: "A year of DIY’ing their summer camp launch: fragmented tools, a page that didn’t match the caliber of their work, and a team doing all of it themselves. We rebuilt the whole thing — landing pages, automated waivers and enrollment, parent communication sequences, the full mapped buildout. We had them ready eleven days early, and the launch did $150K.",
    quote: "It has more than paid for itself, and we haven’t even launched yet.",
  },
  {
    metric: "$30K → $86K",
    metricSize: "clamp(30px,3.4vw,46px)",
    descriptor: "Same offer · personal development coach",
    body: "Warm audience, strong brand, an offer she believed in, no system underneath it. First launch grossed $30K. Six months later we relaunched the exact same offer and grossed $86K. Nothing about the offer changed. We also built additional courses, group programs, and a retreat, pushing her past $250K total — and grew her list from 1,000 to 10,000.",
  },
  {
    metric: "Six figures a year, on repeat",
    metricSize: "clamp(26px,3vw,42px)",
    descriptor: "Specialized trainer for licensed therapists",
    body: "A five-day, $1,997 training. No big launches — the job was filling seats every single month, twelve months a year, for two years running. We built a five-channel acquisition stack: email nurture between trainings, organic presence in the professional communities, a referral system from past attendees, an affiliate program across her peer network, and a B2B layer selling into practices with training budgets.",
  },
  {
    metric: "$54,850 in 90 days",
    metricSize: "clamp(28px,3.2vw,44px)",
    descriptor: "On a $9K investment · live event business",
    body: "Four-tier offer ladder, converting offer pages, and the automation backbone connecting enrollment, onboarding, and post-purchase upsells. 129 purchases across eight offers. 6x ROI before the event even ran.",
  },
  {
    metric: "A full ecosystem in 100 days",
    metricSize: "clamp(26px,3vw,42px)",
    descriptor: "Investment educator",
    body: "Real expertise, real frameworks, and a perfectionism problem keeping all of it stuck. We mapped the whole ecosystem — free community as the front door, a $750 signature course in the middle, a $2K+ mastermind at the top — and built the curriculum, content strategy, and tech for all three.",
    quote: "I didn’t know someone like you existed.",
    quoteTag: "— week three",
  },
];

const FIT_YES = [
  "You’ve got a proven methodology and real client results — people already pay you and get outcomes.",
  "You’re doing $8K/month or more and the ceiling is your own calendar.",
  "You have an audience, a list, or a referral network. Small is fine. Zero is not.",
  "You want a partner who’ll tell you when you’re wrong, not one who takes orders.",
  "You’re ready to put real money into infrastructure rather than looking for the cheapest way to get something on a shelf.",
];

const FIT_NO = [
  "You’re starting from zero — no proven method, no clients, no results yet. Build that first. It’ll be worth more later.",
  "You want us to bring you an audience. We build the product. We don’t manufacture demand out of nothing.",
  "You want it live in thirty days. We can’t do good work in thirty days and I won’t pretend otherwise.",
  "You’re looking for passive income. This is leveraged income. It’s real, and it still needs tending — you’ve got to keep watering the garden.",
  "You don’t want to be involved at all. I need your expertise and your sign-off at a few points. There’s no version of this where you’re not in it.",
];

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function BuildOnePager() {
  return (
    <PageShell>
      <SiteNav />

      {/* 1 · HERO */}
      <section
        id="top"
        style={{
          position: "relative",
          padding: "clamp(84px,11vw,150px) 24px clamp(60px,8vw,104px)",
          backgroundImage:
            "linear-gradient(rgba(124,150,232,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(124,150,232,0.09) 1px,transparent 1px)",
          backgroundSize: "38px 38px",
          backgroundPosition: "center top",
        }}
      >
        <div
          style={{
            ...wrap,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "stretch",
            gap: "clamp(28px,4vw,56px)",
          }}
        >
          <div style={{ flex: "1 1 480px", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30 }}>
              <StarSparkle size={14} />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#8EA6FF",
                }}
              >
                The 100-Day Build
              </span>
            </div>
            <h1
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: "clamp(40px,6.8vw,90px)",
                lineHeight: 1.01,
                letterSpacing: "-0.022em",
                margin: 0,
                maxWidth: "16ch",
                textWrap: "balance",
                color: "#F3F6FF",
                textShadow: "0 0 60px rgba(59,107,255,0.28)",
              } as React.CSSProperties}
            >
              You already know the thing. You just don’t have a product built around it.
            </h1>
            <p
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(18px,2vw,24px)",
                lineHeight: 1.58,
                color: "#AEB8D6",
                maxWidth: "60ch",
                margin: "34px 0 0",
              }}
            >
              We build the whole thing for you — the offer, the pricing, the course or program
              itself, the funnel, the tech, and the launch. A hundred days. You show up, give
              feedback, and record your content. We do the rest.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 18, marginTop: 44 }}>
              <PrimaryCTA>Book a 30-minute strategy call</PrimaryCTA>
              <a
                className="el-ghostlink"
                href="#results"
                style={{
                  fontFamily: MONO,
                  fontSize: 14,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#EAEEFB",
                  borderBottom: "1px solid #5B84FF",
                  paddingBottom: 3,
                }}
              >
                See the portfolio
              </a>
            </div>
            <p
              style={{
                fontFamily: MONO,
                fontSize: 12.5,
                lineHeight: 1.7,
                letterSpacing: "0.02em",
                color: "#7C89AE",
                margin: "24px 0 0",
                maxWidth: "56ch",
              }}
            >
              Free. Thirty minutes. I’ll tell you if this isn’t a fit — I do that more often than
              you’d think.
            </p>
          </div>

          <aside
            style={{
              flex: "0 1 300px",
              minWidth: 250,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: 16,
            }}
          >
            {[
              { label: "Most recent win", figure: "$150K launch", sub: "in 6 months of working together" },
              {
                label: "Recent win",
                figure: "3× ROI",
                sub: "first group program, launched in the first 4 months",
              },
              {
                label: "Recent win",
                figure: "$30K → $86K",
                sub: "same offer, six months apart · personal development coach",
              },
            ].map((card) => (
              <div
                key={card.label}
                style={{
                  background: "linear-gradient(160deg,rgba(59,107,255,0.14),rgba(11,20,48,0.8))",
                  border: "1px solid rgba(124,150,232,0.4)",
                  borderRadius: 10,
                  padding: "22px 22px",
                  boxShadow: "0 0 44px -16px rgba(59,107,255,0.7)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#5B84FF",
                      boxShadow: "0 0 10px 1px rgba(91,132,255,0.9)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 10.5,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "#9DB0FF",
                    }}
                  >
                    {card.label}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 30,
                    lineHeight: 1.03,
                    letterSpacing: "-0.01em",
                    color: "#F3F6FF",
                  }}
                >
                  {card.figure}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 11.5,
                    lineHeight: 1.5,
                    letterSpacing: "0.02em",
                    color: "#AEB8D6",
                    marginTop: 8,
                  }}
                >
                  {card.sub}
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* 2 · STAT BAR */}
      <section
        style={{
          borderTop: "1px solid rgba(124,150,232,0.22)",
          borderBottom: "1px solid rgba(124,150,232,0.22)",
          background: "rgba(10,18,44,0.55)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          }}
        >
          {STAT_CELLS.map((cell, i) => (
            <div
              key={cell.label}
              style={{
                padding: "clamp(32px,4vw,50px) 28px",
                borderRight: i < STAT_CELLS.length - 1 ? "1px solid rgba(124,150,232,0.14)" : undefined,
              }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(36px,4.2vw,56px)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: cell.blue ? "#7FA0FF" : "#F3F6FF",
                  textShadow: cell.blue ? "0 0 34px rgba(59,107,255,0.5)" : undefined,
                }}
              >
                {cell.figure}
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#8B97BC",
                  marginTop: 14,
                }}
              >
                {cell.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 · WHY EXPERTS STAY STUCK */}
      <section style={{ padding: sectionPad }}>
        <div style={wrap}>
          <Eyebrow>Why experts stay stuck</Eyebrow>
          <h2 style={{ ...h2Style, margin: "0 0 clamp(40px,5vw,64px)", maxWidth: "20ch" }}>
            The expertise isn’t the problem. It never was.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: 1,
              background: "rgba(124,150,232,0.16)",
              border: "1px solid rgba(124,150,232,0.16)",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {STUCK.map((c) => (
              <div key={c.n} style={{ background: "rgba(12,20,46,0.72)", padding: "clamp(28px,3.4vw,44px)" }}>
                <div style={{ fontFamily: MONO, fontSize: 13, color: "#5B84FF", marginBottom: 16 }}>{c.n}</div>
                <p style={{ ...bodyText("none"), fontSize: "clamp(17px,1.6vw,20px)" }}>
                  <strong style={{ fontWeight: 600, color: "#F3F6FF" }}>{c.lead}</strong>
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · THE FRAMEWORK / GANTT */}
      <section
        id="framework"
        style={{
          padding: sectionPad,
          borderTop: "1px solid rgba(124,150,232,0.16)",
          borderBottom: "1px solid rgba(124,150,232,0.16)",
          background:
            "linear-gradient(180deg,rgba(9,16,40,0.4),rgba(11,20,48,0.66)),linear-gradient(rgba(124,150,232,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(124,150,232,0.07) 1px,transparent 1px)",
          backgroundSize: "auto,38px 38px,38px 38px",
        }}
      >
        <div style={wrap}>
          <Eyebrow>The Product Ecosystem Method</Eyebrow>
          <h2 style={{ ...h2Style, margin: "0 0 14px", maxWidth: "22ch" }}>
            Five phases. A hundred days. Here’s what actually happens.
          </h2>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: "0.08em",
              color: "#7C89AE",
              margin: "0 0 clamp(36px,4vw,52px)",
            }}
          >
            Phases overlap on purpose — this is the real schedule, not five tidy boxes.
          </p>

          {/* axis */}
          <div style={{ position: "relative", height: 26, marginBottom: 4 }}>
            {AXIS_TICKS.map((t) => (
              <div key={t.label} style={{ position: "absolute", left: t.left, right: t.right, top: 0 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: "#7C89AE" }}>{t.label}</span>
              </div>
            ))}
          </div>
          <div style={{ position: "relative", height: 1, background: "rgba(124,150,232,0.35)", marginBottom: 2 }} />
          <div style={{ position: "relative", height: 10, marginBottom: 24 }}>
            {AXIS_TICKS.map((t) => (
              <span
                key={t.label}
                style={{
                  position: "absolute",
                  left: t.left,
                  right: t.right,
                  top: 0,
                  width: 1,
                  height: 6,
                  background: "rgba(124,150,232,0.4)",
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(28px,3.2vw,40px)" }}>
            {PHASES.map((p) => (
              <div key={p.n} className="el-phase" data-reveal data-delay={p.delay}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.1em", color: p.labelColor }}>
                    {p.n}
                  </span>
                  <span style={{ fontFamily: SERIF, fontSize: "clamp(21px,2.4vw,29px)", color: "#F3F6FF" }}>
                    {p.name}
                  </span>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: "#7C89AE" }}>{p.days}</span>
                </div>
                <div
                  style={{
                    position: "relative",
                    height: 36,
                    border: "1px solid rgba(124,150,232,0.16)",
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.03)",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 4,
                      bottom: 4,
                      left: p.left,
                      width: p.width,
                      right: p.right,
                      background: p.gradient,
                      borderRadius: 3,
                      minWidth: p.minWidth,
                      boxShadow: p.glow,
                    }}
                  />
                </div>
                <p style={bodyText("72ch")}>{p.desc}</p>
              </div>
            ))}
          </div>

          <GhostLink href={ROUTES.method}>Read the full method, phase by phase</GhostLink>
        </div>
      </section>

      {/* 5 · WHAT'S INCLUDED */}
      <section id="included" style={{ padding: sectionPad }}>
        <div style={wrap}>
          <Eyebrow>What’s included</Eyebrow>
          <h2 style={{ ...h2Style, margin: "0 0 clamp(40px,5vw,64px)", maxWidth: "20ch" }}>
            Everything. That’s kind of the point.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
              gap: "clamp(28px,3vw,52px) clamp(32px,4vw,64px)",
            }}
          >
            {INCLUDED.map((item) => (
              <div key={item.label} style={{ borderTop: "1px solid rgba(124,150,232,0.35)", paddingTop: 20 }}>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    color: "#7FA0FF",
                    marginBottom: 12,
                  }}
                >
                  {item.label}
                </div>
                <p style={bodyText("none")}>{item.body}</p>
              </div>
            ))}
          </div>

          <GhostLink href={ROUTES.included}>See everything included, in detail</GhostLink>
        </div>
      </section>

      {/* 6 · HOW IT WORKS */}
      <section
        style={{
          padding: sectionPad,
          borderTop: "1px solid rgba(124,150,232,0.16)",
          borderBottom: "1px solid rgba(124,150,232,0.16)",
          background: "rgba(6,11,30,0.72)",
        }}
      >
        <div style={wrap}>
          <Eyebrow>How it works</Eyebrow>
          <h2 style={{ ...h2Style, margin: "0 0 clamp(40px,5vw,64px)" }}>Seven steps, start to live.</h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "clamp(18px,3vw,44px)",
                  padding: "24px 0",
                  borderTop: "1px solid rgba(124,150,232,0.18)",
                  borderBottom: i === STEPS.length - 1 ? "1px solid rgba(124,150,232,0.18)" : undefined,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontFamily: MONO, fontSize: "clamp(20px,2.4vw,28px)", color: "#7FA0FF" }}>{s.n}</span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 10.5,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: STAGE_STYLE[s.stage].color,
                      border: `1px solid ${STAGE_STYLE[s.stage].border}`,
                      borderRadius: 3,
                      padding: "3px 7px",
                      width: "max-content",
                    }}
                  >
                    {s.stage}
                  </span>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 500,
                      fontSize: "clamp(20px,2.2vw,26px)",
                      margin: "0 0 6px",
                      color: "#F3F6FF",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: SERIF,
                      fontSize: "clamp(16px,1.5vw,19px)",
                      lineHeight: 1.55,
                      color: "#AEB8D6",
                      margin: 0,
                      maxWidth: "66ch",
                    }}
                  >
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 12.5,
              lineHeight: 1.7,
              letterSpacing: "0.03em",
              color: "#8EA6FF",
              margin: "28px 0 0",
              maxWidth: "70ch",
            }}
          >
            Throughout: weekly calls, a dedicated project manager, and 48-hour turnaround on anything
            you send us.
          </p>
        </div>
      </section>

      {/* FOUNDER */}
      <section style={{ padding: "clamp(68px,8vw,116px) 24px", borderBottom: "1px solid rgba(124,150,232,0.16)" }}>
        <div
          style={{
            ...wrap,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "clamp(32px,5vw,64px)",
            alignItems: "center",
          }}
        >
          <div style={{ maxWidth: 340, width: "100%", justifySelf: "start" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4 / 5",
                border: "1px solid rgba(124,150,232,0.4)",
                borderRadius: 6,
                boxShadow: "0 0 50px -12px rgba(59,107,255,0.55)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(160deg,rgba(59,107,255,0.10),rgba(11,20,48,0.85))",
              }}
            >
              {FOUNDER_PHOTO ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={FOUNDER_PHOTO}
                  alt="Hannah Andersen, founder of Expand Lab"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#7C89AE",
                    textAlign: "center",
                    padding: 16,
                    lineHeight: 1.6,
                  }}
                >
                  Founder photo
                  <br />
                  Hannah Andersen
                </span>
              )}
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8B97BC",
                marginTop: 12,
              }}
            >
              Hannah Andersen · Founder
            </div>
          </div>
          <div>
            <Eyebrow>Who you’d be working with</Eyebrow>
            <p
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(19px,2.1vw,27px)",
                lineHeight: 1.5,
                color: "#F3F6FF",
                margin: 0,
                maxWidth: "44ch",
                fontStyle: "italic",
              }}
            >
              “
              <span style={{ color: "#7C89AE" }}>
                [Founder note — Hannah’s own words go here. Placeholder until final copy is confirmed.]
              </span>
              ”
            </p>
            <p style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.03em", color: "#7C89AE", margin: "20px 0 0" }}>
              Placeholder — awaiting Hannah’s photo &amp; founder note.
            </p>
          </div>
        </div>
      </section>

      {/* 7 · RESULTS */}
      <section id="results" style={{ padding: sectionPad }}>
        <div style={wrap}>
          <Eyebrow>Results</Eyebrow>
          <h2 style={{ ...h2Style, margin: "0 0 clamp(40px,5vw,64px)", maxWidth: "18ch" }}>
            What we’ve actually built.
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(40px,5vw,64px)" }}>
            {RESULTS.map((r) => (
              <div
                key={r.metric}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                  gap: "clamp(20px,3vw,52px)",
                  borderTop: "1px solid rgba(124,150,232,0.35)",
                  paddingTop: "clamp(28px,3vw,40px)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: r.metricSize,
                      lineHeight: 1.06,
                      letterSpacing: "-0.02em",
                      color: "#7FA0FF",
                      textShadow: "0 0 30px rgba(59,107,255,0.45)",
                    }}
                  >
                    {r.metric}
                  </div>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 12,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#8B97BC",
                      marginTop: 12,
                    }}
                  >
                    {r.descriptor}
                  </div>
                </div>
                <div>
                  <p style={{ ...bodyText("none"), fontSize: "clamp(16px,1.6vw,19px)" }}>{r.body}</p>
                  {r.quote && (
                    <p
                      style={{
                        fontFamily: SERIF,
                        fontStyle: "italic",
                        fontSize: "clamp(18px,1.8vw,22px)",
                        lineHeight: 1.5,
                        color: "#EAEEFB",
                        margin: "20px 0 0",
                        paddingLeft: 18,
                        borderLeft: "2px solid #5B84FF",
                      }}
                    >
                      “{r.quote}”
                      {r.quoteTag && (
                        <span style={{ fontStyle: "normal", fontFamily: MONO, fontSize: 12, color: "#7C89AE" }}>
                          {" "}
                          {r.quoteTag}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* video slots */}
          <div style={{ marginTop: "clamp(56px,7vw,88px)" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(22px,2.6vw,32px)", margin: 0, color: "#F3F6FF" }}>
                In their own words
              </h3>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 11.5,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#7C89AE",
                }}
              >
                Video testimonials · coming soon
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  style={{
                    position: "relative",
                    aspectRatio: "9 / 12",
                    border: "1px dashed rgba(124,150,232,0.4)",
                    borderRadius: 6,
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
                      width: 46,
                      height: 46,
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

          <GhostLink href={ROUTES.results} center mt="clamp(40px,5vw,64px)">
            See all case studies
          </GhostLink>
        </div>
      </section>

      {/* 8 · RIGHT FIT */}
      <section
        style={{
          padding: sectionPad,
          borderTop: "1px solid rgba(124,150,232,0.16)",
          borderBottom: "1px solid rgba(124,150,232,0.16)",
          background: "rgba(6,11,30,0.72)",
        }}
      >
        <div style={wrap}>
          <Eyebrow>Right fit</Eyebrow>
          <h2 style={{ ...h2Style, margin: "0 0 clamp(40px,5vw,64px)", maxWidth: "22ch" }}>
            This works for a specific kind of person.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: 1,
              background: "rgba(124,150,232,0.16)",
              border: "1px solid rgba(124,150,232,0.16)",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div style={{ background: "rgba(12,20,46,0.72)", padding: "clamp(28px,3.4vw,44px)" }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#7FA0FF",
                  marginBottom: 24,
                }}
              >
                This is for you if
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 18 }}>
                {FIT_YES.map((item, i) => (
                  <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 14, alignItems: "start" }}>
                    <span
                      style={{
                        width: 11,
                        height: 11,
                        background: "#3B6BFF",
                        marginTop: 9,
                        flexShrink: 0,
                        boxShadow: "0 0 12px -1px rgba(59,107,255,0.9)",
                      }}
                    />
                    <span style={{ fontFamily: SERIF, fontSize: "clamp(16px,1.55vw,19px)", lineHeight: 1.55, color: "#B7C0DD" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: "rgba(12,20,46,0.72)", padding: "clamp(28px,3.4vw,44px)" }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#E8A87C",
                  marginBottom: 24,
                }}
              >
                This probably isn’t for you if
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 18 }}>
                {FIT_NO.map((item, i) => (
                  <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 14, alignItems: "start" }}>
                    <span style={{ width: 11, height: 11, border: "1.5px solid #E8A87C", marginTop: 9, flexShrink: 0 }} />
                    <span style={{ fontFamily: SERIF, fontSize: "clamp(16px,1.55vw,19px)", lineHeight: 1.55, color: "#B7C0DD" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9 · GUARANTEE */}
      <section style={{ padding: "clamp(76px,9vw,124px) 24px" }}>
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            background: "linear-gradient(160deg,rgba(59,107,255,0.16),rgba(11,20,48,0.85))",
            border: "1px solid rgba(124,150,232,0.4)",
            borderRadius: 10,
            padding: "clamp(40px,6vw,80px)",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 0 70px -20px rgba(59,107,255,0.6)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(124,150,232,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(124,150,232,0.07) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            <Eyebrow color="#9DB0FF" starFill="#7FA0FF">
              The guarantee
            </Eyebrow>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: "clamp(28px,4.2vw,52px)",
                lineHeight: 1.08,
                letterSpacing: "-0.015em",
                margin: 0,
                maxWidth: "22ch",
                textWrap: "balance",
                color: "#F3F6FF",
              } as React.CSSProperties}
            >
              Everything ships by day 100. Or we keep working — free — until it does.
            </h2>
            <p
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(17px,1.7vw,21px)",
                lineHeight: 1.6,
                color: "#B7C0DD",
                margin: "26px 0 0",
                maxWidth: "60ch",
              }}
            >
              Every deliverable specified in your proposal is live by day 100, or we keep building at
              no additional cost until it’s done. The scope is in writing before we start, so there’s
              no guessing what “finished” means.
            </p>
            <p style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: "0.06em", color: "#7C89AE", margin: "24px 0 0" }}>
              Recommended wording — pending Hannah’s final sign-off.
            </p>
          </div>
        </div>
      </section>

      {/* 10 · CLOSE */}
      <section
        style={{
          padding: "clamp(92px,11vw,168px) 24px",
          textAlign: "center",
          position: "relative",
          backgroundImage:
            "radial-gradient(900px 520px at 50% 40%,rgba(59,107,255,0.16),transparent 62%),linear-gradient(rgba(124,150,232,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(124,150,232,0.08) 1px,transparent 1px)",
          backgroundSize: "auto,38px 38px,38px 38px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: "clamp(36px,5.8vw,74px)",
              lineHeight: 1.02,
              letterSpacing: "-0.022em",
              margin: 0,
              textWrap: "balance",
              color: "#F3F6FF",
              textShadow: "0 0 60px rgba(59,107,255,0.35)",
            } as React.CSSProperties}
          >
            Your expertise is worth more than your calendar.
          </h2>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(18px,1.9vw,22px)",
              lineHeight: 1.58,
              color: "#AEB8D6",
              margin: "28px auto 0",
              maxWidth: "58ch",
            }}
          >
            Book a call and we’ll map out what your build would actually be — what we’d make, how long
            it takes, what it costs, and what it’s worth once it exists. And honestly, if I don’t
            think it’s a fit, I’ll tell you on the call. I want to make money. But I want to make{" "}
            <em>you</em> money, and that only works if the thing is right.
          </p>
          <div style={{ marginTop: 44 }}>
            <PrimaryCTA
              fontSize={15}
              padding="20px 38px"
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
              margin: "22px 0 0",
            }}
          >
            Free · 30 minutes · No pitch
          </p>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
