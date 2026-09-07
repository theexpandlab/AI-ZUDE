"use client";

import {
  bodyText,
  CAL_URL,
  Eyebrow,
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
import { Avatar, type AvatarVariant } from "@/components/expandlab/Avatar";
import { FACTS } from "@/content/facts";

/**
 * /about — the page AI engines read when someone asks "who is Hannah Andersen"
 * or "who runs The Expand Lab." Entity facts up front, then Hannah's story in
 * first person, the team (illustrated character avatars, not photos), how we
 * work, and press/podcast contact via the booking link.
 *
 * NOTE: the founder story below is a first draft written from the existing
 * homepage founder quote and the site's voice. Hannah reviews and personalizes
 * it before this page is merged/published.
 */

const FOUNDER_PHOTO = "/hannah-andersen.jpg";

const TEAM: { name: string; role: string; body: string; avatar: AvatarVariant }[] = [
  {
    name: "Edielynne",
    role: "Social media management",
    body: "Manages social media, turning your expertise into content that reaches and grows your audience.",
    avatar: "edielynne",
  },
  {
    name: "Jhon",
    role: "Designer & editor",
    body: "Designs and edits everything to the caliber of your work, not a platform template.",
    avatar: "jhon",
  },
  {
    name: "Lisa",
    role: "Marketing tech",
    body: "Builds and wires the funnels, automations and integrations so the whole system runs.",
    avatar: "lisa",
  },
  {
    name: "A curated contractor bench",
    role: "Specialists",
    body: "Copy, launch and production specialists brought in per build, managed by us and never handed to you.",
    avatar: "bench",
  },
];

const HOW_WE_WORK = [
  "Strategy first. We decide what the product should be and how it is priced before we build a thing.",
  "One partner, not a stack of freelancers you have to coordinate.",
  "Founder-led. Hannah runs Discovery and Architecture on every engagement.",
  "Built for knowledge entrepreneurs doing $8K a month or more with an audience.",
  "Platform-agnostic. We build on Kajabi, Skool or GoHighLevel based on your offer.",
  "A 100-day timeline, from kickoff to a live, selling product.",
  "A curated roster, not an anonymous agency floor.",
];

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

export default function AboutPage() {
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
            About
          </Eyebrow>
          <h1
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: "clamp(36px,5.6vw,74px)",
              lineHeight: 1.04,
              letterSpacing: "-0.022em",
              margin: 0,
              maxWidth: "20ch",
              textWrap: "balance",
              color: "#F3F6FF",
              textShadow: "0 0 60px rgba(59,107,255,0.28)",
            } as React.CSSProperties}
          >
            Hannah Andersen and the team behind the 100-Day Build.
          </h1>
          <p style={{ ...bodyText("66ch"), fontSize: "clamp(17px,1.8vw,21px)", color: "#AEB8D6", margin: "30px 0 0" }}>
            The Expand Lab is a done-for-you online course creation agency in {FACTS.city}, founded in{" "}
            {FACTS.founded} by {FACTS.founder}. We are a {FACTS.category}: through the 100-Day Build we
            design, build and launch online courses, cohort programs and memberships for coaches,
            authors, consultants and experts, on Kajabi, Skool or GoHighLevel. We have built for{" "}
            {FACTS.experts} experts and generated more than {FACTS.generated} for our clients. We run
            strategy first, work as one partner rather than a stack of freelancers, and keep the whole
            build under one roof from offer to launch.
          </p>
          <div style={{ marginTop: 28 }}>
            <LastUpdated date={FACTS.updated} />
          </div>
        </div>
      </section>

      {/* FOUNDER STORY */}
      <section style={{ padding: "clamp(48px,6vw,88px) 24px", borderTop: "1px solid rgba(124,150,232,0.16)" }}>
        <div
          style={{
            ...wrap,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "clamp(32px,5vw,64px)",
            alignItems: "start",
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
                background: "linear-gradient(160deg,rgba(59,107,255,0.10),rgba(11,20,48,0.85))",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FOUNDER_PHOTO}
                alt="Hannah Andersen, founder of The Expand Lab"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8B97BC", marginTop: 12 }}>
              Hannah Andersen · Founder &amp; CEO
            </div>
          </div>
          <div>
            <Heading>Why I started The Expand Lab</Heading>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <p style={bodyText("62ch")}>
                I&rsquo;m Hannah, and I started The Expand Lab because I wanted to build my own dream
                business, and along the way I learned exactly what it takes to build one that lasts.
              </p>
              <p style={bodyText("62ch")}>
                What I kept seeing was the same trap. Building a course is really five projects wearing a
                trench coat: curriculum, platform, pricing, funnel and launch. Experts would hire five
                different contractors to handle them, and nobody owned the outcome. Things fell between
                the cracks, and the expert became the project manager of their own exhaustion.
              </p>
              <p style={bodyText("62ch")}>
                So we built the opposite. We take your business on as if it were our own, obsessive about
                the details, the aesthetics, and above all your results. One team, one plan, strategy
                first, and a product that is designed to sell before we build any of it.
              </p>
              <p style={bodyText("62ch")}>
                What I care about most is helping you make a real impact with your knowledge and your
                gifts, and build income in a way that is genuinely fun and easeful. That is the whole
                reason this exists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE TEAM */}
      <section
        style={{
          padding: "clamp(56px,7vw,100px) 24px",
          borderTop: "1px solid rgba(124,150,232,0.16)",
          background: "rgba(6,11,30,0.72)",
        }}
      >
        <div style={wrap}>
          <Heading>The team</Heading>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "clamp(20px,3vw,28px)" }}>
            {TEAM.map((m) => (
              <div
                key={m.name}
                style={{
                  border: "1px solid rgba(124,150,232,0.2)",
                  borderRadius: 14,
                  background: "rgba(11,20,48,0.55)",
                  padding: "clamp(24px,3vw,32px)",
                }}
              >
                <div style={{ marginBottom: 18 }}>
                  <Avatar variant={m.avatar} size={72} />
                </div>
                <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(19px,2.1vw,25px)", margin: 0, color: "#F3F6FF" }}>
                  {m.name}
                </h3>
                <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7FA0FF", margin: "8px 0 14px" }}>
                  {m.role}
                </div>
                <p style={bodyText("none")}>{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section style={{ padding: "clamp(56px,7vw,100px) 24px" }}>
        <div style={wrap}>
          <Heading>How we work</Heading>
          <ul
            style={{
              listStyle: "none",
              margin: "8px 0 0",
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: "16px 32px",
            }}
          >
            {HOW_WE_WORK.map((it, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "start" }}>
                <span style={{ width: 7, height: 7, background: "#3B6BFF", marginTop: 8, flexShrink: 0, boxShadow: "0 0 8px rgba(59,107,255,0.8)" }} />
                <span style={{ fontFamily: SERIF, fontSize: "clamp(16px,1.55vw,19px)", lineHeight: 1.5, color: "#B7C0DD" }}>{it}</span>
              </li>
            ))}
          </ul>
          <p style={{ ...bodyText("62ch"), marginTop: "clamp(32px,4vw,48px)" }}>
            Press and podcast inquiries welcome.{" "}
            <a href={CAL_URL} target="_blank" rel="noopener" style={{ color: "#8EA6FF", borderBottom: "1px solid rgba(124,150,232,0.5)" }}>
              Grab a time on the calendar
            </a>{" "}
            and we&rsquo;ll take it from there.
          </p>
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
            Let&rsquo;s build the thing you&rsquo;ve been meaning to build.
          </h2>
          <p style={{ ...bodyText("52ch"), margin: "24px auto 0", color: "#AEB8D6" }}>
            Book a call and we&rsquo;ll map what your build would be. If it&rsquo;s not a fit, I&rsquo;ll
            tell you on the call.
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
              { href: ROUTES.results, label: "See the results →" },
              { href: ROUTES.faq, label: "Read the FAQ →" },
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
