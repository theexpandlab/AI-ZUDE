"use client";

export default function YesNo({
  value,
  onChange,
  size = "md",
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
  size?: "sm" | "md";
}) {
  const cls = size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm";
  const base = "rounded-full border transition";
  return (
    <div className="inline-flex gap-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`${base} ${cls} ${
          value === true
            ? "bg-ink text-canvas border-ink"
            : "bg-surface text-ink border-line hover:border-ink/30"
        }`}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`${base} ${cls} ${
          value === false
            ? "bg-ink text-canvas border-ink"
            : "bg-surface text-ink border-line hover:border-ink/30"
        }`}
      >
        No
      </button>
    </div>
  );
}
