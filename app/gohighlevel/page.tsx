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
import { FACTS } from "@/content/facts";
import { GHL_FAQ } from "@/content/gohighlevel-faq";

/**
 * /gohighlevel — platform page targeting "course inside GoHighLevel / GHL course
 * builder" queries. Leads with the CRM-plus-automation angle. Same template as
 * /kajabi and /skool.
 */

const WE_BUILD = [
  "Memberships and courses",
  "Funnels and checkout",
  "Pipelines and CRM setup",
  "Email and SMS automations",
  "Calendars and booking",
  "Onboarding and member experience",
  "SaaS mode setup (when you resell the platform)",
  "Design matched to your brand",
];

const PHASES = [
  { n: "01", name: "Discovery", body: "What you are actually selling, and to whom." },
  { n: "02", name: "Architecture", body: "The offer, pricing and automation model, with GoHighLevel chosen deliberately." },
  { n: "03", name: "Build", body: "Memberships, funnels, pipelines, email and SMS, connected and tested." },
  { n: "04", name: "Launch", body: "The campaign, warmest audience first." },
  { n: "05", name: "Optimize", body: "What to fix before the next run." },
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
        margin: "0 0 20px",
        color: "#F3F6FF",
        textWrap: "balance",
      } as React.CSSProperties}
    >
      {children}
    </h2>
  );
}

