import { NextRequest, NextResponse } from "next/server";
import type { GenerateRequest, GenerateResponse } from "@/lib/types";
import { validateGenerateRequest } from "@/lib/validation";
import { rateLimit, pruneRateLimitBuckets } from "@/lib/rate-limit";
import { generateBlueprint } from "@/lib/anthropic";
import { sendResultsEmail } from "@/lib/email";
import { syncLeadToCrm } from "@/lib/ghl";
import { persistSubmission } from "@/lib/submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Rate limit (PRD §6.3, §8) — protect the AI + email budget.
  pruneRateLimitBuckets();
  const { ok: allowed, retryAfterSec } = rateLimit(clientIp(req));
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
    );
  }

  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validation = validateGenerateRequest(body);
  if (!validation.ok) {
    // Honeypot trips here too — respond generically, don't reveal the trap.
    return NextResponse.json({ error: validation.errors[0] || "Invalid submission" }, { status: 400 });
  }

  const { contact, answers, attribution } = body;
  const firstName = contact.firstName.trim();

  // 1) Generate (with built-in fallback so this never throws).
  const { blueprint } = await generateBlueprint(answers, firstName);

  // 2) Side effects in parallel: email + CRM sync. Neither blocks results.
  const [emailStatus, syncedToCrm] = await Promise.all([
    sendResultsEmail(contact.email.trim(), firstName, blueprint),
    syncLeadToCrm({ contact, answers, blueprint, attribution }),
  ]);

  // 3) Persist (best-effort).
  const id = await persistSubmission({
    contact,
    answers,
    blueprint,
    attribution,
    emailStatus,
    syncedToCrm,
  });

  const res: GenerateResponse = { blueprint, persisted: Boolean(id) };
  return NextResponse.json(res, { status: 200 });
}
