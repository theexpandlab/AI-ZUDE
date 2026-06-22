# Setup & Deployment — The Offer Blueprint

This app is built to run **incrementally**: it works with zero keys (rules-based
fallback, no persistence) and lights up each capability as you add credentials.
Set environment variables in `.env.local` for local dev and in **Vercel →
Project → Settings → Environment Variables** for production. See `.env.example`
for the full list.

> Only `NEXT_PUBLIC_*` variables are exposed to the browser. Everything else —
> the Anthropic key, Supabase service-role key, Resend key, GHL key — stays
> server-side (PRD §8).

---

## ⚠️ Open decisions still needed from Hannah (PRD §13)

These are wired with sensible env-driven defaults so the build isn't blocked,
but each needs a real value before launch. **Nothing is hard-coded** — all live
in env vars / editable config.

| # | Decision | Where it's set | Default used |
| - | --- | --- | --- |
| 1 | **Email/CRM system of record** — confirmed **GoHighLevel** ✅ | `GHL_API_KEY`, `GHL_LOCATION_ID` | sync is skipped until set |
| 2 | **Scheduling tool + URL** — confirmed **Cal.com** ✅ | `NEXT_PUBLIC_CAL_BOOKING_URL` | `cal.com/the-expand-lab` placeholder — **replace with the real link** |
| 3 | **Sender domain** — must verify `theexpandlab.com` (SPF/DKIM/DMARC) in Resend | `EMAIL_FROM` | `hey@theexpandlab.com` — **verify the domain or email won't send** |
| 4 | **Hosting / build owner + Vercel account** | Vercel project | — (process decision) |
| 5 | **Domain/subdomain** for the tool | `NEXT_PUBLIC_SITE_URL` + Vercel domains | `build.theexpandlab.com` |
| 6 | **Privacy policy URL** at the consent step | `NEXT_PUBLIC_PRIVACY_POLICY_URL` | `theexpandlab.com/privacy` — **confirm this resolves** |

Other notes flagged during the build:
- The PRD references `OfferBlueprint.jsx` and `ExpandLab_Messaging_Foundation.md`
  as source-of-truth assets. **They weren't in the repo**, so the UX, copy, and
  design language were authored from the detailed specs in PRD §6.2 / §10 and the
  Expand Lab "blueprint-blue" `#3F77C2`. If you have the original prototype,
  diff the quiz copy in `lib/quiz-content.ts` and the system prompt in
  `lib/system-prompt.ts` against it.
- Rate limiting is **in-memory per instance** (`lib/rate-limit.ts`) — a
  best-effort first line of defence. For a hard global limit add Upstash/Redis
  or a CAPTCHA if abuse appears (PRD §6.3).

---

## 1. Anthropic (offer generation)

1. Create a key at the Anthropic Console.
2. Set `ANTHROPIC_API_KEY`. Optionally override `ANTHROPIC_MODEL`
   (default `claude-sonnet-4-6`, `max_tokens` ~1000).

Without it the app uses the rules-based fallback in `lib/fallback.ts` — the user
never hits a dead end. Generation latency + failure are logged for monitoring.

## 2. Supabase (database + admin auth)

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor. It creates the `submissions`
   table, indexes, an `updated_at` trigger, and **enables RLS with no public
   policies** — so only the service role (trusted server) can read/write.
3. Set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
4. Create admin users in **Auth → Users** (email + password). Anyone you add can
   sign in at `/admin/login`. (Disable public sign-ups in Auth settings.)

## 3. Resend (results email)

1. Verify the sending domain (`theexpandlab.com`) in Resend — SPF/DKIM/DMARC.
   **Until verified, email sends fail** and rows are marked `email_status=failed`.
2. Set `RESEND_API_KEY`, `EMAIL_FROM` (a verified address), optional
   `EMAIL_REPLY_TO`.

## 4. GoHighLevel (CRM + nurture)

