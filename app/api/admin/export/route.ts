import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";
import { listSubmissions } from "@/lib/submissions";
import { visionLabel, shapeLabel, stageLabel } from "@/lib/quiz-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Auth-gated CSV export of all submissions (PRD §6.7). */
export async function GET(): Promise<NextResponse> {
  const supabase = getServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await listSubmissions();
  const header = [
    "created_at",
    "first_name",
    "last_name",
    "email",
    "phone",
    "consent",
    "consent_at",
    "expertise",
    "audience",
    "transformation",
    "vision",
    "shape",
    "stage",
    "top_offer",
    "email_status",
    "synced_to_crm",
    "booked_call",
    "source",
  ];

  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.created_at,
        r.first_name,
        r.last_name,
        r.email,
        r.phone,
        r.consent,
        r.consent_at,
        r.answer_expertise,
        r.answer_audience,
        r.answer_transformation,
        (r.answer_vision ?? []).map(visionLabel).join(" / "),
        shapeLabel(r.answer_shape),
        stageLabel(r.answer_stage),
        r.generated_offers?.offers?.[0]?.name ?? "",
        r.email_status,
        r.synced_to_crm,
        r.booked_call,
        r.source,
      ]
        .map(csvCell)
        .join(","),
    );
  }

  const csv = lines.join("\n");
  const filename = `offer-blueprint-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
