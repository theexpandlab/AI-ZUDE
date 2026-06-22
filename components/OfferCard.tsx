import type { Offer } from "@/lib/types";

/** Renders one offer as a blueprint spec sheet (PRD §6.5). */
export default function OfferCard({ offer }: { offer: Offer }) {
  const rows: { k: string; v: string }[] = [
    { k: "Format", v: offer.format },
    { k: "Who it's for", v: offer.whoFor },
    { k: "Transformation", v: offer.transformation },
    { k: "Investment", v: offer.priceBand },
    { k: "Why this fits your vision", v: offer.whyItFits },
  ];

  return (
    <article className="sheet p-6 sm:p-7">
      <div className="flex items-baseline justify-between gap-3 border-b border-lineSoft pb-4">
        <span className="label">{offer.label}</span>
        <span className="font-mono text-[11px] text-muted">{offer.priceBand}</span>
      </div>
      <h3 className="heading mt-4 text-xl sm:text-2xl">{offer.name}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-inkSoft">{offer.oneLiner}</p>

      <dl className="mt-5 divide-y divide-lineSoft">
        {rows.map((r) => (
          <div key={r.k} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[150px_1fr] sm:gap-4">
            <dt className="label-muted pt-0.5">{r.k}</dt>
            <dd className="text-[15px] leading-relaxed text-ink">{r.v}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
