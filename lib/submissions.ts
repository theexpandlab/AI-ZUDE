import type {
  Attribution,
  LeadContact,
  OfferBlueprint,
  QuizAnswers,
  SubmissionRow,
} from "./types";
import { getAdminClient } from "./supabase/admin";
import type { EmailStatus } from "./email";

interface PersistInput {
  contact: LeadContact;
  answers: QuizAnswers;
  blueprint: OfferBlueprint;
  attribution?: Attribution;
  emailStatus: EmailStatus;
  syncedToCrm: boolean;
}

/**
 * Persist a submission to the `submissions` table (PRD §7). Returns the new id,
 * or null if the DB isn't configured / the write fails (never throws into the
 * request path — the lead still gets their results).
 */
export async function persistSubmission(input: PersistInput): Promise<string | null> {
  const admin = getAdminClient();
  if (!admin) {
    console.warn("[submissions] DB not configured — submission not persisted.");
    return null;
  }

  const now = new Date().toISOString();
  const row = {
    first_name: input.contact.firstName.trim(),
    last_name: input.contact.lastName.trim(),
    email: input.contact.email.trim().toLowerCase(),
    phone: input.contact.phone?.trim() || null,
    consent: input.contact.consent === true,
    consent_at: input.contact.consent ? now : null,
    answer_expertise: input.answers.expertise.trim(),
    answer_audience: input.answers.audience.trim(),
    answer_transformation: input.answers.transformation.trim(),
    answer_vision: input.answers.vision,
    answer_shape: input.answers.shape,
    answer_stage: input.answers.stage,
    generated_offers: input.blueprint,
    email_status: input.emailStatus === "sent" ? "sent" : "failed",
    synced_to_crm: input.syncedToCrm,
    booked_call: false,
    source: buildSource(input.attribution),
  };

  const { data, error } = await admin.from("submissions").insert(row).select("id").single();
  if (error) {
    console.error("[submissions] insert failed:", error.message);
    return null;
  }
  return (data as { id: string }).id;
}

function buildSource(a?: Attribution): string | null {
  if (!a) return null;
  const parts: string[] = [];
  if (a.utmSource) parts.push(`utm_source=${a.utmSource}`);
  if (a.utmMedium) parts.push(`utm_medium=${a.utmMedium}`);
  if (a.utmCampaign) parts.push(`utm_campaign=${a.utmCampaign}`);
  if (a.utmTerm) parts.push(`utm_term=${a.utmTerm}`);
  if (a.utmContent) parts.push(`utm_content=${a.utmContent}`);
  if (a.referrer) parts.push(`referrer=${a.referrer}`);
  return parts.length ? parts.join("&") : null;
}

/** List submissions for the admin dashboard, newest first (PRD §6.7). */
export async function listSubmissions(): Promise<SubmissionRow[]> {
  const admin = getAdminClient();
  if (!admin) return [];
  const { data, error } = await admin
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error) {
    console.error("[submissions] list failed:", error.message);
    return [];
  }
  return (data ?? []) as SubmissionRow[];
}

/** Mark a submission's call as booked, matched by email (PRD §7 — Cal webhook). */
export async function markBookedByEmail(email: string): Promise<boolean> {
  const admin = getAdminClient();
  if (!admin) return false;
  const { error } = await admin
    .from("submissions")
    .update({ booked_call: true })
    .eq("email", email.trim().toLowerCase());
  if (error) {
    console.error("[submissions] markBooked failed:", error.message);
    return false;
  }
  return true;
}
