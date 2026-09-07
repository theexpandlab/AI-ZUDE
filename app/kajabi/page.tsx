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
import { KAJABI_FAQ } from "@/content/kajabi-faq";

/**
 * /kajabi — the first of the three platform pages. Targets "hire a Kajabi
 * expert" and "done-for-you Kajabi course" queries. Same template the other
 * platform pages (/skool, /gohighlevel) will follow.
 */

const WE_BUILD = [
  "Products, offers and bundles",
  "Checkout and payment setup",
  "Sales, offer and opt-in pages",
  "Pipelines and funnels",
  "Email sequences and automations",
  "Communities and memberships",
  "Coaching programs and cohorts",
  "Podcasts and content hosting",
  "Design matched to your brand",
];

const PHASES = [
  { n: "01", name: "Discovery", body: "What you are actually selling, and to whom." },
  { n: "02", name: "Architecture", body: "The offer ladder, pricing and buyer journey, with Kajabi chosen deliberately." },
  { n: "03", name: "Build", body: "Curriculum, Kajabi products, pages, checkout and automations, connected and tested." },
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

export default function KajabiPage() {
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
            Kajabi
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
            We build your Kajabi course, funnel and launch. Done for you.
          </h1>
          <p style={{ ...bodyText("64ch"), fontSize: "clamp(18px,2vw,23px)", color: "#AEB8D6", margin: "30px 0 0" }}>
            The Expand Lab is a done-for-you online course creation agency in {FACTS.city}, and Kajabi is
            one of our three core platforms. Through the 100-Day Build we design, build and launch
            complete Kajabi courses, memberships and coaching programs for coaches, authors and
            consultants: curriculum, Kajabi products and offers, sales page, checkout, email sequences,
            pipelines and the launch itself. {FACTS.price}, project-based.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20, marginTop: 36 }}>
            <PrimaryCTA>Book a 30-minute strategy call</PrimaryCTA>
            <LastUpdated date={FACTS.updated} />
          </div>
        </div>
      </section>

      {/* WHAT A KAJABI BUILDER DOES + WHY AN AGENCY */}
      <section style={{ padding: "clamp(48px,6vw,88px) 24px" }}>
        <div style={{ ...wrap, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "clamp(28px,4vw,56px)" }}>
          <div>
            <Heading>What a Kajabi course builder actually does</Heading>
            <p style={bodyText("none")}>
              A Kajabi course builder sets up your products, offers, checkout and email inside Kajabi. We
              do that, and the part that matters more: we decide what the product should be, how the
              offer ladder is priced, and how the funnel converts, before we build any of it. The tool
              is the easy part.
            </p>
          </div>
          <div>
            <Heading>Why hire an agency instead of a Kajabi freelancer</Heading>
            <p style={bodyText("none")}>
              A freelancer builds the piece you hand them, a course shell or a sales page, and leaves the
              strategy, the sequencing and the launch to you. An agency owns the whole outcome. One team
              runs strategy, curriculum, build and launch together, so the pieces actually connect and
              nothing falls between the cracks.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT WE BUILD IN KAJABI */}
      <section
        style={{
          padding: "clamp(56px,7vw,100px) 24px",
          borderTop: "1px solid rgba(124,150,232,0.16)",
          background: "rgba(6,11,30,0.72)",
        }}
      >
        <div style={wrap}>
          <Heading>What we build in Kajabi</Heading>
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

      {/* WHAT A KAJABI BUILD LOOKS LIKE */}
      <section style={{ padding: "clamp(56px,7vw,100px) 24px" }}>
        <div style={{ ...wrap, maxWidth: 820 }}>
          <Heading>What a Kajabi build looks like</Heading>
          <p style={{ ...bodyText("68ch"), marginBottom: 18 }}>
            A typical Kajabi build starts with a scattered set of frameworks and ends with a live,
            selling ecosystem: a signature course, the offers around it, a funnel that converts your
            warm audience first, and the automations that run enrollment and onboarding without you.
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

      {/* WHEN KAJABI IS RIGHT */}
      <section
        style={{
          padding: "clamp(56px,7vw,100px) 24px",
          borderTop: "1px solid rgba(124,150,232,0.16)",
          background: "rgba(6,11,30,0.72)",
        }}
      >
        <div style={{ ...wrap, maxWidth: 820 }}>
          <Heading>When Kajabi is the right platform (and when Skool or GoHighLevel is)</Heading>
          <p style={bodyText("68ch")}>
            Kajabi is the right home when you want courses, memberships and email in one place with a
            polished student experience. Skool is stronger when the offer is community-first, with
            discussion and gamification at the center. GoHighLevel fits when you want the course to live
            inside a CRM with heavy automation and client management. We pick based on your
            architecture, not habit.
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

      {/* OUR 100-DAY BUILD ON KAJABI */}
      <section style={{ padding: "clamp(56px,7vw,100px) 24px" }}>
        <div style={wrap}>
          <Heading>Our 100-Day Build on Kajabi</Heading>
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

      {/* MIGRATION */}
      <section
        style={{
          padding: "clamp(56px,7vw,100px) 24px",
          borderTop: "1px solid rgba(124,150,232,0.16)",
          background: "rgba(6,11,30,0.72)",
        }}
      >
        <div style={{ ...wrap, maxWidth: 820 }}>
          <Heading>Migrating to Kajabi from Teachable, Thinkific or Podia</Heading>
          <p style={bodyText("68ch")}>
            Already on another platform? We migrate your course, content and students into Kajabi and
            rebuild the funnel and automations around them, so you move up without losing what you have.
            Migration scope is set in the proposal.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection heading="Kajabi build questions" eyebrow="FAQ" items={KAJABI_FAQ} />

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
            Get your Kajabi course built for you.
          </h2>
          <p style={{ ...bodyText("52ch"), margin: "24px auto 0", color: "#AEB8D6" }}>
            Book a call and we&rsquo;ll map your Kajabi build, what it includes and what it costs. If
            Kajabi is not the right fit, I&rsquo;ll tell you that too.
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
              { href: ROUTES.included, label: "See what’s included →" },
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