1. Create a Private Integration token (or API key) with contacts write scope.
2. Set `GHL_API_KEY` and `GHL_LOCATION_ID` (the sub-account location id).
3. Leads are upserted to `contacts/upsert` and tagged `offer-blueprint` +
   `lead-magnet`. **Build a GHL workflow triggered by the `offer-blueprint`
   tag** to start the welcome/nurture sequence. Discovery answers are written to
   custom fields prefixed `ob_` — create matching custom fields in GHL to see
   them on the contact.

## 5. Cal.com (scheduling)

1. Set `NEXT_PUBLIC_CAL_BOOKING_URL` to Hannah's booking page. It appears on the
   results screen and in the email.
2. *(Optional)* To auto-update `booked_call`: in Cal, add a `BOOKING_CREATED`
   webhook → `https://<your-domain>/api/cal-webhook?secret=<CAL_WEBHOOK_SECRET>`
   and set `CAL_WEBHOOK_SECRET`. The route matches the attendee email to a
   submission.

## 6. Deploy to Vercel

1. Import the repo into Vercel (framework auto-detected as Next.js).
2. Add all env vars from `.env.example` (Production + Preview).
3. Deploy, then point the subdomain (e.g. `build.theexpandlab.com`) at the
   project and update `NEXT_PUBLIC_SITE_URL`.
4. Link it from the Expand Lab site and Instagram bio.

> **Note:** the previous GitHub Pages workflow + static-export config were
> removed — this is now a server app (API routes can't run on static Pages).

## 7. Connect the domain (Wix main site)

The marketing site `theexpandlab.com` is on **Wix**, which can't reverse-proxy an
external app onto a subpath — so a transparent `theexpandlab.com/blueprint` that
serves this Vercel app isn't possible. Use a subdomain (renders full-screen,
native on mobile) plus an optional redirect for a memorable link.

**a) Subdomain `build.theexpandlab.com` → Vercel**
1. Vercel → Project → Settings → **Domains** → add `build.theexpandlab.com`.
   Copy the CNAME target it shows (`cname.vercel-dns.com`).
2. Wix Dashboard → your domain → **Advanced → Edit DNS / DNS Records** →
   **Add Record**:

   | Type | Host name | Value |
   | --- | --- | --- |
   | CNAME | `build` | `cname.vercel-dns.com` |

3. Save. Vercel auto-issues SSL once DNS resolves (minutes, up to ~24h).

**b) Link to it** — add a button on a Wix page (Link → Web Address →
`https://build.theexpandlab.com`) and use the same link in the Instagram bio.
This is the funnel entry.

**c) Optional clean link** — Wix Dashboard →
**Marketing & SEO → SEO Tools → URL Redirect Manager** → 301-redirect
`/blueprint` (or `/start`) → `https://build.theexpandlab.com`. Gives a
memorable `theexpandlab.com/blueprint` (URL changes on redirect; not a proxy).

> Skip the Wix "Embed a Site" (iframe) approach — fixed height + awkward mobile
> scrolling, and traffic is mostly Instagram-on-phone (PRD §10).

After connecting: set `NEXT_PUBLIC_SITE_URL=https://build.theexpandlab.com`, and
if using the Cal webhook, point it at
`https://build.theexpandlab.com/api/cal-webhook?secret=<CAL_WEBHOOK_SECRET>`.

---

## Editing content without a redeploy-heavy change (PRD §6.7)

- **Quiz questions / options / helper copy** → `lib/quiz-content.ts`. Keep option
  `id`s stable (they're persisted + fed to the AI); edit labels/questions freely.
- **System prompt / offer logic** → `lib/system-prompt.ts` (and fallback rules in
  `lib/fallback.ts`).

These are typed config files the team can edit directly. A full no-code CMS was
out of scope for v1 per the PRD; this satisfies "store in a config the team can
edit, not hard-coded."

## Privacy & compliance (PRD §8)

- Consent + timestamp captured (`consent`, `consent_at`); privacy link at the gate.
- PII never placed in URLs or client logs; UTM/referrer captured for attribution.
- **Data-deletion requests:** delete the row(s) by email in Supabase and remove
  the contact in GHL. (A self-serve deletion endpoint can be added later.)
- Document a retention policy and align with GDPR/CCPA before launch.
