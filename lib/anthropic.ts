import Anthropic from "@anthropic-ai/sdk";
import type { Offer, OfferBlueprint, QuizAnswers } from "./types";
import { env, isConfigured } from "./env";
import { OFFER_SYSTEM_PROMPT } from "./system-prompt";
import { fallbackOffers } from "./fallback";
import { visionLabel, shapeLabel, stageLabel } from "./quiz-content";

const MAX_TOKENS = 1000;

function buildUserMessage(answers: QuizAnswers, firstName: string): string {
  return [
    `First name: ${firstName}`,
    `Expertise (what people keep coming to them for): ${answers.expertise}`,
    `Audience (who they most want to help): ${answers.audience}`,
    `Transformation (the after): ${answers.transformation}`,
    `Vision: ${answers.vision.map(visionLabel).join(", ")}`,
    `Shape (how they want to show up): ${shapeLabel(answers.shape)}`,
    `Stage (where they're starting): ${stageLabel(answers.stage)}`,
    "",
    "Generate their Offer Blueprint as strict JSON per your instructions.",
  ].join("\n");
}

/** Pull a JSON object out of the model text, tolerating stray prose/fences. */
function extractJson(text: string): unknown {
  const trimmed = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("No JSON object found in model output");
  }
}

function isOffer(o: unknown): o is Offer {
  if (!o || typeof o !== "object") return false;
  const r = o as Record<string, unknown>;
  return (
    typeof r.name === "string" &&
    typeof r.format === "string" &&
    typeof r.oneLiner === "string" &&
    typeof r.whoFor === "string" &&
    typeof r.transformation === "string" &&
    typeof r.priceBand === "string" &&
    typeof r.whyItFits === "string"
  );
}

/** Validate + normalize the parsed model JSON against the Appendix A schema. */
function coerceBlueprint(parsed: unknown): OfferBlueprint {
  if (!parsed || typeof parsed !== "object") throw new Error("Result is not an object");
  const r = parsed as Record<string, unknown>;
  if (typeof r.read !== "string" || r.read.trim().length === 0) {
    throw new Error("Missing read");
  }
  if (!Array.isArray(r.offers) || r.offers.length < 2) {
    throw new Error("Expected 2-3 offers");
  }
  const offers = r.offers.slice(0, 3).map((o, i) => {
    if (!isOffer(o)) throw new Error(`Offer ${i} malformed`);
    return { ...o, label: o.label || `OFFER 0${i + 1}` };
  });
  return { read: r.read, offers, source: "ai" };
}

export interface GenerationResult {
  blueprint: OfferBlueprint;
  latencyMs: number;
  failed: boolean;
}

/**
 * Generate the Offer Blueprint via Claude, falling back to the rules-based
 * set on any failure or malformed JSON (PRD §6.4). Logs latency + failure
 * rate for monitoring.
 */
export async function generateBlueprint(
  answers: QuizAnswers,
  firstName: string,
): Promise<GenerationResult> {
  const started = Date.now();

  if (!isConfigured.ai()) {
    console.warn("[generate] ANTHROPIC_API_KEY not set — using rules-based fallback.");
    return { blueprint: fallbackOffers(answers, firstName), latencyMs: 0, failed: true };
  }

  try {
    const client = new Anthropic({ apiKey: env.anthropicApiKey });
    const msg = await client.messages.create({
      model: env.anthropicModel,
      max_tokens: MAX_TOKENS,
      system: OFFER_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserMessage(answers, firstName) }],
    });

    const text = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const blueprint = coerceBlueprint(extractJson(text));
    const latencyMs = Date.now() - started;
    console.info(`[generate] ok model=${env.anthropicModel} latencyMs=${latencyMs} offers=${blueprint.offers.length}`);
    return { blueprint, latencyMs, failed: false };
  } catch (err) {
    const latencyMs = Date.now() - started;
    console.error(`[generate] failed latencyMs=${latencyMs}:`, err instanceof Error ? err.message : err);
    return { blueprint: fallbackOffers(answers, firstName), latencyMs, failed: true };
  }
}
