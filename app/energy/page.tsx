"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useLocal, STORAGE_KEYS } from "@/lib/storage";
import type { EnergyEntry, EnergyKind, EnergyTag } from "@/lib/types";
import { uid } from "@/lib/id";

const tagColor: Record<EnergyTag, string> = {
  energizing: "#6F8B6E",
  neutral: "#7B7E8A",
  draining: "#C97A7A",
};

export default function EnergyPage() {
  const [entries, setEntries] = useLocal<EnergyEntry[]>(STORAGE_KEYS.energy, []);
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState<EnergyKind>("activity");
  const [tag, setTag] = useState<EnergyTag>("energizing");
  const [note, setNote] = useState("");

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    const next: EnergyEntry = {
      id: uid(),
      label: label.trim(),
      kind,
      tag,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [next, ...prev]);
    setLabel("");
    setNote("");
  }

  function remove(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const summary = useMemo(() => {
    const counts: Record<string, { energizing: number; neutral: number; draining: number }> = {};
    for (const e of entries) {
      counts[e.label] ??= { energizing: 0, neutral: 0, draining: 0 };
      counts[e.label][e.tag]++;
    }
    const items = Object.entries(counts).map(([k, v]) => ({
      label: k,
      score: v.energizing - v.draining,
      ...v,
    }));
    return {
      top: [...items].filter((i) => i.score > 0).sort((a, b) => b.score - a.score).slice(0, 5),
      drains: [...items].filter((i) => i.score < 0).sort((a, b) => a.score - b.score).slice(0, 5),
    };
  }, [entries]);

  const counts = useMemo(() => {
    const c = { energizing: 0, neutral: 0, draining: 0 };
    for (const e of entries) c[e.tag]++;
    return c;
  }, [entries]);

  return (
    <div>
      <PageHeader
        eyebrow="Energy management"
        title="What lifts you. What drains you."
        subtitle="Tag activities, people, and tasks. Reduce the drains, increase the lifts."
      />

      <section className="card mb-6">
        <div className="label mb-3">Log a moment</div>
        <form onSubmit={add} className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-2">
          <input
            className="field"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="What was it? (a person, activity, or task)"
          />
          <select
            className="field sm:w-32"
            value={kind}
            onChange={(e) => setKind(e.target.value as EnergyKind)}
          >
            <option value="activity">Activity</option>
            <option value="person">Person</option>
            <option value="task">Task</option>
          </select>
          <div className="inline-flex bg-canvas border border-line rounded-full p-1">
            {(["energizing", "neutral", "draining"] as EnergyTag[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={
                  "px-3 py-1 rounded-full text-xs capitalize transition " +
                  (tag === t ? "bg-ink text-canvas" : "text-ink hover:bg-surface")
                }
              >
                {t}
              </button>
            ))}
          </div>
          <button className="btn-primary" type="submit">
            Log
          </button>
        </form>
        <input
          className="field mt-2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note"
        />
      </section>

      <section className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="card-tight">
          <div className="label">Energizing</div>
          <div className="font-serif text-3xl text-sage tabular-nums">{counts.energizing}</div>
        </div>
        <div className="card-tight">
          <div className="label">Neutral</div>
          <div className="font-serif text-3xl text-muted tabular-nums">{counts.neutral}</div>
        </div>
        <div className="card-tight">
          <div className="label">Draining</div>
          <div className="font-serif text-3xl text-rose tabular-nums">{counts.draining}</div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="label mb-3">Top energy sources</div>
          {summary.top.length === 0 ? (
            <div className="text-sm text-muted">Log a few entries to see patterns.</div>
          ) : (
            <ul className="space-y-2">
              {summary.top.map((it) => (
                <li
                  key={it.label}
                  className="flex items-center justify-between border border-line rounded-xl p-3"
                >
                  <span className="text-sm truncate pr-3">{it.label}</span>
                  <span className="text-sm text-sage tabular-nums">+{it.score}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card">
          <div className="label mb-3">Top drains</div>
          {summary.drains.length === 0 ? (
            <div className="text-sm text-muted">Nothing draining tracked.</div>
          ) : (
            <ul className="space-y-2">
              {summary.drains.map((it) => (
                <li
                  key={it.label}
                  className="flex items-center justify-between border border-line rounded-xl p-3"
                >
                  <span className="text-sm truncate pr-3">{it.label}</span>
                  <span className="text-sm text-rose tabular-nums">{it.score}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="card">
        <div className="label mb-3">Recent entries</div>
        {entries.length === 0 ? (
          <div className="text-sm text-muted">Nothing logged yet.</div>
        ) : (
          <ul className="space-y-2">
            {entries.slice(0, 30).map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-3 border border-line rounded-xl p-3"
              >
                <span
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tagColor[e.tag] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-ink truncate">{e.label}</div>
                  <div className="text-xs text-muted truncate">
                    <span className="capitalize">{e.kind}</span> ·{" "}
                    <span className="capitalize">{e.tag}</span>
                    {e.note ? ` · ${e.note}` : ""}
                  </div>
                </div>
                <span className="text-[11px] text-muted">
                  {new Date(e.createdAt).toLocaleDateString()}
                </span>
                <button
                  className="text-xs text-muted hover:text-ink"
                  onClick={() => remove(e.id)}
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
