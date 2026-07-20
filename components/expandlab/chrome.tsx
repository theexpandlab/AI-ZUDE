"use client";

import { useEffect } from "react";

/**
 * Shared chrome + design tokens for the Expand Lab "100-Day Build" site.
 *
 * The site is a 4-page set — the one-pager (/build) plus three deep pages
 * (/method, /whats-included, /results) — that share the same "blueprints among
 * the stars" system: a drifting CSS starfield, sticky nav, footer trust strip,
 * and a single CTA everywhere. Every page composes <PageShell> + <SiteNav> +
 * sections + <SiteFooter>. The prototype's support.js/image-slot runtime is not
 * ported; this is native semantic markup.
 */

export const CAL_URL = "https://cal.com/expandlab/funnel";
export const LOGO = "/expand-lab-logo.avif";

export const MONO = "'IBM Plex Mono', monospace";
export const SERIF = "'Newsreader', Georgia, serif";

/* Routes (real Next paths — also reachable on the sales subdomain). */
export const ROUTES = {
  home: "/build",
  method: "/method",
  included: "/whats-included",
  results: "/results",
};

/* ── Reused style fragments ─────────────────────────────────────────────── */

export const wrap: React.CSSProperties = { maxWidth: 1120, margin: "0 auto" };
export const sectionPad = "clamp(76px,9vw,132px) 24px";

export const h2Style: React.CSSProperties = {
  fontFamily: SERIF,
  fontWeight: 400,
  fontSize: "clamp(30px,4.8vw,58px)",
  lineHeight: 1.06,
  letterSpacing: "-0.015em",
  color: "#F3F6FF",
  textWrap: "balance",
} as React.CSSProperties;

export const bodyText = (max = "72ch"): React.CSSProperties => ({
  fontFamily: SERIF,
  fontSize: "clamp(16px,1.55vw,19px)",
  lineHeight: 1.6,
  color: "#B7C0DD",
  margin: 0,
  maxWidth: max,
});

/* ── Small building blocks ──────────────────────────────────────────────── */

export function StarSparkle({ size = 13, fill = "#5B84FF" }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 0 L13.6 10.4 L24 12 L13.6 13.6 L12 24 L10.4 13.6 L0 12 L10.4 10.4 Z"
        fill={fill}
      />
    </svg>
  );
}

export function Eyebrow({
  children,
  color = "#8EA6FF",
  starFill = "#5B84FF",
  size = 12.5,
  tracking = "0.2em",
  starSize = 13,
  mb = 22,
}: {
  children: React.ReactNode;
  color?: string;
  starFill?: string;
  size?: number;
  tracking?: string;
  starSize?: number;
  mb?: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: mb }}>
      <StarSparkle size={starSize} fill={starFill} />
      <span
        style={{
          fontFamily: MONO,
          fontSize: size,
          letterSpacing: tracking,
          textTransform: "uppercase",
          color,
        }}
      >
        {children}
      </span>
    </div>
  );
}

export function PrimaryCTA({
  children,
  fontSize = 14,
  padding = "18px 30px",
  arrow = 16,
  shadow = "0 0 0 1px rgba(91,132,255,0.5),0 14px 40px -12px rgba(59,107,255,0.85)",
}: {
  children: React.ReactNode;
  fontSize?: number;
  padding?: string;
  arrow?: number;
  shadow?: string;
}) {
  return (
    <a
      className="el-cta"
      href={CAL_URL}
      target="_blank"
      rel="noopener"
      style={{
        background: "linear-gradient(180deg,#3B6BFF,#2E5AE0)",
        color: "#EAF0FF",
        fontFamily: MONO,
        fontSize,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding,
        borderRadius: 6,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        boxShadow: shadow,
      }}
    >
      {children} <span style={{ fontSize: arrow }}>→</span>
    </a>
  );
}

