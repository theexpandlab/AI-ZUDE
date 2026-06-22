# Product Requirements Document — The Offer Blueprint

**Product:** The Offer Blueprint (interactive lead magnet + admin dashboard)
**Owner:** Hannah Andersen, Founder, The Expand Lab
**Version:** 1.0 (for build hand-off to Claude Code)
**Related assets:** `ExpandLab_Messaging_Foundation.md` (copy + positioning source of truth) · `OfferBlueprint.jsx` (working UX/visual prototype — reference for flow, content, and design language)

> Note for this repo: the two related assets above were not included in the
> repository at build time. The UX/copy/design were authored from the detailed
> specs below (§6.2, §10) and the Expand Lab "blueprint-blue" `#3F77C2`. See
> `SETUP.md` for what to reconcile if the original prototype is available.

## 1. Summary

The Offer Blueprint is a public, interactive lead-magnet tool for The Expand Lab. A visitor answers five short questions that mirror the discovery phases of Expand Lab's five-phase methodology (foundation → people → transformation → vision → shape). At the end they enter their contact details to unlock results. The tool then uses AI — primed with Expand Lab's methodology and voice — to generate 2–3 personalized offer concepts ("their Offer Blueprint"), displays them on screen, and emails them a copy that includes a booking invite to a call. Every submission is stored in a secure database and surfaced in an admin dashboard for Hannah and the team.

It is the top of Expand Lab's funnel: it turns Instagram/organic attention into an owned email list, demonstrates the methodology, and routes qualified leads to a sales conversation.

## 2. Goals & success metrics

| Goal | Metric | Target (initial) |
| --- | --- | --- |
| Capture qualified leads | Email capture rate (started → email submitted) | ≥ 35% |
| Hold attention | Quiz completion rate (started → results) | ≥ 50% |
| Drive conversations | Call-booking rate (results → Cal booking) | ≥ 8% |
| Build the list safely | 100% of leads stored encrypted + synced to email platform | 100% |
| On-brand experience | Qualitative: results read as Expand Lab, not generic | n/a |

## 3. Users & personas

- **The front-door prospect (primary):** Earlier-stage — wants to build something but is "not sure where to start," may not call themselves an expert. Needs clarity on what to sell.
- **The established expert (secondary):** CEO, founder, coach, or consultant with proof and revenue, exploring how to productize. Higher-value lead.
- **Admin (Hannah + Expand Lab team):** Needs to view, search, and export captured leads and their generated blueprints, and see who has booked a call.

## 4. End-to-end user flow

1. Landing → hero + "Start the build" CTA.
2. Vision discovery → 5 phases (see 6.2). Progress shown.
3. Email gate → collect name, email, phone (optional) + consent. Results are gated behind this step.
4. Generation → server calls the AI model with the answers; loading state shown.
5. Results on screen → the personalized Offer Blueprint (2–3 offers) + "Book a call" CTA.
6. Results email → same blueprint emailed to the lead, containing a Cal booking link/invite.
7. Persistence → submission saved to the database and synced to the email platform/CRM.
8. Admin → lead appears in the dashboard.

## 5. Functional requirements

### 6.1 Landing screen
- Hero headline, subhead, and primary CTA ("Start the build"). Copy per Messaging Foundation; default from prototype.
- No login required for the public tool.
- Mobile-first responsive.

### 6.2 Vision discovery quiz
Five phases. Free-text inputs require ≥ 3 characters; selection inputs require a choice before advancing. Show a progress indicator and allow Back.

| # | Phase label | Question | Input |
| - | --- | --- | --- |
| 1 | PHASE 01 · FOUNDATION | "What do people keep coming to you for?" | Free text |
| 2 | PHASE 02 · THE PEOPLE | "Who do you most want to help?" | Free text |
| 3 | PHASE 03 · THE TRANSFORMATION | "Paint the after." (before → after) | Free text |
| 4 | PHASE 04 · YOUR VISION | "What does success look like for you?" | Multi-select, max 2: Freedom/time · Reach/many · Recurring revenue · Authority/legacy · Get out of the 1:1 trap |
| 5 | PHASE 05 · THE SHAPE | "How do you want to show up?" + "Where are you starting from?" | Single-select each. Shape: Teach many · Lead a group · Go deep with a few · Build a world · Not sure. Stage: Just an idea · Audience no offer · Offer not landing · Established, ready to scale |

Content must be editable by an admin without a code change — see 6.7.

### 6.3 Email capture gate
- Fields: First name (required), Last name (required), Email (required, validated), Phone (optional).
- Explicit consent checkbox / privacy notice (store consent + timestamp).
- Spam protection: honeypot field + basic rate limiting. Add a lightweight CAPTCHA only if abuse appears.
- The "generate" action is disabled until required fields are valid.

### 6.4 AI offer generation
- Runs server-side (never expose the AI API key in the browser).
- Model: a current Claude model (e.g., `claude-sonnet-4-6`), `max_tokens` ~1000.
- System prompt: Expand Lab methodology + voice (full text in Appendix A).
- Input: the five answers + the lead's first name.
- Output: strict JSON — a short personalized read plus an array of 2–3 offers, each with label, name, format, oneLiner, whoFor, transformation, priceBand, whyItFits (schema in Appendix A).
- Fallback: if the model call fails or returns malformed JSON, generate a rules-based set of offers from the "shape" answer so the user never hits a dead end.
- Log generation latency and failure rate for monitoring.

