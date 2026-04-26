"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import YesNo from "@/components/YesNo";
import { useLocal, STORAGE_KEYS } from "@/lib/storage";
import type { RelationshipEntry } from "@/lib/types";
import { uid } from "@/lib/id";

function isAligned(e: { matchEnergy: boolean; alignValues: boolean; feelsLighter: boolean }) {
  const score = (e.matchEnergy ? 1 : 0) + (e.alignValues ? 1 : 0) + (e.feelsLighter ? 1 : 0);
  return score >= 2;
}

const blank = {
  name: "",
  context: "",
  matchEnergy: null as boolean | null,
  alignValues: null as boolean | null,
  feelsLighter: null as boolean | null,
  notes: "",
};

export default function RelationshipsPage() {
  const [entries, setEntries] = useLocal<RelationshipEntry[]>(STORAGE_KEYS.relationships, []);
  const [draft, setDraft] = useState(blank);

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name.trim() || draft.matchEnergy == null || draft.alignValues == null || draft.feelsLighter == null) return;
    const next: RelationshipEntry = {
      id: uid(),
      name: draft.name.trim(),
      context: draft.context.trim(),
      matchEnergy: draft.matchEnergy,
      alignValues: draft.alignValues,
      feelsLighter: draft.feelsLighter,
      notes: draft.notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [next, ...prev]);
    setDraft(blank);
  }

  function remove(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const summary = useMemo(() => {
    let aligned = 0;
    let notAligned = 0;
    for (const e of entries) {
      if (isAligned(e)) aligned++;
      else notAligned++;
    }
    return { aligned, notAligned, total: entries.length };
  }, [entries]);

  const draftAligned =
    draft.matchEnergy != null && draft.alignValues != null && draft.feelsLighter != null
      ? isAligned({
          matchEnergy: draft.matchEnergy!,
          alignValues: draft.alignValues!,
          feelsLighter: draft.feelsLighter!,
        })
      : null;

  return (
    <div>
      <PageHeader
        eyebrow="Relationship alignment"
        title="A simple filter for the people you let close."
        subtitle="Three honest questions. Aligned or not aligned. Trust the pattern over time."
      />

      <section className="card mb-6">
        <div className="label mb-4">New entry</div>
        <form onSubmit={add} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              className="field"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Name or initials"
            />
            <input
              className="field"
              value={draft.context}
              onChange={(e) => setDraft({ ...draft, context: e.target.value })}
              placeholder="Context (date, friend, family, met at…)"
            />
          </div>

          <Question
            label="Do they match my energy?"
            value={draft.matchEnergy}
            onChange={(v) => setDraft({ ...draft, matchEnergy: v })}
          />
          <Question
            label="Do they align with my values?"
            value={draft.alignValues}
            onChange={(v) => setDraft({ ...draft, alignValues: v })}
          />
          <Question
            label="Do they make my life feel lighter?"
            value={draft.feelsLighter}
            onChange={(v) => setDraft({ ...draft, feelsLighter: v })}
          />

          <textarea
            className="field min-h-[60px]"
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            placeholder="Notes (optional)"
          />

          <div className="flex items-center justify-between">
            <div>
              {draftAligned == null ? (
                <span className="text-xs text-muted">Answer all three to see the read.</span>
              ) : draftAligned ? (
                <span className="pill bg-sage/10 border-sage/30 text-sage">Aligned</span>
              ) : (
                <span className="pill bg-rose/10 border-rose/30 text-rose">Not aligned</span>
              )}
            </div>
            <button className="btn-primary" type="submit">
              Save entry
            </button>
          </div>
        </form>
      </section>

      <section className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="card-tight">
          <div className="label">Total entries</div>
          <div className="font-serif text-3xl tabular-nums">{summary.total}</div>
        </div>
        <div className="card-tight">
          <div className="label">Aligned</div>
          <div className="font-serif text-3xl text-sage tabular-nums">{summary.aligned}</div>
        </div>
        <div className="card-tight">
          <div className="label">Not aligned</div>
          <div className="font-serif text-3xl text-rose tabular-nums">{summary.notAligned}</div>
        </div>
      </section>

      <section className="card">
        <div className="label mb-3">Entries</div>
        {entries.length === 0 ? (
          <div className="text-sm text-muted">No entries yet.</div>
        ) : (
          <ul className="space-y-2">
            {entries.map((e) => {
              const aligned = isAligned(e);
              return (
                <li
                  key={e.id}
                  className="flex items-start gap-3 border border-line rounded-xl p-3"
                >
                  <span
                    className={
                      "mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 " +
                      (aligned ? "bg-sage" : "bg-rose")
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-ink truncate">{e.name}</div>
                      <span
                        className={
                          "pill text-[10px] " +
                          (aligned
                            ? "bg-sage/10 border-sage/30 text-sage"
                            : "bg-rose/10 border-rose/30 text-rose")
                        }
                      >
                        {aligned ? "Aligned" : "Not aligned"}
                      </span>
                    </div>
                    {(e.context || e.notes) && (
                      <div className="text-xs text-muted truncate">
                        {e.context}
                        {e.context && e.notes ? " · " : ""}
                        {e.notes}
                      </div>
                    )}
                    <div className="text-[11px] text-muted mt-1 flex flex-wrap gap-2">
                      <span>energy: {e.matchEnergy ? "yes" : "no"}</span>
                      <span>values: {e.alignValues ? "yes" : "no"}</span>
                      <span>lighter: {e.feelsLighter ? "yes" : "no"}</span>
                    </div>
                  </div>
                  <button
                    className="text-xs text-muted hover:text-ink"
                    onClick={() => remove(e.id)}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function Question({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm">{label}</div>
      <YesNo value={value} onChange={onChange} size="sm" />
    </div>
  );
}
