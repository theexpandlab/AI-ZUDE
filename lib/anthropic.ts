import Anthropic from "@anthropic-ai/sdk";
import type { Offer, OfferBlueprint, QuizAnswers } from "./types";
import { env, isConfigured } from "./env";
import { buildOfferSystemPrompt } from "./system-prompt";
import { fallbackOffers } from "./fallback";

// Enriched output (8 fields x up to 3 offers + 2 top-level) needs more room
// than the original lean schema, so the result isn't truncated into a fallback.
const MAX_TOKENS = 2000;

function buildUserMessage(firstName: string): string {
  const name = firstName?.trim() || "the founder";
  return `Their first name is ${name}. Generate their Offer Blueprint now and return only the JSON.`;
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

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Normalize one offer from the model's snake_case JSON into our Offer type. */
function coerceOffer(o: unknown, index: number): Offer {
  if (!o || typeof o !== "object") throw new Error(`Offer ${index} is not an object`);
  const r = o as Record<string, unknown>;

  const name = asString(r.name);
  const promise = asString(r.promise);
  const whyThisFitsYou = asString(r.why_this_fits_you);
  const theShape = asString(r.the_shape);
  const priceBand = asString(r.price_band);
  const marketTruth = asString(r.market_truth);
  const moves = Array.isArray(r.your_first_moves)
    ? (r.your_first_moves as unknown[]).map(asString).filter(Boolean)
    : [];

  if (!name || !promise || !whyThisFitsYou || !theShape || !priceBand || !marketTruth) {
    throw new Error(`Offer ${index} missing required fields`);
  }
  if (moves.length < 1) throw new Error(`Offer ${index} missing first moves`);

  return {
    label: asString(r.label) || `OFFER 0${index + 1}`,
    name,
    promise,
    whyThisFitsYou,
    theShape,
    priceBand,
    marketTruth,
    yourFirstMoves: moves.slice(0, 3),
  };
}

/** Validate + normalize the parsed model JSON into an OfferBlueprint. */
function coerceBlueprint(parsed: unknown): OfferBlueprint {
  if (!parsed || typeof parsed !== "object") throw new Error("Result is not an object");
  const r = parsed as Record<string, unknown>;

  const readingYourBlueprint = asString(r.reading_your_blueprint);
  if (!readingYourBlueprint) throw new Error("Missing reading_your_blueprint");
  if (!Array.isArray(r.offers) || r.offers.length < 2) throw new Error("Expected 2-3 offers");

  const offers = r.offers.slice(0, 3).map((o, i) => coerceOffer(o, i));
  const nextStep =
    asString(r.next_step) ||
    "When one of these makes you lean forward, book a build call and we will architect the one worth shipping first.";

  return { readingYourBlueprint, offers, nextStep, source: "ai" };
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
      system: buildOfferSystemPrompt(answers),
      messages: [{ role: "user", content: buildUserMessage(firstName) }],
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
