import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Meta Conversions API relay (server half of components/MetaPixel.tsx).
 *
 * The browser posts each event here with the same event_id it gave fbq(), and
 * this route forwards it to Meta server-side, adding the visitor's IP, user
 * agent and the _fbp/_fbc cookies so Meta can match it. Meta deduplicates the
 * browser and server copies on event_name + event_id.
 *
 * Env (Vercel → Settings → Environment Variables):
 *   NEXT_PUBLIC_META_PIXEL_ID   Pixel / dataset ID (also used by the browser)
 *   META_CAPI_ACCESS_TOKEN      Conversions API token from Events Manager. Server-only.
 *   META_TEST_EVENT_CODE        Optional. Set while using Test Events, then remove.
 *   META_GRAPH_API_VERSION      Optional. Defaults to v22.0.
 *
 * Without the pixel ID or token this route does nothing and returns 204, so
 * the site keeps working while tracking is being set up.
 */

const ALLOWED_EVENTS = new Set(["PageView", "Schedule"]);

// Only accept events reported from our own pages.
const ALLOWED_HOSTS = new Set([
  "build.theexpandlab.com",
  "ai-zude.vercel.app",
  "ai-zude-expandlab.vercel.app",
  "localhost",
]);

function clientIp(req: NextRequest): string | undefined {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || undefined;
  return req.headers.get("x-real-ip") || undefined;
}

/** Build _fbc from an fbclid in the landing URL when the cookie isn't set yet. */
function fbcFromUrl(url: URL): string | undefined {
  const fbclid = url.searchParams.get("fbclid");
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) {
    return new NextResponse(null, { status: 204 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName: unknown = body?.event_name;
  const eventId: unknown = body?.event_id;
  const sourceUrl: unknown = body?.event_source_url;

  if (typeof eventName !== "string" || !ALLOWED_EVENTS.has(eventName)) {
    return NextResponse.json({ error: "Unsupported event" }, { status: 400 });
  }
  if (typeof eventId !== "string" || eventId.length > 200) {
    return NextResponse.json({ error: "Invalid event_id" }, { status: 400 });
  }
  let url: URL;
  try {
    url = new URL(String(sourceUrl));
  } catch {
    return NextResponse.json({ error: "Invalid event_source_url" }, { status: 400 });
  }
  if (!ALLOWED_HOSTS.has(url.hostname) && !url.hostname.endsWith("-expandlab.vercel.app")) {
    return NextResponse.json({ error: "Unknown source" }, { status: 400 });
  }

  const userData: Record<string, string> = {};
  const ip = clientIp(req);
  const ua = req.headers.get("user-agent");
  const fbp = req.cookies.get("_fbp")?.value;
  const fbc = req.cookies.get("_fbc")?.value || fbcFromUrl(url);
  if (ip) userData.client_ip_address = ip;
  if (ua) userData.client_user_agent = ua;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const customData =
    body?.custom_data && typeof body.custom_data === "object" && !Array.isArray(body.custom_data)
      ? body.custom_data
      : undefined;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: url.toString(),
        action_source: "website",
        user_data: userData,
        ...(customData ? { custom_data: customData } : {}),
      },
    ],
  };
  const testCode = process.env.META_TEST_EVENT_CODE;
  if (testCode) payload.test_event_code = testCode;

  const version = process.env.META_GRAPH_API_VERSION || "v22.0";
  try {
    const res = await fetch(
      `https://graph.facebook.com/${version}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[meta-capi] Meta rejected event", eventName, res.status, detail.slice(0, 500));
      return NextResponse.json({ ok: false }, { status: 502 });
    }
  } catch (err) {
    console.error("[meta-capi] request failed", err);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
