import type { LeadContact, OfferBlueprint, QuizAnswers, Attribution } from "./types";
import { env, isConfigured } from "./env";
import { visionLabel, shapeLabel, stageLabel } from "./quiz-content";

/**
 * GoHighLevel CRM sync adapter (PRD §9 — Hannah's system of record).
 *
 * Pushes the lead into GHL so they join the welcome / nurture sequence
 * (workflow triggered by the `offer-blueprint` tag). Built as an adapter:
 * if GHL isn't configured it no-ops and returns false, so the lead is still
 * generated, persisted, and emailed. Never blocks the user-facing flow.
 *
 * Uses the GHL LeadConnector v2 contacts upsert endpoint.
 */

interface SyncInput {
  contact: LeadContact;
  answers: QuizAnswers;
  blueprint: OfferBlueprint;
  attribution?: Attribution;
}

export async function syncLeadToCrm(input: SyncInput): Promise<boolean> {
  if (!isConfigured.crm()) {
    console.warn("[crm] GHL not configured — skipping CRM sync.");
    return false;
  }

  const { contact, answers, blueprint, attribution } = input;

  const customFields = [
    { key: "ob_expertise", field_value: answers.expertise },
    { key: "ob_audience", field_value: answers.audience },
    { key: "ob_transformation", field_value: answers.transformation },
    { key: "ob_vision", field_value: answers.vision.map(visionLabel).join(", ") },
    { key: "ob_shape", field_value: shapeLabel(answers.shape) },
    { key: "ob_stage", field_value: stageLabel(answers.stage) },
    { key: "ob_top_offer", field_value: blueprint.offers[0]?.name ?? "" },
  ];

  const body = {
    locationId: env.ghlLocationId,
    firstName: contact.firstName,
    lastName: contact.lastName,
    name: `${contact.firstName} ${contact.lastName}`.trim(),
    email: contact.email,
    ...(contact.phone ? { phone: contact.phone } : {}),
    source: attribution?.utmSource || "Offer Blueprint",
    tags: ["offer-blueprint", "lead-magnet"],
    customFields,
  };

  try {
    const res = await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.ghlApiKey}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[crm] GHL upsert failed status=${res.status}: ${text.slice(0, 300)}`);
      return false;
    }
    console.info("[crm] lead synced to GHL");
    return true;
  } catch (err) {
    console.error("[crm] GHL sync error:", err instanceof Error ? err.message : err);
    return false;
  }
}
