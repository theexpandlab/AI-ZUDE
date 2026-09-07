/**
 * The /method process FAQ, shared between the on-page render (method/page.tsx)
 * and the FAQPage JSON-LD in method/layout.tsx so the structured data matches
 * the visible questions and answers verbatim (AI Search plan §1.5).
 */
export const METHOD_FAQ: { q: string; a: string }[] = [
  {
    q: "How much of my time does this take?",
    a: "Weekly check-ins of 30–60 minutes, feedback on deliverables within 48–72 hours, and the time it takes to record your content. That’s the honest answer.",
  },
  { q: "How fast do you turn things around?", a: "A 48-hour turnaround on anything you send us." },
  {
    q: "How many rounds of revisions?",
    a: "Every deliverable goes through review cycles with you until it’s right. Nothing ships that you haven’t signed off on.",
  },
  { q: "Who owns the IP?", a: "You own what we build. The exact terms are spelled out in your agreement." },
  {
    q: "What if we fall behind?",
    a: "Timelines slip when feedback slows down — that’s the real bottleneck. We flag it early rather than quietly extending.",
  },
  { q: "What if I don’t have my content ready?", a: "Most people don’t. That’s what Phase 01 is for." },
  {
    q: "Do you build my audience?",
    a: "No. We build the product and the system that converts the audience you have. If you’re starting from zero, this isn’t the right time.",
  },
];
