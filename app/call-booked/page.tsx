"use client";

import { useEffect, useRef } from "react";

import {
  bodyText,
  Eyebrow,
  GhostLink,
  MONO,
  PageShell,
  ROUTES,
  SERIF,
  SiteFooter,
  SiteNav,
  wrap,
} from "@/components/expandlab/chrome";
import { trackMetaEvent } from "@/components/MetaPixel";

/**
 * /call-booked: where Cal.com sends people after they book a strategy call.
 * Fires the Meta "Schedule" conversion once per visit (browser + Conversions
 * API, deduplicated on a shared event_id).
 */

/* ── Fill these in ─────────────────────────────────────────────────────────
 * PRE_CALL_VIDEO_EMBED_URL: an EMBED url, e.g.
 *   YouTube  https://www.youtube.com/embed/VIDEO_ID
 *   Loom     https://www.loom.com/embed/VIDEO_ID
 *   Vimeo    https://player.vimeo.com/video/VIDEO_ID
 * PROOF_ROOM_URL: the link to the proof room.
 *
 * While either is empty, that block shows a dashed placeholder on preview
 * deployments and local dev, and is hidden on the live site.
 */
const PRE_CALL_VIDEO_EMBED_URL = "";
const PROOF_ROOM_URL = "";

const SHOW_PLACEHOLDERS = process.env.NEXT_PUBLIC_VERCEL_ENV
  ? process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
  : process.env.NODE_ENV !== "production";

function Placeholder({ label }: { label: string }) {
  return (
    <div
      style={{
        border: "1.5px dashed rgba(232,168,124,0.7)",
        borderRadius: 8,
        padding: "28px 22px",
        fontFamily: MONO,
        fontSize: 13,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "#E8A87C",
        textAlign: "center",
      }}
    >
      Placeholder: {label}
    </div>
  );
}

function BlockHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: SERIF,
        fontWeight: 400,
        fontSize: "clamp(24px,3vw,34px)",
        lineHeight: 1.1,
        letterSpacing: "-0.015em",
        margin: "0 0 12px",
        color: "#F3F6FF",
      }}
    >
      {children}
    </h2>
  );
}

export default function CallBookedPage() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackMetaEvent("Schedule", { content_name: "Product Strategy Call" });
  }, []);

  const showVideo = Boolean(PRE_CALL_VIDEO_EMBED_URL) || SHOW_PLACEHOLDERS;
  const showProof = Boolean(PROOF_ROOM_URL) || SHOW_PLACEHOLDERS;

  return (
    <PageShell>
      <SiteNav />

      <section style={{ padding: "clamp(72px,10vw,130px) 24px clamp(56px,7vw,96px)" }}>
        <div style={{ ...wrap, maxWidth: 760 }}>
          <Eyebrow size={13} tracking="0.22em" mb={26}>
            Call booked
          </Eyebrow>
          <h1
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: "clamp(40px,6.4vw,76px)",
              lineHeight: 1.02,
              letterSpacing: "-0.022em",
              margin: "0 0 22px",
              color: "#F3F6FF",
              textShadow: "0 0 60px rgba(59,107,255,0.28)",
            }}
          >
            You&rsquo;re booked.
          </h1>
          <p style={bodyText("56ch")}>
            Your strategy call is on the calendar. Check your inbox for the confirmation and
            the Google Meet link. I&rsquo;m looking forward to hearing what you want to build.
          </p>

          {showVideo && (
            <div style={{ marginTop: "clamp(48px,6vw,72px)" }}>
              <BlockHeading>Before we talk</BlockHeading>
              <p style={{ ...bodyText("60ch"), marginBottom: 22 }}>
                Watch this short video first. It covers how the 100-Day Build works, so we can
                skip the basics and spend our 30 minutes on your build.
              </p>
              {PRE_CALL_VIDEO_EMBED_URL ? (
                <div
                  style={{
                    position: "relative",
                    paddingTop: "56.25%",
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid rgba(124,150,232,0.3)",
                  }}
                >
                  <iframe
                    src={PRE_CALL_VIDEO_EMBED_URL}
                    title="Before your strategy call"
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                    allowFullScreen
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                  />
                </div>
              ) : (
                <Placeholder label="pre-call video" />
              )}
            </div>
          )}

          {showProof && (
            <div style={{ marginTop: "clamp(48px,6vw,72px)" }}>
              <BlockHeading>See what we&rsquo;ve built</BlockHeading>
              <p style={{ ...bodyText("60ch"), marginBottom: 22 }}>
                Browse real builds and client results in the proof room before our call.
              </p>
              {PROOF_ROOM_URL ? (
                <GhostLink href={PROOF_ROOM_URL} mt="0">
                  Open the proof room
                </GhostLink>
              ) : (
                <Placeholder label="proof room link" />
              )}
            </div>
          )}

          <p
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: "0.05em",
              color: "#8C96B8",
              margin: "clamp(48px,6vw,72px) 0 0",
            }}
          >
            Need to reschedule? Use the link in your confirmation email.
          </p>
          <GhostLink href={ROUTES.home} mt="20px">
            Back to the 100-Day Build
          </GhostLink>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
