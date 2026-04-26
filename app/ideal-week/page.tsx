"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useLocal, STORAGE_KEYS } from "@/lib/storage";
import { DAY_TYPES, WEEKDAYS, type DayType, type IdealWeek } from "@/lib/types";

const defaults: IdealWeek = WEEKDAYS.reduce((acc, d) => {
  acc[d.key] = { type: d.defaultType, intentions: [] };
  return acc;
}, {} as IdealWeek);

export default function IdealWeekPage() {
  const [week, setWeek] = useLocal<IdealWeek>(STORAGE_KEYS.idealWeek, defaults);
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  function setType(day: number, type: DayType) {
    setWeek({
      ...week,
      [day]: { type, intentions: week[day]?.intentions ?? [] },
    });
  }

  function addIntention(day: number) {
    const text = (drafts[day] ?? "").trim();
    if (!text) return;
    setWeek({
      ...week,
      [day]: {
        ...week[day],
        intentions: [...(week[day]?.intentions ?? []), text],
      },
    });
    setDrafts((d) => ({ ...d, [day]: "" }));
  }

  function removeIntention(day: number, idx: number) {
    setWeek({
      ...week,
      [day]: {
        ...week[day],
        intentions: (week[day]?.intentions ?? []).filter((_, i) => i !== idx),
      },
    });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Ideal week"
        title="Shape the rhythm of your week"
        subtitle="Group days by purpose. Assign intentions to each day type."
      />

      <section className="card mb-6">
        <div className="label mb-3">Day-type legend</div>
        <div className="grid sm:grid-cols-4 gap-3">
          {(Object.entries(DAY_TYPES) as [DayType, typeof DAY_TYPES[DayType]][]).map(
            ([key, meta]) => (
              <div key={key} className="border border-line rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} />
                  <div className="text-sm">{meta.label}</div>
                </div>
                <div className="text-xs text-muted mt-1">{meta.description}</div>
              </div>
            )
          )}
        </div>
      </section>

      <section className="grid md:grid-cols-7 gap-3 mb-6">
        {WEEKDAYS.map((d) => {
          const day = week[d.key] ?? { type: d.defaultType, intentions: [] };
          const meta = DAY_TYPES[day.type];
          return (
            <div
              key={d.key}
              className="card-tight flex flex-col"
              style={{
                borderTop: `3px solid ${meta.color}`,
                borderTopLeftRadius: "1.25rem",
                borderTopRightRadius: "1.25rem",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-serif text-lg">{d.short}</div>
                <select
                  className="text-[11px] bg-transparent border border-line rounded-full px-2 py-0.5"
                  value={day.type}
                  onChange={(e) => setType(d.key, e.target.value as DayType)}
                  aria-label={`Type for ${d.full}`}
                >
                  {(Object.keys(DAY_TYPES) as DayType[]).map((t) => (
                    <option key={t} value={t}>
                      {DAY_TYPES[t].label.split(" / ")[0]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-[11px] text-muted mb-2">{meta.label}</div>

              <ul className="space-y-1.5 mb-2">
                {(day.intentions ?? []).map((it, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm rounded-lg border border-line p-2"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: meta.color }}
                    />
                    <span className="flex-1 break-words">{it}</span>
                    <button
                      className="text-[10px] text-muted hover:text-ink"
                      onClick={() => removeIntention(d.key, idx)}
                      aria-label="Remove intention"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>

              <input
                className="field text-xs"
                value={drafts[d.key] ?? ""}
                onChange={(e) => setDrafts((s) => ({ ...s, [d.key]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addIntention(d.key);
                  }
                }}
                placeholder="Add intention…"
              />
            </div>
          );
        })}
      </section>

      <section className="card">
        <div className="label mb-2">Shape suggestion</div>
        <p className="text-sm text-muted">
          A good default: <span className="text-ink">Mon–Wed</span> deep work / build,{" "}
          <span className="text-ink">Thu</span> creative & expansion,{" "}
          <span className="text-ink">Fri</span> admin & light work,{" "}
          <span className="text-ink">weekend</span> life, social & novelty. Adjust as your seasons change.
        </p>
      </section>
    </div>
  );
}
