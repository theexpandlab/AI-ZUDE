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
import { PRICING_FAQ } from "@/content/pricing-faq";

/**
 * /pricing — the single most-asked question in the niche ("how much does it
 * cost"). States the number plainly in the first paragraph so AI engines can
 * quote it, then breaks down what is in the price, what moves it, what is not
 * included, payment terms, the guarantee, and an honest comparison.
 */

const IN_PRICE = [
  { label: "01 · Product strategy", body: "Offer design, pricing, positioning, and the full offer ladder." },
  { label: "02 · Curriculum architecture", body: "Modules, lessons, worksheets, and the transformation arc." },
  { label: "03 · Platform build", body: "Full setup in Kajabi, Skool, or GoHighLevel, whichever fits your build." },
  { label: "04 · Funnel & copy", body: "Sales page, offer pages, opt-ins, and checkout, written to sound like you." },
  { label: "05 · Automation", body: "Enrollment, onboarding, nurture, and post-purchase flows, wired and tested." },
  { label: "06 · Launch & optimization", body: "The launch campaign and the post-launch review that tells you what to change." },
];

const MOVES_PRICE = [
  "How many offers are in the ladder, from a single course to a multi-tier ecosystem.",
  "Platform complexity, from a straightforward course to community, memberships, and deeper automations.",
  "How much of your content, brand, and assets already exist versus what we build from scratch.",
  "The size and number of launches we run with you.",
];

const NOT_INCLUDED = [
  "Professional video production, filming, and editing. You record; we structure and support you.",
  "Audience building. We build the product and the system that converts the audience you have.",
  `Ongoing content production after launch. That is the Content & Marketing Retainer, ${FACTS.retainer}.`,
  "Paid ad management and spend.",
  "Ongoing platform maintenance after handoff.",
];

const PAYMENT_TERMS = [
  "Project-based, never hourly. The cost ties to outcomes, not clocked time.",
  "Typically 50% up front, with the balance due at the Build phase.",
  "Payment plans available for qualified clients.",
  "We don’t discount. We add bonuses.",
];

/* ── Small section helpers ──────────────────────────────────────────────── */

function Bullet({ apricot = false }: { apricot?: boolean }) {
  return apricot ? (
    <span style={{ width: 10, height: 10, border: "1.5px solid #E8A87C", marginTop: 7, flexShrink: 0 }} />
  ) : (
    <span style={{ width: 7, height: 7, background: "#3B6BFF", marginTop: 8, flexShrink: 0, boxShadow: "0 0 8px rgba(59,107,255,0.8)" }} />
  );
}

