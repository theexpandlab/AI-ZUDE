"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import YesNo from "@/components/YesNo";
import { useLocal, STORAGE_KEYS } from "@/lib/storage";
import type { BusinessIdea } from "@/lib/types";
import { uid } from "@/lib/id";

function score(i: { realProblem: boolean; movesToSale: boolean; systemizable: boolean }) {
  return (i.realProblem ? 1 : 0) + (i.movesToSale ? 1 : 0) + (i.systemizable ? 1 : 0);
}

const blank = {
  title: "",
  realProblem: null as boolean | null,
  movesToSale: null as boolean | null,
  systemizable: null as boolean | null,
  notes: "",
};

export default function BusinessPage() {
  const [ideas, setIdeas] = useLocal<BusinessIdea[]>(STORAGE_KEYS.business, []);
  const [draft, setDraft] = useState(blank);

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (
      !draft.title.trim() ||
      draft.realProblem == null ||
      draft.movesToSale == null ||
      draft.systemizable == null
    )
      return;
    const next: BusinessIdea = {
      id: uid(),
      title: draft.title.trim(),
      realProblem: draft.realProblem,
      movesToSale: draft.movesToSale,
      systemizable: draft.systemizable,
      notes: draft.notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    setIdeas((prev) => [next, ...prev]);
    setDraft(blank);
  }

  function remove(id: string) {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  }

  const stats = useMemo(() => {
    let signal = 0;
    let noise = 0;
    for (const i of ideas) {
      if (score(i) >= 2) signal++;
      else noise++;
    }
    return { signal, noise, total: ideas.length };
  }, [ideas]);

  const draftScore =
    draft.realProblem != null && draft.movesToSale != null && draft.systemizable != null
      ? score({
          realProblem: draft.realProblem!,
          movesToSale: draft.movesToSale!,
          systemizable: draft.systemizable!,
        })
      : null;

  return (
    <div>
      <PageHeader
        eyebrow="Business focus filter"
        title="Signal vs. noise."
        subtitle="Three questions for any task or idea. If mostly &lsquo;no,&rsquo; flag it as likely noise."
      />

      <section className="card mb-6">
        <div className="label mb-4">New idea or task</div>
        <form onSubmit={add} className="space-y-4">
          <input
            className="field"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="What is the idea or task?"
          />
          <Question
            label="Does this solve a real problem?"
            value={draft.realProblem}
            onChange={(v) => setDraft({ ...draft, realProblem: v })}
          />
          <Question
            label="Does this move me toward a sale?"
            value={draft.movesToSale}
            onChange={(v) => setDraft({ ...draft, movesToSale: v })}
          />
          <Question
            label="Can this be systemized?"
            value={draft.systemizable}
            onChange={(v) => setDraft({ ...draft, systemizable: v })}
          />
          <textarea
            className="field min-h-[60px]"
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            placeholder="Notes (optional)"
          />
          <div className="flex items-center justify-between">
            <div>
              {draftScore == null ? (
                <span className="text-xs text-muted">Answer all three to see the read.</span>
              ) : draftScore >= 2 ? (
                <span className="pill bg-sage/10 border-sage/30 text-sage">Worth pursuing</span>
              ) : (
                <span className="pill bg-rose/10 border-rose/30 text-rose">Likely noise</span>
              )}
            </div>
            <button className="btn-primary" type="submit">
              Save idea
            </button>
          </div>
        </form>
      </section>

      <section className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="card-tight">
          <div className="label">Total ideas</div>
          <div className="font-serif text-3xl tabular-nums">{stats.total}</div>
        </div>
        <div className="card-tight">
          <div className="label">Signal</div>
          <div className="font-serif text-3xl text-sage tabular-nums">{stats.signal}</div>
        </div>
        <div className="card-tight">
          <div className="label">Noise</div>
          <div className="font-serif text-3xl text-rose tabular-nums">{stats.noise}</div>
        </div>
      </section>

      <section className="card">
        <div className="label mb-3">Entries</div>
        {ideas.length === 0 ? (
          <div className="text-sm text-muted">Nothing yet.</div>
        ) : (
          <ul className="space-y-2">
            {ideas.map((i) => {
              const s = score(i);
              const signal = s >= 2;
              return (
                <li
                  key={i.id}
                  className="flex items-start gap-3 border border-line rounded-xl p-3"
                >
                  <span
                    className={
                      "mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 " +
                      (signal ? "bg-sage" : "bg-rose")
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-ink truncate">{i.title}</div>
                      <span
                        className={
                          "pill text-[10px] " +
                          (signal
                            ? "bg-sage/10 border-sage/30 text-sage"
                            : "bg-rose/10 border-rose/30 text-rose")
                        }
                      >
                        {signal ? "Signal" : "Noise"}
                      </span>
                    </div>
                    {i.notes && <div className="text-xs text-muted truncate">{i.notes}</div>}
                    <div className="text-[11px] text-muted mt-1 flex flex-wrap gap-2">
                      <span>real problem: {i.realProblem ? "yes" : "no"}</span>
                      <span>moves to sale: {i.movesToSale ? "yes" : "no"}</span>
                      <span>systemizable: {i.systemizable ? "yes" : "no"}</span>
                    </div>
                  </div>
                  <button
                    className="text-xs text-muted hover:text-ink"
                    onClick={() => remove(i.id)}
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
