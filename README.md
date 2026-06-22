# The Offer Blueprint — The Expand Lab

A public, interactive lead-magnet tool. A visitor answers five short questions
that mirror Expand Lab's five-phase discovery methodology, enters their contact
details, and unlocks an AI-generated **Offer Blueprint** — 2–3 personalized
offer concepts, shown on screen and emailed to them with a booking invite. Every
submission is stored securely and surfaced in an admin dashboard.

Built per `PRD_OfferBlueprint.md` (v1.0).

## Stack

- **Next.js 14** (App Router) — front end + server API routes, deploy on **Vercel**
- **Supabase** — Postgres (encrypted at rest) + admin auth
- **Anthropic API** — offer generation, server-side only (`claude-sonnet-4-6`)
- **Resend** — transactional results email
- **GoHighLevel** — CRM / nurture sync
- **Cal.com** — booking link (+ optional webhook → `booked_call`)
- **Tailwind CSS** — warm-paper / blueprint-blue design language

## How it works

```
Landing → 5-phase quiz → email gate → /api/generate ──► Claude (Appendix A prompt)
                                            │                 └─ fallback if it fails
                                            ├─► Resend results email (+ Cal invite)
                                            ├─► GoHighLevel sync (nurture sequence)
                                            └─► Supabase submissions row
Results screen (offers + Book a call) → admin dashboard (/admin)
```

Every integration **degrades gracefully**: if a key is missing that piece is
skipped (and logged) rather than crashing — the lead always gets a result. With
no keys at all, the app still runs end-to-end using the rules-based fallback.

## Key files

| Area | Path |
| --- | --- |
| Public tool (state machine) | `components/OfferBlueprintApp.tsx` |
| Editable quiz content (§6.7) | `lib/quiz-content.ts` |
| Editable system prompt (Appendix A) | `lib/system-prompt.ts` |
| AI generation + JSON validation | `lib/anthropic.ts` |
| Rules-based fallback | `lib/fallback.ts` |
| Generation API route | `app/api/generate/route.ts` |
| Results email | `lib/email.ts` |
| GoHighLevel sync | `lib/ghl.ts` |
| Persistence | `lib/submissions.ts` + `supabase/schema.sql` |
| Admin dashboard | `app/admin/**`, `components/AdminDashboard.tsx` |
| Cal webhook | `app/api/cal-webhook/route.ts` |

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in what you have; blanks are fine to start
npm run dev                  # http://localhost:3000
```

`npm run typecheck` · `npm run lint` · `npm run build`

Deployment, integration setup, and the open decisions still needed from Hannah
are in **[`SETUP.md`](./SETUP.md)**.
