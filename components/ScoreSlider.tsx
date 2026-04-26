"use client";

export default function ScoreSlider({
  label,
  hint,
  color,
  value,
  onChange,
  min = 1,
  max = 10,
}: {
  label: string;
  hint?: string;
  color?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <div className="text-sm font-medium text-ink">{label}</div>
          {hint && <div className="text-xs text-muted">{hint}</div>}
        </div>
        <div className="font-serif text-2xl tabular-nums" style={{ color }}>
          {value}
        </div>
      </div>
      <input
        type="range"
        className="score w-full"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
      <div className="flex justify-between text-[10px] text-muted mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
