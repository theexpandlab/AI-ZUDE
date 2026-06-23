import type { Offer, OfferBlueprint, QuizAnswers } from "./types";
import { visionLabel, shapeLabel } from "./quiz-content";

/**
 * Rules-based fallback (PRD §6.4) — enriched to match the live AI shape.
 *
 * Used when ANTHROPIC_API_KEY is absent or the model returns malformed JSON, so
 * the lead never hits a dead end. Still pulls their own words (expertise /
 * audience / transformation / shape / stage / vision) and still gives concrete
 * 100-Day Build next moves. Voice: warm, grounded, no em dashes, no hype.
 */

function firstClause(text: string, max = 90): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return t.slice(0, max).replace(/[,.;\s]+\S*$/, "") + "...";
}

/** The per-offer fields that vary by the shape they chose. */
type OfferCore = Pick<Offer, "name" | "promise" | "theShape" | "priceBand" | "marketTruth">;

function shapeOffers(skill: string, who: string): Record<string, [OfferCore, OfferCore]> {
  return {
    "teach-many": [
      {
        name: "The Starter Intensive",
        promise: `Turn your work on ${skill} into one clear, teachable result people can get in an afternoon.`,
        theShape: "A live half day workshop, recorded. It fits teaching many at once without a heavy build.",
        priceBand: "$150 to $500. Priced as an easy yes, because its job is to prove the appetite is there.",
        marketTruth:
          "The quiet fear is spending months building something no one buys. A small paid workshop is proof of demand before you commit.",
      },
      {
        name: "The Signature Course",
        promise: `Your method on ${skill}, structured into a product people move through on their own.`,
        theShape: "A self paced course with live onboarding. It fits teaching many and keeps earning while you sleep.",
        priceBand: "$800 to $2.5K. Priced for the outcome, not the hours, because it scales past your calendar.",
        marketTruth:
          "Their real desire is reach and recurring income. A signature course is the asset that sells without you in the room.",
      },
    ],
    "lead-group": [
      {
        name: "The Group Sprint",
        promise: `Get ${who} moving on ${skill} together in a few focused weeks.`,
        theShape: "A 4 to 6 week live group program. It fits leading a group and proves the model before a bigger build.",
        priceBand: "$500 to $1.5K per seat. Accessible enough to fill the first cohort and learn fast.",
        marketTruth:
          "Buyers want momentum and accountability, not another course to abandon. A live group gives them both.",
      },
      {
        name: "The Signature Cohort",
        promise: `Lead ${who} through your full method on ${skill} in a premium cohort.`,
        theShape: "An 8 to 12 week cohort with live sessions and community. The fullest expression of leading a group.",
        priceBand: "$1.5K to $5K per seat. Priced for transformation, because the outcome scales while your hours do not.",
        marketTruth:
          "Their deeper fear is staying the bottleneck. A cohort is the first proof the business runs beyond their calendar.",
      },
    ],
    "go-deep": [
      {
        name: "The Intensive",
        promise: `Solve one hard problem in ${skill} in a single concentrated session.`,
        theShape: "A 1:1 or 1:few deep dive day. High touch depth without an ongoing commitment.",
        priceBand: "$1.5K to $4K. Priced for the speed of the result, not the length of the engagement.",
        marketTruth: "Buyers who value depth will pay for a fast, decisive outcome over a slow program.",
      },
      {
        name: "The Private Container",
        promise: `Guide a small handful of people through real change in ${skill}.`,
        theShape: "A 3 to 6 month 1:few advisory. Premium depth that gets you out of the 1:1 trap without losing intimacy.",
        priceBand: "$5K to $15K. Priced for access and outcome, the strongest margins for going deep.",
        marketTruth:
          "Their desire is authority and freedom. A small premium container delivers both without filling the calendar.",
      },
    ],
    "build-world": [
      {
        name: "The Membership",
        promise: `Give your people one place to gather and keep growing around ${skill}.`,
        theShape: "A monthly membership and community. A low friction door into the world you are building.",
        priceBand: "$30 to $150 a month. Priced to be an easy ongoing yes that compounds.",
        marketTruth: "Buyers want belonging and steady progress. A membership turns one purchase into a relationship.",
      },
      {
        name: "The Ecosystem",
        promise: `Build a layered world around ${skill}: an entry membership, a signature program, and a place to belong.`,
        theShape: "A tiered membership plus flagship program. The full expression of building a world.",
        priceBand: "$1K to $5K a year across tiers. Priced so each layer feeds the next.",
        marketTruth: "Their vision is authority and legacy. An ecosystem compounds reach and recurring revenue over time.",
      },
    ],
    "not-sure": [
      {
        name: "The Pilot Workshop",
        promise: `Test your work on ${skill} with real people, fast and low stakes.`,
        theShape: "A live workshop with a small group. The quickest way to validate before a bigger build.",
        priceBand: "$100 to $400. Priced as a low risk yes whose job is to surface demand.",
        marketTruth: "The fear is building the wrong thing. A pilot replaces guessing with evidence.",
      },
      {
        name: "The Signature Program",
        promise: `Turn what the pilot proves into a structured program built on your method for ${skill}.`,
        theShape: "A live group program that can lean toward teaching or coaching as you learn what fits.",
        priceBand: "$800 to $2.5K. Priced for the outcome once the demand is clear.",
        marketTruth: "Buyers want a clear path, not a pile of content. A signature program gives them one.",
      },
    ],
  };
}

export function fallbackOffers(answers: QuizAnswers, firstName: string): OfferBlueprint {
  const skill = firstClause(answers.expertise, 70);
  const who = firstClause(answers.audience);
  const visionPhrase = answers.vision.map(visionLabel).join(" and ") || "scale beyond trading time for money";
  const shapeName = shapeLabel(answers.shape);

  const whyThisFitsYou = `You told us people keep coming to you for ${skill}, and that you most want to help ${who}. This offer turns that into one clear shape, built for someone who wants ${visionPhrase}.`;

  const yourFirstMoves = [
    `Write your transformation in one sentence: "I take ${who} from [before] to [after]." If you can say it cleanly, you have an offer.`,
    `Pressure test it with 5 real people who fit ${who}. Watch which words make them lean in.`,
    "Book a build call so we can architect the one offer worth building first, and map your 100 days.",
  ];

  const cores = shapeOffers(skill, who);
  const [entry, signature] = cores[answers.shape] ?? cores["not-sure"];

  const offers: Offer[] = [
    { label: "OFFER 01", ...entry, whyThisFitsYou, yourFirstMoves },
    { label: "OFFER 02", ...signature, whyThisFitsYou, yourFirstMoves },
  ];

  const name = firstName?.trim() || "there";
  const readingYourBlueprint = `${name}, here is what we see in your answers: the expertise is already there, and so is the audience. The work now is not more content, it is choosing the one offer to build first and giving it a shape that fits how you want to show up (${shapeName}). That is exactly what we do.`;

  const nextStep =
    "When one of these makes you lean forward, book a build call and we will architect the one worth shipping first.";

  return { readingYourBlueprint, offers, nextStep, source: "fallback" };
}
