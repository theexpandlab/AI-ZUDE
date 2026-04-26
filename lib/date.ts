export function toISODate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

// Returns Monday of the week containing `d` (local time).
export function weekStart(d: Date = new Date()): Date {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = date.getDay(); // 0=Sun..6=Sat
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  date.setDate(date.getDate() + diff);
  return date;
}

export function weekStartISO(d: Date = new Date()): string {
  return toISODate(weekStart(d));
}

export function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

export function lastNWeekStarts(n: number): string[] {
  const out: string[] = [];
  const start = weekStart();
  for (let i = n - 1; i >= 0; i--) {
    out.push(toISODate(addDays(start, -7 * i)));
  }
  return out;
}

export function lastNDays(n: number): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    out.push(toISODate(addDays(today, -i)));
  }
  return out;
}

export function formatShort(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function weekRangeLabel(weekStartISO: string): string {
  const [y, m, d] = weekStartISO.split("-").map(Number);
  const start = new Date(y, m - 1, d);
  const end = addDays(start, 6);
  const startStr = start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const endStr = end.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${startStr} – ${endStr}`;
}

export function quarterLabelFor(d: Date = new Date()): string {
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `Q${q} ${d.getFullYear()}`;
}

// Returns 1..12 (capped) and total weeks (12) for a 12-week quarter starting startISO.
export function weekOfQuarter(startISO: string): { current: number; total: number; remainingDays: number; endISO: string } {
  const [y, m, d] = startISO.split("-").map(Number);
  const start = new Date(y, m - 1, d);
  const today = new Date();
  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const current = Math.max(1, Math.min(12, Math.floor(diffDays / 7) + 1));
  const end = addDays(start, 12 * 7 - 1);
  const remainingDays = Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  return { current, total: 12, remainingDays, endISO: toISODate(end) };
}