export default function GoHighLevelPage() {
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
            GoHighLevel
          </Eyebrow>
          <h1
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: "clamp(36px,5.6vw,74px)",
              lineHeight: 1.03,
              letterSpacing: "-0.022em",
              margin: 0,
              maxWidth: "18ch",
              textWrap: "balance",
              color: "#F3F6FF",
              textShadow: "0 0 60px rgba(59,107,255,0.28)",
            } as React.CSSProperties}
          >
            We build your course and membership inside GoHighLevel. Done for you.
          </h1>
          <p style={{ ...bodyText("64ch"), fontSize: "clamp(18px,2vw,23px)", color: "#AEB8D6", margin: "30px 0 0" }}>
            The Expand Lab is a done-for-you online course creation agency in {FACTS.city}, and
            GoHighLevel is one of our three core platforms. Through the 100-Day Build we design, build and
            launch courses, memberships and coaching programs inside GoHighLevel: memberships and courses,
            funnels and checkout, pipelines, email and SMS automations, and the launch itself.{" "}
            {FACTS.price}, project-based.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20, marginTop: 36 }}>
            <PrimaryCTA>Book a 30-minute strategy call</PrimaryCTA>
            <LastUpdated date={FACTS.updated} />
          </div>
        </div>
      </section>

      {/* A COURSE INSIDE YOUR CRM + WHY AN AGENCY */}
      <section style={{ padding: "clamp(48px,6vw,88px) 24px" }}>
        <div style={{ ...wrap, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "clamp(28px,4vw,56px)" }}>
          <div>
            <Heading>A course inside your CRM: what GoHighLevel gives you</Heading>
            <p style={bodyText("none")}>
              GoHighLevel puts your course, memberships, funnels, pipelines, email and SMS in one system,
              so the same platform that hosts the course also runs the marketing and client management
              behind it. That is powerful, and it is a lot to wire correctly, which is exactly the part
              we handle.
            </p>
          </div>
          <div>
            <Heading>Why hire an agency instead of wiring GoHighLevel yourself</Heading>
            <p style={bodyText("none")}>
              GoHighLevel can do almost anything, which is why it is so easy to get lost in. An agency owns
              the whole outcome: the offer, the course, the funnels and the automation backbone, built and
              tested together. One team runs strategy, build and launch so the pieces connect instead of
              half-working in isolation.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT WE BUILD */}
      <section
        style={{
          padding: "clamp(56px,7vw,100px) 24px",
          borderTop: "1px solid rgba(124,150,232,0.16)",
          background: "rgba(6,11,30,0.72)",
        }}
      >
        <div style={wrap}>
          <Heading>What we build in GoHighLevel</Heading>
          <ul
            style={{
              listStyle: "none",
              margin: "8px 0 0",
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: "14px 28px",
            }}
          >
            {WE_BUILD.map((it, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "start" }}>
                <span style={{ width: 7, height: 7, background: "#3B6BFF", marginTop: 8, flexShrink: 0, boxShadow: "0 0 8px rgba(59,107,255,0.8)" }} />
                <span style={{ fontFamily: SERIF, fontSize: "clamp(16px,1.55vw,19px)", lineHeight: 1.5, color: "#B7C0DD" }}>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHAT A GHL BUILD LOOKS LIKE */}
      <section style={{ padding: "clamp(56px,7vw,100px) 24px" }}>
        <div style={{ ...wrap, maxWidth: 820 }}>
          <Heading>What a GoHighLevel build looks like</Heading>
          <p style={{ ...bodyText("68ch"), marginBottom: 18 }}>
            A typical GoHighLevel build turns a scattered stack of tools into one system: the course and
            membership, the funnels that sell them, and the pipelines, email and SMS automations that move
            people from first touch to enrolled to retained, all in one place and tested end to end.
          </p>
          <p style={bodyText("68ch")}>
            You can see real results, across platforms, on the{" "}
            <a href={ROUTES.results} style={{ color: "#8EA6FF", borderBottom: "1px solid rgba(124,150,232,0.5)" }}>
              results page
            </a>
            .
          </p>
        </div>
      </section>

      {/* GHL VS KAJABI */}
      <section
        style={{
          padding: "clamp(56px,7vw,100px) 24px",
          borderTop: "1px solid rgba(124,150,232,0.16)",
          background: "rgba(6,11,30,0.72)",
        }}
      >
        <div style={{ ...wrap, maxWidth: 820 }}>
          <Heading>GoHighLevel vs Kajabi for coaches (and when Skool fits)</Heading>
          <p style={bodyText("68ch")}>
            GoHighLevel wins when you want the course inside a CRM with heavy automation, pipelines, SMS
            and client management, or when you plan to resell the software.{" "}
            <a href={ROUTES.kajabi} style={{ color: "#8EA6FF", borderBottom: "1px solid rgba(124,150,232,0.5)" }}>
              Kajabi
            </a>{" "}
            wins when you want a polished, standalone course and membership with less setup.{" "}
            <a href={ROUTES.skool} style={{ color: "#8EA6FF", borderBottom: "1px solid rgba(124,150,232,0.5)" }}>
              Skool
            </a>{" "}
            wins when the offer is community-first. We pick based on your architecture, not habit.
          </p>
          <p style={{ ...bodyText("68ch"), marginTop: 18 }}>
            See the full{" "}
            <a href={ROUTES.comparePlatforms} style={{ color: "#8EA6FF", borderBottom: "1px solid rgba(124,150,232,0.5)" }}>
              Kajabi vs Skool vs GoHighLevel
            </a>{" "}
            comparison.
          </p>
        </div>
      </section>

      {/* OUR 100-DAY BUILD ON GHL */}
      <section style={{ padding: "clamp(56px,7vw,100px) 24px" }}>
        <div style={wrap}>
          <Heading>Our 100-Day Build on GoHighLevel</Heading>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {PHASES.map((p) => (
              <div
                key={p.n}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto 1fr",
                  gap: "clamp(14px,2vw,28px)",
                  alignItems: "baseline",
                  padding: "18px 0",
                  borderTop: "1px solid rgba(124,150,232,0.18)",
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 13, color: "#7FA0FF" }}>{p.n}</span>
                <span style={{ fontFamily: SERIF, fontSize: "clamp(18px,2vw,24px)", color: "#F3F6FF" }}>{p.name}</span>
                <span style={{ fontFamily: SERIF, fontSize: "clamp(15px,1.5vw,18px)", lineHeight: 1.5, color: "#B7C0DD" }}>{p.body}</span>
              </div>
            ))}
          </div>
          <p style={{ ...bodyText("none"), marginTop: 22 }}>
            The full method is on the{" "}
            <a href={ROUTES.method} style={{ color: "#8EA6FF", borderBottom: "1px solid rgba(124,150,232,0.5)" }}>
              method page
            </a>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection heading="GoHighLevel build questions" eyebrow="FAQ" items={GHL_FAQ} />

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
            Get your GoHighLevel course built for you.
          </h2>
          <p style={{ ...bodyText("52ch"), margin: "24px auto 0", color: "#AEB8D6" }}>
            Book a call and we&rsquo;ll map your GoHighLevel build, what it includes and what it costs. If
            it is not the right fit, I&rsquo;ll tell you that too.
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
              { href: ROUTES.pricing, label: "See pricing →" },
              { href: ROUTES.kajabi, label: "Kajabi builds →" },
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
