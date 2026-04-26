"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import YesNo from "@/components/YesNo";
import { useLocal, STORAGE_KEYS } from "@/lib/storage";
import type { DailyEntry } from "@/lib/types";
import { todayISO, formatLong, lastNDays, formatShort } from "@/lib/date";

const empty = (date: string): DailyEntry => ({
  date,
  morning: { moved: null, win: "" },
  midday: { deepWork: null, outcome: "" },
  evening: { disconnected: null, energy: null },
  notes: "",
  updatedAt: new Date().toISOString(),
});

export default function DailyPage() {
  const [entries, setEntries] = useLocal<DailyEntry[]>(STORAGE_KEYS.daily, []);
  const [date, setDate] = useState(todayISO());
  const existing = entries.find((e) => e.date === date);
  const [draft, setDraft] = useState<DailyEntry>(() => existing ?? empty(date));

  useEffect(() => {
    setDraft(entries.find((e) => e.date === date) ?? empty(date));
  }, [date, entries]);

  function save() {
    const next: DailyEntry = { ...draft, updatedAt: new Date().toISOString() };
    setEntries((prev) => {
      const others = prev.filter((e) => e.date !== next.date);
      return [...others, next];
    });
  }

  const recent = useMemo(() => {
    const days = lastNDays(7);
    return days.map((d) => {
      const e = entries.find((x) => x.date === d);
      const score =
        (e?.morning.moved ? 1 : 0) +
        (e?.midday.deepWork ? 1 : 0) +
        (e?.evening.disconnected ? 1 : 0) +
        (e?.morning.win.trim() ? 1 : 0);
      return { date: d, score, energy: e?.evening.energy ?? null };
    });
  }, [entries]);

  return (
    <div>
      <PageHeader
        eyebrow="Daily structure"
        title="A simple shape for the day"
        subtitle="Three small check-ins. Not overwhelming. Skip if you must."
        right={
          <input
            type="date"
            className="field w-[12rem]"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        }
      />

      <div className="text-sm text-muted mb-4">{formatLong(date)}</div>

      <section className="card mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="label">Morning</div>
            <div className="text-xs text-muted">Set the tone</div>
          </div>
          <span className="text-xl">☀</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm mb-2">Did I move my body?</div>
            <YesNo
              value={draft.morning.moved}
              onChange={(v) =>
                setDraft((d) => ({ ...d, morning: { ...d.morning, moved: v } }))
              }
            />
          </div>
          <div>
            <div className="text-sm mb-2">One win for today</div>
            <input
              className="field"
              value={draft.morning.win}
              onChange={(e) =>
                setDraft((d) => ({ ...d, morning: { ...d.morning, win: e.target.value } }))
              }
              placeholder="The single thing that would make today good."
            />
          </div>
        </div>
      </section>

      <section className="card mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="label">Midday</div>
            <div className="text-xs text-muted">The work that mattered</div>
          </div>
          <span className="text-xl">⏱</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm mb-2">Deep work completed?</div>
            <YesNo
              value={draft.midday.deepWork}
              onChange={(v) =>
                setDraft((d) => ({ ...d, midday: { ...d.midday, deepWork: v } }))
              }
            />
          </div>
          <div>
            <div className="text-sm mb-2">Main outcome</div>
            <input
              className="field"
              value={draft.midday.outcome}
              onChange={(e) =>
                setDraft((d) => ({ ...d, midday: { ...d.midday, outcome: e.target.value } }))
              }
              placeholder="Shipped X. Decided Y. Drafted Z."
            />
          </div>
        </div>
      </section>

      <section className="card mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="label">Evening</div>
            <div className="text-xs text-muted">Close the day cleanly</div>
          </div>
          <span className="text-xl">☾</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm mb-2">Did I fully disconnect from work?</div>
            <YesNo
              value={draft.evening.disconnected}
              onChange={(v) =>
                setDraft((d) => ({ ...d, evening: { ...d.evening, disconnected: v } }))
              }
            />
          </div>
          <div>
            <div className="text-sm mb-2">
              Energy level{" "}
              <span className="text-muted">
                {draft.evening.energy != null ? `· ${draft.evening.energy}/10` : ""}
              </span>
            </div>
            <input
              type="range"
              className="score w-full"
              min={1}
              max={10}
              value={draft.evening.energy ?? 5}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  evening: { ...d.evening, energy: parseInt(e.target.value, 10) },
                }))
              }
            />
          </div>
        </div>
      </section>

      <section className="card mb-6">
        <div className="label mb-2">Notes (optional)</div>
        <textarea
          className="field min-h-[90px]"
          value={draft.notes}
          onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
          placeholder="Anything else worth remembering."
        />
      </section>

      <div className="flex items-center justify-between mb-10">
        <div className="text-xs text-muted">
          {existing
            ? `Saved ${new Date(existing.updatedAt).toLocaleTimeString()}`
            : "Not saved yet"}
        </div>
        <button onClick={save} className="btn-primary">
          {existing ? "Update day" : "Save day"}
        </button>
      </div>

      <section className="card">
        <div className="label mb-3">Last 7 days</div>
        <div className="grid grid-cols-7 gap-2">
          {recent.map((r) => (
            <button
              key={r.date}
              onClick={() => setDate(r.date)}
              className={
                "rounded-xl border p-2 text-center transition " +
                (r.date === date
                  ? "border-ink bg-canvas"
                  : "border-line hover:border-ink/30")
              }
            >
              <div className="text-[11px] text-muted">{formatShort(r.date)}</div>
              <div className="font-serif text-lg">{r.score}/4</div>
              <div className="text-[10px] text-muted">
                {r.energy != null ? `E ${r.energy}` : "–"}
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
