"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useLocal, STORAGE_KEYS } from "@/lib/storage";
import {
  PILLARS,
  type Pillar,
  type PillarItem,
  type WeeklyCommitment,
} from "@/lib/types";
import { uid } from "@/lib/id";
import { weekStartISO, weekRangeLabel, formatShort } from "@/lib/date";

function formatTarget(t?: string): string {
  if (!t) return "";
  if (t.length === 7) {
    const [y, m] = t.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  }
  return formatShort(t);
}

export default function PillarsPage() {
  const [items, setItems] = useLocal<PillarItem[]>(STORAGE_KEYS.pillarItems, []);
  const [commitments, setCommitments] = useLocal<WeeklyCommitment[]>(
    STORAGE_KEYS.commitments,
    []
  );
  const [activePillar, setActivePillar] = useState<Pillar>("health");

  const wk = weekStartISO();
  const commitment: WeeklyCommitment = useMemo(
    () =>
      commitments.find((c) => c.weekStart === wk) ?? {
        weekStart: wk,
        itemIds: [],
        doneIds: [],
        updatedAt: new Date().toISOString(),
      },
    [commitments, wk]
  );

  function upsertCommitment(next: WeeklyCommitment) {
    setCommitments((prev) => {
      const others = prev.filter((c) => c.weekStart !== next.weekStart);
      return [...others, { ...next, updatedAt: new Date().toISOString() }];
    });
  }

  function toggleCommit(itemId: string) {
    const has = commitment.itemIds.includes(itemId);
    upsertCommitment({
      ...commitment,
      itemIds: has
        ? commitment.itemIds.filter((i) => i !== itemId)
        : [...commitment.itemIds, itemId],
      doneIds: has ? commitment.doneIds.filter((i) => i !== itemId) : commitment.doneIds,
    });
  }

  function toggleDone(itemId: string) {
    const has = commitment.doneIds.includes(itemId);
    upsertCommitment({
      ...commitment,
      doneIds: has
        ? commitment.doneIds.filter((i) => i !== itemId)
        : [...commitment.doneIds, itemId],
      itemIds: commitment.itemIds.includes(itemId)
        ? commitment.itemIds
        : [...commitment.itemIds, itemId],
    });
  }

  function addItem(partial: Omit<PillarItem, "id" | "createdAt">) {
    const item: PillarItem = {
      id: uid(),
      createdAt: new Date().toISOString(),
      ...partial,
    };
    setItems((prev) => [item, ...prev]);
  }

  function updateItem(id: string, patch: Partial<PillarItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
    upsertCommitment({
      ...commitment,
      itemIds: commitment.itemIds.filter((i) => i !== id),
      doneIds: commitment.doneIds.filter((i) => i !== id),
    });
  }

  const itemsByPillar = useMemo(() => {
    const map: Record<Pillar, PillarItem[]> = {
      health: [],
      business: [],
      relationships: [],
      energy: [],
      fun: [],
    };
    for (const it of items) map[it.pillar].push(it);
    return map;
  }, [items]);

  const upcomingPriorities = useMemo(() => {
    const now = new Date();
    return items
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
      .slice(0, 6);
  }, [items]);

  const active = PILLARS.find((p) => p.key === activePillar)!;
  const activeItems = itemsByPillar[activePillar];
  const practices = activeItems.filter((i) => i.kind === "practice");
  const priorities = activeItems.filter((i) => i.kind === "priority");

  return (
    <div>
      <PageHeader
        eyebrow="Pillars of Joy"
        title="What nurtures each pillar"
        subtitle="Curate the practices and priorities that grow each pillar of your life. Pick what to commit to this week."
      />

      <section className="card mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="label">This week</div>
            <div className="font-serif text-lg">{weekRangeLabel(wk)}</div>
          </div>
          <div className="text-sm text-muted">
            {commitment.doneIds.length} / {commitment.itemIds.length} done
          </div>
        </div>
        {commitment.itemIds.length === 0 ? (
          <div className="text-sm text-muted">
            Nothing committed yet. Pick items below from any pillar to commit to this week.
          </div>
        ) : (
          <ul className="space-y-2">
            {commitment.itemIds
              .map((id) => items.find((i) => i.id === id))
              .filter((x): x is PillarItem => Boolean(x))
              .map((it) => {
                const p = PILLARS.find((p) => p.key === it.pillar)!;
                const done = commitment.doneIds.includes(it.id);
                return (
                  <li
                    key={it.id}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 border border-line bg-canvas/40"
                  >
                    <button
                      type="button"
                      aria-label="Toggle done"
                      onClick={() => toggleDone(it.id)}
                      className={
                        "h-5 w-5 rounded-full border flex-shrink-0 " +
                        (done ? "bg-ink border-ink" : "border-line bg-surface")
                      }
                    />
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
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                  </li>
                );
              })}
          </ul>
        )}
      </section>

      {upcomingPriorities.length > 0 && (
        <section className="card mb-6">
          <div className="label mb-3">Upcoming priorities</div>
          <ul className="grid sm:grid-cols-2 gap-2">
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
                  <div className="min-w-0">
                    <div className="text-sm text-ink truncate">{item.label}</div>
                    <div className="text-xs text-muted">
                      {p.label} · {formatTarget(item.targetDate)}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {PILLARS.map((p) => {
          const isActive = activePillar === p.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setActivePillar(p.key)}
              className={
                "px-3 py-1.5 rounded-full text-sm border transition flex items-center gap-2 " +
                (isActive ? "bg-ink text-canvas border-ink" : "bg-surface border-line text-ink hover:border-ink/30")
              }
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
              {p.label}
            </button>
          );
        })}
      </div>

      <section className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="label">Nurture menu · {active.label}</div>
            <div className="text-xs text-muted">{active.hint}</div>
          </div>
          <div className="text-xs text-muted">
            {practices.length} {practices.length === 1 ? "practice" : "practices"}
          </div>
        </div>

        <PracticeForm pillar={activePillar} onAdd={addItem} />

        {practices.length === 0 ? (
          <div className="text-sm text-muted mt-4">
            Add things that nurture {active.label.toLowerCase()} — small actions you can choose to do each week.
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {practices.map((it) => {
              const committed = commitment.itemIds.includes(it.id);
              return (
                <li
                  key={it.id}
                  className="flex items-center gap-3 rounded-xl border border-line p-3"
                >
                  <button
                    type="button"
                    onClick={() => toggleCommit(it.id)}
                    aria-label={committed ? "Remove from this week" : "Commit to this week"}
                    className={
                      "h-5 w-5 rounded-full border flex-shrink-0 transition " +
                      (committed ? "bg-ink border-ink" : "border-line bg-surface hover:border-ink/40")
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-ink truncate">{it.label}</div>
                    {(it.cadence || it.notes) && (
                      <div className="text-xs text-muted truncate">
                        {it.cadence && frequencyLabel(it)}
                        {it.cadence && it.notes ? " · " : ""}
                        {it.notes}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteItem(it.id)}
                    className="text-xs text-muted hover:text-ink"
                    aria-label="Delete"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="card">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="label">Bucket list · {active.label}</div>
            <div className="text-xs text-muted">
              Bigger commitments — trips, milestones, rituals
            </div>
          </div>
          <div className="text-xs text-muted">
            {priorities.length} {priorities.length === 1 ? "priority" : "priorities"}
          </div>
        </div>

        <PriorityForm pillar={activePillar} onAdd={addItem} />

        {priorities.length === 0 ? (
          <div className="text-sm text-muted mt-4">
            Add bucket-list priorities (e.g. &ldquo;Europe trip&rdquo;, &ldquo;Family trip in July&rdquo;) with an optional target date.
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {priorities
              .slice()
              .sort((a, b) => (a.targetDate ?? "z").localeCompare(b.targetDate ?? "z"))
              .map((it) => (
                <li
                  key={it.id}
                  className="flex items-center gap-3 rounded-xl border border-line p-3"
                >
                  <button
                    type="button"
                    onClick={() => updateItem(it.id, { done: !it.done })}
                    aria-label="Toggle done"
                    className={
                      "h-5 w-5 rounded-full border flex-shrink-0 transition " +
                      (it.done ? "bg-ink border-ink" : "border-line bg-surface hover:border-ink/40")
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className={
                        "text-sm truncate " + (it.done ? "line-through text-muted" : "text-ink")
                      }
                    >
                      {it.label}
                    </div>
                    <div className="text-xs text-muted truncate">
                      {it.targetDate ? formatTarget(it.targetDate) : "No target date"}
                      {it.notes ? ` · ${it.notes}` : ""}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteItem(it.id)}
                    className="text-xs text-muted hover:text-ink"
                    aria-label="Delete"
                  >
                    Remove
                  </button>
                </li>
              ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function PracticeForm({
  pillar,
  onAdd,
}: {
  pillar: Pillar;
  onAdd: (partial: Omit<PillarItem, "id" | "createdAt">) => void;
}) {
  const [label, setLabel] = useState("");
  const [times, setTimes] = useState(1);
  const [cadence, setCadence] = useState<PillarItem["cadence"]>("weekly");
  const [notes, setNotes] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    onAdd({
      pillar,
      kind: "practice",
      label: label.trim(),
      times,
      cadence,
      notes: notes.trim() || undefined,
    });
    setLabel("");
    setTimes(1);
    setNotes("");
  }

  return (
    <form onSubmit={submit} className="space-y-2 mt-2">
      <input
        className="field"
        placeholder="A practice that nurtures this pillar…"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <div className="grid sm:grid-cols-[auto_auto_1fr_auto] gap-2 items-center">
        <select
          className="field sm:w-24"
          value={times}
          onChange={(e) => setTimes(parseInt(e.target.value, 10))}
          aria-label="How many times"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <option key={n} value={n}>
              {n}×
            </option>
          ))}
        </select>
        <select
          className="field sm:w-32"
          value={cadence}
          onChange={(e) => setCadence(e.target.value as PillarItem["cadence"])}
          aria-label="Cadence"
        >
          <option value="daily">per day</option>
          <option value="weekly">per week</option>
          <option value="monthly">per month</option>
          <option value="adhoc">ad-hoc</option>
        </select>
        <input
          className="field"
          placeholder="Note (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          Add
        </button>
      </div>
    </form>
  );
}

function frequencyLabel(it: PillarItem): string {
  if (!it.cadence) return "";
  if (it.cadence === "adhoc") return "Ad-hoc";
  const period =
    it.cadence === "daily" ? "day" : it.cadence === "weekly" ? "week" : "month";
  const n = it.times ?? 1;
  return `${n}× per ${period}`;
}

function PriorityForm({
  pillar,
  onAdd,
}: {
  pillar: Pillar;
  onAdd: (partial: Omit<PillarItem, "id" | "createdAt">) => void;
}) {
  const [label, setLabel] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [notes, setNotes] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    onAdd({
      pillar,
      kind: "priority",
      label: label.trim(),
      targetDate: targetDate || undefined,
      notes: notes.trim() || undefined,
    });
    setLabel("");
    setTargetDate("");
    setNotes("");
  }

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-2 mt-2">
      <input
        className="field"
        placeholder="A bucket-list priority…"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <input
        type="month"
        className="field sm:w-40"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
        placeholder="Target month"
      />
      <input
        className="field sm:w-44"
        placeholder="Note (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        Add
      </button>
    </form>
  );
}
