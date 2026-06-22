/**
 * Editable quiz content (PRD §6.2, §6.7).
 *
 * This is the content spec for the five-phase discovery flow. Per §6.7 the
 * team must be able to iterate on questions / options / helper copy WITHOUT a
 * code change. For v1 this lives in a single typed config object the team can
 * edit directly (no CMS). Keep option `id`s stable — they are persisted and
 * fed to the AI; only edit `label` / `question` / `helper` copy freely.
 *
 * The landing-screen and CTA copy also live here so they can be tuned in one
 * place alongside the Messaging Foundation voice.
 */

export interface SelectOption {
  id: string;
  label: string;
}

export type PhaseInput =
  | { kind: "text"; placeholder: string }
  | { kind: "multi"; max: number; options: SelectOption[] }
  | {
      kind: "dual-single";
      groups: { key: "shape" | "stage"; prompt: string; options: SelectOption[] }[];
    };

export interface Phase {
  /** Persisted answer key (maps to QuizAnswers / DB columns). */
  key: "expertise" | "audience" | "transformation" | "vision" | "shape";
  /** Technical mono eyebrow, e.g. "PHASE 01 · FOUNDATION". */
  tag: string;
  question: string;
  helper?: string;
  input: PhaseInput;
}

export const landing = {
  eyebrow: "THE OFFER BLUEPRINT",
  headline: "The offer is already in your expertise. Let's draw it out.",
  subhead:
    "Answer five short questions and we'll architect 2–3 offers built from what you already know — the transformation, the audience, the shape. Not a format pulled off a shelf. Yours.",
  cta: "Start the build",
  reassurance: "Five questions · about two minutes · free",
} as const;

export const phases: Phase[] = [
  {
    key: "expertise",
    tag: "PHASE 01 · FOUNDATION",
    question: "What do people keep coming to you for?",
    helper: "The thing people ask you about, again and again. Plain words are fine.",
    input: {
      kind: "text",
      placeholder: "e.g. Helping founders tell the story behind their company…",
    },
  },
  {
    key: "audience",
    tag: "PHASE 02 · THE PEOPLE",
    question: "Who do you most want to help?",
    helper: "Picture one real person. Who are they, and where are they stuck?",
    input: {
      kind: "text",
      placeholder: "e.g. Early-stage founders who can build but can't articulate it…",
    },
  },
  {
    key: "transformation",
    tag: "PHASE 03 · THE TRANSFORMATION",
    question: "Paint the after.",
    helper: "Where are they before they work with you — and where do they land after?",
    input: {
      kind: "text",
      placeholder: "e.g. From invisible and overlooked → to confidently pitching and getting funded…",
    },
  },
  {
    key: "vision",
    tag: "PHASE 04 · YOUR VISION",
    question: "What does success look like for you?",
    helper: "Pick up to two. This shapes the kind of offer we draw.",
    input: {
      kind: "multi",
      max: 2,
      options: [
        { id: "freedom", label: "Freedom / time" },
        { id: "reach", label: "Reach / many" },
        { id: "recurring", label: "Recurring revenue" },
        { id: "authority", label: "Authority / legacy" },
        { id: "out-of-1to1", label: "Get out of the 1:1 trap" },
      ],
    },
  },
  {
    key: "shape",
    tag: "PHASE 05 · THE SHAPE",
    question: "How do you want to show up?",
    helper: "There's no wrong answer here — it just changes the body the offer gets poured into.",
    input: {
      kind: "dual-single",
      groups: [
        {
          key: "shape",
          prompt: "How do you want to show up?",
          options: [
            { id: "teach-many", label: "Teach many" },
            { id: "lead-group", label: "Lead a group" },
            { id: "go-deep", label: "Go deep with a few" },
            { id: "build-world", label: "Build a world" },
            { id: "not-sure", label: "Not sure" },
          ],
        },
        {
          key: "stage",
          prompt: "Where are you starting from?",
          options: [
            { id: "idea", label: "Just an idea" },
            { id: "audience-no-offer", label: "Audience, no offer" },
            { id: "offer-not-landing", label: "Offer not landing" },
            { id: "ready-to-scale", label: "Established, ready to scale" },
          ],
        },
      ],
    },
  },
];

export const gate = {
  tag: "FINAL STEP · UNLOCK",
  headline: "Where should we send your Offer Blueprint?",
  subhead:
    "We'll generate your offers on the next screen and email you a copy — plus an invite to walk through it together.",
  consentLabel:
    "I agree to receive my Offer Blueprint and occasional emails from The Expand Lab. I can unsubscribe anytime.",
  cta: "Generate my Offer Blueprint",
  generating: "Architecting your offers…",
} as const;

export const results = {
  ctaTag: "NEXT PHASE",
  ctaHeadline: "Want to pressure-test this together?",
  ctaSubhead:
    "Book a working call with The Expand Lab. We'll take the strongest of these and map the path to building it.",
  ctaButton: "Book a call with Expand Lab",
  startOver: "Start over",
} as const;

/** Human-readable labels for persisted vision/shape/stage option ids. */
export function visionLabel(id: string): string {
  const all = (phases.find((p) => p.key === "vision")?.input as { options: SelectOption[] } | undefined)?.options ?? [];
  return all.find((o) => o.id === id)?.label ?? id;
}

export function shapeLabel(id: string): string {
  const groups = (phases.find((p) => p.key === "shape")?.input as { groups: { key: string; options: SelectOption[] }[] }).groups;
  const opts = groups.find((g) => g.key === "shape")?.options ?? [];
  return opts.find((o) => o.id === id)?.label ?? id;
}

export function stageLabel(id: string): string {
  const groups = (phases.find((p) => p.key === "shape")?.input as { groups: { key: string; options: SelectOption[] }[] }).groups;
  const opts = groups.find((g) => g.key === "stage")?.options ?? [];
  return opts.find((o) => o.id === id)?.label ?? id;
}
