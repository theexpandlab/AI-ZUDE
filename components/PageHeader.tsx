export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="label mb-2">{eyebrow}</div>}
        <h1 className="h-display">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted mt-2 max-w-xl">{subtitle}</p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
