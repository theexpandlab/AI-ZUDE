# Meta Ads Playbook — defaults & decisions

Read this to turn a plain-language request ("run ads for my lead magnet",
"promote a client's webinar") into a correct campaign brief. These are sensible
defaults, not rules — override per situation.

## 1. Pick the objective

| Goal | Objective | Optimization goal |
| --- | --- | --- |
| Send cold traffic to a landing page / lead magnet | `OUTCOME_TRAFFIC` | `LANDING_PAGE_VIEWS` (falls back to `LINK_CLICKS` if no pixel) |
| Capture leads with an on-Meta Instant Form | `OUTCOME_LEADS` | `LEAD_GENERATION` |
| Optimize for site conversions (pixel has ≥ ~50 events/wk) | `OUTCOME_LEADS` or `OUTCOME_SALES` | `OFFSITE_CONVERSIONS` |
| Grow reach / video views / page engagement | `OUTCOME_ENGAGEMENT` or `OUTCOME_AWARENESS` | per sub-goal |

For **the Offer Blueprint funnel** and most **early client campaigns**, start
with `OUTCOME_TRAFFIC` + `LANDING_PAGE_VIEWS` driving to the landing page. Move
to `OFFSITE_CONVERSIONS` only after the pixel has learned (roughly 50
conversions/week).

## 2. Budget

- Budgets are set in the ad account's **minor units** (US cents): `2000` = $20/day.
- Sensible test floor: **$15–$30/day per ad set** for 5–7 days before judging.
- Use `daily_budget` for open-ended tests. Use `lifetime_budget` only for a
  fixed-window promo (webinar, launch) — it **requires** `start_time` + `end_time`.
- Leave `bid_strategy` at `LOWEST_COST_WITHOUT_CAP` unless the client has a hard
  target CPA and enough data to justify a cap.

## 3. Targeting

- **Cold traffic default:** one country (or a tight geo), age band that fits the
  ICP, all genders unless the offer is gender-specific, `publisher_platforms`
  = `["facebook", "instagram"]`, and **broad**. Meta's delivery is smart —
  over-narrow interest stacks usually hurt. 1–3 relevant interests max to start.
- **Interest ids are real Meta ids**, not names. The ids in the example brief
  are placeholders — verify them with the Targeting Search API / Audience
  tools, or drop `flexible_spec` entirely and let Meta run broad.
- **Retargeting / lookalikes:** reference an existing Custom/Lookalike Audience
  id in `targeting.custom_audiences`. Build those audiences in Ads Manager
  first; this skill doesn't create them.
- **Special ad categories:** if the client is in housing, employment, credit,
  finance, or politics, set `campaign.special_ad_categories` — targeting is
  legally restricted and Meta will reject the campaign otherwise.

## 4. Creative

- Ship **2–4 creative variations per ad set** so Meta can optimize. Vary the
  hook/angle, not just the image.
- **Primary text:** lead with the hook in the first line (it's what shows before
  "…more"). Speak to the one pain or desire, then the mechanism, then the CTA.
- **Headline:** short, benefit-forward.
- **Images** must be a **publicly reachable URL** (`image_url`) — a hosted Canva
  export, a CDN link, an image already on the site. The script attaches it via
  the creative's `picture` field, so no upload step is needed. Square (1080×1080)
  and vertical (1080×1350 / 1080×1920 for Stories/Reels) perform best.
- Match the ad's promise to the landing page. For the Offer Blueprint, the hook
  is the "offer hiding in your expertise" idea — keep the ad consistent with it.
- Follow Meta's rules: minimal text on the image, no "you/your" health/finance
  claims that imply personal attributes, no before/after body claims.

## 5. UTMs & attribution

Always put UTM params on `destination_url` so leads are attributable. For the
Offer Blueprint the app already reads `utm_*`/referrer into the `source` field
(PRD §7). Pattern:

    ?utm_source=meta&utm_medium=paid_social&utm_campaign=<campaign>&utm_content=<ad_angle>

## 6. Naming convention

Keep names scannable in Ads Manager:

- Campaign: `<Offer> — <Audience type> — <YYYY-MM>` (e.g. `Offer Blueprint — Cold — 2026-07`)
- Ad set:   `<Geo> · <Age> · <Audience> · <Optimization>`
- Ad:       `<Angle/Hook> — <format>`

## 7. Launch safety (non-negotiable)

1. Run `preflight.py` first — confirm the token, ad account, Page, and (if IG)
   the Instagram actor id.
2. Build the brief, then run `create_campaign.py <brief> --dry-run` and read the
   payloads back to the person.
3. Create for real (default) — everything lands **PAUSED**. Give them the Ads
   Manager review link.
4. Only after they confirm, activate (re-run with `--activate`, or flip the
   toggle in Ads Manager). Activation is what starts spend.
