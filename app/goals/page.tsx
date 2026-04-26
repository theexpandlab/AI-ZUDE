"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useLocal, STORAGE_KEYS } from "@/lib/storage";
import {
  GOAL_CATEGORIES,
  type GoalCategory,
  type GoalStatus,
  type QuarterConfig,
  type QuarterGoal,
} from "@/lib/types";
import { uid } from "@/lib/id";
import {
  weekStartISO,
  weekRangeLabel,
  weekOfQuarter,
  quarterLabelFor,
  firstMondayOfCurrentQuarter,
  formatShort,
} from "@/lib/date";

// User's stated Q2 goals (April–June 2026).
const SEED_GOALS: Omit<QuarterGoal, "id" | "createdAt">[] = [
  {
    category: "health",
    title: "Lose 3% body fat, gain 3% muscle",
    target: "−3% body fat / +3% lean mass by end of quarter",
    why: "Feel strong, energized, and sharper across every other pillar.",
    progress: 0,
    microActions: [
      { id: uid(), label: "Strength train 3×/week", doneIds: [] },
      { id: uid(), label: "Hit protein target daily", doneIds: [] },
      { id: uid(), label: "Track body comp every 2 weeks", doneIds: [] },
    ],
    checkIns: [],
  },
  {
    category: "business",
    title: "Automate & delegate 70%, hit consistent $20k months",
    target: "70% of business automated/delegated · 3 consecutive $20k months",
    why: "Time freedom and clean ops so I can focus on the highest-leverage work.",
    progress: 0,
    microActions: [
      { id: uid(), label: "Document 1 SOP per week", doneIds: [] },
      { id: uid(), label: "Hire / offload 1 role this quarter", doneIds: [] },
      { id: uid(), label: "Weekly P&L + pipeline review", doneIds: [] },
    ],
    checkIns: [],
  },
  {
    category: "finance",
    title: "Finances figured out + long-term investment automations",
    target: "Auto-invest in place · written long-term plan · expenses dialed",
    why: "Quiet money so I can build from a place of strength, not pressure.",
    progress: 0,
    microActions: [
      { id: uid(), label: "Pick custodian + open accounts", doneIds: [] },
      { id: uid(), label: "Automate monthly transfer + invest", doneIds: [] },
      { id: uid(), label: "Write 5-year financial plan", doneIds: [] },
    ],
    checkIns: [],
  },
];

const STATUS_META: Record<GoalStatus, { label: string; color: string }> = {
  on: { label: "On track", color: "#6F8B6E" },
  risk: { label: "At risk", color: "#D4A04C" },
  off: { label: "Off track", color: "#C97A7A" },
};

