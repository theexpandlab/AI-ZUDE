import type { Offer, OfferBlueprint, QuizAnswers } from "./types";

/**
 * Rules-based fallback (PRD §6.4 / Appendix A).
 *
 * If the model call fails or returns malformed JSON we still hand the lead a
 * real, on-brand Offer Blueprint keyed off the shape they chose — so they
 * never hit a dead end. Grounded in their own words (expertise / audience /
 * transformation) so it doesn't read as generic filler.
 */

function firstClause(text: string, max = 90): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return t.slice(0, max).replace(/[,.;\s]+\S*$/, "") + "…";
}

interface ShapeBlueprint {
  entry: Omit<Offer, "label">;
  signature: Omit<Offer, "label">;
}

function shapeBlueprints(a: QuizAnswers): Record<string, ShapeBlueprint> {
  const who = firstClause(a.audience);
  const change = firstClause(a.transformation, 110);
  const skill = firstClause(a.expertise, 70);

  return {
    "teach-many": {
      entry: {
        name: "The Starter Intensive",
        format: "Live half-day workshop (cohort, recorded)",
        oneLiner: `A focused live session that turns your work on ${skill} into one clear, teachable result.`,
        whoFor: who,
        transformation: change,
        priceBand: "$150–$500",
        whyItFits: "A low-commitment entry that lets many people learn from you at once — your reach goal, without a heavy build.",
      },
      signature: {
        name: "The Signature Course",
        format: "Self-paced course with live onboarding calls",
        oneLiner: `Your method on ${skill}, structured into a product people can move through on their own.`,
        whoFor: who,
        transformation: change,
        priceBand: "$800–$2.5K",
        whyItFits: "Teaches many and earns while you sleep — the scalable shape of your expertise.",
      },
    },
    "lead-group": {
      entry: {
        name: "The Group Sprint",
        format: "4-week live group program",
        oneLiner: `A short, high-energy group container that gets people moving on ${skill} together.`,
        whoFor: who,
        transformation: change,
        priceBand: "$500–$1.5K",
        whyItFits: "An accessible first version of leading a group — proves the model before the bigger build.",
      },
      signature: {
        name: "The Signature Cohort",
        format: "8–12 week cohort with live sessions + community",
        oneLiner: `A premium cohort where you lead a group through your full method on ${skill}.`,
        whoFor: who,
        transformation: change,
        priceBand: "$1.5K–$5K",
        whyItFits: "The fullest expression of leading a group — recurring rounds, real accountability, premium positioning.",
      },
    },
    "go-deep": {
      entry: {
        name: "The Intensive",
        format: "1:1 or 1:few deep-dive day",
        oneLiner: `A concentrated working session that solves one hard problem in ${skill}.`,
        whoFor: who,
        transformation: change,
        priceBand: "$1.5K–$4K",
        whyItFits: "High-touch and high-value — depth without an ongoing commitment.",
      },
      signature: {
        name: "The Private Container",
        format: "3–6 month 1:few advisory",
        oneLiner: `Hands-on guidance for a small handful of people on ${skill}.`,
        whoFor: who,
        transformation: change,
        priceBand: "$5K–$15K",
        whyItFits: "Premium depth with a few — the strongest margins for going deep without the 1:1 trap.",
      },
    },
    "build-world": {
      entry: {
        name: "The Membership",
        format: "Monthly membership + community",
        oneLiner: `An ongoing space where your people gather around ${skill}.`,
        whoFor: who,
        transformation: change,
        priceBand: "$30–$150 / mo",
        whyItFits: "Recurring revenue and a low-friction door into the world you're building.",
      },
      signature: {
        name: "The Ecosystem",
        format: "Tiered membership + flagship program + community",
        oneLiner: `A full ecosystem — entry membership, signature program, and a place to belong — all around ${skill}.`,
        whoFor: who,
        transformation: change,
        priceBand: "$1K–$5K / yr",
        whyItFits: "Builds the world you described: layered offers, recurring revenue, and authority that compounds.",
      },
    },
    "not-sure": {
      entry: {
        name: "The Pilot Workshop",
        format: "Live workshop (small group)",
        oneLiner: `A low-stakes way to test your work on ${skill} with real people, fast.`,
        whoFor: who,
        transformation: change,
        priceBand: "$100–$400",
        whyItFits: "Not sure of the shape yet? This validates demand before you commit to a bigger build.",
      },
      signature: {
        name: "The Signature Program",
        format: "Live group program (cohort)",
        oneLiner: `Once the pilot lands, this is the structured program your method on ${skill} becomes.`,
        whoFor: who,
        transformation: change,
        priceBand: "$800–$2.5K",
        whyItFits: "A flexible signature shape that can lean toward teaching or coaching as you learn what fits.",
      },
    },
  };
}

export function fallbackOffers(answers: QuizAnswers, firstName: string): OfferBlueprint {
  const map = shapeBlueprints(answers);
  const chosen = map[answers.shape] ?? map["not-sure"];

  const offers: Offer[] = [
    { label: "OFFER 01", ...chosen.entry },
    { label: "OFFER 02", ...chosen.signature },
  ];

  const name = firstName?.trim() || "there";
  const read = `${name}, the offer is already in what people keep coming to you for. The expertise is real — the work now is choosing the shape that fits your vision and building it with intention. Here are two ways it could take form.`;

  return { read, offers, source: "fallback" };
}
