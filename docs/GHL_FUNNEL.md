# GoHighLevel Funnel — Build Runbook

How to set up the GHL side of The Offer Blueprint so leads captured by the tool
flow into a nurture sequence that drives call bookings.

**Division of labor:** the app already pushes each lead into GHL (tagged, with
custom fields). Your job in GHL is three things — (1) create the custom fields,
(2) build a tag-triggered workflow, (3) drop in the nurture emails below. The
results email (the blueprint + booking link) is sent instantly by Resend, so
GHL's job is the *ongoing* nurture toward booking the call.

> Credentials live in **Vercel → Settings → Environment Variables** only:
> `GHL_API_KEY` (Private Integration token, contacts read/write) and
> `GHL_LOCATION_ID` (your sub-account id). Never in the repo or chat.

---

## What the app sends to GHL

On every submission the app upserts the contact (`contacts/upsert`) with:

- **Standard fields:** first name, last name, email, phone (if given), source
- **Tags:** `offer-blueprint`, `lead-magnet`
- **Custom fields** (key → value):

  | Field key | Holds |
  | --- | --- |
  | `ob_expertise` | "What people keep coming to you for" |
  | `ob_audience` | "Who you most want to help" |
  | `ob_transformation` | The before → after |
  | `ob_vision` | Vision selections (comma-joined) |
  | `ob_shape` | How they want to show up |
  | `ob_stage` | Where they're starting from |
  | `ob_top_offer` | Name of their #1 generated offer |

---

## Step 1 — Create the custom fields

GHL Dashboard → **Settings → Custom Fields → Add Field** (object: Contact). Create
all seven as **Single Line / Multi Line Text**:

| Field name | Unique key (must match) |
| --- | --- |
| OB Expertise | `ob_expertise` |
| OB Audience | `ob_audience` |
| OB Transformation | `ob_transformation` |
| OB Vision | `ob_vision` |
| OB Shape | `ob_shape` |
| OB Stage | `ob_stage` |
| OB Top Offer | `ob_top_offer` |

> **Important:** GHL generates a "unique key" when you name a field. It must match
> the keys above exactly (no `contact.` prefix). If GHL won't let you set the key
> to those values, just create the fields and send me the keys (or field IDs) GHL
> assigned — I'll switch the code in `lib/ghl.ts` to use them, so the answers land
> on the contact correctly. Without this, leads still sync; the discovery answers
> just won't populate.

## Step 2 — Build the workflow

GHL → **Automation → Workflows → + Create Workflow → Start from scratch**.

1. **Trigger:** `Contact Tag` → *Tag added* is `offer-blueprint`.
2. **(Recommended) Goal / exit:** add a second trigger or a Workflow Goal on tag
   `booked-call` so anyone who books drops out of the sequence (see Step 4).
3. Add the email actions below with **Wait** steps between them.
4. Set the workflow to **Publish** (toggle on) when ready, and under Settings set
   **Re-entry** off and a sensible sending window (e.g. 8am–6pm contact time).

## Step 3 — The nurture sequence (paste-ready)

Voice: assured not arrogant, direct but warm, architect not hype. No "6-figures
in 7 days," no fake urgency. Replace `[Cal link]` with
`https://cal.com/expandlab/10k-business-foundation` (or use a button). Sign from
Hannah.

---

### Email 1 — Day 1 · The offer was always there
**Subject:** The offer was hiding in plain sight
**Preview:** It was never a format problem.

Hi {{contact.first_name}},

Yesterday you built your Offer Blueprint — and if it landed, it's because the
offer was already there. It always is. Most experts don't have an idea problem;
they have a *shape* problem. They jump straight to "should it be a course or a
membership?" before they've named the actual transformation they create.

At The Expand Lab we build the offer first — the audience, the outcome, the
promise — and *then* choose the format to fit it. That's the whole difference
between something that sells and something that sits.

Sit with your blueprint today. Which of those offers made you go "…huh, yeah"?

— Hannah

---

### Email 2 — Day 2 · The mistake almost everyone makes
**Subject:** Why most offers quietly fail
**Preview:** It's not the content. It's the architecture.

Hi {{contact.first_name}},

The most common reason a smart person's offer doesn't land: they built the
*body* before the *blueprint*. Hours of recording, a pretty sales page — wrapped
around an offer that was never sharpened.

A real offer has three things locked before a single video is filmed: a specific
person, a specific before-and-after, and a format that actually fits how you want
to show up. Get those right and the build is almost easy.

Your blueprint already has the raw version of all three. The work now is making
them precise.

If you want a second set of eyes on which of your offers to build first, that's
exactly what a working call is for: **[Book a call]({{Cal link}})**.

— Hannah

---

### Email 3 — Day 4 · What it looks like when it's right
**Subject:** From "I do a bit of everything" to one clear offer
**Preview:** A quick before/after.

Hi {{contact.first_name}},

A founder came to us doing "a bit of everything" — some consulting, a workshop
here and there, an audience that liked her but didn't know what to buy. Classic
1:1 trap.

We didn't add anything. We *subtracted* until one offer was left: a focused group
container built around a single transformation her people already wanted. Same
expertise, one clear shape. It sold because it was finally legible.

Your blueprint is the start of that same process for you. The question is just
which offer to architect first — and whether the shape you picked is really the
one that fits your vision.

Want to map that together? **[Book a call]({{Cal link}})**

— Hannah

---

### Email 4 — Day 6 · "But I'm not sure I'm ready"
**Subject:** You don't need to feel ready
**Preview:** You need the offer to be clear.

Hi {{contact.first_name}},

If there's a quiet voice saying "I'm not sure I'm expert enough / ready enough"
— good. That voice shows up for almost everyone who's actually close.

Readiness isn't a feeling you wait for; it's clarity you build. When the offer is
sharp — who it's for, what changes, what it costs — "ready" takes care of itself.
The people who keep coming to you for {{contact.ob_expertise}} already think
you're ready. The offer just hasn't caught up to your expertise yet.

A call is the fastest way to close that gap. We'll pressure-test your strongest
offer and map the path to building it: **[Book a call]({{Cal link}})**

— Hannah

---

### Email 5 — Day 8 · The direct invite
**Subject:** Want to build the {{contact.ob_top_offer}}?
**Preview:** Last note from me on this.

Hi {{contact.first_name}},

This is the last email in this little series, so I'll be direct.

You've got a blueprint. You've got the expertise. The thing between you and a real
offer is usually one focused conversation — turning "these look good" into "here's
the one we're building, and here's the plan."

I keep a handful of build calls open each month for exactly this. If the timing's
right, grab one: **[Book a call]({{Cal link}})**

And if now's not the moment, keep the blueprint close. The offer isn't going
anywhere — it's yours.

— Hannah

---

## Step 4 — Stop emailing people who've booked

Bookings happen on Cal.com (external), so GHL won't know unless you connect them.
Pick one:

- **Best:** connect Cal.com → GHL (Cal's GHL integration, or via Make/Zapier) to
  add a `booked-call` tag when someone books. Set that tag as the workflow's
  **Goal** so they exit the sequence automatically.
- **Manual:** when you see a booking, add the `booked-call` tag yourself; the goal
  removes them.

(The app separately records bookings in its own database via the optional Cal
webhook — see `SETUP.md` §5 — but that updates the dashboard, not GHL.)

## Step 5 — Test it end to end

1. Submit the live tool with a test email.
2. Confirm the contact appears in GHL with both tags and the `ob_*` fields filled.
3. Confirm the workflow enrolled them and Email 1 is scheduled.
4. Book via the Cal link and confirm the `booked-call` exit fires (if connected).
