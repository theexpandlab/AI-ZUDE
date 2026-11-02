"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Meta Pixel + Conversions API (browser half).
 *
 * Loads the Meta Pixel site-wide and records a PageView on every route change
 * (App Router navigations don't reload the page, so the pixel's own automatic
 * PageView only fires once). Every event is sent twice with the SAME event_id:
 *   1. in the browser through fbq(), and
 *   2. server-side through /api/meta-capi (Conversions API),
 * so Meta deduplicates the pair into one event while still catching visitors
 * whose browsers block the pixel.
 *
 * Does nothing until NEXT_PUBLIC_META_PIXEL_ID is set in Vercel.
 */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type FbqFn = ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };

declare global {
  interface Window {
    fbq?: FbqFn;
  }
}

function newEventId(name: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${name}-${rand}`;
}

function whenFbqReady(cb: (fbq: FbqFn) => void, triesLeft = 50) {
  if (window.fbq) {
    cb(window.fbq);
    return;
  }
  if (triesLeft <= 0) return;
  window.setTimeout(() => whenFbqReady(cb, triesLeft - 1), 100);
}

/**
 * Track a Meta standard event in the browser and mirror it to the
 * Conversions API with a shared event_id for deduplication.
 */
export function trackMetaEvent(eventName: "PageView" | "Schedule", customData?: Record<string, unknown>) {
  if (!META_PIXEL_ID || typeof window === "undefined") return;
  const eventId = newEventId(eventName);

  // The base code loads after hydration, so fbq may not exist yet on the
  // first PageView. Wait briefly for it; if the pixel is blocked it never
  // appears and the Conversions API copy below still records the event.
  whenFbqReady((fbq) => fbq("track", eventName, customData ?? {}, { eventID: eventId }));

  const body = JSON.stringify({
    event_name: eventName,
    event_id: eventId,
    event_source_url: window.location.href,
    custom_data: customData ?? {},
  });
  // keepalive lets the request finish even if the visitor navigates away.
  fetch("/api/meta-capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    /* tracking must never break the page */
  });
}

export function MetaPixel() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!META_PIXEL_ID || !pathname) return;
    // React strict mode runs effects twice in dev; only count each path once.
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;
    trackMetaEvent("PageView");
  }, [pathname]);

  if (!META_PIXEL_ID) return null;

  // Standard Meta base code, minus its automatic PageView (tracked above with
  // an event_id so it can be deduplicated against the Conversions API copy).
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- Meta's no-JS fallback pixel */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
