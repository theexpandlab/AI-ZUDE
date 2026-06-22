import { NextRequest, NextResponse } from "next/server";
import { env, isConfigured } from "@/lib/env";
import { markBookedByEmail } from "@/lib/submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cal.com webhook (PRD §7, §9) — updates `booked_call` when a lead books.
 * Configure a BOOKING_CREATED webhook in Cal pointing here, with the shared
 * secret in CAL_WEBHOOK_SECRET (sent as the `x-cal-signature` header or a
 * `?secret=` query param). Verifies the secret before acting on the payload.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isConfigured.calWebhook()) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const provided =
    req.headers.get("x-cal-signature") ||
    req.nextUrl.searchParams.get("secret") ||
    "";
  if (provided !== env.calWebhookSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const triggerEvent: string | undefined = payload?.triggerEvent;
  if (triggerEvent && triggerEvent !== "BOOKING_CREATED") {
    return NextResponse.json({ ok: true, ignored: triggerEvent });
  }

  // Cal payloads place the attendee email in a few possible spots.
  const email: string | undefined =
    payload?.payload?.attendees?.[0]?.email ||
    payload?.payload?.responses?.email?.value ||
    payload?.payload?.email;

  if (!email) {
    return NextResponse.json({ ok: false, reason: "no attendee email" }, { status: 200 });
  }

  const updated = await markBookedByEmail(email);
  return NextResponse.json({ ok: true, updated });
}
