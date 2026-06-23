import type { Offer } from "@/lib/types";

/** Renders one enriched offer as a blueprint spec sheet (PRD §6.5). */
export default function OfferCard({ offer }: { offer: Offer }) {
  const rows: { k: string; v: string }[] = [
    { k: "The shape", v: offer.theShape },
    { k: "Why this fits you", v: offer.whyThisFitsYou },
    { k: "Market truth", v: offer.marketTruth },
    { k: "Investment", v: offer.priceBand },
  ];

  return (
    <article className="sheet p-6 sm:p-7">
      <div className="flex items-baseline justify-between gap-3 border-b border-lineSoft pb-4">
        <span className="label">{offer.label}</span>
      </div>

      <h3 className="heading mt-4 text-xl sm:text-2xl">{offer.name}</h3>
      <p className="mt-2 text-[15px] font-medium leading-relaxed text-blueprintDeep">
        {offer.promise}
      </p>

      <dl className="mt-5 divide-y divide-lineSoft">
        {rows.map((r) => (
          <div key={r.k} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[150px_1fr] sm:gap-4">
            <dt className="label-muted pt-0.5">{r.k}</dt>
            <dd className="text-[15px] leading-relaxed text-ink">{r.v}</dd>
          </div>
        ))}
      </dl>

      {offer.yourFirstMoves.length > 0 && (
        <div className="mt-5 rounded-sheet bg-blueprintWash/60 p-5">
          <p className="label">Your first moves</p>
          <ol className="mt-3 space-y-2.5">
            {offer.yourFirstMoves.map((move, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink">
                <span className="font-mono text-xs text-blueprintDeep pt-1">{i + 1}</span>
                <span>{move}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}
