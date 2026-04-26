"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import TrendChart from "@/components/TrendChart";
import { useLocal, STORAGE_KEYS } from "@/lib/storage";
import {
  PILLARS,
  GOAL_CATEGORIES,
  type WeeklyAudit,
  type DailyEntry,
  type EnergyEntry,
  type FunEntry,
  type PillarItem,
  type WeeklyCommitment,
  type Pillar,
  type QuarterConfig,
  type QuarterGoal,
  type Profile,
} from "@/lib/types";
import {
  lastNWeekStarts,
  lastNDays,
  weekStartISO,
  weekRangeLabel,
  formatShort,
  weekOfQuarter,
} from "@/lib/date";

export default function Home() {
  const [audits] = useLocal<WeeklyAudit[]>(STORAGE_KEYS.weeklyAudits, []);
  const [daily] = useLocal<DailyEntry[]>(STORAGE_KEYS.daily, []);
  const [energy] = useLocal<EnergyEntry[]>(STORAGE_KEYS.energy, []);
  const [fun] = useLocal<FunEntry[]>(STORAGE_KEYS.fun, []);
  const [pillarItems] = useLocal<PillarItem[]>(STORAGE_KEYS.pillarItems, []);
  const [commitments] = useLocal<WeeklyCommitment[]>(STORAGE_KEYS.commitments, []);
  const [quarterConfig] = useLocal<QuarterConfig | null>(STORAGE_KEYS.quarterConfig, null);
  const [quarterGoals] = useLocal<QuarterGoal[]>(STORAGE_KEYS.quarterGoals, []);
  const [profile, setProfile] = useLocal<Profile>(STORAGE_KEYS.profile, {
    name: "",
    northStar: "",
  });

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
      <Hero
        weekRange={weekRangeLabel(wk)}
        thisAudit={Boolean(thisAudit)}
        profile={profile}
        onSaveProfile={setProfile}
      />

      <section className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {PILLARS.map((p) => {
          const score = currentScores?.[p.key];
          return (
            <div key={p.key} className="card-tight">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: p.color,
                    boxShadow: `0 0 10px ${p.color}80`,
                  }}
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

      <QuarterCard quarterConfig={quarterConfig} quarterGoals={quarterGoals} />

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

function homePace(delta: number): { label: string; color: string } {
  if (delta >= 5) return { label: `Ahead +${Math.round(delta)}`, color: "#8FCAA9" };
  if (delta >= -8) return { label: "On pace", color: "#6F9DD8" };
  if (delta >= -20) return { label: `Behind ${Math.round(delta)}`, color: "#E5C26B" };
  return { label: `Behind ${Math.round(delta)}`, color: "#E07A8A" };
}

function QuarterCard({
  quarterConfig,
  quarterGoals,
}: {
  quarterConfig: QuarterConfig | null;
  quarterGoals: QuarterGoal[];
}) {
  if (!quarterConfig || quarterGoals.length === 0) {
    return (
      <section className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="label">12-week quarterly goals</div>
          <Link href="/goals" className="text-xs text-muted hover:text-ink">
            Start quarter →
          </Link>
        </div>
        <div className="text-sm text-muted">
          <Link href="/goals" className="underline">
            Set your three goals
          </Link>{" "}
          for the next 12 weeks. Three pre-filled — review and begin the arc.
        </div>
      </section>
    );
  }
  const wq = weekOfQuarter(quarterConfig.startISO);
  const expectedPct = Math.round(((wq.current - 1) / 12) * 100);
  const avgProgress = Math.round(
    quarterGoals.reduce((s, g) => s + g.progress, 0) / quarterGoals.length
  );
  const pace = homePace(avgProgress - expectedPct);

  return (
    <section className="card mb-6">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <div className="label">{quarterConfig.label} · 12-week arc</div>
          <div className="text-xs text-muted">
            Week {wq.current} of 12 · {wq.remainingDays} days left
          </div>
        </div>
        <div className="flex items-baseline gap-3">
          <div className="text-right">
            <div className="font-serif text-2xl tabular-nums text-ink">
              {avgProgress}
              <span className="text-muted text-sm font-sans">%</span>
            </div>
            <div className="text-[10px] text-muted">avg progress</div>
          </div>
          <span
            className="pill text-[10px]"
            style={{ color: pace.color, borderColor: pace.color + "55" }}
          >
            {pace.label}
          </span>
          <Link href="/goals" className="text-xs text-muted hover:text-ink">
            Open →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 mb-4">
        {Array.from({ length: 12 }).map((_, i) => {
          const idx = i + 1;
          const passed = idx < wq.current;
          const current = idx === wq.current;
          return (
            <div
              key={i}
              className={
                "h-1.5 rounded-full transition " +
                (current
                  ? "bg-gradient-to-r from-expandSoft to-expand shadow-[0_0_8px_rgba(63,119,194,0.45)]"
                  : passed
                  ? "bg-white/15"
                  : "bg-white/[.04]")
              }
            />
          );
        })}
      </div>

      <ul className="space-y-3">
        {quarterGoals.map((g) => {
          const cat = GOAL_CATEGORIES.find((c) => c.key === g.category)!;
          const goalPace = homePace(g.progress - expectedPct);
          return (
            <li
              key={g.id}
              className="flex items-center gap-3 border border-white/[.06] rounded-xl p-3 bg-white/[.02]"
              style={{ borderLeft: `3px solid ${cat.color}` }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}80` }}
                  />
                  {cat.label}
                </div>
                <div className="text-sm text-ink truncate mt-0.5">{g.title}</div>
                <div className="relative mt-2 h-1.5 rounded-full bg-white/[.06] border border-white/[.04] overflow-visible">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all"
                    style={{
                      width: `${g.progress}%`,
                      background: `linear-gradient(90deg, ${cat.color}99, ${cat.color})`,
                      boxShadow: `0 0 10px ${cat.color}55`,
                    }}
                  />
                  <div
                    className="absolute -top-0.5 bottom-[-2px] w-px"
                    style={{
                      left: `${expectedPct}%`,
                      background: "rgba(255,255,255,0.55)",
                    }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm tabular-nums" style={{ color: cat.color }}>
                  {g.progress}%
                </div>
                <div className="text-[10px]" style={{ color: goalPace.color }}>
                  {goalPace.label}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Hero({
  weekRange,
  thisAudit,
  profile,
  onSaveProfile,
}: {
  weekRange: string;
  thisAudit: boolean;
  profile: Profile;
  onSaveProfile: (p: Profile) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Profile>(profile);

  function save() {
    onSaveProfile({
      name: draft.name.trim(),
      northStar: draft.northStar.trim(),
    });
    setEditing(false);
  }

  const greeting = profile.name ? `Welcome back, ${profile.name}.` : "Welcome back.";
  const placeholder = "I am building a life that feels light, lit up, and free.";
  const showStar = profile.northStar || !editing;

  return (
    <section className="relative mb-8 sm:mb-10">
      <div className="hero-orb rounded-xl2 px-6 sm:px-10 py-8 sm:py-10 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(63,119,194,0.50), rgba(63,119,194,0) 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(123,90,200,0.40), rgba(123,90,200,0) 70%)",
          }}
        />

        <div className="relative">
          <div className="text-[11px] uppercase tracking-[0.28em] text-muted mb-3">
            {weekRange}
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl leading-tight tracking-tight text-ink/90 mb-1">
            {greeting}
          </h2>
          <div className="text-sm text-muted italic">
            Design the life you came here for.
          </div>

          <div className="mt-6 max-w-2xl">
            {editing ? (
              <div className="space-y-3 animate-fadeIn">
                <input
                  className="field"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Your name (optional)"
                />
                <textarea
                  className="field min-h-[80px]"
                  value={draft.northStar}
                  onChange={(e) =>
                    setDraft({ ...draft, northStar: e.target.value })
                  }
                  placeholder={`Your north star — e.g. "${placeholder}"`}
                />
                <div className="flex items-center gap-2">
                  <button onClick={save} className="btn-primary">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setDraft(profile);
                      setEditing(false);
                    }}
                    className="btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : showStar ? (
              <button
                type="button"
                onClick={() => {
                  setDraft(profile);
                  setEditing(true);
                }}
                className="text-left group"
              >
                <div className="label mb-1.5">North star</div>
                <p className="font-serif text-lg sm:text-xl text-ink/90 italic leading-snug max-w-2xl group-hover:text-ink transition">
                  {profile.northStar ? (
                    <>&ldquo;{profile.northStar}&rdquo;</>
                  ) : (
                    <span className="text-muted">
                      Click to write your north star — the line that pulls you forward.
                    </span>
                  )}
                </p>
                <div className="text-[11px] text-muted mt-2 opacity-70 group-hover:opacity-100 transition">
                  Edit
                </div>
              </button>
            ) : null}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <Link href="/weekly" className="btn-primary">
              {thisAudit ? "Edit this week's audit" : "Run this week's audit"}
            </Link>
            <Link href="/daily" className="btn">
              Daily check-in
            </Link>
            <Link href="/goals" className="btn">
              The 12-week arc
            </Link>
          </div>
        </div>
      </div>
    </section>
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