function List({ items, apricot = false }: { items: string[]; apricot?: boolean }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
      {items.map((it, i) => (
        <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "start" }}>
          <Bullet apricot={apricot} />
          <span style={{ fontFamily: SERIF, fontSize: "clamp(16px,1.55vw,19px)", lineHeight: 1.5, color: "#B7C0DD" }}>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionHeading({ children, apricot = false }: { children: React.ReactNode; apricot?: boolean }) {
  return (
    <h2
      style={{
        fontFamily: SERIF,
        fontWeight: 400,
        fontSize: "clamp(24px,3vw,38px)",
        lineHeight: 1.08,
        letterSpacing: "-0.015em",
        margin: "0 0 22px",
        color: apricot ? "#F3F6FF" : "#F3F6FF",
        textWrap: "balance",
      } as React.CSSProperties}
    >
      {children}
    </h2>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function PricingPage() {
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
            Pricing
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
            What the 100-Day Build costs.
          </h1>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(18px,2vw,23px)",
              lineHeight: 1.58,
              color: "#AEB8D6",
              maxWidth: "64ch",
              margin: "30px 0 0",
            }}
          >
            The 100-Day Build is {FACTS.price}, project-based, for the full design, build and launch of
            your course or program on Kajabi, Skool or GoHighLevel. Most clients pay 50% up front and
            the balance at the Build phase. Payment plans are available for qualified clients. The
            Content &amp; Marketing Retainer after launch is {FACTS.retainer}.
          </p>

          {/* Price panel */}
          <div
            style={{
              marginTop: 40,
              display: "inline-flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              gap: 16,
              border: "1px solid rgba(124,150,232,0.4)",
              borderRadius: 14,
              background: "linear-gradient(160deg,rgba(59,107,255,0.14),rgba(11,20,48,0.85))",
              padding: "clamp(22px,3vw,30px) clamp(26px,4vw,40px)",
              boxShadow: "0 0 60px -20px rgba(59,107,255,0.55)",
            }}
          >
            <span
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(34px,5vw,54px)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "#F3F6FF",
                textShadow: "0 0 34px rgba(59,107,255,0.5)",
              }}
            >
              {FACTS.price}
            </span>
            <span style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: "0.06em", color: "#AEB8D6" }}>
              full build, project-based
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20, marginTop: 36 }}>
            <PrimaryCTA>Book a 30-minute strategy call</PrimaryCTA>
            <LastUpdated date={FACTS.updated} />
          </div>
        </div>
      </section>

      {/* WHAT'S IN THE PRICE */}
      <section style={{ padding: "clamp(48px,6vw,88px) 24px" }}>
        <div style={wrap}>
          <SectionHeading>What&rsquo;s in the price</SectionHeading>
          <p style={{ ...bodyText("64ch"), marginBottom: "clamp(28px,4vw,44px)" }}>
            One scope, six components, all handled by us. The full breakdown is on the{" "}
            <a href={ROUTES.included} style={{ color: "#8EA6FF", borderBottom: "1px solid rgba(124,150,232,0.5)" }}>
              What&rsquo;s Included
            </a>{" "}
            page.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: "clamp(24px,3vw,44px) clamp(32px,4vw,64px)",
            }}
          >
            {IN_PRICE.map((item) => (
              <div key={item.label} style={{ borderTop: "1px solid rgba(124,150,232,0.35)", paddingTop: 18 }}>
                <h3 style={{ fontFamily: MONO, fontWeight: 400, fontSize: 12, letterSpacing: "0.1em", color: "#7FA0FF", margin: "0 0 10px" }}>
                  {item.label}
                </h3>
                <p style={bodyText("none")}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT MOVES THE PRICE + WHAT'S NOT INCLUDED */}
      <section
        style={{
          padding: "clamp(56px,7vw,104px) 24px",
          borderTop: "1px solid rgba(124,150,232,0.16)",
          background: "rgba(6,11,30,0.72)",
        }}
      >
        <div style={{ ...wrap, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "clamp(28px,4vw,56px)" }}>
          <div>
            <SectionHeading>What moves the price within the range</SectionHeading>
            <List items={MOVES_PRICE} />
          </div>
          <div>
            <SectionHeading apricot>What&rsquo;s not included</SectionHeading>
            <List items={NOT_INCLUDED} apricot />
          </div>
        </div>
      </section>

      {/* PAYMENT TERMS + GUARANTEE */}
      <section style={{ padding: "clamp(56px,7vw,104px) 24px" }}>
        <div style={{ ...wrap, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "clamp(28px,4vw,56px)" }}>
          <div>
            <SectionHeading>Payment terms</SectionHeading>
            <List items={PAYMENT_TERMS} />
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
            <Eyebrow color="#9DB0FF" starFill="#7FA0FF" size={12} tracking="0.18em" mb={18}>
              The guarantee
            </Eyebrow>
            <p style={{ fontFamily: SERIF, fontSize: "clamp(18px,2vw,23px)", lineHeight: 1.5, color: "#F3F6FF", margin: 0 }}>
              Everything specified in your proposal ships by day 100, or we keep working at no
              additional cost until it does.
            </p>
            <p style={{ ...bodyText("none"), marginTop: 16 }}>
              The scope is in writing before we start, so there is no guessing what &ldquo;finished&rdquo;
              means.
            </p>
          </div>
        </div>
      </section>

      {/* HOW THIS COMPARES */}
      <section
        style={{
          padding: "clamp(56px,7vw,104px) 24px",
          borderTop: "1px solid rgba(124,150,232,0.16)",
          background: "rgba(6,11,30,0.72)",
        }}
      >
        <div style={{ ...wrap, maxWidth: 820 }}>
          <SectionHeading>How this compares</SectionHeading>
          <p style={{ ...bodyText("68ch"), marginBottom: 18 }}>
            A freelancer will build one piece, a sales page or a course shell, for roughly $1,500 to
            $5,000, and you project-manage everything else and stitch it together yourself.
          </p>
          <p style={{ ...bodyText("68ch"), marginBottom: 18 }}>
            A large agency will build the whole thing for $15,000 to $50,000 and up.
          </p>
          <p style={{ ...bodyText("68ch"), marginBottom: 18 }}>
            Doing it yourself costs mostly time, plus platform fees, and most experts stay stuck there
            for years because packaging a product is a different skill from knowing your material.
          </p>
          <p style={bodyText("68ch")}>
            The 100-Day Build sits in between: the full build, done for you, by a team that runs
            strategy first so the thing actually sells once it exists.
          </p>
          <p style={{ ...bodyText("68ch"), marginTop: 18 }}>
            More detail:{" "}
            <a href={ROUTES.compareAgencyFreelancer} style={{ color: "#8EA6FF", borderBottom: "1px solid rgba(124,150,232,0.5)" }}>
              course agency vs freelancer
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
      <FaqSection heading="Pricing questions" eyebrow="FAQ" items={PRICING_FAQ} />

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
            Let&rsquo;s scope your number.
          </h2>
          <p style={{ ...bodyText("52ch"), margin: "24px auto 0", textAlign: "center", color: "#AEB8D6" }}>
            Book a call and we&rsquo;ll map exactly what your build includes and what it costs. If it is
            not a fit, I&rsquo;ll tell you on the call.
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
              { href: ROUTES.included, label: "See what’s included →" },
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
