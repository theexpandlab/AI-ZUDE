"use client";

import Link from "next/link";
import { useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import TrendChart from "@/components/TrendChart";
import { useLocal, STORAGE_KEYS } from "@/lib/storage";
import {
  PILLARS,
  type WeeklyAudit,
  type DailyEntry,
  type EnergyEntry,
  type FunEntry,
  type PillarItem,
  type WeeklyCommitment,
  type Pillar,
} from "@/lib/types";
import { lastNWeekStarts, lastNDays, weekStartISO, weekRangeLabel, formatShort } from "@/lib/date";

export default function Home() {
  const [audits] = useLocal<WeeklyAudit[]>(STORAGE_KEYS.weeklyAudits, []);
  const [daily] = useLocal<DailyEntry[]>(STORAGE_KEYS.daily, []);
  const [energy] = useLocal<EnergyEntry[]>(STORAGE_KEYS.energy, []);
  const [fun] = useLocal<FunEntry[]>(STORAGE_KEYS.fun, []);
  const [pillarItems] = useLocal<PillarItem[]>(STORAGE_KEYS.pillarItems, []);
  const [commitments] = useLocal<WeeklyCommitment[]>(STORAGE_KEYS.commitments, []);

  const wk = weekStartISO();
  const thisAudit = audits.find((a) => a.weekStart === wk);
  const thisCommitment = commitments.find((c) => c.weekStart === wk);

  const trend = useMemo(() => {
    const weeks = lastNWeekStarts(8);
    return weeks.map((w) => {
      const a = audits.find((x) => x.weekStart === w);
      const row: Record<string, number | string> = { label: formatShort(w) };
      for (const p of PILLARS) {
        if (a) row[p.key] = a.scores[p.key];
      }
      return row;
    });
  }, [audits]);

  const currentScores = useMemo(() => {
    if (thisAudit) return thisAudit.scores;
    const last = [...audits].sort((a, b) => b.weekStart.localeCompare(a.weekStart))[0];
    return last?.scores;
  }, [audits, thisAudit]);

  const dailyCompletion = useMemo(() => {
    const days = lastNDays(7);
    let total = 0;
    let done = 0;
    for (const d of days) {
      const e = daily.find((x) => x.date === d);
      total += 4;
      if (e?.morning.moved) done++;
      if (e?.midday.deepWork) done++;
      if (e?.evening.disconnected) done++;
      if (e?.morning.win.trim()) done++;
    }
    return Math.round((done / total) * 100);
  }, [daily]);

  const energySummary = useMemo(() => {
    const counts: Record<string, { energizing: number; draining: number; neutral: number }> = {};
    for (const e of energy) {
      counts[e.label] ??= { energizing: 0, draining: 0, neutral: 0 };
      counts[e.label][e.tag]++;
    }
    const items = Object.entries(counts).map(([label, c]) => ({
      label,
      score: c.energizing - c.draining,
      ...c,
    }));
    const top = [...items].sort((a, b) => b.score - a.score).slice(0, 3);
    const drains = [...items].sort((a, b) => a.score - b.score).slice(0, 3);
    return { top, drains };
  }, [energy]);

  const funStreak = useMemo(() => {
    const weeks = lastNWeekStarts(8);
    return weeks.map((w) => {
      const f = fun.find((x) => x.weekStart === w);
      const cnt =
        (f?.newThing.done ? 1 : 0) +
        (f?.socialExpansion.done ? 1 : 0) +
        (f?.spontaneous.done ? 1 : 0);
      return { label: formatShort(w), score: cnt };
    });
  }, [fun]);

  const upcomingPriorities = useMemo(() => {
    const now = new Date();
    return pillarItems
      .filter((i) => i.kind === "priority" && i.targetDate && !i.done)
      .map((i) => {
        const t = i.targetDate!;
        const date =
          t.length === 7
            ? new Date(parseInt(t.slice(0, 4)), parseInt(t.slice(5, 7)) - 1, 1)
            : new Date(t);
        return { item: i, date };
      })
      .filter((x) => x.date.getTime() >= new Date(now.getFullYear(), now.getMonth(), 1).getTime())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 4);
  }, [pillarItems]);

  return (
    <div>
      <PageHeader
        eyebrow={weekRangeLabel(wk)}
        title="Live with intention."
        subtitle="A calm view of how you&rsquo;re moving across the pillars that matter."
        right={
          <Link href="/weekly" className="btn-primary">
            {thisAudit ? "Edit weekly audit" : "Run weekly audit"}
          </Link>
        }
      />

      <section className="grid sm:grid-cols-5 gap-3 mb-6">
        {PILLARS.map((p) => {
          const score = currentScores?.[p.key];
          return (
            <div key={p.key} className="card-tight">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <div className="label">{p.label}</div>
              </div>
              <div className="font-serif text-3xl tabular-nums" style={{ color: p.color }}>
                {score ?? "–"}
                <span className="text-muted text-base font-sans">/10</span>
              </div>
              <div className="text-xs text-muted mt-1">{p.hint}</div>
            </div>
          );
        })}
      </section>

      <section className="card mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="label">Pillar trends</div>
            <div className="text-xs text-muted">Last 8 weeks</div>
          </div>
        </div>
        <TrendChart
          data={trend}
          dataKeys={PILLARS.map((p) => ({ key: p.key, color: p.color, label: p.label }))}
        />
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="label">This week&rsquo;s commitments</div>
              <div className="text-xs text-muted">From your pillar nurture menu</div>
            </div>
            <Link href="/pillars" className="text-xs text-muted hover:text-ink">
              Edit →
            </Link>
          </div>
          {!thisCommitment || thisCommitment.itemIds.length === 0 ? (
            <div className="text-sm text-muted">
              Nothing committed yet.{" "}
              <Link href="/pillars" className="underline">
                Choose practices
              </Link>{" "}
              from your pillars to nurture this week.
            </div>
          ) : (
            <CommittedList
              commitment={thisCommitment}
              items={pillarItems}
            />
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="label">Upcoming priorities</div>
              <div className="text-xs text-muted">Bigger things on the horizon</div>
            </div>
            <Link href="/pillars" className="text-xs text-muted hover:text-ink">
              Add →
            </Link>
          </div>
          {upcomingPriorities.length === 0 ? (
            <div className="text-sm text-muted">
              No bucket-list priorities yet. Add trips, milestones, or rituals on the{" "}
              <Link href="/pillars" className="underline">
                Pillars
              </Link>{" "}
              page.
            </div>
          ) : (
            <ul className="space-y-2">
              {upcomingPriorities.map(({ item, date }) => {
                const p = PILLARS.find((p) => p.key === item.pillar)!;
                return (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 rounded-xl border border-line p-3"
                  >
                    <span
                      className="mt-1 h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-ink truncate">{item.label}</div>
                      <div className="text-xs text-muted">
                        {p.label} ·{" "}
                        {item.targetDate && item.targetDate.length === 7
                          ? new Date(
                              parseInt(item.targetDate.slice(0, 4)),
                              parseInt(item.targetDate.slice(5, 7)) - 1,
                              1
                            ).toLocaleDateString(undefined, {
                              month: "long",
                              year: "numeric",
                            })
                          : formatShort(item.targetDate!)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="label mb-2">Daily habit completion</div>
          <div className="font-serif text-3xl">
            {dailyCompletion}
            <span className="text-muted text-base font-sans">%</span>
          </div>
          <div className="text-xs text-muted mt-1">Last 7 days · move, deep work, disconnect, daily win</div>
          <Link href="/daily" className="text-xs underline mt-3 inline-block">
            Open daily tracker
          </Link>
        </div>
        <div className="card">
          <div className="label mb-2">Top energy sources</div>
          {energySummary.top.length === 0 ? (
            <div className="text-sm text-muted">Tag activities & people to surface patterns.</div>
          ) : (
            <ul className="text-sm space-y-1">
              {energySummary.top.map((it) => (
                <li key={it.label} className="flex justify-between">
                  <span className="truncate pr-3">{it.label}</span>
                  <span className="text-sage tabular-nums">+{it.score}</span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/energy" className="text-xs underline mt-3 inline-block">
            Manage energy
          </Link>
        </div>
        <div className="card">
          <div className="label mb-2">Top drains</div>
          {energySummary.drains.length === 0 ? (
            <div className="text-sm text-muted">Nothing tracked yet.</div>
          ) : (
            <ul className="text-sm space-y-1">
              {energySummary.drains.map((it) => (
                <li key={it.label} className="flex justify-between">
                  <span className="truncate pr-3">{it.label}</span>
                  <span className="text-rose tabular-nums">{it.score}</span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/energy" className="text-xs underline mt-3 inline-block">
            Reduce drains
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="label">Fun & novelty consistency</div>
            <Link href="/fun" className="text-xs text-muted hover:text-ink">
              Open →
            </Link>
          </div>
          <div className="text-xs text-muted mb-2">Last 8 weeks · 0–3 markers per week</div>
          <div className="flex items-end gap-1.5 h-24">
            {funStreak.map((w) => (
              <div key={w.label} className="flex-1 flex flex-col items-center justify-end">
                <div
                  className="w-full rounded-t bg-plum/80"
                  style={{ height: `${(w.score / 3) * 100}%`, minHeight: w.score ? 4 : 0 }}
                />
                <div className="text-[10px] text-muted mt-1">{w.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="label mb-2">Quick paths</div>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/daily" className="btn justify-start">Daily check-in</Link>
            <Link href="/weekly" className="btn justify-start">Weekly audit</Link>
            <Link href="/pillars" className="btn justify-start">Pillars of joy</Link>
            <Link href="/ideal-week" className="btn justify-start">Ideal week</Link>
            <Link href="/relationships" className="btn justify-start">Relationship filter</Link>
            <Link href="/business" className="btn justify-start">Business filter</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function CommittedList({
  commitment,
  items,
}: {
  commitment: WeeklyCommitment;
  items: PillarItem[];
}) {
  const grouped: Record<Pillar, PillarItem[]> = {
    health: [],
    business: [],
    relationships: [],
    energy: [],
    fun: [],
  };
  for (const id of commitment.itemIds) {
    const it = items.find((i) => i.id === id);
    if (it) grouped[it.pillar].push(it);
  }
  const has = Object.values(grouped).some((g) => g.length > 0);
  if (!has) return null;
  return (
    <ul className="space-y-2">
      {PILLARS.flatMap((p) =>
        grouped[p.key].map((it) => {
          const done = commitment.doneIds.includes(it.id);
          return (
            <li
              key={it.id}
              className="flex items-center gap-3 rounded-xl border border-line p-2.5"
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
              <div className="flex-1 min-w-0">
                <div
                  className={
                    "text-sm truncate " + (done ? "line-through text-muted" : "text-ink")
                  }
                >
                  {it.label}
                </div>
                <div className="text-xs text-muted">{p.label}</div>
              </div>
              {done && <span className="text-xs text-sage">Done</span>}
            </li>
          );
        })
      )}
    </ul>
  );
}