/** Bordered mono "read more / cross-link" pill used between/under sections. */
export function GhostLink({
  href,
  children,
  center = false,
  mt = "clamp(32px,4vw,48px)",
}: {
  href: string;
  children: React.ReactNode;
  center?: boolean;
  mt?: string;
}) {
  return (
    <div style={{ marginTop: mt, textAlign: center ? "center" : "left" }}>
      <a
        className="el-ghostlink"
        href={href}
        style={{
          fontFamily: MONO,
          fontSize: 12.5,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "#EAEEFB",
          border: "1px solid rgba(124,150,232,0.4)",
          borderRadius: 6,
          padding: "14px 22px",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {children} <span>→</span>
      </a>
    </div>
  );
}

/* ── Starfield ──────────────────────────────────────────────────────────── */

export function Starfield() {
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: "-80px 0", zIndex: 0, pointerEvents: "none" }}>
      <div
        className="el-star-a"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(1.6px 1.6px at 24px 40px,rgba(255,255,255,0.95),transparent),radial-gradient(1.4px 1.4px at 160px 120px,rgba(190,208,255,0.85),transparent),radial-gradient(1px 1px at 90px 200px,rgba(255,255,255,0.7),transparent),radial-gradient(1.2px 1.2px at 260px 60px,rgba(220,230,255,0.8),transparent),radial-gradient(1px 1px at 320px 240px,rgba(255,255,255,0.6),transparent),radial-gradient(1.5px 1.5px at 200px 300px,rgba(200,215,255,0.75),transparent)",
          backgroundSize: "360px 360px",
          backgroundRepeat: "repeat",
        }}
      />
      <div
        className="el-star-b"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(1px 1px at 60px 80px,rgba(255,255,255,0.55),transparent),radial-gradient(1.2px 1.2px at 180px 30px,rgba(150,180,255,0.6),transparent),radial-gradient(1px 1px at 300px 160px,rgba(255,255,255,0.45),transparent),radial-gradient(1.6px 1.6px at 120px 260px,rgba(230,238,255,0.7),transparent),radial-gradient(1px 1px at 380px 300px,rgba(255,255,255,0.4),transparent)",
          backgroundSize: "480px 480px",
          backgroundRepeat: "repeat",
        }}
      />
      <div
        className="el-star-c"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(2px 2px at 130px 90px,rgba(159,192,255,0.9),transparent),radial-gradient(1.8px 1.8px at 340px 210px,rgba(255,255,255,0.8),transparent),radial-gradient(1.5px 1.5px at 500px 340px,rgba(190,208,255,0.7),transparent),radial-gradient(2.2px 2.2px at 60px 380px,rgba(255,255,255,0.75),transparent)",
          backgroundSize: "620px 620px",
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}

/* ── Sticky nav (shared across all pages) ───────────────────────────────── */

export function SiteNav() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(8,15,38,0.72)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(124,150,232,0.16)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <a href={ROUTES.home} style={{ display: "flex", alignItems: "center" }} aria-label="Expand Lab — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="Expand Lab" style={{ height: 26, width: "auto", display: "block" }} />
        </a>
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            fontFamily: MONO,
            fontSize: 12.5,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <a className="el-navlink el-nav-collapse" href={ROUTES.method} style={{ color: "#AEB8D6" }}>
            The Method
          </a>
          <a className="el-navlink el-nav-collapse" href={ROUTES.included} style={{ color: "#AEB8D6" }}>
            Included
          </a>
          <a className="el-navlink el-nav-collapse" href={ROUTES.results} style={{ color: "#AEB8D6" }}>
            Results
          </a>
          <a
            className="el-cta"
            href={CAL_URL}
            target="_blank"
            rel="noopener"
            style={{
              background: "linear-gradient(180deg,#3B6BFF,#2E5AE0)",
              color: "#EAF0FF",
              padding: "11px 18px",
              borderRadius: 5,
              letterSpacing: "0.06em",
              boxShadow: "0 0 0 1px rgba(91,132,255,0.45),0 10px 26px -10px rgba(59,107,255,0.8)",
            }}
          >
            Book a call
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ── Footer / trust strip (shared) ──────────────────────────────────────── */

