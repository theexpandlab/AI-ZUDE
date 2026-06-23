"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SubmissionRow } from "@/lib/types";
import { visionLabel, shapeLabel, stageLabel, phases } from "@/lib/quiz-content";
import { getBrowserClient } from "@/lib/supabase/client";
import BrandMark from "./BrandMark";

const stageOptions =
  (phases.find((p) => p.key === "shape")?.input as any)?.groups?.find(
    (g: any) => g.key === "stage",
  )?.options ?? [];

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AdminDashboard({
  rows,
  email,
  dbConfigured,
}: {
  rows: SubmissionRow[];
  email: string;
  dbConfigured: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (q) {
        const hay = `${r.first_name} ${r.last_name} ${r.email} ${r.answer_expertise} ${r.answer_audience}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (stage && r.answer_stage !== stage) return false;
      if (from && r.created_at < from) return false;
      if (to && r.created_at > `${to}T23:59:59`) return false;
      return true;
    });
  }, [rows, query, stage, from, to]);

  async function signOut() {
    const supabase = getBrowserClient();
    if (supabase) await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <BrandMark className="mb-2" />
          <h1 className="heading text-2xl">Offer Blueprint — Leads</h1>
          <p className="mt-1 text-sm text-muted">
            {rows.length} total · {filtered.length} shown
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a className="btn-ghost" href="/api/admin/export">
            Export CSV
          </a>
          <button className="btn-ghost" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      {!dbConfigured && (
        <p className="mb-6 rounded-sheet border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          The database service-role key isn&apos;t set, so no submissions can be read. See SETUP.md.
        </p>
      )}

      {/* Filters */}
      <div className="sheet mb-6 grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="label-muted mb-1.5 block">Search</span>
          <input
            className="field"
            placeholder="Name, email, expertise…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="label-muted mb-1.5 block">Stage</span>
          <select className="field" value={stage} onChange={(e) => setStage(e.target.value)}>
            <option value="">All stages</option>
            {stageOptions.map((o: { id: string; label: string }) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label-muted mb-1.5 block">From</span>
          <input className="field" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="block">
          <span className="label-muted mb-1.5 block">To</span>
          <input className="field" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>

      {/* Table */}
      <div className="sheet overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="label-muted px-4 py-3 font-normal">When</th>
              <th className="label-muted px-4 py-3 font-normal">Name</th>
              <th className="label-muted px-4 py-3 font-normal">Email</th>
              <th className="label-muted px-4 py-3 font-normal">Stage</th>
              <th className="label-muted px-4 py-3 font-normal">Email</th>
              <th className="label-muted px-4 py-3 font-normal">CRM</th>
              <th className="label-muted px-4 py-3 font-normal">Booked</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  No submissions match your filters.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <RowItem key={r.id} r={r} open={openId === r.id} onToggle={() => setOpenId(openId === r.id ? null : r.id)} />
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function StatusDot({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span className={`h-2 w-2 rounded-full ${ok ? "bg-emerald-500" : "bg-line"}`} />
      <span className={ok ? "text-ink" : "text-muted"}>{label}</span>
    </span>
  );
}

function RowItem({ r, open, onToggle }: { r: SubmissionRow; open: boolean; onToggle: () => void }) {
  return (
    <>
      <tr
        className="cursor-pointer border-b border-lineSoft transition hover:bg-blueprintWash/40"
        onClick={onToggle}
      >
        <td className="px-4 py-3 align-top text-muted">{fmtDate(r.created_at)}</td>
        <td className="px-4 py-3 align-top font-medium">
          {r.first_name} {r.last_name}
        </td>
        <td className="px-4 py-3 align-top">{r.email}</td>
        <td className="px-4 py-3 align-top">{stageLabel(r.answer_stage)}</td>
        <td className="px-4 py-3 align-top">
          <span
            className={
              r.email_status === "sent"
                ? "text-emerald-700"
                : r.email_status === "failed"
                  ? "text-rose-700"
                  : "text-muted"
            }
          >
            {r.email_status}
          </span>
        </td>
        <td className="px-4 py-3 align-top">
          <StatusDot ok={r.synced_to_crm} label={r.synced_to_crm ? "synced" : "—"} />
        </td>
        <td className="px-4 py-3 align-top">
          <StatusDot ok={r.booked_call} label={r.booked_call ? "booked" : "—"} />
        </td>
      </tr>
      {open && (
        <tr className="border-b border-line bg-paperDeep/40">
          <td colSpan={7} className="px-4 py-5">
            <Detail r={r} />
          </td>
        </tr>
      )}
    </>
  );
}

function Detail({ r }: { r: SubmissionRow }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        <p className="label">Discovery answers</p>
        <Field k="Expertise" v={r.answer_expertise} />
        <Field k="Audience" v={r.answer_audience} />
        <Field k="Transformation" v={r.answer_transformation} />
        <Field k="Vision" v={(r.answer_vision ?? []).map(visionLabel).join(" · ")} />
        <Field k="Shape" v={shapeLabel(r.answer_shape)} />
        <Field k="Stage" v={stageLabel(r.answer_stage)} />
        <Field k="Phone" v={r.phone ?? "—"} />
        <Field
          k="Consent"
          v={r.consent ? `Yes${r.consent_at ? ` · ${fmtDate(r.consent_at)}` : ""}` : "No"}
        />
        <Field k="Source" v={r.source ?? "—"} />
      </div>
      <div className="space-y-3">
        <p className="label">Generated offers</p>
        {r.generated_offers?.readingYourBlueprint && (
          <p className="text-sm italic leading-relaxed text-inkSoft">
            {r.generated_offers.readingYourBlueprint}
          </p>
        )}
        {(r.generated_offers?.offers ?? []).map((o) => (
          <div key={o.label} className="rounded-sheet border border-line bg-card p-4">
            <div className="flex items-baseline justify-between">
              <span className="label">{o.label}</span>
              <span className="font-mono text-[11px] text-muted">{o.priceBand}</span>
            </div>
            <p className="mt-1 font-semibold">{o.name}</p>
            <p className="text-sm font-medium text-blueprintDeep">{o.promise}</p>
            <p className="mt-2 text-xs text-muted">{o.theShape}</p>
          </div>
        ))}
        {r.generated_offers?.source === "fallback" && (
          <p className="label-muted">Generated via rules-based fallback</p>
        )}
      </div>
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="label-muted">{k}</p>
      <p className="text-sm leading-relaxed text-ink">{v || "—"}</p>
    </div>
  );
}
