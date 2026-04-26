"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useLocal, STORAGE_KEYS } from "@/lib/storage";
import type { FunEntry } from "@/lib/types";
import { weekStartISO, weekRangeLabel, lastNWeekStarts, formatShort } from "@/lib/date";

const empty = (weekStart: string): FunEntry => ({
  weekStart,
  newThing: { done: false, note: "" },
  socialExpansion: { done: false, note: "" },
  spontaneous: { done: false, note: "" },
  updatedAt: new Date().toISOString(),
});

export default function FunPage() {
  const [entries, setEntries] = useLocal<FunEntry[]>(STORAGE_KEYS.fun, []);
  const wk = weekStartISO();
  const existing = entries.find((e) => e.weekStart === wk);
  const [draft, setDraft] = useState<FunEntry>(() => existing ?? empty(wk));

  useEffect(() => {
    if (existing) setDraft(existing);
  }, [existing]);

  function save() {
    const next: FunEntry = { ...draft, updatedAt: new Date().toISOString() };
    setEntries((prev) => {
      const others = prev.filter((e) => e.weekStart !== next.weekStart);
      return [...others, next];
    });
  }

  const recent = useMemo(() => {
    const weeks = lastNWeekStarts(8);
    return weeks.map((w) => {
      const e = entries.find((x) => x.weekStart === w);
      const score =
        (e?.newThing.done ? 1 : 0) +
        (e?.socialExpansion.done ? 1 : 0) +
        (e?.spontaneous.done ? 1 : 0);
      return { week: w, score };
    });
  }, [entries]);

  const streak = useMemo(() => {
    let s = 0;
    for (let i = recent.length - 1; i >= 0; i--) {
      if (recent[i].score >= 1) s++;
      else break;
    }
    return s;
  }, [recent]);

  const totalCalc =
    (draft.newThing.done ? 1 : 0) +
    (draft.socialExpansion.done ? 1 : 0) +
    (draft.spontaneous.done ? 1 : 0);

  return (
    <div>
      <PageHeader
        eyebrow={`Fun & novelty · ${weekRangeLabel(wk)}`}
        title="Keep the spark on."
        subtitle="Three small markers each week. Trying, expanding, surprising."
        right={
          <div className="text-right">
            <div className="font-serif text-3xl tabular-nums">{totalCalc}/3</div>
            <div className="label">This week</div>
          </div>
        }
      />

      <section className="card mb-6 space-y-4">
        <Marker
          title="Tried something new"
          subtitle="A first. Small or big."
          done={draft.newThing.done}
          note={draft.newThing.note}
          onToggle={() =>
            setDraft((d) => ({ ...d, newThing: { ...d.newThing, done: !d.newThing.done } }))
          }
          onNote={(v) =>
            setDraft((d) => ({ ...d, newThing: { ...d.newThing, note: v } }))
          }
        />
        <Marker
          title="Social expansion"
          subtitle="An event, a date, or a new person."
          done={draft.socialExpansion.done}
          note={draft.socialExpansion.note}
          onToggle={() =>
            setDraft((d) => ({
              ...d,
              socialExpansion: { ...d.socialExpansion, done: !d.socialExpansion.done },
            }))
          }
          onNote={(v) =>
            setDraft((d) => ({
              ...d,
              socialExpansion: { ...d.socialExpansion, note: v },
            }))
          }
        />
        <Marker
          title="Spontaneous moment"
          subtitle="Off-schedule. Unplanned. Alive."
          done={draft.spontaneous.done}
          note={draft.spontaneous.note}
          onToggle={() =>
            setDraft((d) => ({
              ...d,
              spontaneous: { ...d.spontaneous, done: !d.spontaneous.done },
            }))
          }
          onNote={(v) =>
            setDraft((d) => ({ ...d, spontaneous: { ...d.spontaneous, note: v } }))
          }
        />
      </section>

      <div className="flex items-center justify-between mb-10">
        <div className="text-xs text-muted">
          {existing ? `Saved ${new Date(existing.updatedAt).toLocaleString()}` : "Not saved yet"}
        </div>
        <button onClick={save} className="btn-primary">
          {existing ? "Update week" : "Save week"}
        </button>
      </div>

      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="label">Consistency · last 8 weeks</div>
          <div className="text-xs text-muted">
            Active streak: <span className="text-ink">{streak} {streak === 1 ? "week" : "weeks"}</span>
          </div>
        </div>
        <div className="flex items-end gap-2 h-28">
          {recent.map((w) => (
            <div key={w.week} className="flex-1 flex flex-col items-center justify-end">
              <div
                className="w-full rounded-t bg-plum/80"
                style={{ height: `${(w.score / 3) * 100}%`, minHeight: w.score ? 4 : 0 }}
              />
              <div className="text-[10px] text-muted mt-1">{formatShort(w.week)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Marker({
  title,
  subtitle,
  done,
  note,
  onToggle,
  onNote,
}: {
  title: string;
  subtitle: string;
  done: boolean;
  note: string;
  onToggle: () => void;
  onNote: (v: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-[auto_1fr] gap-3 items-start">
      <button
        type="button"
        onClick={onToggle}
        className={
          "h-10 w-10 rounded-full border flex items-center justify-center transition flex-shrink-0 " +
          (done ? "bg-ink border-ink text-canvas" : "border-line bg-surface hover:border-ink/40")
        }
        aria-label={done ? "Mark incomplete" : "Mark complete"}
      >
        {done ? "✓" : ""}
      </button>
      <div>
        <div className="text-sm font-medium text-ink">{title}</div>
        <div className="text-xs text-muted mb-2">{subtitle}</div>
        <input
          className="field"
          value={note}
          onChange={(e) => onNote(e.target.value)}
          placeholder="What was it?"
        />
      </div>
    </div>
  );
}
