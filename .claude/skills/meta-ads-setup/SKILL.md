---
name: meta-ads-setup
description: >-
  Set up and launch Meta (Facebook/Instagram) ad campaigns end-to-end — it
  actually creates the Campaign, Ad Set, Ad Creatives, and Ads in a Meta ad
  account via the Marketing API, not just a plan. Use whenever someone wants to
  "set up Meta ads", "run Facebook/Instagram ads", "launch a Meta campaign",
  "promote [a lead magnet / offer / webinar / landing page] on Meta", "boost
  traffic to [a page] with paid social", or asks to create/publish ad campaigns
  in Facebook Ads Manager. Works for both The Expand Lab's own funnel (the Offer
  Blueprint) and client campaigns. Everything is created PAUSED — it never spends
  money until explicitly activated.
---

# Meta Ads Setup

Turn a plain-language request into a live-ready Meta ad campaign. This skill
bundles Python scripts that call the Meta Marketing (Graph) API to create a
real Campaign → Ad Set → Creative(s) → Ad(s) structure in a Meta ad account.

## Safety model — read first

- **Nothing spends money without an explicit, separate activation step.**
  `create_campaign.py` always creates objects **PAUSED**.
- Always **dry-run** and read the plan back to the user before creating.
- Activation (`--activate`) is what starts spend and requires a typed
  confirmation. Never activate on the user's behalf without clear go-ahead.
- Credentials come from environment variables only — never write a token into a
  brief, a commit, or chat.

## Prerequisites

The user needs a Meta Marketing API token and ids (see `.env.example` for the
one-time setup). If `META_ACCESS_TOKEN` isn't set, walk them through
`.env.example`, then stop until they've set it — you can't publish without it.

## Workflow

Run scripts from the skill directory so imports resolve:
`cd` into `.claude/skills/meta-ads-setup` (or use the full path to `scripts/`).

### 1. Preflight — verify access and grab ids
```bash
python3 scripts/preflight.py
```
Confirms the token works and lists the ad accounts, Pages, and Instagram
accounts available. Use the printed ids to fill the brief. If it fails with a
token error, the user must generate a new token before continuing.

### 2. Gather the brief inputs
Ask for whatever you don't already know, guided by `references/playbook.md`:
- **What's being promoted** and the **destination URL** (add UTMs).
- **Objective** (default `OUTCOME_TRAFFIC` + `LANDING_PAGE_VIEWS` for cold
  traffic to a landing page / lead magnet).
- **Budget** (daily, in the account's minor units — cents), and dates if it's a
  fixed-window promo.
- **Audience** — geo, age, and 0–3 interests (verify interest ids, or run
  broad). Set `special_ad_categories` if the client is in a restricted vertical.
- **Creative** — 2–4 variations: primary text, headline, optional description,
  a **public image URL**, and a CTA.

For The Expand Lab's own funnel, start from
`references/examples/offer-blueprint.brief.json`.

### 3. Write the brief
Create a JSON file matching `references/brief.schema.json`. Put it somewhere
scratch (not in the repo). Fill `account.ad_account_id` / `page_id` /
`instagram_actor_id` from preflight (or rely on the env vars).

### 4. Dry-run and confirm
```bash
python3 scripts/create_campaign.py /path/to/brief.json --dry-run
```
Show the user the campaign name, objective, budget, targeting summary, and each
ad's copy. Get their OK.

### 5. Create (PAUSED — safe, no spend)
```bash
python3 scripts/create_campaign.py /path/to/brief.json
```
Report the created ids and give them the Ads Manager review link it prints.

### 6. Activate (only on explicit go-ahead — this spends money)
```bash
python3 scripts/create_campaign.py /path/to/brief.json --activate
```
Or tell them to flip the toggle in Ads Manager themselves. Do **not** activate
unless the user clearly says to launch/go live.

## Reference material
- `references/playbook.md` — how to choose objective, budget, targeting, and
  creative; naming conventions; UTM patterns.
- `references/brief.schema.json` — the exact brief structure and field meanings.
- `references/examples/offer-blueprint.brief.json` — a ready-to-adapt example
  for the Offer Blueprint funnel.

## Scope & limits
- Creates campaigns/ad sets/creatives/ads. It does **not** build Custom or
  Lookalike Audiences, install the pixel, or design creative images — reference
  existing audience ids and hosted image URLs.
- Interest **ids** must be real Meta ids; names alone won't target. When unsure,
  run broad (omit `flexible_spec`) rather than guessing ids.
- One ad set per brief. For multiple audiences, run multiple briefs (or ask and
  the structure can be extended).