export function SiteFooter() {
  return (
    <footer
      style={{
        background: "#04081A",
        color: "#AEB8D6",
        padding: "clamp(40px,5vw,64px) 24px",
        borderTop: "1px solid rgba(124,150,232,0.16)",
      }}
    >
      <div style={wrap}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px 40px",
            justifyContent: "center",
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#8EA6FF",
            paddingBottom: 32,
            borderBottom: "1px solid rgba(124,150,232,0.18)",
          }}
        >
          <span>$1.5M+ generated for clients</span>
          <span>80+ experts built for</span>
          <span>100-day delivery</span>
          <span>Kajabi, Skool &amp; GoHighLevel</span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            paddingTop: 28,
          }}
        >
          <a href={ROUTES.home} style={{ display: "flex", alignItems: "center" }} aria-label="Expand Lab — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO} alt="Expand Lab" style={{ height: 24, width: "auto", display: "block" }} />
          </a>
          <span style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: "0.04em", color: "#7C89AE" }}>
            theexpandlab.com · © 2026 Expand Lab
          </span>
          <a
            className="el-ghostlink"
            href={CAL_URL}
            target="_blank"
            rel="noopener"
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#F3F6FF",
              borderBottom: "1px solid #5B84FF",
              paddingBottom: 2,
            }}
          >
            Book a call →
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ── Scroll-reveal hook (Gantt phases / cards) ──────────────────────────── */

export function usePhaseReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!els.length) return;
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("el-phase--in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const el = en.target as HTMLElement;
            const d = parseInt(el.dataset.delay || "0", 10);
            window.setTimeout(() => el.classList.add("el-phase--in"), d);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

/* ── Page shell: dark canvas + starfield + z-indexed content ────────────── */

export function PageShell({ children }: { children: React.ReactNode }) {
  usePhaseReveal();
  return (
    <div
      style={{
        position: "relative",
        background:
          "radial-gradient(1300px 780px at 50% -8%,rgba(59,107,255,0.26),transparent 60%),radial-gradient(900px 700px at 88% 12%,rgba(91,132,255,0.10),transparent 55%),#080F26",
        overflowX: "hidden",
        color: "#EAEEFB",
        fontFamily: SERIF,
      }}
    >
      <style>{PAGE_CSS}</style>
      <Starfield />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* ── Scoped CSS: theme override, starfield motion, hovers, reveal ───────── */

export const PAGE_CSS = `
/* These dark routes override the global warm-paper body theme while mounted. */
body{background:#080F26 !important;background-image:none !important;color:#EAEEFB;-webkit-font-smoothing:antialiased;}
html{scroll-behavior:smooth;}
::selection{background:#3B6BFF;color:#EAF0FF;}

.el-cta:hover{color:#fff;}
.el-navlink{transition:color .18s ease;}
.el-navlink:hover{color:#B9CBFF;}
.el-ghostlink{transition:color .18s ease,border-color .18s ease;}
.el-ghostlink:hover{color:#B9CBFF;border-color:#5B84FF;}

.el-phase{opacity:0;transform:translateY(16px);transition:opacity .7s ease,transform .7s ease;}
.el-phase.el-phase--in{opacity:1;transform:none;}

@keyframes elTwinkleA{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes elTwinkleB{0%,100%{opacity:.9}50%{opacity:.4}}
@keyframes elTwinkleC{0%,100%{opacity:.7}50%{opacity:.3}}
@keyframes elDriftA{from{background-position:0 0}to{background-position:-360px 360px}}
@keyframes elDriftB{from{background-position:0 0}to{background-position:480px 480px}}
@keyframes elDriftC{from{background-position:0 0}to{background-position:-260px 620px}}
.el-star-a{animation:elTwinkleA 6s ease-in-out infinite,elDriftA 140s linear infinite;}
.el-star-b{animation:elTwinkleB 9s ease-in-out infinite,elDriftB 200s linear infinite;}
.el-star-c{animation:elTwinkleC 7.5s ease-in-out infinite,elDriftC 90s linear infinite;}

@media (max-width:640px){
  .el-nav-collapse{display:none;}
}

@media (prefers-reduced-motion: reduce){
  html{scroll-behavior:auto;}
  .el-star-a,.el-star-b,.el-star-c{animation:none !important;}
  .el-phase{opacity:1 !important;transform:none !important;transition:none !important;}
}
`;
