# Life OS — Life Optimization Dashboard

A calm, intentional system for designing, tracking, and improving life across the
pillars that matter: **Health, Business, Relationships, Energy, Fun & Novelty**.

Inspired by Rob Dyrdek-style systems thinking — the goal is clarity over
complexity, and consistency over perfection.

## What's inside

- **Home** — Snapshot of weekly scores, pillar trends (last 8 weeks), top energy
  sources & drains, daily habit completion, fun consistency, this week's
  commitments, and upcoming priorities.
- **Weekly CEO Audit** — Score the five pillars 1–10, reflect on what gave /
  drained energy and what felt aligned / forced, and choose three decisions
  (double down, fix or remove, experiment).
- **Daily Structure Tracker** — Three small check-ins (morning movement + win,
  midday deep work + outcome, evening disconnect + energy) plus optional notes,
  with a 7-day grid.
- **Pillars of Joy** — Per-pillar **nurture menu** (small recurring practices)
  and **bucket-list priorities** (bigger commitments with optional target
  months, e.g. _Europe trip · June_, _Family trip · July_). Pick items each
  week as your weekly commitments.
- **Energy Management** — Tag activities, people, and tasks as energizing,
  neutral, or draining. The dashboard surfaces top sources and top drains.
- **Ideal Week** — Visual weekly layout. Assign a day-type (Deep Work,
  Creative, Admin, Life) and intentions to each day.
- **Fun & Novelty** — Weekly checklist (tried something new, social expansion,
  spontaneous moment) with consistency streak.
- **Relationship Alignment Filter** — Three honest questions per person.
  Aligned / Not aligned. Patterns over time.
- **Business Focus Filter** — Three questions per task or idea. Signal vs.
  likely noise.

## Tech

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Recharts** for trends
- **localStorage** for MVP persistence (no auth, no backend required)
- Mobile-first, calm aesthetic

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

All data is stored locally in your browser under the `lod:v1:*` keys. No
account, no server, nothing leaves your device.

## Design principles

- Minimal, calming, aesthetic — not corporate
- Clarity over complexity
- Encourage intentional living, not perfection
- Limit inputs to what actually drives insight
- Mobile-friendly first
