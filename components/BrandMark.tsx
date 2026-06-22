export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="inline-block h-2 w-2 rounded-[2px] bg-blueprint" aria-hidden />
      <span className="label-muted">The Expand Lab</span>
    </div>
  );
}
