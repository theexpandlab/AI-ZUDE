"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import ScoreSlider from "@/components/ScoreSlider";
import TrendChart from "@/components/TrendChart";
import { useLocal, STORAGE_KEYS } from "@/lib/storage";
import { PILLARS, type Pillar, type WeeklyAudit } from "@/lib/types";
import { lastNWeekStarts, weekStartISO, weekRangeLabel, formatShort } from "@/lib/date";

const empty = (weekStart: string): WeeklyAudit => ({
  weekStart,
  scores: { health: 7, business: 7, relationships: 7, energy: 7, fun: 7 },
  reflections: { energized: "", drained: "", aligned: "", forced: "" },
  decisions: { doubleDown: "", fixOrRemove: "", experiment: "" },
  updatedAt: new Date().toISOString(),
});

export default function WeeklyPage() {
  const [audits, setAudits] = useLocal<WeeklyAudit[]>(STORAGE_KEYS.weeklyAudits, []);
  const wk = weekStartISO();
  const existing = audits.find((a) => a.weekStart === wk);
  const [draft, setDraft] = useState<WeeklyAudit>(() => existing ?? empty(wk));
  const [savedAt, setSavedAt] = useState<string | null>(existing?.updatedAt ?? null);

  useEffect(() => {
    if (existing) setDraft(existing);
  }, [existing]);

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

  function save() {
    const next: WeeklyAudit = { ...draft, updatedAt: new Date().toISOString() };
    setAudits((prev) => {
      const others = prev.filter((a) => a.weekStart !== next.weekStart);
      return [...others, next];
    });
    setSavedAt(next.updatedAt);
  }

  function setScore(key: Pillar, v: number) {
    setDraft((d) => ({ ...d, scores: { ...d.scores, [key]: v } }));
  }

  const avg = useMemo(() => {
    const xs = Object.values(draft.scores);
    const a = xs.reduce((s, n) => s + n, 0) / xs.length;
    return Math.round(a * 10) / 10;
  }, [draft.scores]);

  return (
    <div>
      <PageHeader
        eyebrow={`CEO Life Audit · ${weekRangeLabel(wk)}`}
        title="How was the week, honestly?"
        subtitle="Take 10 minutes. Score, reflect, and pick three small decisions."
        right={
          <div className="text-right">
            <div className="font-serif text-3xl tabular-nums">{avg}</div>
            <div className="label">Avg this week</div>
          </div>
        }
      />

      <section className="card mb-6">
        <div className="label mb-4">Pillar scores</div>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
          {PILLARS.map((p) => (
            <ScoreSlider
              key={p.key}
              label={p.label}
              hint={p.hint}
              color={p.color}
              value={draft.scores[p.key]}
              onChange={(v) => setScore(p.key, v)}
            />
          ))}
        </div>
      </section>

      <section className="card mb-6">
        <div className="label mb-4">Reflections</div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="What gave me energy this week?"
            value={draft.reflections.energized}
            onChange={(v) =>
              setDraft((d) => ({ ...d, reflections: { ...d.reflections, energized: v } }))
            }
          />
          <Field
            label="What drained me?"
            value={draft.reflections.drained}
            onChange={(v) =>
              setDraft((d) => ({ ...d, reflections: { ...d.reflections, drained: v } }))
            }
          />
          <Field
            label="What felt aligned?"
            value={draft.reflections.aligned}
            onChange={(v) =>
              setDraft((d) => ({ ...d, reflections: { ...d.reflections, aligned: v } }))
            }
          />
          <Field
            label="What felt forced?"
            value={draft.reflections.forced}
            onChange={(v) =>
              setDraft((d) => ({ ...d, reflections: { ...d.reflections, forced: v } }))
            }
          />
        </div>
      </section>

      <section className="card mb-6">
        <div className="label mb-1">Three decisions</div>
        <div className="text-xs text-muted mb-4">Limit to one of each.</div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field
            label="One thing to double down on"
            value={draft.decisions.doubleDown}
            onChange={(v) =>
              setDraft((d) => ({ ...d, decisions: { ...d.decisions, doubleDown: v } }))
            }
          />
          <Field
            label="One thing to fix or remove"
            value={draft.decisions.fixOrRemove}
            onChange={(v) =>
              setDraft((d) => ({ ...d, decisions: { ...d.decisions, fixOrRemove: v } }))
            }
          />
          <Field
            label="One thing to experiment with"
            value={draft.decisions.experiment}
            onChange={(v) =>
              setDraft((d) => ({ ...d, decisions: { ...d.decisions, experiment: v } }))
            }
          />
        </div>
      </section>

      <div className="flex items-center justify-between mb-10">
        <div className="text-xs text-muted">
          {savedAt ? `Saved ${new Date(savedAt).toLocaleString()}` : "Not saved yet"}
        </div>
        <button onClick={save} className="btn-primary">
          {existing ? "Update audit" : "Save audit"}
        </button>
      </div>

      <section className="card">
        <div className="label mb-3">Pillar trends · last 8 weeks</div>
        <TrendChart
          data={trend}
          dataKeys={PILLARS.map((p) => ({ key: p.key, color: p.color, label: p.label }))}
        />
        <div className="flex flex-wrap gap-3 mt-3">
          {PILLARS.map((p) => (
            <div key={p.key} className="flex items-center gap-2 text-xs text-muted">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
              {p.label}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="text-sm text-ink mb-1.5">{label}</div>
      <textarea
        className="field min-h-[80px] resize-y"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="A sentence is enough."
      />
    </label>
  );
}