### 6.5 Results screen
- Header with personalized read paragraph (addresses the lead by first name).
- 2–3 offer cards, each rendered as a spec sheet: format, who it's for, the transformation, investment range, and "why this fits your vision."
- A "Next phase" CTA panel → "Book a call with Expand Lab" → Cal booking link.
- "Start over" option.

### 6.6 Results email + Cal invite
- Triggered automatically once results are generated.
- Sent to the captured email; from an Expand Lab sender (e.g., `hey@theexpandlab.com`), verified domain (SPF/DKIM/DMARC).
- Contents: greeting by first name, the personalized read, the 2–3 offers (clean HTML), Expand Lab branding, and a Cal booking invite (button + link to Hannah's Cal scheduling page).
- The same lead should also enter Expand Lab's nurture sequence (see Integrations).
- Deliverability: send via a reputable transactional/email service; never from an unverified domain.

### 6.7 Admin dashboard
- Authenticated area (Hannah + team only).
- Lists all submissions, newest first: name, email, phone, timestamp, the five answers, the generated offers, consent status, and booking status.
- Search/filter by name, email, date, stage, vision.
- Export to CSV.
- Editable quiz content and editable system prompt / offer logic, so the team can iterate without redeploying. (If full CMS editing is out of scope for v1, store this content in a config the team can edit, not hard-coded.)

## 7. Data model (initial)

Table: `submissions`

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid (PK) | |
| created_at | timestamptz | |
| first_name | text | |
| last_name | text | |
| email | text | indexed |
| phone | text, nullable | |
| consent | boolean | + consent_at timestamptz |
| answer_expertise | text | |
| answer_audience | text | |
| answer_transformation | text | |
| answer_vision | text[] | |
| answer_shape | text | |
| answer_stage | text | |
| generated_offers | jsonb | the AI result (read + offers) |
| email_status | text | queued / sent / failed |
| synced_to_crm | boolean | |
| booked_call | boolean | updated via Cal webhook if available |
| source | text | utm/referrer for attribution |

## 8. Security & privacy ("the safe place")
- Storage: a managed database with encryption at rest; all traffic over HTTPS/TLS.
- Secrets: all API keys (AI, email, Cal) live in server-side environment variables — never in client code or the repo.
- Access: admin dashboard behind authentication; least-privilege access for the team.
- PII hygiene: never place name/email/phone in URLs, query strings, or client-side logs.
- Consent: capture explicit consent + timestamp; link to a privacy policy at the gate.
- Compliance basics: support data-deletion requests; document a retention policy; align with GDPR/CCPA as applicable.
- Abuse protection: honeypot + rate limiting to protect the email-send budget and data integrity.

## 9. Integrations
- **AI:** Anthropic API (server-side route).
- **Email — two jobs:** (a) transactional results email (Resend), and (b) list + nurture — push the lead into the marketing platform (**GoHighLevel**, confirmed) so they join the welcome sequence.
- **Scheduling:** **Cal.com** booking link in the email and on the results screen. Optionally consume its webhook to update `booked_call`.
- **Attribution:** capture UTM/referrer to measure which channels drive leads and bookings.

## 10. Non-functional requirements
- **Performance:** generation result within a few seconds; show a calm loading state.
- **Accessibility:** keyboard navigable, visible focus states, respects reduced-motion, sufficient contrast.
- **Responsive:** mobile-first (most traffic arrives from Instagram on phones).
- **Branding:** warm paper background, ink text, single deep "blueprint-blue" accent (`#3F77C2`), technical mono labels, confident sans headings. Architect, not hype.

## 11. Tech stack
- **App:** Next.js (App Router) — frontend + server API routes. Host on Vercel.
- **Database + auth:** Supabase (managed Postgres; encryption at rest; RLS; built-in auth).
- **AI:** Anthropic API called from a Next.js server route (key in env).
- **Transactional email:** Resend; sync the lead to GoHighLevel via API.
- **Scheduling:** Cal.com embed/link.
- **Deployment:** Vercel, with secrets in environment variables.
- **Placement:** standalone app at a subdomain (e.g., `build.theexpandlab.com`).

## 12. Out of scope (v1) / future
- A quiz-result score or typology beyond the generated offers.
- A/B testing of questions.
- The downstream "done-with-you" purchase flow.
- Turning the experience into the future education product.

## 13. Open decisions needed from Hannah
1. Email/CRM system of record → **GoHighLevel** (confirmed).
2. Scheduling tool + URL → **Cal.com** (confirmed); provide the booking link.
3. Sender domain: confirm `theexpandlab.com` is set up for sending (SPF/DKIM/DMARC).
4. Hosting/build owner + Vercel account.
5. Domain/subdomain for the tool (e.g., `build.theexpandlab.com`).
6. Privacy policy URL to link at the consent step.

## Appendix A — Expand Lab offer-generation system prompt

See `lib/system-prompt.ts` for the live, editable copy. The model returns ONLY
valid JSON:

```json
{
  "read": "2-3 sentences, second person, address them by first name, reflecting back the offer hiding in their expertise.",
  "offers": [
    { "label": "OFFER 01", "name": "...", "format": "...", "oneLiner": "...", "whoFor": "...", "transformation": "from X to Y", "priceBand": "$1.5K–$3K", "whyItFits": "ties to their stated vision" }
  ]
}
```

Generate 2 or 3 offers. At least one matches the chosen shape; all genuinely
distinct and grounded in the person's actual expertise, audience, and
transformation. On failure/malformed JSON, return the rules-based fallback keyed
off shape (`lib/fallback.ts`).