export default function GoalsPage() {
  const [config, setConfig] = useLocal<QuarterConfig | null>(
    STORAGE_KEYS.quarterConfig,
    null
  );
  const [goals, setGoals] = useLocal<QuarterGoal[]>(STORAGE_KEYS.quarterGoals, []);

  function startQuarter() {
    const startISO = firstMondayOfCurrentQuarter();
    const [y, m] = startISO.split("-").map(Number);
    setConfig({ label: quarterLabelFor(new Date(y, m - 1, 1)), startISO });
    const seeded: QuarterGoal[] = SEED_GOALS.map((g) => ({
      ...g,
      id: uid(),
      createdAt: new Date().toISOString(),
    }));
    setGoals(seeded);
  }

  function startBlankQuarter() {
    const startISO = firstMondayOfCurrentQuarter();
    const [y, m] = startISO.split("-").map(Number);
    setConfig({ label: quarterLabelFor(new Date(y, m - 1, 1)), startISO });
    setGoals([]);
  }

  function updateQuarterStart(newStartISO: string) {
    const [y, m] = newStartISO.split("-").map(Number);
    setConfig({ label: quarterLabelFor(new Date(y, m - 1, 1)), startISO: newStartISO });
  }

  function addGoal(partial: Omit<QuarterGoal, "id" | "createdAt">) {
    setGoals((prev) => [
      ...prev,
      { ...partial, id: uid(), createdAt: new Date().toISOString() },
    ]);
  }

  function updateGoal(id: string, patch: Partial<QuarterGoal>) {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }

  function deleteGoal(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  if (!config) {
    return (
      <div>
        <PageHeader
          eyebrow="12-week quarter"
          title="Set the arc of your next 12 weeks."
          subtitle="Pick three goals max. Quality over quantity. Track weekly progress, adjust as you go."
        />
        <div className="card text-center">
          <div className="font-serif text-xl mb-2">Start a new quarter</div>
          <p className="text-sm text-muted max-w-md mx-auto mb-6">
            We&rsquo;ll set Week 1 to today&rsquo;s Monday and run for 12 weeks.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={startQuarter} className="btn-primary">
              Start with my 3 goals
            </button>
            <button onClick={startBlankQuarter} className="btn">
              Start blank
            </button>
          </div>
          <div className="divider my-6" />
          <div className="text-left max-w-lg mx-auto">
            <div className="label mb-3">Your 3 goals (preview)</div>
            <ul className="space-y-2">
              {SEED_GOALS.map((g, idx) => {
                const cat = GOAL_CATEGORIES.find((c) => c.key === g.category)!;
                return (
                  <li
                    key={idx}
                    className="flex items-start gap-3 border border-line rounded-xl p-3"
                  >
                    <span
                      className="mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div className="min-w-0">
                      <div className="text-sm text-ink">{g.title}</div>
                      <div className="text-xs text-muted">
                        {cat.label} · {g.target}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const wq = weekOfQuarter(config.startISO);
  const expectedPct = Math.round(((wq.current - 1) / wq.total) * 100);
  const avgProgress =
    goals.length === 0
      ? 0
      : Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length);
  const overallDelta = avgProgress - expectedPct;
  const overallPace = pace(overallDelta);

  return (
    <div>
      <PageHeader
        eyebrow={config.label}
        title="The 12-week arc"
        subtitle="Three goals. Twelve weeks. Adjust the path, not the destination."
        right={
          <div className="text-right">
            <div className="font-serif text-3xl tabular-nums">
              {wq.current}
              <span className="text-muted text-base font-sans">/{wq.total}</span>
            </div>
            <div className="label">Week · {wq.remainingDays}d left</div>
          </div>
        }
      />

      <section className="card mb-6">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <div className="label">Quarter progress</div>
            <div className="text-xs text-muted">
              {weekRangeLabel(config.startISO)} → {formatShort(wq.endISO)} · {wq.total} weeks
            </div>
          </div>
          <QuarterEditor
            startISO={config.startISO}
            onSave={updateQuarterStart}
          />
        </div>

        <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-end mb-4">
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <div className="text-xs text-muted">
                Average progress across {goals.length || "—"} goal{goals.length === 1 ? "" : "s"}
              </div>
              <div
                className="text-[11px] uppercase tracking-[0.14em]"
                style={{ color: overallPace.color }}
              >
                {overallPace.label}
              </div>
            </div>
            <PaceBar
              progress={avgProgress}
              expected={expectedPct}
              color="#6F9DD8"
            />
          </div>
          <div className="text-right">
            <div className="font-serif text-4xl tabular-nums text-ink">
              {avgProgress}
              <span className="text-muted text-lg font-sans">%</span>
            </div>
            <div className="text-[11px] text-muted">
              expected {expectedPct}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-1.5">
          {Array.from({ length: 12 }).map((_, i) => {
            const idx = i + 1;
            const passed = idx < wq.current;
            const current = idx === wq.current;
            return (
              <div
                key={i}
                className={
                  "h-8 rounded-md flex items-center justify-center text-[10px] transition " +
                  (current
                    ? "bg-gradient-to-b from-expandSoft to-expand text-white shadow-[0_0_12px_rgba(63,119,194,0.35)]"
                    : passed
                    ? "bg-white/10 text-ink/80"
                    : "bg-white/[.02] border border-white/[.06] text-muted")
                }
              >
                {idx}
              </div>
            );
          })}
        </div>
      </section>

      <div className="space-y-5 mb-6">
        {goals.length === 0 && (
          <div className="card text-center text-sm text-muted">
            No goals yet. Add one below.
          </div>
        )}
        {goals.map((g) => (
          <GoalCard
            key={g.id}
            goal={g}
            expectedPct={expectedPct}
            onUpdate={(patch) => updateGoal(g.id, patch)}
            onDelete={() => deleteGoal(g.id)}
          />
        ))}
      </div>

      <NewGoalForm onAdd={addGoal} disabled={goals.length >= 4} />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-muted">
          Started {weekRangeLabel(config.startISO)}
        </div>
        <div className="flex gap-2">
          <button
            className="btn"
            onClick={() => {
              if (
                confirm(
                  "Reset the quarter? This clears your current goals and check-ins."
                )
              ) {
                setConfig(null);
                setGoals([]);
              }
            }}
          >
            Reset quarter
          </button>
        </div>
      </div>
    </div>
  );
}

function GoalCard({
  goal,
  onUpdate,
  onDelete,
  expectedPct,
}: {
  goal: QuarterGoal;
  onUpdate: (patch: Partial<QuarterGoal>) => void;
  onDelete: () => void;
  expectedPct: number;
}) {
  const cat = GOAL_CATEGORIES.find((c) => c.key === goal.category)!;
  const wk = weekStartISO();
  const thisCheck = goal.checkIns.find((c) => c.weekStart === wk);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: goal.title,
    target: goal.target,
    why: goal.why,
    category: goal.category,
  });
  const goalPace = pace(goal.progress - expectedPct);

  useEffect(() => {
    setDraft({
      title: goal.title,
      target: goal.target,
      why: goal.why,
      category: goal.category,
    });
  }, [goal.id, goal.title, goal.target, goal.why, goal.category]);

  function saveCheckIn(progress: number, status: GoalStatus, note: string) {
    const others = goal.checkIns.filter((c) => c.weekStart !== wk);
    onUpdate({
      progress,
      checkIns: [
        ...others,
        { weekStart: wk, progress, status, note, createdAt: new Date().toISOString() },
      ],
    });
  }

  function toggleAction(actionId: string) {
    const actions = goal.microActions.map((a) => {
      if (a.id !== actionId) return a;
      const has = a.doneIds.includes(wk);
      return {
        ...a,
        doneIds: has ? a.doneIds.filter((d) => d !== wk) : [...a.doneIds, wk],
      };
    });
    onUpdate({ microActions: actions });
  }

  function addAction(label: string) {
    if (!label.trim()) return;
    onUpdate({
      microActions: [
        ...goal.microActions,
        { id: uid(), label: label.trim(), doneIds: [] },
      ],
    });
  }

  function removeAction(actionId: string) {
    onUpdate({ microActions: goal.microActions.filter((a) => a.id !== actionId) });
  }

  return (
    <div
      className="card"
      style={{ borderLeft: `3px solid ${cat.color}` }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          {editing ? (
            <div className="space-y-2">
              <select
                className="field"
                value={draft.category}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value as GoalCategory })
                }
              >
                {GOAL_CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                className="field"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Goal"
              />
              <input
                className="field"
                value={draft.target}
                onChange={(e) => setDraft({ ...draft, target: e.target.value })}
                placeholder="Target outcome"
              />
              <textarea
                className="field min-h-[60px]"
                value={draft.why}
                onChange={(e) => setDraft({ ...draft, why: e.target.value })}
                placeholder="Why this goal matters"
              />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="label">{cat.label}</span>
              </div>
              <div className="font-serif text-lg leading-snug text-ink">
                {goal.title}
              </div>
              <div className="text-sm text-muted mt-1">{goal.target}</div>
              {goal.why && (
                <div className="text-xs text-muted mt-1 italic">&ldquo;{goal.why}&rdquo;</div>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {editing ? (
            <>
              <button
                className="btn-primary text-xs"
                onClick={() => {
                  onUpdate(draft);
                  setEditing(false);
                }}
              >
                Save
              </button>
              <button
                className="text-xs text-muted hover:text-ink"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="text-xs text-muted hover:text-ink"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              <button
                className="text-xs text-muted hover:text-rose"
                onClick={() => {
                  if (confirm("Delete this goal?")) onDelete();
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-end justify-between mb-1">
          <div className="label">Progress</div>
          <div className="flex items-baseline gap-2">
            <span className="text-[11px]" style={{ color: goalPace.color }}>
              {goalPace.label}
            </span>
            <span className="text-sm tabular-nums" style={{ color: cat.color }}>
              {goal.progress}%
            </span>
          </div>
        </div>
        <PaceBar progress={goal.progress} expected={expectedPct} color={cat.color} />
        <div className="flex justify-between text-[10px] text-muted mt-1.5">
          <span>0%</span>
          <span>expected {expectedPct}% by now</span>
          <span>100%</span>
        </div>
      </div>

      <details className="mb-4 group" open={goal.microActions.length > 0 && goal.microActions.length <= 4}>
        <summary className="cursor-pointer label flex items-center justify-between">
          <span>Weekly actions</span>
          <span className="text-muted">
            {goal.microActions.filter((a) => a.doneIds.includes(wk)).length}/{goal.microActions.length} this week
          </span>
        </summary>
        <ul className="mt-3 space-y-1.5">
          {goal.microActions.map((a) => {
            const done = a.doneIds.includes(wk);
            return (
              <li
                key={a.id}
                className="flex items-center gap-3 border border-line rounded-xl p-2.5"
              >
                <button
                  type="button"
                  onClick={() => toggleAction(a.id)}
                  aria-label={done ? "Mark incomplete" : "Mark done"}
                  className={
                    "h-5 w-5 rounded-full border flex-shrink-0 transition " +
                    (done ? "bg-ink border-ink" : "border-line bg-surface hover:border-ink/40")
                  }
                />
                <div
                  className={
                    "flex-1 text-sm truncate " + (done ? "line-through text-muted" : "text-ink")
                  }
                >
                  {a.label}
                </div>
                <button
                  type="button"
                  className="text-xs text-muted hover:text-ink"
                  onClick={() => removeAction(a.id)}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
        <ActionAddRow onAdd={addAction} />
      </details>

      <CheckInRow
        defaultProgress={thisCheck?.progress ?? goal.progress}
        defaultStatus={thisCheck?.status ?? "on"}
        defaultNote={thisCheck?.note ?? ""}
        onSave={saveCheckIn}
        existing={Boolean(thisCheck)}
      />

      {goal.checkIns.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer label">
            History · {goal.checkIns.length} {goal.checkIns.length === 1 ? "check-in" : "check-ins"}
          </summary>
          <ul className="mt-3 space-y-2">
            {goal.checkIns
              .slice()
              .sort((a, b) => b.weekStart.localeCompare(a.weekStart))
              .map((c) => (
                <li
                  key={c.weekStart}
                  className="flex items-start gap-3 border border-line rounded-xl p-3"
                >
                  <span
                    className="mt-1.5 h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: STATUS_META[c.status].color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted">
                      {weekRangeLabel(c.weekStart)} · {STATUS_META[c.status].label} · {c.progress}%
                    </div>
                    {c.note && <div className="text-sm text-ink mt-1">{c.note}</div>}
                  </div>
                </li>
              ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function ActionAddRow({ onAdd }: { onAdd: (label: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAdd(val);
        setVal("");
      }}
      className="grid grid-cols-[1fr_auto] gap-2 mt-2"
    >
      <input
        className="field"
        placeholder="Add a weekly action…"
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <button type="submit" className="btn">
        Add
      </button>
    </form>
  );
}

function CheckInRow({
  defaultProgress,
  defaultStatus,
  defaultNote,
  onSave,
  existing,
}: {
  defaultProgress: number;
  defaultStatus: GoalStatus;
  defaultNote: string;
  onSave: (progress: number, status: GoalStatus, note: string) => void;
  existing: boolean;
}) {
  const [progress, setProgress] = useState(defaultProgress);
  const [status, setStatus] = useState<GoalStatus>(defaultStatus);
  const [note, setNote] = useState(defaultNote);

  useEffect(() => {
    setProgress(defaultProgress);
    setStatus(defaultStatus);
    setNote(defaultNote);
  }, [defaultProgress, defaultStatus, defaultNote]);

  return (
    <div className="border border-line rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="label">This week</div>
        <div className="inline-flex bg-canvas border border-line rounded-full p-1">
          {(Object.keys(STATUS_META) as GoalStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={
                "px-3 py-1 rounded-full text-xs transition " +
                (status === s ? "bg-ink text-canvas" : "text-ink hover:bg-surface")
              }
            >
              {STATUS_META[s].label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-center mb-2">
        <input
          type="range"
          className="score w-full"
          min={0}
          max={100}
          step={5}
          value={progress}
          onChange={(e) => setProgress(parseInt(e.target.value, 10))}
        />
        <div className="text-sm tabular-nums w-12 text-right">{progress}%</div>
      </div>
      <textarea
        className="field min-h-[50px]"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="A sentence on what moved or what's blocking."
      />
      <div className="flex justify-end mt-2">
        <button
          className="btn-primary text-xs"
          onClick={() => onSave(progress, status, note)}
        >
          {existing ? "Update check-in" : "Save check-in"}
        </button>
      </div>
    </div>
  );
}

function NewGoalForm({
  onAdd,
  disabled,
}: {
  onAdd: (g: Omit<QuarterGoal, "id" | "createdAt">) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    target: "",
    why: "",
    category: "health" as GoalCategory,
  });

  if (!open) {
    return (
      <button
        className="btn w-full"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        {disabled ? "3 goals is the sweet spot — focus first" : "+ Add another goal"}
      </button>
    );
  }

  return (
    <form
      className="card space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.title.trim()) return;
        onAdd({
          ...draft,
          title: draft.title.trim(),
          target: draft.target.trim(),
          why: draft.why.trim(),
          progress: 0,
          microActions: [],
          checkIns: [],
        });
        setDraft({ title: "", target: "", why: "", category: "health" });
        setOpen(false);
      }}
    >
      <div className="label">New goal</div>
      <select
        className="field"
        value={draft.category}
        onChange={(e) => setDraft({ ...draft, category: e.target.value as GoalCategory })}
      >
        {GOAL_CATEGORIES.map((c) => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </select>
      <input
        className="field"
        value={draft.title}
        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        placeholder="Goal title"
      />
      <input
        className="field"
        value={draft.target}
        onChange={(e) => setDraft({ ...draft, target: e.target.value })}
        placeholder="Target outcome"
      />
      <textarea
        className="field min-h-[60px]"
        value={draft.why}
        onChange={(e) => setDraft({ ...draft, why: e.target.value })}
        placeholder="Why this matters"
      />
      <div className="flex justify-end gap-2">
        <button type="button" className="btn" onClick={() => setOpen(false)}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Add goal
        </button>
      </div>
    </form>
  );
}

function pace(delta: number): { label: string; color: string } {
  if (delta >= 5) return { label: `Ahead +${Math.round(delta)}`, color: "#8FCAA9" };
  if (delta >= -8) return { label: "On pace", color: "#6F9DD8" };
  if (delta >= -20) return { label: `Behind ${Math.round(delta)}`, color: "#E5C26B" };
  return { label: `Behind ${Math.round(delta)}`, color: "#E07A8A" };
}

function PaceBar({
  progress,
  expected,
  color,
}: {
  progress: number;
  expected: number;
  color: string;
}) {
  const p = Math.max(0, Math.min(100, progress));
  const e = Math.max(0, Math.min(100, expected));
  return (
    <div className="relative h-2.5 rounded-full bg-white/[.05] border border-white/[.06] overflow-visible">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all"
        style={{
          width: `${p}%`,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          boxShadow: `0 0 12px ${color}55`,
        }}
      />
      {/* Expected pace marker */}
      <div
        className="absolute -top-1 bottom-[-4px] w-px"
        style={{
          left: `${e}%`,
          background: "rgba(255,255,255,0.55)",
          boxShadow: "0 0 6px rgba(255,255,255,0.45)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

function QuarterEditor({
  startISO,
  onSave,
}: {
  startISO: string;
  onSave: (iso: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(startISO);

  useEffect(() => setDraft(startISO), [startISO]);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs text-muted hover:text-ink">
        Edit dates
      </button>
    );
  }
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <label className="text-[11px] text-muted">Starts</label>
      <input
        type="date"
        className="field w-[10rem]"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <button
        className="btn-primary text-xs"
        onClick={() => {
          onSave(draft);
          setOpen(false);
        }}
      >
        Save
      </button>
      <button
        className="text-xs text-muted hover:text-ink"
        onClick={() => {
          setDraft(startISO);
          setOpen(false);
        }}
      >
        Cancel
      </button>
    </div>
  );
}
